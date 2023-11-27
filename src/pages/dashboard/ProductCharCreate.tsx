import { useEffect } from 'react';
import { useLocation, useParams } from 'react-router-dom';
// @mui
import { Container } from '@mui/material';
// redux
import { useDispatch, useSelector } from '../../redux/store';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// hooks
import useSettings from '../../hooks/useSettings';
// components
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import Page from '../../components/Page';
// sections
import { getProductChars } from 'src/redux/slices/product-char';
import ProductCharNewForm from 'src/sections/@dashboard/e-commerce/ProductCharNewForm';

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
    else dispatch(getProductChars(null))
    console.log(productChar)
  }, [dispatch, id]);

  return (
    <Page title="Create new product characteristic">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={!isEdit ? 'Create new product characteristic' : 'Edit product characteristic'}
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Product char list', href: PATH_DASHBOARD.productChar.list },
            { name: !isEdit ? 'New product characteristic' : productChar.id?.toString() ||'' },
          ]}
        />
        <ProductCharNewForm productChar={productChar} isEdit={isEdit} />
      </Container>
    </Page>
  );
}
