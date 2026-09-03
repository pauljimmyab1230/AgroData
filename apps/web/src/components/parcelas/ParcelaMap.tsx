import { useState, useEffect } from "react";
import * as L from "leaflet";
import { MapContainer, Marker, Popup, TileLayer, useMapEvents } from "react-leaflet";
import { Crosshair, Loader2 } from "lucide-react";
import "leaflet/dist/leaflet.css";
import { BaseLayersControl } from "../map/BaseLayers";
import { ZoomControl } from "../map/ZoomControl";
import type { LatLngTuple } from "leaflet";

interface ParcelaMapProps {
  lat?: string;
  lng?: string;
  label?: string;
  showPin?: boolean;
  editable?: boolean;
  className?: string;
  onLocate?: (lat: number, lng: number, altitud?: number) => void;
}

const DEFAULT_CENTER: LatLngTuple = [-13.62, -73.87];

const markerIcon = L.divIcon({
  className: "",
  html: '<svg width="32" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 2C7.6 2 4 5.6 4 10c0 5.5 8 12 8 12s8-6.5 8-12c0-4.4-3.6-8-8-8z" fill="#0A4174" stroke="#ffffff" stroke-width="1.5"/><circle cx="12" cy="10" r="3" fill="#ffffff"/></svg>',
  iconSize: [32, 40],
  iconAnchor: [16, 38],
  popupAnchor: [0, -36],
});

function toNumber(value?: string): number | null {
  if (!value) return null;
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}

function latLngToUtm(lat: number, lng: number): { este: string; norte: string; zona: string } {
  const zone = Math.floor((lng + 180) / 6) + 1;
  const letter = lat >= -80 && lat < -72 ? 'C' : lat >= -72 && lat < -64 ? 'D' : lat >= -64 && lat < -56 ? 'E' :
    lat >= -56 && lat < -48 ? 'F' : lat >= -48 && lat < -40 ? 'G' : lat >= -40 && lat < -32 ? 'H' :
    lat >= -32 && lat < -24 ? 'J' : lat >= -24 && lat < -16 ? 'K' : lat >= -16 && lat < -8 ? 'L' :
    lat >= -8 && lat < 0 ? 'M' : lat >= 0 && lat < 8 ? 'N' : lat >= 8 && lat < 16 ? 'P' :
    lat >= 16 && lat < 24 ? 'Q' : lat >= 24 && lat < 32 ? 'R' : lat >= 32 && lat < 40 ? 'S' :
    lat >= 40 && lat < 48 ? 'T' : lat >= 48 && lat < 56 ? 'U' : lat >= 56 && lat < 64 ? 'V' :
    lat >= 64 && lat < 72 ? 'W' : 'X';

  const a = 6378137;
  const f = 1 / 298.257223563;
  const k0 = 0.9996;
  const e = Math.sqrt(2 * f - f * f);
  const e2 = e * e;
  const ep2 = e2 / (1 - e2);

  const dLng = (lng - (zone * 6 - 183)) * Math.PI / 180;
  const latRad = lat * Math.PI / 180;

  const N = a / Math.sqrt(1 - e2 * Math.sin(latRad) ** 2);
  const T = Math.tan(latRad) ** 2;
  const C = ep2 * Math.cos(latRad) ** 2;
  const A = Math.cos(latRad) * dLng;

  const M = a * (
    (1 - e2 / 4 - 3 * e2 ** 2 / 64 - 5 * e2 ** 3 / 256) * latRad -
    (3 * e2 / 8 + 3 * e2 ** 2 / 32 + 45 * e2 ** 3 / 1024) * Math.sin(2 * latRad) +
    (15 * e2 ** 2 / 256 + 45 * e2 ** 3 / 1024) * Math.sin(4 * latRad) -
    (35 * e2 ** 3 / 3072) * Math.sin(6 * latRad)
  );

  let easting = k0 * N * (A + (1 - T + C) * A ** 3 / 6 + (5 - 18 * T + T ** 2 + 72 * C - 58 * ep2) * A ** 5 / 120) + 500000;
  let northing = k0 * (M + N * Math.tan(latRad) * (A ** 2 / 2 + (5 - T + 9 * C + 4 * C ** 2) * A ** 4 / 24 + (61 - 58 * T + T ** 2 + 600 * C - 330 * ep2) * A ** 6 / 720));

  if (lat < 0) northing += 10000000;

  return {
    este: Math.round(easting).toString(),
    norte: Math.round(northing).toString(),
    zona: `${zone}${letter}`,
  };
}

function MapUpdater({ center }: { center: LatLngTuple }) {
  const map = useMapEvents({});
  useEffect(() => {
    map.setView(center, map.getZoom());
  }, [center, map]);
  return null;
}

