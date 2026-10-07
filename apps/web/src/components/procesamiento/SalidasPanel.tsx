import { useState } from "react";
import { Plus, Pencil, Trash2, X } from "lucide-react";
import { Badge, Button, ConfirmDialog, Modal, Select, Input } from "../ui";
import { CardHeader, CardShell, Field, type FormMode } from "../shared/formControls";
import { useAddSalida, useUpdateSalida, useRemoveSalida } from "../../hooks/queries";
import type { OrdenSalida, SalidaInput, TipoSalida, DestinoSalida, UnidadMedida } from "../../services/ordenes";
import { toast } from "../../utils/toast";

const TIPO_OPTIONS = [
  { value: "PRODUCTO_BUENO", label: "Producto bueno" },
  { value: "MERMA", label: "Merma" },
  { value: "PIEDRAS", label: "Piedras" },
  { value: "SAPONINA", label: "Saponina" },
  { value: "ENVASE", label: "Envases" },
  { value: "OTRO", label: "Otro" },
];

const DESTINO_OPTIONS = [
  { value: "KARDEX", label: "A kardex (venta)" },
  { value: "SUBPRODUCTO", label: "Subproducto" },
  { value: "DESCARTE", label: "Descarte" },
  { value: "REPROCESO", label: "Reproceso" },
  { value: "VENTA_DIRECTA", label: "Venta directa" },
];

const UNIDAD_OPTIONS = [
  { value: "KG", label: "Kilogramos (kg)" },
  { value: "UNIDAD", label: "Unidades (u)" },
  { value: "LT", label: "Litros (L)" },
];

const TIPO_BADGES: Record<string, "forest" | "red" | "yellow" | "purple" | "green" | "gray"> = {
  PRODUCTO_BUENO: "forest",
  MERMA: "red",
  PIEDRAS: "yellow",
  SAPONINA: "purple",
  ENVASE: "green",
  OTRO: "gray",
};

interface SalidasPanelProps {
  ordenId: number;
  salidas: OrdenSalida[];
  mode: FormMode;
  onRefresh?: () => void;
}

