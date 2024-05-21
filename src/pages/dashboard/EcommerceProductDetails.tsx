import { sentenceCase } from 'change-case';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
// @mui
import { alpha, styled } from '@mui/material/styles';
import {
  Box,
  Tab,
  Card,
  Grid,
  Divider,
  Container,
  Typography,
  List,
  ListItem,
} from '@mui/material';
import { TabContext, TabList, TabPanel } from '@mui/lab';
// redux
import { useDispatch, useSelector } from '../../redux/store';
import {
  getProduct,
  addCart,
  onGotoStep,
  addToCart,
  initCart,
  getProducts,
  setProduct,
} from '../../redux/slices/product';
// routes
import { PATH_DASHBOARD, PATH_ROOT } from '../../routes/paths';
// @types
import { CartItem, Product, ProductCharValue, Variant } from '../../@types/product';
// hooks
import useSettings from '../../hooks/useSettings';
// components
import Page from '../../components/Page';
import Iconify from '../../components/Iconify';
import Markdown from '../../components/Markdown';
import { SkeletonProduct } from '../../components/skeleton';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
// sections
import {
  ProductDetailsSummary,
  ProductDetailsReview,
  ProductDetailsCarousel,
} from '../../sections/@dashboard/e-commerce/product-details';
import CartWidget from '../../sections/@dashboard/e-commerce/CartWidget';
import LoadingScreen from 'src/components/LoadingScreen';
import productChar from 'src/redux/slices/product-char';

// ----------------------------------------------------------------------

const PRODUCT_DESCRIPTION = [
  {
    title: '100% Original',
    description: 'Chocolate bar candy canes ice cream toffee cookie halvah.',
    icon: 'ic:round-verified',
  },
  {
    title: '10 Day Replacement',
    description: 'Marshmallow biscuit donut dragée fruitcake wafer.',
    icon: 'eva:clock-fill',
  },
  {
    title: 'Year Warranty',
    description: 'Cotton candy gingerbread cake I love sugar sweet.',
    icon: 'ic:round-verified-user',
  },
];

const IconWrapperStyle = styled('div')(({ theme }) => ({
  margin: 'auto',
  display: 'flex',
  borderRadius: '50%',
  alignItems: 'center',
  width: theme.spacing(8),
  justifyContent: 'center',
  height: theme.spacing(8),
  marginBottom: theme.spacing(3),
  color: theme.palette.primary.main,
  backgroundColor: `${alpha(theme.palette.primary.main, 0.08)}`,
}));

