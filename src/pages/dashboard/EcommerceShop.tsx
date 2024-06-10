import { useEffect, useState } from 'react';
import orderBy from 'lodash/orderBy';
// form
import { useForm } from 'react-hook-form';
// @mui
import {
  Container,
  Typography,
  Stack,
  styled,
  MenuItem,
  Box,
  BottomNavigationAction,
} from '@mui/material';
// redux
import { useDispatch, useSelector } from '../../redux/store';
import { getProducts, filterProducts } from '../../redux/slices/product';
// routes
import { PATH_DASHBOARD, PATH_ROOT } from '../../routes/paths';
// @types
import { Product, ProductFilter, ProductType } from '../../@types/product';
// hooks
import useSettings from '../../hooks/useSettings';
// components
import Page from '../../components/Page';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import { FormProvider } from '../../components/hook-form';
// sections
import {
  ShopTagFiltered,
  ShopProductSort,
  ShopProductList,
  ShopFilterSidebar,
  ShopProductSearch,
} from '../../sections/@dashboard/e-commerce/shop';
import CartWidget from '../../sections/@dashboard/e-commerce/CartWidget';
import { filter, forEach } from 'lodash';
import { getProductTypes } from 'src/redux/slices/product-type';
import LoadingScreen from 'src/components/LoadingScreen';
import SvgIconStyle from 'src/components/SvgIconStyle';

// ----------------------------------------------------------------------
const RootStyle = styled('div')(({ theme }) => ({
  height: '100%',
  marginTop: '77px',
}));

export default function EcommerceShop() {
  const { themeStretch } = useSettings();

  const dispatch = useDispatch();

  const [openFilter, setOpenFilter] = useState(false);

  const { products, sortBy, filters } = useSelector((state) => state.product);

  const filteredProducts = applyFilter(products, sortBy, filters);

  const defaultValues = {
    brand: filters.brand,
    rating: filters.rating,
  };
  const methods = useForm({
    defaultValues,
  });

  const { reset, watch, setValue } = methods;

  const values = watch();

  const isDefault = !values.rating && values.brand.length === 0;
  useEffect(() => {
    dispatch(getProducts(false, null, null));
  }, [dispatch]);

  useEffect(() => {
    dispatch(filterProducts(values));
  }, [dispatch, values]);

  const handleOpenFilter = () => {
    setOpenFilter(true);
  };

  const handleCloseFilter = () => {
    setOpenFilter(false);
  };

  const handleResetFilter = () => {
    reset();
    handleCloseFilter();
  };

  const handleRemoveBrand = (value: string) => {
    const newValue = filters.brand.filter((item) => item !== value);
    setValue('brand', newValue);
  };

  const handleRemoveCategory = () => {
    // setValue('category', 'All');
  };

  const handleRemoveColor = (value: string) => {
    // const newValue = filters.colors.filter((item) => item !== value);
    // setValue('colors', newValue);
  };

  const handleRemovePrice = () => {
    // setValue('priceRange', '');
  };

  const handleRemoveRating = () => {
    setValue('rating', '');
  };
  const { productTypes } = useSelector((state) => state.productTypes);
  const [proudctTypeSelected, setProductTypeSelected] = useState<ProductType | null>(null);
  useEffect(() => {
    dispatch(getProductTypes());
  }, [dispatch]);
  if (!productTypes) return <LoadingScreen />;
  return (
    <RootStyle>
      <Page title="Ecommerce: Shop">
        <Container maxWidth={themeStretch ? false : 'lg'}>
          <HeaderBreadcrumbs
            heading=""
            links={[
              { name: 'Home', href: '/' },
              {
                name: 'Products',
                href: PATH_ROOT.products.root,
              },
            ]}
          />
          <Stack direction="row" justifyContent="space-between">
            {productTypes.map((productType) => (
              <MenuItem
                sx={{
                  padding: 0,
                  borderBottom:
                    proudctTypeSelected?.id === productType.id ? '3px solid #0C68F4' : 'none',
                }}
                key={productType.id}
                onClick={() => {
                  setProductTypeSelected(productType);

                  dispatch(getProducts(false, productType.id, null));
                }}
              >
                <BottomNavigationAction
                  sx={{
                    '& .Mui-selected, .Mui-selected > svg': { color: '#444444' },
                    color: '#444444',
                    '& .MuiBottomNavigationAction-label': {
                      mt: 1,
                      opacity: 1,
                      fontSize: '20px',
                    },
                  }}
                  label={productType.name}
                  icon={
                    <SvgIconStyle src={productType.icon} sx={{ width: '48px', height: '48px' }} />
                  }
                />
              </MenuItem>
            ))}
          </Stack>
          <Stack
            spacing={2}
            direction={{ xs: 'column', sm: 'row' }}
            alignItems={{ sm: 'center' }}
            justifyContent="space-between"
            sx={{ mb: 2 }}
          >
            <Stack direction="row" spacing={1} flexShrink={0} sx={{ my: 1 }}>
              <FormProvider methods={methods}>
                <ShopFilterSidebar
                  onResetAll={handleResetFilter}
                  isOpen={openFilter}
                  onOpen={handleOpenFilter}
                  onClose={handleCloseFilter}
                />
              </FormProvider>

              <ShopProductSort />
            </Stack>
          </Stack>

          <Stack sx={{ mb: 3 }}>
            {!isDefault && (
              <>
                <Typography variant="body2" gutterBottom>
                  <strong>{filteredProducts.length}</strong>
                  &nbsp;Products found
                </Typography>

                <ShopTagFiltered
                  filters={filters}
                  isShowReset={!isDefault && !openFilter}
                  onRemoveBrand={handleRemoveBrand}
                  onRemoveCategory={handleRemoveCategory}
                  onRemoveColor={handleRemoveColor}
                  onRemovePrice={handleRemovePrice}
                  onRemoveRating={handleRemoveRating}
                  onResetAll={handleResetFilter}
                />
              </>
            )}
          </Stack>

          <ShopProductList
            products={
              filteredProducts[0]?.id != null ? filteredProducts.filter((item) => item.status) : []
            }
            loading={!products.length && isDefault}
          />
          {/* <CartWidget /> */}
        </Container>
      </Page>
    </RootStyle>
  );
}

