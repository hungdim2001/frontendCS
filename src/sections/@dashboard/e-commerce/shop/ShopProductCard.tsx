import { Link as RouterLink, useNavigate } from 'react-router-dom';
// @mui

import {
  Box,
  Card,
  Link,
  Typography,
  Stack,
  IconButton,
  Button,
  Rating,
  RadioGroupProps,
  RadioGroup,
  Radio,
  BoxProps,
} from '@mui/material';
// routes
import { PATH_DASHBOARD } from '../../../../routes/paths';
// utils
import { fCurrency } from '../../../../utils/formatNumber';
// @types
import { CartItem, Product, ProductCharValue } from '../../../../@types/product';
// components
import Label from '../../../../components/Label';
import Image from '../../../../components/Image';
import { ColorPreview } from '../../../../components/color-utils';
import Iconify from 'src/components/Iconify';
import { useState } from 'react';
import useLocationContext from 'src/hooks/useLocation';
import { ActionAudit, logApi } from 'src/service/app-apis/log';
import { Action } from 'history';
import useAuth from 'src/hooks/useAuth';
import { Controller, useForm } from 'react-hook-form';
import { useSelector } from 'src/redux/store';

// ----------------------------------------------------------------------

type Props = {
  product: Product;
  onAddCart: (cartItem: CartItem) => void;
};

