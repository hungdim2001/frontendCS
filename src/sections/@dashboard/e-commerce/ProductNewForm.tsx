import { useSnackbar } from 'notistack';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import * as Yup from 'yup';
// form
import { yupResolver } from '@hookform/resolvers/yup';
import { Controller, useForm } from 'react-hook-form';
// @mui
import { Search } from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import {
  Alert,
  Box,
  Button,
  Card,
  Checkbox,
  Divider,
  FormControl,
  FormControlLabel,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  ListItem,
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
  TextField,
  Toolbar,
  Tooltip,
  Typography,
  useTheme,
} from '@mui/material';
import { styled } from '@mui/material/styles';
// routes
// @types
import { Product, ProductChar, ProductCharValue } from '../../../@types/product';
// components
import * as cheerio from 'cheerio';
import Iconify from 'src/components/Iconify';
import InputStyle from 'src/components/InputStyle';
import Scrollbar from 'src/components/Scrollbar';
import SearchNotFound from 'src/components/SearchNotFound';
import { getProductChars } from 'src/redux/slices/product-char';
import { getProductTypes } from 'src/redux/slices/product-type';
import { dispatch, useSelector } from 'src/redux/store';
import {
  FormProvider,
  RHFEditor,
  RHFRadioGroup,
  RHFSelect,
  RHFTextField,
  RHFUploadAvatar,
  RHFUploadMultiFile,
} from '../../../components/hook-form';
import ProductCharListHead from './product-char/ProductCharListHead';
import ProductCharToolbar from './product-char/ProductCharToolbar';
import { productApi } from 'src/service/app-apis/product';
import useIsMountedRef from 'src/hooks/useIsMountedRef';
import { G } from '@react-pdf/renderer';
import RHFColorPicker from 'src/components/hook-form/RHFColorPicker';

// ----------------------------------------------------------------------

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;

type MenuPropsType = {
  PaperProps: {
    style: {
      maxHeight: number;
      width: number;
    };
  };
  anchorOrigin: {
    vertical: number | 'bottom' | 'center' | 'top';
    horizontal: number | 'center' | 'right' | 'left';
  };
  transformOrigin: {
    vertical: number | 'bottom' | 'center' | 'top';
    horizontal: number | 'center' | 'right' | 'left';
  };
  variant: 'menu' | 'selectedMenu' | undefined;
};

