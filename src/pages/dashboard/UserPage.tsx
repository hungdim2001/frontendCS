import React, { useEffect, useMemo } from 'react';
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
} from '@mui/material';
import * as Yup from 'yup';
import HeaderBreadcrumbs from 'src/components/HeaderBreadcrumbs';
import { PATH_DASHBOARD, PATH_ROOT } from 'src/routes/paths';
import SvgIconStyle from 'src/components/SvgIconStyle';
import useAuth from 'src/hooks/useAuth';
import { FormProvider, RHFSelect, RHFTextField } from 'src/components/hook-form';
import { countries } from 'src/_mock';
import { LoadingButton } from '@mui/lab';
import { AuthUser } from 'src/@types/auth';
import { firstName } from 'src/_mock/name';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import useLocationContext from 'src/hooks/useLocation';
import { areaResponse } from 'src/service/app-apis/location';
const UserMenu = [
  { title: 'Person Data', icon: '/icons/user-edit.svg' },
  { title: 'Address', icon: '/icons/dollar-circle.svg' },
  { title: 'Order', icon: '/icons/ic_bag.svg' },
  { title: 'security', icon: '/icons/security-safe.svg' },
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
  const { user } = useAuth();
  console.log(user);
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
      district: user?.district || '',
      precinct: user?.precinct || '',
      streetBlock: user?.streetBlock || '',
    }),
    [user]
  );
  console.log(defaultValues);
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
  const {
    locationState,
    handleLocationSelect,
  } = useLocationContext();
  const { provinces, districts, precincts, streetBlocks } = locationState;
  const onSubmit = async (data: FormValuesProps) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      reset();
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    if (user) {
      reset(defaultValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);
  type Field = 'province' | 'district' | 'precinct' | 'streetBlock';
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, field: Field) => {
    const selectedValue = e.target.value;
    let option: areaResponse | undefined;
    setValue(field, selectedValue, { shouldValidate: true });
    console.log('here')
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
              { name: 'Personal Data' },
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
              <ListItem sx={{ display: 'flex', alignItems: 'center' }}>
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
                    sx={{ padding: '24px', display: 'flex', alignItems: 'center' }}
                    key={item.title}
                  >
                    <SvgIconStyle src={item.icon} sx={{ mr: 2 }} />
                    {item.title}
                  </ListItem>
                ))}
              </Stack>
              <ListItem sx={{ padding: '24px', display: 'flex', alignItems: 'center' }}>
                <SvgIconStyle src={'/icons/logout.svg'} sx={{ mr: 2 }} />
                <ListItemText
                  primary="Log out"
                  primaryTypographyProps={{ sx: { color: '#C91433' } }}
                />
              </ListItem>
            </Grid>
            <Grid item xs={9}>
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
                      {' '}
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
            </Grid>
          </Grid>
        </Container>
      </ContentStyle>
    </RootStyle>
  );
};

export default UserPage;
