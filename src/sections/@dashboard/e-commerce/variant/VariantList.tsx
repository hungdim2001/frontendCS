import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
// @mui
import {
  Button,
  Card,
  Checkbox,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TablePagination,
  TableRow,
  Typography,
} from '@mui/material';
// routes

import { isString } from 'lodash';
import { UseFormSetValue } from 'react-hook-form';
import { ProductChar, Variant } from 'src/@types/product';
import Iconify from 'src/components/Iconify';
import Scrollbar from 'src/components/Scrollbar';
import SearchNotFound from 'src/components/SearchNotFound';
import { deleteProductChars, getProductChars } from 'src/redux/slices/product-char';
import { useDispatch } from 'src/redux/store';
import { fCurrency } from 'src/utils/formatNumber';
import Image from '../../../../components/Image';
import VariantDialog from './VariantDialog';
import VariantListHead from './VariantListHead';
import VariantListToolbar from './VariantListToolBar';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'id', label: 'ID', alignLeft: true },
  { id: 'variant', label: 'Variant', alignLeft: true },
  { id: 'quantity', label: 'Quantity', alignLeft: true },
  { id: 'price', label: 'Price', alignLeft: true },
  { id: 'update' },
  { id: 'delete' },
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

  const [selected, setSelected] = useState<number[][]>([[]]);

  const [orderBy, setOrderBy] = useState('name');

  const [filterName, setFilterName] = useState('');

  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleRequestSort = (property: string) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  useEffect(() => {
    dispatch(getProductChars(null));
  }, [dispatch]);

  // useEffect(() => {
  //   if (productChars.length) {
  //     for (const variant of variants.filter((item) => !item.chars.includes(-1))) {
  //       const variantNames: string[] = [];
  //       variant.chars
  //         .map((item) => {
  //           const matchingProductChar = productChars.find((char) =>
  //             char.productSpecCharValueDTOS?.some((value) => value.id === item)
  //           );
  //           if (matchingProductChar) {
  //             const matchingValue = matchingProductChar.productSpecCharValueDTOS?.find(
  //               (value) => value.id === item
  //             );
  //             if (matchingValue) {
  //               variantNames.push(`${matchingProductChar.name}: ${matchingValue.value}`);
  //             }
  //           }
  //         })
  //         .join(',');
  //       variant.name = variantNames.join(',');
  //     }
  //   }
  // }, [productChars, variants]);

  const handleSelectAllClick = (checked: boolean) => {
    if (checked) {
      const newSelecteds = variants.filter((item) => !item.chars.includes(-1)).map((n) => n.chars);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (chars: number[]) => {
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

  const handleEditVariant = (chars: number[]) => {
    const variantEdited = variants.filter((variant) => variant.chars.every(char=> chars.includes(char)))[0];
    const name = !chars.includes(-1)
      ? chars
          .map((item) => {
            const matchingProductChar = productChars.find((char) =>
              char.productSpecCharValueDTOS?.some(
                (value) => value.id === item
              )
            );
            if (matchingProductChar) {
              const matchingValue =
                matchingProductChar.productSpecCharValueDTOS?.find(
                  (value) => value.id === item
                );
              if (matchingValue) {
                return `${matchingProductChar.name}: ${matchingValue.value}`;
              }
            }
          })
          .join(',')
      : 'default'
    setVariant({...variantEdited, name:name});
    setOpen(true);
  };

  const handleDeleteProductChar = (chars: number[]) => {
    const deleteProduct = variants.filter((variant) => variant.chars.every(char=> chars.includes(char)))
    setSelected([]);
    setValue('variants', deleteProduct);
  };

  const handleDeleteProducts = (chars: [number[]]) => {
    // const validIds = names.filter((name) => name !== null) as string[];
    

    // if (validIds.length > 0) {
      const deleteProducts = variants.filter((variant) => variant.chars.every(char=> chars.flatMap(x=> x).includes(char)))
      setSelected([]);
      setValue('variants', deleteProducts);
    // }
  };

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - variants.length) : 0;
  const [filteredUsers, setFilteredUsers] = useState<Variant[]>([]);
  useEffect(() => {
    setFilteredUsers(applySortFilter(variants, getComparator(order, orderBy), filterName));
  }, [variants]);

  const isNotFound = !filteredUsers.length && Boolean(filterName);
  const [open, setOpen] = useState<boolean>(false);
  const handleClose = () => {
    setOpen(false);
  };

  const [variant, setVariant] = useState<Variant>({ status: true } as Variant);

  useEffect(() => {
    setValue(
      'variants',
      variants.map((item) => {
        if (item.name === variant.name) {
          return { ...variant }; // Return a new object with updated values
        }
        return item; // For items other than the one to be updated, return them unchanged
      })
    );
  }, [variant]);

  return (
    <Card>
      <VariantDialog
        setVariant={setVariant}
        variant={variant}
        isOpenCompose={open}
        onCloseCompose={handleClose}
      />
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
                  const { id, chars, image, quantity, price } = row;
                  const name =!chars.includes(-1)
                    ? chars
                        .map((item) => {
                          const matchingProductChar = productChars.find((char) =>
                            char.productSpecCharValueDTOS?.some(
                              (value) => value.id === item
                            )
                          );
                          if (matchingProductChar) {
                            const matchingValue =
                              matchingProductChar.productSpecCharValueDTOS?.find(
                                (value) => value.id === item
                              );
                            if (matchingValue) {
                              return `${matchingProductChar.name}: ${matchingValue.value}`;
                            }
                          }
                        })
                        .join(',')
                    : 'default'
                  const isItemSelected = selected.indexOf(name) !== -1;

                  return (
                    <TableRow
                      hover
                      key={index}
                      tabIndex={-1}
                      role="checkbox"
                      selected={isItemSelected}
                      aria-checked={isItemSelected}
                    >
                      {chars.includes(-1) ? (
                        <TableCell align="left"></TableCell>
                      ) : (
                        <TableCell padding="checkbox">
                          <Checkbox checked={isItemSelected} onClick={() => handleClick(name!)} />
                        </TableCell>
                      )}

                      <TableCell align="left">{id}</TableCell>
                      <TableCell
                        align="left"
                        sx={{ display: 'flex', alignItems: 'center', gap: 2 }}
                      >
                        {image ? (
                          <img
                            alt={name}
                            src={isString(image) ? image : image.preview}
                            style={{ borderRadius: 1.5, width: 64, height: 64 }}
                          />
                        ) : (
                          <></>
                        )}

                        <Typography variant="subtitle2" flexWrap="wrap">
                      
                        </Typography>
                      </TableCell>
                      <TableCell align="left">{quantity}</TableCell>
                      <TableCell align="left">{fCurrency(price)}</TableCell>

                      <TableCell align="center">
                        <Button
                          onClick={() => handleEditVariant(chars)}
                          startIcon={<Iconify icon={'eva:edit-fill'} sx={{ ...ICON }} />}
                        />
                      </TableCell>
                      {chars.includes(-1) ? (
                        <></>
                      ) : (
                        <TableCell align="center">
                          <Button
                            sx={{ color: 'error.main' }}
                            onClick={() => handleDeleteProductChar(name)}
                            startIcon={<Iconify icon={'eva:trash-2-outline'} sx={{ ...ICON }} />}
                          />
                        </TableCell>
                      )}
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
