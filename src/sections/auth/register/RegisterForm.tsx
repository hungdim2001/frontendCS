import * as Yup from 'yup';
import { useState } from 'react';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { Stack, IconButton, InputAdornment, Alert } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// hooks
import useAuth from '../../../hooks/useAuth';
import useIsMountedRef from '../../../hooks/useIsMountedRef';
// components
import Iconify from '../../../components/Iconify';
import { FormProvider, RHFSelect, RHFTextField } from '../../../components/hook-form';
import useLocationContext from 'src/hooks/useLocation';

// ----------------------------------------------------------------------

type FormValuesProps = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone: string;
  city: string;
  district: string;
  ward: string;
  repassword: string;
  village: string;
  afterSubmit?: string;
};

export default function RegisterForm() {
  const { register } = useAuth();
  const { locationState,
    onCitySelect,
    onDistrictSelect,
    onWardSelect,
  } = useLocationContext();
  const {
    cityOptions,
    districtOptions,
    wardOptions,
    selectedCity,
    selectedDistrict,
    selectedWard
  } = locationState;

  const isMountedRef = useIsMountedRef();

  const [showPassword, setShowPassword] = useState(false);

  const RegisterSchema = Yup.object().shape({
    firstName: Yup.string().required('Trường này không được để trống'),
    lastName: Yup.string().required('Trường này không được để trống'),
    email: Yup.string().email('Trường này phải là email')
      .required('Trường này không được để trống')
    ,
    password: Yup.string().required('Trường này không được để trống')
      .matches(/^.{6,}$/, "Mật khẩu phải có ít nhất 6 ký tự").
      matches(/[A-Z\s]+/, "Mật khẩu phải có ít nhất một ký tự hoa").
      matches(/[$&+,:;=?@#|'<>.^*()%!-]/, "Mật khẩu phải có ít nhất một ký tự đặc biệt")
    ,
    phone: Yup.string().required('Trường này không được để trống')
      .matches(/^0[1-9]\d{8}$/, 'không đúng định dạng số điện thoại'),
    city: Yup.string().required('Trường này không được để trống'),
    district: Yup.string().required('Trường này không được để trống'),
    ward: Yup.string().required('Trường này không được để trống'),
    village: Yup.string().required('Trường này không được để trống'),
    repassword: Yup.string().required('Trường này không được để trống')
      .oneOf([Yup.ref('password'), null], 'Passwords must match')
    ,
  });

  const defaultValues = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    phone: '',
    // city: ' ',
    // district: ' ',
    // ward: ' ',
    repassword: '',
    village: ''
  };

  const methods = useForm<FormValuesProps>({
    resolver: yupResolver(RegisterSchema),
    defaultValues,
  });

  const {
    reset,
    setValue,
    setError,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = methods;

  const onSubmit = async (data: FormValuesProps) => {
    try {
      console.log(data.city)
      const address = data.city + " "+ data.district +" "+ data.ward + " "+data.village
      await register(data.email, data.phone, address, data.password, data.firstName, data.lastName);
    } catch (error) {
      console.error("register");
      console.error(error);
      // reset();
      if (isMountedRef.current) {
        setError('afterSubmit', error);
      }
    }
  };
 
  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={3}>
        {!!errors.afterSubmit && <Alert severity="error">{errors.afterSubmit.message}</Alert>}

        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
          <RHFTextField name="firstName" label="Tên" />
          <RHFTextField name="lastName" label="Họ" />
        </Stack>

        <RHFTextField name="email" label="Email" />
        <RHFTextField name="phone" label="Số điện thoại" />

        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
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
        </Stack>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
          <RHFSelect
            disabled={cityOptions.length === 0}
            defaultValue={selectedCity}
            name="city" label="Thành phố/Tỉnh" placeholder="Thành phố/Tỉnh"
            onChange={(e) => {
              setValue('city', e.target.value, { shouldValidate: true })
              const option = cityOptions.find((c) => c.name === e.target.value)
              onCitySelect(option!)
            }}
          >
            <option value="" />
            {cityOptions.map((option) => (
              <
                option key={option.id} value={option.name!} >
                {option.name}
              </option>
            ))}

          </RHFSelect>

          <RHFSelect
           onChange={(e) => {
            setValue('district', e.target.value, { shouldValidate: true })
            const option = districtOptions.find((c) => c.name === e.target.value)
            onDistrictSelect(option!)
          }}
            disabled={districtOptions.length === 0}
            defaultValue={selectedDistrict}
            name="district" label="Quận/Huyện" placeholder="Quận/Huyện"
          >  <option value="" />
            {districtOptions.map((option) => (
              <option key={option.id} value={option.name!}>
                {option.name}
              </option>
            ))}
          </RHFSelect>
        </Stack>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>

          <RHFSelect
           onChange={(e) => {
            setValue('ward', e.target.value, { shouldValidate: true })
            const option = wardOptions.find((c) => c.name === e.target.value)
            onWardSelect(option!)
          }}
            defaultValue={selectedWard}
            disabled={wardOptions.length === 0}
            name="ward"
            label="Phường/Xã"
            placeholder="Phường/Xã"
          >  <option value="" />
            {wardOptions.map((option) => (
              <option key={option.id} value={option.name!}>
                {option.name}
              </option>
            ))}
          </RHFSelect>

          <RHFTextField name="village" label="Số nhà/Thôn" />

        </Stack>



        <LoadingButton
          fullWidth
          size="large"
          type="submit"
          variant="contained"
          loading={isSubmitting}
        >
          Đăng ký
        </LoadingButton>
      </Stack>
    </FormProvider>
  );
}
