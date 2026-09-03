import { PackageCheck } from "lucide-react";
import { Input, Select, Textarea } from "../ui";
import { CardHeader, CardShell, Field, type FormMode } from "../shared/formControls";
import { CalidadBadge } from "./badges";
import { calidadesOpciones, formatKg, type OrdenProcesamiento } from "../../services/procesamientos";

type ProductoBaseCardProps = {
  mode: FormMode;
  values?: Partial<OrdenProcesamiento>;
};

const toOptions = (items: string[]) => items.map((item) => ({ value: item, label: item }));

export function ProductoBaseCard({ mode, values }: ProductoBaseCardProps) {
  const editable = mode !== "view";

  return (
    <CardShell>
      <CardHeader
        icon={<PackageCheck size={20} />}
        title="Producto Base Obtenido"
        description="Registro del producto base resultante del procesamiento"
      />

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <Field label="Producto Base" mode={mode} value={values?.productoBase}>
          <Input
            placeholder="Ej: Grano limpio de quinua"
            value={values?.productoBase ?? ""}
            onChange={(e) => {}}
            disabled={!editable}
          />
        </Field>

        <Field label="Calidad" mode={mode} value={values?.calidadProducto ? <CalidadBadge calidad={values.calidadProducto} /> : undefined}>
          <Select
            options={toOptions(calidadesOpciones)}
            placeholder="Seleccione"
            value={values?.calidadProducto ?? ""}
            onChange={(e) => {}}
            disabled={!editable}
          />
        </Field>

        <Field label="Peso Final (kg)" mode={mode} value={values?.pesoFinal ? formatKg(values.pesoFinal) : undefined}>
          <Input
            type="number"
            step="0.1"
            min="0"
            placeholder="0.0"
            value={values?.pesoFinal ?? ""}
            onChange={(e) => {}}
            disabled={!editable}
          />
        </Field>

        <Field label="Humedad Final (%)" mode={mode} value={values?.humedadFinal != null ? `${values.humedadFinal}%` : undefined}>
          <Input
            type="number"
            step="0.1"
            min="0"
            max="100"
            placeholder="0.0"
            value={values?.humedadFinal ?? ""}
            onChange={(e) => {}}
            disabled={!editable}
          />
        </Field>
      </div>
    </CardShell>
  );
}
