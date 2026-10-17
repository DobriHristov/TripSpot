import { useEffect, useState } from "react";
import { Loader2, Search } from "lucide-react";
import { useDebounce } from "../../hooks/useDebounce";

export interface GeoResult {
  lat: number;
  lng: number;
  label: string;
}

async function geocode(q: string, signal: AbortSignal): Promise<GeoResult[]> {
  const url = `https://nominatim.openstreetmap.org/search?format=json&limit=5&accept-language=bg&q=${encodeURIComponent(q)}`;

  const res = await fetch(url, { signal });
  if (!res.ok) return [];

  const data = (await res.json()) as {
    lat: string;
    lon: string;
    display_name: string;
  }[];

  return data.map((d) => ({
    lat: Number(d.lat),
    lng: Number(d.lon),
    label: d.display_name,
  }));
}

export function MapSearch({
  onSelect,
  placeholder = "Търси място на картата…",
}: {
  onSelect: (r: GeoResult) => void;
  placeholder?: string;
}) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<GeoResult[]>([]);
  const [completedQuery, setCompletedQuery] = useState("");
  const [open, setOpen] = useState(false);
  const debounced = useDebounce(query, 400);
  const normalizedQuery = debounced.trim();
  const isQueryValid = normalizedQuery.length >= 3;
  const loading = isQueryValid && completedQuery !== normalizedQuery;

  useEffect(() => {
    const q = debounced.trim();

    if (q.length < 3) return;

    const ctrl = new AbortController();

    geocode(q, ctrl.signal)
      .then((data) => {
        if (ctrl.signal.aborted) return;

        setResults(data);
        setCompletedQuery(q);
        setOpen(true);
      })
      .catch(() => {
        if (ctrl.signal.aborted) return;

        setResults([]);
        setCompletedQuery(q);
        setOpen(true);
      });

    return () => ctrl.abort();
  }, [debounced]);

  const pick = (result: GeoResult) => {
    onSelect(result);
    setQuery(result.label.split(",")[0] ?? result.label);
    setOpen(false);
  };

  return (
    <div
      className="absolute left-14 right-3 top-3 z-[1000] sm:right-auto sm:w-80"
      onClick={(e) => e.stopPropagation()}
      onDoubleClick={(e) => e.stopPropagation()}
    >
      <div className="flex items-center gap-2 rounded-full border bg-card/95 px-3 shadow-soft backdrop-blur">
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
        ) : (
          <Search className="h-4 w-4 text-muted-foreground" />
        )}

        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => {
            if (results.length > 0) setOpen(true);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              if (results[0]) pick(results[0]);
            }

            if (e.key === "Escape") {
              setOpen(false);
            }
          }}
          placeholder={placeholder}
          aria-label="Търсене на място"
          className="h-10 w-full bg-transparent text-sm outline-none"
        />
      </div>

      {open && isQueryValid && results.length > 0 && (
        <ul className="mt-2 max-h-64 overflow-auto rounded-2xl border bg-card p-1 shadow-soft">
          {results.map((result) => (
            <li key={`${result.lat},${result.lng}`}>
              <button
                type="button"
                onClick={() => pick(result)}
                className="w-full rounded-xl px-3 py-2 text-left text-sm hover:bg-muted"
              >
                {result.label}
              </button>
            </li>
          ))}
        </ul>
      )}

      {open && !loading && isQueryValid && results.length === 0 && (
        <p className="mt-2 rounded-2xl border bg-card px-3 py-2 text-sm text-muted-foreground shadow-soft">
          Няма намерени резултати.
        </p>
      )}
    </div>
  );
}
