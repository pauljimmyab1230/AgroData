import { useState } from "react";
import { Eraser, Hexagon, PenLine, Ruler, User, Spline } from "lucide-react";
import { Button, DatePicker, Input } from "../ui";
import { CardHeader, CardShell, Field, type FormMode } from "../shared/formControls";
import PolygonViewer from "./PolygonViewer";
import type { Parcela } from "../../pages/parcelas/parcelaMock";

const parseDate = (s?: string) => (s ? new Date(s + "T00:00:00") : null);

type PoligonoCardProps = {
  mode: FormMode;
  values?: Partial<Parcela>;
};

export function PoligonoCard({ mode, values }: PoligonoCardProps) {
  const readOnly = mode === "view";

  const [fechaLevantamiento, setFechaLevantamiento] = useState<Date | null>(parseDate(values?.fechaLevantamiento));

  return (
    <CardShell>
      <CardHeader
        icon={<Hexagon size={20} />}
        title="Polígono de la Parcela"
        description="Delimitación georreferenciada del área de la parcela"
      />

      <PolygonViewer area={values?.areaCalculada || values?.areaTotal} vertices={values?.vertices} />

      {!readOnly && (
        <div className="mt-4 flex flex-wrap gap-3">
          <Button iconLeft={<PenLine className="h-4 w-4" />}>Dibujar Polígono</Button>
          <Button variant="secondary" iconLeft={<PenLine className="h-4 w-4" />}>
            Editar Polígono
          </Button>
          <Button variant="ghost" iconLeft={<Eraser className="h-4 w-4" />}>
            Limpiar
          </Button>
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
                placeholder="Ej. 2.40 ha"
                defaultValue={mode !== "view" ? values?.areaCalculada : undefined}
                className="pl-10"
              />
            </div>
          </Field>

          <Field label="Perímetro" mode={mode} value={values?.perimetro}>
            <Input
              type="text"
              placeholder="Ej. 720 m"
              defaultValue={mode !== "view" ? values?.perimetro : undefined}
            />
          </Field>

          <Field
            label="Número de vértices"
            mode={mode}
            value={values?.vertices !== undefined ? String(values.vertices) : undefined}
          >
            <Input
              type="number"
              placeholder="Ej. 5"
              defaultValue={mode !== "view" && values?.vertices !== undefined ? values.vertices : undefined}
            />
          </Field>

          <Field label="Fecha de levantamiento" mode={mode} value={values?.fechaLevantamiento}>
            <DatePicker selected={fechaLevantamiento} onChange={(d) => setFechaLevantamiento(d)} />
          </Field>

          <Field label="Responsable" mode={mode} value={values?.responsable}>
            <div className="relative">
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <User className="h-4 w-4" />
              </span>
              <Input
                type="text"
                placeholder="Ej. Ing. Carmen Poma"
                defaultValue={mode !== "view" ? values?.responsable : undefined}
                className="pl-10"
              />
            </div>
          </Field>
        </div>

        <div className="mt-4 flex items-center gap-2 rounded-xl bg-white px-4 py-3 text-xs text-gray-500 ring-1 ring-gray-200">
          <Spline className="h-4 w-4 text-forest-600" />
          Polígono con {values?.vertices ?? 5} vértices · levantamiento {values?.fechaLevantamiento ?? "—"} por{" "}
          {values?.responsable || "—"}
        </div>
      </div>
    </CardShell>
  );
}
