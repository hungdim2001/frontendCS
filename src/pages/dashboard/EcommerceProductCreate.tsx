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
import { use } from 'i18next';
import { Product } from 'src/@types/product';
import { ThunkDispatch } from '@reduxjs/toolkit';
import { AnyAction, Dispatch } from 'redux';
import { Edit } from '@mui/icons-material';
import LoadingScreen from 'src/components/LoadingScreen';

// ----------------------------------------------------------------------

export default function EcommerceProductCreate() {
  const { themeStretch } = useSettings();

  const dispatch = useDispatch();

  const { pathname } = useLocation();

  const { id = '' } = useParams();

  const { products } = useSelector((state) => state.product);

  const isEdit = pathname.includes('edit');
  const [currentProduct, setCurrentProduct] = useState<Product>({} as Product);
  useEffect(() => {
    const foundProduct = products.find((product) => {
      return product.id === +id!;
    });
    if (foundProduct && foundProduct.description) {
      fetch(foundProduct.description)
        .then((response) => response.text())
        .then((data) => {
          const updatedProduct = { ...foundProduct, description: data };
          setCurrentProduct(updatedProduct as Product);
        })
        .catch((error) => {
          console.error('Error fetching description:', error);
        });
    }
  }, [id, products]);

  useEffect(() => {
    dispatch(getProducts());
  }, [dispatch]);
  useEffect(()=>{
console.log(isEdit)
console.log(currentProduct)

  },[isEdit,currentProduct])
  if (isEdit && !currentProduct.id) {
    return <LoadingScreen />;
  }
  return (
    <Page title="Ecommerce: Create a new product">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={!isEdit ? 'Create a new product' : 'Edit product'}
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            {
              name: 'E-Commerce',
              href: PATH_DASHBOARD.eCommerce.root,
            },
            { name: !isEdit ? 'New product' : currentProduct.name },
          ]}
        />
        <ProductNewForm isEdit={isEdit} currentProduct={currentProduct} />
      </Container>
    </Page>
  );
}
