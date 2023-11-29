import * as Yup from 'yup';
import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';
import { useCallback, useEffect, useMemo } from 'react';
// form
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { styled } from '@mui/material/styles';
import { LoadingButton } from '@mui/lab';
import {
  Card,
  Chip,
  Grid,
  Stack,
  TextField,
  Typography,
  Autocomplete,
  InputAdornment,
} from '@mui/material';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// @types
import { Product } from '../../../@types/product';
// components
import {
  FormProvider,
  RHFSwitch,
  RHFSelect,
  RHFEditor,
  RHFTextField,
  RHFRadioGroup,
  RHFUploadMultiFile,
  RHFUploadSingleFile,
  RHFUploadAvatar,
} from '../../../components/hook-form';
import { getProductTypes } from 'src/redux/slices/product-type';
import { dispatch, useSelector } from 'src/redux/store';

// ----------------------------------------------------------------------

const STATUS_OPTION = ['Active', 'InActive'];

const CATEGORY_OPTION = [
  { group: 'Clothing', classify: ['Shirts', 'T-shirts', 'Jeans', 'Leather'] },
  { group: 'Tailored', classify: ['Suits', 'Blazers', 'Trousers', 'Waistcoats'] },
  { group: 'Accessories', classify: ['Shoes', 'Backpacks and bags', 'Bracelets', 'Face masks'] },
];

const TAGS_OPTION = [
  'Toy Story 3',
  'Logan',
  'Full Metal Jacket',
  'Dangal',
  'The Sting',
  '2001: A Space Odyssey',
  "Singin' in the Rain",
  'Toy Story',
  'Bicycle Thieves',
  'The Kid',
  'Inglourious Basterds',
  'Snatch',
  '3 Idiots',
];

const LabelStyle = styled(Typography)(({ theme }) => ({
  ...theme.typography.subtitle2,
  color: theme.palette.text.secondary,
  marginBottom: theme.spacing(1),
}));

// ----------------------------------------------------------------------

interface FormValuesProps {
  thumbnail: File | string;
  images: string[];
  name: string;
  price: number;
  // code: string;
  quantity: number;
  productType: number;
  // productChar:ProductChar[];
}

type Props = {
  isEdit: boolean;
  currentProduct?: Product;
};

export default function ProductNewForm({ isEdit, currentProduct }: Props) {
  const navigate = useNavigate();

  const { enqueueSnackbar } = useSnackbar();

  const { productTypes } = useSelector((state) => state.productTypes);
  useEffect(() => {
    dispatch(getProductTypes());
  }, [dispatch]);

  const NewProductSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    description: Yup.string().required('Description is required'),
    productType: Yup.string().required('Description is required'),
    images: Yup.array().min(1, 'Images is required'),
    price: Yup.number().moreThan(0, 'Price should not be $0.00'),
    thumblnai: Yup.mixed().required('Thumbnail is required'),
  });

  const defaultValues = useMemo(
      () => ({
        name: currentProduct?.name || '',
        description: currentProduct?.description || '',
        images: currentProduct?.images || [],
        thumbmail: currentProduct?.thumbnail || '',
        // code: currentProduct?.code || '',
        // sku: currentProduct?.sku || '',
        price: currentProduct?.price || 0,
        // priceSale: currentProduct?.priceSale || 0,
        // tags: currentProduct?.tags || [TAGS_OPTION[0]],
        productType: currentProduct?.productType.id!,
        // taxes: true,
        status: currentProduct?.status?STATUS_OPTION[0]:STATUS_OPTION[1] || STATUS_OPTION[0],
        // category: currentProduct?.category || CATEGORY_OPTION[0].classify[1],
      }),
      // eslint-disable-next-line react-hooks/exhaustive-deps
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
      await new Promise((resolve) => setTimeout(resolve, 500));
      reset();
      enqueueSnackbar(!isEdit ? 'Create success!' : 'Update success!');
      navigate(PATH_DASHBOARD.eCommerce.list);
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

  return (
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Card sx={{ p: 3 }}>
              <Stack spacing={3}>
                <RHFTextField name="name" label="Product Name" />
                {/* <div>
                  <LabelStyle>Thumbnail</LabelStyle>
                  <RHFUploadSingleFile
                    name="thumbnail"
                    accept="image/*"
                    maxSize={3145728}
                    onDrop={handleDrop2}
                  />
                </div> */}
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
                        startAdornment: <InputAdornment position="start">$</InputAdornment>,
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

                <RHFSwitch name="taxes" label="Price includes taxes" />
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
