import * as Yup from 'yup';
// form
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { styled } from '@mui/material/styles';
import { Button, Stack, Rating, Typography, FormHelperText } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// components
import { FormProvider, RHFTextField } from '../../../../components/hook-form';
import { ratingApi } from 'src/service/app-apis/rating';
import { Rating as RatingType } from 'src/@types/product';
import { useSelector } from 'src/redux/store';
import { stat } from 'fs';
import useAuth from 'src/hooks/useAuth';
import { useSnackbar } from 'notistack';

// ----------------------------------------------------------------------

const RootStyle = styled('div')(({ theme }) => ({
  margin: theme.spacing(3),
  padding: theme.spacing(3),
  borderRadius: Number(theme.shape.borderRadius) * 2,
  backgroundColor: theme.palette.background.neutral,
}));

// ----------------------------------------------------------------------

type FormValuesProps = {
  rating: number | null;
  review: string;
  // name: string;
  // email: string;
};

type Props = {
  onClose: VoidFunction;
  id?: string;
};

export default function ProductDetailsReviewForm({ onClose, id, ...other }: Props) {
  const ReviewSchema = Yup.object().shape({
    rating: Yup.mixed().required('Rating is required'),
    review: Yup.string().required('Review is required'),
    // name: Yup.string().required('Name is required'),
    // email: Yup.string().email('Email must be a valid email address').required('Email is required'),
  });

  const defaultValues = {
    rating: null,
    review: '',
  };

  const methods = useForm<FormValuesProps>({
    resolver: yupResolver(ReviewSchema),
    defaultValues,
  });

  const {
    reset,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = methods;

  const { product } = useSelector((state) => state.product);
  const { user } = useAuth();

  const { enqueueSnackbar } = useSnackbar();
  const onSubmit = async (data: FormValuesProps) => {
    try {
      const rating: RatingType = {
        star: Number(data.rating),
        comment: data.review,
        productId: product?.id!,
        userId: user?.id!,
        createUser: user?.id!,
        status:true,
        createDatetime: new Date(),
      } as RatingType;
      console.log(product);
      await ratingApi.addComment(rating);

      reset();
      onClose();
    } catch (error) {
      enqueueSnackbar(error.message, { variant: 'error' });
      console.error(error);
    }
  };

  const onCancel = () => {
    onClose();
    reset();
  };

  return (
    <RootStyle {...other} id={id}>
      <Typography variant="h5" gutterBottom>
        Add Review
      </Typography>

      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={3}>
          <div>
            <Stack direction="row" flexWrap="wrap" alignItems="center" spacing={1.5}>
              <Typography variant="body2">Your review about this product:</Typography>

              <Controller
                name="rating"
                control={control}
                render={({ field }) => <Rating {...field} value={Number(field.value)} />}
              />
            </Stack>
            {!!errors.rating && <FormHelperText error> {errors.rating?.message}</FormHelperText>}
          </div>

          <RHFTextField name="review" label="Review *" multiline rows={3} />

          <Stack direction="row" justifyContent="flex-end" spacing={1.5}>
            <Button color="inherit" variant="outlined" onClick={onCancel}>
              Cancel
            </Button>
            <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
              Post review
            </LoadingButton>
          </Stack>
        </Stack>
      </FormProvider>
    </RootStyle>
  );
}
