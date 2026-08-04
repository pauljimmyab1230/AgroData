import { useState } from "react";
import { CalendarClock, Flower2, Sun, Sprout } from "lucide-react";
import { DatePicker } from "../ui";
import { CardHeader, CardShell, Field, type FormMode } from "../shared/formControls";
import CultivoTimeline from "./CultivoTimeline";
import type { Cultivo } from "../../pages/cultivos/cultivoMock";

const parseDate = (s?: string) => (s ? new Date(s + "T00:00:00") : null);

type CronogramaCardProps = {
  mode: FormMode;
  values?: Partial<Cultivo>;
};

export function CronogramaCard({ mode, values }: CronogramaCardProps) {
  const editable = mode !== "view";

  const [fechaEmergencia, setFechaEmergencia] = useState<Date | null>(parseDate(values?.fechaEmergencia));
  const [fechaFloracion, setFechaFloracion] = useState<Date | null>(parseDate(values?.fechaFloracion));
  const [fechaCosecha, setFechaCosecha] = useState<Date | null>(parseDate(values?.fechaCosecha));

  const etapas = [
    { label: "Siembra", date: values?.fechaSiembra, icon: Sprout },
    { label: "Emergencia", date: values?.fechaEmergencia, icon: Sun },
    { label: "Floración", date: values?.fechaFloracion, icon: Flower2 },
    { label: "Cosecha", date: values?.fechaCosecha, icon: CalendarClock },
  ];

  return (
    <CardShell>
      <CardHeader
        icon={<CalendarClock size={20} />}
        title="Cronograma"
        description="Fechas estimadas de las principales etapas del cultivo"
      />

      <div className="mb-8 grid gap-6 sm:grid-cols-3">
        <Field label="Fecha Estimada de Emergencia" mode={mode} value={values?.fechaEmergencia}>
          <DatePicker selected={fechaEmergencia} onChange={(d) => setFechaEmergencia(d)} disabled={!editable} />
        </Field>

        <Field label="Fecha Estimada de Floración" mode={mode} value={values?.fechaFloracion}>
          <DatePicker selected={fechaFloracion} onChange={(d) => setFechaFloracion(d)} disabled={!editable} />
        </Field>

        <Field label="Fecha Estimada de Cosecha" mode={mode} value={values?.fechaCosecha}>
          <DatePicker selected={fechaCosecha} onChange={(d) => setFechaCosecha(d)} disabled={!editable} />
        </Field>
      </div>

      <CultivoTimeline stages={etapas} />
    </CardShell>
  );
}
