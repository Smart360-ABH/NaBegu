import { useEffect, useRef, useCallback } from "react";
import { MapPin } from "lucide-react";

const YANDEX_MAPS_KEY = import.meta.env.VITE_YANDEX_MAPS_KEY ?? "";

declare global {
  interface Window {
    ymaps: any;
    _ymapsReady: boolean;
    _ymapsCallbacks: Array<() => void>;
  }
}

function loadYmaps(): Promise<void> {
  return new Promise((resolve) => {
    if (window.ymaps && window._ymapsReady) {
      resolve();
      return;
    }
    if (!window._ymapsCallbacks) window._ymapsCallbacks = [];
    window._ymapsCallbacks.push(resolve);

    if (document.getElementById("ymaps-script")) return;

    const apiKey = YANDEX_MAPS_KEY ? `&apikey=${YANDEX_MAPS_KEY}` : "";
    const script = document.createElement("script");
    script.id = "ymaps-script";
    script.src = `https://api-maps.yandex.ru/2.1/?lang=ru_RU${apiKey}`;
    script.onload = () => {
      window.ymaps.ready(() => {
        window._ymapsReady = true;
        window._ymapsCallbacks.forEach((cb) => cb());
        window._ymapsCallbacks = [];
      });
    };
    document.head.appendChild(script);
  });
}

interface YandexMapProps {
  onAddressSelect: (address: string) => void;
  selectedAddress?: string;
}

// Сухум, Абхазия
const SUKHUM_CENTER: [number, number] = [43.0016, 41.0234];

export function YandexMap({ onAddressSelect, selectedAddress }: YandexMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const placemarkRef = useRef<any>(null);

  const handleMapClick = useCallback(
    async (e: any) => {
      const coords: [number, number] = e.get("coords");
      try {
        const res = await window.ymaps.geocode(coords, { results: 1 });
        const obj = res.geoObjects.get(0);
        if (obj) {
          const addr = obj.getAddressLine();
          onAddressSelect(addr);
          if (placemarkRef.current) {
            mapRef.current.geoObjects.remove(placemarkRef.current);
          }
          const pm = new window.ymaps.Placemark(
            coords,
            { balloonContent: addr, iconCaption: addr },
            { preset: "islands#redDotIconWithCaption", draggable: true }
          );
          pm.events.add("dragend", async () => {
            const newCoords = pm.geometry.getCoordinates();
            const r2 = await window.ymaps.geocode(newCoords, { results: 1 });
            const o2 = r2.geoObjects.get(0);
            if (o2) onAddressSelect(o2.getAddressLine());
          });
          mapRef.current.geoObjects.add(pm);
          placemarkRef.current = pm;
        }
      } catch {
        onAddressSelect(`${coords[0].toFixed(5)}, ${coords[1].toFixed(5)}`);
      }
    },
    [onAddressSelect]
  );

  useEffect(() => {
    let cancelled = false;
    loadYmaps().then(() => {
      if (cancelled || !containerRef.current || mapRef.current) return;
      const map = new window.ymaps.Map(containerRef.current, {
        center: SUKHUM_CENTER,
        zoom: 13,
        controls: ["zoomControl", "geolocationControl", "searchControl"],
      });
      mapRef.current = map;
      map.events.add("click", handleMapClick);
    });
    return () => {
      cancelled = true;
      if (mapRef.current) {
        mapRef.current.destroy();
        mapRef.current = null;
        placemarkRef.current = null;
      }
    };
  }, [handleMapClick]);

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
        <MapPin className="w-3.5 h-3.5 text-primary" />
        <span>Нажмите на карту, чтобы указать точку доставки</span>
      </div>
      <div
        ref={containerRef}
        className="w-full rounded-2xl overflow-hidden border"
        style={{ height: 280 }}
      />
      {selectedAddress && (
        <p className="text-sm text-green-700 bg-green-50 border border-green-200 rounded-xl px-3 py-2">
          📍 {selectedAddress}
        </p>
      )}
    </div>
  );
}
