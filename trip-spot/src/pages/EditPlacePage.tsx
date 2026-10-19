import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { PageHeader } from "../components/common/PageHeader";
import { ErrorState, Loader } from "../components/common/StatusViews";
import { PlaceForm } from "../components/places/PlaceForm";
import { useAuth } from "../context/AuthContext";
import { useAsync } from "../hooks/useAsync";
import { placesApi } from "../services/api";
import { isOwner } from "../utils/permissions";

export default function EditPlacePage() {
  const { placeId } = useParams<{ placeId: string }>();
  const { user, isReady } = useAuth();
  const navigate = useNavigate();

  const { data, error, isLoading, reload } = useAsync(
    () =>
      placeId
        ? placesApi.getById(placeId)
        : Promise.reject(new Error("Не е намерено.")),
    [placeId],
  );

  const toDetails = () => {
    if (placeId) {
      navigate(`/places/${placeId}`);
    }
  };

  if (isLoading || !isReady) {
    return <Loader />;
  }

  if (error || !data) {
    return (
      <div className="container-page py-16">
        <ErrorState message={error ?? "Не е намерено."} onRetry={reload} />
      </div>
    );
  }

  if (!isOwner(user, data)) {
    return (
      <div className="container-page py-16">
        <ErrorState message="Само авторът може да редактира това място." />

        <p className="mt-4 text-center">
          <Link to={`/places/${placeId}`} className="text-primary underline">
            Обратно към мястото
          </Link>
        </p>
      </div>
    );
  }

  return (
    <div className="container-page py-12">
      <PageHeader eyebrow="Редакция" title={data.title} />

      <div className="mt-8">
        <PlaceForm
          initialValues={{
            title: data.title,
            location: data.location,
            category: data.category,
            description: data.description,
            imageUrl: data.imageUrl,
            images: data.images?.length
              ? data.images
              : data.imageUrl
                ? [data.imageUrl]
                : [],
            lat: data.lat,
            lng: data.lng,
          }}
          submitLabel="Запази промените"
          onCancel={toDetails}
          onSubmit={async (values) => {
            if (!placeId) return;

            await placesApi.update(placeId, values);
            toast.success("Промените са запазени");
            toDetails();
          }}
        />
      </div>
    </div>
  );
}
