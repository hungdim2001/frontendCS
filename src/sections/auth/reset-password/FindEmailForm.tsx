import * as Yup from 'yup';
// form
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
// @mui
import { Alert, Stack } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// hooks
import useIsMountedRef from '../../../hooks/useIsMountedRef';
// components
import { FormProvider, RHFTextField } from '../../../components/hook-form';
import { authApi } from 'src/service/app-apis/auth';

// ----------------------------------------------------------------------

type FormValuesProps = {
  email: string;
  afterSubmit?: string;
};

type Props = {
  onSent: VoidFunction;
  onGetEmail: (value: string) => void;
};

export default function FindEmailForm({ onSent, onGetEmail }: Props) {
  const isMountedRef = useIsMountedRef();

  const FindEmailSchema = Yup.object().shape({
    email: Yup.string().email('không đúng định dạng email').required('trường này không được để trống'),
  });

  const methods = useForm<FormValuesProps>({
    resolver: yupResolver(FindEmailSchema),
    defaultValues: { email: '' },
  });

  const {
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = methods;

  const onSubmit = async (data: FormValuesProps) => {
    try {
      await authApi.findEmail({
        email: data.email
      })
      if (isMountedRef.current) {
        console.log('here')
        onSent();
        onGetEmail(data.email);
      }
    } catch (error) {
      console.error(error);
      if (isMountedRef.current) {
        setError('afterSubmit', error);
      }
    }
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={3}>
  {!!errors.afterSubmit && <Alert severity="error">{errors.afterSubmit.message}</Alert>}
      
        <RHFTextField name="email" label="Email address" />

        <LoadingButton
          fullWidth
          size="large"
          type="submit"
          variant="contained"
          loading={isSubmitting}
        >
          Reset Password
        </LoadingButton>
      </Stack>
    </FormProvider>
  );
}
