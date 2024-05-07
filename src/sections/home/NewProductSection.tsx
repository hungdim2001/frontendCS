import { Box, Button, Container, Typography } from '@mui/material';
import { useEffect } from 'react';
import Iconify from 'src/components/Iconify';
import { getProducts } from 'src/redux/slices/product';
import { useDispatch, useSelector } from 'src/redux/store';

export default function NewProductSection() {
  const { products, sortBy, filters } = useSelector((state) => state.product);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getProducts());
  }, [dispatch]);
  return (
    <Container
      sx={{
        padding: '0px 16px',
      }}
    >
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
    </Container>
  );
}
