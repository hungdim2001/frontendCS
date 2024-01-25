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
  Alert,
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
import Maps from 'src/components/GoogleMap';
import { useEffect, useMemo, useState } from 'react';
import useIsMountedRef from 'src/hooks/useIsMountedRef';
import { getAddressSucess } from 'src/redux/slices/address';
import { useDispatch } from 'src/redux/store';

// ----------------------------------------------------------------------

interface FormValuesProps extends BillingAddress {
  province: string;
  district: string;
  address: string;
  precinct: string;
  streetBlock: string;
  afterSubmit?: string;
  receiver: string;
  phone: string;
  addressType: string;
  isDefault: boolean;
}

type Props = {
  open: boolean;
  addressEdit: Address;
  onClose: VoidFunction;
};

export default function CheckoutNewAddressForm({
  open,
  onClose,
  addressEdit,
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
  const dispatch = useDispatch();
  const defaultValues = useMemo(
    () => ({
      addressType: addressEdit.addressType || 'Home',
      receiver: addressEdit.receiver || '',
      phone: addressEdit.phone || '',
      address: addressEdit.address || '',
      streetBlock:
        addressEdit.province +
        addressEdit.district +
        addressEdit.precinct +
        addressEdit.streetBlock || '',
      province: addressEdit.province || '',
      district: addressEdit.province + addressEdit.district || '',
      precinct: addressEdit.province + addressEdit.district + addressEdit.precinct || '',
      isDefault: addressEdit.isDefault || false,
    }),
    [addressEdit]
  );
  const { locationState, handleLocationSelect, initFromOld } = useLocationContext();
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
    setError,
    reset,
    formState: { isSubmitting, errors },
  } = methods;
  const isMountedRef = useIsMountedRef();
  const onSubmit = async (data: FormValuesProps) => {
    try {
      // onNextStep();
      if (!selectPosition) {
        throw new Error('location has not been selected');
      }
      if (addressEdit.id) {
        const address = {
          ...addressEdit,
          receiver: data.receiver,
          areaCode: data.streetBlock,
          addressType: data.addressType,
          phone: data.phone,
          isDefault: data.isDefault,
          userId: user?.id,
          updateUser: user?.id,
          updateDatetime: new Date(),
          address: data.address,
          lat: selectPosition.lat,
          lon: selectPosition.lon,
        }
        const response = await addressApi.createOrUpdate(address);
        console.log(response)
        dispatch(getAddressSucess(response));
      }
      else {
        const address: Address = {
          receiver: data.receiver,
          areaCode: data.streetBlock,
          addressType: data.addressType,
          phone: data.phone,
          isDefault: data.isDefault,
          userId: user?.id,
          createUser: user?.id,
          createDatetime: new Date(),
          address: data.address,
          lat: selectPosition.lat,
          lon: selectPosition.lon,
        } as Address;
        const response = await addressApi.createOrUpdate(address);
        console.log(response)
        dispatch(getAddressSucess(response));
      }
      reset();
      onClose()
    } catch (error) {
      console.error(error);
      if (isMountedRef.current) {
        setError('afterSubmit', { type: 'custom', message: error.message });
      }
    }
  };
  type Field = 'province' | 'district' | 'precinct' | 'streetBlock';
  const handleChange = (value: any, field: Field) => {
    const selectedValue = value;
    let option: areaResponse | undefined;
    setValue(field, selectedValue, { shouldValidate: true });
    if (field === 'province') {
      option = provinces.find((c) => c.areaCode === selectedValue);
      resetField('precinct');
      resetField('streetBlock');
      handleLocationSelect(option, field);
    } else if (field === 'district') {
      option = districts.find((c) => c.areaCode === selectedValue);
      resetField('precinct');
      resetField('streetBlock');
      handleLocationSelect(option, field);
    } else if (field === 'precinct') {
      option = precincts.find((c) => c.areaCode === selectedValue);
      resetField('streetBlock');
      handleLocationSelect(option, field);
    } else {
      handleLocationSelect(option, field);
    }
  };
  const [selectPosition, setSelectPosition] = useState<{ lat: number; lon: number } | null>(null);
  useEffect(() => {
    setSelectPosition(addressEdit ? { lat: addressEdit.lat, lon: addressEdit.lon } : null);
  }, [addressEdit])
  return (
    <Dialog fullWidth maxWidth="sm" open={open} onClose={onClose}>
      <DialogTitle>Add new address</DialogTitle>
      {!!errors.afterSubmit && <Alert severity="error">{errors.afterSubmit.message}</Alert>}
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
                onChange={(e) => handleChange(e.target.value, 'province')}
              >
                <option value="" />
                {provinces.map((option) => (
                  <option key={option.areaCode} value={option.areaCode!}>
                    {option.name}
                  </option>
                ))}
              </RHFSelect>
              <RHFSelect
                onChange={(e) => handleChange(e.target.value, 'district')}
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
                onChange={(e) => handleChange(e.target.value, 'precinct')}
                disabled={precincts.length === 0}
                name="precinct"
                label="Precinct"
                placeholder="Precinct"
              >
                <option value="" />
                {precincts.map((option) => (
                  <option key={option.areaCode} value={option.areaCode!}>
                    {option.name}
                  </option>
                ))}
              </RHFSelect>

              <RHFSelect
                onChange={(e) => handleChange(e.target.value, 'streetBlock')}
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
            <RHFTextField name="address" label="Address" />
            <Box
              sx={{
                display: 'grid',
                rowGap: 3,
                // columnGap: 2,
                gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(1, 1fr)' },
              }}
            >
              <Maps selectPosition={selectPosition} setSelectPosition={setSelectPosition}></Maps>
            </Box>

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
