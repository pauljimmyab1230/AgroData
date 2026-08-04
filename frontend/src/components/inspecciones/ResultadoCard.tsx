import { Award } from "lucide-react";
import { Input, Select, Textarea } from "../ui";
import { CardHeader, CardShell, Field, type FormMode } from "../shared/formControls";
import { ResultadoBadge, RiesgoBadge } from "./badges";
import {
  resultadosOpciones,
  riesgosOpciones,
  type Inspeccion,
  type Riesgo,
} from "../../pages/inspecciones/inspeccionMock";

type ResultadoCardProps = {
  mode: FormMode;
  values?: Partial<Inspeccion>;
};

export function ResultadoCard({ mode, values }: ResultadoCardProps) {
  const editable = mode !== "view";

  const toOptions = (items: string[]) => items.map((item) => ({ value: item, label: item }));

  return (
    <CardShell>
      <CardHeader
        icon={<Award size={20} />}
        title="Resultado Final"
        description="Calificación final de la inspección y programación de la siguiente"
      />

      <div className="grid gap-6 sm:grid-cols-2">
        <Field label="Resultado" mode={mode} value={values?.resultado}>
          <Select
            options={toOptions(resultadosOpciones)}
            placeholder="Seleccione el resultado"
            defaultValue={editable ? values?.resultado : undefined}
          />
        </Field>

        <Field label="Nivel de Riesgo General" mode={mode} value={values?.riesgoGeneral}>
          <Select
            options={toOptions(riesgosOpciones)}
            placeholder="Seleccione"
            defaultValue={editable ? values?.riesgoGeneral : undefined}
          />
        </Field>

        <Field label="Fecha Próxima Inspección" mode={mode} value={values?.fechaProximaInspeccion}>
          <Input type="date" defaultValue={editable ? values?.fechaProximaInspeccion : undefined} />
        </Field>
      </div>

      <div className="mt-6">
        <p className="mb-2 text-sm font-medium text-[#111827]">Resumen Ejecutivo</p>
        {editable ? (
          <Textarea
            rows={4}
            placeholder="Resumen ejecutivo de la inspección para el expediente..."
            defaultValue={values?.resumenEjecutivo}
          />
        ) : (
          <div className="rounded-xl border border-gray-200 bg-gray-50/50 p-4">
            <p className="whitespace-pre-wrap text-sm leading-relaxed text-[#111827]">
              {values?.resumenEjecutivo || "Sin resumen ejecutivo registrado."}
            </p>
          </div>
        )}
      </div>

      {mode === "view" && (
        <div className="mt-6 flex flex-wrap items-center gap-3 rounded-xl border border-gray-200 bg-gray-50/50 p-4">
          {values?.resultado && <ResultadoBadge resultado={values.resultado} />}
          {values?.riesgoGeneral && <RiesgoBadge riesgo={values.riesgoGeneral as Riesgo} />}
          <p className="text-sm text-gray-500">Calificación final registrada para esta inspección.</p>
        </div>
      )}
    </CardShell>
  );
}
