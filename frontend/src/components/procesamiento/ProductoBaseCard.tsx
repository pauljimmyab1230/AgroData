import { PackageCheck } from "lucide-react";
import { Input, Select, Textarea } from "../ui";
import { CardHeader, CardShell, Field, type FormMode } from "../shared/formControls";
import { CalidadBadge } from "./badges";
import { calidadesOpciones, formatKg, type OrdenProcesamiento } from "../../pages/procesamiento/procesamientoMock";

type ProductoBaseCardProps = {
  mode: FormMode;
  values?: Partial<OrdenProcesamiento>;
};

const toOptions = (items: string[]) => items.map((item) => ({ value: item, label: item }));

export function ProductoBaseCard({ mode, values }: ProductoBaseCardProps) {
  const editable = mode !== "view";
  const resultado = values?.resultado;

  return (
    <CardShell>
      <CardHeader
        icon={<PackageCheck size={20} />}
        title="Producto Base Obtenido"
        description="Registro del producto base resultante del procesamiento"
      />

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <Field label="Producto Base" mode={mode} value={resultado?.productoBase}>
          <Input
            placeholder="Ej: Grano limpio de quinua"
            defaultValue={editable ? resultado?.productoBase : undefined}
          />
        </Field>

        <Field label="Calidad" mode={mode} value={resultado?.calidad}>
          {editable ? (
            <Select
              options={toOptions(calidadesOpciones)}
              placeholder="Seleccione la calidad"
              defaultValue={editable ? resultado?.calidad : undefined}
            />
          ) : (
            <CalidadBadge calidad={resultado?.calidad} />
          )}
        </Field>

        <Field
          label="Peso Final (kg)"
          mode={mode}
          value={resultado?.pesoFinal !== undefined ? formatKg(resultado.pesoFinal) : undefined}
        >
          <Input
            type="number"
            step="0.1"
            min="0"
            placeholder="0.0"
            defaultValue={editable ? resultado?.pesoFinal : undefined}
          />
        </Field>

        <Field
          label="Humedad Final (%)"
          mode={mode}
          value={resultado?.humedadFinal !== undefined ? `${resultado.humedadFinal}%` : undefined}
        >
          <Input
            type="number"
            step="0.1"
            min="0"
            max="100"
            placeholder="0.0"
            defaultValue={editable ? resultado?.humedadFinal : undefined}
          />
        </Field>

        <div className="sm:col-span-2 lg:col-span-3">
          <Field label="Observaciones del Producto" mode={mode} value="Grano limpio de quinua de primera calidad, apto para transformación.">
            {editable ? (
              <Textarea
                rows={3}
                placeholder="Observaciones sobre el producto base obtenido..."
                defaultValue="Grano limpio de quinua de primera calidad, apto para transformación."
              />
            ) : (
              <div className="rounded-xl border border-gray-200 bg-gray-50/50 p-4">
                <p className="text-sm text-[#111827]">Grano limpio de quinua de primera calidad, apto para transformación.</p>
              </div>
            )}
          </Field>
        </div>
      </div>
    </CardShell>
  );
}
