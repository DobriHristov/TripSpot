import { Navigate, Outlet, useLocation } from "react-router-dom";
import { Loader } from "../components/common/StatusViews";

export function PrivateRoute() {
  const isLoading = false;
  const isAuthenticated = true;
  const location = useLocation();

  if (isLoading) return <Loader />;

  if (!isAuthenticated) {
    const redirect = location.pathname + location.search;
    return (
      <Navigate
        to={`/login?redirect=${encodeURIComponent(redirect)}`}
        replace
      />
    );
  }
  return <Outlet />;
}