// ----------------------------------------------------------------------

function applyFilter(products: Product[], sortBy: string | null, filters: ProductFilter) {
  // SORT BY
  if (sortBy === 'featured') {
    products = orderBy(products, ['sold'], ['desc']);
  }
  if (sortBy === 'newest') {
    products = orderBy(products, ['createdAt'], ['desc']);
  }
  if (sortBy === 'priceDesc') {
    products = orderBy(products, ['price'], ['desc']);
  }
  if (sortBy === 'priceAsc') {
    products = orderBy(products, ['price'], ['asc']);
  }
  // FILTER PRODUCTS
  if (filters.brand.length > 0) {
    products = products.filter((product) => {
      return product.productSpecChars.some((specChar) => {
        return (
          specChar.name === 'Hãng' &&
          specChar.productSpecCharValueDTOS &&
          specChar.productSpecCharValueDTOS.some((valueDTO) => {
            return filters.brand.includes(valueDTO.value);
          })
        );
      });
    });
  }
  // if (filters.category !== 'All') {
  //   products = products.filter((product) => product.category === filters.category);
  // }
  // if (filters.colors.length > 0) {
  //   products = products.filter((product) =>
  //     product.colors.some((color) => filters.colors.includes(color))
  //   );
  // }
  // if (filters.priceRange) {
  //   products = products.filter((product) => {
  //     if (filters.priceRange === 'below') {
  //       return product.price < 25;
  //     }
  //     if (filters.priceRange === 'between') {
  //       return product.price >= 25 && product.price <= 75;
  //     }
  //     return product.price > 75;
  //   });
  // }
  if (filters.rating) {
    products = products.filter((product) => {
      const convertRating = (value: string) => {
        if (value === 'up4Star') return 4;
        if (value === 'up3Star') return 3;
        if (value === 'up2Star') return 2;
        return 1;
      };
      // return product.totalRating > convertRating(filters.rating);
    });
  }
  return products;
}
