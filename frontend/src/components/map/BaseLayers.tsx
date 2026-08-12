import { LayersControl, TileLayer } from "react-leaflet";
import type { ControlPosition } from "leaflet";

const { BaseLayer } = LayersControl;

type DefaultLayer = "satellite" | "relief" | "streets";

interface BaseLayersControlProps {
  defaultLayer?: DefaultLayer;
  position?: ControlPosition;
}

export function BaseLayersControl({
  defaultLayer = "satellite",
  position = "topleft",
}: BaseLayersControlProps) {
  return (
    <LayersControl position={position} collapsed={false}>
      <BaseLayer checked={defaultLayer === "satellite"} name="Satélite">
        <TileLayer
          attribution='Tiles &copy; Esri &mdash; Source: Esri, Maxar, Earthstar Geographics, and the GIS User Community'
          url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
          maxZoom={19}
        />
      </BaseLayer>
      <BaseLayer checked={defaultLayer === "relief"} name="Relieve (topográfico)">
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="https://opentopomap.org">OpenTopoMap</a> (CC-BY-SA)'
          url="https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png"
          maxZoom={17}
        />
      </BaseLayer>
      <BaseLayer checked={defaultLayer === "streets"} name="Mapa (calles)">
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
      </BaseLayer>
    </LayersControl>
  );
}
