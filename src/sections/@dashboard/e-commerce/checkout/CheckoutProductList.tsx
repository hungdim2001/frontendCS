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
} from '@mui/material';
// utils
import getColorName from '../../../../utils/getColorName';
import { fCurrency } from '../../../../utils/formatNumber';
// @types
import { CartItem } from '../../../../@types/product';
// components
import Image from '../../../../components/Image';
import Iconify from '../../../../components/Iconify';

// ----------------------------------------------------------------------

const IncrementerStyle = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginBottom: theme.spacing(0.5),
  padding: theme.spacing(0.5, 0.75),
  borderRadius: theme.shape.borderRadius,
  border: `solid 1px ${theme.palette.grey[500_32]}`,
}));

// ----------------------------------------------------------------------

type Props = {
  products: CartItem[];
  onDelete: (id: number | null) => void;
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
          <>
            <Card key={index} sx={{ padding: 2 }}>
              <Grid container >
                <Grid item lg={3} md={4}>  <Image
                  alt="product image"
                  src={variant.image.toString()}
                // sx={{ width: 64, height: 64, borderRadius: 1.5, mr: 2 }}
                /></Grid>
                <Grid item lg={9} md={8} container
                  direction="column"
                  justifyContent="space-between"
                  alignItems="flex-start"
                >
                  <Typography noWrap variant="h6" >
                    {name}
                  </Typography>
                  <Grid>  {Object.entries(variant.charValues).map(([key, value], index) => (
                    <Typography key={index} sx={{
                      fontSize: 14,
                      fontWeight: 400,
                      color: '#717170'
                    }}>
                      <Typography
                        component="span"
                        variant="subtitle1"
                        sx={{
                          color: 'text.primary', fontSize: 14,
                          fontWeight: 400,
                          mt:'0.5'
                        }}
                      >
                        {key}:&nbsp;
                      </Typography>
                      {value}
                    </Typography>
                  ))}</Grid>

                  <Typography
                    variant='body1'
                  >{fCurrency(variant.price)}
                  </Typography>
                </Grid>

                <Grid item lg={3}></Grid>
              </Grid>



            </Card>

            {/* <TableRow key={variant.id}>
              <TableCell>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>

                  <Box>
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                      }}
                    >
                   </Box>
                  </Box>
                </Box>
              </TableCell>

              <TableCell align="left">{fCurrency(variant.price)}</TableCell>

              <TableCell align="left">
                <Incrementer
                  quantity={quantity}
                  available={variant.quantity}
                  onDecrease={() => onDecreaseQuantity(variant.id)}
                  onIncrease={() => onIncreaseQuantity(variant.id)}
                />
              </TableCell>

              <TableCell align="right">{fCurrency(variant.price * quantity)}</TableCell>

              <TableCell align="right">
                <IconButton onClick={() => onDelete(variant.id)}>
                  <Iconify icon={'eva:trash-2-outline'} width={20} height={20} />
                </IconButton>
              </TableCell>
            </TableRow> */}

          </>


        );
      })}

    </>
    // <TableContainer sx={{ minWidth: 720 }}>
    //   <Table>
    //     {/* <TableHead>
    //       <TableRow>
    //         <TableCell>Product</TableCell>
    //         <TableCell align="left">Price</TableCell>
    //         <TableCell align="left">Quantity</TableCell>
    //         <TableCell align="right">Total Price</TableCell>
    //         <TableCell align="right" />
    //       </TableRow>
    //     </TableHead> */}

    //     <TableBody>
    //    </TableBody>
    //   </Table>
    // </TableContainer>
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
      <Typography variant="caption" sx={{ color: 'text.secondary' }}>
        available: {available}
      </Typography>
    </Box>
  );
}
