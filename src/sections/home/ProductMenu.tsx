import { styled, useTheme } from '@mui/material/styles';
import { useDispatch, useSelector } from 'src/redux/store';
import { useEffect } from 'react';
import { getProductTypes } from 'src/redux/slices/product-type';
import { Container, MenuItem, SvgIcon } from '@mui/material';
import { Svg } from '@react-pdf/renderer';
import LoadingScreen from 'src/components/LoadingScreen';
import SvgIconStyle from 'src/components/SvgIconStyle';
const RootStyle = styled('div')(({ theme }) => ({
  marginTop: '77px',
  color: '#FFFFFF',
  backgroundColor: '#2E2E2E',
  padding: 16,
  fontSize: '16px',
  fontWeight: 500,
}));

export default function ProductMenu() {
  const theme = useTheme();
  const dispatch = useDispatch();
  const { productTypes } = useSelector((state) => state.productTypes);
  useEffect(() => {
    dispatch(getProductTypes());
  }, [dispatch]);
  if (!productTypes) return <LoadingScreen />;
  return (
    <RootStyle>
      <Container sx={{ padding: 0, display: 'flex', justifyContent: 'space-between' }}>
        {productTypes.map((productType) => (
          <MenuItem sx={{ padding: 0 }} key={productType.id}>
            <SvgIconStyle src={productType.icon} sx={{ marginRight: '8px' }} />
            {productType.name}
          </MenuItem>
        ))}
      </Container>
    </RootStyle>
  );
}
