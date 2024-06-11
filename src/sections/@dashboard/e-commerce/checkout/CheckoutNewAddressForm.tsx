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
import { ghnAddress, ghnApi } from 'src/service/app-apis/ghn';

// ----------------------------------------------------------------------

interface FormValuesProps extends BillingAddress {
  province: number;
  district: number;
  address: string;
  ward: number;
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
  provinces: ghnAddress[];
  districts: ghnAddress[];
  wards: ghnAddress[];
  province?: ghnAddress;
  district?: ghnAddress;
  ward?: ghnAddress;
  setProvinces: React.Dispatch<React.SetStateAction<ghnAddress[]>>;
  setDistricts: React.Dispatch<React.SetStateAction<ghnAddress[]>>;
  setWards: React.Dispatch<React.SetStateAction<ghnAddress[]>>;
  setProvince: React.Dispatch<React.SetStateAction<ghnAddress | undefined>>;
  setDistrict: React.Dispatch<React.SetStateAction<ghnAddress | undefined>>;
  setWard: React.Dispatch<React.SetStateAction<ghnAddress | undefined>>;
};

export default function CheckoutNewAddressForm({
  open,
  addressEdit,
  onClose,
  provinces,
  districts,
  wards,
  province,
  district,
  ward,
  setProvinces,
  setDistricts,
  setWards,
  setProvince,
  setDistrict,
  setWard,
}: Props) {
  const NewAddressSchema = Yup.object().shape({
    receiver: Yup.string().required('Fullname is required'),
    phone: Yup.string()
      .required('Phone number is required')
      .matches(/^0[1-9]\d{8}$/, 'This is not a valid phone number'),
    address: Yup.string().required('Address is required'),
    province: Yup.string().required('Province is required'),
    district: Yup.string().required('District is required'),
    ward: Yup.string().required('Ward is required'),
    // streetBlock: Yup.string().required('Street block is required'),
  });
  const dispatch = useDispatch();
  const defaultValues = useMemo(
    () => ({
      addressType: addressEdit.addressType || 'Home',
      receiver: addressEdit.receiver || '',
      phone: addressEdit.phone || '',
      address: addressEdit.address || '',
      province: addressEdit.province,
      district: addressEdit.district,
      ward: addressEdit.ward,
      isDefault: addressEdit.isDefault || false,
    }),
    [addressEdit]
  );
  // const { locationState, handleLocationSelect, initFromOld } = useLocationContext();
  // const { provinces, districts, precincts, streetBlocks } = locationState;
  useEffect(() => {
    const fetchData = async () => {
      const data = await ghnApi.getProvince();
      await setProvinces(data);
    };
    fetchData();
  }, []);
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
          province: data.province,
          district: data.district,
          ward: data.ward,
          addressType: data.addressType,
          phone: data.phone,
          isDefault: data.isDefault,
          userId: user?.id,
          updateUser: user?.id,
          updateDatetime: new Date(),
          address: data.address,
          lat: selectPosition.lat,
          fullName: ward?.WardName! + ' ' + district?.DistrictName! + ' ' + province?.ProvinceName,
          lon: selectPosition.lon,
        };
        const response = await addressApi.createOrUpdate(address);
        console.log(response);
        dispatch(getAddressSucess(response));
      } else {
        const address: Address = {
          receiver: data.receiver,
          province: data.province,
          district: data.district,
          ward: data.ward,
          addressType: data.addressType,
          phone: data.phone,
          isDefault: data.isDefault,
          userId: user?.id,
          fullName: ward?.WardName! + ' ' + district?.DistrictName! + ' ' + province?.ProvinceName,
          createUser: user?.id,
          createDatetime: new Date(),
          address: data.address,
          lat: selectPosition.lat,
          lon: selectPosition.lon,
        } as Address;
        const response = await addressApi.createOrUpdate(address);
        dispatch(getAddressSucess(response));
      }
      reset();
      onClose();
    } catch (error) {
      console.error(error);
      if (isMountedRef.current) {
        setError('afterSubmit', { type: 'custom', message: error.message });
      }
    }
  };
  type Field = 'province' | 'district' | 'ward';
  const handleChange = async (value: any, field: Field) => {
    const selectedValue = value;
    let option: ghnAddress;
    setValue(field, selectedValue, { shouldValidate: true });
    if (field === 'province') {
      option = provinces.find((c) => c.ProvinceID == selectedValue)!;
      await resetField('district');
      await resetField('ward');
      const response = await ghnApi.getDistrict(option.ProvinceID);
      await setDistricts(response);
      setDistrict(undefined);
      setWard(undefined);
      setWards([]);
      setProvince(option);
    } else if (field === 'district') {
      option = districts.find((c) => c.DistrictID == selectedValue)!;
      resetField('ward');
      const response = await ghnApi.getWard(option.DistrictID);
      await setWards(response);
      setWard(undefined);
      setDistrict(option);
    } else {
      option = wards.find((c) => c.WardCode == selectedValue)!;

      setWard(option);
    }
  };
  const [selectPosition, setSelectPosition] = useState<{ lat: number; lon: number } | null>(null);
  useEffect(() => {
    setSelectPosition(addressEdit ? { lat: addressEdit.lat, lon: addressEdit.lon } : null);
  }, [addressEdit]);
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
                {provinces &&
                  provinces.length > 0 &&
                  provinces
                    .sort((a, b) => a.ProvinceName.localeCompare(b.ProvinceName))
                    .map((option) => (
                      <option key={option.ProvinceID} value={option.ProvinceID}>
                        {option.ProvinceName}
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
                {districts &&
                  districts.length > 0 &&
                  districts
                    .sort((a, b) => a.DistrictName.localeCompare(b.DistrictName))
                    .map((option) => (
                      <option key={option.DistrictID} value={option.DistrictID!}>
                        {option.DistrictName}
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
                onChange={(e) => handleChange(e.target.value, 'ward')}
                disabled={wards.length === 0}
                name="ward"
                label="Ward"
                placeholder="Ward"
              >
                <option value="" />
                {wards &&
                  wards.length > 0 &&
                  wards
                    .sort((a, b) => a.WardName.localeCompare(b.WardName))
                    .map((option) => (
                      <option key={option.WardCode} value={option.WardCode!}>
                        {option.WardName}
                      </option>
                    ))}
              </RHFSelect>
              <RHFTextField name="address" label="Address" />
            </Box>
            {/* <RHFTextField name="address" label="Address" /> */}
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
