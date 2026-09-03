import { BadgeCheck } from "lucide-react";
import { Input, Select } from "../ui";
import { CardHeader, CardShell, Field, type FormMode } from "../shared/formControls";
import type { Recepcion } from "../../services/recepciones";

type CalidadCardProps = {
  mode: FormMode;
  values?: Partial<Recepcion>;
  onChange?: <K extends keyof Recepcion>(field: K, value: Recepcion[K]) => void;
};

const toOptions = (items: string[]) => items.map((item) => ({ value: item, label: item }));

const coloresOpciones = ["Cremoso", "Blanco Perlado", "Rosado Claro", "Dorado", "Ámbar"];
const oloresOpciones = [
  "Aroma característico",
  "Neutro",
  "Sin olor extraño",
  "Olor a humedad",
];
const presenciaInsectosOpciones = ["AUSENTE", "LEVE", "MODERADO", "ALTO"];
const estadosProductoOpciones = ["EXCELENTE", "BUENO", "REGULAR", "RECHAZADO"];

const presenciaInsectosLabels: Record<string, string> = {
  AUSENTE: "Ausente",
  LEVE: "Leve",
  MODERADO: "Moderado",
  ALTO: "Alto",
};

const estadoProductoLabels: Record<string, string> = {
  EXCELENTE: "Excelente",
  BUENO: "Bueno",
  REGULAR: "Regular",
  RECHAZADO: "Rechazado",
};

export function CalidadCard({ mode, values, onChange }: CalidadCardProps) {
  const editable = mode !== "view";

  const presenciaLabel = values?.presenciaInsectos
    ? presenciaInsectosLabels[values.presenciaInsectos] ?? values.presenciaInsectos
    : undefined;

  return (
    <CardShell>
      <CardHeader
        icon={<BadgeCheck size={20} />}
        title="Control de Calidad"
        description="Evaluación de la materia prima en la recepción de planta"
      />

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
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
            value={values?.humedad ?? ""}
            onChange={(e) => onChange?.("humedad", parseFloat(e.target.value) || 0)}
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
            value={values?.impurezas ?? ""}
            onChange={(e) => onChange?.("impurezas", parseFloat(e.target.value) || 0)}
          />
        </Field>

        <Field
          label="Materia Extraña (%)"
          mode={mode}
          value={values?.materiaExtrana !== undefined ? `${values.materiaExtrana}%` : undefined}
        >
          <Input
            type="number"
            step="0.1"
            min="0"
            max="100"
            placeholder="0.0"
            value={values?.materiaExtrana ?? ""}
            onChange={(e) => onChange?.("materiaExtrana", parseFloat(e.target.value) || 0)}
          />
        </Field>

        <Field label="Color" mode={mode} value={values?.color}>
          <Select
            options={toOptions(coloresOpciones)}
            placeholder="Seleccione el color"
            value={values?.color ?? ""}
            onChange={(val) => onChange?.("color", val)}
          />
        </Field>

        <Field label="Olor" mode={mode} value={values?.olor}>
          <Select
            options={toOptions(oloresOpciones)}
            placeholder="Seleccione el olor"
            value={values?.olor ?? ""}
            onChange={(val) => onChange?.("olor", val)}
          />
        </Field>

        <Field label="Presencia de Insectos" mode={mode} value={presenciaLabel}>
          <Select
            options={presenciaInsectosOpciones.map((o) => ({ value: o, label: presenciaInsectosLabels[o] ?? o }))}
            placeholder="Seleccione"
            value={values?.presenciaInsectos ?? ""}
            onChange={(val) => onChange?.("presenciaInsectos", val)}
          />
        </Field>

        <Field label="Estado General" mode={mode} value={values?.estadoProducto ? (estadoProductoLabels[values.estadoProducto] ?? values.estadoProducto) : undefined}>
          <Select
            options={estadosProductoOpciones.map((o) => ({ value: o, label: estadoProductoLabels[o] ?? o }))}
            placeholder="Seleccione el estado"
            value={values?.estadoProducto ?? ""}
            onChange={(val) => onChange?.("estadoProducto", val)}
          />
        </Field>
      </div>
    </CardShell>
  );
}
