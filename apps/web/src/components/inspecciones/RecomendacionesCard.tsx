import { useState } from "react";
import { Lightbulb } from "lucide-react";
import { DatePicker, Input, Select, Textarea } from "../ui";
import { CardHeader, CardShell, Field, type FormMode } from "../shared/formControls";
import {
  type Inspeccion,
} from "../../services/inspecciones";

type RecomendacionesCardProps = {
  mode: FormMode;
  values?: Partial<Inspeccion>;
};

const parseDate = (s?: string) => (s ? new Date(s + "T00:00:00") : null);

export function RecomendacionesCard({ mode, values }: RecomendacionesCardProps) {
  const editable = mode !== "view";
  const [fechaRecomendacion, setFechaRecomendacion] = useState<Date | null>(() =>
    parseDate(values?.fechaRecomendacion),
  );

  return (
    <CardShell>
      <CardHeader
        icon={<Lightbulb size={20} />}
        title="Recomendaciones"
        description="Recomendaciones técnicas para la mejora continua de la parcela"
      />

      <div className="mb-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <Field label="Prioridad" mode={mode} value={values?.prioridadRecomendacion}>
          <Select
            options={[{ value: "Alta", label: "Alta" }, { value: "Media", label: "Media" }, { value: "Baja", label: "Baja" }]}
            placeholder="Seleccione"
            value={editable ? values?.prioridadRecomendacion : undefined}
          />
        </Field>

        <Field label="Responsable" mode={mode} value={values?.responsableRecomendacion}>
          <Input
            placeholder="Nombre del responsable"
            value={editable ? values?.responsableRecomendacion : undefined}
            disabled={!editable}
          />
        </Field>

        <Field label="Fecha Recomendada de Cumplimiento" mode={mode} value={values?.fechaRecomendacion}>
          <DatePicker
            selected={fechaRecomendacion}
            onChange={(date) => setFechaRecomendacion(date)}
            disabled={!editable}
          />
        </Field>
      </div>

      <div>
        <p className="mb-2 text-sm font-medium text-[#111827]">Recomendaciones Técnicas</p>
        {editable ? (
          <Textarea
            rows={6}
            placeholder="Escribe aquí las recomendaciones de la inspección..."
            value={values?.recomendaciones}
          />
        ) : (
          <div className="rounded-xl border border-gray-200 bg-gray-50/50 p-5">
            <p className="whitespace-pre-wrap text-sm leading-relaxed text-[#111827]">
              {values?.recomendaciones || "Sin recomendaciones registradas."}
            </p>
          </div>
        )}
      </div>
    </CardShell>
  );
}
