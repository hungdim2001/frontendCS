import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import LoadingScreen from 'src/components/LoadingScreen';
// hooks
import useAuth from '../hooks/useAuth';
// routes
import { PATH_AUTH, PATH_DASHBOARD } from '../routes/paths';

// ----------------------------------------------------------------------

type GuestGuardProps = {
  children: ReactNode;
};

export default function GuestGuard({ children }: GuestGuardProps) {
  const { isAuthenticated, user, isInitialized } = useAuth();
console.log("isAuthen: " +isAuthenticated)
console.log("active:" +user)
  if (!isInitialized) {
    return <LoadingScreen />;
  }
  if (isAuthenticated&& user?.status) {
    return <Navigate to={PATH_DASHBOARD.root} />;
  }
  if(isAuthenticated&& !user?.status){
    return <Navigate to={PATH_AUTH.verify} />;
  }

  return <>{children}</>;
}
