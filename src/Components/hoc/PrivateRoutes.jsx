import { useIsAuthenticated, useMsal } from '@azure/msal-react';
import { useLocation, Navigate, Outlet, useMatches } from 'react-router-dom';


export default function PrivateRoutes() {
  const location = useLocation();
   const { instance ,accounts} = useMsal();
  const isAuthenticated = useIsAuthenticated();
  const meta = useMatches().find((match) => match.pathname === location.pathname)?.handle;

//   const { auth, authData } = useSelector((state) => state.loginData);

  // Even though we check permissions for the subadmin in CheckPermission hoc some routes has nested in the permissioned routes which in some conditions the team members are not allowed
  // So in that case this condition will prevent the team members from accessing the page
  // If you have doubt check the router => settingRoutes => commission childs
//   if (meta?.access?.includes(authData.role) === false) {
//     toast.error('You do not have permission to visit that page', { id: 'not-access-page' });
//     return <Navigate to="/dashboard" />;
//   }

  return <Outlet />;
}