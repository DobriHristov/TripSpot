import { Star } from "lucide-react";
import { cn } from "../../lib/utils";

interface RatingStarsProps {
  value: number;
  onChange?: (value: number) => void;
  size?: "sm" | "md";
}

export function RatingStars({
  value,
  onChange,
  size = "sm",
}: RatingStarsProps) {
  const cls = size === "sm" ? "h-4 w-4" : "h-6 w-6";

  return (
    <div
      className="flex items-center gap-0.5"
      role={onChange ? "radiogroup" : "img"}
      aria-label={`Оценка ${value} от 5`}
    >
      {[1, 2, 3, 4, 5].map((n) => {
        const star = (
          <Star
            className={cn(
              cls,
              n <= Math.round(value) ? "fill-star text-star" : "text-border",
            )}
          />
        );
        return onChange ? (
          <button
            key={n}
            type="button"
            role="radio"
            aria-checked={n === value}
            aria-label={`${n} звезди`}
            onClick={() => onChange(n)}
            className="transition-transform hover:scale-110"
          >
            {star}
          </button>
        ) : (
          <span key={n}>{star}</span>
        );
      })}
    </div>
  );
}
