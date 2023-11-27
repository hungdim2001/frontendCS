import * as Yup from 'yup';
import { useEffect, useState } from 'react';
// @mui
import { styled } from '@mui/material/styles';
import {
  Box,
  Input,
  Portal,
  Button,
  Divider,
  Backdrop,
  IconButton,
  Typography,
  Grid,
  Card,
  Stack,
  Alert,
} from '@mui/material';
import useResponsive from 'src/hooks/useResponsive';
import Iconify from 'src/components/Iconify';
import { FormProvider, RHFSelect, RHFTextField } from 'src/components/hook-form';
import { LoadingButton } from '@mui/lab';
import { useForm } from 'react-hook-form';
import { ProductCharValue } from 'src/@types/product';
import { yupResolver } from '@hookform/resolvers/yup';
import useIsMountedRef from 'src/hooks/useIsMountedRef';
import { productSpecCharApi } from '../../../../service/app-apis/product-char';
import useAuth from '../../../../hooks/useAuth';
import { useSelector } from 'src/redux/store';
// hooks
// components

// ----------------------------------------------------------------------

const RootStyle = styled('div')(({ theme }) => ({
  // margin: 'auto',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  zIndex: 1999,
  //   minHeight: 440,
  outline: 'none',
  display: 'flex',
  position: 'fixed',
  overflow: 'hidden',
  flexDirection: 'column',
  margin: theme.spacing(3),
  boxShadow: theme.customShadows.z20,
  borderRadius: Number(theme.shape.borderRadius) * 2,
  backgroundColor: theme.palette.background.paper,
}));

const InputStyle = styled(Input)(({ theme }) => ({
  padding: theme.spacing(0.5, 3),
  borderBottom: `solid 1px ${theme.palette.divider}`,
}));

// ----------------------------------------------------------------------
interface productCharValueForm {
  valueCharValue: string;
  statusCharValue: string;
  descriptionCharValue: string;
  afterSubmit?: string;
}

type Props = {
  isOpenCompose: boolean;
  onCloseCompose: VoidFunction;
  productCharValues: ProductCharValue[];
  productCharValue: ProductCharValue;
  isEdit: boolean;
  setProductCharValues: (productCharValues: any) => void;
  setProductCharValue: (productCharValues: any) => void;
};

