import { useCallback, useEffect, useMemo } from 'react';
import * as Yup from 'yup';
// @mui
import { yupResolver } from '@hookform/resolvers/yup';
import { alpha } from '@mui/material/styles';
import {
  Alert,
  Backdrop,
  Box,
  Button,
  Grid,
  IconButton,
  Input,
  List,
  ListItem,
  ListItemText,
  Portal,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { UseFormSetValue, useForm } from 'react-hook-form';
import { Variant } from 'src/@types/product';
import Iconify from 'src/components/Iconify';
import { FormProvider, RHFSelect, RHFTextField, RHFUploadAvatar } from 'src/components/hook-form';
import useIsMountedRef from 'src/hooks/useIsMountedRef';
import useAuth from 'src/hooks/useAuth';
import MultiFilePreview from 'src/components/upload/MultiFilePreview';
import { varFade } from 'src/components/animate';
import { AnimatePresence, m } from 'framer-motion';
import { isString } from 'lodash';
import { fData } from 'src/utils/formatNumber';
import { CustomFile } from 'src/components/upload';
import Image from 'src/components/Image';
import { DropEvent, FileRejection } from 'react-dropzone';
import { fil } from 'date-fns/locale';
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
  onRemove: (file: File | string) => void;
  onRemoveAll: VoidFunction;
  files: (File | string)[];
  setValue: UseFormSetValue<any>;
  variant: Variant;
  setVariant: (variant: Variant) => void;

  //   variant: Variant;
  //   setVariant: (variant: Variant) => void;
  //   isEdit: boolean;
  //   setProductCharValues: (productCharValues: any) => void;
  //   setProductCharValue: (productCharValues: any) => void;
};

