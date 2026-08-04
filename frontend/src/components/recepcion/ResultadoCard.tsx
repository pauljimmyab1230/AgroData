import { ClipboardCheck } from "lucide-react";
import { Input, Select } from "../ui";
import { CardHeader, CardShell, Field, type FormMode } from "../shared/formControls";
import { resultadosOpciones, type Recepcion } from "../../pages/recepcion/recepcionMock";

type ResultadoCardProps = {
  mode: FormMode;
  values?: Partial<Recepcion>;
};

const toOptions = (items: string[]) => items.map((item) => ({ value: item, label: item }));

export function ResultadoCard({ mode, values }: ResultadoCardProps) {
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
            options={toOptions(resultadosOpciones)}
            placeholder="Seleccione el resultado"
            defaultValue={editable ? values?.resultado : undefined}
          />
        </Field>

        <Field label="Motivo" mode={mode} value={values?.motivo} className="sm:col-span-2 lg:col-span-2">
          <Input
            placeholder="Motivo del resultado (requerido en caso de observaciones o rechazo)"
            defaultValue={editable ? values?.motivo : undefined}
          />
        </Field>
      </div>
    </CardShell>
  );
}
