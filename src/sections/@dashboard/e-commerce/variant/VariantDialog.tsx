import { useCallback } from 'react';
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
  statusVariant: string;
  afterSubmit?: string;
}

type Props = {
  isOpenCompose: boolean;
  onCloseCompose: VoidFunction;
  variant: Variant;
  setVariant: (variant: Variant) => void;
  //   isEdit: boolean;
  //   setProductCharValues: (productCharValues: any) => void;
  //   setProductCharValue: (productCharValues: any) => void;
};

export default function VariantDialog({
  isOpenCompose,
  onCloseCompose,
  variant,setVariant
}: //   setProductCharValue,
//   setProductCharValues,
Props) {
  const defaultValues = {
    quantityVariant: variant?.quantity?.toString() || '',
    imageVariant: variant?.image,
    priceVariant: variant?.price?.toString() || '',
    statusVariant: variant ? (variant.status ? 'Active' : 'InActive') : 'Active',
    descriptionVariant: variant?.description || '',
  };

  const variantSchema = Yup.object().shape({
    quantityVariant: Yup.number().required().moreThan(0, 'Quantity is required'),
    priceVariant: Yup.number().required().moreThan(0, 'Price should not be ₫0.00'),
    imageVariant: Yup.mixed().required('Thumbnail is required'),
    statusVariant: Yup.string().required('Status is required'),
  });

  const childMethod = useForm<VariantForm>({
    resolver: yupResolver(variantSchema),
    defaultValues,
  });
  const isMountedRef = useIsMountedRef();
  //   useEffect(() => {
  //     // if (isEdit && productCharValue) {
  //     //   reset(defaultValues);
  //     // //   setValue('statusCharValue', defaultValues.statusCharValue, { shouldValidate: true });
  //     // }
  //     // if (!isEdit) {
  //     //   reset(defaultValues);
  //     // }
  //     // eslint-disable-next-line react-hooks/exhaustive-deps
  //   }, [isEdit]);
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
        image:data.imageVariant,
        description: data.descriptionVariant,
        quantity: +data.quantityVariant,
        price: +data.priceVariant,
        status: data.imageVariant === 'Active' ? true : false,
        updateDatetime: variant.id? new Date():null,
        updateUser:variant.id? user?.id || null:null,
        createDatetime:variant.id? variant.createDatetime: new Date(),
        createUser: variant.id? variant.updateUser: user?.id||null
      };
      setVariant(newVariant)
      // Check if the data.codeCharValue is unique

      //   if (isEdit) {
      //     const isDuplicate = await productSpecCharApi.checkDuplicateCode(data.valueCharValue,productCharValue.id, productChar.id);
      //     console.log(isDuplicate)
      //     if (isDuplicate && data.valueCharValue !== productCharValue?.value) {
      //       throw new Error('Code is not unique');
      //     }
      //     const isCodeUnique = !productCharValues.some(
      //       (charValue) =>
      //         charValue.value === data.valueCharValue && data.valueCharValue !== productCharValue?.value
      //     );
      //     if (!isCodeUnique) {
      //       throw new Error('Code is not unique');
      //     }

      //     const deleteProductCharValues = productCharValues.filter(
      //       (charValue) => charValue.value !== productCharValue?.value
      //     );

      //     const newProductCharValue: ProductCharValue = {
      //       ...productCharValue,
      //       description: data.descriptionCharValue,
      //       value: data.valueCharValue,
      //       status: data.statusCharValue === 'Active' ? true : false,
      //       updateDatetime: new Date(),
      //       updateUser: user?.id || null,
      //     };
      //     setProductCharValue(newProductCharValue);
      //     const newProductCharValues = [...deleteProductCharValues, newProductCharValue];
      //     setProductCharValues(newProductCharValues);
      //   } else {
      //     const isDuplicate = await productSpecCharApi.checkDuplicateCode(data.valueCharValue,productCharValue.id, productChar.id);
      //     const isCodeUnique = !productCharValues.some(
      //       (productCharValue) => productCharValue.value === data.valueCharValue
      //     );
      //     if (!isCodeUnique || isDuplicate) {
      //       throw new Error('Code is not unique');
      //     }
      //     const newProductCharValue: ProductCharValue = {
      //       id: null,
      //       priority:-1,
      //       description: data.descriptionCharValue,
      //       value: data.valueCharValue,
      //       status: data.statusCharValue === 'Active' ? true : false,
      //       createDatetime: new Date(),
      //       updateDatetime: null,
      //       createUser: user?.id || null,
      //       updateUser: null,
      //     };
      //     const newProductCharValues = [...productCharValues, newProductCharValue];
      //     setProductCharValues(newProductCharValues);
      //   }
      // reset();
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
                <RHFUploadAvatar
                  name="imageVariant"
                  accept="image/*"
                  maxSize={3145728}
                  onDrop={handleDrop2}
                />
                <TextField   value={variant.name? variant.name:'Default'} label="Name" />
                <RHFTextField type="number" name="quantityVariant" label="Quantity" />
                <RHFTextField type="number" name="priceVariant" label="Price" />
                <RHFTextField name="descriptionVariant" label="Description" />
                <RHFSelect
                  name="statusCharValue"
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
