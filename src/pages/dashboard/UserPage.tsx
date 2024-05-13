import React, { useEffect, useMemo, useState } from 'react';
import {
  Grid,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  Divider,
  Container,
  makeStyles,
  Theme,
  Card,
  Stack,
  styled,
  Box,
  TextField,
  InputAdornment,
  MenuItem,
} from '@mui/material';

import Image from '../../components/Image';
import * as Yup from 'yup';
import HeaderBreadcrumbs from 'src/components/HeaderBreadcrumbs';
import { PATH_DASHBOARD, PATH_ROOT } from 'src/routes/paths';
import SvgIconStyle from 'src/components/SvgIconStyle';
import useAuth from 'src/hooks/useAuth';
import { FormProvider, RHFSelect, RHFTextField } from 'src/components/hook-form';
import { countries } from 'src/_mock';
import { LoadingButton } from '@mui/lab';
import { AuthUser } from 'src/@types/auth';
import { firstName, lastName } from 'src/_mock/name';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import useLocationContext from 'src/hooks/useLocation';
import { areaResponse } from 'src/service/app-apis/location';
import { userApi } from 'src/service/app-apis/user';
import Iconify from 'src/components/Iconify';
import { Padding } from '@mui/icons-material';
const UserMenu = [
  { title: 'Personal Data', icon: '/icons/user-edit.svg' },
  { title: 'Payment & Instalments', icon: '/icons/dollar-circle.svg' },
  { title: 'Order', icon: '/icons/ic_bag.svg' },
  { title: 'Security & access', icon: '/icons/security-safe.svg' },
];
const orderStatus = [
  {
    name: 'Current',
  },
  {
    name: 'Delivered',
  },
  {
    name: 'Cancel',
  },
  {
    name: 'Returned',
  },
];
const paymentOptions = [
  {
    name: 'Visa',
    icon: '/img/visa.png',
  },
  {
    name: 'Master Card',
    icon: '/img/master card.png',
  },
  {
    name: 'American Express',
    icon: '/img/american express.png',
  },
];
const RootStyle = styled('div')(({ theme }) => ({
  height: '100%',
  marginTop: '77px',
}));

const ContentStyle = styled('div')(({ theme }) => ({
  overflow: 'hidden',
  position: 'relative',
}));

type FormValuesProps = {
  firstName: string;
  lastName: string;
  email: string;
  province: string;
  district: string;
  avatarUrl: string;
  precinct: string;
  streetBlock: string;
  afterSubmit?: string;
};

