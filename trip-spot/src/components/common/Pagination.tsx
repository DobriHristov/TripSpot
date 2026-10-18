import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "../../lib/utils";
import { getPageNumbers } from "../../utils/pagination";

interface PaginationProps {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
}

export function Pagination({ page, totalPages, onChange }: PaginationProps) {
  if (totalPages <= 1) {
    return null;
  }

  const btn =
    "grid h-10 min-w-10 place-items-center rounded-full border px-3 text-sm font-medium transition-colors disabled:pointer-events-none disabled:opacity-40";

  return (
    <nav
      className="mt-10 flex items-center justify-center gap-2"
      aria-label="Страници"
    >
      <button
        type="button"
        className={cn(btn, "bg-card hover:bg-secondary")}
        disabled={page <= 1}
        onClick={() => onChange(page - 1)}
        aria-label="Предишна"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>
      {getPageNumbers(page, totalPages).map((n, i) =>
        n === "…" ? (
          <span key={`gap-${i}`} className="px-1 text-muted-foreground">
            …
          </span>
        ) : (
          <button
            key={n}
            type="button"
            onClick={() => onChange(n)}
            aria-current={n === page ? "page" : undefined}
            className={cn(
              btn,
              n === page
                ? "border-primary bg-primary text-primary-foreground"
                : "bg-card hover:bg-secondary",
            )}
          >
            {n}
          </button>
        ),
      )}
      <button
        type="button"
        className={cn(btn, "bg-card hover:bg-secondary")}
        disabled={page >= totalPages}
        onClick={() => onChange(page + 1)}
        aria-label="Следваща"
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </nav>
  );
}
