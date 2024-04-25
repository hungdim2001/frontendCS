// @mui
import { Box } from '@mui/material';
// @type
import { CartItem, Product } from '../../../../@types/product';
// components
import { SkeletonProductItem } from '../../../../components/skeleton';
//
import ShopProductCard from './ShopProductCard';
import { useDispatch } from 'src/redux/store';
import { addToCart } from 'src/redux/slices/product';

// ----------------------------------------------------------------------

type Props = {
  products: Product[];
  loading: boolean;
};

export default function ShopProductList({ products, loading }: Props) {
  const dispatch = useDispatch();
 const handleAddCart = (product: CartItem) => {
    dispatch(addToCart(product));
  };
  return (
    <Box
      sx={{
        display: 'grid',
        gap: 3,
        gridTemplateColumns: {
          xs: 'repeat(1, 1fr)',
          sm: 'repeat(2, 1fr)',
          md: 'repeat(3, 1fr)',
          lg: 'repeat(4, 1fr)',
        },
      }}
    >
      {(loading ? [...Array(12)] : products).map((product, index) =>
        product ? (
          <ShopProductCard onAddCart={handleAddCart} key={product.id} product={product} />
        ) : (
          <SkeletonProductItem key={index} />
        )
      )}
    </Box>
  );
}
