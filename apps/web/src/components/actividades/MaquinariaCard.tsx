import { useState } from "react";
import { Plus, Truck } from "lucide-react";
import { Button, FormField, Input, Modal, Select } from "../ui";
import { CardHeader, CardShell, type FormMode } from "../shared/formControls";
import { ActividadEquipment } from "./ActividadEquipment";
import {
  type ActividadFormData,
  type ActividadMaquinaria as Equipo,
} from "../../services/actividades";

const equiposOpciones = [
  "Tractor agrícola",
  "Arado de discos",
  "Rastra",
  "Motocultor",
  "Bomba pulverizadora",
  "Camión de acarreo",
  "Sembradora manual",
];

const operadoresOpciones = [
  "Marcelo Huamaní",
  "Simón Ccahuana",
  "Elías Quispe",
  "Vidal Taipe",
];

const combustibleOpciones = ["Petróleo D2", "Gasolina 90", "No aplica"];

type MaquinariaCardProps = {
  mode: FormMode;
  value: ActividadFormData;
  onChange?: (patch: Partial<ActividadFormData>) => void;
};

type EquipoDraft = Omit<Equipo, "id">;

const emptyDraft: EquipoDraft = {
  equipo: "",
  operador: "",
  horasUso: null,
  combustible: null,
  observaciones: "",
};

const toOptions = (items: string[]) => items.map((item) => ({ value: item, label: item }));

export function MaquinariaCard({ mode, value, onChange }: MaquinariaCardProps) {
  const editable = mode !== "view";
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState<EquipoDraft>(emptyDraft);

  const openCreate = () => {
    setEditingId(null);
    setDraft(emptyDraft);
    setOpen(true);
  };

  const openEdit = (equipo: Equipo) => {
    setEditingId(equipo.id ?? null);
    setDraft({ ...equipo });
    setOpen(true);
  };

  const handleSave = () => {
    if (editingId) {
      onChange?.({
        maquinaria: value.maquinaria.map((e) => (e.id === editingId ? { ...e, ...draft } : e)),
      });
    } else {
      onChange?.({
        maquinaria: [...value.maquinaria, { id: `e-${Date.now()}`, ...draft }],
      });
    }
    setOpen(false);
  };

  const handleRemove = (id: string) => {
    onChange?.({ maquinaria: value.maquinaria.filter((e) => e.id !== id) });
  };

  const completo = Boolean(draft.equipo && draft.horasUso);

  return (
    <CardShell>
      <CardHeader
        icon={<Truck size={20} />}
        title="Maquinaria y Equipos"
        description="Maquinaria y equipos utilizados durante la actividad"
        actions={
          editable ? (
            <Button variant="secondary" size="sm" onClick={openCreate} iconLeft={<Plus className="h-4 w-4" />}>
              Agregar Equipo
            </Button>
          ) : undefined
        }
      />

      <ActividadEquipment
        equipos={value.maquinaria}
        mode={mode}
        onEdit={editable ? openEdit : undefined}
        onRemove={editable ? handleRemove : undefined}
      />

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title={editingId ? "Editar Equipo" : "Agregar Equipo"}
        maxWidth="md"
      >
        <div className="grid gap-5 sm:grid-cols-2">
          <FormField label="Equipo" required className="sm:col-span-2">
            <Select
              options={toOptions(equiposOpciones)}
              placeholder="Seleccione el equipo"
              value={draft.equipo}
              onChange={(v) => setDraft((d) => ({ ...d, equipo: v }))}
            />
          </FormField>

          <FormField label="Operador">
            <Select
              options={toOptions(operadoresOpciones)}
              placeholder="Seleccione"
              value={draft.operador ?? ""}
              onChange={(v) => setDraft((d) => ({ ...d, operador: v }))}
            />
          </FormField>

          <FormField label="Horas de Uso" required>
            <Input
              type="text"
              inputMode="decimal"
              placeholder="Ej. 3.5"
              value={draft.horasUso ?? ""}
              onChange={(e) => setDraft((d) => ({ ...d, horasUso: e.target.value ? Number(e.target.value) : null }))}
            />
          </FormField>

          <FormField label="Combustible (opcional)">
            <Select
              options={toOptions(combustibleOpciones)}
              placeholder="Seleccione"
              value={draft.combustible ?? ""}
              onChange={(v) => setDraft((d) => ({ ...d, combustible: v }))}
            />
          </FormField>

          <FormField label="Observaciones" className="sm:col-span-2">
            <Input
              type="text"
              placeholder="Notas sobre el equipo..."
              value={draft.observaciones ?? ""}
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
