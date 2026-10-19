import { Link, useNavigate, useParams } from "react-router-dom";
import { Heart, MapPin, Pencil, Star, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { ConfirmButton } from "../components/common/ConfirmButton";
import { ErrorState, Loader } from "../components/common/StatusViews";
import { ImageCarousel } from "../components/common/ImageCarousel";
import { LazyPlacesMap } from "../components/map/LazyPlacesMap";
import { FavoriteButton } from "../components/places/FavoriteButton";
import { ReviewForm } from "../components/reviews/ReviewForm";
import { ReviewList } from "../components/reviews/ReviewList";
import { Button } from "../components/ui/button";
import { useAuth } from "../context/AuthContext";
import { useAsync } from "../hooks/useAsync";
import { cn } from "../lib/utils";
import { placesApi, reviewsApi } from "../services/api";
import type { ReviewDto } from "../types";
import { categoryLabel } from "../utils/constants";
import { getErrorMessage } from "../utils/errors";
import { formatDate, formatRating } from "../utils/format";
import { placeImages } from "../utils/images";
import { isOwner } from "../utils/permissions";

export default function PlaceDetailsPage() {
  const { placeId } = useParams<{ placeId: string }>();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const place = useAsync(() => placesApi.getById(placeId!), [placeId]);
  const reviews = useAsync(() => reviewsApi.listByPlace(placeId!), [placeId]);
  const [liking, setLiking] = useState(false);

  if (place.isLoading) {
    return <Loader />;
  }

  if (place.error || !place.data) {
    return (
      <div className="container-page py-16">
        <ErrorState message={"Мястото не е намерено."} onRetry={place.reload} />
      </div>
    );
  }

  const p = place.data;
  const owner = isOwner(user, p);
  const liked = !!user && p.likes.includes(user.id);

  const handleLike = async () => {
    setLiking(true);

    try {
      const updated = await placesApi.toggleLike(p.id);
      place.setData(() => updated);
    } catch (e) {
      toast.error(getErrorMessage(e));
    } finally {
      setLiking(false);
    }
  };

  const handleDelete = async () => {
    try {
      await placesApi.remove(p.id);
      toast.success("Мястото е изтрито");
      navigate("/places");
    } catch (e) {
      toast.error(getErrorMessage(e));
    }
  };

  const handleReview = async (dto: ReviewDto) => {
    const created = await reviewsApi.create(p.id, dto);

    reviews.setData((prev) => [created, ...(prev ?? [])]);
    place.reload();

    toast.success("Ревюто е публикувано");
  };

  const handleDeleteReview = async (id: string) => {
    try {
      await reviewsApi.remove(id);

      reviews.setData((prev) => (prev ?? []).filter((r) => r.id !== id));

      place.reload();
    } catch (e) {
      toast.error(getErrorMessage(e));
    }
  };

  return (
    <article className="container-page py-10">
      <div className="relative overflow-hidden rounded-3xl">
        <ImageCarousel
          images={placeImages(p)}
          alt={p.title}
          className="aspect-[21/9]"
        />

        <div className="pointer-events-none absolute inset-0 bg-gradient-card" />

        <div className="pointer-events-none absolute bottom-0 left-0 right-0 p-6 text-primary-foreground sm:p-10">
          <span className="rounded-full bg-accent px-3 py-1 text-xs font-semibold text-accent-foreground">
            {categoryLabel(p.category)}
          </span>

          <h1 className="mt-3 text-4xl sm:text-6xl">{p.title}</h1>

          <p className="mt-2 flex items-center gap-1">
            <MapPin className="h-4 w-4" />
            {p.location}
          </p>
        </div>
      </div>

      <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_320px]">
        <div>
          <p className="whitespace-pre-line text-lg leading-relaxed">
            {p.description}
          </p>

          <section className="mt-12 space-y-5">
            <h2 className="text-3xl">Ревюта</h2>

            {isAuthenticated ? (
              <ReviewForm onSubmit={handleReview} />
            ) : (
              <p className="rounded-2xl border bg-card p-5 text-sm">
                <Link
                  to="/login"
                  state={{ redirect: `/places/${p.id}` }}
                  className="font-semibold text-primary underline"
                >
                  Влез
                </Link>
                , за да оставиш ревю.
              </p>
            )}

            {reviews.isLoading ? (
              <Loader />
            ) : reviews.error ? (
              <ErrorState message={reviews.error} onRetry={reviews.reload} />
            ) : (
              <ReviewList
                reviews={reviews.data ?? []}
                onDelete={handleDeleteReview}
              />
            )}
          </section>
        </div>

        <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-2xl border bg-card p-5 shadow-soft">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1 text-2xl font-semibold">
                <Star className="h-5 w-5 fill-star text-star" />
                {formatRating(p.rating)}
              </span>

              <span className="text-sm text-muted-foreground">
                {p.reviewsCount} ревюта
              </span>
            </div>

            <p className="mt-4 text-sm text-muted-foreground">
              Споделено от <b className="text-foreground">{p.authorName}</b> на{" "}
              {formatDate(p.createdAt)}
            </p>

            {isAuthenticated && (
              <div className="mt-5 flex items-center gap-2">
                <Button
                  variant={liked ? "default" : "outline"}
                  onClick={handleLike}
                  disabled={liking}
                  className="flex-1"
                >
                  <Heart className={cn("h-4 w-4", liked && "fill-current")} />
                  {p.likes.length} {liked ? "Харесано" : "Харесай"}
                </Button>

                <FavoriteButton placeId={p.id} className="border" />
              </div>
            )}

            {!isAuthenticated && (
              <p className="mt-5 text-sm">{p.likes.length} харесвания</p>
            )}
          </div>

          <LazyPlacesMap places={[p]} height={240} />

          {owner && (
            <div className="flex gap-2">
              <Button asChild variant="outline" className="flex-1">
                <Link to={`/places/${p.id}/edit`}>
                  <Pencil className="h-4 w-4" />
                  Редактирай
                </Link>
              </Button>

              <ConfirmButton
                title="Изтриване на място"
                description="Мястото и всички ревюта към него ще бъдат изтрити."
                onConfirm={handleDelete}
                trigger={
                  <Button variant="destructive">
                    <Trash2 className="h-4 w-4" />
                    Изтрий
                  </Button>
                }
              />
            </div>
          )}
        </aside>
      </div>
    </article>
  );
}
