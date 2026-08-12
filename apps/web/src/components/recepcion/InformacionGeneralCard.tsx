import { useEffect, useState } from "react";
import { ClipboardList } from "lucide-react";
import { DatePicker, Input, Select } from "../ui";
import { CardHeader, CardShell, Field, type FormMode } from "../shared/formControls";
import type { Recepcion } from "../../services/recepciones";
import { fetchCampanias } from "../../services/campanias";

type InformacionGeneralCardProps = {
  mode: FormMode;
  values?: Partial<Recepcion>;
};

const parseDate = (s?: string) => (s ? new Date(s + "T00:00:00") : null);

const plantasOpciones = [
  "Planta Central - Andahuaylas",
  "Planta Secundaria - Talavera",
  "Planta de Procesamiento - San Jerónimo",
];
const responsablesOpciones = [
  "Ing. Julio Paredes",
  "Ing. Carmen Flores",
  "Téc. Rolando Huaraca",
  "Ing. Silvia Medina",
];

export function InformacionGeneralCard({ mode, values }: InformacionGeneralCardProps) {
  const editable = mode !== "view";
  const [fecha, setFecha] = useState<Date | null>(parseDate(values?.fecha));
  const [campanias, setCampanias] = useState<{ value: string; label: string }[]>([]);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const result = await fetchCampanias({ limit: 100 });
        if (!cancelled) {
          setCampanias(
            result.data.map((c) => ({ value: c.id, label: c.nombre }))
          );
        }
      } catch {
        setCampanias([]);
      }
    };
    load();
    return () => { cancelled = true; };
  }, []);

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
          <DatePicker
            selected={fecha}
            onChange={(date) => setFecha(date)}
            disabled={!editable}
          />
        </Field>

        <Field label="Campaña" mode={mode} value={values?.campaniaNombre}>
          <Select
            options={campanias}
            placeholder="Seleccione la campaña"
            defaultValue={editable ? values?.campaniaId : undefined}
          />
        </Field>

        <Field label="Responsable de Recepción" mode={mode} value={values?.responsable}>
          <Select
            options={responsablesOpciones.map((r) => ({ value: r, label: r }))}
            placeholder="Seleccione el responsable"
            defaultValue={editable ? values?.responsable : undefined}
          />
        </Field>

        <Field label="Planta" mode={mode} value={values?.planta}>
          <Select
            options={plantasOpciones.map((p) => ({ value: p, label: p }))}
            placeholder="Seleccione la planta"
            defaultValue={editable ? values?.planta : undefined}
          />
        </Field>
      </div>
    </CardShell>
  );
}
