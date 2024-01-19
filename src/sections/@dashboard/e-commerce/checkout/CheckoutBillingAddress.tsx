import { useEffect, useState } from 'react';
// @mui
import { Box, Grid, Card, Button, Typography } from '@mui/material';
// @types
import { Address, OnCreateBilling } from '../../../../@types/product';
// redux
import { useDispatch, useSelector } from '../../../../redux/store';
import { onBackStep, onNextStep, createBilling } from '../../../../redux/slices/product';
// _mock_
import { _addressBooks } from '../../../../_mock';
// components
import Label from '../../../../components/Label';
import Iconify from '../../../../components/Iconify';
//
import CheckoutSummary from './CheckoutSummary';
import CheckoutNewAddressForm from './CheckoutNewAddressForm';
import useAuth from 'src/hooks/useAuth';
import address, { getAddressSucess } from 'src/redux/slices/address';
import Maps from 'src/components/GoogleMap';

// ----------------------------------------------------------------------

export default function CheckoutBillingAddress() {
  //
  const dispatch = useDispatch();
  const { checkout } = useSelector((state) => state.product);

  const { addresss } = useSelector((state) => state);
  const { total, discount, subtotal } = checkout;
  //

  const { user } = useAuth();

  const [open, setOpen] = useState(false);
  useEffect(() => {
    dispatch(getAddressSucess(user?.id));
  }, [dispatch]);
  const handleClickOpen = () => {
    setOpen(true);
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

  return (
    <>
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Maps selectPosition={null}></Maps>
          {addresss.adresss.length>0 ? (
            addresss.adresss.map((address, index) => (
              <AddressItem
                key={index}
                addressProp={address}
                onNextStep={handleNextStep}
                onCreateBilling={handleCreateBilling}
              />
            ))
          ) : (
            <></>
          )}
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
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
              onClick={handleClickOpen}
              startIcon={<Iconify icon={'eva:plus-fill'} />}
            >
              Add new address
            </Button>
          </Box>
        </Grid>

        <Grid item xs={12} md={4}>
          <CheckoutSummary subtotal={subtotal} total={total} discount={discount} />
        </Grid>
      </Grid>

      <CheckoutNewAddressForm
        open={open}
        onClose={handleClose}
        onNextStep={handleNextStep}
        onCreateBilling={handleCreateBilling}
      />
    </>
  );
}

// ----------------------------------------------------------------------

type AddressItemProps = {
  addressProp: Address;
  onNextStep: VoidFunction;
  onCreateBilling: OnCreateBilling;
};

function AddressItem({ addressProp, onNextStep, onCreateBilling }: AddressItemProps) {
  const { receiver, address, addressType, phone, isDefault } = addressProp;

  const handleCreateBilling = () => {
    // onCreateBilling(address);
    onNextStep();
  };

  return (
    <Card sx={{ p: 3, mb: 3, position: 'relative' }}>
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
      
      <Typography variant="body2" gutterBottom>
        {address}
      </Typography>
      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
        {phone}
      </Typography>

      <Box
        sx={{
          mt: 3,
          display: 'flex',
          position: { sm: 'absolute' },
          right: { sm: 24 },
          bottom: { sm: 24 },
        }}
      >
        {!isDefault && (
          <Button variant="outlined" size="small" color="inherit">
            Delete
          </Button>
        )}
        <Box sx={{ mx: 0.5 }} />
        <Button variant="outlined" size="small" onClick={handleCreateBilling}>
          Deliver to this Address
        </Button>
      </Box>
    </Card>
  );
}
