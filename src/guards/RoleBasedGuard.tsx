import { ReactNode } from 'react';
import { Container, Alert, AlertTitle } from '@mui/material';
import useAuth from 'src/hooks/useAuth';
import { PATH_AUTH } from 'src/routes/paths';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';

// ----------------------------------------------------------------------

type RoleBasedGuardProp = {
  accessibleRoles: string[];
  children: ReactNode | string;
};

const useCurrentRole = () => {
  const { user } = useAuth();
  return user ? user?.role! : "ROLE_ADMIN";
};

export default function RoleBasedGuard({ accessibleRoles, children }: RoleBasedGuardProp) {
  const { enqueueSnackbar } = useSnackbar();
  const { logout } = useAuth();
  const navigate = useNavigate();
  const currentRole = useCurrentRole();
  if (!accessibleRoles.includes(currentRole)) {
    enqueueSnackbar('no permission', { variant: 'error' });
    logout();
    navigate(PATH_AUTH.login, { replace: true });

    // return (
    //   <Container>
    //     <Alert severity="error">
    //       <AlertTitle>Permission Denied</AlertTitle>
    //       You do not have permission to access this page
    //     </Alert>
    //   </Container>
    // );
  }

  return <>{children}</>;
}
