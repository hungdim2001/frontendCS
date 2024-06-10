import { Box, Button, Container, Typography } from '@mui/material';
import { useEffect } from 'react';
import Iconify from 'src/components/Iconify';
import product, { getProducts } from 'src/redux/slices/product';
import { useDispatch, useSelector } from 'src/redux/store';
import ProductCard from './ProductCard';
import { useNavigate } from 'react-router';

export default function NewProductSection() {
  const { products, sortBy, filters } = useSelector((state) => state.product);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getProducts(true, null, null));
  }, [dispatch]);
  if (products.length !== 4) return <></>;
  return (
    <Container sx={{ marginY: 2 }}>
      <Box
        sx={{
          padding: '0px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid #B4B4B4',
        }}
      >
        <Typography variant="h3">New Products</Typography>
        <Box
          onClick={(e) => {
            navigate('/products');
          }}
          sx={{
            display: 'flex',
            cursor: 'pointer',
            fontSize: '16px',
            alignItems: 'center',
            fontWeight: 400,
          }}
        >
          View All
          <Iconify icon={'eva:chevron-right-fill'} width={24} height={24} />
        </Box>
      </Box>
      <Box
        sx={{
          display: 'grid',
          gap: 3,
          marginTop: '20px',
          gridTemplateColumns: {
            xs: 'repeat(1, 1fr)',
            sm: 'repeat(2, 1fr)',
            md: 'repeat(3, 1fr)',
            lg: 'repeat(4, 1fr)',
          },
        }}
      >
        {products.map((product, index) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </Box>
    </Container>
  );
}
