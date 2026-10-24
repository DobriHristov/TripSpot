import type { Map as LeafletMap } from "leaflet";
import { Minus, Plus } from "lucide-react";

export function MapZoom({
  mapRef,
}: {
  mapRef: React.RefObject<LeafletMap | null>;
}) {
  return (
    <div className="map-zoom" role="group" aria-label="Управление на мащаба">
      <button
        type="button"
        aria-label="Приближи"
        onClick={() => mapRef.current?.zoomIn()}
      >
        <Plus className="h-4 w-4" />
      </button>
      <div className="map-zoom__divider" />
      <button
        type="button"
        aria-label="Отдали"
        onClick={() => mapRef.current?.zoomOut()}
      >
        <Minus className="h-4 w-4" />
      </button>
    </div>
  );
}
