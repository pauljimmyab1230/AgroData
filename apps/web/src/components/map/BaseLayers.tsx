import { useState } from "react";
import { Layers, ChevronDown } from "lucide-react";

type DefaultLayer = "satellite" | "relief" | "streets";

interface BaseLayersControlProps {
  defaultLayer?: DefaultLayer;
  activeLayer?: DefaultLayer;
  onLayerChange?: (layer: DefaultLayer) => void;
  position?: "topleft" | "topright" | "bottomleft" | "bottomright";
}

const layers: { id: DefaultLayer; name: string }[] = [
  { id: "satellite", name: "Satélite" },
  { id: "relief", name: "Relieve" },
  { id: "streets", name: "Calles" },
];

export function BaseLayersControl({
  defaultLayer = "satellite",
  activeLayer,
  onLayerChange,
  position = "bottomleft",
}: BaseLayersControlProps) {
  const [isOpen, setIsOpen] = useState(false);
  const current = activeLayer || defaultLayer;
  const currentName = layers.find((l) => l.id === current)?.name || "Satélite";

  const positionClasses: Record<string, string> = {
    topleft: "top-3 left-3",
    topright: "top-3 right-3",
    bottomleft: "bottom-3 left-3",
    bottomright: "bottom-3 right-3",
  };

  return (
    <div className={`absolute ${positionClasses[position]} z-[1000]`}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 rounded-lg bg-white px-3 py-2 text-xs font-semibold text-[#111827] shadow-sm ring-1 ring-gray-200 hover:bg-gray-50"
      >
        <Layers className="h-4 w-4 text-[#0A4174]" />
        <span>{currentName}</span>
        <ChevronDown className={`h-3 w-3 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <div className="absolute bottom-full left-0 mb-2 w-40 overflow-hidden rounded-xl bg-white shadow-lg ring-1 ring-gray-200">
          {layers.map((layer) => (
            <button
              key={layer.id}
              type="button"
              onClick={() => {
                onLayerChange?.(layer.id);
                setIsOpen(false);
              }}
              className={`flex w-full items-center gap-2 px-3 py-2.5 text-xs font-medium transition-colors ${
                current === layer.id
                  ? "bg-[#0A4174]/10 text-[#0A4174]"
                  : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              <span
                className={`h-2 w-2 rounded-full ${
                  current === layer.id ? "bg-[#0A4174]" : "bg-gray-300"
                }`}
              />
              {layer.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
