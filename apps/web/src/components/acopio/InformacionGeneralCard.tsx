import { useState } from "react";
import { ClipboardList } from "lucide-react";
import { DatePicker, Input, Select } from "../ui";
import { CardHeader, CardShell, Field, type FormMode } from "../shared/formControls";
import type { AcopioView } from "../../services/acopios";
import {
  acopiadoresOpciones,
  campaniasOpciones,
  comunidadesOpciones,
  rutasOpciones,
  vehiculosOpciones,
} from "../../pages/acopio/acopioMock";

const parseDate = (s?: string) => (s ? new Date(s + "T00:00:00") : null);

type InformacionGeneralCardProps = {
  mode: FormMode;
  values?: Partial<AcopioView>;
};

const toOptions = (items: string[]) => items.map((item) => ({ value: item, label: item }));

export function InformacionGeneralCard({ mode, values }: InformacionGeneralCardProps) {
  const editable = mode !== "view";

  const [fecha, setFecha] = useState<Date | null>(parseDate(values?.fecha));

  return (
    <CardShell>
      <CardHeader
        icon={<ClipboardList size={20} />}
        title="Información General"
        description="Datos básicos del acopio realizado en campo"
      />

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <Field label="Código de Acopio" mode={mode} value={values?.codigo}>
          <Input placeholder="Se genera automáticamente" disabled defaultValue={editable ? values?.codigo : undefined} />
        </Field>

        <Field label="Fecha" mode={mode} value={values?.fecha}>
          <DatePicker selected={fecha} onChange={(d) => setFecha(d)} />
        </Field>

        <Field label="Campaña" mode={mode} value={values?.campania}>
          <Select
            options={toOptions(campaniasOpciones)}
            placeholder="Seleccione la campaña"
            defaultValue={editable ? values?.campania : undefined}
          />
        </Field>

        <Field label="Acopiador" mode={mode} value={values?.acopiador}>
          <Select
            options={toOptions(acopiadoresOpciones)}
            placeholder="Seleccione el acopiador"
            defaultValue={editable ? values?.acopiador : undefined}
          />
        </Field>

        <Field label="Comunidad" mode={mode} value={values?.comunidad}>
          <Select
            options={toOptions(comunidadesOpciones)}
            placeholder="Seleccione la comunidad"
            defaultValue={editable ? values?.comunidad : undefined}
          />
        </Field>

        <Field label="Vehículo" mode={mode} value={values?.vehiculo}>
          <Select
            options={toOptions(vehiculosOpciones)}
            placeholder="Seleccione el vehículo"
            defaultValue={editable ? values?.vehiculo : undefined}
          />
        </Field>

        <Field label="Ruta" mode={mode} value={values?.ruta}>
          <Select
            options={toOptions(rutasOpciones)}
            placeholder="Seleccione la ruta"
            defaultValue={editable ? values?.ruta : undefined}
          />
        </Field>
      </div>
    </CardShell>
  );
}
