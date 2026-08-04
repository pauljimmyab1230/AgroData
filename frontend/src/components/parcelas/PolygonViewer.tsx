import { MapPin } from "lucide-react";

interface PolygonViewerProps {
  area?: string;
  vertices?: number;
  className?: string;
}

const polygonPoints = [
  { x: 230, y: 130 },
  { x: 420, y: 105 },
  { x: 470, y: 240 },
  { x: 340, y: 290 },
  { x: 210, y: 230 },
];

export default function PolygonViewer({ area, vertices = polygonPoints.length, className = "h-[26rem]" }: PolygonViewerProps) {
  const points = polygonPoints.map((p) => `${p.x},${p.y}`).join(" ");

  return (
    <div className={`relative overflow-hidden rounded-xl border border-gray-200 bg-slate-50 ${className}`}>
      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 800 400"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden
      >
        <defs>
          <pattern id="polygon-grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#e2e8f0" strokeWidth="1" />
          </pattern>
        </defs>

        <rect width="800" height="400" fill="url(#polygon-grid)" />

        <path
          d="M 120 70 L 560 50 L 610 330 L 90 350 Z"
          fill="#dcfce7"
          stroke="#16a34a"
          strokeOpacity="0.35"
        />

        <polygon points={points} fill="#16a34a" fillOpacity="0.18" stroke="#15803d" strokeWidth="2" strokeDasharray="8 6" strokeLinejoin="round" />

        {polygonPoints.map((p, i) => (
          <g key={i}>
            <circle cx={p.x} cy={p.y} r="7" fill="white" stroke="#15803d" strokeWidth="2.5" />
            <text x={p.x} y={p.y - 12} textAnchor="middle" fontSize="12" fontWeight="700" fill="#15803d">
              V{i + 1}
            </text>
          </g>
        ))}

        <path
          d="M 640 30 C 720 120 700 240 760 380"
          fill="none"
          stroke="#fbbf24"
          strokeWidth="10"
          strokeLinecap="round"
          opacity="0.6"
        />
      </svg>

      <div className="absolute bottom-3 right-3 flex items-center gap-3 rounded-xl bg-white/95 px-3.5 py-2.5 shadow-sm ring-1 ring-gray-200">
        <span className="flex items-center gap-1.5 text-xs font-medium text-gray-600">
          <MapPin className="h-3.5 w-3.5 text-forest-600" />
          Área dibujada
        </span>
        <span className="text-sm font-bold text-[#111827]">{area || "2.40 ha"}</span>
        <span className="h-4 w-px bg-gray-200" />
        <span className="text-xs font-medium text-gray-500">{vertices} vértices</span>
      </div>
    </div>
  );
}
