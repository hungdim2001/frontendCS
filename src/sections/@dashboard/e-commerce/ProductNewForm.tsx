import { useSnackbar } from 'notistack';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
// form
import { yupResolver } from '@hookform/resolvers/yup';
import { Controller, useForm } from 'react-hook-form';
// @mui
import { LoadingButton } from '@mui/lab';
import {
  Button,
  Card,
  Checkbox,
  FormControl,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  ListItemText,
  MenuItem,
  Select,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TablePagination,
  TableRow,
  Toolbar,
  Tooltip,
  Typography,
  useTheme,
} from '@mui/material';
import { styled } from '@mui/material/styles';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// @types
import { Product, ProductChar, ProductCharValue } from '../../../@types/product';
// components
import { deleteProductChars, getProductChars } from 'src/redux/slices/product-char';
import { getProductTypes } from 'src/redux/slices/product-type';
import { dispatch, useSelector } from 'src/redux/store';
import {
  FormProvider,
  RHFEditor,
  RHFMultiCheckbox,
  RHFRadioGroup,
  RHFSelect,
  RHFTextField,
  RHFUploadAvatar,
  RHFUploadMultiFile,
} from '../../../components/hook-form';
import CharList from './ProductNewForm/CharList';
import InputStyle from 'src/components/InputStyle';
import Iconify from 'src/components/Iconify';
import Scrollbar from 'src/components/Scrollbar';
import ProductCharListHead from './product-char/ProductCharListHead';
import SearchNotFound from 'src/components/SearchNotFound';
import ProductCharToolbar from './product-char/ProductCharToolbar';
import RHFCheckMark from 'src/components/hook-form/RHFCheckMark';

// ----------------------------------------------------------------------

const STATUS_OPTION = ['Active', 'InActive'];

const TABLE_HEAD_CHAR = [{ id: 'name', label: 'Name', alignRight: false }, { id: 'select' }];
const TABLE_HEAD_VALUE = [
  { id: 'delelte' },
  { id: 'name', label: 'Name', alignRight: false },
  { id: 'value', label: 'Value', alignRight: false },
];

const LabelStyle = styled(Typography)(({ theme }) => ({
  ...theme.typography.subtitle2,
  color: theme.palette.text.secondary,
  marginBottom: theme.spacing(1),
}));

// ----------------------------------------------------------------------

interface FormValuesProps {
  thumbnail: File | string;
  images: (File | string)[];
  name: string;
  price: number;
  quantity: number;
  productType: number;
  productCharsSelected: (ProductCharValue | number)[];
}

