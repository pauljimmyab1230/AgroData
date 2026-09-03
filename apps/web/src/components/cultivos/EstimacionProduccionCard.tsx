import { useState } from "react";
import { Package } from "lucide-react";
import { DatePicker, Input, Select } from "../ui";
import { CardHeader, CardShell, Field, type FormMode } from "../shared/formControls";
import {
  destinosProduccionValues,
  type Cultivo,
} from "../../services/cultivos";

const parseDate = (s?: string) => (s ? new Date(s + "T00:00:00") : null);

type EstimacionProduccionCardProps = {
  mode: FormMode;
  values?: Partial<Cultivo>;
  onChange?: (patch: Partial<Cultivo>) => void;
};

export function EstimacionProduccionCard({ mode, values, onChange }: EstimacionProduccionCardProps) {
  const [fechaCosecha, setFechaCosecha] = useState<Date | null>(parseDate(values?.fechaCosecha));

  return (
    <CardShell>
      <CardHeader
        icon={<Package size={20} />}
        title="Estimación de Producción"
        description="Proyección productiva esperada del cultivo"
      />

      <div className="grid gap-6 sm:grid-cols-2">
        <Field label="Rendimiento Esperado (kg/ha)" mode={mode} value={values?.rendimientoEsperado?.toString()}>
          <Input
            type="number"
            min="0"
            step="0.01"
            placeholder="Ej. 1800"
            value={values?.rendimientoEsperado ?? undefined}
            onChange={(e) => onChange?.({ rendimientoEsperado: Number(e.target.value) || 0 })}
          />
        </Field>

        <Field label="Producción Estimada (kg)" mode={mode} value={values?.produccionEstimada?.toString()}>
          <Input
            type="number"
            min="0"
            step="0.01"
            placeholder="Ej. 4320"
            value={values?.produccionEstimada ?? undefined}
            onChange={(e) => onChange?.({ produccionEstimada: Number(e.target.value) || 0 })}
          />
        </Field>

        <Field label="Fecha Estimada de Cosecha" mode={mode} value={values?.fechaCosecha}>
          <DatePicker
            selected={fechaCosecha}
            onChange={(d) => {
              setFechaCosecha(d);
              onChange?.({ fechaCosecha: d?.toISOString().split("T")[0] ?? "" });
            }}
          />
        </Field>

        <Field label="Destino de Producción" mode={mode} value={values?.destinoProduccion}>
          <Select
            options={destinosProduccionValues.map((v) => ({ value: v, label: v }))}
            placeholder="Seleccione el destino"
            value={values?.destinoProduccion}
            onChange={(val) => onChange?.({ destinoProduccion: val })}
          />
        </Field>
      </div>
    </CardShell>
  );
}
