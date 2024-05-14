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
import { fileURLToPath } from 'url';
import { useSnackbar } from 'notistack';

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

export interface Props {
  onCloseModal: VoidFunction;
}
export default function RegisterForm({ onCloseModal }: Props) {
  const { register } = useAuth();
  const {
    locationState,

    handleLocationSelect,
  } = useLocationContext();
  const { provinces, districts, precincts, streetBlocks } = locationState;

  const isMountedRef = useIsMountedRef();

  const [showPassword, setShowPassword] = useState(false);

  const RegisterSchema = Yup.object().shape({
    firstName: Yup.string().required('Fist name is required'),
    lastName: Yup.string().required('Last name is required'),
    email: Yup.string()
      .email(
        "Email address can include only letters, numbers, - (dash), _ (underscore), . (periods), '(apostrophe), and one @"
      )
      .required('Email is required'),
    password: Yup.string()
      .required('Password is required')
      .matches(/^.{6,}$/, 'Passwords must be at least 6 characters')
      .matches(/[A-Z\s]+/, 'Password must have at least one uppercase character')
      .matches(/[$&+,:;=?@#|'<>.^*()%!-]/, 'Password must have at least one special character'),
    phone: Yup.string()
      .required('Phone number is required')
      .matches(/^0[1-9]\d{8}$/, 'This is not a valid phone number'),
    province: Yup.string().required('Province is required'),
    district: Yup.string().required('District is required'),
    precinct: Yup.string().required('Precinct is required'),
    streetBlock: Yup.string().required('Street block is required'),
    repassword: Yup.string()
      .required('is required')
      .oneOf([Yup.ref('password'), null], 'Passwords do not match'),
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
    streetBlock: '',
  };

  const methods = useForm<FormValuesProps>({
    resolver: yupResolver(RegisterSchema),
    defaultValues,
  });

  const {
    resetField,
    setValue,
    setError,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = methods;

  const { enqueueSnackbar } = useSnackbar();
  const onSubmit = async (data: FormValuesProps) => {
    try {
      const role = 'user';
      await register(
        null,
        data.email,
        data.phone,
        data.streetBlock,
        role,
        data.password,
        data.firstName,
        data.lastName
      );
      enqueueSnackbar('register successfully ', { variant: 'success' });
      onCloseModal();
    } catch (error) {
      console.error('register');
      console.error(error);
      if (isMountedRef.current) {
        setError('afterSubmit', error);
      }
    }
  };

  type Field = 'province' | 'district' | 'precinct' | 'streetBlock';
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, field: Field) => {
    const selectedValue = e.target.value;
    let option: areaResponse | undefined;
    setValue(field, selectedValue, { shouldValidate: true });
    if (field === 'province') {
      option = provinces.find((c) => c.areaCode === selectedValue);
      resetField('district');
      resetField('precinct');
      resetField('streetBlock');
      handleLocationSelect(option, field);
    } else if (field === 'district') {
      option = districts.find((c) => c.areaCode === selectedValue);
      resetField('precinct');
      resetField('streetBlock');
      handleLocationSelect(option, field);
      console.log(option);
      console.log(field);
    } else if (field === 'precinct') {
      option = precincts.find((c) => c.areaCode === selectedValue);
      resetField('streetBlock');
      handleLocationSelect(option, field);
    } else {
      handleLocationSelect(option, field);
    }
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={3}>
        {!!errors.afterSubmit && <Alert severity="error">{errors.afterSubmit.message}</Alert>}

        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
          <RHFTextField name="firstName" label="First name" />
          <RHFTextField name="lastName" label="Last name" />
        </Stack>

        <RHFTextField name="email" label="Email" />
        <RHFTextField name="phone" label="Phone number" />

        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
          <RHFTextField
            name="password"
            label="Password"
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
            label="Retype password"
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
            name="province"
            label="Province"
            placeholder="Province"
            onChange={(e) => handleChange(e as React.ChangeEvent<HTMLInputElement>, 'province')}
          >
            <option value="" />
            {provinces.map((option) => (
              <option key={option.areaCode} value={option.areaCode!}>
                {option.name}
              </option>
            ))}
          </RHFSelect>

          <RHFSelect
            onChange={(e) => handleChange(e as React.ChangeEvent<HTMLInputElement>, 'district')}
            disabled={districts.length === 0}
            name="district"
            label="District"
            placeholder="District"
          >
            {' '}
            <option value="" />
            {districts.map((option) => (
              <option key={option.areaCode} value={option.areaCode!}>
                {option.name}
              </option>
            ))}
          </RHFSelect>
        </Stack>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
          <RHFSelect
            onChange={(e) => handleChange(e as React.ChangeEvent<HTMLInputElement>, 'precinct')}
            disabled={precincts.length === 0}
            name="precinct"
            label="Precinct"
            placeholder="Precinct"
          >
            {' '}
            <option value="" />
            {precincts.map((option) => (
              <option key={option.areaCode} value={option.areaCode!}>
                {option.name}
              </option>
            ))}
          </RHFSelect>
          <RHFSelect
            onChange={(e) => handleChange(e as React.ChangeEvent<HTMLInputElement>, 'streetBlock')}
            disabled={streetBlocks.length === 0}
            name="streetBlock"
            label="Street Block"
            placeholder="Street Block"
          >
            {' '}
            <option value="" />
            {streetBlocks.map((option) => (
              <option key={option.areaCode} value={option.areaCode!}>
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
          Create account
        </LoadingButton>
      </Stack>
    </FormProvider>
  );
}
