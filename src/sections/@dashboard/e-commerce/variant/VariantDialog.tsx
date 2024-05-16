import { useCallback, useEffect, useMemo } from 'react';
import * as Yup from 'yup';
// @mui
import { yupResolver } from '@hookform/resolvers/yup';
import {
  Alert,
  Backdrop,
  Box,
  Button,
  Grid,
  IconButton,
  Input,
  Portal,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { useForm } from 'react-hook-form';
import { Variant } from 'src/@types/product';
import Iconify from 'src/components/Iconify';
import { FormProvider, RHFSelect, RHFTextField, RHFUploadAvatar } from 'src/components/hook-form';
import useIsMountedRef from 'src/hooks/useIsMountedRef';
import useAuth from 'src/hooks/useAuth';
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
interface VariantForm {
  quantityVariant: string;
  descriptionVariant: string;
  imageVariant: File | string;
  priceVariant: string;
  discountPriceVariant: string;
  statusVariant: string;
  afterSubmit?: string;
}

type Props = {
  isOpenCompose: boolean;
  onCloseCompose: VoidFunction;
  variant: Variant;
  setVariant: (variant: Variant) => void;
};

export default function VariantDialog({
  isOpenCompose,
  onCloseCompose,
  variant,
  setVariant,
}: Props) {
  const defaultValues = useMemo(() => {
    return {
      quantityVariant: variant?.quantity?.toString() || '',
      priceVariant: variant?.price?.toString() || '',
      statusVariant: variant.status ? (variant.status ? 'Active' : 'InActive') : 'Active',
      descriptionVariant: variant?.description || '',
      discountPriceVariant: variant?.discountPrice?.toString() || '',
    };
  }, [variant]);

  const variantSchema = Yup.object().shape({
    quantityVariant: Yup.number().required().moreThan(0, 'Quantity is required'),
    priceVariant: Yup.string().required('Price is required'),
    statusVariant: Yup.string().required('Status is required'),
  });
  //
  const childMethod = useForm<VariantForm>({
    resolver: yupResolver(variantSchema),
    defaultValues,
  });
  const isMountedRef = useIsMountedRef();
  useEffect(() => {
    if (variant) {
      reset(defaultValues);
    }
  }, [variant]);
  const {
    reset,
    setValue,
    setError,
    handleSubmit,
    formState: { errors },
  } = childMethod;
  const { user } = useAuth();

  const handleChildFormSubmit = async (data: VariantForm) => {
    try {
      const newVariant: Variant = {
        ...variant,
        description: data.descriptionVariant,
        quantity: +data.quantityVariant,
        price: Number(data.priceVariant.toString().replace('.','')),
        discountPrice:data.discountPriceVariant?Number(data.discountPriceVariant.toString().replace('.','')):null,
        status: data.statusVariant === 'Active' ? true : false,
        updateDatetime: variant.id ? new Date() : null,
        updateUser: variant.id ? user?.id || null : null,
        createDatetime: variant.id ? variant.createDatetime : new Date(),
        createUser: variant.id ? variant.updateUser : user?.id || null,
      };
      setVariant(newVariant);
    } catch (error) {
      console.log(error);
      if (isMountedRef.current) {
        setError('afterSubmit', { type: 'custom', message: error.message });
      }
    }
  };

  type Field = 'statusVariant';

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, field: Field) => {
    const selectedValue = e.target.value;
    setValue(field, selectedValue, { shouldValidate: true });
  };

  const handleCreateButtonClick = () => {
    handleSubmit(handleChildFormSubmit)();
  };

  const handleClose = () => {
    reset();
    onCloseCompose();
  };

  const handleDrop2 = useCallback(
    (acceptedFiles) => {
      const file = acceptedFiles[0];

      if (file) {
        setValue(
          'imageVariant',
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          })
        );
      }
    },
    [setValue]
  );

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
          <Typography variant="h6">Edit</Typography>
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
                <TextField value={variant.name ? variant.name : 'Default'} label="Name" />
                <RHFTextField type="number" name="quantityVariant" label="Quantity" />
                <RHFTextField type="number" name="priceVariant" label="Price" />
                <RHFTextField type="number" name="discountPriceVariant" label="Discount Price" />
                <RHFTextField name="descriptionVariant" label="Description" />
                <RHFSelect
                  name="statusVariant"
                  label="Status"
                  onChange={(e) =>
                    handleChange(e as React.ChangeEvent<HTMLInputElement>, 'statusVariant')
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
              Save
            </Button>
          </Stack>
        </FormProvider>
      </RootStyle>
    </Portal>
  );
}
