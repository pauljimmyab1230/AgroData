import { Locate, MapPin } from "lucide-react";

interface ParcelaMapProps {
  lat?: string;
  lng?: string;
  label?: string;
  showPin?: boolean;
  className?: string;
}

export default function ParcelaMap({
  lat,
  lng,
  label,
  showPin = true,
  className = "h-64",
}: ParcelaMapProps) {
  return (
    <div className={`relative overflow-hidden rounded-xl border border-gray-200 bg-slate-50 ${className}`}>
      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 800 400"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden
      >
        <defs>
          <pattern id="parcela-grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#e2e8f0" strokeWidth="1" />
          </pattern>
        </defs>

        <rect width="800" height="400" fill="url(#parcela-grid)" />

        <path
          d="M 80 60 L 260 40 L 300 150 L 140 170 Z"
          fill="#dcfce7"
          stroke="#16a34a"
          strokeOpacity="0.5"
        />
        <path
          d="M 420 90 L 620 70 L 660 200 L 450 220 Z"
          fill="#e9f7d9"
          stroke="#65a30d"
          strokeOpacity="0.4"
        />
        <path
          d="M 380 240 L 520 230 L 540 300 L 400 310 Z"
          fill="#fef9c3"
          stroke="#f59e0b"
          strokeOpacity="0.4"
        />

        <path
          d="M -10 300 C 150 260 300 340 470 300 S 700 260 810 300"
          fill="none"
          stroke="#93c5fd"
          strokeWidth="8"
          strokeLinecap="round"
          opacity="0.6"
        />
        <path
          d="M 100 -10 C 180 120 160 240 230 410"
          fill="none"
          stroke="#fbbf24"
          strokeWidth="10"
          strokeLinecap="round"
          opacity="0.7"
        />
      </svg>

      {showPin && (
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="relative flex flex-col items-center">
            <MapPin className="h-8 w-8 text-forest-700 drop-shadow-md" />
            <div className="mt-0.5 flex items-center gap-1 rounded-full bg-white/90 px-2.5 py-0.5 text-xs font-semibold text-[#111827] shadow-sm ring-1 ring-gray-200">
              <Locate className="h-3 w-3 text-forest-600" />
              {label || (lat && lng ? `${lat}, ${lng}` : "Ubicación")}
            </div>
          </div>
        </div>
      )}

      <div className="absolute bottom-2 left-2 rounded-md bg-white/80 px-2 py-1 text-[10px] font-medium text-gray-500 ring-1 ring-gray-200">
        Vista previa del mapa (mock)
      </div>
    </div>
  );
}
