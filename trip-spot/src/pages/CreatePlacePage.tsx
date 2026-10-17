import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { PageHeader } from "../components/common/PageHeader";
import { PlaceForm } from "../components/places/PlaceForm";
import { placesApi } from "../services/api";

export default function CreatePlacePage() {
  const navigate = useNavigate();

  return (
    <div className="container-page py-12">
      <PageHeader
        eyebrow="Ново място"
        title="Сподели откритие"
        subtitle="Разкажи на другите защо си заслужава да отидат."
      />

      <div className="mt-8">
        <PlaceForm
          submitLabel="Публикувай"
          onCancel={() => navigate("/places")}
          onSubmit={async (values) => {
            const created = await placesApi.create(values);

            toast.success("Мястото е публикувано");

            navigate(`/places/${created.id}`);
          }}
        />
      </div>
    </div>
  );
}
