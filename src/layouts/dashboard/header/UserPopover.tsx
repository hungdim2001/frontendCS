import { useSnackbar } from 'notistack';
import { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
// @mui
import { alpha } from '@mui/material/styles';
import { Box, Divider, Typography, Stack, MenuItem, IconButton } from '@mui/material';
// routes
import { PATH_DASHBOARD, PATH_AUTH } from '../../../routes/paths';
// hooks
import useAuth from '../../../hooks/useAuth';
import useIsMountedRef from '../../../hooks/useIsMountedRef';
// components
import MyAvatar from '../../../components/MyAvatar';
import MenuPopover from '../../../components/MenuPopover';
import { DialogAnimate, IconButtonAnimate } from '../../../components/animate';
import SvgIconStyle from 'src/components/SvgIconStyle';
import { LoginForm } from 'src/sections/auth/login';
import { RegisterForm } from 'src/sections/auth/register';
import { log } from 'util';
import { UserMenu, setOptionMenuSelected } from 'src/redux/slices/menu';
import { useDispatch } from 'src/redux/store';
import { use } from 'i18next';

// ----------------------------------------------------------------------

const MENU_OPTIONS = [
  {
    label: 'Home',
    linkTo: '/',
  },
  {
    label: 'Profile',
    linkTo: PATH_DASHBOARD.user.profile,
  },
  {
    label: 'Settings',
    linkTo: PATH_DASHBOARD.user.account,
  },
];
// ----------------------------------------------------------------------

export default function UserPopover() {
  const navigate = useNavigate();

  const { user, logout } = useAuth();

  const dispatch = useDispatch();
  const isMountedRef = useIsMountedRef();
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const { enqueueSnackbar } = useSnackbar();

  const [open, setOpen] = useState<HTMLElement | null>(null);

  const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
    setOpen(event.currentTarget);
  };
  const handleCloseModal = () => {
    setIsOpenModal(false);
  };
  const handleClose = () => {
    setOpen(null);
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate(PATH_AUTH.login, { replace: true });

      if (isMountedRef.current) {
        handleClose();
      }
    } catch (error) {
      console.error(error);
      enqueueSnackbar('Unable to logout!', { variant: 'error' });
    }
  };

  return (
    <>
      <IconButton
        onClick={(e) => {
          e.stopPropagation();
          if (user) setOpen(e.currentTarget);
          else {
            setIsOpenModal(true);
          }
        }}
        sx={{ color: '#0c0c0c' }}
        type="button"
      >
        <SvgIconStyle src={'/icons/ic_profile.svg'} />
      </IconButton>

      <MenuPopover
        open={Boolean(open)}
        anchorEl={open}
        onClose={handleClose}
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
        <Box
          onClick={(e) => {
            dispatch(setOptionMenuSelected(UserMenu[0]));
            if (user?.role == 'ADMIN') navigate('/dashboard');
            else navigate('/user');

            handleClose();
          }}
          sx={{ cursor: 'pointer', my: 1.5, px: 2.5 }}
        >
          <Typography variant="subtitle2" noWrap>
            {user?.fullName}
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
            {user?.email}
          </Typography>
        </Box>

        <Divider sx={{ borderStyle: 'dashed' }} />

        <Stack>
          {UserMenu.filter((item) => item.title !== 'Personal Data').map((option) => (
            <MenuItem
              onClick={(e) => {
                dispatch(setOptionMenuSelected(option));
                navigate('/user');
                handleClose();
              }}
              key={option.title}
            >
              <SvgIconStyle sx={{ mr: 1 }} src={option.icon} />
              {option.title}
            </MenuItem>
          ))}
        </Stack>

        <Divider sx={{ borderStyle: 'dashed' }} />

        <MenuItem
          onClick={() => {
            logout();
            handleClose();
          }}
          sx={{ color: '#C91433' }}
        >
          <SvgIconStyle src={'/icons/logout.svg'} sx={{ mr: 1 }} />
          Logout
        </MenuItem>
      </MenuPopover>
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
    </>
  );
}
