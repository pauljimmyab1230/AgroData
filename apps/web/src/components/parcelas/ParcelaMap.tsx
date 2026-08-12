import { useState } from "react";
import * as L from "leaflet";
import { MapContainer, Marker, Popup } from "react-leaflet";
import { Crosshair, Loader2 } from "lucide-react";
import "leaflet/dist/leaflet.css";
import { BaseLayersControl } from "../map/BaseLayers";
import type { LatLngTuple } from "leaflet";

interface ParcelaMapProps {
  lat?: string;
  lng?: string;
  label?: string;
  showPin?: boolean;
  className?: string;
  onLocate?: (lat: number, lng: number) => void;
}

const DEFAULT_CENTER: LatLngTuple = [-13.62, -73.87];

const markerIcon = L.divIcon({
  className: "",
  html: '<svg width="32" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 2C7.6 2 4 5.6 4 10c0 5.5 8 12 8 12s8-6.5 8-12c0-4.4-3.6-8-8-8z" fill="#166534" stroke="#ffffff" stroke-width="1.5"/><circle cx="12" cy="10" r="3" fill="#ffffff"/></svg>',
  iconSize: [32, 40],
  iconAnchor: [16, 38],
  popupAnchor: [0, -36],
});

function toNumber(value?: string): number | null {
  if (!value) return null;
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}

export default function ParcelaMap({
  lat,
  lng,
  label,
  showPin = true,
  className = "h-64",
  onLocate,
}: ParcelaMapProps) {
  const latitude = toNumber(lat);
  const longitude = toNumber(lng);
  const hasPin = showPin && latitude !== null && longitude !== null;
  const center: LatLngTuple = hasPin ? [latitude, longitude] : DEFAULT_CENTER;
  const [locating, setLocating] = useState(false);
  const [error, setError] = useState("");

  const handleLocate = () => {
    if (!navigator.geolocation) {
      setError("El navegador no soporta geolocalización");
      return;
    }
    setLocating(true);
    setError("");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocating(false);
        onLocate?.(pos.coords.latitude, pos.coords.longitude);
      },
      () => {
        setLocating(false);
        setError("No se pudo obtener la ubicación. Verifica los permisos de ubicación.");
      },
      { enableHighAccuracy: true, timeout: 15000 },
    );
  };

  return (
    <div className={`relative overflow-hidden rounded-xl border border-gray-200 bg-slate-50 ${className}`}>
      <MapContainer center={center} zoom={16} className="z-0 h-full w-full" scrollWheelZoom={false}>
        <BaseLayersControl />
        {hasPin && (
          <Marker position={[latitude, longitude]} icon={markerIcon}>
            <Popup>{label || (lat && lng ? `${lat}, ${lng}` : "Ubicación de la parcela")}</Popup>
          </Marker>
        )}
      </MapContainer>

      {onLocate && (
        <button
          type="button"
          onClick={handleLocate}
          disabled={locating}
          className="absolute right-3 top-3 z-[1000] flex items-center gap-1.5 rounded-lg bg-white px-3 py-2 text-xs font-semibold text-[#111827] shadow-sm ring-1 ring-gray-200 hover:bg-gray-50 disabled:opacity-60"
        >
          {locating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Crosshair className="h-4 w-4 text-forest-600" />}
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
