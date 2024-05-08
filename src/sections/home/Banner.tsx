import { Box, Button, Container, Theme, Typography, makeStyles } from '@mui/material';

export default function ProductMenu() {
  return (
    <Container sx={{ marginY:2, display: 'flex', justifyContent: 'space-between' }}>
      <Box sx={{ padding: '20px 0px',display: 'flex', flexDirection: 'column', gap: '40px' }}>
        <Typography
          sx={{
            fontWeight: 600,
            fontSize: 56,
            letterSpacing: 2,
            color: '#042352',
          }}
        >
          Tech Heim
        </Typography>
        <Typography variant="h3" color="text">
          "Join the{' '}
          <Typography variant="h3" color="#F45E0C" component="span">
            digital revolution
          </Typography>
          "
        </Typography>
        <Button
          sx={{
            color: '#FFFFFF',
            fontSize: 16,
            backgroundColor: '#F45E0C',
            fontWeight: 300,
            padding: '10px 90px',
            borderRadius: '8px',
            '&:hover': {
              backgroundColor: '#F45E0C',
            },
          }}
        >
          Shop Now
        </Button>
      </Box>
      <img src={'/img/banner.png'} alt="Product" />
    </Container>
  );
}
