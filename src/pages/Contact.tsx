// @mui
import { styled } from '@mui/material/styles';
import { Grid, Container, Box, Stack, Typography } from '@mui/material';
// components
import Page from '../components/Page';
// sections
import { ContactHero, ContactForm, ContactMap } from '../sections/contact';
import { PATH_ROOT } from 'src/routes/paths';
import HeaderBreadcrumbs from 'src/components/HeaderBreadcrumbs';
import SvgIcon from 'src/theme/overrides/SvgIcon';
import SvgIconStyle from 'src/components/SvgIconStyle';
// ----------------------------------------------------------------------

const RootStyle = styled('div')(({ theme }) => ({
  paddingTop: theme.spacing(8),
  [theme.breakpoints.up('md')]: {
    paddingTop: theme.spacing(11),
  },
}));

// ----------------------------------------------------------------------

export default function Contact() {
  return (
    <Page title="Contact us">
      <RootStyle>
        <Container>
          <HeaderBreadcrumbs
            heading=""
            links={[
              { name: 'Home', href: '/' },
              {
                name: 'Contact us',
                href: PATH_ROOT.contactUs.root,
              },
            ]}
          />
          <Stack direction="row" justifyContent="space-between">
            <Box display="flex" sx={{ flexDirection: 'column', alignItems: 'center' }}>
              <SvgIconStyle
                src={'/icons/location-add.svg'}
                sx={{ color: '#0C68F4', width: '48px', height: '48px' }}
              />
              <Typography variant="h5"> Office </Typography>
              <Typography variant="body2" sx={{ color: '#717171' }}>
                402 My Dinh, Nam Tu Liem, Ha Noi
              </Typography>
            </Box>
            <Box display="flex" sx={{ flexDirection: 'column', alignItems: 'center' }}>
              <SvgIconStyle
                src={'/icons/sms.svg'}
                sx={{ color: '#0C68F4', width: '48px', height: '48px' }}
              />
              <Typography variant="h5"> Email </Typography>
              <Typography variant="body2" sx={{ color: '#717171' }}>
                hungdim2001@gmail.com
              </Typography>
            </Box>
            <Box display="flex" sx={{ flexDirection: 'column', alignItems: 'center' }}>
              <SvgIconStyle
                src={'/icons/call-incoming.svg'}
                sx={{ color: '#0C68F4', width: '48px', height: '48px' }}
              />
              <Typography variant="h5"> Phone </Typography>
              <Typography variant="body2" sx={{ color: '#717171' }}>
                0987280431
              </Typography>
            </Box>
          </Stack>
          <Grid container spacing={10} mt={5}>
            <Grid item xs={12} md={6}>
              <Typography variant="h4" color="#0c0c0c" >
                Message us
              </Typography>
              <Typography color="#717171" variant="body2" mt={2}>
                
                We're here to assist you every step of the way. Whether you have a question, need
                technical support, or simply want to share your feedback, our dedicated team is
                ready to listen and provide prompt assistance.
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <ContactForm />
            </Grid>
            {/* <Grid item xs={12} md={6}>
              <ContactMap />
            </Grid> */}
          </Grid>
        </Container>
      </RootStyle>
    </Page>
  );
}
