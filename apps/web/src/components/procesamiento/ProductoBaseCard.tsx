import { PackageCheck } from "lucide-react";
import { Input, Select } from "../ui";
import { CardHeader, CardShell, Field, type FormMode } from "../shared/formControls";
import { formatKg } from "../../services/procesamientos";

type ProductoBaseCardProps = {
  mode: FormMode;
  productoBase: string;
  calidadProducto: string;
  pesoFinal: string;
  humedadFinal: string;
  onChange: {
    productoBase: (v: string) => void;
    calidadProducto: (v: string) => void;
    pesoFinal: (v: string) => void;
    humedadFinal: (v: string) => void;
  };
};

const calidadOptions = [
  { value: "PRIMERA", label: "Primera" },
  { value: "SEGUNDA", label: "Segunda" },
  { value: "TERCERA", label: "Tercera" },
  { value: "DESCARTE", label: "Descarte" },
];

export function ProductoBaseCard({ mode, productoBase, calidadProducto, pesoFinal, humedadFinal, onChange }: ProductoBaseCardProps) {
  const editable = mode !== "view";

  return (
    <CardShell>
      <CardHeader
        icon={<PackageCheck size={20} />}
        title="Producto Base Obtenido"
        description="Registro del producto base resultante del procesamiento"
      />

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <Field label="Producto Base" mode={mode} value={productoBase}>
          <Input
            placeholder="Ej: Grano limpio de quinua"
            value={productoBase}
            onChange={(e) => onChange.productoBase(e.target.value)}
            disabled={!editable}
          />
        </Field>

        <Field label="Calidad" mode={mode} value={calidadProducto}>
          <Select
            options={calidadOptions}
            placeholder="Seleccione"
            value={calidadProducto}
            onChange={(val) => onChange.calidadProducto(val)}
            disabled={!editable}
          />
        </Field>

        <Field label="Peso Final (kg)" mode={mode} value={pesoFinal ? formatKg(Number(pesoFinal)) : undefined}>
          <Input
            type="number"
            step="0.1"
            min="0"
            placeholder="0.0"
            value={pesoFinal}
            onChange={(e) => onChange.pesoFinal(e.target.value)}
            disabled={!editable}
          />
        </Field>

        <Field label="Humedad Final (%)" mode={mode} value={humedadFinal ? `${humedadFinal}%` : undefined}>
          <Input
            type="number"
            step="0.1"
            min="0"
            max="100"
            placeholder="0.0"
            value={humedadFinal}
            onChange={(e) => onChange.humedadFinal(e.target.value)}
            disabled={!editable}
          />
        </Field>
      </div>
    </CardShell>
  );
}