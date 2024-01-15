import { sentenceCase } from 'change-case';
import { useNavigate } from 'react-router-dom';
// form
import { Controller, useForm } from 'react-hook-form';
// @mui
import { useTheme, styled } from '@mui/material/styles';
import {
  Box,
  Link,
  Stack,
  Button,
  Rating,
  Divider,
  IconButton,
  Typography,
  List,
  ListItem,
  Card,
  ListItemIcon,
  ListItemText,
  Grid,
} from '@mui/material';
// routes
import { PATH_DASHBOARD } from '../../../../routes/paths';
// utils
import { fShortenNumber, fCurrency } from '../../../../utils/formatNumber';
// @types
import { Product, CartItem, Variant } from '../../../../@types/product';
// components
import Label from '../../../../components/Label';
import Iconify from '../../../../components/Iconify';
import SocialsButton from '../../../../components/SocialsButton';
import { ColorSinglePicker } from '../../../../components/color-utils';
import { FormProvider, RHFSelect } from '../../../../components/hook-form';
import { ICONS } from 'src/layouts/dashboard/navbar/NavConfig';
import VariantPicker from 'src/components/variant/VariantPicker';
import { useEffect } from 'react';

// ----------------------------------------------------------------------

const RootStyle = styled('div')(({ theme }) => ({
  padding: theme.spacing(3),
  [theme.breakpoints.up(1368)]: {
    padding: theme.spacing(5, 8),
  },
}));

// ----------------------------------------------------------------------

type FormValuesProps = CartItem;

type Props = {
  product: Product;
  cart: CartItem[];
  onAddCart: (cartItem: CartItem) => void;
  onGotoStep: (step: number) => void;
  setCurrentIndex: (currentInde: React.SetStateAction<number>) => void;
  setVariant: (currentInde: React.SetStateAction<Variant>) => void;
};

