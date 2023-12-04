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
  InputAdornment,
  Tooltip,
  IconButton,
  Toolbar,
  styled,
  Stack,
  Grid,
} from '@mui/material';
import { ProductChar } from 'src/@types/product';
import ProductCharToolbar from 'src/sections/@dashboard/e-commerce/product-char/ProductCharToolbar';
import ProductCharListHead from 'src/sections/@dashboard/e-commerce/product-char/ProductCharListHead';

import { deleteProductChars, getProductChars } from 'src/redux/slices/product-char';
import useSettings from 'src/hooks/useSettings';
import { useDispatch, useSelector } from 'src/redux/store';
import Page from 'src/components/Page';
import Scrollbar from 'src/components/Scrollbar';
import Label from 'src/components/Label';
import Iconify from 'src/components/Iconify';
import SearchNotFound from 'src/components/SearchNotFound';
import InputStyle from 'src/components/InputStyle';
import RFHCheckMark from 'src/components/hook-form/RHFCheckMark';

// ----------------------------------------------------------------------

const LabelStyle = styled(Typography)(({ theme }) => ({
  ...theme.typography.subtitle2,
  color: theme.palette.text.secondary,
  marginBottom: theme.spacing(1),
}));
const TABLE_HEAD_CHAR = [{ id: 'name', label: 'Name', alignRight: false }, { id: 'select' }];
const TABLE_HEAD_VALUE = [
  { id: 'name', label: 'Name', alignRight: false },
  { id: 'value', label: 'Value', alignRight: false },
  { id: 'delelte' },
];

// ----------------------------------------------------------------------

const RootStyle = styled(Toolbar)(({ theme }) => ({
  height: 96,
  display: 'flex',
  justifyContent: 'space-between',
  padding: theme.spacing(0, 1, 0, 3),
}));
// type Props = {
//   labelStyle: React.ComponentType<any>;
//   handleSelectChar: (id: number) => void;
// };

