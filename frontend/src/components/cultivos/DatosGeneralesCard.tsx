import { Tractor } from "lucide-react";
import { Select } from "../ui";
import { CardHeader, CardShell, Field, type FormMode } from "../shared/formControls";
import {
  campanasOpciones,
  cultivosMock,
  parcelasOpciones,
  productoresOpciones,
  type Cultivo,
} from "../../pages/cultivos/cultivoMock";

type DatosGeneralesCardProps = {
  mode: FormMode;
  values?: Partial<Cultivo>;
};

const toOptions = (items: string[]) => items.map((item) => ({ value: item, label: item }));

export function DatosGeneralesCard({ mode, values }: DatosGeneralesCardProps) {
  const editable = mode !== "view";
  const codigosOpciones = cultivosMock.map((cultivo) => cultivo.codigo);

  return (
    <CardShell>
      <CardHeader
        icon={<Tractor size={20} />}
        title="Información General"
        description="Identificación del cultivo, campaña, productor y parcela"
      />

      <div className="grid gap-6 sm:grid-cols-2">
        <Field label="Código" mode={mode} value={values?.codigo} required>
          <Select
            options={toOptions(codigosOpciones)}
            placeholder="Seleccione el código"
            defaultValue={editable ? values?.codigo : undefined}
            required
          />
        </Field>

        <Field label="Campaña" mode={mode} value={values?.campania} required>
          <Select
            options={toOptions(campanasOpciones)}
            placeholder="Seleccione la campaña"
            defaultValue={editable ? values?.campania : undefined}
            required
          />
        </Field>

        <Field label="Productor" mode={mode} value={values?.productor} required>
          <Select
            options={toOptions(productoresOpciones)}
            placeholder="Seleccione el productor"
            defaultValue={editable ? values?.productor : undefined}
            required
          />
        </Field>

        <Field label="Parcela" mode={mode} value={values?.parcela} required>
          <Select
            options={toOptions(parcelasOpciones)}
            placeholder="Seleccione la parcela"
            defaultValue={editable ? values?.parcela : undefined}
            required
          />
        </Field>
      </div>
    </CardShell>
  );
}
