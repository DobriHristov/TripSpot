import { useEffect, useRef } from "react";
import type { Map as LeafletMap, Marker } from "leaflet";
import { MapSearch } from "./MapSearch";
import { MapZoom } from "./MapZoom";
import "leaflet/dist/leaflet.css";
import "./PlacesMap.css";

interface LocationPickerMapProps {
  lat: number;
  lng: number;
  onPick: (lat: number, lng: number) => void;
  height?: number;
}

export default function LocationPickerMap({
  lat,
  lng,
  onPick,
  height = 300,
}: LocationPickerMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<LeafletMap | null>(null);
  const markerRef = useRef<Marker | null>(null);
  const onPickRef = useRef(onPick);

  useEffect(() => {
    onPickRef.current = onPick;
  }, [onPick]);

  useEffect(() => {
    let cancelled = false;
    import("leaflet").then((L) => {
      if (cancelled || !containerRef.current) return;
      const map = L.map(containerRef.current, {
        scrollWheelZoom: true,
        zoomControl: false,
        attributionControl: false,
      }).setView([lat, lng], 7);
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 18,
      }).addTo(map);

      const icon = L.divIcon({
        className: "map-pin",
        html: "<span></span>",
        iconSize: [26, 26],
        iconAnchor: [13, 26],
      });
      const marker = L.marker([lat, lng], { icon, draggable: true }).addTo(map);
      marker.on("dragend", () => {
        const pos = marker.getLatLng();
        onPickRef.current(
          Number(pos.lat.toFixed(6)),
          Number(pos.lng.toFixed(6)),
        );
      });
      map.on("click", (e: { latlng: { lat: number; lng: number } }) => {
        marker.setLatLng(e.latlng);
        onPickRef.current(
          Number(e.latlng.lat.toFixed(6)),
          Number(e.latlng.lng.toFixed(6)),
        );
      });

      mapRef.current = map;
      markerRef.current = marker;
    });
    return () => {
      cancelled = true;
      mapRef.current?.remove();
      mapRef.current = null;
      markerRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const marker = markerRef.current;
    if (!marker || !Number.isFinite(lat) || !Number.isFinite(lng)) return;
    const pos = marker.getLatLng();
    if (Math.abs(pos.lat - lat) > 1e-6 || Math.abs(pos.lng - lng) > 1e-6) {
      marker.setLatLng([lat, lng]);
      mapRef.current?.panTo([lat, lng]);
    }
  }, [lat, lng]);

  return (
    <div className="relative">
      <div
        ref={containerRef}
        className="places-map rounded-xl border"
        style={{ height }}
        aria-label="Карта за избор на местоположение"
      />
      <MapSearch
        placeholder="Търси град, връх, адрес…"
        onSelect={(r) => {
          const lat = Number(r.lat.toFixed(6));
          const lng = Number(r.lng.toFixed(6));
          markerRef.current?.setLatLng([lat, lng]);
          mapRef.current?.setView([lat, lng], 13);
          onPickRef.current(lat, lng);
        }}
      />
      <MapZoom mapRef={mapRef} />
    </div>
  );
}
