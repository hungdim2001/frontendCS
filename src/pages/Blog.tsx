import { Container, Grid, styled } from '@mui/material';
import HeaderBreadcrumbs from 'src/components/HeaderBreadcrumbs';
import Page from 'src/components/Page';
import useSettings from 'src/hooks/useSettings';
import { PATH_ROOT } from 'src/routes/paths';

const RootStyle = styled('div')(({ theme }) => ({
  height: '100%',
  marginTop: '77px',
}));

export default function EcommerceShop() {
  const { themeStretch } = useSettings();

  return (
    <RootStyle>
      <Page title="Blogs">
        <Container maxWidth={themeStretch ? false : 'lg'}>
          <HeaderBreadcrumbs
            heading=""
            links={[
              { name: 'Home', href: '/' },
              {
                name: 'Blog',
                href: PATH_ROOT.blog.root,
              },
            ]}
          />

          <Grid container spacing={3}>

            
          </Grid>
        </Container>
      </Page>
    </RootStyle>
  );
}
