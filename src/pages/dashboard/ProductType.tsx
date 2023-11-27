import * as Yup from 'yup';
import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';
import { useCallback, useEffect, useMemo, useState } from 'react';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { LoadingButton } from '@mui/lab';
import {
  Alert,
  Avatar,
  Box,
  Button,
  Card,
  Checkbox,
  Grid,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TablePagination,
  TableRow,
  Typography,
  useTheme,
} from '@mui/material';
// routes
// @types
// components
import { useDispatch, useSelector } from '../../redux/store';
import { el } from 'date-fns/locale';
import { ProductChar, ProductCharValue, ProductType } from 'src/@types/product';
import useAuth from 'src/hooks/useAuth';
import useIsMountedRef from 'src/hooks/useIsMountedRef';
import { productSpecCharApi } from 'src/service/app-apis/product-char';
import RHFTextField from 'src/components/hook-form/RHFTextField';
import RHFSelect from 'src/components/hook-form/RHFSelect';
import FormProvider from 'src/components/hook-form/FormProvider';
import Scrollbar from 'src/components/Scrollbar';
import SearchNotFound from 'src/components/SearchNotFound';
import Label from 'src/components/Label';
import ProductCharListHead from 'src/sections/@dashboard/e-commerce/product-char/ProductCharListHead';
import ProductCharToolbar from 'src/sections/@dashboard/e-commerce/product-char/ProductCharToolbar';
import { sentenceCase } from 'change-case';
import Iconify from 'src/components/Iconify';
import { PATH_DASHBOARD } from 'src/routes/paths';
import useSettings from 'src/hooks/useSettings';
import { deleteProductChars, getProductChars } from 'src/redux/slices/product-char';
import ProductTypeHead from 'src/sections/@dashboard/e-commerce/product-type/ProductTypeHead';
import ProductTypeToolbar from 'src/sections/@dashboard/e-commerce/product-type/ProductTypeToolbar';
import { RHFUploadAvatar, RHFUploadSingleFile } from 'src/components/hook-form';
import { styled } from '@mui/material/styles';
import { getproductTypes } from 'src/redux/slices/product-type';
import { productTypeApi } from 'src/service/app-apis/product-type';

// ----------------------------------------------------------------------

// ----------------------------------------------------------------------

interface FormValuesProps {
  name: string;
  description: string;
  icon: string | any;
  status: string;
  afterSubmit?: string;
}

const TABLE_HEAD = [
  { id: 'id', label: 'ID', alignRight: false },
  { id: 'name', label: 'Name', alignRight: false },
  { id: 'status', label: 'Status', alignRight: false },
  { id: 'description', label: 'Description', alignRight: false },
  { id: 'update' },
  { id: 'delete' },
];

