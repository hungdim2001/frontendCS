import { sentenceCase } from 'change-case';
import { useEffect, useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
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
} from '@mui/material';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// hooks
import useSettings from '../../hooks/useSettings';
// @types
import { UserManager } from '../../@types/user';
// _mock_
// import { _productCharList } from '../../_mock';
// components
import Page from '../../components/Page';
import Label from '../../components/Label';
import Iconify from '../../components/Iconify';
import Scrollbar from '../../components/Scrollbar';
import SearchNotFound from '../../components/SearchNotFound';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
// sections
import { ProductChar } from 'src/@types/product';
import ProductCharToolbar from 'src/sections/@dashboard/e-commerce/product-char/ProductCharToolbar';
import ProductCharListHead from 'src/sections/@dashboard/e-commerce/product-char/ProductCharListHead';
import { useDispatch, useSelector } from '../../redux/store';

import { deleteProductChars, getProductChars } from 'src/redux/slices/product-char';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'id', label: 'ID', alignRight: false },
  { id: 'name', label: 'Name', alignRight: false },
  { id: 'status', label: 'Status', alignRight: false },
  { id: 'description', label: 'Description', alignRight: false },
  { id: 'update' },
  { id: 'delete' },
];

// ----------------------------------------------------------------------

export default function ProductCharList() {
  const ICON = {
    mr: 2,
    width: 20,
    height: 20,
  };

  const theme = useTheme();

  const { themeStretch } = useSettings();

  const [productCharList, setProductCharList] = useState<ProductChar[]>([]);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [page, setPage] = useState(0);

  const [order, setOrder] = useState<'asc' | 'desc'>('asc');

  const [selected, setSelected] = useState<(number|null)[]>([]);

  const [orderBy, setOrderBy] = useState('name');

  const [filterName, setFilterName] = useState('');

  const [rowsPerPage, setRowsPerPage] = useState(5);
  const { productChars } = useSelector((state) => state.productChars);

  const handleRequestSort = (property: string) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  useEffect(() => {
    dispatch(getProductChars(null));
  }, [dispatch]);

  useEffect(() => {
    if (productChars.length) {
      setProductCharList(productChars);
    }
  }, [productChars]);

  const handleSelectAllClick = (checked: boolean) => {
    if (checked) {
      const newSelecteds = productCharList.map((n) => n.id);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (id:number|null) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected: (number|null)[] = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
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

  const handleDeleteProductChar = (id: number | null) => {
    if (id) {
      const ids = [id];
      dispatch(deleteProductChars(ids));
      const deleteProduct = productCharList.filter((product) => product.id !== id);
      setSelected([]);
      setProductCharList(deleteProduct);
    }
  };

  const handleEditProductChar = (id: number | null) => {
    if (id) {
      console.log(`${PATH_DASHBOARD.productChar.edit}/${id}`)
      navigate(`${PATH_DASHBOARD.productChar.edit}/${id}`, { replace: true });
    }
  };

  const handleDeleteProducts = (ids: (number | null)[]) => {
    const validIds = ids.filter(id => id !== null) as number[];
    
    if (validIds.length > 0) {
      dispatch(deleteProductChars(validIds));
      const deleteProducts = productCharList.filter((product) => !ids.includes(product.id));
      setSelected([]);
      setProductCharList(deleteProducts);
    }
  };
  
  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - productCharList.length) : 0;

  const filteredUsers = applySortFilter(productCharList, getComparator(order, orderBy), filterName);

  const isNotFound = !filteredUsers.length && Boolean(filterName);

  return (
    <Page title="Product characteristics">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="Product characteristics"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Product characteristics' },
          ]}
          action={
            <Button
              variant="contained"
              component={RouterLink}
              to={PATH_DASHBOARD.productChar.create}
              startIcon={<Iconify icon={'eva:plus-fill'} />}
            >
              Create
            </Button>
          }
        />
        {/* <ProductCharacteristicNewForm isEdit={false}/> */}

        <Card>
          <ProductCharToolbar
            numSelected={selected.length}
            filterName={filterName}
            onFilterName={handleFilterByName}
            onDeleteProducts={() => handleDeleteProducts(selected)}
          />

          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <ProductCharListHead
                  isCreateProduct= {false}
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={productCharList.length}
                  numSelected={selected.length}
                  onRequestSort={handleRequestSort}
                  onSelectAllClick={handleSelectAllClick}
                />
                <TableBody>
                  {filteredUsers
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row) => {
                      const { id, name, status, description } = row;
                      const isItemSelected = selected.indexOf(id) !== -1;

                      return (
                        <TableRow
                          hover
                          key={id}
                          tabIndex={-1}
                          role="checkbox"
                          selected={isItemSelected}
                          aria-checked={isItemSelected}
                        >
                          <TableCell padding="checkbox">
                            <Checkbox checked={isItemSelected} onClick={() => handleClick(id)} />
                          </TableCell>
                          <TableCell align="left">{id}</TableCell>
                          <TableCell align="left">{name}</TableCell>
                          <TableCell align="left">
                            <Label
                              variant={theme.palette.mode === 'light' ? 'ghost' : 'filled'}
                              color={(status === false && 'error') || 'success'}
                            >
                              {sentenceCase(status === true ? 'active' : 'inactive')}
                            </Label>
                          </TableCell>
                          <TableCell align="left">{description}</TableCell>

                          <TableCell align="center">
                            <Button
                              onClick={() => handleEditProductChar(id)}
                              startIcon={<Iconify icon={'eva:edit-fill'} sx={{ ...ICON }} />}
                            />
                          </TableCell>
                          <TableCell align="center">
                            <Button
                              sx={{ color: 'error.main' }}
                              onClick={() => handleDeleteProductChar(id)}
                              startIcon={<Iconify icon={'eva:trash-2-outline'} sx={{ ...ICON }} />}
                            />
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
            count={productCharList.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={(e, page) => setPage(page)}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Card>
      </Container>
    </Page>
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
  array: ProductChar[],
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
    return array.filter((_user) => _user.name.toLowerCase().indexOf(query.toLowerCase()) !== -1);
  }
  return stabilizedThis.map((el) => el[0]);
}
