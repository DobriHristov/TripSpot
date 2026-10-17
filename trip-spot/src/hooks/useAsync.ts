import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type DependencyList,
} from "react";
import { getErrorMessage } from "../utils/errors";

interface AsyncState<T> {
  data: T | undefined;
  error: string | null;
  isLoading: boolean;
}

export function useAsync<T>(fn: () => Promise<T>, deps: DependencyList) {
  const [state, setState] = useState<AsyncState<T>>({
    data: undefined,
    error: null,
    isLoading: true,
  });
  const requestId = useRef(0);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const run = useCallback(fn, deps);

  const execute = useCallback(async () => {
    const id = ++requestId.current;
    setState((s) => ({ ...s, isLoading: true, error: null }));
    try {
      const data = await run();
      if (id === requestId.current)
        setState({ data, error: null, isLoading: false });
    } catch (e) {
      if (id === requestId.current)
        setState((s) => ({
          ...s,
          error: getErrorMessage(e),
          isLoading: false,
        }));
    }
  }, [run]);

  useEffect(() => {
    execute();
    return () => {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      requestId.current++;
    };
  }, [execute]);

  const setData = useCallback(
    (updater: (prev: T | undefined) => T) =>
      setState((s) => ({ ...s, data: updater(s.data) })),
    [],
  );

  return { ...state, reload: execute, setData };
}
