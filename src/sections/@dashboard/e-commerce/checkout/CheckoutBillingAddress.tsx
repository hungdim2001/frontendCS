import { useEffect, useState } from 'react';
// @mui
import { Box, Button, Card, Grid, Typography } from '@mui/material';
// @types
import { Address, OnCreateBilling } from '../../../../@types/product';
// redux
import { createBilling, onBackStep, onNextStep } from '../../../../redux/slices/product';
import { useDispatch, useSelector } from '../../../../redux/store';
// _mock_
// components
import Iconify from '../../../../components/Iconify';
import Label from '../../../../components/Label';
//
import useAuth from 'src/hooks/useAuth';
import { getAddress } from 'src/redux/slices/address';
import CheckoutNewAddressForm from './CheckoutNewAddressForm';
import CheckoutSummary from './CheckoutSummary';
import useLocationContext from 'src/hooks/useLocation';
// ----------------------------------------------------------------------

export default function CheckoutBillingAddress() {
  //
  const dispatch = useDispatch();
  const { checkout } = useSelector((state) => state.product);

  const { addresses } = useSelector((state) => state);
  const { total, discount, subtotal } = checkout;
  //

  const { user } = useAuth();

  const [open, setOpen] = useState(false);
  useEffect(() => {
    dispatch(getAddress(user?.id!));
  }, [dispatch]);

  const { initFromOld } = useLocationContext();
  const handleClickOpen = async (address: Address) => {
    if (address.province && address.district && address.precinct && address.streetBlock)
      await initFromOld(
        address.province,
        address.province + address.district,
        address.province + address.district + address.precinct,
        address.province + address.district + address.precinct + address.streetBlock
      );
    await setAddressEdit(address);
    console.log(address);
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
  const [addressEdit, setAddressEdit] = useState<Address>({} as Address);
  return (
    <>
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          {addresses.adresss.length > 0 ? (
            addresses.adresss.map((address, index) => (
              <AddressItem
                key={index}
                handleClickOpen={handleClickOpen}
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
              onClick={() => handleClickOpen({} as Address)}
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
      {open ? (
        <CheckoutNewAddressForm
          addressEdit={addressEdit}
          open={open}
          onClose={handleClose}
          onNextStep={handleNextStep}
          onCreateBilling={handleCreateBilling}
        />
      ) : (
        <></>
      )}
    </>
  );
}

// ----------------------------------------------------------------------

type AddressItemProps = {
  addressProp: Address;
  onNextStep: VoidFunction;
  onCreateBilling: OnCreateBilling;
  handleClickOpen: (address: Address) => void;
};

function AddressItem({
  addressProp,
  handleClickOpen,
  onNextStep,
  onCreateBilling,
}: AddressItemProps) {
  const { fullName, receiver, address, addressType, phone, isDefault } = addressProp;

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
        {address + ' ' + fullName}
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
        <Button
          onClick={() => handleClickOpen(addressProp)}
          variant="outlined"
          size="small"
          color="inherit"
        >
          Edit
        </Button>
        <Box sx={{ mx: 0.5 }} />
        <Button variant="outlined" size="small" onClick={handleCreateBilling}>
          Deliver to this Address
        </Button>
      </Box>
    </Card>
  );
}
