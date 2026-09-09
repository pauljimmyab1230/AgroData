import { useState } from "react";
import { ClipboardList } from "lucide-react";
import { DatePicker, Select } from "../ui";
import { CardHeader, CardShell, Field, type FormMode } from "../shared/formControls";
import type { Recepcion } from "../../services/recepciones";
import { useUsuariosBasic } from "../../services/usuarios";

type InformacionGeneralCardProps = {
  mode: FormMode;
  values?: Partial<Recepcion>;
  onChange?: <K extends keyof Recepcion>(field: K, value: Recepcion[K]) => void;
};

const parseDate = (s?: string) => (s ? new Date(s + "T00:00:00") : null);

const plantasOpciones = [
  "Planta Central - Andahuaylas",
  "Planta Secundaria - Talavera",
  "Planta de Procesamiento - San Jerónimo",
];

export function InformacionGeneralCard({ mode, values, onChange }: InformacionGeneralCardProps) {
  const editable = mode !== "view";
  const [fecha, setFecha] = useState<Date | null>(parseDate(values?.fecha));
  const { usuarios: responsables } = useUsuariosBasic();

  return (
    <CardShell>
      <CardHeader
        icon={<ClipboardList size={20} />}
        title="Información General"
        description="Datos básicos del ingreso de materia prima a la planta"
      />

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <Field label="Código de Recepción" mode={mode} value={values?.codigo}>
          <input
            type="text"
            placeholder="Se genera automáticamente"
            disabled
            defaultValue={values?.codigo}
            className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-500"
          />
        </Field>

        <Field label="Fecha" mode={mode} value={values?.fecha}>
          <DatePicker
            selected={fecha}
            onChange={(date) => {
              setFecha(date);
              onChange?.("fecha", date ? date.toISOString().split("T")[0] : "");
            }}
            disabled={!editable}
          />
        </Field>

        <Field label="Responsable de Recepción" mode={mode} value={values?.responsable}>
          <Select
            options={responsables.map((u) => ({ value: u.nombre, label: u.nombre }))}
            placeholder="Seleccione el responsable"
            value={values?.responsable ?? ""}
            onChange={(val) => onChange?.("responsable", val)}
          />
        </Field>

        <Field label="Planta" mode={mode} value={values?.planta}>
          <Select
            options={plantasOpciones.map((p) => ({ value: p, label: p }))}
            placeholder="Seleccione la planta"
            value={values?.planta ?? ""}
            onChange={(val) => onChange?.("planta", val)}
          />
        </Field>
      </div>
    </CardShell>
  );
}
