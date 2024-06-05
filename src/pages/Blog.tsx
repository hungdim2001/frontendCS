import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Container,
  Grid,
  Typography,
  styled,
} from '@mui/material';
import { posts } from 'src/_mock/_post';
import HeaderBreadcrumbs from 'src/components/HeaderBreadcrumbs';
import Page from 'src/components/Page';
import useSettings from 'src/hooks/useSettings';
import { PATH_ROOT } from 'src/routes/paths';
import { caculatorReadingTime } from 'src/utils/formatNumber';
import { fDate } from 'src/utils/formatTime';

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
            <Grid item xs={12} md={8} lg={8} container>
              {posts.map((item) => (
                <Grid key={item.id} item xs={12} md={6} lg={6}>
                  <Card sx={{ maxWidth: 345, boxShadow: 3 }}>
                    <CardMedia
                      component="img"
                      height="140"
                      image={item.thumbnail} // Replace with the correct image path
                    />
                    <CardContent>
                      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                        <Typography variant="body2" color="text.secondary">
                          {fDate(item.createDateTime)}
                        </Typography>
                        <Box display="flex" alignItems="center">
                          <Typography variant="body2" color="text.secondary">
                            {caculatorReadingTime(item.content.length)} minutes to read
                          </Typography>
                        </Box>
                      </Box>
                      <Typography
                        gutterBottom
                        variant="h6"
                        component="div"
                        sx={{
                          textOverflow: 'ellipsis',
                          overflow: 'hidden',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {item.title}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          textOverflow: 'ellipsis',
                          overflow: 'hidden',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {item.content}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
            <Grid item xs={12} md={4} lg={4} container>
              <Typography variant="h6">
                Recent post
                {posts
                  .filter((item) => item.id % 2 == 0)
                  .map((item) => (
                    <Grid key={item.id} item xs={12} md={12} lg={12}>
                      <Card sx={{ maxWidth: 345, margin: 'auto', boxShadow: 3 }}>
                        <CardMedia
                          component="img"
                          height="140"
                          image={item.thumbnail} // Replace with the correct image path
                        />
                        <CardContent>
                          <Box
                            display="flex"
                            justifyContent="space-between"
                            alignItems="center"
                            mb={2}
                          >
                            <Typography variant="body2" color="text.secondary">
                              {fDate(item.createDateTime)}
                            </Typography>
                            <Box display="flex" alignItems="center">
                              <Typography variant="body2" color="text.secondary">
                                {caculatorReadingTime(item.content.length)} minutes to read
                              </Typography>
                            </Box>
                          </Box>
                          <Typography
                            gutterBottom
                            variant="h6"
                            component="div"
                            sx={{
                              textOverflow: 'ellipsis',
                              overflow: 'hidden',
                              whiteSpace: 'nowrap',
                            }}
                          >
                            {item.title}
                          </Typography>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{
                              textOverflow: 'ellipsis',
                              overflow: 'hidden',
                              whiteSpace: 'nowrap',
                            }}
                          >
                            {item.content}
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
              </Typography>
            </Grid>
          </Grid>
        </Container>
      </Page>
    </RootStyle>
  );
}
