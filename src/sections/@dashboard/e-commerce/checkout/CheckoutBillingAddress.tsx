import { useEffect, useState } from 'react';
// @mui

import {
  Box,
  Button,
  Card,
  FormControlLabel,
  Grid,
  IconButton,
  Radio,
  Typography,
  styled,
} from '@mui/material';
// @types
import { Address } from '../../../../@types/product';
// redux
import { createBilling, onBackStep, onNextStep } from '../../../../redux/slices/product';
import { useDispatch, useSelector } from '../../../../redux/store';
// _mock_
// components
import Iconify from '../../../../components/Iconify';
import Label from '../../../../components/Label';
//
import SvgIconStyle from 'src/components/SvgIconStyle';
import useAuth from 'src/hooks/useAuth';
import { deleteAddress, getAddress } from 'src/redux/slices/address';
import { ghnAddress, ghnApi } from 'src/service/app-apis/ghn';
import CheckoutNewAddressForm from './CheckoutNewAddressForm';
import CheckoutSummary from './CheckoutSummary';
// ----------------------------------------------------------------------
export default function CheckoutBillingAddress() {
  const dispatch = useDispatch();
  const { checkout } = useSelector((state) => state.product);

  const { addresses } = useSelector((state) => state);
  const { total, discount, subtotal } = checkout;

  const { user } = useAuth();

  const [open, setOpen] = useState(false);
  useEffect(() => {
    dispatch(getAddress(user?.id!));
  }, [dispatch]);
  const handleDelete = async (id: number) => {
    if (id === addressSelected?.id) setAddressSelected(undefined);
    dispatch(deleteAddress(id));
  };
  const [provinces, setProvinces] = useState<ghnAddress[]>([]);
  const [districts, setDistricts] = useState<ghnAddress[]>([]);
  const [wards, setWards] = useState<ghnAddress[]>([]);
  const [province, setProvince] = useState<ghnAddress>();
  const [district, setDistrict] = useState<ghnAddress>();
  const [ward, setWard] = useState<ghnAddress>();
  const handleClickOpen = async (address: Address) => {
    if (address.province && address.district && address.ward) {
      const provinces = await ghnApi.getProvince();
      const province = provinces.find((c) => c.ProvinceID == address.province)!;
      setProvinces(provinces);
      setProvince(province);
      const districts = await ghnApi.getDistrict(address.province);
      const district = districts.find((c) => c.DistrictID == address.district)!;
      setDistricts(districts);
      setDistrict(district);
      const wards = await ghnApi.getWard(address.district);
      const ward = wards.find((c) => c.WardCode == address.ward)!;
      setWards(wards);
      setWard(ward);
    }
    await setAddressEdit(address);
    await setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const handleNextStep = () => {
    dispatch(onNextStep());
  };

  const handleBackStep = () => {
    dispatch(onBackStep());
  };
  const handleCreateBilling = (value: Address) => {
    dispatch(createBilling(value));
  };
  const [addressSelected, setAddressSelected] = useState<Address>();
  useEffect(() => {
    if (!addressSelected) setAddressSelected(addresses.adresss.find((item) => item.isDefault)!);
  }, [addresses]);
  const [addressEdit, setAddressEdit] = useState<Address>({} as Address);

  return (
    <>
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          {addresses.adresss.length > 0 ? (
            addresses.adresss.map((address, index) => (
              <AddressItemForm
                setAddressSelected={setAddressSelected}
                deleteAddress={handleDelete}
                key={index}
                handleClickOpen={handleClickOpen}
                addressProp={address}
                addressSelected={addressSelected!}
              />
            ))
          ) : (
            <></>
          )}
          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between' }}>
            <Button
              size="small"
              color="inherit"
              onClick={handleBackStep}
              startIcon={<Iconify icon={'eva:arrow-ios-back-fill'} />}
            >
              Back
            </Button>
            <Button
              size="small"
              onClick={() => handleClickOpen({} as Address)}
              startIcon={<Iconify icon={'eva:plus-fill'} />}
            >
              Add new address
            </Button>
          </Box>
        </Grid>

        <Grid item xs={12} md={4}>
          <CheckoutSummary subtotal={subtotal} total={total} discount={discount} />
          <Button
            fullWidth
            size="large"
            type="submit"
            variant="contained"
            disabled={!addressSelected}
            onClick={(e) => {
              handleCreateBilling(addressSelected!);
              handleNextStep();
            }}
          >
            Continue to pay
          </Button>
        </Grid>
      </Grid>
      {open ? (
        <CheckoutNewAddressForm
          addressEdit={addressEdit}
          open={open}
          onClose={handleClose}
          provinces={provinces}
          districts={districts}
          wards={wards}
          setProvinces={setProvinces}
          setDistricts={setDistricts}
          setWards={setWards}
          province={province}
          district={district}
          ward={ward}
          setProvince={setProvince}
          setDistrict={setDistrict}
          setWard={setWard}
        />
      ) : (
        <></>
      )}
    </>
  );
}

// ----------------------------------------------------------------------

type AddressItemFormProps = {
  addressProp: Address;
  setAddressSelected: (address: Address) => void;
  addressSelected: Address;
  handleClickOpen: (address: Address) => void;
  deleteAddress: (id: number) => void;
};

const  OptionStyle = styled('div')(({ theme }) => ({
  padding: theme.spacing(2),
  position:'relative',
  marginBottom:theme.spacing(3),
  transition: theme.transitions.create('all'),
  border: `solid 1px ${theme.palette.divider}`,
  borderRadius: Number(theme.shape.borderRadius) * 1.5,
}));
function AddressItemForm({
  addressProp,
  handleClickOpen,
  deleteAddress,
  addressSelected,
  setAddressSelected,
}: AddressItemFormProps) {
  const { id, fullName, receiver, address, addressType, phone, isDefault } = addressProp;
  return (
    <OptionStyle>
      <FormControlLabel
        value={id}
        control={
          <Radio
            checkedIcon={<Iconify icon={'eva:checkmark-circle-2-fill'} />}
            onChange={(e) => {
              setAddressSelected(addressProp);
            }}
            checked={addressSelected ? id === addressSelected.id : false}
          />
        }
        label={
          <Box sx={{ mb: 1, display: 'flex', alignItems: 'center' }}>
            <Typography variant="subtitle1">{receiver}</Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              &nbsp;({addressType})
            </Typography>
            {isDefault && (
              <Label color="info" sx={{ ml: 1 }}>
                Default
              </Label>
            )}
          </Box>
        }
      />
      <Typography variant="body2" gutterBottom>
        {address + ' ' + fullName}
      </Typography>
      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
        {phone}
      </Typography>

      <Box
        sx={{
          gap: 1,
          display: 'flex',
          position: { sm: 'absolute' },
          right: { sm: 24 },
          bottom: { sm: 24 },
        }}
      >
        {!isDefault && (
          <IconButton
            onClick={() => deleteAddress(id!)}
            sx={{ color: '#C91433', p: '10px' }}
            type="button"
            aria-label="delete"
          >
            <SvgIconStyle src={'/icons/ic_trash.svg'} />
          </IconButton>
        )}
        <IconButton
          onClick={() => handleClickOpen(addressProp)}
          sx={{ color: '#0C68F4', p: '10px' }}
          type="button"
          aria-label="edit"
        >
          <SvgIconStyle src={'/icons/ic_edit.svg'} />
        </IconButton>
      </Box>
    </OptionStyle>
  );
}
