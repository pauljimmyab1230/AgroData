import { UserRound } from "lucide-react";
import { Select } from "../ui";
import { CardHeader, CardShell, Field, type FormMode } from "../shared/formControls";
import {
  cultivosOpciones,
  lpsOpciones,
  parcelasOpciones,
  productoresOpciones,
  type Acopio,
} from "../../pages/acopio/acopioMock";

type ProductorCardProps = {
  mode: FormMode;
  values?: Partial<Acopio>;
};

const toOptions = (items: string[]) => items.map((item) => ({ value: item, label: item }));

export function ProductorCard({ mode, values }: ProductorCardProps) {
  const editable = mode !== "view";

  return (
    <CardShell>
      <CardHeader
        icon={<UserRound size={20} />}
        title="Información del Productor"
        description="Datos del productor y de su lote de producción"
      />

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Field label="Productor" mode={mode} value={values?.productor}>
          <Select
            options={toOptions(productoresOpciones)}
            placeholder="Seleccione el productor"
            defaultValue={editable ? values?.productor : undefined}
          />
        </Field>

        <Field label="Parcela" mode={mode} value={values?.parcela}>
          <Select
            options={toOptions(parcelasOpciones)}
            placeholder="Seleccione la parcela"
            defaultValue={editable ? values?.parcela : undefined}
          />
        </Field>

        <Field label="Cultivo" mode={mode} value={values?.cultivo}>
          <Select
            options={toOptions(cultivosOpciones)}
            placeholder="Seleccione el cultivo"
            defaultValue={editable ? values?.cultivo : undefined}
          />
        </Field>

        <Field label="Lote del Productor (LP)" mode={mode} value={values?.loteProductor}>
          <Select
            options={toOptions(lpsOpciones)}
            placeholder="Seleccione el LP"
            defaultValue={editable ? values?.loteProductor : undefined}
          />
        </Field>
      </div>
    </CardShell>
  );
}
