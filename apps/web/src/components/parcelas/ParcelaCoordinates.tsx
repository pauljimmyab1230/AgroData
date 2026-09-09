import { useState, useEffect } from "react";
import { Crosshair, AlertTriangle } from "lucide-react";
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

function validateLat(value: string): string | null {
  if (!value) return null;
  const n = Number(value);
  if (!Number.isFinite(n)) return "Debe ser un número";
  if (n < -90 || n > 90) return "Rango: -90 a 90";
  return null;
}

function validateLng(value: string): string | null {
  if (!value) return null;
  const n = Number(value);
  if (!Number.isFinite(n)) return "Debe ser un número";
  if (n < -180 || n > 180) return "Rango: -180 a 180";
  return null;
}

function CoordField({
  label,
  value,
  placeholder,
  suffix,
  onChange,
  disabled,
  error,
}: {
  label: string;
  value: string;
  placeholder: string;
  suffix: string;
  onChange?: (val: string) => void;
  disabled: boolean;
  error?: string | null;
}) {
  return (
    <div>
      <label className="mb-1 block text-xs font-medium text-gray-500">{label}</label>
      <div className="relative">
        <Input
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={onChange ? (e) => onChange(e.target.value) : undefined}
          disabled={disabled}
          className={`pr-14 ${error ? "border-red-300 focus:border-red-500 focus:ring-red-500/20" : ""}`}
        />
        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-gray-400">
          {suffix}
        </span>
      </div>
      {error && (
        <p className="mt-1 flex items-center gap-1 text-xs text-red-500">
          <AlertTriangle className="h-3 w-3" />
          {error}
        </p>
      )}
    </div>
  );
}

export function ParcelaCoordinates({
  mode,
  latitud,
  longitud,
  precisionGps,
  altitud,
  utmEste,
  utmNorte,
  utmZona,
  onChange,
}: ParcelaCoordinatesProps) {
  const editable = mode !== "view";
  const [latError, setLatError] = useState<string | null>(null);
  const [lngError, setLngError] = useState<string | null>(null);

  useEffect(() => {
    setLatError(validateLat(latitud ?? ""));
    setLngError(validateLng(longitud ?? ""));
  }, [latitud, longitud]);

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
        <CoordField
          label="Latitud"
          value={latitud ?? ""}
          placeholder="Ej. -13.6532"
          suffix="S"
          onChange={editable && onChange ? (val) => onChange("latitud", val) : undefined}
          disabled={!editable}
          error={editable ? latError : null}
        />

        <CoordField
          label="Longitud"
          value={longitud ?? ""}
          placeholder="Ej. -73.8741"
          suffix="W"
          onChange={editable && onChange ? (val) => onChange("longitud", val) : undefined}
          disabled={!editable}
          error={editable ? lngError : null}
        />

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