export default function VariantImageDialog({
  isOpenCompose,
  onCloseCompose,
  onRemove,
  onRemoveAll,
  files,
  setValue,
  variant,
  setVariant,
}: //   variant,
//   setVariant,
Props) {
  //   const defaultValues = useMemo(() => {
  //     return {
  //       quantityVariant: variant?.quantity?.toString() || '',
  //       imageVariant: variant?.image,
  //       priceVariant: variant?.price?.toString() || '',
  //       statusVariant: variant ? (variant.status ? 'Active' : 'InActive') : 'Active',
  //       descriptionVariant: variant?.description || '',
  //     };
  //   }, [variant]);

  const variantSchema = Yup.object().shape({
    quantityVariant: Yup.number().required().moreThan(0, 'Quantity is required'),
    priceVariant: Yup.number().required().moreThan(0, 'Price should not be ₫0.00'),
    imageVariant: Yup.mixed().required('Thumbnail is required'),
    statusVariant: Yup.string().required('Status is required'),
  });

  const childMethod = useForm<VariantForm>({
    resolver: yupResolver(variantSchema),
    // defaultValues,
  });
  const isMountedRef = useIsMountedRef();

  //   useEffect(() => {
  //     if (variant) {
  //       reset(defaultValues);
  //     }
  //   }, [variant]);
  const {
    reset,
    // setValue,
    setError,
    handleSubmit,
    formState: { errors },
  } = childMethod;
  const { user } = useAuth();

  const handleChildFormSubmit = async (data: VariantForm) => {
    try {
      //   const newVariant: Variant = {
      //     ...variant,
      //     image: data.imageVariant,
      //     description: data.descriptionVariant,
      //     quantity: +data.quantityVariant,
      //     price: +data.priceVariant,
      //     status: data.statusVariant === 'Active' ? true : false,
      //     updateDatetime: variant.id ? new Date() : null,
      //     updateUser: variant.id ? user?.id || null : null,
      //     createDatetime: variant.id ? variant.createDatetime : new Date(),
      //     createUser: variant.id ? variant.updateUser : user?.id || null,
      //   };
      //   setVariant(newVariant);
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

  const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
  });
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
  const hasFile = files.length > 0;
  const handleSelectImageVariant = async (file: string | File) => {
    console.log(file);
    const newvariant = { ...variant, image: file };
    setVariant(newvariant);
  };

  const animateVariants = {
    clicked: {
      scale: [1, 1.1, 1],
      transition: {
        duration: 0.3,
      },
    },
  };

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
              md: `calc(100% - 50%)`,
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
          <Typography variant="h6">Edit Image Variant</Typography>
          <Box sx={{ flexGrow: 1 }} />
          <IconButton onClick={handleClose}>
            <Iconify icon={'eva:close-fill'} width={20} height={20} />
          </IconButton>
        </Box>
        {!!errors.afterSubmit && <Alert severity="error">{errors.afterSubmit.message}</Alert>}
        <Grid container spacing={3}>
          <Grid item xs={12} md={12}>
            {/* <Box
                sx={{
                  p: 3,
                  display: 'grid',

                  columnGap: 3,
                  rowGap: 3,
                  gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' },
                }}
              > */}
            <>
              <List disablePadding sx={{ ...(hasFile && { p: 3, my: 3 }) }}>
                <AnimatePresence>
                  {files.map((file) => {
                    const { key, name, size, preview } = getFileData(file as CustomFile);

                    return (
                      <ListItem
                        onClick={() => {
                          handleSelectImageVariant(file);
                        }}
                        key={key}
                        component={m.div}
                        variants={animateVariants}
                        whileTap="clicked"
                        {...varFade().inRight}
                        sx={{
                          p: 0.5,
                          m: 0.5,
                          width: 80,
                          height: 80,
                          borderRadius: 1.25,
                          overflow: 'hidden',
                          position: 'relative',
                          display: 'inline-flex',
                          border: (theme) =>
                            variant.image === file ||
                            (variant.image&&typeof variant.image !== 'string' && variant.image.path == file)
                              ? `solid 1px #0C68F4`
                              : `solid 1px ${theme.palette.divider}`,
                        }}
                      >
                        <Image alt="preview" src={isString(file) ? file : preview} ratio="1/1" />
                        <IconButton
                          size="small"
                          onClick={(e) => {e.stopPropagation()
                            onRemove(file)}}
                          sx={{
                            top: 6,
                            p: '2px',
                            right: 6,
                            position: 'absolute',
                            color: 'common.white',
                            bgcolor: (theme) => alpha(theme.palette.grey[900], 0.72),
                            '&:hover': {
                              bgcolor: (theme) => alpha(theme.palette.grey[900], 0.48),
                            },
                          }}
                        >
                          <Iconify icon={'eva:close-fill'} />
                        </IconButton>
                      </ListItem>
                    );
                  })}
                </AnimatePresence>
              </List>
            </>
          </Grid>
        </Grid>
        <Stack
          alignItems="center"
          flexDirection="row"
          justifyContent="center"
          sx={{ mt: 3, mb: 3 }}
        >
          <Stack flexDirection="row" sx={{ gap: 3 }}>
            <Button
              component="label"
              variant="contained"
              startIcon={<Iconify icon={'material-symbols:file-upload'} />}
            >
              Upload file
              <VisuallyHiddenInput
                onChange={(event) => {
                  const file = event?.target?.files && event.target.files[0];
                  const existingImages = [...files];
                  // Thêm các ảnh mới vào mảng hiện tại
                  const updatedImages = Object.assign(file!, {
                    preview: URL.createObjectURL(file!),
                  });
                  if (
                    !existingImages.some(
                      (item: File | string) =>
                        (typeof item === 'string' && item === updatedImages.name) ||
                        (typeof item !== 'string' && item.name === updatedImages.name)
                    )
                  ) {
                    const allImages = existingImages.concat(updatedImages);
                    setValue('images', allImages);
                  }
                }}
                type="file"
              />
            </Button>
            {hasFile && (
              <Button type="button" variant="contained" onClick={onRemoveAll}>
                Remove all
              </Button>
            )}
          </Stack>
        </Stack>
      </RootStyle>
    </Portal>
  );
}
const getFileData = (file: CustomFile | string) => {
  if (typeof file === 'string') {
    return {
      key: file,
    };
  }
  return {
    key: file.name,
    name: file.name,
    size: file.size,
    preview: file.preview,
  };
};
