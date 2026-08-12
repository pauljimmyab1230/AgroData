import { useEffect } from "react";
import { Hexagon, Ruler, User, Spline } from "lucide-react";
import { polygon } from "@turf/helpers";
import turfArea from "@turf/area";
import turfLength from "@turf/length";
import { DatePicker, Input } from "../ui";
import { CardHeader, CardShell, Field, type FormMode } from "../shared/formControls";
import { useParcelaForm } from "../../contexts/ParcelaFormContext";
import PolygonViewer from "./PolygonViewer";
import type { Parcela } from "../../services/parcelas";
import type { LatLngTuple } from "leaflet";

type PoligonoCardProps = {
  mode: FormMode;
  values?: Partial<Parcela>;
};

function measurePolygon(coords: [number, number][]) {
  const ring = [...coords, coords[0]];
  const geom = polygon([ring]);
  const areaHa = turfArea(geom) / 10000;
  const perimeterM = turfLength(geom, { units: "meters" });
  return { areaHa, perimeterM };
}

export function PoligonoCard({ mode, values }: PoligonoCardProps) {
  const editable = mode !== "view";
  const { data, updateData } = useParcelaForm();

  const str = (val: unknown): string => (typeof val === "string" ? val : "");
  const display = (field: keyof Parcela) => {
    if (mode === "view") return str(values?.[field]);
    return str(data?.[field]);
  };

  const fechaValue = mode === "view" ? values?.fechaLevantamiento : data?.fechaLevantamiento;
  const fechaLevantamiento = fechaValue ? new Date(String(fechaValue).slice(0, 10) + "T00:00:00") : null;

  const verticesValue =
    mode === "view" ? values?.vertices : data?.vertices !== undefined && data?.vertices !== null ? data.vertices : undefined;
  const areaCalculada = display("areaCalculada") || display("area");
  const responsable = display("responsable");
  const fechaLabel = String(fechaValue ?? "");
  const poligono = mode === "view" ? values?.poligono : (data?.poligono ?? null);

  const latNum = Number(display("latitud"));
  const lngNum = Number(display("longitud"));
  const center: LatLngTuple | undefined =
    Number.isFinite(latNum) && Number.isFinite(lngNum) && (latNum !== 0 || lngNum !== 0)
      ? [latNum, lngNum]
      : undefined;

  useEffect(() => {
    if (mode === "view") return;
    if (!poligono || poligono.length < 3) {
      updateData({ areaCalculada: "", perimetro: "", vertices: null });
      return;
    }
    const { areaHa, perimeterM } = measurePolygon(poligono);
    updateData({
      areaCalculada: `${areaHa.toFixed(2)} ha`,
      perimetro: `${perimeterM.toFixed(0)} m`,
      vertices: poligono.length,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [poligono, mode]);

  const handleChanged = (poly: [number, number][] | null) => {
    updateData({ poligono: poly });
  };

  return (
    <CardShell>
      <CardHeader
        icon={<Hexagon size={20} />}
        title="Polígono de la Parcela"
        description="Delimitación georreferenciada del área de la parcela"
      />

      <PolygonViewer
        poligono={poligono}
        area={areaCalculada || undefined}
        vertices={verticesValue ?? undefined}
        readOnly={!editable}
        onChanged={editable ? handleChanged : undefined}
        center={center}
      />

      {editable && (
        <div className="mt-3 flex items-center gap-2 rounded-xl bg-forest-50 px-4 py-3 text-xs text-forest-700 ring-1 ring-forest-100">
          <Spline className="h-4 w-4 shrink-0" />
          Usa la barra de herramientas del mapa para dibujar el polígono: toca el mapa para añadir cada vértice y
          toca el primer punto para cerrarlo. Luego puedes mover vértices o borrarlo. El área y el perímetro se
          calculan automáticamente.
        </div>
      )}

      <div className="mt-6 rounded-2xl border border-gray-200 bg-gray-50/50 p-5">
        <div className="mb-4 flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-forest-600/10 text-forest-600">
            <Ruler size={14} />
          </span>
          <h4 className="text-sm font-semibold text-[#111827]">Resumen del Polígono</h4>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
          <Field label="Área calculada" mode={mode} value={values?.areaCalculada}>
            <div className="relative">
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-forest-600">
                <Ruler className="h-4 w-4" />
              </span>
              <Input
                type="text"
                placeholder="Se calcula al dibujar el polígono"
                value={display("areaCalculada")}
                disabled
                className="pl-10 bg-white"
              />
            </div>
          </Field>

          <Field label="Perímetro" mode={mode} value={values?.perimetro}>
            <Input
              type="text"
              placeholder="Se calcula al dibujar el polígono"
              value={display("perimetro")}
              disabled
              className="bg-white"
            />
          </Field>

          <Field
            label="Número de vértices"
            mode={mode}
            value={verticesValue !== undefined ? String(verticesValue) : undefined}
          >
            <Input
              type="number"
              placeholder="—"
              value={verticesValue !== undefined ? String(verticesValue) : ""}
              disabled
              className="bg-white"
            />
          </Field>

          <Field label="Fecha de levantamiento" mode={mode} value={fechaLabel}>
            <DatePicker
              selected={fechaLevantamiento}
              onChange={(d) => updateData({ fechaLevantamiento: d ? d.toISOString().split("T")[0] : "" })}
              disabled={!editable}
            />
          </Field>

          <Field label="Responsable" mode={mode} value={values?.responsable}>
            <div className="relative">
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <User className="h-4 w-4" />
              </span>
              <Input
                type="text"
                placeholder="Ej. Ing. Carmen Poma"
                value={responsable}
                onChange={(e) => updateData({ responsable: e.target.value })}
                disabled={!editable}
                className="pl-10"
              />
            </div>
          </Field>
        </div>

        <div className="mt-4 flex items-center gap-2 rounded-xl bg-white px-4 py-3 text-xs text-gray-500 ring-1 ring-gray-200">
          <Spline className="h-4 w-4 text-forest-600" />
          Polígono con {verticesValue ?? 0} vértices · levantamiento {fechaLabel || "—"} por {responsable || "—"}
        </div>
      </div>
    </CardShell>
  );
}