export default function CharList() {
  const ICON = {
    mr: 2,
    width: 35,
    height: 35,
  };
  const theme = useTheme();
  const isLight = theme.palette.mode === 'light';
  const dispatch = useDispatch();
  const [pageChar, setPageChar] = useState(0);
  const [pageValue, setPageValue] = useState(0);


  const [order, setOrder] = useState<'asc' | 'desc'>('asc');

  const [charSelected, setCharSelected] = useState<number[]>([]);
  const [valueSelected, setValueSelected] = useState<number[]>([]);

  const { productChars } = useSelector((state) => state.productChars);
  const [charsSelected, setCharsSelected] = useState<ProductChar[]>([]);

  const [orderBy, setOrderBy] = useState('name');

  const [valueFilterName, setValueFilterName] = useState('');

  const [charFilterName, setCharFilterName] = useState('');

  const [rowsPerPageChar, setRowsPerPageChar] = useState(5);
  const [rowsPerPageValue, setRowsPerPageValue] = useState(5);


  const handleSelectChar = (ids: number[]) => {
    const newCharsSeleteds = [
      ...charsSelected,
      ...productChars.filter(
        (item) => ids.includes(item.id!) && !charsSelected.find((c) => ids.includes(c.id!))
      ),
    ];
    setCharsSelected(newCharsSeleteds);
  };

  const handleRequestSort = (property: string) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleCharSelectAllClick = (checked: boolean) => {
    if (checked) {
      const newSelecteds = productChars.map((n) => n.id!);
      setCharSelected(newSelecteds);
      return;
    }
    setCharSelected([]);
  };

  const handleClickChar = (id: number) => {
    const selectedIndex = charSelected.indexOf(id);
    let newSelected: number[] = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(charSelected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(charSelected.slice(1));
    } else if (selectedIndex === charSelected.length - 1) {
      newSelected = newSelected.concat(charSelected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        charSelected.slice(0, selectedIndex),
        charSelected.slice(selectedIndex + 1)
      );
    }
    setCharSelected(newSelected);
  };

  const handleClickValue = (id: number) => {
    const selectedIndex = valueSelected.indexOf(id);
    let newSelected: number[] = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(valueSelected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(valueSelected.slice(1));
    } else if (selectedIndex === valueSelected.length - 1) {
      newSelected = newSelected.concat(valueSelected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        valueSelected.slice(0, selectedIndex),
        valueSelected.slice(selectedIndex + 1)
      );
    }
    setValueSelected(newSelected);
  };

  const handleSelectAllClick = (checked: boolean) => {
    if (checked) {
      const newSelecteds = productChars.map((n) => n.id!);
      setValueSelected(newSelecteds);
      return;
    }
    setValueSelected([]);
  };

  const handleChangeRowsPerPageChar = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPageChar(parseInt(event.target.value, 10));
    setPageChar(0);
  };

  const handleChangeRowsPerPageValue = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPageValue(parseInt(event.target.value, 10));
    setPageValue(0);
  };

  const handleValueFilterByName = (filterName: string) => {
    setValueFilterName(filterName);
    setPageValue(0);
  };
  const handleCharFilterByName = (filterName: string) => {
    setCharFilterName(filterName);
    setPageChar(0);
  };

  const handleDeleteValue = (id: number | null) => {
    if (id) {
      const deleteProduct = charsSelected.filter((product) => product.id !== id);
      setCharsSelected(deleteProduct);
    }
  };

  const handleDeleteValues = (ids: (number | null)[]) => {
    const validIds = ids.filter((id) => id !== null) as number[];

    if (validIds.length > 0) {
      dispatch(deleteProductChars(validIds));
      const deleteProducts = charsSelected.filter((product) => !ids.includes(product.id));
      setCharSelected([]);
      setCharsSelected(deleteProducts);
    }
  };

  const emptyRowsChar = pageChar > 0 ? Math.max(0, (1 + pageChar) * rowsPerPageChar - productChars.length) : 0;
  const emptyRowsValue = pageValue > 0 ? Math.max(0, (1 + pageValue) * rowsPerPageValue - productChars.length) : 0;


  const filtereProductChars = applySortFilter(
    productChars,
    getComparator(order, orderBy),
    charFilterName
  );

  const isNotFoundProductChar = !filtereProductChars.length && Boolean(charFilterName);
  const isNotFoundProductValue = !filtereProductChars.length && Boolean(valueFilterName);


  return (
    <Grid container justifyContent="space-between">
      <Grid item xs={6}>
        <div>
          <LabelStyle>Product character</LabelStyle>
          <RootStyle
            sx={{
              ...(charSelected.length > 0 && {
                color: isLight ? 'primary.main' : 'text.primary',
                bgcolor: isLight ? 'primary.lighter' : 'primary.dark',
              }),
            }}
          >
            {charSelected.length > 0 ? (
              <Typography component="div" variant="subtitle1">
                {charSelected.length} selected
              </Typography>
            ) : (
              <InputStyle
                stretchStart={240}
                value={charFilterName}
                onChange={(event) => handleCharFilterByName(event.target.value)}
                placeholder="Search character..."
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Iconify
                        icon={'eva:search-fill'}
                        sx={{ color: 'text.disabled', width: 20, height: 20 }}
                      />
                    </InputAdornment>
                  ),
                }}
              />
            )}

            {charSelected.length > 0 ? (
              <Tooltip title="Select">
                <IconButton onClick={() => handleSelectChar(charSelected)}>
                  <Iconify icon={'ei:arrow-right'} />
                </IconButton>
              </Tooltip>
            ) : (
              <></>
            )}
          </RootStyle>
          <Scrollbar>
            <TableContainer>
              <Table>
                <ProductCharListHead
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD_CHAR}
                  rowCount={productChars.length}
                  numSelected={charSelected.length}
                  onRequestSort={handleRequestSort}
                  onSelectAllClick={handleCharSelectAllClick}
                />
                <TableBody>
                  {filtereProductChars
                    .filter((item) => item.status)
                    .slice(pageChar * rowsPerPageChar, pageChar * rowsPerPageChar + rowsPerPageChar)
                    .map((row) => {
                      const { id, name, status, description } = row;
                      const isItemSelected = charSelected.indexOf(id!) !== -1;

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
                            <Checkbox
                              checked={isItemSelected}
                              onClick={() => handleClickChar(id!)}
                            />
                          </TableCell>
                          <TableCell align="left">{name}</TableCell>
                          <TableCell align="center">
                            <Tooltip title="Select">
                              <IconButton onClick={() => handleSelectChar([id!])}>
                                <Iconify icon={'ei:arrow-right'} />
                              </IconButton>
                            </Tooltip>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  {emptyRowsChar > 0 && (
                    <TableRow style={{ height: 53 * emptyRowsChar }}>
                      <TableCell colSpan={6} />
                    </TableRow>
                  )}
                </TableBody>
                {isNotFoundProductChar && (
                  <TableBody>
                    <TableRow>
                      <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
                        <SearchNotFound searchQuery={charFilterName} />
                      </TableCell>
                    </TableRow>
                  </TableBody>
                )}
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={productChars.length}
              rowsPerPage={rowsPerPageChar}
              page={pageChar}
              onPageChange={(e, page) => setPageChar(page)}
              onRowsPerPageChange={handleChangeRowsPerPageChar}
            />
          </Scrollbar>
        </div>
      </Grid>
      <Grid item xs={6}>
        <div>
          <LabelStyle>Product character value</LabelStyle>
          <ProductCharToolbar
            numSelected={valueSelected.length}
            filterName={valueFilterName}
            onFilterName={handleValueFilterByName}
            onDeleteProducts={() => handleDeleteValues(valueSelected)}
          />
          <Scrollbar>
            <TableContainer>
              <Table>
                <ProductCharListHead
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD_VALUE}
                  rowCount={productChars.length}
                  numSelected={valueSelected.length}
                  onRequestSort={handleRequestSort}
                  onSelectAllClick={handleSelectAllClick}
                />
                <TableBody>
                  {charsSelected
                    .slice(pageValue * rowsPerPageValue, pageValue * rowsPerPageValue + rowsPerPageValue)
                    .map((row) => {
                      const { id, name, status, description ,productSpecCharValueDTOS} = row;
                      const isItemSelected = valueSelected.indexOf(id!) !== -1;

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
                            <Checkbox
                              checked={isItemSelected}
                              onClick={() => handleClickValue(id!)}
                            />
                          </TableCell>
                          <TableCell align="left">{name}</TableCell>
                          <TableCell align="left">
                          <RFHCheckMark name='values' items={undefined} label={''}  />
                          </TableCell>
                          <TableCell align="center">
                            <Button
                              sx={{ color: 'error.main' }}
                              onClick={() => handleDeleteValue(id)}
                              startIcon={<Iconify icon={'eva:trash-2-outline'} sx={{ ...ICON }} />}
                            />
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  {emptyRowsValue > 0 && (
                    <TableRow style={{ height: 53 * emptyRowsValue }}>
                      <TableCell colSpan={6} />
                    </TableRow>
                  )}
                </TableBody>
                {isNotFoundProductValue && (
                  <TableBody>
                    <TableRow>
                      <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
                        <SearchNotFound searchQuery={valueFilterName} />
                      </TableCell>
                    </TableRow>
                  </TableBody>
                )}
              </Table>
              
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={charsSelected.length}
              rowsPerPage={rowsPerPageValue}
              page={pageValue}
              onPageChange={(e, page) => setPageValue(page)}
              onRowsPerPageChange={handleChangeRowsPerPageValue}
            />
          </Scrollbar>
        </div>
      </Grid>
    </Grid>
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
