import { Link } from "react-router-dom";
import { PageHeader } from "../components/common/PageHeader";
import {
  EmptyState,
  ErrorState,
  Loader,
} from "../components/common/StatusViews";
import { PlaceGrid } from "../components/places/PlaceCard";
import { Button } from "../components/ui/button";
import { useFavorites } from "../context/FavoritesContext";
import { useAsync } from "../hooks/useAsync";
import { favoritesApi } from "../services/api";

export default function FavoritesPage() {
  const { isFavorite } = useFavorites();
  const { data, error, isLoading, reload } = useAsync(
    () => favoritesApi.list(),
    [],
  );
  const places = (data ?? []).filter((p) => isFavorite(p.id));

  return (
    <div className="container-page py-12">
      <PageHeader
        eyebrow="Запазени"
        title="Любими места"
        subtitle="Твоят списък за следващото приключение."
      />

      <div className="mt-8">
        {isLoading ? (
          <Loader />
        ) : error ? (
          <ErrorState message={error} onRetry={reload} />
        ) : places.length ? (
          <PlaceGrid places={places} />
        ) : (
          <EmptyState
            title="Още нямаш любими"
            text="Натисни иконата за отметка на някое място."
            action={
              <Button asChild>
                <Link to="/places">Към каталога</Link>
              </Button>
            }
          />
        )}
      </div>
    </div>
  );
}
