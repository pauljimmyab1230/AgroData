import { Sprout } from "lucide-react";
import { Input, Select } from "../ui";
import { CardHeader, CardShell, Field, type FormMode } from "../shared/formControls";
import {
  cultivosOpciones,
  metodosSiembraOpciones,
  variedadesOpciones,
  type Cultivo,
} from "../../pages/cultivos/cultivoMock";

type InformacionCultivoCardProps = {
  mode: FormMode;
  values?: Partial<Cultivo>;
};

const toOptions = (items: string[]) => items.map((item) => ({ value: item, label: item }));

export function InformacionCultivoCard({ mode, values }: InformacionCultivoCardProps) {
  const editable = mode !== "view";

  return (
    <CardShell>
      <CardHeader
        icon={<Sprout size={20} />}
        title="Información del Cultivo"
        description="Especie, variedad y características de la siembra"
      />

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <Field label="Cultivo" mode={mode} value={values?.cultivo} required>
          <Select
            options={toOptions(cultivosOpciones)}
            placeholder="Seleccione el cultivo"
            defaultValue={editable ? values?.cultivo : undefined}
            required
          />
        </Field>

        <Field label="Variedad" mode={mode} value={values?.variedad} required>
          <Select
            options={toOptions(variedadesOpciones)}
            placeholder="Seleccione la variedad"
            defaultValue={editable ? values?.variedad : undefined}
            required
          />
        </Field>

        <Field label="Área Sembrada (ha)" mode={mode} value={values?.areaSembrada?.toFixed(2)} required>
          <Input type="number" min="0" step="0.01" placeholder="Ej. 2.40" defaultValue={values?.areaSembrada} required />
        </Field>

        <Field label="Fecha de Siembra" mode={mode} value={values?.fechaSiembra} required>
          <Input type="date" defaultValue={values?.fechaSiembra} required />
        </Field>

        <Field label="Método de Siembra" mode={mode} value={values?.metodoSiembra} required>
          <Select
            options={toOptions(metodosSiembraOpciones)}
            placeholder="Seleccione el método"
            defaultValue={editable ? values?.metodoSiembra : undefined}
            required
          />
        </Field>
      </div>
    </CardShell>
  );
}
