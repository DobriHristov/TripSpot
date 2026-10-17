import { FormAlert, FormField } from "../../components/common/FormField";
import { LazyLocationPicker } from "../../components/map/LazyLocationPicker";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Textarea } from "../../components/ui/textarea";
import { ImageCarousel } from "../../components/common/ImageCarousel";
import { ImagesInput } from "../../components/places/ImagesInput";
import { useForm } from "../../hooks/useForm";
import type { PlaceDto } from "../../types";
import { CATEGORIES } from "../../utils/constants";
import { resolveImage } from "../../utils/images";
import { validatePlace } from "../../utils/validators";

// eslint-disable-next-line react-refresh/only-export-components
export const EMPTY_PLACE: PlaceDto = {
  title: "",
  location: "",
  category: "mountain",
  description: "",
  imageUrl: "",
  images: [],
  lat: 42.7,
  lng: 25.3,
};

interface PlaceFormProps {
  initialValues?: PlaceDto;
  submitLabel: string;
  onSubmit: (values: PlaceDto) => Promise<void>;
  onCancel?: () => void;
}

export function PlaceForm({
  initialValues = EMPTY_PLACE,
  submitLabel,
  onSubmit,
  onCancel,
}: PlaceFormProps) {
  const {
    values,
    errors,
    isSubmitting,
    submitError,
    handleChange,
    handleBlur,
    handleSubmit,
    setField,
  } = useForm<PlaceDto>(initialValues as PlaceDto, validatePlace, onSubmit);
  const field = (name: keyof PlaceDto) => ({
    id: name,
    name,
    value: String(values[name]),
    onChange: handleChange,
    onBlur: handleBlur,
    "aria-invalid": !!errors[name],
    "aria-describedby": errors[name] ? `${name}-error` : undefined,
  });

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="grid gap-8 lg:grid-cols-[1fr_320px]"
    >
      <div className="space-y-5">
        <FormAlert message={submitError} />
        <FormField id="title" label="Заглавие" error={errors.title}>
          <Input {...field("title")} placeholder="Напр. Седемте рилски езера" />
        </FormField>
        <div className="grid gap-5 sm:grid-cols-2">
          <FormField id="location" label="Локация" error={errors.location}>
            <Input {...field("location")} placeholder="Град, държава" />
          </FormField>
          <FormField id="category" label="Категория" error={errors.category}>
            <select
              {...field("category")}
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              {CATEGORIES.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>
          </FormField>
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          <FormField
            id="lat"
            label="Географска ширина"
            error={errors.lat}
            hint="Напр. 42.15"
          >
            <Input {...field("lat")} type="number" step="any" />
          </FormField>
          <FormField
            id="lng"
            label="Географска дължина"
            error={errors.lng}
            hint="Напр. 24.75"
          >
            <Input {...field("lng")} type="number" step="any" />
          </FormField>
        </div>
        <div className="space-y-2">
          <p className="text-sm font-medium">Избери от картата</p>
          <LazyLocationPicker
            lat={Number(values.lat)}
            lng={Number(values.lng)}
            onPick={(lat, lng) => {
              setField("lat", lat);
              setField("lng", lng);
            }}
          />
          <p className="text-xs text-muted-foreground">
            Кликни на картата или влачи маркера — координатите се попълват
            автоматично.
          </p>
        </div>
        <FormField
          id="images"
          label="Снимки"
          error={errors.images}
          hint="Добави линк или качи от компютъра. Първата снимка е корица."
        >
          <ImagesInput
            value={values.images ?? []}
            onChange={(imgs) => {
              setField("images", imgs);
              setField("imageUrl", imgs[0] ?? "");
            }}
          />
        </FormField>
        <FormField
          id="description"
          label="Описание"
          error={errors.description}
          hint={`${(values.description as string).length}/1500`}
        >
          <Textarea
            {...field("description")}
            rows={7}
            placeholder="Какво го прави специално? Съвети за посещение…"
          />
        </FormField>
        <div className="flex gap-3">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Запазване…" : submitLabel}
          </Button>
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel}>
              Отказ
            </Button>
          )}
        </div>
      </div>
      <aside className="space-y-2">
        <p className="text-sm font-medium">Преглед</p>
        <div className="aspect-[4/3] overflow-hidden rounded-2xl border bg-muted">
          {values.images?.length ? (
            <ImageCarousel
              images={values.images.map(resolveImage)}
              alt="Преглед"
              className="h-full"
            />
          ) : (
            <div className="grid h-full place-items-center text-sm text-muted-foreground">
              Няма снимка
            </div>
          )}
        </div>
      </aside>
    </form>
  );
}
