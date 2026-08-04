import { useState } from "react";
import { Plus, UserRoundPlus } from "lucide-react";
import { Button, FormField, Input, Modal, Select } from "../ui";
import { CardHeader, CardShell, type FormMode } from "../shared/formControls";
import { ActividadWorkforce } from "./ActividadWorkforce";
import {
  funcionesOpciones,
  trabajadoresOpciones,
  type ActividadFormData,
  type Trabajador,
} from "../../pages/actividades/actividadMock";

type ManoObraCardProps = {
  mode: FormMode;
  value: ActividadFormData;
  onChange?: (patch: Partial<ActividadFormData>) => void;
};

type TrabajadorDraft = Omit<Trabajador, "id">;

const emptyDraft: TrabajadorDraft = {
  trabajador: "",
  funcion: "",
  jornales: "",
  horas: "",
  observaciones: "",
};

const toOptions = (items: string[]) => items.map((item) => ({ value: item, label: item }));

export function ManoObraCard({ mode, value, onChange }: ManoObraCardProps) {
  const editable = mode !== "view";
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState<TrabajadorDraft>(emptyDraft);

  const openCreate = () => {
    setEditingId(null);
    setDraft(emptyDraft);
    setOpen(true);
  };

  const openEdit = (trabajador: Trabajador) => {
    setEditingId(trabajador.id);
    setDraft({ ...trabajador });
    setOpen(true);
  };

  const handleSave = () => {
    if (editingId) {
      onChange?.({
        manoObra: value.manoObra.map((t) => (t.id === editingId ? { ...t, ...draft } : t)),
      });
    } else {
      onChange?.({
        manoObra: [...value.manoObra, { id: `m-${Date.now()}`, ...draft }],
      });
    }
    setOpen(false);
  };

  const handleRemove = (id: string) => {
    onChange?.({ manoObra: value.manoObra.filter((t) => t.id !== id) });
  };

  const completo = Boolean(draft.trabajador && draft.funcion);

  return (
    <CardShell>
      <CardHeader
        icon={<UserRoundPlus size={20} />}
        title="Mano de Obra"
        description="Personal que participó en la ejecución de la actividad"
        actions={
          editable ? (
            <Button variant="secondary" size="sm" onClick={openCreate} iconLeft={<Plus className="h-4 w-4" />}>
              Agregar Trabajador
            </Button>
          ) : undefined
        }
      />

      <ActividadWorkforce
        trabajadores={value.manoObra}
        mode={mode}
        onEdit={editable ? openEdit : undefined}
        onRemove={editable ? handleRemove : undefined}
      />

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title={editingId ? "Editar Trabajador" : "Agregar Trabajador"}
        maxWidth="md"
      >
        <div className="grid gap-5 sm:grid-cols-2">
          <FormField label="Trabajador" required className="sm:col-span-2">
            <Select
              options={toOptions(trabajadoresOpciones)}
              placeholder="Seleccione el trabajador"
              value={draft.trabajador}
              onChange={(v) => setDraft((d) => ({ ...d, trabajador: v }))}
            />
          </FormField>

          <FormField label="Función" required className="sm:col-span-2">
            <Select
              options={toOptions(funcionesOpciones)}
              placeholder="Seleccione la función"
              value={draft.funcion}
              onChange={(v) => setDraft((d) => ({ ...d, funcion: v }))}
            />
          </FormField>

          <FormField label="Jornales" required>
            <Input
              type="text"
              inputMode="decimal"
              placeholder="Ej. 2"
              value={draft.jornales}
              onChange={(e) => setDraft((d) => ({ ...d, jornales: e.target.value }))}
            />
          </FormField>

          <FormField label="Horas Trabajadas">
            <Input
              type="text"
              inputMode="decimal"
              placeholder="Ej. 16"
              value={draft.horas}
              onChange={(e) => setDraft((d) => ({ ...d, horas: e.target.value }))}
            />
          </FormField>

          <FormField label="Observaciones" className="sm:col-span-2">
            <Input
              type="text"
              placeholder="Notas sobre la participación..."
              value={draft.observaciones}
              onChange={(e) => setDraft((d) => ({ ...d, observaciones: e.target.value }))}
            />
          </FormField>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <Button variant="ghost" onClick={() => setOpen(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSave} disabled={!completo}>
            {editingId ? "Guardar Cambios" : "Agregar"}
          </Button>
        </div>
      </Modal>
    </CardShell>
  );
}
