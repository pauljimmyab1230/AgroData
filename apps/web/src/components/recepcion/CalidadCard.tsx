import { BadgeCheck } from "lucide-react";
import { Input, Select } from "../ui";
import { CardHeader, CardShell, Field, type FormMode } from "../shared/formControls";
import type { Recepcion } from "../../services/recepciones";

type CalidadCardProps = {
  mode: FormMode;
  values?: Partial<Recepcion>;
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

export function CalidadCard({ mode, values }: CalidadCardProps) {
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
            defaultValue={editable ? values?.materiaExtrana : undefined}
          />
        </Field>

        <Field label="Color" mode={mode} value={values?.color}>
          <Select
            options={toOptions(coloresOpciones)}
            placeholder="Seleccione el color"
            defaultValue={editable ? values?.color : undefined}
          />
        </Field>

        <Field label="Olor" mode={mode} value={values?.olor}>
          <Select
            options={toOptions(oloresOpciones)}
            placeholder="Seleccione el olor"
            defaultValue={editable ? values?.olor : undefined}
          />
        </Field>

        <Field label="Presencia de Insectos" mode={mode} value={presenciaLabel}>
          <Select
            options={presenciaInsectosOpciones.map((o) => ({ value: o, label: presenciaInsectosLabels[o] ?? o }))}
            placeholder="Seleccione"
            defaultValue={editable ? values?.presenciaInsectos : undefined}
          />
        </Field>

        <Field label="Estado General" mode={mode} value={values?.estadoProducto ? (estadoProductoLabels[values.estadoProducto] ?? values.estadoProducto) : undefined}>
          <Select
            options={estadosProductoOpciones.map((o) => ({ value: o, label: estadoProductoLabels[o] ?? o }))}
            placeholder="Seleccione el estado"
            defaultValue={editable ? values?.estadoProducto : undefined}
          />
        </Field>
      </div>
    </CardShell>
  );
}
