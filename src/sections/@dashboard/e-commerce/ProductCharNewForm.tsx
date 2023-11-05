import * as Yup from 'yup';
import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';
import { useCallback, useEffect, useMemo, useState } from 'react';
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
  Box,
  Button,
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
} from '../../../components/hook-form';
import ProductCharValueList from './product-char-value/ProductCharValueList';
import Iconify from 'src/components/Iconify';

// ----------------------------------------------------------------------

const GENDER_OPTION = ['Men', 'Women', 'Kids'];

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

interface FormValuesProps  {
  name: string;
  code: string;
  status:string;
}

type Props = {
  isEdit: boolean;
  currentProduct?: Product;
};

export default function ProductCharcNewForm({ isEdit, currentProduct }: Props) {
  const navigate = useNavigate();
  
  const { enqueueSnackbar } = useSnackbar();

  const NewProductSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    code: Yup.string().required('Description is required'),
  });

  const defaultValues = useMemo(
    () => ({
      name: currentProduct?.name || '',
      description: currentProduct?.description || '',
      images: currentProduct?.images || [],
      code: currentProduct?.code || '',
      sku: currentProduct?.sku || '',
      price: currentProduct?.price || 0,
      priceSale: currentProduct?.priceSale || 0,
      tags: currentProduct?.tags || [TAGS_OPTION[0]],
      inStock: true,
      taxes: true,
      gender: currentProduct?.gender || GENDER_OPTION[2],
      category: currentProduct?.category || CATEGORY_OPTION[0].classify[1],
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

  const onSubmit2 = async (data: FormValuesProps) => {
    try {
      // await new Promise((resolve) => setTimeout(resolve, 500));
      // reset();
      // enqueueSnackbar(!isEdit ? 'Create success!' : 'Update success!');
      // navigate(PATH_DASHBOARD.eCommerce.list);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <FormProvider   methods={methods} onSubmit={handleSubmit(onSubmit2)}>
    <Grid container spacing={3}>
      <Grid item xs={12} md={12}>
        <Card sx={{ p: 3 }}>
          <Box
            sx={{
              display: 'grid',
              columnGap: 3,
              rowGap: 3,
              gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(3, 1fr)' },
            }}
          >
            <RHFTextField name="name" label="Name" />
            <RHFTextField name="code" label="Code" />
            <RHFSelect name="status" label="Status">
            <option>
             Active
            </option>
             <option>
             Inactive
            </option>
            </RHFSelect>
        
          </Box>
          <ProductCharValueList ></ProductCharValueList>   
          <Stack alignItems="flex-end" sx={{ mt: 3 }}>
            <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
              {!isEdit ? 'Create product characteristic' : 'Save Changes'}
            </LoadingButton>
          </Stack>
        </Card>
      </Grid>
    </Grid>
  </FormProvider>
  );
}
