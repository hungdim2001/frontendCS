import { sentenceCase } from 'change-case';
import { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
// @mui
import { useTheme } from '@mui/material/styles';
import {
  Card,
  Table,
  Avatar,
  Button,
  Checkbox,
  TableRow,
  TableBody,
  TableCell,
  Container,
  Typography,
  TableContainer,
  TablePagination,
  Box,
  MenuItem,
  IconButton,
} from '@mui/material';
// routes
import { PATH_DASHBOARD } from '../../../../routes/paths';
// hooks
import useSettings from '../../../../hooks/useSettings';
// @types
import { UserManager } from '../../../../@types/user';
// _mock_
// import { _productCharValueList } from '../../_mock';
// components
import Page from '../../../../components/Page';
import Label from '../../../../components/Label';
import Iconify from '../../../../components/Iconify';
import Scrollbar from '../../../../components/Scrollbar';
import SearchNotFound from '../../../../components/SearchNotFound';
import HeaderBreadcrumbs from '../../../../components/HeaderBreadcrumbs';
// sections
import { ProductChar, ProductCharValue } from 'src/@types/product';
import ProductCharToolbar from 'src/sections/@dashboard/e-commerce/product-char/ProductCharToolbar';
import ProductCharValueToolbar from './ProductCharValueToolbar';
import ProductCharValueHead from './ProductCharValueHead';
import MenuPopover from 'src/components/MenuPopover';
import ProductCharValueDialog from './ProductCharValueDialog';
import UserMoreMenu from '../../user/list/UserMoreMenu';
import ProductCharValueMoreMenu from './ProductCharValueMoreMenu';
import { boolean } from 'yup';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'id', label: 'ID', alignRight: false },
  { id: 'code', label: 'Code', alignRight: false },
  { id: 'value', label: 'Value', alignRight: false },
  { id: 'status', label: 'Status', alignRight: false },
  { id: 'Edit' },
  { id: 'Delete' },
];

// ----------------------------------------------------------------------

