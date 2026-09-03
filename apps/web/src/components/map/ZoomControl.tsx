import { Plus, Minus } from "lucide-react";
import { useMap } from "react-leaflet";

interface ZoomControlProps {
  position?: "topleft" | "topright" | "bottomleft" | "bottomright";
}

export function ZoomControl({ position = "topleft" }: ZoomControlProps) {
  const map = useMap();

  const positionClasses: Record<string, string> = {
    topleft: "top-3 left-3",
    topright: "top-3 right-3",
    bottomleft: "bottom-3 left-3",
    bottomright: "bottom-3 right-3",
  };

  return (
    <div className={`absolute ${positionClasses[position]} z-[1000] flex flex-col gap-1`}>
      <button
        type="button"
        onClick={() => map.zoomIn()}
        className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-[#111827] shadow-sm ring-1 ring-gray-200 transition-colors hover:bg-gray-50"
        aria-label="Acercar"
      >
        <Plus className="h-4 w-4" />
      </button>
      <button
        type="button"
        onClick={() => map.zoomOut()}
        className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-[#111827] shadow-sm ring-1 ring-gray-200 transition-colors hover:bg-gray-50"
        aria-label="Alejar"
      >
        <Minus className="h-4 w-4" />
      </button>
    </div>
  );
}