type FormValuesProps = CartItem;
export default function ShopProductCard({ product, onAddCart }: Props) {
  const { name, thumbnail, images, price, productSpecChars, id, variants } = product;
  const defaultValues = {
    name,
    variant:
      variants.length === 1 ? variants[0] : variants.find((item) => !item.chars.includes(-1)),
    quantity:
      variants.length === 1
        ? (variants[0]?.quantity ?? 0) < 1
          ? 0
          : 1
        : (variants.find((item) => !item.chars.includes(-1))?.quantity ?? 0) < 1
        ? 0
        : 1,
  };

  const methods = useForm<FormValuesProps>({
    defaultValues,
  });
  const { watch, control, setValue, getValues, handleSubmit } = methods;
  const linkTo = `${PATH_DASHBOARD.eCommerce.root}/product/${id}/${getValues('variant')?.id??''}`;
  const [hovered, setHovered] = useState(false);
  const navigate = useNavigate();
  const { currentLocation } = useLocationContext();
  const { user } = useAuth();

  const { checkout } = useSelector((state) => state.product);
  const { cart: currentCart } = checkout;

  const values = watch();
  const handleAddCart = async () => {
    try {
      console.log(currentCart.find((item) => item.variant.id === values.variant.id)?.quantity);
      console.log(variants.find((variant) => variant.id === values.variant.id)?.quantity);
      if (
        (currentCart.find((item) => item.variant.id === values.variant.id)?.quantity ?? 0) +
          values.quantity <
        (variants.find((variant) => variant.id === values.variant.id)?.quantity ?? 0)
      ) {
        onAddCart({
          ...values,
          subtotal: values.variant.price * values.quantity,
        });
      }
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <Card
      onClick={async () => {
        const log: ActionAudit = (await {
          userId: user?.id,
          browser: '',
          ipClient: currentLocation.ip,
          actionTime: new Date(),
          action: 'CLICK',
          variantId: getValues('variant')?.id ?? -1,
          deviceType: '',
          keyWord: '',
          lat: currentLocation.lat,
          lon: currentLocation.lon,
          road: currentLocation.address.road,
          quarter: currentLocation.address.quarter,
          suburb: currentLocation.address.suburb,
          city: currentLocation.address.city,
          ISO3166_2_lvl4: currentLocation.address.ISO3166_2_lvl4,
          postcode: currentLocation.address.postcode,
          country: currentLocation.address.country,
          country_code: currentLocation.address.country_code,
        }) as ActionAudit;
        await logApi.createLog(log);
        navigate(linkTo);
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Box sx={{ position: 'relative' }}>
        {price && (
          <Label
            variant="filled"
            color="error"
            sx={{
              top: 16,
              right: 16,
              zIndex: 9,
              position: 'absolute',
              textTransform: 'uppercase',
            }}
          >
            sale
          </Label>
        )}
        {/* {hovered && (
          <Button
            onClick={(e) => {
              handleAddCart();
              e.stopPropagation();
            }}
            sx={{
              backgroundColor: '#ffab00',
              color: '#000000',
              boxShadow: '#ffab003d 0px 8px 16px 0px',
              cursor: 'pointer',
              bottom: 16,
              right: 16,
              zIndex: 9,
              position: 'absolute',
              borderRadius: '50%',
              width: 48,
              height: 48,
              transition: 'all 200ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              minWidth: 32,
              visibility: 'visible', // Show the button on hover
              opacity: 1, // Show the button on hover
              '&:hover': {
                backgroundColor: '#b76e00',
              },
            }}
          >
            <Iconify icon={'bxs:cart-add'} width={24} height={24} />
          </Button>
        )} */}

        <Image alt={name} src={getValues('variant')?.image.toString() ?? thumbnail} ratio="1/1" />
      </Box>

      <Stack spacing={2} sx={{ p: 3 }}>
        <Typography variant="subtitle2" noWrap>
          {name}
        </Typography>
        <Stack direction="column" alignItems="start" justifyContent="start">
          <Stack direction="row" alignItems="center" spacing={0.5}>
            {price && (
              <Typography
                component="span"
                sx={{ color: 'text.disabled', textDecoration: 'line-through' }}
              >
                {fCurrency(price)}₫
              </Typography>
            )}
            <Typography variant="subtitle1">{fCurrency(price)}₫</Typography>
          </Stack>
          {productSpecChars
            .filter((char) => char.productSpecCharValueDTOS?.some((value) => value.variant))
            .map((char, index) => {
              return (
                <Stack key={index} direction="row" alignItems="start" sx={{ mb: 2 }}>
                  <Controller
                    name="variant"
                    control={control}
                    render={({ field }) => (
                      <VariantPicker
                        onClick={(e) => {
                          e.stopPropagation();
                        }}
                        charValues={char.productSpecCharValueDTOS!}
                        value={field.value}
                        onChange={(e) => {
                          const oldValue = field.value.chars.filter(
                            (old) =>
                              !char.productSpecCharValueDTOS?.map((char) => char.id).includes(old)
                          );
                          setValue(
                            'variant',
                            variants.find((variant) =>
                              variant.chars.every((char) =>
                                [...oldValue, Number(e.target.value)].includes(char)
                              )
                            )!
                          );
                        }}
                        sx={{
                          gap: '5px',
                        }}
                      />
                    )}
                  />
                </Stack>
              );
            })}
          {/* <Stack direction="row" alignItems="center" spacing={0.5}>
            {productSpecChars?.[0]?.productSpecCharValueDTOS?.[0]?.value && (
              <Label variant="filled">
                {productSpecChars?.[0]?.productSpecCharValueDTOS?.[0]?.value}
              </Label>
            )}

            {productSpecChars?.[1]?.productSpecCharValueDTOS?.[1]?.value && (
              <Label variant="filled">
                {productSpecChars?.[1]?.productSpecCharValueDTOS?.[1]?.value}
              </Label>
            )}
          </Stack>  */}
          <Rating readOnly={true} name="rating" defaultValue={4.5} precision={0.5} max={5} />
        </Stack>
      </Stack>
    </Card>
  );
}

interface VariantPickerProps extends RadioGroupProps {
  charValues: ProductCharValue[];
}

function VariantPicker({ charValues, value, ...other }: VariantPickerProps) {
  return (
    <RadioGroup row {...other}>
      {charValues.map((charValue) => (
        <Radio
          checked={value.chars.includes(charValue.id)}
          key={charValue.id}
          value={charValue.id}
          icon={<IconColor charValue={charValue} variant={value} />}
          checkedIcon={
            <IconColor
              sx={{
                color: 'black',
                border: `1px solid #0C68F4`,
              }}
              charValue={charValue}
              variant={value}
            />
          }
          sx={{
            padding: 0,
            '&:hover': { opacity: 0.72 },
          }}
        />
      ))}
    </RadioGroup>
  );
}

// ----------------------------------------------------------------------
interface BoxProps1 extends BoxProps {
  charValue: ProductCharValue;
  variant: number[];
}

function IconColor({ charValue, variant, sx }: BoxProps1) {
  return (
    <Box
      sx={{
        padding: '4px',
        color: '#6F6F6F',
        display: 'flex',
        fontWeight: 400,
        fontSize: '10px',
        border: '1px solid #D5D5D5',
        position: 'relative',
        alignItems: 'center',
        justifyContent: 'center',
        transition: (theme) =>
          theme.transitions.create('all', {
            duration: theme.transitions.duration.shortest,
          }),
        ...sx,
      }}
    >
      {charValue.value}
    </Box>
  );
}