function MapClickHandler({ onClick }: { onClick?: (lat: number, lng: number) => void }) {
  useMapEvents({
    click(e) {
      if (onClick) {
        onClick(e.latlng.lat, e.latlng.lng);
      }
    },
  });
  return null;
}

async function fetchElevation(lat: number, lng: number): Promise<number | null> {
  try {
    const res = await fetch(
      `https://api.open-meteo.com/v1/elevation?latitude=${lat}&longitude=${lng}`
    );
    const data = await res.json();
    if (data.elevation && data.elevation.length > 0) {
      return Math.round(data.elevation[0]);
    }
  } catch {
    // ignore
  }
  return null;
}

const tileLayers: Record<string, { url: string; attribution: string; maxZoom?: number }> = {
  satellite: {
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    attribution: 'Tiles &copy; Esri &mdash; Source: Esri, Maxar, Earthstar Geographics',
    maxZoom: 19,
  },
  relief: {
    url: "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png",
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="https://opentopomap.org">OpenTopoMap</a>',
    maxZoom: 17,
  },
  streets: {
    url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  },
};

export default function ParcelaMap({
  lat,
  lng,
  label,
  showPin = true,
  editable = true,
  className = "h-64",
  onLocate,
}: ParcelaMapProps) {
  const latitude = toNumber(lat);
  const longitude = toNumber(lng);
  const hasPin = showPin && latitude !== null && longitude !== null;
  const [center, setCenter] = useState<LatLngTuple>(DEFAULT_CENTER);
  const [activeLayer, setActiveLayer] = useState<"satellite" | "relief" | "streets">("satellite");
  const [locating, setLocating] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (hasPin && latitude !== null && longitude !== null) {
      setCenter([latitude, longitude]);
    }
  }, [latitude, longitude, hasPin]);

  const handleLocate = () => {
    if (!navigator.geolocation) {
      setError("El navegador no soporta geolocalización");
      return;
    }
    setLocating(true);
    setError("");
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        const alt = pos.coords.altitude;
        setCenter([lat, lng]);
        let altitud = alt != null ? Math.round(alt) : null;
        if (altitud === null) {
          altitud = await fetchElevation(lat, lng);
        }
        setLocating(false);
        onLocate?.(lat, lng, altitud ?? undefined);
      },
      () => {
        setLocating(false);
        setError("No se pudo obtener la ubicación. Verifica los permisos de ubicación.");
      },
      { enableHighAccuracy: true, timeout: 15000 },
    );
  };

  const handleMapClick = async (lat: number, lng: number) => {
    if (!editable) return;
    setCenter([lat, lng]);
    const altitud = await fetchElevation(lat, lng);
    onLocate?.(lat, lng, altitud ?? undefined);
  };

  const currentTile = tileLayers[activeLayer];

  return (
    <div className={`relative overflow-hidden rounded-xl border border-gray-200 bg-slate-50 ${className}`}>
      <MapContainer center={center} zoom={hasPin ? 16 : 12} zoomControl={false} className="z-0 h-full w-full" scrollWheelZoom={false}>
        <TileLayer
          key={activeLayer}
          url={currentTile.url}
          attribution={currentTile.attribution}
          maxZoom={currentTile.maxZoom}
        />
        <MapUpdater center={center} />
        <MapClickHandler onClick={editable ? handleMapClick : undefined} />
        <ZoomControl position="topleft" />
        {hasPin && (
          <Marker position={[latitude, longitude]} icon={markerIcon}>
            <Popup>{label || (lat && lng ? `${lat}, ${lng}` : "Ubicación de la parcela")}</Popup>
          </Marker>
        )}
      </MapContainer>

      <BaseLayersControl activeLayer={activeLayer} onLayerChange={setActiveLayer} position="bottomright" />

      {onLocate && (
        <button
          type="button"
          onClick={handleLocate}
          disabled={locating}
          className="absolute right-3 top-3 z-[1000] flex items-center gap-1.5 rounded-lg bg-white px-3 py-2 text-xs font-semibold text-[#111827] shadow-sm ring-1 ring-gray-200 hover:bg-gray-50 disabled:opacity-60"
        >
          {locating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Crosshair className="h-4 w-4 text-[#0A4174]" />}
          {locating ? "Obteniendo..." : "Obtener Ubicación"}
        </button>
      )}

      {error && (
        <div className="absolute bottom-2 left-2 right-2 z-[1000] rounded-lg bg-red-50 px-3 py-2 text-xs font-medium text-red-600 ring-1 ring-red-200">
          {error}
        </div>
      )}
    </div>
  );
}

export { latLngToUtm };
