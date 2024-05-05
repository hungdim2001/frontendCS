import { useLocation } from 'react-router-dom';
// @mui
import { styled, useTheme } from '@mui/material/styles';
import { Box, Button, AppBar, Toolbar, Container, IconButton, Stack } from '@mui/material';
// hooks
import useOffSetTop from '../../hooks/useOffSetTop';
import useResponsive from '../../hooks/useResponsive';
// utils
import cssStyles from '../../utils/cssStyles';
// config
import { HEADER } from '../../config';
// components
import Logo from '../../components/Logo';
import Label from '../../components/Label';
//
import MenuDesktop from './MenuDesktop';
import MenuMobile from './MenuMobile';
import navConfig from './MenuConfig';
import SvgIconStyle from 'src/components/SvgIconStyle';

// ----------------------------------------------------------------------

const ToolbarStyle = styled(Toolbar)(({ theme }) => ({
  height: HEADER.MOBILE_HEIGHT,
  transition: theme.transitions.create(['height', 'background-color'], {
    easing: theme.transitions.easing.easeInOut,
    duration: theme.transitions.duration.shorter,
  }),
  [theme.breakpoints.up('md')]: {
    height: HEADER.MAIN_DESKTOP_HEIGHT,
  },
}));

const ToolbarShadowStyle = styled('div')(({ theme }) => ({
  left: 0,
  right: 0,
  bottom: 0,
  height: 24,
  zIndex: -1,
  margin: 'auto',
  borderRadius: '50%',
  position: 'absolute',
  width: `calc(100% - 48px)`,
  boxShadow: theme.customShadows.z8,
}));

// ----------------------------------------------------------------------

export default function MainHeader() {
  const isOffset = useOffSetTop(HEADER.MAIN_DESKTOP_HEIGHT);

  const theme = useTheme();

  const { pathname } = useLocation();

  const isDesktop = useResponsive('up', 'md');

  const isHome = pathname === '/';

  return (
    <AppBar sx={{ boxShadow: 0, bgcolor: 'transparent' }}>
      <ToolbarStyle
        disableGutters
        sx={{
          ...(isOffset && {
            ...cssStyles(theme).bgBlur(),
            height: { md: HEADER.MAIN_DESKTOP_HEIGHT - 16 },
          }),
        }}
      >
        <Container
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px solid',
            // backgroundImage:
            // 'linear-gradient(147.38deg, rgba(12, 104, 244, 0.3) 60.98%, rgba(12, 104, 244, 0.7) 81.93%, rgba(12, 104, 244, 0.3) 99.45%)',
            borderImageSource:
              'linear-gradient(147.38deg, rgba(12, 104, 244, 0.3) 60.98%, rgba(12, 104, 244, 0.7) 81.93%, rgba(12, 104, 244, 0.3) 99.45%)',
          }}
        >
          <Logo />
          {/* 
          <Label color="info" sx={{ ml: 1 }}>
            v3.0.0
          </Label> */}

          {isDesktop && <MenuDesktop isOffset={isOffset} isHome={isHome} navConfig={navConfig} />}

          {/* <Button
            variant="contained"
            target="_blank"
            rel="noopener"
            href="https://material-ui.com/store/items/minimal-dashboard/"
          >
            Purchase Now
          </Button> */}

          {!isDesktop && <MenuMobile isOffset={isOffset} isHome={isHome} navConfig={navConfig} />}
          <Stack sx={{color:'#0c0c0c'}} direction="row" flexWrap="wrap" alignItems="center">

          <IconButton sx={{color:'#0c0c0c'}}type="button" >
            <SvgIconStyle src={'/icons/ic_profile.svg'} />
          </IconButton>
          <IconButton sx={{color:'#0c0c0c'}}type="button" >
            <SvgIconStyle src={'/icons/ic_search-normal.svg'} />
          </IconButton>
          <IconButton sx={{color:'#0c0c0c'}}type="button" >
            <SvgIconStyle src={'/icons/ic_bag.svg'} />
          </IconButton>

          </Stack>
        </Container>

      </ToolbarStyle>

      {isOffset && <ToolbarShadowStyle />}
    </AppBar>
  );
}
