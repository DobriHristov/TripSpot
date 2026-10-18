import type { ChangeEvent } from "react";
import { Search } from "lucide-react";
import { Input } from "../../components/ui/input";
import { cn } from "../../lib/utils";
import type { Category } from "../../types";
import { CATEGORIES } from "../../utils/constants";

interface PlaceFiltersProps {
  search: string;
  category: Category | "";
  onSearchChange: (value: string) => void;
  onCategoryChange: (value: Category | "") => void;
}

export function PlaceFilters({
  search,
  category,
  onSearchChange,
  onCategoryChange,
}: PlaceFiltersProps) {
  const chip = (active: boolean) =>
    cn(
      "rounded-full border px-4 py-1.5 text-sm font-medium transition-colors",
      active
        ? "bg-secondary text-secondary-foreground"
        : "bg-card hover:bg-secondary",
    );

  return (
    <div className="flex flex-col gap-4">
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={search}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            onSearchChange(e.target.value)
          }
          placeholder="Търси място, град, описание…"
          className="h-11 rounded-full bg-card pl-9"
          aria-label="Търсене"
        />
      </div>
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          className={chip(category === "")}
          onClick={() => onCategoryChange("")}
        >
          Всички
        </button>
        {CATEGORIES.map((c) => (
          <button
            key={c.value}
            type="button"
            className={chip(category === c.value)}
            onClick={() => onCategoryChange(c.value)}
          >
            {c.emoji} {c.label}
          </button>
        ))}
      </div>
    </div>
  );
}