const MenuProps: MenuPropsType = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
  anchorOrigin: {
    vertical: 'bottom',
    horizontal: 'center',
  },
  transformOrigin: {
    vertical: 'top',
    horizontal: 'center',
  },
  variant: 'menu',
};

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
  id: any;
  thumbnail: File | string;
  images: (File | string)[];
  name: string;
  price: number;
  quantity: number;
  productTypeId: number;
  status: string;
  description: string;
  afterSubmit?: string;
  productCharsSelected: number[];
  color:string;
  priority: number[];
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
    name: Yup.string().required('Name is required'),
    description: Yup.string().required('Description is required'),
    productTypeId: Yup.string().required('Product Type is required'),
    images: Yup.array().min(1, 'Images is required'),
    price: Yup.number().moreThan(0, 'Price should not be ₫0.00'),
    quantity: Yup.number().moreThan(0, 'Quantity is required'),
    thumbnail: Yup.mixed().required('Thumbnail is required'),
  });

  const defaultValues = useMemo(() => {
    console.log('here');
    if (currentProduct?.id) {
      return {
        id: currentProduct?.id || null,
        productCharsSelected:
          currentProduct?.productSpecChars
            .flatMap((item) => item.productSpecCharValueDTOS!)
            .map((value) => value.id!) || [],
        name: currentProduct?.name || '',
        description: currentProduct?.description || '', // Set the fetched HTML as description
        images: currentProduct?.images || [],
        thumbnail: currentProduct?.thumbnail,
        price: currentProduct?.price || 0,
        quantity: currentProduct?.quantity || 0,
        productTypeId: currentProduct?.productType.id!,
        color: currentProduct.color||'#000000',
        priority:currentProduct.productSpecChars.flatMap(item=> item.productSpecCharValueDTOS).filter(item=> item?.priority!=1).map(value=> value?.priority),
        status: currentProduct?.status
          ? STATUS_OPTION[0]
          : currentProduct
          ? STATUS_OPTION[1] || STATUS_OPTION[0]
          : STATUS_OPTION[0],
      };
    } else {
      return {
        id: null,
        productCharsSelected: [],
        name: '',
        description: '', // Set the fetched HTML as description
        images: [],
        thumbnail: '',
        price: 0,
        quantity: 0,
        color:'#000000',
        productTypeId: undefined,
        status: STATUS_OPTION[0],
        priority:undefined
      };
    }
  }, [currentProduct]);

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
    setError,
    handleSubmit,
    formState: { errors, isSubmitting },
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
  const isMountedRef = useIsMountedRef();

  const onSubmit = async (data: FormValuesProps) => {
    try {
      const formData = new FormData();
      if (data.id) {
        formData.append('id', data.id);
      }
      formData.append('thumbnail', data.thumbnail);
      // data.images.forEach((image) => {
      //   formData.append('images',  image instanceof File ? image : String(image));
      // });
      for (const image of data.images) {
        if (image instanceof File) {
          formData.append('images', image);
        } else {
          formData.append('oldImages', String(image));
        }
      }

      formData.append('productTypeId', data.productTypeId.toString()); // Example product type ID
      formData.append('name', data.name);
      formData.append('quantity', data.quantity.toString());
      formData.append('status', data?.status === 'Active' ? '1' : '0');
      formData.append('price', data.price.toString());
      if (data.productCharsSelected) {
        for (const value of data.productCharsSelected) {
          formData.append('productCharValues', value.toString());
        }
      }
      console.log(data.priority);
      if (data.priority) {
        for (const value of data.priority) {
          formData.append('priority', value.toString());
        }
      }

      if (data.description !== currentProduct?.description) {
        console.log(data.description);
        console.log(currentProduct?.description);
        const blob = new Blob([data.description], { type: 'text/html' });
        formData.append('description', blob, `${data.name}.html`);
      }
      await productApi.createProduct(formData);
      enqueueSnackbar(!isEdit ? 'Create success!' : 'Update success!');
      // navigate(PATH_DASHBOARD.eCommerce.list);
    } catch (error) {
      console.error(error);
      if (isMountedRef.current) {
        setError('afterSubmit', error);
      }
    }
  };
  const handleDrop = useCallback(
    (acceptedFiles) => {
      // Tạo một bản sao của giá trị 'images' hiện tại
      const existingImages = [...getValues('images')];

      // Thêm các ảnh mới vào mảng hiện tại
      const updatedImages = acceptedFiles.map((file: Blob | MediaSource) =>
        Object.assign(file, {
          preview: URL.createObjectURL(file),
        })
      );

      // Kết hợp ảnh cũ và ảnh mới
      const allImages = existingImages.concat(updatedImages);

      // Cập nhật giá trị 'images' với mảng mới
      setValue('images', allImages);
    },
    [getValues, setValue]
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
  useEffect(() => {
    if (currentProduct?.productSpecChars) {
      setCharsSelected(
        productChars.filter((item) =>
          currentProduct.productSpecChars.some((item2) => item.id === item2.id)
        )
      );
    }
  }, [currentProduct, productChars]);

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
  const handleSelectAllClick = (checked: boolean) => {
    if (checked) {
      const newSelecteds = charsSelected.map((n) => n.id!);
      setValueSelected(newSelecteds);
      return;
    }
    setValueSelected([]);
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

  const emptyRowsChar =
    pageChar > 0 ? Math.max(0, (1 + pageChar) * rowsPerPageChar - productChars.length) : 0;
  const emptyRowsValue =
    pageValue > 0 ? Math.max(0, (1 + pageValue) * rowsPerPageValue - charsSelected.length) : 0;

  const filtereProductChars = applySortFilter(
    productChars,
    getComparator(order, orderBy),
    charFilterName
  );
  const filtereProductValue = applySortFilter(
    charsSelected,
    getComparator(order, orderBy),
    valueFilterName
  );

  const isNotFoundProductChar = !filtereProductChars.length && Boolean(charFilterName);
  const isNotFoundProductValue = !filtereProductValue.length && Boolean(valueFilterName);
  const [searchText, setSearchText] = useState<string>('');
  const handleMenuOpen = () => {
    setSearchText('');
  };

  useEffect(() => {
    console.log(getValues('priority'));
  }, [getValues('priority')]);
  //-----------------------------------------------------------------------------------------------------------

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={3}>
        {' '}
        {!!errors.afterSubmit && <Alert severity="error">{errors.afterSubmit.message}</Alert>}
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
                    <Controller
                      control={control}
                      name="productCharsSelected"
                      render={({ field }) => {
                        const handleDeleteValues = (ids: (number | null)[]) => {
                          const validIds = ids.filter((id) => id !== null) as number[];

                          if (validIds.length > 0) {
                            const deleteProducts = charsSelected.filter(
                              (product) => !ids.includes(product.id)
                            );
                            const deleteProduct2 = charsSelected.filter((product) =>
                              ids.includes(product.id)
                            );
                            const rest = field.value.filter((value) => {
                              return !deleteProduct2
                                ?.flatMap((item) => item.productSpecCharValueDTOS!)
                                ?.some((item) => item.id === value);
                            });
                            field.onChange(rest);
                            setValueSelected([]);
                            setCharsSelected(deleteProducts);
                          }
                        };
                        return (
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
                                <Table>
                                  <ProductCharListHead
                                    order={order}
                                    orderBy={orderBy}
                                    headLabel={TABLE_HEAD_VALUE}
                                    rowCount={charsSelected.length}
                                    numSelected={valueSelected.length}
                                    onRequestSort={handleRequestSort}
                                    onSelectAllClick={handleSelectAllClick}
                                  />

                                  <TableBody>
                                    {filtereProductValue
                                      .slice(
                                        pageValue * rowsPerPageValue,
                                        pageValue * rowsPerPageValue + rowsPerPageValue
                                      )
                                      .map((row) => {
                                        const { id, name, productSpecCharValueDTOS } = row;

                                        const isItemSelected = valueSelected.indexOf(id!) !== -1;
                                        const handleSelectAll = (event: any, field: any) => {
                                          const value = event.target.value;
                                          const elementsOnlyInList2 = getValues('priority')?.filter((item:number) => !value.includes(item));
                                          setValue('priority',elementsOnlyInList2);
                                          if (
                                            !value[value.length - 1] &&
                                            value.length != 0 &&
                                            productSpecCharValueDTOS?.length !== 0
                                          ) {
                                            if (
                                              productSpecCharValueDTOS?.filter((item) => {
                                                return value.some((fieldItem: number) => {
                                                  return fieldItem === item.id;
                                                });
                                              }).length !== productSpecCharValueDTOS?.length
                                            ) {
                                              const newValue = productSpecCharValueDTOS
                                                ?.filter(
                                                  (item) => item.value.indexOf(searchText) > -1
                                                )
                                                .filter((item: ProductCharValue) => {
                                                  return !field.value.some((item2: number) => {
                                                    return item2 === item.id;
                                                  });
                                                })
                                                .map((item) => item.id);
                                              field.onChange([...field.value, ...newValue!]);
                                              return;
                                            } else {
                                              const newValue = value.filter((item: number) => {
                                                return !productSpecCharValueDTOS?.some((item2) => {
                                                  return (
                                                    typeof item === 'undefined' || item2.id === item
                                                  );
                                                });
                                              });
                                              field.onChange(newValue);
                                              return;
                                            }
                                          } else {
                                            if (
                                              productSpecCharValueDTOS?.filter((item) => {
                                                return value.some((fieldItem: number) => {
                                                  return fieldItem === item.id;
                                                });
                                              }).length === productSpecCharValueDTOS?.length
                                            ) {
                                              const newValue = productSpecCharValueDTOS
                                                ?.filter((item: ProductCharValue) => {
                                                  return !field.value.some((item2: number) => {
                                                    return item2 === item.id;
                                                  });
                                                })
                                                .map((item) => item.id);
                                              field.onChange([...field.value, ...newValue!]);
                                              return;
                                            } else {
                                              field.onChange(value);
                                            }
                                          }
                                        };
                                        const handleSearchChange = (
                                          ev: React.ChangeEvent<HTMLTextAreaElement>
                                        ) => {
                                          ev.stopPropagation();
                                          const newSearchText = ev.target.value;
                                          setSearchText(newSearchText);
                                        };
                                        const handleDeleteValue = (id: number | null) => {
                                          if (id) {
                                            const deleteProduct = charsSelected.filter(
                                              (product) => product.id !== id
                                            );
                                            const deleteProduct2 = charsSelected.find(
                                              (product) => product.id === id
                                            );

                                            const rest = field.value.filter((value) => {
                                              return !deleteProduct2?.productSpecCharValueDTOS?.some(
                                                (item) => item.id === value
                                              );
                                            });
                                            field.onChange(rest);
                                            setCharsSelected(deleteProduct);
                                          }
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
                                              <FormControl>
                                                <InputLabel id={id?.toString()}>
                                                  Char Values
                                                </InputLabel>
                                                <Select
                                                  MenuProps={MenuProps}
                                                  {...field}
                                                  onOpen={handleMenuOpen}
                                                  style={{ width: '100px' }}
                                                  multiple
                                                  label="Char Values"
                                                  onChange={(e: any) => handleSelectAll(e, field)}
                                                  renderValue={(selected) => {
                                                    if (
                                                      productSpecCharValueDTOS?.filter((item) => {
                                                        return field.value.some(
                                                          (fieldItem: number) => {
                                                            return fieldItem === item.id;
                                                          }
                                                        );
                                                      }).length ===
                                                        productSpecCharValueDTOS?.length &&
                                                      productSpecCharValueDTOS?.length !== 0
                                                    ) {
                                                      return 'All';
                                                    }
                                                    return productSpecCharValueDTOS
                                                      ?.filter((item) =>
                                                        selected.includes(item.id!)
                                                      )

                                                      .map((item: any) => item.value)
                                                      .join(', ');
                                                  }}
                                                >
                                                  <MenuItem key={row.id}>
                                                    <Checkbox
                                                      id={id!.toString()}
                                                      checked={
                                                        productSpecCharValueDTOS?.filter((item) => {
                                                          return field.value.some(
                                                            (fieldItem: number) => {
                                                              return fieldItem === item.id;
                                                            }
                                                          );
                                                        }).length ===
                                                          productSpecCharValueDTOS?.filter(
                                                            (item) =>
                                                              item.value.indexOf(searchText) > -1
                                                          )?.length &&
                                                        productSpecCharValueDTOS?.length !== 0
                                                      }
                                                    />
                                                    <TextField
                                                      type="text"
                                                      placeholder="Search Values"
                                                      value={searchText}
                                                      onChange={handleSearchChange}
                                                      onClickCapture={(e) => e.stopPropagation()}
                                                      onKeyDown={(e) => e.stopPropagation()}
                                                      size="small"
                                                      InputProps={{
                                                        startAdornment: (
                                                          <InputAdornment position="start">
                                                            <Search />
                                                          </InputAdornment>
                                                        ),
                                                      }}
                                                      fullWidth
                                                    />
                                                  </MenuItem>
                                                  {productSpecCharValueDTOS
                                                    ?.filter(
                                                      (item) => item.value.indexOf(searchText) > -1
                                                    )
                                                    .map((option: any, index) => (
                                                      <MenuItem
                                                        sx={{
                                                          backgroundColor:
                                                            index % 2 === 0
                                                              ? '#f9f9f9'
                                                              : 'transparent',
                                                        }}
                                                        key={option.id}
                                                        value={option.id}
                                                      >
                                                        <Stack direction="column">
                                                          <Stack
                                                            direction="row"
                                                            alignItems="center"
                                                          >
                                                            <Checkbox
                                                              checked={field.value
                                                                .map((item: number) => {
                                                                  return item;
                                                                })
                                                                .includes(option.id)}
                                                            />
                                                            <ListItemText primary={option.value} />
                                                          </Stack>
                                                          <Divider></Divider>
                                                          <Stack
                                                            onClick={(e) => {
                                                              e.stopPropagation();
                                                            }}
                                                            direction="row"
                                                            alignItems="center"
                                                          >
                                                            <Checkbox
                                                              onChange={(e) => {
                                                                const priorityValues =
                                                                  getValues('priority') || []; // Use empty array if 'priority' is null or undefined

                                                                if (e.target.checked) {
                                                                  setValue('priority', [
                                                                    ...priorityValues,
                                                                    option.id,
                                                                  ]);
                                                                } else {
                                                                  const newValue =
                                                                    priorityValues.filter(
                                                                      (item) => item !== option.id
                                                                    );
                                                                  setValue('priority', newValue);
                                                                }
                                                              }}
                                                              disabled={
                                                                !field.value
                                                                  .map((item: number) => item)
                                                                  .includes(option.id)
                                                              }
                                                              checked={
                                                                !!(
                                                                  getValues('priority') &&
                                                                  getValues('priority').includes(
                                                                    option.id
                                                                  ) &&
                                                                  field.value
                                                                    .map((item: number) => item)
                                                                    .includes(option.id)
                                                                )
                                                              }
                                                            />

                                                            <ListItemText primary={'display'} />
                                                          </Stack>
                                                        </Stack>
                                                      </MenuItem>
                                                    ))}
                                                </Select>
                                              </FormControl>
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
                        );
                      }}
                    />
                  </Grid>
                </Grid>{' '}
              </Card>
            </Grid>
          </Grid>
          <Card sx={{ p: 3 }}>
                <Stack spacing={3} mb={2}>
                  <RHFColorPicker name="color" label="Color" />
                </Stack>
              </Card>

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

                  <RHFSelect name="productTypeId" label="Product Type">
                    <option value=""></option>
                    {productTypes
                      .filter((productType) => productType.status)
                      .map((productType) => (
                        <option key={productType.id} value={productType.id!}>
                          {productType.name}
                        </option>
                      ))}
                  </RHFSelect>
                </Stack>
              </Card>
              <Card sx={{ p: 3 }}>
                <Stack spacing={3} mb={2}>
                  <RHFTextField
                    name="price"
                    label="Price"
                    placeholder="0.00"
                    value={getValues('price') === 0 ? '' : getValues('price')}
                    onChange={(event) => setValue('price', Number(event.target.value))}
                    InputLabelProps={{ shrink: true }}
                    InputProps={{
                      startAdornment: <InputAdornment position="start">₫</InputAdornment>,
                      type: 'number',
                    }}
                  />
                </Stack>
              </Card>

              <Card sx={{ p: 3 }}>
                <Stack spacing={3} mb={2}>
                  <RHFTextField name="quantity" label="Quantity" />
                </Stack>
              </Card>

           


              <LoadingButton type="submit" variant="contained" size="large" loading={isSubmitting}>
                {!isEdit ? 'Create Product' : 'Save Changes'}
              </LoadingButton>
            </Stack>
          </Grid>
        </Grid>
      </Stack>
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