type Props = {
  isEdit: boolean;
  currentProduct?: Product;
};
const RootStyle = styled(Toolbar)(({ theme }) => ({
  height: 96,
  display: 'flex',
  justifyContent: 'space-between',
  padding: theme.spacing(0, 1, 0, 3),
}));
export default function ProductNewForm({ isEdit, currentProduct }: Props) {
  const checkboxRef = useRef<HTMLInputElement>(null);

  const handleTextClick = () => {
    if (checkboxRef.current) {
      // checkboxRef.current.checked = !checkboxRef.current.checked;
      // Trigger the change event manually
      // const event = new Event('change', { bubbles: true });
      // checkboxRef.current.dispatchEvent(event);
      checkboxRef.current.click();
    }
  };
  const ICON = {
    mr: 2,
    width: 20,
    height: 20,
  };

  const { enqueueSnackbar } = useSnackbar();

  const { productTypes } = useSelector((state) => state.productTypes);
  useEffect(() => {
    dispatch(getProductTypes());
    dispatch(getProductChars(null));
  }, [dispatch]);

  const NewProductSchema = Yup.object().shape({
    // name: Yup.string().required('Name is required'),
    // description: Yup.string().required('Description is required'),
    // productType: Yup.string().required('Product Type is required'),
    // images: Yup.array().min(1, 'Images is required'),
    // price: Yup.number().moreThan(0, 'Price should not be $0.00'),
    // thumbnail: Yup.mixed().required('Thumbnail is required'),
  });

  const defaultValues = useMemo(
    () => ({
      productCharsSelected: [],
      name: currentProduct?.name || '',
      description: currentProduct?.description || '',
      images: currentProduct?.images || [],
      thumbnail: currentProduct?.thumbnail,
      price: currentProduct?.price || 0,
      productType: currentProduct?.productType.id!,
      status: currentProduct?.status
        ? STATUS_OPTION[0]
        : currentProduct
        ? STATUS_OPTION[1] || STATUS_OPTION[0]
        : STATUS_OPTION[0],
    }),
    [currentProduct]
  );

  const methods = useForm<FormValuesProps>({
    resolver: yupResolver(NewProductSchema),
    defaultValues,
  });

  const {
    reset,
    watch,
    control,
    setValue,
    getValues,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const values = watch();

  useEffect(() => {
    if (isEdit && currentProduct) {
      reset(defaultValues);
    }
    if (!isEdit) {
      reset(defaultValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEdit, currentProduct]);

  const onSubmit = async (data: FormValuesProps) => {
    try {
      console.log(data);
      await new Promise((resolve) => setTimeout(resolve, 500));
      // reset();
      enqueueSnackbar(!isEdit ? 'Create success!' : 'Update success!');
      // navigate(PATH_DASHBOARD.eCommerce.list);
    } catch (error) {
      console.error(error);
    }
  };
  const handleDrop = useCallback(
    (acceptedFiles) => {
      setValue(
        'images',
        acceptedFiles.map((file: Blob | MediaSource) =>
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          })
        )
      );
    },
    [setValue]
  );
  const handleDrop2 = useCallback(
    (acceptedFiles) => {
      const file = acceptedFiles[0];

      if (file) {
        setValue(
          'thumbnail',
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          })
        );
      }
    },
    [setValue]
  );

  const handleRemoveAll = () => {
    setValue('images', []);
  };

  const handleRemove = (file: File | string) => {
    const filteredItems = values.images?.filter((_file) => _file !== file);
    setValue('images', filteredItems);
  };
  //----------------------------------------------------------------------------------------------------------
  const theme = useTheme();
  const isLight = theme.palette.mode === 'light';
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
      const deleteProducts = charsSelected.filter((product) => !ids.includes(product.id));
      setCharSelected([]);
      setCharsSelected(deleteProducts);
    }
  };

  const emptyRowsChar =
    pageChar > 0 ? Math.max(0, (1 + pageChar) * rowsPerPageChar - productChars.length) : 0;
  const emptyRowsValue =
    pageValue > 0 ? Math.max(0, (1 + pageValue) * rowsPerPageValue - productChars.length) : 0;

  const filtereProductChars = applySortFilter(
    productChars,
    getComparator(order, orderBy),
    charFilterName
  );
  useEffect(() => {
    console.log(getValues('productCharsSelected'));
  }, [getValues('productCharsSelected')]);
  const isNotFoundProductChar = !filtereProductChars.length && Boolean(charFilterName);
  const isNotFoundProductValue = !filtereProductChars.length && Boolean(valueFilterName);
  //-----------------------------------------------------------------------------------------------------------

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card sx={{ p: 3 }}>
            <Stack spacing={3}>
              <RHFTextField name="name" label="Product Name" />
              <div>
                <LabelStyle>Images</LabelStyle>
                <RHFUploadMultiFile
                  name="images"
                  showPreview
                  accept="image/*"
                  maxSize={3145728}
                  onDrop={handleDrop}
                  onRemove={handleRemove}
                  onRemoveAll={handleRemoveAll}
                />
              </div>
              <div>
                <LabelStyle>Description</LabelStyle>
                <RHFEditor simple name="description" />
              </div>
            </Stack>
          </Card>

          <Grid item xs={12} md={12} sx={{ mt: 3 }}>
            <Card sx={{ p: 3 }}>
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
                              .slice(
                                pageChar * rowsPerPageChar,
                                pageChar * rowsPerPageChar + rowsPerPageChar
                              )
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
                        {' '}
                        <Controller
                          control={control}
                          name="productCharsSelected"
                          render={({ field }) => (
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
                                  .slice(
                                    pageValue * rowsPerPageValue,
                                    pageValue * rowsPerPageValue + rowsPerPageValue
                                  )
                                  .map((row) => {
                                    const { id, name, productSpecCharValueDTOS } = row;
                                    const isItemSelected = valueSelected.indexOf(id!) !== -1;
                                    const handleSelectAll = (checked: boolean, field: any) => {
                                      const allValues = productSpecCharValueDTOS?.map(
                                        (item) => item
                                      );
                                      const newValue = checked
                                        ? [...field.value, ...allValues!, id!]
                                        : [...field.value]
                                            .filter(
                                              (item) =>
                                                //  row.productSpecCharValueDTOS?.some(
                                                // (item2) => item2.id !== item.id
                                                item !== id
                                            )
                                            .filter((item) => {
                                              console.log(
                                                row.productSpecCharValueDTOS?.some(
                                                  (item2) => item2.id !== item.id
                                                )
                                              );
                                              row.productSpecCharValueDTOS?.some(
                                                (item2) => item2.id !== item.id
                                              );
                                            });
                                      console.log(newValue);
                                      field.onChange(newValue);
                                    };
                                    const handleSelectAllChange: React.ChangeEventHandler<
                                      HTMLInputElement
                                    > = (event) => {
                                      console.log(event.target.checked);
                                      const newValue = event.target.checked
                                        ? [...field.value, id].filter((item) => {
                                          console.log(item)
                                            return row.productSpecCharValueDTOS?.some((item2) => {
                                              return (
                                                typeof item === 'object' && item2.id !== item!.id
                                              );
                                            });
                                          })
                                        : [...field.value].filter((item) => item != id);
                                      field.onChange(newValue);
                                    };

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
                                        <TableCell align="center">
                                          <Button
                                            sx={{ color: 'error.main' }}
                                            onClick={() => handleDeleteValue(id)}
                                            startIcon={
                                              <Iconify
                                                icon={'eva:trash-2-outline'}
                                                sx={{ ...ICON }}
                                              />
                                            }
                                          />
                                        </TableCell>
                                        <TableCell align="left">{name}</TableCell>
                                        <TableCell align="left">
                                          {/* <RHFCheckMark id={id?.toString()!} name='value' items={productSpecCharValueDTOS} label={'Char Values'}  /> */}
                                          <FormControl>
                                            <InputLabel id={id?.toString()}>Char Values</InputLabel>
                                            <Select
                                              {...field}
                                              style={{ width: '100%' }}
                                              multiple
                                              label="Char Values"
                                              // onChange={(e: any) => handleSelectsth(e, field)}
                                              renderValue={(selected) => {
                                                if (selected.includes(id!)) {
                                                  return 'All';
                                                }
                                                return selected
                                                  .filter((item: any) => {
                                                    return row.productSpecCharValueDTOS?.some(
                                                      (char: any) => char.id === item.id
                                                    );
                                                  })
                                                  .map((item: any) => item.value)
                                                  .join(', ');
                                              }}
                                            >
                                              {/* <MenuItem key={-1} value={valueSelectAll as any}> */}
                                              <MenuItem key={row.id} value={id!}>
                                                <Checkbox
                                                  id={id!.toString()}
                                                  inputRef={checkboxRef}
                                                  onChange={handleSelectAllChange}
                                                  checked={field.value && field.value.includes(id!)}
                                                />
                                                {/* <label htmlFor={id!.toString()}>Select All</label> */}
                                                <ListItemText primary={'Select All'} />
                                              </MenuItem>

                                              {productSpecCharValueDTOS?.map((option: any) => (
                                                <MenuItem
                                                  key={option.id}
                                                  value={option}
                                                  disabled={
                                                    !!field.value && field.value.includes(id!)
                                                  }
                                                >
                                                  <Checkbox
                                                    // disabled={
                                                    //   !!field.value
                                                    //   //  && field.value.includes(-1)
                                                    // }
                                                    checked={field.value
                                                      .map((item: any) => {
                                                        return item.value;
                                                      })
                                                      .includes(option.value)}
                                                  />

                                                  <ListItemText primary={option.value} />
                                                </MenuItem>
                                              ))}
                                            </Select>
                                          </FormControl>

                                          {/* <RHFMultiCheckbox
                                    
                                        name="gender"
                                        options={productSpecCharValueDTOS?.map(
                                          (item) => item.value!
                                        )!}
                                        sx={{ width: 1 }}
                                      /> */}
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
                          )}
                        />
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
              </Grid>{' '}
            </Card>
          </Grid>
        </Grid>

        <Grid item xs={12} md={4}>
          <Stack spacing={3}>
            <Card sx={{ p: 3 }}>
              <div>
                <LabelStyle>Thumbnail</LabelStyle>
                <RHFUploadAvatar
                  name="thumbnail"
                  accept="image/*"
                  maxSize={3145728}
                  onDrop={handleDrop2}
                />
              </div>

              <Stack spacing={3} mt={2}>
                <div>
                  <LabelStyle>Status</LabelStyle>
                  <RHFRadioGroup
                    name="status"
                    options={STATUS_OPTION}
                    sx={{
                      '& .MuiFormControlLabel-root': { mr: 4 },
                    }}
                  />
                </div>

                <RHFSelect name="productType" label="Product Type">
                  <option value=""></option>
                  {productTypes
                    .filter((productType) => productType.status)
                    .map((productType) => (
                      <option key={productType.id} value={productType.id!}>
                        {productType.name}
                      </option>
                    ))}
                </RHFSelect>

                {/* <Controller
                  name="tags"
                  control={control}
                  render={({ field }) => (
                    <Autocomplete
                      {...field}
                      multiple
                      freeSolo
                      onChange={(event, newValue) => field.onChange(newValue)}
                      options={TAGS_OPTION.map((option) => option)}
                      renderTags={(value, getTagProps) =>
                        value.map((option, index) => (
                          <Chip
                            {...getTagProps({ index })}
                            key={option}
                            size="small"
                            label={option}
                          />
                        ))
                      }
                      renderInput={(params) => <TextField label="Tags" {...params} />}
                    />
                  )}
                /> */}
              </Stack>
            </Card>

            <Card sx={{ p: 3 }}>
              <Stack spacing={3} mb={2}>
                <RHFTextField
                  name="price"
                  label="Regular Price"
                  placeholder="0.00"
                  value={getValues('price') === 0 ? '' : getValues('price')}
                  onChange={(event) => setValue('price', Number(event.target.value))}
                  InputLabelProps={{ shrink: true }}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">₫</InputAdornment>,
                    type: 'number',
                  }}
                />

                {/* <RHFTextField
                  name="priceSale"
                  label="Sale Price"
                  placeholder="0.00"
                  value={getValues('priceSale') === 0 ? '' : getValues('priceSale')}
                  onChange={(event) => setValue('price', Number(event.target.value))}
                  InputLabelProps={{ shrink: true }}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">$</InputAdornment>,
                    type: 'number',
                  }}
                /> */}
              </Stack>

              {/* <RHFSwitch name="taxes" label="Price includes taxes" /> */}
            </Card>

            <LoadingButton type="submit" variant="contained" size="large" loading={isSubmitting}>
              {!isEdit ? 'Create Product' : 'Save Changes'}
            </LoadingButton>
          </Stack>
        </Grid>
      </Grid>
    </FormProvider>
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
