import { Package } from "lucide-react";
import { Input, Select } from "../ui";
import { CardHeader, CardShell, Field, type FormMode } from "../shared/formControls";
import {
  destinosProduccionOpciones,
  type Cultivo,
} from "../../pages/cultivos/cultivoMock";

type EstimacionProduccionCardProps = {
  mode: FormMode;
  values?: Partial<Cultivo>;
};

const toOptions = (items: string[]) => items.map((item) => ({ value: item, label: item }));

export function EstimacionProduccionCard({ mode, values }: EstimacionProduccionCardProps) {
  const editable = mode !== "view";

  return (
    <CardShell>
      <CardHeader
        icon={<Package size={20} />}
        title="Estimación de Producción"
        description="Proyección productiva esperada del cultivo"
      />

      <div className="grid gap-6 sm:grid-cols-2">
        <Field label="Rendimiento Esperado (kg/ha)" mode={mode} value={values?.rendimientoEsperado?.toString()}>
          <Input type="number" min="0" step="0.01" placeholder="Ej. 1800" defaultValue={values?.rendimientoEsperado} />
        </Field>

        <Field label="Producción Estimada (kg)" mode={mode} value={values?.produccionEstimada?.toString()}>
          <Input type="number" min="0" step="0.01" placeholder="Ej. 4320" defaultValue={values?.produccionEstimada} />
        </Field>

        <Field label="Fecha Estimada de Cosecha" mode={mode} value={values?.fechaCosecha}>
          <Input type="date" defaultValue={values?.fechaCosecha} />
        </Field>

        <Field label="Destino de Producción" mode={mode} value={values?.destinoProduccion}>
          <Select
            options={toOptions(destinosProduccionOpciones)}
            placeholder="Seleccione el destino"
            defaultValue={editable ? values?.destinoProduccion : undefined}
          />
        </Field>
      </div>
    </CardShell>
  );
}
