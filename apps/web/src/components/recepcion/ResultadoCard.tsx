import { ClipboardCheck } from "lucide-react";
import { Input, Select } from "../ui";
import { CardHeader, CardShell, Field, type FormMode } from "../shared/formControls";
import type { Recepcion } from "../../services/recepciones";

type ResultadoCardProps = {
  mode: FormMode;
  values?: Partial<Recepcion>;
  onChange?: <K extends keyof Recepcion>(field: K, value: Recepcion[K]) => void;
};

const resultadosOpciones = ["ACEPTADO", "ACEPTADO_CON_OBSERVACIONES", "RECHAZADO"];
const resultadoLabels: Record<string, string> = {
  ACEPTADO: "Aceptado",
  ACEPTADO_CON_OBSERVACIONES: "Aceptado con Observaciones",
  RECHAZADO: "Rechazado",
};

export function ResultadoCard({ mode, values, onChange }: ResultadoCardProps) {
  const editable = mode !== "view";

  return (
    <CardShell>
      <CardHeader
        icon={<ClipboardCheck size={20} />}
        title="Resultado"
        description="Decisión final sobre el ingreso de la materia prima al proceso"
      />

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <Field label="Resultado Final" mode={mode} value={values?.resultado}>
          <Select
            options={resultadosOpciones.map((r) => ({ value: r, label: resultadoLabels[r] ?? r }))}
            placeholder="Seleccione el resultado"
            value={values?.resultado ?? ""}
            onChange={(val) => onChange?.("resultado", val)}
          />
        </Field>

        <Field label="Motivo" mode={mode} value={values?.motivo} className="sm:col-span-2 lg:col-span-2">
          <Input
            placeholder="Motivo del resultado (requerido en caso de observaciones o rechazo)"
            value={values?.motivo ?? ""}
            onChange={(e) => onChange?.("motivo", e.target.value)}
          />
        </Field>
      </div>
    </CardShell>
  );
}
