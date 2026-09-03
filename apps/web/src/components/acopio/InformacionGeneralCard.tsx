import { useEffect, useState } from "react";
import { ClipboardList } from "lucide-react";
import { DatePicker, Input, Select } from "../ui";
import { CardHeader, CardShell, Field, type FormMode } from "../shared/formControls";
import type { AcopioView } from "../../services/acopios";
import { useUsuariosBasic } from "../../services/usuarios";
import {
  comunidadesOpciones,
  rutasOpciones,
  vehiculosOpciones,
} from "../../pages/acopio/acopioMock";
import api from "../../services/api";

const parseDate = (s?: string) => (s ? new Date(s + "T00:00:00") : null);

type InformacionGeneralCardProps = {
  mode: FormMode;
  values?: Partial<AcopioView>;
};

const toOptions = (items: string[]) => items.map((item) => ({ value: item, label: item }));

interface SelectOption {
  value: string;
  label: string;
}

export function InformacionGeneralCard({ mode, values }: InformacionGeneralCardProps) {
  const editable = mode !== "view";
  const { usuarios: acopiadores } = useUsuariosBasic("ACOPIADOR");
  const [campanias, setCampanias] = useState<SelectOption[]>([]);

  const [fecha, setFecha] = useState<Date | null>(parseDate(values?.fecha));
  const acopiadoresOptions = acopiadores.map((u) => ({ value: u.nombre, label: u.nombre }));

  useEffect(() => {
    if (!editable) return;
    api.get("/campanias", { params: { limit: 200 } })
      .then((res) => {
        setCampanias(
          (res.data.data ?? []).map((c: { id: string | number; nombre: string; codigo: string }) => ({
            value: String(c.id),
            label: `${c.codigo} - ${c.nombre}`,
          }))
        );
      })
      .catch(() => {});
  }, [editable]);

  return (
    <CardShell>
      <CardHeader
        icon={<ClipboardList size={20} />}
        title="Información General"
        description="Datos básicos del acopio realizado en campo"
      />

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <Field label="Código de Acopio" mode={mode} value={values?.codigo}>
          <Input placeholder="Se genera automáticamente" disabled value={editable ? values?.codigo : undefined} />
        </Field>

        <Field label="Fecha" mode={mode} value={values?.fecha}>
          <DatePicker selected={fecha} onChange={(d) => setFecha(d)} />
        </Field>

        <Field label="Campaña" mode={mode} value={values?.campania}>
          <Select
            options={campanias}
            placeholder="Seleccione la campaña"
            value={values?.campaniaId}
          />
        </Field>

        <Field label="Acopiador" mode={mode} value={values?.acopiador}>
          <Select
            options={acopiadoresOptions}
            placeholder="Seleccione el acopiador"
            value={editable ? values?.acopiador : undefined}
          />
        </Field>

        <Field label="Comunidad" mode={mode} value={values?.comunidad}>
          <Select
            options={toOptions(comunidadesOpciones)}
            placeholder="Seleccione la comunidad"
            value={editable ? values?.comunidad : undefined}
          />
        </Field>

        <Field label="Vehículo" mode={mode} value={values?.vehiculo}>
          <Select
            options={toOptions(vehiculosOpciones)}
            placeholder="Seleccione el vehículo"
            value={editable ? values?.vehiculo : undefined}
          />
        </Field>

        <Field label="Ruta" mode={mode} value={values?.ruta}>
          <Select
            options={toOptions(rutasOpciones)}
            placeholder="Seleccione la ruta"
            value={editable ? values?.ruta : undefined}
          />
        </Field>
      </div>
    </CardShell>
  );
}
