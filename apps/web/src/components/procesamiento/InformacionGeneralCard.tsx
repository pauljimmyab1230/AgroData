import { useState } from "react";
import { ClipboardList } from "lucide-react";
import { DatePicker, Input, Select } from "../ui";
import { CardHeader, CardShell, Field, type FormMode } from "../shared/formControls";
import {
  campaniasOpciones,
  lineasProcesamientoOpciones,
  plantasOpciones,
  productosOpciones,
  responsablesOpciones,
  type OrdenProcesamiento,
} from "../../services/procesamientos";

type InformacionGeneralCardProps = {
  mode: FormMode;
  values?: Partial<OrdenProcesamiento>;
};

const toOptions = (items: string[]) => items.map((item) => ({ value: item, label: item }));

const parseDate = (s?: string) => (s ? new Date(s + "T00:00:00") : null);

export function InformacionGeneralCard({ mode, values }: InformacionGeneralCardProps) {
  const editable = mode !== "view";
  const [fecha, setFecha] = useState<Date | null>(() => parseDate(values?.fecha));

  return (
    <CardShell>
      <CardHeader
        icon={<ClipboardList size={20} />}
        title="Información General"
        description="Datos básicos de la orden de procesamiento"
      />

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <Field label="Código OP" mode={mode} value={values?.codigo}>
          <Input placeholder="Se genera automáticamente" disabled defaultValue={editable ? values?.codigo : undefined} />
        </Field>

        <Field label="Fecha" mode={mode} value={values?.fecha}>
          <DatePicker selected={fecha} onChange={(date) => setFecha(date)} disabled={!editable} />
        </Field>

        <Field label="Responsable" mode={mode} value={values?.responsable}>
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

        <Field label="Línea de Procesamiento" mode={mode} value={values?.lineaProcesamiento}>
          <Select
            options={toOptions(lineasProcesamientoOpciones)}
            placeholder="Seleccione la línea"
            defaultValue={editable ? values?.lineaProcesamiento : undefined}
          />
        </Field>

        <Field label="Campaña" mode={mode} value={values?.campania}>
          <Select
            options={toOptions(campaniasOpciones)}
            placeholder="Seleccione la campaña"
            defaultValue={editable ? values?.campania : undefined}
          />
        </Field>

        <Field label="Producto" mode={mode} value={values?.producto}>
          <Select
            options={toOptions(productosOpciones)}
            placeholder="Seleccione el producto"
            defaultValue={editable ? values?.producto : undefined}
          />
        </Field>
      </div>
    </CardShell>
  );
}
