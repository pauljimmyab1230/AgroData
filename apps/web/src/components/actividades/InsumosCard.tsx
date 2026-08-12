import { useState } from "react";
import { Package, Plus } from "lucide-react";
import { Button, FormField, Input, Modal, Select } from "../ui";
import { CardHeader, CardShell, type FormMode } from "../shared/formControls";
import { ActividadProducts } from "./ActividadProducts";
import {
  type ActividadFormData,
  type ActividadInsumo as Insumo,
} from "../../services/actividades";

const productosInsumoOpciones = [
  "Guano de corral",
  "Compost",
  "Biol",
  "Cal agrícola",
  "Roca fosfórica",
  "Semilla de quinua",
  "Semilla de papa nativa",
  "Extracto de ají",
  "Aceite de neem",
  "Caldo bordelés",
  "Yeso agrícola",
  "Sulfato de potasio",
];

const categoriasInsumoOpciones = [
  "Abonos orgánicos",
  "Fertilizantes",
  "Control biológico",
  "Semillas",
  "Insumos de labranza",
];

const fabricantesOpciones = [
  "Cooperativa Frutos del Ande",
  "AgroAndes",
  "Biolab Perú",
  "Semillas Andinas SAC",
  "AgroFer S.A.C.",
];

const unidadesOpciones = ["kg", "g", "L", "t", "sacos", "carretillas", "unid."];

const lotesOpciones = ["L-001", "L-002", "L-003", "L-004", "L-005"];

type InsumosCardProps = {
  mode: FormMode;
  value: ActividadFormData;
  onChange?: (patch: Partial<ActividadFormData>) => void;
};

type InsumoDraft = Omit<Insumo, "id">;

const emptyDraft: InsumoDraft = {
  producto: "",
  categoria: "",
  fabricante: "",
  cantidad: null,
  unidad: "",
  lote: "",
  costoUnitario: null,
  costoTotal: null,
  observaciones: "",
};

const toOptions = (items: string[]) => items.map((item) => ({ value: item, label: item }));

export function InsumosCard({ mode, value, onChange }: InsumosCardProps) {
  const editable = mode !== "view";
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState<InsumoDraft>(emptyDraft);

  const openCreate = () => {
    setEditingId(null);
    setDraft(emptyDraft);
    setOpen(true);
  };

  const openEdit = (insumo: Insumo) => {
    setEditingId(insumo.id ?? null);
    setDraft({ ...insumo });
    setOpen(true);
  };

  const handleSave = () => {
    if (editingId) {
      onChange?.({
        insumos: value.insumos.map((i) => (i.id === editingId ? { ...i, ...draft } : i)),
      });
    } else {
      onChange?.({
        insumos: [...value.insumos, { id: `i-${Date.now()}`, ...draft }],
      });
    }
    setOpen(false);
  };

  const handleRemove = (id: string) => {
    onChange?.({ insumos: value.insumos.filter((i) => i.id !== id) });
  };

  const completo = Boolean(draft.producto && draft.cantidad && draft.unidad);

  return (
    <CardShell>
      <CardHeader
        icon={<Package size={20} />}
        title="Insumos Utilizados"
        description="Productos, categorías, fabricantes y costos de los insumos empleados"
        actions={
          editable ? (
            <Button variant="secondary" size="sm" onClick={openCreate} iconLeft={<Plus className="h-4 w-4" />}>
              Agregar Insumo
            </Button>
          ) : undefined
        }
      />

      <ActividadProducts
        insumos={value.insumos}
        mode={mode}
        onEdit={editable ? openEdit : undefined}
        onRemove={editable ? handleRemove : undefined}
      />

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title={editingId ? "Editar Insumo" : "Agregar Insumo"}
        maxWidth="md"
      >
        <div className="grid gap-5 sm:grid-cols-2">
          <FormField label="Producto" required className="sm:col-span-2">
            <Select
              options={toOptions(productosInsumoOpciones)}
              placeholder="Seleccione el producto"
              value={draft.producto}
              onChange={(v) => setDraft((d) => ({ ...d, producto: v }))}
            />
          </FormField>

          <FormField label="Categoría">
            <Select
              options={toOptions(categoriasInsumoOpciones)}
              placeholder="Seleccione"
              value={draft.categoria ?? ""}
              onChange={(v) => setDraft((d) => ({ ...d, categoria: v }))}
            />
          </FormField>

          <FormField label="Fabricante">
            <Select
              options={toOptions(fabricantesOpciones)}
              placeholder="Seleccione"
              value={draft.fabricante ?? ""}
              onChange={(v) => setDraft((d) => ({ ...d, fabricante: v }))}
            />
          </FormField>

          <FormField label="Cantidad" required>
            <Input
              type="text"
              inputMode="decimal"
              placeholder="Ej. 150"
              value={draft.cantidad ?? ""}
              onChange={(e) => setDraft((d) => ({ ...d, cantidad: e.target.value ? Number(e.target.value) : null }))}
            />
          </FormField>

          <FormField label="Unidad" required>
            <Select
              options={toOptions(unidadesOpciones)}
              placeholder="Seleccione"
              value={draft.unidad ?? ""}
              onChange={(v) => setDraft((d) => ({ ...d, unidad: v }))}
            />
          </FormField>

          <FormField label="Lote">
            <Select
              options={toOptions(lotesOpciones)}
              placeholder="Seleccione"
              value={draft.lote ?? ""}
              onChange={(v) => setDraft((d) => ({ ...d, lote: v }))}
            />
          </FormField>

          <FormField label="Costo Unitario">
            <Input
              type="text"
              placeholder="Ej. S/ 0.80"
              value={draft.costoUnitario ?? ""}
              onChange={(e) => setDraft((d) => ({ ...d, costoUnitario: e.target.value ? Number(e.target.value) : null }))}
            />
          </FormField>

          <FormField label="Costo Total" className="sm:col-span-2">
            <Input
              type="text"
              placeholder="Ej. S/ 120.00"
              value={draft.costoTotal ?? ""}
              onChange={(e) => setDraft((d) => ({ ...d, costoTotal: e.target.value ? Number(e.target.value) : null }))}
            />
          </FormField>

          <FormField label="Observaciones" className="sm:col-span-2">
            <Input
              type="text"
              placeholder="Notas sobre el insumo..."
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
