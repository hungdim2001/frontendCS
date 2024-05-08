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
import ProductMenu from 'src/sections/home/ProductMenu';
import Banner from 'src/sections/home/Banner';
import NewProductSection from 'src/sections/home/NewProductSection';
import TopBrand from 'src/sections/home/TopBrand';

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
export default function HomePage() {
  return (
    <Page title="">
      <RootStyle>
        <ContentStyle>
          <ProductMenu />
          <Banner />
          <NewProductSection />
          <TopBrand />
          <Container>
            <img src="/img/Banner 2.png" alt="" />
          </Container>
        </ContentStyle>
      </RootStyle>
    </Page>
  );
}
