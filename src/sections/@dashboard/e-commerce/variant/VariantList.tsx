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

import { deleteProductChars, getProductChars } from 'src/redux/slices/product-char';
import useSettings from 'src/hooks/useSettings';
import { ProductChar, Variant } from 'src/@types/product';
import { useDispatch, useSelector } from 'src/redux/store';
import { PATH_DASHBOARD } from 'src/routes/paths';
import Iconify from 'src/components/Iconify';
import HeaderBreadcrumbs from 'src/components/HeaderBreadcrumbs';
import ProductCharToolbar from '../product-char/ProductCharToolbar';
import Scrollbar from 'src/components/Scrollbar';
import Page from 'src/components/Page';
import Label from 'src/components/Label';
import SearchNotFound from 'src/components/SearchNotFound';
import VariantListHead from './VariantListHead';
import { UseFormSetValue } from 'react-hook-form';
import VariantListToolbar from './VariantListToolBar';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'id', label: 'ID', alignRight: false },
  { id: 'variant', label: 'Variant', alignRight: false },
  { id: 'quantity', label: 'Quantity', alignRight: false },
  { id: 'price', label: 'Price', alignRight: false },
  { id: 'update' },
];

// ----------------------------------------------------------------------
type Props = {
  productChars: ProductChar[];
  variants: Variant[];
  setValue: UseFormSetValue<any>;
};

export default function VariantList({ variants, productChars, setValue }: Props) {
  const ICON = {
    mr: 2,
    width: 20,
    height: 20,
  };

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [page, setPage] = useState(0);

  const [order, setOrder] = useState<'asc' | 'desc'>('asc');

  const [selected, setSelected] = useState<(number | null)[]>([]);

  const [orderBy, setOrderBy] = useState('name');

  const [filterName, setFilterName] = useState('');

  const [rowsPerPage, setRowsPerPage] = useState(5);
  // const { productChars } = useSelector((state) => state.productChars);

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
      for (const variant of variants) {
        const variantNames: string[] = [];
        variant.chars.forEach((item) => {
          const matchingProductChar = productChars.find((char) =>
            char.productSpecCharValueDTOS?.some((value) => value.id === item)
          );
          if (matchingProductChar) {
            const matchingValue = matchingProductChar.productSpecCharValueDTOS?.find(
              (value) => value.id === item
            );
            if (matchingValue) {
              variantNames.push(`${matchingProductChar.name}: ${matchingValue.value}`);
            }
          }
        });
        variant.name = variantNames.join(',');
      }
    }
  }, [productChars, variants]);

  const handleSelectAllClick = (checked: boolean) => {
    if (checked) {
      const newSelecteds = variants.map((n) => n.id);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (id: number | null) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected: (number | null)[] = [];
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

  const handleEditProductChar = (id: number | null) => {
    if (id) {
      navigate(`${PATH_DASHBOARD.productChar.edit}/${id}`, { replace: true });
    }
  };

  const handleDeleteProducts = (ids: (number | null)[]) => {
    const validIds = ids.filter((id) => id !== null) as number[];

    if (validIds.length > 0) {
      dispatch(deleteProductChars(validIds));
      const deleteProducts = variants.filter((product) => !ids.includes(product.id));
      setSelected([]);
      setValue('variants', deleteProductChars);
    }
  };

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - variants.length) : 0;
  const [filteredUsers, setFilteredUsers] = useState<Variant[]>([]);
  useEffect(() => {
    setFilteredUsers(applySortFilter(variants, getComparator(order, orderBy), filterName));
  }, [variants]);
  // const filteredUsers = applySortFilter(variants, getComparator(order, orderBy), filterName);

  const isNotFound = !filteredUsers.length && Boolean(filterName);

  return (
    <Card>
      <VariantListToolbar
        numSelected={selected.length}
        filterName={filterName}
        onFilterName={handleFilterByName}
        onDeleteProducts={() => handleDeleteProducts(selected)}
      />

      <Scrollbar>
        <TableContainer sx={{ minWidth: 800 }}>
          <Table>
            <VariantListHead
              order={order}
              orderBy={orderBy}
              headLabel={TABLE_HEAD}
              rowCount={variants.length}
              numSelected={selected.length}
              onRequestSort={handleRequestSort}
              onSelectAllClick={handleSelectAllClick}
            />
            <TableBody>
              {filteredUsers
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => {
                  const { id, name, quantity, price } = row;
                  const isItemSelected = selected.indexOf(id) !== -1;

                  return (
                    <TableRow
                      hover
                      key={index}
                      tabIndex={-1}
                      role="checkbox"
                      selected={isItemSelected}
                      aria-checked={isItemSelected}
                    >
                      <TableCell padding="checkbox">
                        <Checkbox checked={isItemSelected} onClick={() => handleClick(id!)} />
                      </TableCell>
                      <TableCell align="left">{id}</TableCell>
                      <TableCell align="left">{name}</TableCell>
                      <TableCell align="left">{quantity}</TableCell>
                      <TableCell align="left">{price}</TableCell>

                      <TableCell align="center">
                        <Button
                          onClick={() => handleEditProductChar(id)}
                          startIcon={<Iconify icon={'eva:edit-fill'} sx={{ ...ICON }} />}
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
        count={variants.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={(e, page) => setPage(page)}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Card>
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

function applySortFilter(array: Variant[], comparator: (a: any, b: any) => number, query: string) {
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
