import * as Yup from 'yup';
import { ChangeEvent, useState } from 'react';
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
import { areaResponse } from 'src/service/app-apis/location';

// ----------------------------------------------------------------------

type FormValuesProps = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone: string;
  province: string;
  district: string;
  precinct: string;
  repassword: string;
  streetBlock: string;
  afterSubmit?: string;
};

export default function RegisterForm() {
  const { register } = useAuth();
  const { locationState,
    
    handleLocationSelect,
  } = useLocationContext();
  const {
    provinces,
    districts,
    precincts,
    streetBlocks,
    streetBlock,
    province,
    district,
    precinct,
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
    province: Yup.string().required('Trường này không được để trống'),
    district: Yup.string().required('Trường này không được để trống'),
    precinct: Yup.string().required('Trường này không được để trống'),
    streetBlock: Yup.string().required('Trường này không được để trống'),
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
    province: ' ',
    district: ' ',
    precinct: ' ',
    repassword: '',
    streetBlock: ''
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
      const areaCode = data.province +  data.district +data.precinct + data.streetBlock
      const role ="user"
      await register(data.email, data.phone, areaCode, role,data.password, data.firstName, data.lastName);
    } catch (error) {
      console.error("register");
      console.error(error);
      if (isMountedRef.current) {
        setError('afterSubmit', error);
      }
    }
  };

  type Field = "province" | "district" | "precinct" | "streetBlock";
  const handleChange = (e:React.ChangeEvent<HTMLInputElement>,field: Field) => {
    const selectedValue = e.target.value;
    setValue(field, selectedValue, { shouldValidate: true });
    const option:areaResponse|undefined = field === 'province'
      ? provinces.find((c) => c.name === selectedValue)
      : field === 'district'
        ? districts.find((c) => c.name === selectedValue)
        : field === 'precinct'
          ? precincts.find((c) => c.name === selectedValue)
          : streetBlocks.find((c) => c.name === selectedValue);
    handleLocationSelect(option, field);
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
            disabled={provinces.length === 0}
            defaultValue={province}
            name="province" label="Tỉnh/Thành phố" placeholder="Thành phố/Tỉnh"
            onChange={(e) => handleChange(e as React.ChangeEvent<HTMLInputElement>, 'province')}
          >
            <option value="" />
            {provinces.map((option) => (
              <
                option key={option.areaCode} value={option.name!} >
                {option.name}
              </option>
            ))}

          </RHFSelect>

          <RHFSelect
            onChange={(e) => handleChange(e as React.ChangeEvent<HTMLInputElement>, 'district')}

            disabled={districts.length === 0}
            defaultValue={district}
            name="district" label="Quận/Huyện" placeholder="Quận/Huyện"
          >  <option value="" />
            {districts.map((option) => (
              <option key={option.areaCode} value={option.name!}>
                {option.name}
              </option>
            ))}
          </RHFSelect>
        </Stack>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>

          <RHFSelect
            onChange={(e) => handleChange(e as React.ChangeEvent<HTMLInputElement>, 'precinct')}

            defaultValue={precinct}
            disabled={precincts.length === 0}
            name="precinct"
            label="Phường/Xã"
            placeholder="Phường/Xã"
          >  <option value="" />
            {precincts.map((option) => (
              <option key={option.areaCode} value={option.name!}>
                {option.name}
              </option>
            ))}
          </RHFSelect>
          <RHFSelect
            onChange={(e) => handleChange(e as React.ChangeEvent<HTMLInputElement>, 'streetBlock')}

            defaultValue={streetBlock}
            disabled={streetBlocks.length === 0}
            name="streetBlock"
            label="Thôn/Xóm"
            placeholder="Thôn/Xóm"
          >  <option value="" />
            {streetBlocks.map((option) => (
              <option key={option.areaCode} value={option.name!}>
                {option.name}
              </option>
            ))}
          </RHFSelect>


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
