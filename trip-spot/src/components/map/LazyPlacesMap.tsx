import { lazy, Suspense, type ComponentProps } from "react";

const PlacesMap = lazy(() => import("./PlacesMap"));

export function LazyPlacesMap(props: ComponentProps<typeof PlacesMap>) {
  const fallback = (
    <div
      className="animate-pulse rounded-2xl bg-muted"
      style={{ height: props.height ?? 420 }}
    />
  );

  return (
    <Suspense fallback={fallback}>
      <PlacesMap {...props} />
    </Suspense>
  );
}
