import { useState, ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
// hooks
import useAuth from '../hooks/useAuth';
// pages
import Login from '../pages/auth/Login';
// components
import LoadingScreen from '../components/LoadingScreen';
import VerifyCode from 'src/pages/auth/VerifyCode';
import { PATH_AUTH, PATH_DASHBOARD } from 'src/routes/paths';

// ----------------------------------------------------------------------

type AuthGuardProps = {
  children: ReactNode;
};

export default function VerifyGuard({ children }: AuthGuardProps) {
  const { isAuthenticated, isInitialized, user } = useAuth();
  const { pathname } = useLocation();

  const [requestedLocation, setRequestedLocation] = useState<string | null>(null);

  if (!isInitialized) {
    return <LoadingScreen />;
  }


  if (!isAuthenticated) {

    return <Navigate to={PATH_AUTH.login} />;;
  }

  if (isAuthenticated&& user?.isActive) {
    return <Navigate to={PATH_DASHBOARD.root} />;
  }


  return <>{children}</>;
}