const UserPage = () => {
  const { user, logout } = useAuth();
  const NewUserSchema = Yup.object().shape({
    firstName: Yup.string().required('First Name is required'),
    lastName: Yup.string().required('Last Name is required'),
    province: Yup.string().required('Province is required'),
    district: Yup.string().required('District is required'),
    precinct: Yup.string().required('Precinct is required'),
    streetBlock: Yup.string().required('Street block is required'),
    avatarUrl: Yup.mixed().test('required', 'Avatar is required', (value) => value !== ''),
  });

  const defaultValues = useMemo(
    () => ({
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      province: user?.province || '',
      district: (user?.province ?? '') + (user?.district ?? '') || '',
      precinct: (user?.province ?? '') + (user?.district ?? '') + (user?.precinct ?? ''),
      streetBlock:
        (user?.province ?? '') +
        (user?.district ?? '') +
        (user?.precinct ?? '') +
        (user?.streetBlock ?? ''),
    }),
    [user]
  );
  const methods = useForm<FormValuesProps>({
    resolver: yupResolver(NewUserSchema),
    defaultValues,
  });

  const {
    reset,
    watch,
    control,
    setValue,
    resetField,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;
  const { locationState, initFromOld, handleLocationSelect } = useLocationContext();
  const { provinces, districts, precincts, streetBlocks } = locationState;
  const onSubmit = async (data: FormValuesProps) => {
    try {
      const updateUser = {
        ...user,
        firstName: data.firstName,
        lastName: data.lastName,
        areaCode: data.streetBlock,
      };
      await userApi.update(updateUser);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (user?.province && user.district && user.precinct && user.streetBlock) {
      initFromOld(user.province, user.district, user.precinct, user.streetBlock);
      // reset(defaultValues);
    }
  }, [user]);
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
  const [optionSelected, setOptionSelected] = useState(UserMenu[0]);
  const [orderStatusSelected, setOrderStatusSelected] = useState(orderStatus[0]);
  if (!user) return <></>;
  return (
    <RootStyle>
      <ContentStyle>
        <Container>
          <HeaderBreadcrumbs
            links={[
              { name: 'Home', href: '/' },
              {
                name: 'User',
                href: PATH_ROOT.user.root,
              },
              { name: optionSelected.title },
            ]}
            heading={''}
          />

          <Grid container spacing={3}>
            <Grid
              sx={{
                backgroundColor: '#F9F9F9',
                padding: 0,
                fontSize: '20px', // Thiết lập font-size
                fontWeight: 300, // Thiết lập font-weight
                lineHeight: '28px', // Thiết lập line-height
                textAlign: 'left', // Thiết lập text-align
              }}
              item
              xs={3}
            >
              <ListItem sx={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                <SvgIconStyle
                  sx={{ color: '#B4B4B4', width: '60px', height: '60px', mr: 2 }}
                  src={'/icons/profile-circle.svg'}
                />
                <ListItemText
                  primary={user.fullName}
                  primaryTypographyProps={{
                    sx: {
                      color: '#0C0C0C',
                      fontSize: '20px', // Thiết lập font-size
                      fontWeight: 500, // Thiết lập font-weight
                      lineHeight: '24.2px', // Thiết lập line-height
                      textAlign: 'left', // Thiết lập text-align
                    },
                  }}
                />
              </ListItem>
              <Stack direction="column" sx={{ padding: 0 }}>
                {UserMenu.map((item) => (
                  <ListItem
                    onClick={(e) => {
                      setOptionSelected(item);
                    }}
                    sx={{
                      borderLeft:
                        item.title === optionSelected.title ? 'solid 2px #0C68F4' : undefined,
                      color: item.title === optionSelected.title ? '#0C68F4' : undefined,
                      cursor: 'pointer',
                      padding: '12px',
                      display: 'flex',
                      alignItems: 'center',
                    }}
                    key={item.title}
                  >
                    <SvgIconStyle src={item.icon} sx={{ mr: 2 }} />
                    {item.title}
                  </ListItem>
                ))}
              </Stack>
              <ListItem
                onClick={() => {
                  logout();
                }}
                sx={{ cursor: 'pointer', padding: '24px', display: 'flex', alignItems: 'center' }}
              >
                <SvgIconStyle src={'/icons/logout.svg'} sx={{ mr: 2 }} />
                <ListItemText
                  primary="Log out"
                  primaryTypographyProps={{ sx: { color: '#C91433' } }}
                />
              </ListItem>
            </Grid>
            <Grid item xs={9}>
              <Box sx={{ display: optionSelected.title === 'Personal Data' ? 'block' : 'none' }}>
                <Typography variant="h5">Identification</Typography>
                <Typography
                  sx={{
                    color: '#717171',
                    fontSize: '16px', // Kích thước font là 16px
                    fontWeight: 300, // Độ đậm của font là 300
                    lineHeight: '24px', // Độ cao của dòng là 24px
                    textAlign: 'left', // Căn chỉnh văn bản sang trái
                  }}
                >
                  Verify your identity
                </Typography>
                <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
                  <Card sx={{ p: 3 }}>
                    <Box
                      sx={{
                        display: 'grid',
                        columnGap: 2,
                        rowGap: 3,
                        gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' },
                      }}
                    >
                      <RHFTextField name="firstName" label="First Name" />
                      <RHFTextField name="lastName" label="Last Name" />
                      <RHFSelect
                        disabled={provinces.length === 0}
                        name="province"
                        label="Province"
                        placeholder="Province"
                        onChange={(e) =>
                          handleChange(e as React.ChangeEvent<HTMLInputElement>, 'province')
                        }
                      >
                        <option value="" />
                        {provinces.map((option) => (
                          <option key={option.areaCode} value={option.areaCode!}>
                            {option.name}
                          </option>
                        ))}
                      </RHFSelect>
                      <RHFSelect
                        onChange={(e) =>
                          handleChange(e as React.ChangeEvent<HTMLInputElement>, 'district')
                        }
                        disabled={districts.length === 0}
                        name="district"
                        label="District"
                        placeholder="District"
                      >
                        <option value="" />
                        {districts.map((option) => (
                          <option key={option.areaCode} value={option.areaCode!}>
                            {option.name}
                          </option>
                        ))}
                      </RHFSelect>
                      <RHFSelect
                        onChange={(e) =>
                          handleChange(e as React.ChangeEvent<HTMLInputElement>, 'precinct')
                        }
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
                        onChange={(e) =>
                          handleChange(e as React.ChangeEvent<HTMLInputElement>, 'streetBlock')
                        }
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

                      {/* <RHFTextField name="name" label="Full Name" />
                  <RHFTextField name="email" label="Email Address" />
                  <RHFTextField name="phoneNumber" label="Phone Number" />
                  <RHFTextField name="state" label="State/Region" />
                  <RHFTextField name="city" label="City" />
                  <RHFTextField name="address" label="Address" />
                  <RHFTextField name="zipCode" label="Zip/Code" />
                  <RHFTextField name="company" label="Company" />
                  <RHFTextField name="role" label="Role" /> */}
                    </Box>

                    <Stack alignItems="flex-end" sx={{ mt: 3 }}>
                      <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                        Save Changes
                      </LoadingButton>
                    </Stack>
                  </Card>
                </FormProvider>
              </Box>

              <Box
                sx={{
                  display: optionSelected.title === 'Payment & Instalments' ? 'block' : 'none',
                }}
              >
                <Typography variant="h5">Cards</Typography>
                <Typography
                  sx={{
                    color: '#717171',
                    fontSize: '16px', // Kích thước font là 16px
                    fontWeight: 300, // Độ đậm của font là 300
                    lineHeight: '24px', // Độ cao của dòng là 24px
                    textAlign: 'left', // Căn chỉnh văn bản sang trái
                  }}
                >
                  Manage payment methods
                </Typography>
                <Box marginTop={4} sx={{ display: 'flex', alignItems: 'center' }}>
                  <TextField
                    variant="outlined"
                    disabled
                    placeholder="Credit or Debit cards"
                    sx={{
                      '& fieldset': { border: 'none' },
                      border: 'none',
                      backgroundColor: '#F9f9f9',
                    }}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <SvgIconStyle sx={{ color: '#0C68F4' }} src={'/icons/ic_edit.svg'} />
                        </InputAdornment>
                      ),
                    }}
                  />
                  <Stack direction="row">
                    {paymentOptions.map((paymentOption) => (
                      <Image
                        key={paymentOption.name}
                        src={paymentOption.icon}
                        alt={paymentOption.name}
                        sx={{ width: '55px', height: '40px' }}
                      />
                    ))}
                  </Stack>
                </Box>
                <Box marginTop={4} sx={{ display: 'flex', alignItems: 'center' }}>
                  <TextField
                    variant="outlined"
                    disabled
                    placeholder="PayPal"
                    sx={{
                      '& fieldset': { border: 'none' },
                      border: 'none',
                      backgroundColor: '#F9f9f9',
                    }}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <SvgIconStyle sx={{ color: '#0C68F4' }} src={'/icons/ic_edit.svg'} />
                        </InputAdornment>
                      ),
                    }}
                  />
                  <Image
                    src="/img/paypal.png"
                    alt="Paypal"
                    sx={{ width: '55px', height: '40px' }}
                  />
                </Box>
                <Typography mt={2} variant="h5">
                  Instalments
                </Typography>
                <Typography
                  sx={{
                    color: '#0C68F4',
                    fontSize: '16px', // Kích thước font là 16px
                    fontWeight: 300, // Độ đậm của font là 300
                    textAlign: 'left', // Căn chỉnh văn bản sang trái
                  }}
                >
                  Manage your instalment
                  <Iconify
                    width={24}
                    height={24}
                    sx={{ ml: 1, verticalAlign: 'middle' }}
                    icon={'eva:arrow-forward-fill'}
                  />
                </Typography>
              </Box>
              <Box
                sx={{
                  display: optionSelected.title === 'Order' ? 'block' : 'none',
                }}
              >
                <Typography variant="h5">Order History</Typography>
                <Typography
                  sx={{
                    color: '#717171',
                    fontSize: '16px', // Kích thước font là 16px
                    fontWeight: 300, // Độ đậm của font là 300
                    lineHeight: '24px', // Độ cao của dòng là 24px
                    textAlign: 'left', // Căn chỉnh văn bản sang trái
                  }}
                >
                  Track, return or purchase items
                </Typography>
                <Stack
                  direction="row"
                  sx={{
                    mt: 4,
                    borderBottom: '2px solid #f9f9f9',
                  }}
                >
                  {orderStatus.map((item) => (
                    <MenuItem
                      onClick={(e) => {
                        setOrderStatusSelected(item);
                      }}
                      sx={{
                        fontWeight: 300,
                        fontSize: '20px',
                        lineHeight: '28px',
                        textAlign: 'center',
                        padding: 0,
                        mr: 4,
                        borderBottom:
                          orderStatusSelected.name === item.name ? '2px solid #0C68F4' : undefined,
                        color: orderStatusSelected.name === item.name ? '#0C68F4' : '#717171',
                      }}
                      key={item.name}
                    >
                      {item.name}
                      <Box
                        sx={{
                          backgroundColor:
                            orderStatusSelected.name === item.name ? '#0C68F4' : '#f9f9f9',
                          ml: 1,
                          color: orderStatusSelected.name === item.name ? '#fff' : '#717171',
                          width: '20px',
                          justifyContent: 'center',
                          height: '20px',
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          fontSize: '16px',
                        }}
                      >
                        0
                      </Box>
                    </MenuItem>
                  ))}
                </Stack>
                <Image
                  src="/img/no order history.png"
                  alt="Empty"
                  sx={{ margin: '0 auto', width: '315px', height: '235px' }}
                />
                <Typography
                  sx={{
                    textAlign: 'center',
                    color: '#0C0C0C',
                    fontSize: '20px', // Kích thước font là 16px
                    fontWeight: 300, // Độ đậm của font là 300
                    lineHeight: '24px', // Độ cao của dòng là 24px
                  }}
                >
                  You have not placed any orders yet
                </Typography>
              </Box>
              <Box
                sx={{
                  display: optionSelected.title === 'Security & access' ? 'block' : 'none',
                }}
              >
                <Typography variant="h5">Security settings</Typography>
                <Typography
                  sx={{
                    color: '#717171',
                    fontSize: '16px', // Kích thước font là 16px
                    fontWeight: 300, // Độ đậm của font là 300
                    lineHeight: '24px', // Độ cao của dòng là 24px
                    textAlign: 'left', // Căn chỉnh văn bản sang trái
                  }}
                >
                  Change password and phone number
                </Typography>

                <TextField
                  variant="outlined"
                  disabled
                  placeholder="Password"
                  sx={{
                    '& fieldset': { border: 'none' },
                    border: 'none',
                    backgroundColor: '#F9f9f9',
                  }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <SvgIconStyle sx={{ color: '#0C68F4' }} src={'/icons/ic_edit.svg'} />
                      </InputAdornment>
                    ),
                    startAdornment: (
                      <InputAdornment position="start">
                        <SvgIconStyle  src={'/icons/key.svg'} />
                      </InputAdornment>
                    ),
                  }}
                />
                <TextField
                  variant="outlined"
                  disabled
                  placeholder="Phone Number"
                  sx={{
                    '& fieldset': { border: 'none' },
                    border: 'none',
                    backgroundColor: '#F9f9f9',
                  }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <SvgIconStyle sx={{ color: '#0C68F4' }} src={'/icons/ic_edit.svg'} />
                      </InputAdornment>
                    ),
                    startAdornment: (
                      <InputAdornment position="start">
                        <SvgIconStyle src={'/icons/call.svg'} />
                      </InputAdornment>
                    ),
                  }}
                />
              </Box>
            </Grid>
          </Grid>
        </Container>
      </ContentStyle>
    </RootStyle>
  );
};

export default UserPage;
