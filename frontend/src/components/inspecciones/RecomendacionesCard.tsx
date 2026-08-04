import { Lightbulb } from "lucide-react";
import { Input, Select, Textarea } from "../ui";
import { CardHeader, CardShell, Field, type FormMode } from "../shared/formControls";
import {
  prioridadesOpciones,
  responsablesOpciones,
  type Inspeccion,
} from "../../pages/inspecciones/inspeccionMock";

type RecomendacionesCardProps = {
  mode: FormMode;
  values?: Partial<Inspeccion>;
};

const toOptions = (items: string[]) => items.map((item) => ({ value: item, label: item }));

export function RecomendacionesCard({ mode, values }: RecomendacionesCardProps) {
  const editable = mode !== "view";

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
            options={toOptions(prioridadesOpciones)}
            placeholder="Seleccione"
            defaultValue={editable ? values?.prioridadRecomendacion : undefined}
          />
        </Field>

        <Field label="Responsable" mode={mode} value={values?.responsableRecomendacion}>
          <Select
            options={toOptions(responsablesOpciones)}
            placeholder="Seleccione"
            defaultValue={editable ? values?.responsableRecomendacion : undefined}
          />
        </Field>

        <Field label="Fecha Recomendada de Cumplimiento" mode={mode} value={values?.fechaRecomendacion}>
          <Input
            type="date"
            defaultValue={editable ? values?.fechaRecomendacion : undefined}
          />
        </Field>
      </div>

      <div>
        <p className="mb-2 text-sm font-medium text-[#111827]">Recomendaciones Técnicas</p>
        {editable ? (
          <Textarea
            rows={6}
            placeholder="Escribe aquí las recomendaciones de la inspección..."
            defaultValue={values?.recomendaciones}
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