// ----------------------------------------------------------------------
const RootStyle = styled('div')(({ theme }) => ({
  height: '100%',
  marginTop: '77px',
}));
export default function EcommerceProductDetails() {
  const { themeStretch } = useSettings();

  const dispatch = useDispatch();

  const [value, setValue] = useState('1');

  const { id = '' } = useParams();
  const { variantParam = '' } = useParams();
  const [variantId, setVariantId] = useState(variantParam);
  useEffect(() => {
    setVariantId(variantParam);
  }, [variantParam]);
  const { product, error, checkout } = useSelector((state) => state.product);

  const [currentIndex, setCurrentIndex] = useState<number>(
    product?.variants?.length === 1
      ? product?.images.indexOf(product?.variants.at(0)?.image.toString()!)
      : product?.images.indexOf(
          product?.variants.find((item) => item.id?.toString() === variantId)?.image.toString()!
        )!
  );
  useEffect(() => {
    const fetchData = async () => {
      await dispatch(getProducts(false, null));
      await dispatch(getProduct(+id));
      await dispatch(initCart());
    };
    fetchData();
  }, [dispatch, id]);
  const handleAddCart = (product: CartItem) => {
    dispatch(addToCart(product));
  };
  const [variant, setVariant] = useState<Variant>({} as Variant);

  const handleGotoStep = (step: number) => {
    dispatch(onGotoStep(step));
  };
  const { isLoading } = useSelector((state) => state.product);
  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <RootStyle>
      <Page title="Ecommerce: Product Details">
        <Container>
          <HeaderBreadcrumbs
            heading="Product Details"
            links={[
              { name: 'Home', href: '/' },
              {
                name: 'Products',
                href: PATH_ROOT.products.root,
              },
              { name: product?.name! ? product.name : '' },
            ]}
          />

          {/* <CartWidget /> */}

          {product && (
            <>
              <Grid container>
                <Grid item xs={12} md={4} lg={4}>
                  <ProductDetailsCarousel current={currentIndex} product={product} />
                </Grid>
                <Grid item xs={12} md={8} lg={8}>
                  <ProductDetailsSummary
                    product={product}
                    setCurrentIndex={setCurrentIndex}
                    variantId={variantId}
                    setVariant={setVariant}
                    cart={checkout.cart}
                    onAddCart={handleAddCart}
                    onGotoStep={handleGotoStep}
                  />
                </Grid>
              </Grid>
              <Card>
                <TabContext value={value}>
                  <Box sx={{ px: 3 }}>
                    <TabList onChange={(e, value) => setValue(value)}>
                      <Tab
                        disableRipple
                        value="1"
                        label="Technical Details"
                        sx={{
                          '&.Mui-selected': {
                            color: '#0C68F4',
                          },
                          color: 'black',
                          fontSize: '18px',
                          fontWeight: 300,
                        }}
                      />
                      <Tab
                        disableRipple
                        value="2"
                        label={`Review (10)`}
                        sx={{
                          '&.Mui-selected': {
                            color: '#0C68F4',
                          },
                          color: 'black',
                          fontSize: '18px',
                          fontWeight: 300,
                          '&.MuiTab-wrapper': { whiteSpace: 'nowrap' },
                        }}
                      />
                    </TabList>
                  </Box>

                  <Divider />

                  <TabPanel value="1">
                    <Box sx={{ p: 3 }}>
                      <Typography variant="h5" sx={{ mt: 0.5 }}>
                        Technical Details{' '}
                      </Typography>
                      <List
                        sx={{
                          color: '#717171',
                        }}
                      >
                        {product.productSpecChars.map((char: any, index) => {

                          return (
                            <ListItem
                              key={char.id}
                              sx={{
                                p: 2,
                                backgroundColor: index % 2 === 0 ? '#f9f9f9' : 'transparent',
                              }}
                            >
                              <Grid container justifyContent="flex-start" alignItems="center">
                                <Grid item xs={4} sm={4} md={4}>
                                  <Typography sx={{ color: '#717171' }} variant="h6">
                                    {char.name}
                                  </Typography>
                                </Grid>
                                <Grid item xs={8} sm={8} md={8}>
                                  <Typography variant="body1" sx={{ color: '#2D2D2D' }}>
                                    {char.productSpecCharValueDTOS.some(
                                      (value: ProductCharValue) => value.variant
                                    )
                                      ? char.productSpecCharValueDTOS.find(
                                          (value: ProductCharValue) =>
                                            variant?.chars?.includes(value.id!)
                                        ) &&
                                        char.productSpecCharValueDTOS.find(
                                          (value: ProductCharValue) =>
                                            variant?.chars?.includes(value.id!)
                                        ).value
                                      : char
                                          .productSpecCharValueDTOS!.map(
                                            (value: any) => value.value
                                          )
                                          .join(', ')}
                                    {/* char.productSpecCharValueDTOS!.map((value: any) => value.value).join(', ')} */}
                                  </Typography>
                                </Grid>
                              </Grid>
                            </ListItem>
                          );
                        })}
                      </List>
                      <Typography variant="h5" sx={{ mt: 0.5 }}>
                        Product Details
                      </Typography>
                      <div dangerouslySetInnerHTML={{ __html: product.description! }} />
                    </Box>
                  </TabPanel>
                  <TabPanel value="2">
                    <ProductDetailsReview product={product} />
                  </TabPanel>
                </TabContext>
              </Card>
            </>
          )}

          {!product && <SkeletonProduct />}

          {error && <Typography variant="h6">404 Product not found</Typography>}
        </Container>
      </Page>
    </RootStyle>
  );
}
