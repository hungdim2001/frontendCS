// @mui
import { styled, useTheme } from '@mui/material/styles';
// components
import Page from '../components/Page';
// sections
import {
  HomeHero,
  HomeMinimal,
  HomeDarkMode,
  HomeLookingFor,
  HomeColorPresets,
  HomePricingPlans,
  HomeAdvertisement,
  HomeCleanInterfaces,
  HomeHugePackElements,
} from '../sections/home';
import { Box, Container } from '@mui/material';
import { useDispatch, useSelector } from 'src/redux/store';
import { useEffect } from 'react';
import { getProductTypes } from 'src/redux/slices/product-type';

// ----------------------------------------------------------------------

const RootStyle = styled('div')(({ theme }) => ({
  height: '100%',
}));

const ContentStyle = styled('div')(({ theme }) => ({
  overflow: 'hidden',
  position: 'relative',
  backgroundColor: theme.palette.background.default,
}));

// ----------------------------------------------------------------------
const MenuStyle = styled('div')(({ theme }) => ({
  marginTop: '77px',
  color: theme.palette.common.white,
  backgroundColor: theme.palette.primary.main,
  padding: 8,
}));

export default function HomePage() {
  const theme = useTheme();
  const dispatch = useDispatch();
  const { productTypes } = useSelector((state) => state.productTypes);
  useEffect(() => {
    dispatch(getProductTypes());
  }, [dispatch]);

  return (
    <Page title="The starting point for your next project">
      <RootStyle>
        <ContentStyle>
          <MenuStyle
          
          >
            <Container>This is a full-width box.</Container>
          </MenuStyle>
          <HomeMinimal />
          <HomeHugePackElements />

          <HomeDarkMode />

          <HomeColorPresets />

          <HomeCleanInterfaces />

          <HomePricingPlans />

          <HomeLookingFor />

          <HomeAdvertisement />
        </ContentStyle>
      </RootStyle>
    </Page>
  );
}
