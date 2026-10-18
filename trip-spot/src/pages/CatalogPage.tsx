import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { LayoutGrid, Map as MapIcon } from "lucide-react";
import { PageHeader } from "../components/common/PageHeader";
import { Pagination } from "../components/common/Pagination";
import {
  EmptyState,
  ErrorState,
  Loader,
} from "../components/common/StatusViews";
import { LazyPlacesMap } from "../components/map/LazyPlacesMap";
import { PlaceGrid } from "../components/places/PlaceCard";
import { PlaceFilters } from "../components/places/PlaceFilters";
import { useAsync } from "../hooks/useAsync";
import { useDebounce } from "../hooks/useDebounce";
import { cn } from "../lib/utils";
import { placesApi } from "../services/api";
import type { Category } from "../types";
import { isCategory } from "../utils/constants";
import { pluralize } from "../utils/format";
import { PAGE_SIZE } from "../utils/pagination";

type CatalogView = "grid" | "map";

export default function CatalogPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const search = searchParams.get("search") ?? "";
  const rawCategory = searchParams.get("category");
  const category: Category | undefined =
    rawCategory && isCategory(rawCategory) ? rawCategory : undefined;

  const rawPage = Number(searchParams.get("page") ?? "1");
  const page = Number.isInteger(rawPage) && rawPage > 0 ? rawPage : 1;

  const view: CatalogView = searchParams.get("view") === "map" ? "map" : "grid";

  const [term, setTerm] = useState(search);
  const [lastSearch, setLastSearch] = useState(search);

  if (search !== lastSearch) {
    setLastSearch(search);
    setTerm(search);
  }

  const debounced = useDebounce(term);

  useEffect(() => {
    if (debounced === search) return;

    const nextParams = new URLSearchParams(searchParams);

    if (debounced.trim()) {
      nextParams.set("search", debounced);
    } else {
      nextParams.delete("search");
    }

    nextParams.delete("page");

    setSearchParams(nextParams, { replace: true });
  }, [debounced, search, searchParams, setSearchParams]);

  const isMap = view === "map";

  const paged = useAsync(
    () =>
      isMap
        ? Promise.resolve(null)
        : placesApi.search({
            search,
            category,
            page,
            limit: PAGE_SIZE,
          }),
    [search, category, page, isMap],
  );

  const all = useAsync(
    () =>
      isMap ? placesApi.list({ search, category }) : Promise.resolve(null),
    [search, category, isMap],
  );

  const state = isMap ? all : paged;
  const total = isMap ? all.data?.length : paged.data?.total;

  const updateSearchParams = (updates: Record<string, string | undefined>) => {
    const nextParams = new URLSearchParams(searchParams);

    Object.entries(updates).forEach(([key, value]) => {
      if (value) {
        nextParams.set(key, value);
      } else {
        nextParams.delete(key);
      }
    });

    setSearchParams(nextParams);
  };

  const goToPage = (nextPage: number) => {
    updateSearchParams({
      page: nextPage > 1 ? String(nextPage) : undefined,
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const tab = (active: boolean) =>
    cn(
      "flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors",
      active ? "bg-secondary text-secondary-foreground" : "hover:bg-secondary",
    );

  return (
    <div className="container-page py-12">
      <PageHeader
        eyebrow="Каталог"
        title="Всички места"
        subtitle="Филтрирай по категория, потърси дестинация или ги виж на картата."
        actions={
          <div className="flex rounded-full border bg-card p-1">
            <button
              type="button"
              className={tab(!isMap)}
              onClick={() => updateSearchParams({ view: undefined })}
            >
              <LayoutGrid className="h-4 w-4" />
              Списък
            </button>

            <button
              type="button"
              className={tab(isMap)}
              onClick={() =>
                updateSearchParams({
                  view: "map",
                  page: undefined,
                })
              }
            >
              <MapIcon className="h-4 w-4" />
              Карта
            </button>
          </div>
        }
      />

      <div className="my-8">
        <PlaceFilters
          search={term}
          category={category ?? ""}
          onSearchChange={setTerm}
          onCategoryChange={(value) =>
            updateSearchParams({
              category: value || undefined,
              page: undefined,
            })
          }
        />
      </div>

      {state.isLoading ? (
        <Loader />
      ) : state.error ? (
        <ErrorState message={state.error} onRetry={state.reload} />
      ) : !total ? (
        <EmptyState
          title="Няма намерени места"
          text="Опитай с друга дума или категория."
        />
      ) : (
        <>
          <p className="mb-4 text-sm text-muted-foreground">
            {pluralize(total, "място", "места")}
            {!isMap &&
              paged.data &&
              paged.data.totalPages > 1 &&
              ` · страница ${paged.data.page} от ${paged.data.totalPages}`}
          </p>

          {isMap ? (
            <LazyPlacesMap
              places={all.data ?? []}
              height={560}
              onSelect={(id) => navigate(`/places/${encodeURIComponent(id)}`)}
            />
          ) : (
            <>
              <PlaceGrid places={paged.data?.items ?? []} />

              <Pagination
                page={paged.data?.page ?? 1}
                totalPages={paged.data?.totalPages ?? 1}
                onChange={goToPage}
              />
            </>
          )}
        </>
      )}
    </div>
  );
}
