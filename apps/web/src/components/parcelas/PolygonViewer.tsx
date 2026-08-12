import { useEffect, useRef, useState } from "react";
import * as L from "leaflet";
import { MapContainer, useMap } from "react-leaflet";
import { MapPin } from "lucide-react";
import "leaflet/dist/leaflet.css";
import "leaflet-draw";
import "leaflet-draw/dist/leaflet.draw.css";
import { BaseLayersControl } from "../map/BaseLayers";
import type { LatLngTuple } from "leaflet";

type Coord = [number, number];

interface PolygonViewerProps {
  poligono?: Coord[] | null;
  area?: string;
  vertices?: number;
  readOnly?: boolean;
  onChanged?: (poly: Coord[] | null) => void;
  center?: LatLngTuple;
  className?: string;
}

const DEFAULT_CENTER: LatLngTuple = [-13.62, -73.87];

function polygonRing(layer: L.Polygon): L.LatLng[] {
  const raw = layer.getLatLngs() as L.LatLng[] | L.LatLng[][];
  const first = raw[0];
  return Array.isArray(first) && (first[0] as L.LatLng)?.lat !== undefined
    ? (first as L.LatLng[])
    : (raw as L.LatLng[]);
}

function ringToCoords(ring: L.LatLng[]): Coord[] {
  return ring.map((p) => [p.lat, p.lng] as Coord);
}

function DrawLayer({
  readOnly,
  poligono,
  onChanged,
}: {
  readOnly: boolean;
  poligono?: Coord[] | null;
  onChanged?: (poly: Coord[] | null) => void;
}) {
  const map = useMap();
  const onChangedRef = useRef(onChanged);
  const [initialPoligono] = useState(() => poligono);

  useEffect(() => {
    onChangedRef.current = onChanged;
  });

  useEffect(() => {
    const group = new L.FeatureGroup();
    map.addLayer(group);

    if (initialPoligono && initialPoligono.length >= 3) {
      L.polygon(initialPoligono, { color: "#15803d", weight: 3 }).addTo(group);
    }

    if (readOnly) {
      return () => {
        map.removeLayer(group);
      };
    }

    const control = new L.Control.Draw({
      draw: {
        polygon: {
          allowIntersection: true,
          showArea: true,
          shapeOptions: { color: "#15803d", weight: 3 },
        },
        polyline: false,
        rectangle: false,
        circle: false,
        marker: false,
        circlemarker: false,
      },
      edit: { featureGroup: group },
    });
    map.addControl(control);

    const handleCreated = (e: L.LeafletEvent) => {
      const layer = (e as L.DrawEvents.Created).layer as L.Polygon;
      const toRemove: L.Layer[] = [];
      group.eachLayer((l) => {
        if (l instanceof L.Polygon) toRemove.push(l);
      });
      toRemove.forEach((l) => group.removeLayer(l));
      group.addLayer(layer);
      onChangedRef.current?.(ringToCoords(polygonRing(layer)));
    };
    const handleEdited = (e: L.LeafletEvent) => {
      const coords: Coord[] = [];
      (e as L.DrawEvents.Edited).layers.eachLayer((layer) => {
        coords.push(...ringToCoords(polygonRing(layer as L.Polygon)));
      });
      onChangedRef.current?.(coords);
    };
    const handleDeleted = () => {
      onChangedRef.current?.(null);
    };

    map.on(L.Draw.Event.CREATED, handleCreated);
    map.on(L.Draw.Event.EDITED, handleEdited);
    map.on(L.Draw.Event.DELETED, handleDeleted);

    return () => {
      map.removeControl(control);
      map.off(L.Draw.Event.CREATED, handleCreated);
      map.off(L.Draw.Event.EDITED, handleEdited);
      map.off(L.Draw.Event.DELETED, handleDeleted);
      map.removeLayer(group);
    };
  }, [map, readOnly, initialPoligono]);

  return null;
}

export default function PolygonViewer({
  poligono,
  area,
  vertices,
  readOnly = false,
  onChanged,
  center,
  className = "h-[26rem]",
}: PolygonViewerProps) {
  const hasPoly = !!poligono && poligono.length >= 3;
  const mapCenter: LatLngTuple = center ?? (hasPoly ? (poligono![0] as LatLngTuple) : DEFAULT_CENTER);

  return (
    <div className={`relative overflow-hidden rounded-xl border border-gray-200 bg-slate-50 ${className}`}>
      <MapContainer center={mapCenter} zoom={17} className="z-0 h-full w-full" scrollWheelZoom={false}>
        <BaseLayersControl position="topright" />
        <DrawLayer readOnly={readOnly} poligono={poligono} onChanged={onChanged} />
      </MapContainer>

      <div className="absolute bottom-3 right-3 z-[1000] flex items-center gap-3 rounded-xl bg-white/95 px-3.5 py-2.5 shadow-sm ring-1 ring-gray-200">
        <span className="flex items-center gap-1.5 text-xs font-medium text-gray-600">
          <MapPin className="h-3.5 w-3.5 text-forest-600" />
          Área dibujada
        </span>
        <span className="text-sm font-bold text-[#111827]">{area || "—"}</span>
        <span className="h-4 w-px bg-gray-200" />
        <span className="text-xs font-medium text-gray-500">{vertices ?? 0} vértices</span>
      </div>
    </div>
  );
}
