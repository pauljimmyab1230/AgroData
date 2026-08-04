import { useState } from "react";
import { Crosshair, MapPinned, Mountain, Radar } from "lucide-react";
import { Button, Input } from "../ui";
import { CardHeader, CardShell, Field, type FormMode } from "../shared/formControls";
import ParcelaMap from "../parcelas/ParcelaMap";
import type { ActividadFormData } from "../../pages/actividades/actividadMock";

type MapaCardProps = {
  mode: FormMode;
  value: ActividadFormData;
  onChange?: (patch: Partial<ActividadFormData>) => void;
};

const ubicacionSimulada = {
  latitud: "-13.6532",
  longitud: "-73.8741",
  altitud: "3,450 m.s.n.m.",
  precisionGps: "± 3 m",
};

export function MapaCard({ mode, value, onChange }: MapaCardProps) {
  const editable = mode !== "view";
  const [obteniendo, setObteniendo] = useState(false);

  const handleObtenerUbicacion = () => {
    setObteniendo(true);
    window.setTimeout(() => {
      onChange?.(ubicacionSimulada);
      setObteniendo(false);
    }, 1200);
  };

  return (
    <CardShell>
      <CardHeader
        icon={<MapPinned size={20} />}
        title="Georreferencia"
        description="Coordenadas geográficas, altitud y precisión de la ubicación"
      />

      <div className="grid gap-6 sm:grid-cols-2">
        <Field label="Latitud" mode={mode} value={value.latitud}>
          <Input
            type="text"
            placeholder="Ej. -13.6532"
            value={value.latitud}
            onChange={(e) => onChange?.({ latitud: e.target.value })}
          />
        </Field>

        <Field label="Longitud" mode={mode} value={value.longitud}>
          <Input
            type="text"
            placeholder="Ej. -73.8741"
            value={value.longitud}
            onChange={(e) => onChange?.({ longitud: e.target.value })}
          />
        </Field>

        <Field label="Altitud" mode={mode} value={value.altitud}>
          <div className="relative">
            <Input
              type="text"
              placeholder="Ej. 3,450 m.s.n.m."
              value={value.altitud}
              onChange={(e) => onChange?.({ altitud: e.target.value })}
              className="pr-11"
            />
            <Mountain className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          </div>
        </Field>

        <Field label="Precisión GPS" mode={mode} value={value.precisionGps}>
          <div className="relative">
            <Input
              type="text"
              placeholder="Ej. ± 3 m"
              value={value.precisionGps}
              onChange={(e) => onChange?.({ precisionGps: e.target.value })}
              className="pr-11"
            />
            <Radar className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          </div>
        </Field>
      </div>

      <div className="mt-8">
        <ParcelaMap
          lat={value.latitud}
          lng={value.longitud}
          label={value.parcela || "Ubicación"}
          className="h-80"
        />

        {editable && (
          <Button
            variant="secondary"
            className="mt-4"
            onClick={handleObtenerUbicacion}
            loading={obteniendo}
            iconLeft={<Crosshair className="h-4 w-4" />}
          >
            {obteniendo ? "Obteniendo ubicación..." : "Obtener Ubicación"}
          </Button>
        )}
      </div>
    </CardShell>
  );
}
