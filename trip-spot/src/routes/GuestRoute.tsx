import { Navigate, Outlet } from "react-router-dom";
import { Loader } from "../components/common/StatusViews";

export function GuestRoute() {
  const isLoading = false;
  const isAuthenticated = false;

  if (isLoading) return <Loader />;

  if (isAuthenticated) return <Navigate to="/places" replace />;
  
  return (
    <div className="container-page flex min-h-[70vh] items-center justify-center py-16">
      <div className="w-full max-w-md rounded-3xl border bg-card p-8 shadow-soft">
        <Outlet />
      </div>
    </div>
  );
}
