import { Wrench } from "lucide-react";
import { Input, Select, Textarea } from "../ui";
import { CardHeader, CardShell, Field, type FormMode } from "../shared/formControls";
import {
  tiposActividad,
  prioridades,
  prioridadLabels,
  tipoActividadLabels,
  type ActividadFormData,
} from "../../services/actividades";

type ActividadCardProps = {
  mode: FormMode;
  value: ActividadFormData;
  onChange?: (patch: Partial<ActividadFormData>) => void;
};

const tipoOptions = tiposActividad.map((t) => ({ value: t.value, label: t.label }));
const prioridadOptions = prioridades.map((p) => ({ value: p, label: prioridadLabels[p] ?? p }));

export function ActividadCard({ mode, value, onChange }: ActividadCardProps) {
  return (
    <CardShell>
      <CardHeader
        icon={<Wrench size={20} />}
        title="Actividad Agrícola"
        description="Tipo de labor, horario y prioridad de la actividad realizada"
      />

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <Field label="Tipo de Actividad" mode={mode} value={tipoActividadLabels[value.tipoActividad] ?? value.tipoActividad} required>
          <Select
            options={tipoOptions}
            placeholder="Seleccione el tipo de actividad"
            value={value.tipoActividad}
            onChange={(v) => onChange?.({ tipoActividad: v })}
          />
        </Field>

        <Field label="Hora de Inicio" mode={mode} value={value.horaInicio} required>
          <Input
            type="time"
            value={value.horaInicio}
            onChange={(e) => onChange?.({ horaInicio: e.target.value })}
          />
        </Field>

        <Field label="Hora de Finalización" mode={mode} value={value.horaFin} required>
          <Input
            type="time"
            value={value.horaFin}
            onChange={(e) => onChange?.({ horaFin: e.target.value })}
          />
        </Field>

        <Field label="Duración Estimada" mode={mode} value={value.duracionEstimada}>
          <Input
            type="text"
            placeholder="Ej. 3.5 horas"
            value={value.duracionEstimada}
            onChange={(e) => onChange?.({ duracionEstimada: e.target.value })}
          />
        </Field>

        <Field label="Prioridad" mode={mode} value={prioridadLabels[value.prioridad] ?? value.prioridad} required>
          <Select
            options={prioridadOptions}
            placeholder="Seleccione la prioridad"
            value={value.prioridad}
            onChange={(v) => onChange?.({ prioridad: v })}
          />
        </Field>
      </div>

      <div className="mt-6">
        <Field label="Descripción" mode={mode} value={value.descripcion} required>
          <Textarea
            rows={4}
            value={value.descripcion}
            onChange={(e) => onChange?.({ descripcion: e.target.value })}
            placeholder="Detalla la labor realizada, el estado del cultivo y las condiciones del terreno..."
          />
        </Field>
      </div>
    </CardShell>
  );
}