export default function ProductTypeView() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [productCharValues, setproductCharValues] = useState<ProductCharValue[]>([]);
  // const [productType, setproductCharValues] = useState<ProductCharValue[]>([]);

  const { enqueueSnackbar } = useSnackbar();
  const setProductCharValues = (productCharValueCodes: any) => {
    setproductCharValues(productCharValueCodes);
  };
  const NewProductSchema = Yup.object().shape({
    icon: Yup.mixed().required('Icon is required'),
    name: Yup.string().required('Name is required'),
  });
  const defaultValues = useMemo(
    // () => ({
    //   name: productChar?.name || '',
    //   status: productChar?.status ? (productChar.status ? 'Active' : 'InActive') : 'Active',
    //   icon:null,
    //   description: productChar?.description || '',
    // }),
    // [productChar]
    () => ({
      name: '',
      status: 'Active',
      icon: null,
      description: '',
    }),
    []
  );

  const methods = useForm<FormValuesProps>({
    resolver: yupResolver(NewProductSchema),
    defaultValues,
  });

  const {
    setValue,
    reset,
    watch,
    setError,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = methods;

  const values = watch();
  const isMountedRef = useIsMountedRef();

  // useEffect(() => {
  //   console.log(productChar);
  //   reset(defaultValues);
  //   setProductCharValues(
  //     productChar?.productSpecCharValueDTOS ? productChar.productSpecCharValueDTOS : []
  //   );
  // }, [productChar]);

  const ICON = {
    mr: 2,
    width: 20,
    height: 20,
  };

  const theme = useTheme();

  const [productTypeList, setProductTypeList] = useState<ProductType[]>([]);
  const [page, setPage] = useState(0);

  const [order, setOrder] = useState<'asc' | 'desc'>('asc');

  const [selected, setSelected] = useState<(number | null)[]>([]);

  const [orderBy, setOrderBy] = useState('name');

  const [filterName, setFilterName] = useState('');

  const [rowsPerPage, setRowsPerPage] = useState(5);
  const { productTypes } = useSelector((state) => state.productType);

  const handleRequestSort = (property: string) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  useEffect(() => {
    dispatch(getproductTypes());
  }, [dispatch]);

  useEffect(() => {
    if (productTypes.length) {
      setProductTypeList(productTypes);
    }
  }, [productTypes]);

  const handleSelectAllClick = (checked: boolean) => {
    if (checked) {
      const newSelecteds = productTypes.map((n) => n.id);
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

  const handleDeleteProductChar = (id: number | null) => {
    // if (id) {
    //   const ids = [id];
    //   dispatch(deleteProductChars(ids));
    //   const deleteProduct = productTypeList.filter((product) => product.id !== id);
    //   setSelected([]);
    //   setProductTypeList(deleteProduct);
    // }
  };

  const handleEditProductChar = (id: number | null) => {
    if (id) {
      console.log(`${PATH_DASHBOARD.productChar.edit}/${id}`);
      navigate(`${PATH_DASHBOARD.productChar.edit}/${id}`, { replace: true });
    }
  };

  const handleDeleteProducts = (ids: (number | null)[]) => {
    // const validIds = ids.filter((id) => id !== null) as number[];
    // if (validIds.length > 0) {
    //   dispatch(deleteProductChars(validIds));
    //   const deleteProducts = productTypeList.filter((product) => !ids.includes(product.id));
    //   setSelected([]);
    //   setProductTypeList(deleteProducts);
    // }
  };

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - productTypeList.length) : 0;

  const filteredUsers = applySortFilter(productTypeList, getComparator(order, orderBy), filterName);

  const isNotFound = !filteredUsers.length && Boolean(filterName);
  const onSubmit = async (data: FormValuesProps) => {

    try {
      console.log(data);
      const formData = new FormData();
      formData.append('name',data.name)
      formData.append('description', data.description)
      formData.append('status', data?.status ==='Active'? '1':'0')
      formData.append('icon', data.icon)
      await productTypeApi.createProductType(formData)
      dispatch(getproductTypes());
    } catch (error) {
      console.log("error");
      console.log(error);
      if (isMountedRef.current) {
        setError('afterSubmit', { type: 'custom', message: error.message });
      }
    }
  };
  type Field = 'status';
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, field: Field) => {
    const selectedValue = e.target.value;
    setValue(field, selectedValue, { shouldValidate: true });
  };

  const handleDrop = useCallback(
    (acceptedFiles) => {
      const file = acceptedFiles[0];

      if (file) {
        setValue(
          'icon',
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          })
        );
      }
    },
    [setValue]
  );

  return (
    <>
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        {!!errors.afterSubmit && <Alert severity="error">{errors.afterSubmit.message}</Alert>}
        <Grid container spacing={3}>
          <Grid item xs={12} md={12}>
            <Card sx={{ p: 3 }}>
              <Box
                sx={{
                  display: 'grid',
                  columnGap: 3,
                  rowGap: 3,
                  gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' },
                }}
              >
                <RHFTextField name="name" label="Name" />
                <RHFSelect
                  name="status"
                  label="Status"
                  onChange={(e) => handleChange(e as React.ChangeEvent<HTMLInputElement>, 'status')}
                >
                  <option>Active</option>
                  <option>InActive</option>
                </RHFSelect>
                <RHFTextField name="description" label="Description" />
                <RHFUploadAvatar
                  name="icon"
                  accept="image/*"
                  maxSize={3145728}
                  onDrop={handleDrop}
                />
              </Box>

              <Stack alignItems="flex-end" sx={{ mt: 3 }}>
                <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                  {/* {!isEdit ? 'Create' : 'Save Changes'} */}
                  Create
                </LoadingButton>
              </Stack>
              <ProductTypeToolbar
                numSelected={selected.length}
                filterName={filterName}
                onFilterName={handleFilterByName}
                onDeleteProducts={() => handleDeleteProducts(selected)}
              />
              <Scrollbar>
                <TableContainer sx={{ minWidth: 800 }}>
                  <Table>
                    <ProductTypeHead
                      order={order}
                      orderBy={orderBy}
                      headLabel={TABLE_HEAD}
                      rowCount={productTypeList.length}
                      numSelected={selected.length}
                      onRequestSort={handleRequestSort}
                      onSelectAllClick={handleSelectAllClick}
                    />
                    <TableBody>
                      {filteredUsers
                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                        .map((row) => {
                          const { id, icon, name, status, description } = row;
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
                                <Checkbox
                                  checked={isItemSelected}
                                  onClick={() => handleClick(id)}
                                />
                              </TableCell>
                              <TableCell align="left">{id}</TableCell>
                              <TableCell align="left" sx={{ display: 'flex', alignItems: 'center' }}>
                                <Avatar
                                  alt={name}
                                  src={icon}
                                  sx={{ mr: 2 }}
                                />
                                <Typography variant="subtitle2" noWrap >
                                  {name}
                                </Typography>
                              </TableCell>
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
                                  startIcon={
                                    <Iconify icon={'eva:trash-2-outline'} sx={{ ...ICON }} />
                                  }
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
                count={productTypeList.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={(e, page) => setPage(page)}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </Card>
          </Grid>
        </Grid>
      </FormProvider>
    </>
  );
}

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
  array: ProductType[],
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
