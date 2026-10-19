import { Routes, Route } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import { Loader } from "./components/common/StatusViews";
import { Layout } from "./components/layout/Layout";
import { PrivateRoute } from "./routes/PrivateRoute";
import { GuestRoute } from "./routes/GuestRoute";
import HomePage from "./pages/HomePage";
import CatalogPage from "./pages/CatalogPage";
import PlaceDetailsPage from "./pages/PlaceDetailsPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import CreatePlacePage from "./pages/CreatePlacePage";
import EditPlacePage from "./pages/EditPlacePage";
import FavoritesPage from "./pages/FavoritesPage";
import ProfilePage from "./pages/ProfilePage";
import NotFoundPage from "./pages/NotFoundPage";

export default function App() {
  const { isReady } = useAuth();

  if (!isReady) {
    return <Loader />;
  }

  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="places" element={<CatalogPage />} />
        <Route path="places/:placeId" element={<PlaceDetailsPage />} />

        <Route element={<GuestRoute />}>
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
        </Route>

        <Route element={<PrivateRoute />}>
          <Route path="places/new" element={<CreatePlacePage />} />
          <Route path="places/:placeId/edit" element={<EditPlacePage />} />
          <Route path="favorites" element={<FavoritesPage />} />
          <Route path="profile" element={<ProfilePage />} />
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