export default function ProductCharValueList() {
  const [openProper, setOpenProper] = useState<HTMLElement | null>(null);

  const handleOpenProper = (event: React.MouseEvent<HTMLElement>) => {
    console.log(productCharValue);
    setOpenProper(event.currentTarget);
  };

  const handleCloseProper = () => {
    setOpenProper(null);
  };

  const ICON = {
    mr: 2,
    width: 20,
    height: 20,
  };

  const theme = useTheme();

  const { themeStretch } = useSettings();

  const [productCharValueList, setproductCharValueList] = useState<ProductCharValue[]>([]);

  const [productCharValue, setproductCharValue] = useState<ProductCharValue>({
    code: '',
    id: null,
    value: '',
    status: true,
  });

  const [page, setPage] = useState(0);

  const [order, setOrder] = useState<'asc' | 'desc'>('asc');

  const [selected, setSelected] = useState<string[]>([]);

  const [orderBy, setOrderBy] = useState('name');

  const [filterName, setFilterName] = useState('');

  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [open, setOpen] = useState<boolean>(false);

  const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
    console.log('sdfsafds');
    setOpen(true);
    setEdit(false)
  };
  const handleClose = () => {
    console.log('3');

    setOpen(false);
  };

  const handleRequestSort = (property: string) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (checked: boolean) => {
    if (checked) {
      const newSelecteds = productCharValueList.map((n) => n.code);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (name: string) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected: string[] = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }
    setSelected(newSelected);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleFilterByName = (filterName: string) => {
    setFilterName(filterName);
    setPage(0);
  };

  const handleDeleteProductCharValue = (code: string) => {
    console.log('1');
    const deleteProduct = productCharValueList.filter((charValue) => charValue.code !== code);
    setSelected([]);
    setproductCharValueList(deleteProduct);
  };

  const handleDeleteProductsCharValues = (selected: string[]) => {
    console.log('2');

    const deleteProducts = productCharValueList.filter(
      (product) => !selected.includes(product.code)
    );
    setSelected([]);
    setproductCharValueList(deleteProducts);
  };
  const handleProductCharValueSubmit = (productCharValueCode: ProductCharValue) => {
    console.log('4');
    // Update the state in the parent component with the received data
    setproductCharValueList((prevList) => [...prevList, productCharValueCode]);
  };
  const [isEdit, setEdit] = useState<boolean>(false);
  const handleProductCharValueEdit = (productCharValueCode: string) => {
    const editCharValue = productCharValueList.filter((charValue) => charValue.code === productCharValueCode)[0];
    setproductCharValue(editCharValue);
    setEdit(true)
    setOpen(true);
  };

  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - productCharValueList.length) : 0;

  const filteredUsers = applySortFilter(
    productCharValueList,
    getComparator(order, orderBy),
    filterName
  );

  const isNotFound = !filteredUsers.length && Boolean(filterName);

  return (
    <>
      <Button
        sx={{ mt: 3 }}
        variant="contained"
        onClick={handleOpen}
        startIcon={<Iconify icon={'eva:plus-fill'} />}
      >
        Create value characteristic
      </Button>
      <ProductCharValueDialog
        isEdit={isEdit}
        productCharValue={productCharValue}
        productCharValues={productCharValueList}
        isOpenCompose={open}
        onCloseCompose={handleClose}
        onProductCharValueSubmit={handleProductCharValueSubmit}
      />

      <ProductCharValueToolbar
        numSelected={selected.length}
        filterName={filterName}
        onFilterName={handleFilterByName}
        onDeleteProducts={() => handleDeleteProductsCharValues(selected)}
      />
      <Scrollbar>
        <TableContainer sx={{ minWidth: 800 }}>
          <Table>
            <ProductCharValueHead
              order={order}
              orderBy={orderBy}
              headLabel={TABLE_HEAD}
              rowCount={productCharValueList.length}
              numSelected={selected.length}
              onRequestSort={handleRequestSort}
              onSelectAllClick={handleSelectAllClick}
            />
            <TableBody>
              {filteredUsers
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row) => {
                  const { id, code, value, status } = row;
                  const isItemSelected = selected.indexOf(code) !== -1;
                  // function handleDeleteProductCharValue(code: string|null) {
                  //   throw new Error('Function not implemented.');
                  // }

                  return (
                    <TableRow
                      hover
                      key={code}
                      tabIndex={-1}
                      role="checkbox"
                      selected={isItemSelected}
                      aria-checked={isItemSelected}
                    >
                      <TableCell padding="checkbox">
                        <Checkbox checked={isItemSelected} onClick={() => handleClick(code)} />
                      </TableCell>
                      <TableCell align="left">{id}</TableCell>
                      <TableCell align="left">{code}</TableCell>
                      <TableCell align="left">{value}</TableCell>
                      <TableCell align="left">
                        <Label
                          variant={theme.palette.mode === 'light' ? 'ghost' : 'filled'}
                          color={(status === false && 'error') || 'success'}
                        >
                          {sentenceCase(status === true ? 'active' : 'inactive')}
                        </Label>
                      </TableCell>
                      <TableCell align="center">
                        <Button
                          onClick={()=> handleProductCharValueEdit(code)}
                          startIcon={<Iconify icon={'eva:edit-fill'} sx={{ ...ICON }} />}
                        >
                        </Button>
                      </TableCell>
                      <TableCell align="center">
                        <Button sx={{ color: 'error.main' }}
                              onClick={() => handleDeleteProductCharValue(code)}
                          startIcon={<Iconify icon={'eva:trash-2-outline'} sx={{ ...ICON }} />}
                        >
                        </Button>
                      </TableCell>
                    
                    </TableRow>
                  );
                })}
              {emptyRows > 0 && (
                <TableRow style={{ height: 53 * emptyRows }}>
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
            {isNotFound && (
              <TableBody>
                <TableRow>
                  <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
                    <SearchNotFound searchQuery={filterName} />
                  </TableCell>
                </TableRow>
              </TableBody>
            )}
          </Table>
        </TableContainer>
      </Scrollbar>

      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={productCharValueList.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={(e, page) => setPage(page)}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </>
  );
}

// ----------------------------------------------------------------------

type Anonymous = Record<string | number, string>;

function descendingComparator(a: Anonymous, b: Anonymous, orderBy: string) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order: string, orderBy: string) {
  return order === 'desc'
    ? (a: Anonymous, b: Anonymous) => descendingComparator(a, b, orderBy)
    : (a: Anonymous, b: Anonymous) => -descendingComparator(a, b, orderBy);
}

function applySortFilter(
  array: ProductCharValue[],
  comparator: (a: any, b: any) => number,
  query: string
) {
  const stabilizedThis = array.map((el, index) => [el, index] as const);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  if (query) {
    return array.filter((_user) => _user.code.toLowerCase().indexOf(query.toLowerCase()) !== -1);
  }
  return stabilizedThis.map((el) => el[0]);
}
