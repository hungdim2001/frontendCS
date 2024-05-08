import { Box, Button, Container, Typography } from '@mui/material';
import { useEffect } from 'react';
import Iconify from 'src/components/Iconify';
import product, { getProducts } from 'src/redux/slices/product';
import { useDispatch, useSelector } from 'src/redux/store';
import ProductCard from './ProductCard';

export default function TopBrand() {
  const { products, sortBy, filters } = useSelector((state) => state.product);
  const brands = [
    '/img/logo_apple.png',
    '/img/logo_canon.png',
    '/img/logo_huawei.png',
    '/img/logo_lenovo.png',
    '/img/logo_sony.png',
    '/img/logo_samsung.png',
  ];
  if (products.length == 0) return <></>;
  return (
    <Container sx={{marginY:2}}>
      <Box
        sx={{
          padding: ' 0px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid #B4B4B4',
        }}
      >
        <Typography variant="h3">Top Brand</Typography>
      </Box>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        {brands.map((brand) => (
          <img key={brand} src={brand}></img>
        ))}
      </Box>
    </Container>
  );
}
