// @mui
import { Alert, IconButton, InputAdornment, Stack } from '@mui/material';
// layouts
// routes
// sections
import { yupResolver } from '@hookform/resolvers/yup';
import { LoadingButton } from '@mui/lab';
import { useSnackbar } from 'notistack';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { FormProvider, RHFTextField } from 'src/components/hook-form';
import Iconify from 'src/components/Iconify';
import { authApi } from 'src/service/app-apis/auth';
import * as Yup from 'yup';
import { PATH_AUTH } from 'src/routes/paths';
// form
// @mui
// hooks
// components
// ----------------------------------------------------------------------


type FormValuesProps = {
  password: string;
  repassword: string;
  afterSubmit?: string;
};

// ----------------------------------------------------------------------

export default function ResetPasswordForm() {
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const RegisterSchema = Yup.object().shape({
    password: Yup.string().required('Trường này không được để trống')
      .matches(/^.{6,}$/, "Mật khẩu phải có ít nhất 6 ký tự").
      matches(/[A-Z\s]+/, "Mật khẩu phải có ít nhất một ký tự hoa").
      matches(/[$&+,:;=?@#|'<>.^*()%!-]/, "Mật khẩu phải có ít nhất một ký tự đặc biệt")
    ,

    repassword: Yup.string().required('Trường này không được để trống')
      .oneOf([Yup.ref('password'), null], 'Passwords must match')
    ,
  });
  const defaultValues = {
    password: '',
    repassword: '',

  };
  const methods = useForm<FormValuesProps>({
    resolver: yupResolver(RegisterSchema),
    defaultValues,
  });
  const [disabledSubmit, setDisableSubmit] = useState(false)
  const { token } = useParams();
  const {
    setError,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = methods;

  useEffect(() => {
    (async () => {

      try {
        authApi.setSession({ accessToken: token! });
        await authApi.whoAmI();
      } catch (error) {
        setError('afterSubmit', { type: 'custom', message: 'Link đã hết hạn hoặc không tồn tại' });
        setDisableSubmit(true);
      }
    })();

  }, [])
  const onSubmit = async (data: FormValuesProps) => {

    (async () => {
      try {
        await authApi.resetPassword({ password: data.password })
        enqueueSnackbar('Đổi mật khẩu thành công!');
        setTimeout(() => {
          navigate(PATH_AUTH.login, { replace: true });
        }, 2000);

      } catch (error) {
        setError('afterSubmit', { type: 'custom', message: 'Link đã hết hạn hoặc không tồn tại' });
        setDisableSubmit(true);
      }
    })();

  };
  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={3}>  {!!errors.afterSubmit && <Alert severity="error">{errors.afterSubmit.message}</Alert>}
        <RHFTextField
          name="password"
          label="Mật khâu"
          type={showPassword ? 'text' : 'password'}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton edge="end" onClick={() => setShowPassword(!showPassword)}>
                  <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        <RHFTextField
          name="repassword"
          label="Nhập lại mật khẩu"
          type={showPassword ? 'text' : 'password'}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton edge="end" onClick={() => setShowPassword(!showPassword)}>
                  <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        <LoadingButton
          fullWidth
          size="large"
          type="submit"
          variant="contained"
          loading={isSubmitting}
          disabled={disabledSubmit}
        >
          Xác nhận
        </LoadingButton>
      </Stack>
    </FormProvider>
  );
}
