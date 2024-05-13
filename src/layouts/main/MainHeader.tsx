import { useLocation, useNavigate } from 'react-router-dom';
// @mui
import {
  AppBar,
  Box,
  Container,
  DialogTitle,
  Divider,
  IconButton,
  ListItem,
  ListItemText,
  MenuItem,
  Stack,
  Toolbar,
  Typography,
} from '@mui/material';
import { styled, useTheme } from '@mui/material/styles';
// hooks
import useOffSetTop from '../../hooks/useOffSetTop';
import useResponsive from '../../hooks/useResponsive';
// utils
import cssStyles from '../../utils/cssStyles';
// config
import { HEADER } from '../../config';
// components
import Logo from '../../components/Logo';
//
import { useState } from 'react';
import SvgIconStyle from 'src/components/SvgIconStyle';
import { DialogAnimate } from 'src/components/animate';
import useAuth from 'src/hooks/useAuth';
import navConfig from './MenuConfig';
import MenuDesktop from './MenuDesktop';
import MenuMobile from './MenuMobile';
import { RegisterForm } from 'src/sections/auth/register';
import { LoginForm } from 'src/sections/auth/login';
import MenuPopover from 'src/components/MenuPopover';

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
const UserMenu = [
  { title: 'Payment & Instalments', icon: '/icons/dollar-circle.svg' },
  { title: 'Order', icon: '/icons/ic_bag.svg' },
  { title: 'Security & access', icon: '/icons/security-safe.svg' },
];
export default function MainHeader() {
  const isOffset = useOffSetTop(HEADER.MAIN_DESKTOP_HEIGHT);

  const theme = useTheme();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { user } = useAuth();
  const isDesktop = useResponsive('up', 'md');
  const isHome = pathname === '/';
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [openUserPopover, setOpenUserPopover] = useState<HTMLElement | null>(null);
  const handleCloseModal = () => {
    setIsOpenModal(false);
  };
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
          <Stack sx={{ color: '#0c0c0c' }} direction="row" flexWrap="wrap" alignItems="center">
            <IconButton
              onClick={(e) => {
                if (user) setOpenUserPopover(e.currentTarget);
                // navigate('/user');
                else {
                  setIsOpenModal(true);
                }
              }}
              sx={{ color: '#0c0c0c' }}
              type="button"
            >
              <SvgIconStyle src={'/icons/ic_profile.svg'} />
              <MenuPopover
                anchorEl={openUserPopover}
                open={Boolean(openUserPopover)}
                onClose={() => {
                  setOpenUserPopover(null);
                }}
                sx={{
                  p: 0,
                  mt: 1.5,
                  ml: 0.75,
                  '& .MuiMenuItem-root': {
                    typography: 'body2',
                    borderRadius: 0.75,
                  },
                }}
              >
                <ListItem sx={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                  <SvgIconStyle
                    sx={{ color: '#B4B4B4', width: '24px', height: '24px', mr: 2 }}
                    src={'/icons/profile-circle.svg'}
                  />
                  <ListItemText
                    primary={user?.fullName}
                    primaryTypographyProps={{
                      sx: {
                        color: '#0C68F4',
                        fontSize: '18px', // Thiết lập font-size
                        fontWeight: 300, // Thiết lập font-weight
                        textAlign: 'left', // Thiết lập text-align
                      },
                    }}
                  />
                  {/* <ListItemText
                    primary={user?.email}
                    primaryTypographyProps={{
                      sx: {
                        color: '#0C0C0C',
                        fontSize: '20px', // Thiết lập font-size
                        fontWeight: 500, // Thiết lập font-weight
                        lineHeight: '24.2px', // Thiết lập line-height
                        textAlign: 'left', // Thiết lập text-align
                      },
                    }}
                  /> */}
                </ListItem>

                <Stack >
                  {UserMenu.map((option) => (
                    <MenuItem key={option.title} onClick={(e) => {}}>
                      <SvgIconStyle sx={{ mr: 2 }} src={option.icon} />
                      {option.title}
                    </MenuItem>
                  ))}
                </Stack>

                <MenuItem sx={{ color: '#C91433' }}>
                  <SvgIconStyle src={'/icons/logout.svg'} sx={{ mr: 2 }} />
                  Logout
                </MenuItem>
              </MenuPopover>
            </IconButton>
            <IconButton sx={{ color: '#0c0c0c' }} type="button">
              <SvgIconStyle src={'/icons/ic_search-normal.svg'} />
            </IconButton>
            <IconButton sx={{ color: '#0c0c0c' }} type="button">
              <SvgIconStyle src={'/icons/ic_bag.svg'} />
            </IconButton>
          </Stack>
        </Container>
        <DialogAnimate open={isOpenModal} onClose={handleCloseModal} sx={{ padding: '40px 80px' }}>
          <Stack direction={'row'}>
            <MenuItem
              onClick={() => {
                setIsLogin(true);
              }}
              sx={{
                fontWeight: 300,
                padding: '2px 20px',
                width: '50%',
                borderBottom: isLogin ? '2px solid #0C68F4' : '2px solid #CBCBCB',
                color: isLogin ? '#0C68F4' : undefined,
                textAlign: 'center',
                display: 'flex',
                justifyContent: 'center',
              }}
            >
              Log in
            </MenuItem>
            <MenuItem
              onClick={() => {
                setIsLogin(false);
              }}
              sx={{
                fontWeight: 300,
                padding: '2px 20px',
                width: '50%',
                color: isLogin ? undefined : '#0C68F4',
                borderBottom: isLogin ? '2px solid #CBCBCB' : '2px solid #0C68F4',
                display: 'flex',
                justifyContent: 'center',
              }}
            >
              Create Account
            </MenuItem>
          </Stack>
          <Box sx={{ display: isLogin ? 'block' : 'none' }}>
            <Typography textAlign="center" variant="h4" my={4}>
              Log in to Tech Heim
            </Typography>
            <LoginForm onCloseModal={handleCloseModal} />
          </Box>
          <Box sx={{ display: isLogin ? 'none' : 'block' }}>
            <Typography textAlign="center" variant="h4" my={4}>
              Create your account
            </Typography>
            <RegisterForm onCloseModal={handleCloseModal} />
          </Box>
        </DialogAnimate>
      </ToolbarStyle>

      {isOffset && <ToolbarShadowStyle />}
    </AppBar>
  );
}