export default function ProductDetailsSummary({
  cart,
  product,
  onAddCart,
  onGotoStep,
  setCurrentIndex,
  setVariant,
  ...other
}: Props) {
  const theme = useTheme();

  const navigate = useNavigate();

  const {
    id,
    name,
    // sizes,
    price,
    thumbnail,
    status,
    quantity,
    productSpecChars,
    variants,
    // colors,
    // available,
    // priceSale,
    // totalRating,
    // totalReview,
    // inventoryType,
  } = product;

  const alreadyProduct = cart.map((item) => item.variant.id).includes(id);

  const isMaxQuantity =
    cart.filter((item) => item.variant.id=== id).map((item) => item.quantity)[0] >= quantity;

  const defaultValues = {
    name,
    variant:
      variants.length === 1 ? variants.at(0) : variants.find((item) => !item.chars.includes(-1)),
    quantity:
      variants.length === 1
        ? (variants.at(0)?.quantity ?? 0) < 1
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

  const values = watch();
  useEffect(() => {
    const image = variants
      .find((variant) => variant.chars.every((char) => getValues('variant').chars.includes(char)))
      ?.image.toString()!;
    const currentIndex = product.images.indexOf(image);
    setCurrentIndex(currentIndex);
    setVariant(getValues('variant'));
  }, [getValues('variant')]);
  const onSubmit = async (data: FormValuesProps) => {
    try {
      if (!alreadyProduct) {
        let charValue
        onAddCart({
          ...data,
          subtotal: data.variant.quantity * data.quantity,
        });
      }
      onGotoStep(0);
      navigate(PATH_DASHBOARD.eCommerce.checkout);
    } catch (error) {
      console.error(error);
    }
  };

  const handleAddCart = async () => {
    try {
      onAddCart({
        ...values,
        subtotal: values.variant.quantity * values.quantity,
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container>
        <Grid item xs={12} md={6} lg={7} sx={{ p: 3 }}>
          <Typography variant="h5" paragraph>
            {name}
          </Typography>
          <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
            <Label
              sx={{
                backgroundColor: 'info.main500',
                color: 'common.white',
                fontWeight: 300,
                lineHeight: 22 / 12,
                fontSize: 12,
              }}
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 18 18"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M7.52447 0.963526C7.67415 0.502871 8.32585 0.50287 8.47553 0.963525L9.90837 5.37336C9.97531 5.57937 10.1673 5.71885 10.3839 5.71885H15.0207C15.505 5.71885 15.7064 6.33865 15.3146 6.62336L11.5633 9.34878C11.3881 9.4761 11.3148 9.70179 11.3817 9.9078L12.8145 14.3176C12.9642 14.7783 12.437 15.1613 12.0451 14.8766L8.29389 12.1512C8.11865 12.0239 7.88135 12.0239 7.70611 12.1512L3.95488 14.8766C3.56303 15.1613 3.03578 14.7783 3.18546 14.3176L4.6183 9.9078C4.68524 9.70179 4.61191 9.4761 4.43667 9.34878L0.685441 6.62336C0.293584 6.33866 0.494972 5.71885 0.979333 5.71885H5.6161C5.83272 5.71885 6.02469 5.57937 6.09163 5.37336L7.52447 0.963526Z"
                  fill="white"
                />
              </svg>
              4.9
            </Label>
            <Divider orientation="vertical" flexItem />
            <Typography
              sx={{
                color: '#717171',
                fontWeight: 500,
                lineHeight: 22 / 14,
                fontSize: 14,
                textShadow: '0px 4px 4px rgb(0, 0, 0, 0.25)',
              }}
            >
              sold: 24
            </Typography>
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
                          gap: 2,
                        }}
                      />
                    )}
                  />
                </Stack>
              );
            })}

          <List
            sx={{
              color: '#717171',
              '& li::before': { content: '"\\2022"', color: '#717171', marginRight: '8px' },
            }}
          >
            {/* {productSpecChars.filter(item=> item.productSpecCharValueDTOS?.some(value=> value.priority!=-1)).map((char) => (
              <ListItem key={char.id}>
                <Grid container justifyContent="flex-start" alignItems="center">
                  <Grid item xs={5} sm={5} md={5}>
                    <Typography sx={{ color: '#717171' }} variant="body2">
                      {char.name}
                    </Typography>
                  </Grid>
                  <Grid item xs={7} sm={7} md={7}>
                    <Typography variant="body2" sx={{ color: '#0C0C0C' }}>
                      {char.productSpecCharValueDTOS?.filter(value=> value.priority!=-1).map((value) => value.value).join(', ')}
                    </Typography>
                  </Grid>
                </Grid>
              </ListItem>
            ))} */}
          </List>
        </Grid>
        <Grid item xs={12} md={6} lg={5}>
          <Card sx={{ p: 3 }}>
            {/* <Stack direction="column" alignItems="center" spacing={1} sx={{ mb: 1 }}>
              <Rating value={5} precision={0.1} readOnly />
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                ({fShortenNumber(5)} reviews)
              </Typography>
            </Stack> */}
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              sx={{ mb: 2 }}
            >
              <Typography variant="h6"> {fCurrency(getValues('variant').price!)}₫</Typography>
              <Stack direction="row" flex={1} justifyContent="flex-start" sx={{ mr: 1 }}></Stack>
              <Stack direction="row" justifyContent="flex-end">
                <Typography
                  variant="h6"
                  sx={{
                    color: '#F45E0C',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M12 22.75C11.37 22.75 10.78 22.51 10.34 22.06L8.82001 20.54C8.70001 20.42 8.38 20.29 8.22 20.29H6.06C4.76 20.29 3.70999 19.2399 3.70999 17.9399V15.78C3.70999 15.62 3.57999 15.3 3.45999 15.18L1.94 13.66C1.5 13.22 1.25 12.63 1.25 12C1.25 11.37 1.49 10.7799 1.94 10.3399L3.45999 8.81991C3.57999 8.69991 3.70999 8.37994 3.70999 8.21994V6.06002C3.70999 4.76002 4.76 3.70993 6.06 3.70993H8.22C8.38 3.70993 8.70001 3.57993 8.82001 3.45993L10.34 1.93991C11.22 1.05991 12.78 1.05991 13.66 1.93991L15.18 3.45993C15.3 3.57993 15.62 3.70993 15.78 3.70993H17.94C19.24 3.70993 20.29 4.76002 20.29 6.06002V8.21994C20.29 8.37994 20.42 8.69991 20.54 8.81991L22.06 10.3399C22.5 10.7799 22.75 11.37 22.75 12C22.75 12.63 22.51 13.22 22.06 13.66L20.54 15.18C20.42 15.3 20.29 15.62 20.29 15.78V17.9399C20.29 19.2399 19.24 20.29 17.94 20.29H15.78C15.62 20.29 15.3 20.42 15.18 20.54L13.66 22.06C13.22 22.51 12.63 22.75 12 22.75ZM4.51999 14.12C4.91999 14.52 5.20999 15.22 5.20999 15.78V17.9399C5.20999 18.4099 5.59 18.79 6.06 18.79H8.22C8.78 18.79 9.48001 19.0799 9.88 19.4799L11.4 21C11.72 21.32 12.28 21.32 12.6 21L14.12 19.4799C14.52 19.0799 15.22 18.79 15.78 18.79H17.94C18.41 18.79 18.79 18.4099 18.79 17.9399V15.78C18.79 15.22 19.08 14.52 19.48 14.12L21 12.5999C21.16 12.4399 21.25 12.23 21.25 12C21.25 11.77 21.16 11.56 21 11.4L19.48 9.87997C19.08 9.47997 18.79 8.77994 18.79 8.21994V6.06002C18.79 5.59002 18.41 5.20993 17.94 5.20993H15.78C15.22 5.20993 14.52 4.91999 14.12 4.51999L12.6 2.99997C12.28 2.67997 11.72 2.67997 11.4 2.99997L9.88 4.51999C9.48001 4.91999 8.78 5.20993 8.22 5.20993H6.06C5.59 5.20993 5.20999 5.59002 5.20999 6.06002V8.21994C5.20999 8.77994 4.91999 9.47997 4.51999 9.87997L3 11.4C2.84 11.56 2.75 11.77 2.75 12C2.75 12.23 2.84 12.4399 3 12.5999L4.51999 14.12Z"
                      fill="#F45E0C"
                    />
                    <path
                      d="M15.0002 16C14.4402 16 13.9902 15.55 13.9902 15C13.9902 14.45 14.4402 14 14.9902 14C15.5402 14 15.9902 14.45 15.9902 15C15.9902 15.55 15.5502 16 15.0002 16Z"
                      fill="#F45E0C"
                    />
                    <path
                      d="M9.01001 10C8.45001 10 8 9.55 8 9C8 8.45 8.45 8 9 8C9.55 8 10 8.45 10 9C10 9.55 9.56001 10 9.01001 10Z"
                      fill="#F45E0C"
                    />
                    <path
                      d="M8.99994 15.75C8.80994 15.75 8.61994 15.68 8.46994 15.53C8.17994 15.24 8.17994 14.7599 8.46994 14.4699L14.4699 8.46994C14.7599 8.17994 15.2399 8.17994 15.5299 8.46994C15.8199 8.75994 15.8199 9.24 15.5299 9.53L9.52994 15.53C9.37994 15.68 9.18994 15.75 8.99994 15.75Z"
                      fill="#F45E0C"
                    />
                  </svg>
                  &#160;-{fCurrency(price)}₫
                </Typography>
              </Stack>
            </Stack>
            <Typography
              sx={{
                mb: 2,
                color: '#717171',
                fontWeight: 500,
                lineHeight: 22 / 14,
                fontSize: 14,
              }}
            >
              Last price {price && fCurrency(price)}₫
            </Typography>

            <Stack direction="row" justifyContent="space-between" sx={{ mb: 2 }}>
              <Typography variant="subtitle1" sx={{ mt: 0.5 }}>
                Quantity
              </Typography>

              <div>
                <Incrementer
                  name="quantity"
                  quantity={values.quantity}
                  available={getValues('variant').quantity}
                  onIncrementQuantity={() => setValue('quantity', values.quantity + 1)}
                  onDecrementQuantity={() => setValue('quantity', values.quantity - 1)}
                />
                <Typography
                  variant="caption"
                  component="div"
                  sx={{ mt: 1, textAlign: 'right', color: 'text.secondary' }}
                >
                  Available:{getValues('variant').quantity}
                </Typography>
              </div>
            </Stack>

            <Stack direction="column">
              <Button
                fullWidth
                disabled={isMaxQuantity}
                size="large"
                onClick={handleAddCart}
                sx={{ fontSize: '16px', fontWeight: 300, whiteSpace: 'nowrap', mb: 2 }}
                variant="outlined"
              >
                Add to Cart
              </Button>

              <Button
                sx={{
                  fontSize: '16px',
                  fontWeight: 300,
                }}
                fullWidth
                size="large"
                type="submit"
                variant="contained"
              >
                Buy Now
              </Button>
            </Stack>
          </Card>
        </Grid>
      </Grid>
      {/* {price && (
          <Label
            variant={theme.palette.mode === 'light' ? 'ghost' : 'filled'}
            color={'error'}
            sx={{ textTransform: 'uppercase' }}
          >
            {sentenceCase('sale')}
          </Label>
        )} */}

      {/* <Typography
          variant="overline"
          sx={{
            mt: 2,
            mb: 1,
            display: 'block',
            color: price ? 'error.main' : 'info.main',
          }}
        >
          sale
        </Typography> */}

      {/* <Stack direction="row" justifyContent="space-between" sx={{ mb: 3 }}>
          <Typography variant="subtitle1" sx={{ mt: 0.5 }}>
            Size
          </Typography>

          <RHFSelect
            name="size"
            size="small"
            fullWidth={false}
            FormHelperTextProps={{
              sx: { textAlign: 'right', margin: 0, mt: 1 },
            }}
            helperText={
              <Link underline="always" color="text.secondary">
                Size Chart
              </Link>
            }
          >
            {sizes.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </RHFSelect>
        </Stack> */}
    </FormProvider>
  );
}

// ----------------------------------------------------------------------

type IncrementerProps = {
  name: string;
  quantity: number;
  available: number;
  onIncrementQuantity: VoidFunction;
  onDecrementQuantity: VoidFunction;
};

function Incrementer({
  available,
  quantity,
  onIncrementQuantity,
  onDecrementQuantity,
}: IncrementerProps) {
  return (
    <Box
      sx={{
        py: 0.5,
        px: 0.75,
        border: 1,
        lineHeight: 0,
        borderRadius: 1,
        display: 'flex',
        alignItems: 'center',
        borderColor: 'grey.50032',
      }}
    >
      <IconButton
        size="small"
        color="inherit"
        disabled={quantity <= 1}
        onClick={onDecrementQuantity}
      >
        <Iconify icon={'eva:minus-fill'} width={14} height={14} />
      </IconButton>

      <Typography variant="body2" component="span" sx={{ width: 40, textAlign: 'center' }}>
        {quantity}
      </Typography>

      <IconButton
        size="small"
        color="inherit"
        disabled={quantity >= available}
        onClick={onIncrementQuantity}
      >
        <Iconify icon={'eva:plus-fill'} width={14} height={14} />
      </IconButton>
    </Box>
  );
}
