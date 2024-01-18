import * as Yup from 'yup';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import {
  Box,
  Stack,
  Dialog,
  Button,
  Divider,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
// @types
import { OnCreateBilling, BillingAddress, Address } from '../../../../@types/product';
// _mock
import { countries } from '../../../../_mock';
import {
  FormProvider,
  RHFCheckbox,
  RHFSelect,
  RHFTextField,
  RHFRadioGroup,
} from '../../../../components/hook-form';
import useLocationContext from 'src/hooks/useLocation';
import { areaResponse } from 'src/service/app-apis/location';
import { addressApi } from 'src/service/app-apis/address';
import useAuth from 'src/hooks/useAuth';

// ----------------------------------------------------------------------

interface FormValuesProps extends BillingAddress {
  province: string;
  district: string;
  address: string;
  precinct: string;
  streetBlock: string;
}

type Props = {
  open: boolean;
  onClose: VoidFunction;
  onNextStep: VoidFunction;
  onCreateBilling: OnCreateBilling;
};

export default function CheckoutNewAddressForm({
  open,
  onClose,
  onNextStep,
  onCreateBilling,
}: Props) {
  const NewAddressSchema = Yup.object().shape({
    receiver: Yup.string().required('Fullname is required'),
    phone: Yup.string()
      .required('Phone number is required')
      .matches(/^0[1-9]\d{8}$/, 'This is not a valid phone number'),
    address: Yup.string().required('Address is required'),
    province: Yup.string().required('Province is required'),
    district: Yup.string().required('District is required'),
    precinct: Yup.string().required('Precinct is required'),
    streetBlock: Yup.string().required('Street block is required'),
  });

  const defaultValues = {
    addressType: 'Home',
    receiver: '',
    phone: '',
    streetBlock: '',
    province: '',
    district: '',
    precinct: '',
    zipcode: '',
    isDefault: true,
  };
  const {
    locationState,

    handleLocationSelect,
  } = useLocationContext();
  const { provinces, districts, precincts, streetBlocks } = locationState;
  const methods = useForm<FormValuesProps>({
    resolver: yupResolver(NewAddressSchema),
    defaultValues,
  });
  const { user } = useAuth();
  const {
    handleSubmit,
    setValue,
    resetField,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = async (data: FormValuesProps) => {
    try {
      // onNextStep();

      const address: Address = {
        receiver: data.receiver,
        areaCode: data.province + data.district + data.precinct,
        addressType: data.addressType,
        phone: data.phone,
        isDefault: data.isDefault,
        userId: user?.id,
        createUser: user?.id,
        createDatetime: new Date(),
        address: data.address,
      } as Address;
      // addressApi.createOrUpdate();

      // onCreateBilling({
      //   receiver: data.receiver,
      //   phone: data.phone,
      //   // fullAddress: `${data.address}, ${data.city}, ${data.state}, ${data.country}, ${data.zipcode}`,
      //   addressType: data.addressType,
      //   isDefault: data.isDefault,
      // });
    } catch (error) {
      console.error(error);
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
    <Dialog fullWidth maxWidth="sm" open={open} onClose={onClose}>
      <DialogTitle>Add new address</DialogTitle>

      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          <Stack spacing={3}>
            <RHFRadioGroup name="addressType" options={['Home', 'Office']} />

            <Box
              sx={{
                display: 'grid',
                rowGap: 3,
                columnGap: 2,
                gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' },
              }}
            >
              <RHFTextField name="receiver" label="Full Name" />
              <RHFTextField name="phone" label="Phone Number" />
            </Box>

            <Box
              sx={{
                display: 'grid',
                rowGap: 3,
                columnGap: 2,
                gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' },
              }}
            >
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
            </Box>
            <Box
              sx={{
                display: 'grid',
                rowGap: 3,
                columnGap: 2,
                gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' },
              }}
            >
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
            </Box>
d            <RHFTextField name="address" label="Address" />
            <RHFCheckbox name="isDefault" label="Use this address as default." sx={{ mt: 3 }} />
          </Stack>
        </DialogContent>

        <Divider />

        <DialogActions>
          <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
            Add Address
          </LoadingButton>
          <Button color="inherit" variant="outlined" onClick={onClose}>
            Cancel
          </Button>
        </DialogActions>
      </FormProvider>
    </Dialog>
  );
}
