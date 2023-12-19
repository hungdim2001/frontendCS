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
} from '@mui/material';
// routes
import { PATH_DASHBOARD } from '../../../../routes/paths';
// utils
import { fShortenNumber, fCurrency } from '../../../../utils/formatNumber';
// @types
import { Product, CartItem } from '../../../../@types/product';
// components
import Label from '../../../../components/Label';
import Iconify from '../../../../components/Iconify';
import SocialsButton from '../../../../components/SocialsButton';
import { ColorSinglePicker } from '../../../../components/color-utils';
import { FormProvider, RHFSelect } from '../../../../components/hook-form';
import { ICONS } from 'src/layouts/dashboard/navbar/NavConfig';

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
};

export default function ProductDetailsSummary({
  cart,
  product,
  onAddCart,
  onGotoStep,
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
    // colors,
    // available,
    // priceSale,
    // totalRating,
    // totalReview,
    // inventoryType,
  } = product;

  const alreadyProduct = cart.map((item) => item.id).includes(id);

  const isMaxQuantity =
    cart.filter((item) => item.id === id).map((item) => item.quantity)[0] >= quantity;

  const defaultValues = {
    id,
    name,
    // cover,
    // available,
    price,
    // color: colors[0],
    // size: sizes[4],
    quantity: quantity < 1 ? 0 : 1,
  };

  const methods = useForm<FormValuesProps>({
    defaultValues,
  });

  const { watch, control, setValue, handleSubmit } = methods;

  const values = watch();

  const onSubmit = async (data: FormValuesProps) => {
    try {
      if (!alreadyProduct) {
        onAddCart({
          ...data,
          subtotal: data.price * data.quantity,
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
        subtotal: values.price * values.quantity,
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <RootStyle {...other}>
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
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
        <Typography variant="h5" paragraph sx={{ mt: 1 }}>
          {name}
        </Typography>
        <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
          <Label
            sx={{
              backgroundColor: 'info.main500',
              color: 'common.white',
              fontWeight: 500,
              lineHeight: 22 / 14,
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

        <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
          <Rating value={5} precision={0.1} readOnly />
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            ({fShortenNumber(5)} reviews)
          </Typography>
        </Stack>

        <Typography variant="h4" sx={{ mb: 3 }}>
          <Box component="span" sx={{ color: 'text.disabled', textDecoration: 'line-through' }}>
            {price && fCurrency(price)}₫
          </Box>
          &nbsp;{fCurrency(price)}₫
        </Typography>
        <Card>
          <Stack direction="column" spacing={1} sx={{ mb: 1 }} alignItems="start">
            <Typography variant="h5" paragraph>
              Product details:
            </Typography>
            {productSpecChars.map((char, index) => (
              <ListItem
                key={char.id}
                sx={{
                  backgroundColor: index % 2 !== 0 ? '#f5f5f5' : 'inherit',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <Typography variant="subtitle2">{char.name}:</Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary', marginLeft: 1 }} noWrap>
                  {char.productSpecCharValueDTOS?.map((value) => value.value).join(',')}
                </Typography>
              </ListItem>
            ))}
          </Stack>
        </Card>
        <Divider sx={{ borderStyle: 'dashed' }} />

        {/* <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ my: 3 }}>
          <Typography variant="subtitle1" sx={{ mt: 0.5 }}>
            Color
          </Typography>

          <Controller
            name="color"
            control={control}
            render={({ field }) => (
              <ColorSinglePicker
                colors={colors}
                value={field.value}
                onChange={field.onChange}
                sx={{
                  ...(colors.length > 4 && {
                    maxWidth: 144,
                    justifyContent: 'flex-end',
                  }),
                }}
              />
            )}
          />
        </Stack> */}

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
        <Divider sx={{ borderStyle: 'solid' }} />

        <Stack direction="row" justifyContent="space-between" sx={{ mt: 3, mb: 3 }}>
          <Typography variant="subtitle1" sx={{ mt: 0.5 }}>
            Quantity
          </Typography>

          <div>
            <Incrementer
              name="quantity"
              quantity={values.quantity}
              available={quantity}
              onIncrementQuantity={() => setValue('quantity', values.quantity + 1)}
              onDecrementQuantity={() => setValue('quantity', values.quantity - 1)}
            />
            <Typography
              variant="caption"
              component="div"
              sx={{ mt: 1, textAlign: 'right', color: 'text.secondary' }}
            >
              Available: {quantity}
            </Typography>
          </div>
        </Stack>

        <Stack direction="row" spacing={2} sx={{ mt: 5 }}>
          <Button
            fullWidth
            disabled={isMaxQuantity}
            size="large"
            color="warning"
            variant="contained"
            startIcon={<Iconify icon={'ic:round-add-shopping-cart'} />}
            onClick={handleAddCart}
            sx={{ whiteSpace: 'nowrap' }}
          >
            Add to Cart
          </Button>

          <Button fullWidth size="large" type="submit" variant="contained">
            Buy Now
          </Button>
        </Stack>

        <Stack alignItems="center" sx={{ mt: 3 }}>
          {/* <SocialsButton initialColor /> */}
        </Stack>
      </FormProvider>
    </RootStyle>
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
