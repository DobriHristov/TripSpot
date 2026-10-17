import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { toast } from "sonner";
import { favoritesApi } from "../services/api";
import { getErrorMessage } from "../utils/errors";
import { useAuth } from "./AuthContext";

interface FavoritesContextValue {
  isFavorite(placeId: string): boolean;
  toggle(placeId: string): Promise<void>;
  pendingId: string | null;
}

const FavoritesContext = createContext<FavoritesContextValue | null>(null);

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [ids, setIds] = useState<Set<string>>(new Set());
  const [pendingId, setPendingId] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIds(new Set());
      return;
    }
    let cancelled = false;
    favoritesApi
      .ids()
      .then((list) => !cancelled && setIds(new Set(list)))
      .catch(() => !cancelled && setIds(new Set()));

    return () => {
      cancelled = true;
    };
  }, [user]);

  const toggle = useCallback(
    async (placeId: string) => {
      const was = ids.has(placeId);
      setPendingId(placeId);

      try {
        if (was) {
          await favoritesApi.remove(placeId);
        } else {
          await favoritesApi.add(placeId);
        }

        setIds((prev) => {
          const next = new Set(prev);
          if (was) {
            next.delete(placeId);
          } else {
            next.add(placeId);
          }

          return next;
        });

        toast.success(was ? "Премахнато от любими" : "Добавено в любими");
      } catch (e) {
        toast.error(getErrorMessage(e));
      } finally {
        setPendingId(null);
      }
    },
    [ids],
  );

  const value = useMemo(
    () => ({ isFavorite: (id: string) => ids.has(id), toggle, pendingId }),
    [ids, toggle, pendingId],
  );
  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useFavorites() {
  const ctx = useContext(FavoritesContext);
  if (!ctx)
    throw new Error("useFavorites must be used inside <FavoritesProvider>");
  return ctx;
}
