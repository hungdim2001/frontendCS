// @mui
import { styled } from '@mui/material/styles';
import {
  Box,
  Table,
  Divider,
  TableRow,
  TableBody,
  TableCell,
  TableHead,
  Typography,
  IconButton,
  TableContainer,
  Card,
  Grid,
  Stack,
} from '@mui/material';
// utils
import getColorName from '../../../../utils/getColorName';
import { fCurrency } from '../../../../utils/formatNumber';
// @types
import { CartItem } from '../../../../@types/product';
// components
import Image from '../../../../components/Image';
import Iconify from '../../../../components/Iconify';
import SvgIconStyle from 'src/components/SvgIconStyle';

// ----------------------------------------------------------------------

const IncrementerStyle = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  // marginBottom: theme.spacing(0.5),
  padding: theme.spacing(0.5),
  color: '#717171',
  fontSize: '14px',
  fontWeight: 300,
  // borderRadius: theme.shape.borderRadius,
  borderBottom: `solid 1px ${theme.palette.grey[500]}`,
}));

// ----------------------------------------------------------------------

type Props = {
  products: CartItem[];
  onDelete: (cartItem: CartItem) => void;
  onDecreaseQuantity: (id: number | null) => void;
  onIncreaseQuantity: (id: number | null) => void;
};

export default function CheckoutProductList({
  products,
  onDelete,
  onIncreaseQuantity,
  onDecreaseQuantity,
}: Props) {
  return (
    <>
      {products.map((product, index) => {
        const { variant, name, quantity } = product;
        return (
          <Card key={index} sx={{ padding: 2, boxShadow: '0 4px 4px 0  rgba(0, 0, 0, .25)' }}>
            <Grid container>
              <Grid item lg={3} md={3}>
                {' '}
                <Image
                  alt="product image"
                  src={variant.image.toString()}
                  // sx={{ width: 64, height: 64, borderRadius: 1.5, mr: 2 }}
                />
              </Grid>
              <Grid
                item
                lg={9}
                md={9}
                container
                direction="column"
                justifyContent="space-between"
                alignItems="flex-start"
              >
                <Typography noWrap variant="h6">
                  {name}
                </Typography>
                <Grid>
                  {' '}
                  {Object.entries(variant.charValues).map(([key, value], index) => (
                    <Typography
                      key={index}
                      sx={{
                        fontSize: 14,
                        fontWeight: 500,
                        color: '#717170',
                      }}
                    >
                      <Typography
                        component="span"
                        variant="subtitle1"
                        sx={{
                          color: 'text.primary',
                          fontSize: 14,
                          fontWeight: 400,
                        }}
                      >
                        {key}:&nbsp;
                      </Typography>
                      {value}
                    </Typography>
                  ))}
                </Grid>
                <Grid container direction="row" justifyContent="space-between">
                  <Stack direction="row" alignItems="center" spacing={1}>
                    {variant.price && (
                      <Typography
                        component="span"
                        sx={{ color: 'text.disabled', textDecoration: 'line-through' }}
                      >
                        {fCurrency(variant.price)}₫
                      </Typography>
                    )}
                    <Typography variant="body1">{fCurrency(variant.price)}₫</Typography>
                  </Stack>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <IconButton
                      sx={{ color: '#C91433', mt: '12px', padding: 0 }}
                      onClick={() => onDelete({variantId: variant.id!, quantity: -quantity} as CartItem)}
                    >
                      <SvgIconStyle src={'/icons/ic_trash.svg'} />
                    </IconButton>
                    <Incrementer
                      quantity={quantity}
                      available={variant.quantity}
                      onDecrease={() => onDecreaseQuantity(variant.id)}
                      onIncrease={() => onIncreaseQuantity(variant.id)}
                    />
                  </Stack>
                </Grid>
              </Grid>
            </Grid>
          </Card>
        );
      })}
    </>
  );
}

// ----------------------------------------------------------------------

type IncrementerProps = {
  available: number;
  quantity: number;
  onIncrease: VoidFunction;
  onDecrease: VoidFunction;
};

function Incrementer({ available, quantity, onIncrease, onDecrease }: IncrementerProps) {
  return (
    <Box sx={{ width: 96, textAlign: 'right' }}>
      <IncrementerStyle>
        <IconButton size="small" color="inherit" onClick={onDecrease} disabled={quantity <= 1}>
          <Iconify icon={'eva:minus-fill'} width={16} height={16} />
        </IconButton>
        {quantity}
        <IconButton
          size="small"
          color="inherit"
          onClick={onIncrease}
          disabled={quantity >= available}
        >
          <Iconify icon={'eva:plus-fill'} width={16} height={16} />
        </IconButton>
      </IncrementerStyle>
      {/* <Typography variant="caption" sx={{ color: 'text.secondary' }}>
        available: {available}
      </Typography> */}
    </Box>
  );
}
