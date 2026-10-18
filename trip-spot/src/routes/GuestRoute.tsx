import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Loader } from "../components/common/StatusViews";
import { safeRedirect } from "../utils/permissions";

export function GuestRoute() {
  const { isAuthenticated, isReady } = useAuth();
  const location = useLocation();

  if (!isReady) return <Loader />;

  if (isAuthenticated) {
    const searchParams = new URLSearchParams(location.search);
    const redirect = searchParams.get("redirect");

    return <Navigate to={safeRedirect(redirect)} replace />;
  }

  return (
    <div className="container-page flex min-h-[70vh] items-center justify-center py-16">
      <div className="w-full max-w-md rounded-3xl border bg-card p-8 shadow-soft">
        <Outlet />
      </div>
    </div>
  );
}
