// @mui
import { Box, Radio, RadioGroup, RadioGroupProps, BoxProps, Card, Typography, IconButton } from '@mui/material';
import { Address } from 'src/@types/product';
import SvgIconStyle from '../SvgIconStyle';
import Label from '../Label';

// ----------------------------------------------------------------------

interface Props extends RadioGroupProps {
  addresses:Address[];
}

export default function AddressPicker({ addresses, value, ...other }: Props) {
  return (
    <RadioGroup  row {...other}>
      {addresses.map((address) => (
        <Radio
          // checked={value.chars.includes(address.id)}
          key={address.id}
          value={address.id}
          icon={<IconColor addressProp={address} />}
          checkedIcon={
            <IconColor
              addressProp={address}
            />
          }
          // sx={{
          //   padding: 0,
          //   '&:hover': { opacity: 0.72 },
          // }}
        />
      ))}
    </RadioGroup>
  );
}

// ----------------------------------------------------------------------
interface BoxProps1 extends BoxProps {
  addressProp: Address;
}
function IconColor({ addressProp,  sx }: BoxProps1) {
  // const isaddressInChars = variant.some((char) => char === address.id);
  const { fullName, receiver, address, addressType, phone, isDefault } = addressProp;
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
          // mt: 3,
          gap: 1,
          display: 'flex',
          position: { sm: 'absolute' },
          right: { sm: 24 },
          bottom: { sm: 24 },
        }}
      >
        {!isDefault && (
          <IconButton
            // onClick={() => deleteAddress(addressProp.id!)}
            sx={{ color: '#C91433', p: '10px' }} type="button" aria-label="current location">
            <SvgIconStyle src={'/icons/ic_trash.svg'} />
          </IconButton>
        )}
        <IconButton
        //   onClick={() => handleClickOpen(addressProp)}
          sx={{ color: '#0C68F4', p: '10px' }} type="button" aria-label="current location">
          <SvgIconStyle src={'/icons/ic_edit.svg'} />
        </IconButton>
        {/* <Button variant="outlined" size="small" onClick={handleCreateBilling}>
          Deliver to this Address
        </Button> */}
      </Box>
    </Card>
  );
}
