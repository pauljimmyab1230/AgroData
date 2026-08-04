import { BadgeCheck } from "lucide-react";
import { Input, Select, Textarea } from "../ui";
import { CardHeader, CardShell, Field, type FormMode } from "../shared/formControls";
import { estadosProductoOpciones, type Acopio } from "../../pages/acopio/acopioMock";

type CalidadCardProps = {
  mode: FormMode;
  values?: Partial<Acopio>;
};

const toOptions = (items: string[]) => items.map((item) => ({ value: item, label: item }));

export function CalidadCard({ mode, values }: CalidadCardProps) {
  const editable = mode !== "view";

  return (
    <CardShell>
      <CardHeader
        icon={<BadgeCheck size={20} />}
        title="Control de Calidad"
        description="Evaluación de la calidad del producto recepcionado"
      />

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <Field label="Estado del Producto" mode={mode} value={values?.estadoProducto}>
          <Select
            options={toOptions(estadosProductoOpciones)}
            placeholder="Seleccione el estado"
            defaultValue={editable ? values?.estadoProducto : undefined}
          />
        </Field>

        <Field
          label="Humedad (%)"
          mode={mode}
          value={values?.humedad !== undefined ? `${values.humedad}%` : undefined}
        >
          <Input
            type="number"
            step="0.1"
            min="0"
            max="100"
            placeholder="0.0"
            defaultValue={editable ? values?.humedad : undefined}
          />
        </Field>

        <Field
          label="Impurezas (%)"
          mode={mode}
          value={values?.impurezas !== undefined ? `${values.impurezas}%` : undefined}
        >
          <Input
            type="number"
            step="0.1"
            min="0"
            max="100"
            placeholder="0.0"
            defaultValue={editable ? values?.impurezas : undefined}
          />
        </Field>

        <div className="sm:col-span-2 lg:col-span-3">
          <Field label="Observaciones" mode={mode} value={values?.observacionesCalidad}>
            <Textarea
              rows={4}
              placeholder="Escribe aquí las observaciones del control de calidad..."
              defaultValue={editable ? values?.observacionesCalidad : undefined}
            />
          </Field>
        </div>
      </div>
    </CardShell>
  );
}
