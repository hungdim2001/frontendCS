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
import { PATH_DASHBOARD, PATH_ROOT } from '../../../../routes/paths';
// utils
import { caculatorPercent, fCurrency } from '../../../../utils/formatNumber';
// @types
import { CartItem, Product, ProductCharValue, Variant } from '../../../../@types/product';
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
  const linkTo = `${PATH_ROOT.products.root}/${id}/${getValues('variant')?.id ?? ''}`;
  const [hovered, setHovered] = useState(false);
  const navigate = useNavigate();
  const { currentLocation } = useLocationContext();
  const { user } = useAuth();

  const { checkout } = useSelector((state) => state.product);
  const { cart: currentCart } = checkout;

  const values = watch();
  const handleAddCart = async () => {
    try {
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
      <Box
        sx={{
          position: 'relative',
          borderBottom: '1px solid #B4B4B4',
          borderImageSource:
            'linear-gradient(90deg, rgba(68, 68, 68, 0.1) 0%, rgba(16, 16, 16, 0.7) 54.17%, rgba(68, 68, 68, 0.1) 99.47%)',
          borderImageSlice: 1,
          p: 2,
        }}
      >
        {getValues('variant').discountPrice && (
          <Label
            variant="filled"
            sx={{
              backgroundColor: '#FDDBC9',
              color: '#F45E0C',
              top: '16px',
              padding: '4px',
              left: 0,
              zIndex: 9,
              borderRadius: '0px 4px 4px 0px',
              position: 'absolute',
            }}
          >

            {caculatorPercent(getValues('variant').discountPrice!, getValues('variant').price)}%
          </Label>
        )}
        <Image alt={name} src={getValues('variant')?.image.toString() ?? thumbnail} ratio="1/1" />
      </Box>
      <Stack spacing={2} sx={{ p: 2 }}>
        <Typography
          sx={{ textOverflow: 'ellipsis', overflow: 'hidden', maxHeight: '48px' }}
          variant="subtitle2"
          component="div"
        >
          {name}
        </Typography>
        <Stack direction="column" alignItems="start" justifyContent="start">
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
                        variants={variants}
                        currentVariant={getValues('variant')}
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
          {getValues('variant').discountPrice && (
            <Typography
              component="span"
              sx={{ color: 'text.disabled', textDecoration: 'line-through' }}
            >
              {fCurrency(getValues('variant').price)}₫
            </Typography>
          )}
          <Box sx={{ display: 'flex', width: '100%', justifyContent: 'space-between' }}>
            <Typography component="div" variant="subtitle1">
              
              {getValues('variant').discountPrice!? fCurrency(getValues('variant').discountPrice!): fCurrency(getValues('variant').price)}₫
            </Typography>
            <Typography
              component="div"
              sx={{
                display: 'flex',
                gap: 0.5,
                fontSize: '16px',
                fontWeight: 500,
                lineHeight: '24px',
              }}
              color={'#063A88'}
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 18 18"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M7.85873 1.51246C8.21795 0.406889 9.78205 0.406888 10.1413 1.51246L11.4248 5.46262C11.5854 5.95704 12.0461 6.2918 12.566 6.2918H16.7195C17.8819 6.2918 18.3653 7.77933 17.4248 8.46262L14.0646 10.9039C13.644 11.2095 13.468 11.7512 13.6287 12.2456L14.9122 16.1957C15.2714 17.3013 14.006 18.2207 13.0655 17.5374L9.70534 15.0961C9.28476 14.7905 8.71524 14.7905 8.29466 15.0961L4.93446 17.5374C3.994 18.2207 2.72862 17.3013 3.08784 16.1957L4.37133 12.2456C4.53198 11.7512 4.35599 11.2095 3.9354 10.9039L0.575201 8.46262C-0.365256 7.77934 0.118075 6.2918 1.28054 6.2918H5.43398C5.95385 6.2918 6.4146 5.95704 6.57525 5.46262L7.85873 1.51246Z"
                  fill="#063A88"
                />
              </svg>
              4.9
            </Typography>
          </Box>
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
        </Stack>
      </Stack>
    </Card>
  );
}

interface VariantPickerProps extends RadioGroupProps {
  charValues: ProductCharValue[];
  currentVariant: Variant;
  variants: Variant[];
}

function VariantPicker({
  charValues,
  variants,
  currentVariant,
  value,
  ...other
}: VariantPickerProps) {
  return (
    <RadioGroup row {...other}>
      {charValues
        .filter((value) =>
          variants
            .filter((variant) => variant.chars.some((char) => currentVariant.chars.includes(char)))
            .flatMap((variant) => variant.chars)
            .includes(value.id!)
        )
        .map((charValue) => (
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
