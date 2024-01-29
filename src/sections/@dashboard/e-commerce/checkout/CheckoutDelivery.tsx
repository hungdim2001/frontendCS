// form
import { Controller, useFormContext } from 'react-hook-form';
// @mui
import { styled } from '@mui/material/styles';
import {
  Box,
  Card,
  Radio,
  Stack,
  Typography,
  RadioGroup,
  CardHeader,
  CardContent,
  FormControlLabel,
} from '@mui/material';
// @types
import { DeliveryOption, DeliveryService } from '../../../../@types/product';
// components
import Iconify from '../../../../components/Iconify';
import { format } from 'date-fns';

// ----------------------------------------------------------------------

const OptionStyle = styled('div')(({ theme }) => ({
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 2.5),
  justifyContent: 'space-between',
  transition: theme.transitions.create('all'),
  border: `solid 1px ${theme.palette.divider}`,
  borderRadius: Number(theme.shape.borderRadius) * 1.5,
}));

// ----------------------------------------------------------------------

type Props = {
  deliveryServices: DeliveryService[];
  onApplyShipping: (shipping: number) => void;
};

export default function CheckoutDelivery({
  onApplyShipping,
  deliveryServices,
}: Props) {
  const { control } = useFormContext();
  return (
    <Card>
      <CardHeader title="Delivery options" />
      <CardContent>
        <Controller
          name="delivery"
          control={control}
          render={({ field }) => (
            <RadioGroup
              {...field}
              onChange={(event) => {
                const { value } = event.target;
                field.onChange(Number(value));
                onApplyShipping(Number(value));
              }}
            >
              <Stack spacing={2} alignItems="center" direction={{ xs: 'column', md: 'row' }}>
                {deliveryServices.map((delivery) => {
                  const selected = field.value === delivery.service_id;

                  return (
                    <OptionStyle
                      key={delivery.service_id}
                      sx={{
                        ...(selected && {
                          boxShadow: (theme) => theme.customShadows.z20,
                        }),
                      }}
                    >
                      <FormControlLabel
                        value={delivery.service_id}
                        control={
                          <Radio checkedIcon={<Iconify icon={'eva:checkmark-circle-2-fill'} />} />
                        }
                        label={
                          <Box sx={{ ml: 1 }}>
                            <Typography variant="subtitle2">{delivery.short_name}</Typography>
                            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                              {format(
                                new Date(delivery.estimate_delivery_time * 1000),
                                'EEE MMM dd yyyy'
                              )}
                            </Typography>
                          </Box>
                        }
                        sx={{ py: 3, flexGrow: 1, mr: 0 }}
                      />
                    </OptionStyle>
                  );
                })}
              </Stack>
            </RadioGroup>
          )}
        />
      </CardContent>
    </Card>
  );
}
