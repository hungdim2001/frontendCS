import { useEffect } from 'react';
import { paramCase } from 'change-case';
import { useParams, useLocation } from 'react-router-dom';
// @mui
import { Container } from '@mui/material';
// redux
import { useDispatch, useSelector } from '../../redux/store';
import { getProducts } from '../../redux/slices/product';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// hooks
import useSettings from '../../hooks/useSettings';
// components
import Page from '../../components/Page';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
// sections
import ProductNewForm from '../../sections/@dashboard/e-commerce/ProductNewForm';
import ProductCharNewForm from 'src/sections/@dashboard/e-commerce/ProductCharNewForm';

// ----------------------------------------------------------------------

export default function ProductCharCreate() {
  const { themeStretch } = useSettings();

  const dispatch = useDispatch();

  const { pathname } = useLocation();

  const { name = '' } = useParams();

  const { products } = useSelector((state) => state.product);

  const isEdit = pathname.includes('edit');

  const currentProduct = products.find((product) => paramCase(product.name) === name);

  useEffect(() => {
    dispatch(getProducts());
  }, [dispatch]);

  return (
    <Page title="Create new product characteristic">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={!isEdit ? 'Create new product characteristic' : 'Edit product characteristic'}
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            {
              name: 'E-Commerce',
              href: PATH_DASHBOARD.eCommerce.root,
            },
            { name: !isEdit ? 'New product' : name },
          ]}
        />
        <ProductCharNewForm isEdit={false}/>
      </Container>
    </Page>
  );
}
