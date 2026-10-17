import { lazy, Suspense, type ComponentProps } from "react";

const LocationPickerMap = lazy(() => import("./LocationPickerMap"));

export function LazyLocationPicker(
  props: ComponentProps<typeof LocationPickerMap>,
) {
  const fallback = (
    <div
      className="animate-pulse rounded-xl bg-muted"
      style={{ height: props.height ?? 300 }}
    />
  );

  return (
    <Suspense fallback={fallback}>
      <LocationPickerMap {...props} />
    </Suspense>
  );
}
