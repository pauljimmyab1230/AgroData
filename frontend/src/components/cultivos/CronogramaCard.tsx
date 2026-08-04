import { CalendarClock, Flower2, Sun, Sprout } from "lucide-react";
import { Input } from "../ui";
import { CardHeader, CardShell, Field, type FormMode } from "../shared/formControls";
import CultivoTimeline from "./CultivoTimeline";
import type { Cultivo } from "../../pages/cultivos/cultivoMock";

type CronogramaCardProps = {
  mode: FormMode;
  values?: Partial<Cultivo>;
};

export function CronogramaCard({ mode, values }: CronogramaCardProps) {
  const editable = mode !== "view";

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
          <Input type="date" defaultValue={values?.fechaEmergencia} disabled={!editable} />
        </Field>

        <Field label="Fecha Estimada de Floración" mode={mode} value={values?.fechaFloracion}>
          <Input type="date" defaultValue={values?.fechaFloracion} disabled={!editable} />
        </Field>

        <Field label="Fecha Estimada de Cosecha" mode={mode} value={values?.fechaCosecha}>
          <Input type="date" defaultValue={values?.fechaCosecha} disabled={!editable} />
        </Field>
      </div>

      <CultivoTimeline stages={etapas} />
    </CardShell>
  );
}
