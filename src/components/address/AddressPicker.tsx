// @mui
import {
  Box,
  Radio,
  RadioGroup,
  RadioGroupProps,
  BoxProps,
  Card,
  Typography,
  IconButton,
  FormControlLabel,
  FormGroup,
  FormControl,
} from '@mui/material';
import { Address } from 'src/@types/product';
import SvgIconStyle from '../SvgIconStyle';
import Label from '../Label';
import { Controller, useFormContext } from 'react-hook-form';

// ----------------------------------------------------------------------

interface Props extends RadioGroupProps {
  addresses: Address[];
  name: string;
}

export default function AddressPicker({ name, addresses, ...other }: Props) {
  const { control } = useFormContext();
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <RadioGroup sx={{ gap: 2 }} {...other} {...field}>
          {addresses.map((address) => (
            <Card sx={{ p: 2 }} key={address.id}>
              <FormControl sx={{ width: '100%' }}>
                <FormGroup>
                  <FormControlLabel
                    key={address.id}
                    control={<Radio  />}
                    value={address.id}
                    label={
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                          <Box sx={{ display: 'flex', gap: 0.5 }}>
                            <Typography variant="subtitle1">{address.receiver}</Typography>
                            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                              &nbsp;({address.addressType})
                            </Typography>
                            {address.isDefault && (
                              <Label color="info" sx={{ ml: 1 }}>
                                Default
                              </Label>
                            )}
                          </Box>
                          <Typography variant="body2">
                            {address.address + ' ' + address.fullName}
                          </Typography>
                          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                            {address.phone}
                          </Typography>
                        </Box>
                        <Box
                          sx={{
                            display: 'flex',
                          }}
                        >
                          {!address.isDefault && (
                            <IconButton
                              // onClick={() => deleteAddress(addressProp.id!)}
                              sx={{ color: '#C91433', p: '10px' }}
                              type="button"
                              aria-label="delete"
                            >
                              <SvgIconStyle src={'/icons/ic_trash.svg'} />
                            </IconButton>
                          )}
                          <IconButton
                            //   onClick={() => handleClickOpen(addressProp)}
                            sx={{ color: '#0C68F4', p: '10px' }}
                            type="button"
                            aria-label="edit"
                          >
                            <SvgIconStyle src={'/icons/ic_edit.svg'} />
                          </IconButton>
                        </Box>
                      </Box>
                    }
                  />
                </FormGroup>
              </FormControl>
            </Card>
          ))}
        </RadioGroup>
      )}
    />
  );
}