export default function ProductCharValueDialog({
  isOpenCompose,
  onCloseCompose,
  productCharValues,
  productCharValue,
  isEdit,
  setProductCharValue,
  setProductCharValues,
}: Props) {
  const defaultValues = {
    valueCharValue: productCharValue?.value || '',
    statusCharValue: productCharValue
      ? productCharValue.status
        ? 'Active'
        : 'InActive'
      : 'Active',
    descriptionCharValue: productCharValue?.description || '',
  };

  const { user } = useAuth();


  const { productChar } = useSelector((state) => state.productChars);

  const productcharValueSchema = Yup.object().shape({
    valueCharValue: Yup.string().required('Value is required'),
    statusCharValue: Yup.string().required('Status is required'),
  });

  const childMethod = useForm<productCharValueForm>({
    resolver: yupResolver(productcharValueSchema),
    defaultValues,
  });
  const isMountedRef = useIsMountedRef();
  useEffect(() => {
    if (isEdit && productCharValue) {
      reset(defaultValues);
      setValue('statusCharValue', defaultValues.statusCharValue, { shouldValidate: true });
    }
    if (!isEdit) {
      reset(defaultValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEdit, productCharValue, productCharValue]);
  const {
    reset,
    setValue,
    setError,
    handleSubmit,
    formState: { errors },
  } = childMethod;

  const handleChildFormSubmit = async (data: productCharValueForm) => {
    try {
      // Check if the data.codeCharValue is unique

      if (isEdit) {
        const isDuplicate = await productSpecCharApi.checkDuplicateCode(data.valueCharValue,productCharValue.id, productChar.id);
        console.log(isDuplicate)
        if (isDuplicate && data.valueCharValue !== productCharValue?.value) {
          throw new Error('Code is not unique');
        }
        const isCodeUnique = !productCharValues.some(
          (charValue) =>
            charValue.value === data.valueCharValue && data.valueCharValue !== productCharValue?.value
        );
        if (!isCodeUnique) {
          throw new Error('Code is not unique');
        }

        const deleteProductCharValues = productCharValues.filter(
          (charValue) => charValue.value !== productCharValue?.value
        );

        const newProductCharValue: ProductCharValue = {
          ...productCharValue,
          description: data.descriptionCharValue,
          value: data.valueCharValue,
          status: data.statusCharValue === 'Active' ? true : false,
          updateDatetime: new Date(),
          updateUser: user?.id || null,
        };
        setProductCharValue(newProductCharValue);
        const newProductCharValues = [...deleteProductCharValues, newProductCharValue];
        setProductCharValues(newProductCharValues);
      } else {
        const isDuplicate = await productSpecCharApi.checkDuplicateCode(data.valueCharValue,productCharValue.id, productChar.id);
        const isCodeUnique = !productCharValues.some(
          (productCharValue) => productCharValue.value === data.valueCharValue
        );
        if (!isCodeUnique || isDuplicate) {
          throw new Error('Code is not unique');
        }
        const newProductCharValue: ProductCharValue = {
          id: null,
          description: data.descriptionCharValue,
          value: data.valueCharValue,
          status: data.statusCharValue === 'Active' ? true : false,
          createDatetime: new Date(),
          updateDatetime: null,
          createUser: user?.id || null,
          updateUser: null,
        };
        const newProductCharValues = [...productCharValues, newProductCharValue];
        setProductCharValues(newProductCharValues);
      }
      reset();
    } catch (error) {
      console.log(error);
      if (isMountedRef.current) {
        setError('afterSubmit', { type: 'custom', message: error.message });
      }
    }
  };

  type Field = 'statusCharValue';

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, field: Field) => {
    const selectedValue = e.target.value;
    setValue(field, selectedValue, { shouldValidate: true });
  };

  const handleCreateButtonClick = () => {
    handleSubmit(handleChildFormSubmit)();
  };

  const handleClose = () => {
    onCloseCompose();
  };
  if (!isOpenCompose) {
    return null;
  }
  return (
    <Portal>
      <Backdrop open={true} sx={{ zIndex: 1998 }} />
      <RootStyle
        sx={{
          ...{
            zIndex: 1999,
            margin: 'auto',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: {
              xs: `calc(100% - 5%)`,
              md: `calc(100% - 30%)`,
            },
          },
        }}
      >
        <Box
          sx={{
            pl: 3,
            pr: 1,
            height: 60,
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <Typography variant="h6">
            {!isEdit ? 'Create value characteristic' : 'Edit value characteristic'}
          </Typography>
          <Box sx={{ flexGrow: 1 }} />
          <IconButton onClick={handleClose}>
            <Iconify icon={'eva:close-fill'} width={20} height={20} />
          </IconButton>
        </Box>
        <FormProvider methods={childMethod}>
          {!!errors.afterSubmit && <Alert severity="error">{errors.afterSubmit.message}</Alert>}
          <Grid container spacing={3}>
            <Grid item xs={12} md={12}>
              <Box
                sx={{
                  p: 3,
                  display: 'grid',

                  columnGap: 3,
                  rowGap: 3,
                  gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' },
                }}
              >
                <RHFTextField name="valueCharValue" label="Value" />
                <RHFTextField name="descriptionCharValue" label="description" />
                <RHFSelect
                  name="statusCharValue"
                  label="Status"
                  onChange={(e) =>
                    handleChange(e as React.ChangeEvent<HTMLInputElement>, 'statusCharValue')
                  }
                >
                  <option>Active</option>
                  <option>InActive</option>
                </RHFSelect>
              </Box>
            </Grid>
          </Grid>
          <Stack alignItems="center" sx={{ mt: 3, mb: 3 }}>
            <Button type="button" variant="contained" onClick={handleCreateButtonClick}>
              {!isEdit ? 'Create' : 'Update'}
            </Button>
          </Stack>
        </FormProvider>
      </RootStyle>
    </Portal>
  );
}
