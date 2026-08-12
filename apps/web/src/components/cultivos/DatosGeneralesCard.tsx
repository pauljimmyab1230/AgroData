import { Tractor } from "lucide-react";
import { Input, Select } from "../ui";
import { CardHeader, CardShell, Field, type FormMode } from "../shared/formControls";
import {
  campanasOpciones,
  parcelasOpciones,
  productoresOpciones,
  type Cultivo,
} from "../../services/cultivos";

type DatosGeneralesCardProps = {
  mode: FormMode;
  values?: Partial<Cultivo>;
};

const toOptions = (items: string[]) => items.map((item) => ({ value: item, label: item }));

export function DatosGeneralesCard({ mode, values }: DatosGeneralesCardProps) {
  const editable = mode !== "view";

  return (
    <CardShell>
      <CardHeader
        icon={<Tractor size={20} />}
        title="Información General"
        description="Identificación del cultivo, campaña, productor y parcela"
      />

      <div className="grid gap-6 sm:grid-cols-2">
        <Field label="Código" mode={mode} value={values?.codigo} required>
          <Input type="text" placeholder="Ej. CUL-001" defaultValue={values?.codigo} />
        </Field>

        <Field label="Campaña" mode={mode} value={values?.campaniaNombre} required>
          <Select
            options={toOptions(campanasOpciones)}
            placeholder="Seleccione la campaña"
            defaultValue={editable ? values?.campaniaNombre : undefined}
            required
          />
        </Field>

        <Field label="Productor" mode={mode} value={values?.productorNombre} required>
          <Select
            options={toOptions(productoresOpciones)}
            placeholder="Seleccione el productor"
            defaultValue={editable ? values?.productorNombre : undefined}
            required
          />
        </Field>

        <Field label="Parcela" mode={mode} value={values?.parcelaNombre} required>
          <Select
            options={toOptions(parcelasOpciones)}
            placeholder="Seleccione la parcela"
            defaultValue={editable ? values?.parcelaNombre : undefined}
            required
          />
        </Field>
      </div>
    </CardShell>
  );
}
