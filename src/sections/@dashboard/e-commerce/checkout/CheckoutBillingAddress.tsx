import { useEffect, useMemo, useState } from 'react';
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
} from '@mui/material';
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
import address, { deleteAddress, getAddress } from 'src/redux/slices/address';
import CheckoutNewAddressForm from './CheckoutNewAddressForm';
import CheckoutSummary from './CheckoutSummary';
import useLocationContext from 'src/hooks/useLocation';
import SvgIconStyle from 'src/components/SvgIconStyle';
import AddressPicker from 'src/components/address/AddressPicker';
import { yupResolver } from '@hookform/resolvers/yup';
import { FormProvider } from 'src/components/hook-form';
import { useForm } from 'react-hook-form';
// ----------------------------------------------------------------------
interface FormValuesProps {
  address: number;
}

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
  const handleDelete = async (id: number) => {
    dispatch(deleteAddress(id));
  };
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
  const [addressSelected, setAddressSelected] = useState<Address>();
  useEffect(() => {
    setAddressSelected(addresses.adresss.find((item) => item.isDefault));
  }, []);

  const [addressEdit, setAddressEdit] = useState<Address>({} as Address);
  const defaultValues = useMemo(
    () => ({
      address: addresses.adresss.find((item) => item.isDefault)?.id!,
    }),
    [addresses]
  );
  useEffect(() => {
    console.log(addressSelected );
  }, [addressSelected]);
  const methods = useForm<FormValuesProps>({
    // resolver: yupResolver({}),
    defaultValues,
  });
  const {
    reset,
    watch,
    control,
    setValue,
    getValues,
    setError,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = methods;
  const onSubmit = () => {};

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          {addresses.adresss.length > 0 ? (
            // <AddressPicker name="address" addresses={addresses.adresss}></AddressPicker>
            addresses.adresss.map((address, index) => (
              <AddressItem
                deleteAddress={handleDelete}
                key={index}
                handleClickOpen={handleClickOpen}
                addressProp={address}
                onNextStep={handleNextStep}
                onCreateBilling={handleCreateBilling}
              />
            ))
          ) : (
            // addresses.adresss.map((address, index) => (
            //   <AddressItem
            //     deleteAddress={handleDelete}
            //     key={index}
            //     handleClickOpen={handleClickOpen}
            //     addressProp={address}
            //     onNextStep={handleNextStep}
            //     onCreateBilling={handleCreateBilling}
            //   />
            // ))
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
    </FormProvider>
  );
}

// ----------------------------------------------------------------------

type AddressItemProps = {
  addressProp: Address;
  onNextStep: VoidFunction;
  onCreateBilling: OnCreateBilling;
  handleClickOpen: (address: Address) => void;
  deleteAddress: (id: number) => void;
};
type AddressItemFormProps = {
  addressProp: Address;
  addresses:Address[];
  onNextStep: VoidFunction;
  onCreateBilling: OnCreateBilling;
  handleClickOpen: (address: Address) => void;
  deleteAddress: (id: number) => void;
};
function AddressItemForm({
  addressProp,
  handleClickOpen,
  onNextStep,
  onCreateBilling,
  deleteAddress,
  addresses
}: AddressItemFormProps) {
  const { id, fullName, receiver, address, addressType, phone, isDefault } = addressProp;
  const handleCreateBilling = () => {
    // onCreateBilling(address);
    onNextStep();
  };

  return (
    <Card sx={{ p: 3, mb: 3, position: 'relative' }}>
      <FormControlLabel
        value={id}
        control={<Radio />} // Set checked state
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
            // onClick={() => deleteAddress(id)}
            sx={{ color: '#C91433', p: '10px' }}
            type="button"
            aria-label="delete"
          >
            <SvgIconStyle src={'/icons/ic_trash.svg'} />
          </IconButton>
        )}
        <IconButton
          // onClick={() => handleClickOpen(id)}
          sx={{ color: '#0C68F4', p: '10px' }}
          type="button"
          aria-label="edit"
        >
          <SvgIconStyle src={'/icons/ic_edit.svg'} />
        </IconButton>
      </Box>
    </Card>
  );
}


function AddressItem({
  addressProp,
  handleClickOpen,
  onNextStep,
  onCreateBilling,
  deleteAddress,
}: AddressItemProps) {
  const { id, fullName, receiver, address, addressType, phone, isDefault } = addressProp;
  const handleCreateBilling = () => {
    // onCreateBilling(address);
    onNextStep();
  };

  return (
    <Card sx={{ p: 3, mb: 3, position: 'relative' }}>
      <FormControlLabel
        value={id}
        control={<Radio />} // Set checked state
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
            // onClick={() => deleteAddress(id)}
            sx={{ color: '#C91433', p: '10px' }}
            type="button"
            aria-label="delete"
          >
            <SvgIconStyle src={'/icons/ic_trash.svg'} />
          </IconButton>
        )}
        <IconButton
          // onClick={() => handleClickOpen(id)}
          sx={{ color: '#0C68F4', p: '10px' }}
          type="button"
          aria-label="edit"
        >
          <SvgIconStyle src={'/icons/ic_edit.svg'} />
        </IconButton>
      </Box>
    </Card>
  );
}
