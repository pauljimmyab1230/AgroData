import { Crosshair } from "lucide-react";
import { Input } from "../ui";
import { Field, type FormMode } from "../shared/formControls";

interface ParcelaCoordinatesProps {
  mode: FormMode;
  latitud?: string;
  longitud?: string;
  precisionGps?: string;
  altitud?: string;
  utmEste?: string;
  utmNorte?: string;
  utmZona?: string;
  onChange?: (field: "latitud" | "longitud" | "precisionGps" | "altitud" | "utmEste" | "utmNorte" | "utmZona", value: string) => void;
}

export function ParcelaCoordinates({ mode, latitud, longitud, precisionGps, altitud, utmEste, utmNorte, utmZona, onChange }: ParcelaCoordinatesProps) {
  const editable = mode !== "view";

  return (
    <div>
      <div className="mb-4 flex items-center gap-2">
        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#0A4174]/10 text-[#0A4174]">
          <Crosshair size={14} />
        </span>
        <h4 className="text-sm font-semibold text-[#111827]">Coordenadas Geográficas</h4>
        <span className="ml-auto rounded-full bg-gray-100 px-2.5 py-0.5 text-[11px] font-medium text-gray-500">
          WGS84 · UTM 18S
        </span>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <Field label="Latitud" mode={mode} value={latitud}>
          <div className="relative">
            <Input
              type="text"
              placeholder="Ej. -13.6532"
              value={editable ? latitud ?? "" : undefined}
              onChange={editable && onChange ? (e) => onChange("latitud", e.target.value) : undefined}
              disabled={!editable}
              className="pr-14"
            />
            <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-gray-400">
              S
            </span>
          </div>
        </Field>

        <Field label="Longitud" mode={mode} value={longitud}>
          <div className="relative">
            <Input
              type="text"
              placeholder="Ej. -73.8741"
              value={editable ? longitud ?? "" : undefined}
              onChange={editable && onChange ? (e) => onChange("longitud", e.target.value) : undefined}
              disabled={!editable}
              className="pr-14"
            />
            <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-gray-400">
              W
            </span>
          </div>
        </Field>

        <Field label="Precisión GPS" mode={mode} value={precisionGps}>
          <Input
            type="text"
            placeholder="Ej. ± 3 m"
            value={editable ? precisionGps ?? "" : undefined}
            onChange={editable && onChange ? (e) => onChange("precisionGps", e.target.value) : undefined}
            disabled={!editable}
          />
        </Field>

        <Field label="Altitud" mode={mode} value={altitud}>
          <Input
            type="text"
            placeholder="Ej. 3,450 m.s.n.m."
            value={editable ? altitud ?? "" : undefined}
            onChange={editable && onChange ? (e) => onChange("altitud", e.target.value) : undefined}
            disabled={!editable}
          />
        </Field>
      </div>

      <div className="mt-6 mb-2 flex items-center gap-2">
        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#0A4174]/10 text-[#0A4174]">
          <Crosshair size={14} />
        </span>
        <h4 className="text-sm font-semibold text-[#111827]">Georreferenciación UTM</h4>
      </div>

      <div className="grid gap-6 sm:grid-cols-3">
        <Field label="Este (X)" mode={mode} value={utmEste}>
          <Input
            type="text"
            placeholder="Ej. 215,432"
            value={editable ? utmEste ?? "" : undefined}
            onChange={editable && onChange ? (e) => onChange("utmEste", e.target.value) : undefined}
            disabled={!editable}
          />
        </Field>

        <Field label="Norte (Y)" mode={mode} value={utmNorte}>
          <Input
            type="text"
            placeholder="Ej. 8,487,654"
            value={editable ? utmNorte ?? "" : undefined}
            onChange={editable && onChange ? (e) => onChange("utmNorte", e.target.value) : undefined}
            disabled={!editable}
          />
        </Field>

        <Field label="Zona UTM" mode={mode} value={utmZona}>
          <Input
            type="text"
            placeholder="Ej. 18S"
            value={editable ? utmZona ?? "" : undefined}
            onChange={editable && onChange ? (e) => onChange("utmZona", e.target.value) : undefined}
            disabled={!editable}
          />
        </Field>
      </div>
    </div>
  );
}
