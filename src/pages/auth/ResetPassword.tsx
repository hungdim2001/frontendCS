// @mui
import { Box, Container, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
// layouts
import LogoOnlyLayout from '../../layouts/LogoOnlyLayout';
// routes
// components
import { ResetPasswordForm } from 'src/sections/auth/reset-password';
import Page from '../../components/Page';
// sections
// assets

// ----------------------------------------------------------------------

const RootStyle = styled('div')(({ theme }) => ({
  display: 'flex',
  minHeight: '100%',
  justifyContent: 'center',
  padding: theme.spacing(12, 0),
}));

// ----------------------------------------------------------------------

export default function ResetPassword() {


  return (
    <Page title="Reset Password" sx={{ height: 1 }}>
      <RootStyle>
        <LogoOnlyLayout />

        <Container>
          <Box sx={{ maxWidth: 480, mx: 'auto' }}>
            <Typography variant="h3" paragraph>
             Lấy lại mật khẩu
            </Typography>
            <ResetPasswordForm />

          </Box>
        </Container>
      </RootStyle>
    </Page>
  );
}
