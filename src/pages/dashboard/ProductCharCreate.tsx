import { useEffect, useState } from 'react';
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
import { ProductChar } from 'src/@types/product';
import { productSpecCharApi } from 'src/service/app-apis/product-char';
import { getProductChars } from 'src/redux/slices/product-char';

// ----------------------------------------------------------------------

export default function ProductCharCreate() {
  const { themeStretch } = useSettings();

  const dispatch = useDispatch();

  const { pathname } = useLocation();

  const { id = '' } = useParams();

  const { productChar } = useSelector((state) => state.productChars);
  const isEdit = pathname.includes('edit');
  useEffect(() => {
    if (isEdit) dispatch(getProductChars(+id));
  }, [dispatch, id]);

  return (
    <Page title="Create new product characteristic">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={!isEdit ? 'Create new product characteristic' : 'Edit product characteristic'}
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Product char list', href: PATH_DASHBOARD.productChar.list },
            { name: !isEdit ? 'New product characteristic' : productChar.code||'' },
          ]}
        />
        <ProductCharNewForm productChar={productChar} isEdit={isEdit} />
      </Container>
    </Page>
  );
}
