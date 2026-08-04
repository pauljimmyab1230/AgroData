import { BadgeCheck } from "lucide-react";
import { Input, Select } from "../ui";
import { CardHeader, CardShell, Field, type FormMode } from "../shared/formControls";
import {
  coloresOpciones,
  estadosProductoOpciones,
  oloresOpciones,
  presenciaInsectosOpciones,
  type Recepcion,
} from "../../pages/recepcion/recepcionMock";

type CalidadCardProps = {
  mode: FormMode;
  values?: Partial<Recepcion>;
};

const toOptions = (items: string[]) => items.map((item) => ({ value: item, label: item }));

export function CalidadCard({ mode, values }: CalidadCardProps) {
  const editable = mode !== "view";

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

        <Field label="Presencia de Insectos" mode={mode} value={values?.presenciaInsectos}>
          <Select
            options={toOptions(presenciaInsectosOpciones)}
            placeholder="Seleccione la presencia"
            defaultValue={editable ? values?.presenciaInsectos : undefined}
          />
        </Field>

        <Field label="Estado General" mode={mode} value={values?.estadoProducto}>
          <Select
            options={toOptions(estadosProductoOpciones)}
            placeholder="Seleccione el estado"
            defaultValue={editable ? values?.estadoProducto : undefined}
          />
        </Field>
      </div>
    </CardShell>
  );
}
