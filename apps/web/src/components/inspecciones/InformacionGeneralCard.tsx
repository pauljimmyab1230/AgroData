import { useState } from "react";
import { ClipboardList } from "lucide-react";
import { DatePicker, Input, Select } from "../ui";
import { CardHeader, CardShell, Field, type FormMode } from "../shared/formControls";
import {
  cultivosOpciones,
  inspectoresOpciones,
  parcelasOpciones,
  productoresOpciones,
  campaniasOpciones,
  type Inspeccion,
} from "../../services/inspecciones";

type InformacionGeneralCardProps = {
  mode: FormMode;
  values?: Partial<Inspeccion>;
};

const parseDate = (s?: string) => (s ? new Date(s + "T00:00:00") : null);

export function InformacionGeneralCard({ mode, values }: InformacionGeneralCardProps) {
  const editable = mode !== "view";
  const [fecha, setFecha] = useState<Date | null>(() => parseDate(values?.fecha));

  const toOptions = (items: string[]) => items.map((item) => ({ value: item, label: item }));

  return (
    <CardShell>
      <CardHeader
        icon={<ClipboardList size={20} />}
        title="Información General"
        description="Datos básicos de la inspección de campo"
      />

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <Field label="Código" mode={mode} value={values?.codigo}>
          <Input placeholder="Se genera automáticamente" disabled defaultValue={editable ? values?.codigo : undefined} />
        </Field>

        <Field label="Fecha de Inspección" mode={mode} value={values?.fecha}>
          <DatePicker selected={fecha} onChange={(date) => setFecha(date)} disabled={!editable} />
        </Field>

        <Field label="Campaña" mode={mode} value={values?.campaniaNombre}>
          <Select
            options={toOptions(campaniasOpciones)}
            placeholder="Seleccione"
            defaultValue={editable ? values?.campaniaNombre : undefined}
          />
        </Field>

        <Field label="Productor" mode={mode} value={values?.productorNombre}>
          <Select
            options={toOptions(productoresOpciones)}
            placeholder="Seleccione"
            defaultValue={editable ? values?.productorNombre : undefined}
          />
        </Field>

        <Field label="Parcela" mode={mode} value={values?.parcelaNombre}>
          <Select
            options={toOptions(parcelasOpciones)}
            placeholder="Seleccione"
            defaultValue={editable ? values?.parcelaNombre : undefined}
          />
        </Field>

        <Field label="Cultivo" mode={mode} value={values?.cultivoNombre}>
          <Select
            options={toOptions(cultivosOpciones)}
            placeholder="Seleccione"
            defaultValue={editable ? values?.cultivoNombre : undefined}
          />
        </Field>

        <Field label="Inspector" mode={mode} value={values?.inspector}>
          <Select
            options={toOptions(inspectoresOpciones)}
            placeholder="Seleccione"
            defaultValue={editable ? values?.inspector : undefined}
          />
        </Field>
      </div>
    </CardShell>
  );
}
