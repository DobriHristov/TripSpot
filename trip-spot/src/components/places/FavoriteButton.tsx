import type { MouseEvent } from "react";
import { Bookmark } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useFavorites } from "../../context/FavoritesContext";
import { cn } from "../../lib/utils";

export function FavoriteButton({
  placeId,
  className,
}: {
  placeId: string;
  className?: string;
}) {
  const { isAuthenticated } = useAuth();
  const { isFavorite, toggle, pendingId } = useFavorites();

  if (!isAuthenticated) return null;

  const active = isFavorite(placeId);

  const onClick = (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggle(placeId);
  };

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={pendingId === placeId}
      aria-pressed={active}
      aria-label={active ? "Премахни от любими" : "Добави в любими"}
      className={cn(
        "grid h-9 w-9 place-items-center rounded-full bg-card/90 shadow-soft transition hover:scale-105 disabled:opacity-60",
        className,
      )}
    >
      <Bookmark
        className={cn(
          "h-4 w-4",
          active ? "fill-accent text-accent" : "text-foreground",
        )}
      />
    </button>
  );
}
