import { useState } from "react";
import { Plus, Wrench } from "lucide-react";
import { Button, FormField, Input, Modal, Select, Textarea } from "../ui";
import { CardHeader, CardShell, type FormMode } from "../shared/formControls";
import { ActividadTable, type ActividadItem } from "./ActividadTableItems";
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

type Draft = {
  tipoActividad: string;
  horaInicio: string;
  horaFin: string;
  duracionEstimada: string;
  prioridad: string;
  descripcion: string;
};

const emptyDraft: Draft = {
  tipoActividad: "",
  horaInicio: "",
  horaFin: "",
  duracionEstimada: "",
  prioridad: "MEDIA",
  descripcion: "",
};

export function ActividadCard({ mode, value, onChange }: ActividadCardProps) {
  const editable = mode !== "view";
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<Draft>(emptyDraft);

  const hasData = Boolean(value.tipoActividad);

  const openEdit = () => {
    setDraft({
      tipoActividad: value.tipoActividad,
      horaInicio: value.horaInicio,
      horaFin: value.horaFin,
      duracionEstimada: value.duracionEstimada,
      prioridad: value.prioridad,
      descripcion: value.descripcion,
    });
    setOpen(true);
  };

  const handleSave = () => {
    onChange?.({
      tipoActividad: draft.tipoActividad,
      horaInicio: draft.horaInicio,
      horaFin: draft.horaFin,
      duracionEstimada: draft.duracionEstimada,
      prioridad: draft.prioridad,
      descripcion: draft.descripcion,
    });
    setOpen(false);
  };

  const items: ActividadItem[] = hasData
    ? [{
        id: "current",
        tipoActividad: value.tipoActividad,
        horaInicio: value.horaInicio,
        horaFin: value.horaFin,
        duracionEstimada: value.duracionEstimada,
        prioridad: value.prioridad,
        descripcion: value.descripcion,
      }]
    : [];

  return (
    <CardShell>
      <CardHeader
        icon={<Wrench size={20} />}
        title="Actividad Agrícola"
        description="Tipo de labor, horario y prioridad de la actividad realizada"
        actions={
          editable ? (
            <Button
              variant="secondary"
              size="sm"
              onClick={openEdit}
              iconLeft={<Plus className="h-4 w-4" />}
            >
              {hasData ? "Editar Actividad" : "Agregar Actividad"}
            </Button>
          ) : undefined
        }
      />

      <ActividadTable
        items={items}
        mode={mode}
        onEdit={editable ? openEdit : undefined}
        onRemove={editable ? () => onChange?.({
          tipoActividad: "", horaInicio: "", horaFin: "",
          duracionEstimada: "", prioridad: "MEDIA", descripcion: "",
        }) : undefined}
      />

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title={hasData ? "Editar Actividad" : "Agregar Actividad"}
        maxWidth="md"
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField label="Tipo de Actividad" required className="sm:col-span-2">
            <Select
              options={tipoOptions}
              placeholder="Seleccione el tipo de actividad"
              value={draft.tipoActividad}
              onChange={(v) => setDraft((d) => ({ ...d, tipoActividad: v }))}
            />
          </FormField>

          <FormField label="Hora de Inicio" required>
            <Input
              type="time"
              value={draft.horaInicio}
              onChange={(e) => setDraft((d) => ({ ...d, horaInicio: e.target.value }))}
            />
          </FormField>

          <FormField label="Hora de Finalización" required>
            <Input
              type="time"
              value={draft.horaFin}
              onChange={(e) => setDraft((d) => ({ ...d, horaFin: e.target.value }))}
            />
          </FormField>

          <FormField label="Duración Estimada">
            <Input
              type="text"
              placeholder="Ej. 3.5 horas"
              value={draft.duracionEstimada}
              onChange={(e) => setDraft((d) => ({ ...d, duracionEstimada: e.target.value }))}
            />
          </FormField>

          <FormField label="Prioridad" required>
            <Select
              options={prioridadOptions}
              placeholder="Seleccione la prioridad"
              value={draft.prioridad}
              onChange={(v) => setDraft((d) => ({ ...d, prioridad: v }))}
            />
          </FormField>

          <FormField label="Descripción" required className="sm:col-span-2">
            <Textarea
              rows={3}
              value={draft.descripcion}
              onChange={(e) => setDraft((d) => ({ ...d, descripcion: e.target.value }))}
              placeholder="Detalla la labor realizada, el estado del cultivo y las condiciones del terreno..."
            />
          </FormField>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <Button variant="ghost" onClick={() => setOpen(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSave} disabled={!draft.tipoActividad}>
            {hasData ? "Guardar Cambios" : "Agregar"}
          </Button>
        </div>
      </Modal>
    </CardShell>
  );
}
