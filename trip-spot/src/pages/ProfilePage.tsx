import { Link } from "react-router-dom";
import { Plus } from "lucide-react";
import { PageHeader } from "../components/common/PageHeader";
import {
  EmptyState,
  ErrorState,
  Loader,
} from "../components/common/StatusViews";
import { PlaceGrid } from "../components/places/PlaceCard";
import { Button } from "../components/ui/button";
import { useAuth } from "../context/AuthContext";
import { useAsync } from "../hooks/useAsync";
import { placesApi } from "../services/api";
import { formatDate } from "../utils/format";

export default function ProfilePage() {
  const { user } = useAuth();
  const { data, error, isLoading, reload } = useAsync(
    () => (user ? placesApi.list({ authorId: user.id }) : Promise.resolve([])),
    [user?.id],
  );
  const likes = (data ?? []).reduce(
    (sum, place) => sum + place.likes.length,
    0,
  );

  return (
    <div className="container-page py-12">
      <PageHeader
        eyebrow="Профил"
        title={user?.username ?? ""}
        subtitle={
          user
            ? `${user.email} · член от ${formatDate(user.createdAt)}`
            : undefined
        }
        actions={
          <Button asChild>
            <Link to="/places/new">
              <Plus className="h-4 w-4" />
              Ново място
            </Link>
          </Button>
        }
      />

      <div className="mt-8 grid grid-cols-2 gap-4 sm:max-w-md">
        <div className="rounded-2xl border bg-card p-5">
          <p className="text-3xl font-semibold">{data?.length ?? "—"}</p>
          <p className="text-sm text-muted-foreground">публикации</p>
        </div>

        <div className="rounded-2xl border bg-card p-5">
          <p className="text-3xl font-semibold">{data ? likes : "—"}</p>
          <p className="text-sm text-muted-foreground">харесвания</p>
        </div>
      </div>

      <h2 className="mb-6 mt-12 text-3xl">Моите места</h2>

      {isLoading ? (
        <Loader />
      ) : error ? (
        <ErrorState message={error} onRetry={reload} />
      ) : data?.length ? (
        <PlaceGrid places={data} />
      ) : (
        <EmptyState
          title="Още нямаш публикации"
          action={
            <Button asChild>
              <Link to="/places/new">Сподели първото си място</Link>
            </Button>
          }
        />
      )}
    </div>
  );
}
