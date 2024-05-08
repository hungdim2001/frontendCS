import React from 'react';
import {
  Grid,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  Divider,
  Container,
  makeStyles,
  Theme,
  Card,
  Stack,
  styled,
} from '@mui/material';
const UserMenu = [
  { title: 'Person Data' },
  { title: 'Address' },
  { title: 'Order' },
  { title: 'security' },
];
const RootStyle = styled('div')(({ theme }) => ({
  height: '100%',
}));

const ContentStyle = styled('div')(({ theme }) => ({
  overflow: 'hidden',
  position: 'relative',
  backgroundColor: theme.palette.background.default,
}));

const UserPage = () => {
  return (
    <RootStyle>
      <ContentStyle>
        <Container>
          <Grid container spacing={3}>
            <Grid item xs={4}>
              <Stack
                direction="row"
                justifyContent="center"
                sx={{ bgcolor: 'background.neutral', borderRadius: 1, px: 0.5 }}
              >
                <Stack direction="row" sx={{ py: 1 }}>
                  {UserMenu.map((item) => (
                    <ListItem key={item.title}>{item.title}</ListItem>
                  ))}
                </Stack>
              </Stack>
            </Grid>
            {/* <Grid item xs={8}>
          <Paper className={classes.paper}>
            <Typography variant="h6">User Information</Typography>
            <Divider />
            <Typography variant="body1">
              Name: John Doe
              <br />
              Email: johndoe@example.com
              <br />
              Address: 123 Main St, City, Country
            </Typography>
          </Paper>
        </Grid>
*/}
          </Grid>
        </Container>
      </ContentStyle>
    </RootStyle>
  );
};

export default UserPage;
