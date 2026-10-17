import { Link } from "react-router-dom";
import { Heart, MapPin, Star } from "lucide-react";
import type { Place } from "../../types";
import { categoryLabel } from "../../utils/constants";
import { formatRating } from "../../utils/format";
import { FALLBACK_IMAGE, resolveImage } from "../../utils/images";
import "./PlaceCard.css";

export function PlaceCard({ place }: { place: Place }) {
  return (
    <Link to={`/places/${place.id}`} className="place-card animate-rise">
      <div className="place-card__media">
        <img
          src={resolveImage(place.imageUrl)}
          alt={place.title}
          loading="lazy"
          width={1024}
          height={768}
          onError={(e) => {
            e.currentTarget.src = FALLBACK_IMAGE;
          }}
        />

        <span className="place-card__badge">
          {categoryLabel(place.category)}
        </span>
      </div>

      <div className="place-card__body">
        <h3 className="place-card__title">{place.title}</h3>

        <p className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
          <MapPin className="h-3.5 w-3.5" />
          {place.location}
        </p>

        <div className="place-card__meta">
          <span>от {place.authorName}</span>

          <span className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <Star className="h-3.5 w-3.5 fill-star text-star" />
              {formatRating(place.rating)}
            </span>

            <span className="flex items-center gap-1">
              <Heart className="h-3.5 w-3.5" />
              {place.likes.length}
            </span>
          </span>
        </div>
      </div>
    </Link>
  );
}

export function PlaceGrid({ places }: { places: Place[] }) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {places.map((place) => (
        <PlaceCard key={place.id} place={place} />
      ))}
    </div>
  );
}
