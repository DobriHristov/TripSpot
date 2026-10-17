import { useEffect, useRef } from "react";
import type { Map as LeafletMap } from "leaflet";
import { MapSearch } from "./MapSearch";
import type { Place } from "../..//types";
import { categoryLabel } from "../../utils/constants";
import { formatRating, pluralize, truncate } from "../../utils/format";
import { FALLBACK_IMAGE, placeImages } from "../../utils/images";
import "leaflet/dist/leaflet.css";
import "./PlacesMap.css";

interface PlacesMapProps {
  places: Place[];
  height?: number;
  onSelect?: (id: string) => void;
}

export default function PlacesMap({
  places,
  height = 420,
  onSelect,
}: PlacesMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<LeafletMap | null>(null);
  const onSelectRef = useRef(onSelect);

  useEffect(() => {
    onSelectRef.current = onSelect;
  }, [onSelect]);

  useEffect(() => {
    let cancelled = false;
    import("leaflet").then((L) => {
      if (cancelled || !containerRef.current) return;
      const map = L.map(containerRef.current, {
        scrollWheelZoom: false,
      }).setView([42.7, 25.3], 6);
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "&copy; OpenStreetMap",
        maxZoom: 18,
      }).addTo(map);
      mapRef.current = map;
      map.fire("tripspot:ready");
    });
    return () => {
      cancelled = true;
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, []);

  // update: redraw markers whenever the places change
  useEffect(() => {
    let layer: import("leaflet").LayerGroup | null = null;
    let disposed = false;

    const draw = async () => {
      const L = await import("leaflet");
      const map = mapRef.current;
      if (disposed || !map) return;
      const icon = L.divIcon({
        className: "map-pin",
        html: "<span></span>",
        iconSize: [26, 26],
        iconAnchor: [13, 26],
        popupAnchor: [0, -24],
      });
      layer = L.layerGroup().addTo(map);
      const valid = places.filter(
        (p) => Number.isFinite(p.lat) && Number.isFinite(p.lng),
      );
      valid.forEach((p) => {
        const html = document.createElement("div");
        html.className = "map-popup";
        html.innerHTML = `
          <div class="map-popup-media"><img class="map-popup-img" alt="" /></div>
          <div class="map-popup-body">
            <strong></strong>
            <div class="map-popup-meta">
              <span class="map-popup-chip"></span>
              <small></small>
            </div>
            <div class="map-popup-stats"></div>
            <p class="map-popup-desc"></p>
            <button type="button">Детайли →</button>
          </div>`;
        const img = html.querySelector("img")!;
        const imgs = placeImages(p);
        let idx = 0;
        img.src = imgs[0]!;
        img.alt = p.title;
        img.addEventListener("error", () => (img.src = FALLBACK_IMAGE));
        if (imgs.length > 1) {
          const media = html.querySelector(".map-popup-media")!;
          const counter = document.createElement("span");
          counter.className = "map-popup-count";
          const show = (d: number) => {
            idx = (idx + d + imgs.length) % imgs.length;
            img.src = imgs[idx]!;
            counter.textContent = `${idx + 1}/${imgs.length}`;
          };
          (["‹", "›"] as const).forEach((label, k) => {
            const b = document.createElement("button");
            b.type = "button";
            b.className = `map-popup-nav ${k ? "next" : "prev"}`;
            b.textContent = label;
            b.setAttribute(
              "aria-label",
              k ? "Следваща снимка" : "Предишна снимка",
            );
            b.addEventListener("click", (e) => {
              e.stopPropagation();
              show(k ? 1 : -1);
            });
            media.appendChild(b);
          });
          media.appendChild(counter);
          show(0);
        }
        html.querySelector("strong")!.textContent = p.title;
        html.querySelector(".map-popup-chip")!.textContent = categoryLabel(
          p.category,
        );
        html.querySelector(".map-popup-meta small")!.textContent = p.location;
        html.querySelector(".map-popup-stats")!.textContent =
          `★ ${formatRating(p.rating)} · ${pluralize(p.reviewsCount, "ревю", "ревюта")} · ♥ ${p.likes.length}`;
        html.querySelector(".map-popup-desc")!.textContent = truncate(
          p.description,
          90,
        );
        html
          .querySelector(".map-popup-body button")!
          .addEventListener("click", () => onSelectRef.current?.(p.id));
        L.marker([p.lat, p.lng], { icon, title: p.title })
          .bindPopup(html)
          .addTo(layer!);
      });
      if (valid.length === 1) map.setView([valid[0]!.lat, valid[0]!.lng], 11);
      else if (valid.length > 1)
        map.fitBounds(
          L.latLngBounds(valid.map((p) => [p.lat, p.lng] as [number, number])),
          { padding: [40, 40], maxZoom: 10 },
        );
    };

    if (mapRef.current) draw();
    else {
      const t = setInterval(() => {
        if (mapRef.current) {
          clearInterval(t);
          draw();
        }
      }, 50);
      return () => {
        disposed = true;
        clearInterval(t);
        layer?.remove();
      };
    }
    return () => {
      disposed = true;
      layer?.remove();
    };
  }, [places]);

  return (
    <div className="relative">
      <div
        ref={containerRef}
        className="places-map"
        style={{ height }}
        aria-label="Карта с места"
      />
      {height >= 320 && (
        <MapSearch
          onSelect={(r) => mapRef.current?.setView([r.lat, r.lng], 12)}
        />
      )}
    </div>
  );
}
