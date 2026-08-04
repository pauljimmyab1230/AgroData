import { ClipboardList } from "lucide-react";
import { Input, Select } from "../ui";
import { CardHeader, CardShell, Field, type FormMode } from "../shared/formControls";
import {
  campaniasOpciones,
  plantasOpciones,
  responsablesOpciones,
  type Recepcion,
} from "../../pages/recepcion/recepcionMock";

type InformacionGeneralCardProps = {
  mode: FormMode;
  values?: Partial<Recepcion>;
};

const toOptions = (items: string[]) => items.map((item) => ({ value: item, label: item }));

export function InformacionGeneralCard({ mode, values }: InformacionGeneralCardProps) {
  const editable = mode !== "view";

  return (
    <CardShell>
      <CardHeader
        icon={<ClipboardList size={20} />}
        title="Información General"
        description="Datos básicos del ingreso de materia prima a la planta"
      />

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <Field label="Código de Recepción" mode={mode} value={values?.codigo}>
          <Input placeholder="Se genera automáticamente" disabled defaultValue={editable ? values?.codigo : undefined} />
        </Field>

        <Field label="Fecha" mode={mode} value={values?.fecha}>
          <Input type="date" defaultValue={editable ? values?.fecha : undefined} />
        </Field>

        <Field label="Campaña" mode={mode} value={values?.campania}>
          <Select
            options={toOptions(campaniasOpciones)}
            placeholder="Seleccione la campaña"
            defaultValue={editable ? values?.campania : undefined}
          />
        </Field>

        <Field label="Responsable de Recepción" mode={mode} value={values?.responsable}>
          <Select
            options={toOptions(responsablesOpciones)}
            placeholder="Seleccione el responsable"
            defaultValue={editable ? values?.responsable : undefined}
          />
        </Field>

        <Field label="Planta" mode={mode} value={values?.planta}>
          <Select
            options={toOptions(plantasOpciones)}
            placeholder="Seleccione la planta"
            defaultValue={editable ? values?.planta : undefined}
          />
        </Field>
      </div>
    </CardShell>
  );
}
