import { Trash2 } from "lucide-react";
import { ConfirmButton } from "../../components/common/ConfirmButton";
import { RatingStars } from "../../components/common/RatingStars";
import { Button } from "../../components/ui/button";
import { useAuth } from "../../context/AuthContext";
import type { Review } from "../../types";
import { formatDate } from "../../utils/format";
import { isOwner } from "../../utils/permissions";

export function ReviewItem({
  review,
  onDelete,
}: {
  review: Review;
  onDelete: (id: string) => void;
}) {
  const { user } = useAuth();

  return (
    <li className="rounded-2xl border bg-card p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="grid h-9 w-9 place-items-center rounded-full bg-secondary font-semibold text-secondary-foreground">
            {review.authorName.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="font-medium">{review.authorName}</p>
            <p className="text-xs text-muted-foreground">
              {formatDate(review.createdAt)}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <RatingStars value={review.rating} />
          {isOwner(user, review) && (
            <ConfirmButton
              title="Изтриване на ревю"
              description="Сигурен ли си? Действието е необратимо."
              onConfirm={() => onDelete(review.id)}
              trigger={
                <Button variant="ghost" size="icon" aria-label="Изтрий ревю">
                  <Trash2 className="h-4 w-4" />
                </Button>
              }
            />
          )}
        </div>
      </div>
      <p className="mt-3 text-sm leading-relaxed">{review.text}</p>
    </li>
  );
}

export function ReviewList({
  reviews,
  onDelete,
}: {
  reviews: Review[];
  onDelete: (id: string) => void;
}) {
  if (!reviews.length)
    return (
      <p className="text-sm text-muted-foreground">
        Все още няма ревюта. Бъди първият!
      </p>
    );

  return (
    <ul className="space-y-3">
      {reviews.map((r) => (
        <ReviewItem key={r.id} review={r} onDelete={onDelete} />
      ))}
    </ul>
  );
}
