import * as Yup from 'yup';
import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { LoadingButton } from '@mui/lab';
import { Alert, Box, Card, Grid, Stack } from '@mui/material';
// routes
// @types
import { ProductChar, ProductCharValue } from '../../../@types/product';
// components
import { FormProvider, RHFSelect, RHFTextField } from '../../../components/hook-form';
import ProductCharValueList from './product-char-value/ProductCharValueList';
import useAuth from '../../../hooks/useAuth';
import { productSpecCharApi } from '../../../service/app-apis/product-char';
import useIsMountedRef from '../../../hooks/useIsMountedRef';

// ----------------------------------------------------------------------

// ----------------------------------------------------------------------

interface FormValuesProps {
  name: string;
  code: string;
  description: string;
  status: string;
  afterSubmit?: string;
}

type Props = {
  isEdit: boolean;
  productChar?: ProductChar;
};

export default function ProductCharNewForm({ isEdit, productChar }: Props) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [productCharValues, setproductCharValues] = useState<ProductCharValue[]>([]);
  const { enqueueSnackbar } = useSnackbar();
  const setProductCharValues = (productCharValueCodes: any) => {
    setproductCharValues(productCharValueCodes);
  };
  const NewProductSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    code: Yup.string().required('Description is required'),
  });

  const defaultValues = useMemo(
    () => ({
      name: productChar?.name || '',
      code: productChar?.code || '',
      status: productChar
      ? productChar.status
          ? 'Active'
          : 'InActive'
      : 'Active',
      description: productChar?.description || '',
    }),
    [productChar]
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

  useEffect(() => {
    if (isEdit && productChar) {
      reset(defaultValues);
    }
    if (!isEdit) {
      reset(defaultValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEdit, productChar]);

  const onSubmit2 = async (data: FormValuesProps) => {
    try {
      const productChar: ProductChar = {
        id: null,
        status: data.status === 'Active' ? true : false,
        createDatetime: new Date(),
        updateDatetime: null,
        createUser: user?.id || null,
        updateUser: null,
        description: data.description,
        name: data.name,
        code: data.code,
        productSpecCharValueDTOS: productCharValues,
      };
      await productSpecCharApi.createProductSpecChar(productChar);
      reset();
      setproductCharValues([]);
      // await new Promise((resolve) => setTimeout(resolve, 500));
      // reset();
      // enqueueSnackbar(!isEdit ? 'Create success!' : 'Update success!');
      // navigate(PATH_DASHBOARD.eCommerce.list);
    } catch (error) {
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
  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit2)}>
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
              <RHFTextField name="code" label="Code" />
              <RHFTextField name="description" label="Description" />
              <RHFSelect
                name="status"
                label="Status"
                onChange={(e) => handleChange(e as React.ChangeEvent<HTMLInputElement>, 'status')}
              >
                <option>Active</option>
                <option>InActive</option>
              </RHFSelect>
            </Box>
            <ProductCharValueList
              setCharValues={setProductCharValues}
              charValues={productCharValues}
            />
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