export function SalidasPanel({ ordenId, salidas, mode, onRefresh }: SalidasPanelProps) {
  const editable = mode !== "view";
  const [modalOpen, setModalOpen] = useState(false);
  const [editando, setEditando] = useState<OrdenSalida | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<OrdenSalida | null>(null);
  const [form, setForm] = useState<SalidaInput>({
    tipo_salida: "PRODUCTO_BUENO",
    descripcion: "",
    cantidad: 0,
    unidad: "KG",
    destino: "SUBPRODUCTO",
    cuenta_en_balance: true,
    observaciones: "",
  });

  const addMutation = useAddSalida();
  const updateMutation = useUpdateSalida();
  const removeMutation = useRemoveSalida();

  const abrirNueva = () => {
    setEditando(null);
    setForm({
      tipo_salida: "PRODUCTO_BUENO",
      descripcion: "",
      cantidad: 0,
      unidad: "KG",
      destino: "SUBPRODUCTO",
      cuenta_en_balance: true,
      observaciones: "",
    });
    setModalOpen(true);
  };

  const abrirEdicion = (s: OrdenSalida) => {
    setEditando(s);
    setForm({
      tipo_salida: s.tipo_salida,
      descripcion: s.descripcion,
      cantidad: Number(s.cantidad),
      unidad: s.unidad,
      humedad: s.humedad != null ? Number(s.humedad) : null,
      destino: s.destino,
      cuenta_en_balance: s.cuenta_en_balance,
      observaciones: s.observaciones,
    });
    setModalOpen(true);
  };

  const guardar = async () => {
    if (!form.descripcion.trim()) {
      toast.error("La descripción es obligatoria");
      return;
    }
    if (form.cantidad <= 0) {
      toast.error("La cantidad debe ser mayor que 0");
      return;
    }
    try {
      if (editando) {
        await updateMutation.mutateAsync({ ordenId, salidaId: editando.id, data: form });
        toast.success("Salida actualizada");
      } else {
        await addMutation.mutateAsync({ ordenId, data: form });
        toast.success("Salida registrada");
      }
      setModalOpen(false);
      setEditando(null);
      onRefresh?.();
    } catch (err) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      toast.error(msg ?? "Error al guardar la salida");
    }
  };

  const eliminar = async () => {
    if (!deleteTarget) return;
    try {
      await removeMutation.mutateAsync({ ordenId, salidaId: deleteTarget.id });
      toast.success("Salida eliminada");
      setDeleteTarget(null);
      onRefresh?.();
    } catch {
      toast.error("Error al eliminar la salida");
    }
  };

  return (
    <CardShell>
      <CardHeader
        icon={<Plus size={20} />}
        title="Salidas pesadas"
        description="Registra todo lo que sale del proceso: producto bueno, merma, piedras, saponina, envases"
        actions={
          editable ? (
            <Button variant="secondary" onClick={abrirNueva} iconLeft={<Plus className="h-4 w-4" />}>
              Registrar salida
            </Button>
          ) : undefined
        }
      />

      {salidas.length === 0 ? (
        <p className="py-4 text-center text-sm text-gray-500">
          No hay salidas registradas todavía.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 text-left text-xs font-semibold uppercase tracking-wider text-gray-400">
                <th className="pb-2 pr-3">Tipo</th>
                <th className="pb-2 pr-3">Descripción</th>
                <th className="pb-2 pr-3 text-right">Cantidad</th>
                <th className="pb-2 pr-3">Unidad</th>
                <th className="pb-2 pr-3">Destino</th>
                <th className="pb-2 pr-3">Balance</th>
                {editable && <th className="pb-2" />}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {salidas.map((s) => (
                <tr key={s.id}>
                  <td className="py-2 pr-3">
                    <Badge variant={TIPO_BADGES[s.tipo_salida] ?? "gray"}>
                      {TIPO_OPTIONS.find((o) => o.value === s.tipo_salida)?.label ?? s.tipo_salida}
                    </Badge>
                  </td>
                  <td className="py-2 pr-3 text-[#111827]">{s.descripcion}</td>
                  <td className="py-2 pr-3 text-right font-medium text-[#111827]">
                    {Number(s.cantidad).toLocaleString("es-PE", { minimumFractionDigits: 2 })}
                  </td>
                  <td className="py-2 pr-3 text-gray-500">{s.unidad}</td>
                  <td className="py-2 pr-3 text-gray-500">
                    {DESTINO_OPTIONS.find((o) => o.value === s.destino)?.label ?? s.destino}
                  </td>
                  <td className="py-2 pr-3">
                    {s.cuenta_en_balance ? (
                      <Badge variant="forest">Cuenta</Badge>
                    ) : (
                      <Badge variant="gray">Fuera</Badge>
                    )}
                  </td>
                  {editable && (
                    <td className="py-2">
                      <div className="flex justify-end gap-1">
                        <button
                          type="button"
                          onClick={() => abrirEdicion(s)}
                          className="rounded-lg p-1.5 text-gray-400 hover:bg-forest-600/10 hover:text-forest-700"
                          aria-label="Editar"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteTarget(s)}
                          className="rounded-lg p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-600"
                          aria-label="Eliminar"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editando ? "Editar salida" : "Registrar salida"}>
        <div className="space-y-4">
          <Field label="Tipo de salida" mode="edit" required>
            <Select
              options={TIPO_OPTIONS}
              value={form.tipo_salida}
              onChange={(v) => setForm({ ...form, tipo_salida: v as TipoSalida })}
            />
          </Field>

          <Field label="Descripción" mode="edit" required>
            <Input
              value={form.descripcion}
              onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
              placeholder="Ej. Quinua beneficiada, piedras del despedrado..."
            />
          </Field>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Cantidad" mode="edit" required>
              <Input
                type="number"
                min="0"
                step="0.01"
                value={String(form.cantidad)}
                onChange={(e) => setForm({ ...form, cantidad: Number(e.target.value) || 0 })}
              />
            </Field>
            <Field label="Unidad" mode="edit">
              <Select
                options={UNIDAD_OPTIONS}
                value={form.unidad ?? "KG"}
                onChange={(v) => setForm({ ...form, unidad: v as UnidadMedida })}
              />
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Destino" mode="edit">
              <Select
                options={DESTINO_OPTIONS}
                value={form.destino ?? "SUBPRODUCTO"}
                onChange={(v) => setForm({ ...form, destino: v as DestinoSalida })}
              />
            </Field>
            <Field label="Humedad (%)" mode="edit">
              <Input
                type="number"
                min="0"
                max="100"
                step="0.1"
                value={form.humedad != null ? String(form.humedad) : ""}
                onChange={(e) => setForm({ ...form, humedad: e.target.value ? Number(e.target.value) : null })}
              />
            </Field>
          </div>

          <Field label="Observaciones" mode="edit">
            <Input
              value={form.observaciones ?? ""}
              onChange={(e) => setForm({ ...form, observaciones: e.target.value })}
              placeholder="Opcional"
            />
          </Field>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="cuenta-balance"
              checked={form.cuenta_en_balance ?? true}
              onChange={(e) => setForm({ ...form, cuenta_en_balance: e.target.checked })}
            />
            <label htmlFor="cuenta-balance" className="text-sm text-[#111827]">
              Cuenta en el balance de masa
            </label>
          </div>

          <div className="flex justify-end gap-2 border-t border-gray-100 pt-4">
            <Button variant="ghost" onClick={() => setModalOpen(false)} iconLeft={<X className="h-4 w-4" />}>
              Cancelar
            </Button>
            <Button onClick={guardar} disabled={addMutation.isPending || updateMutation.isPending}>
              {editando ? "Guardar cambios" : "Registrar salida"}
            </Button>
          </div>
        </div>
      </Modal>

      <ConfirmDialog
        open={deleteTarget !== null}
        onClose={() => setDeleteTarget(null)}
        onConfirm={eliminar}
        title="Eliminar salida"
        message="¿Estás seguro de eliminar esta salida? Se recalculará el balance."
        confirmText={removeMutation.isPending ? "Eliminando..." : "Eliminar"}
        variant="danger"
      />
    </CardShell>
  );
}
