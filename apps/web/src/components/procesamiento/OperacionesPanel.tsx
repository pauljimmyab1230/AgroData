import { useState } from "react";
import { CheckCircle2, Circle, Plus, Trash2 } from "lucide-react";
import { Badge, Button, ConfirmDialog, Modal, Select, Input } from "../ui";
import { CardHeader, CardShell, Field, type FormMode } from "../shared/formControls";
import { useAddOperacion, useUpdateOperacion, useRemoveOperacion } from "../../hooks/queries";
import type { OrdenOperacion, OperacionProceso, OperacionEjecutadaInput } from "../../services/ordenes";
import { toast } from "../../utils/toast";

interface OperacionesPanelProps {
  ordenId: number;
  operaciones: OrdenOperacion[];
  catalogo: OperacionProceso[];
  mode: FormMode;
  onRefresh?: () => void;
}

export function OperacionesPanel({ ordenId, operaciones, catalogo, mode, onRefresh }: OperacionesPanelProps) {
  const editable = mode !== "view";
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<OrdenOperacion | null>(null);
  const [form, setForm] = useState<OperacionEjecutadaInput>({
    operacion_id: 0,
    orden: 0,
    operario: "",
    peso_antes: null,
    peso_despues: null,
    humedad: null,
    resultado: "",
    observaciones: "",
    completada: true,
  });

  const addMutation = useAddOperacion();
  const updateMutation = useUpdateOperacion();
  const removeMutation = useRemoveOperacion();

  const abrirNueva = () => {
    const idsUsados = new Set(operaciones.map((o) => o.operacion.id));
    const primeraDisponible = catalogo.find((c) => !idsUsados.has(c.id));
    setForm({
      operacion_id: primeraDisponible?.id ?? 0,
      orden: operaciones.length + 1,
      operario: "",
      peso_antes: null,
      peso_despues: null,
      humedad: null,
      resultado: "",
      observaciones: "",
      completada: true,
    });
    setModalOpen(true);
  };

  const guardar = async () => {
    if (!form.operacion_id) {
      toast.error("Selecciona una operación");
      return;
    }
    try {
      await addMutation.mutateAsync({ ordenId, data: form });
      toast.success("Operación registrada");
      setModalOpen(false);
      onRefresh?.();
    } catch (err) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      toast.error(msg ?? "Error al registrar la operación");
    }
  };

  const alternarCompletada = async (op: OrdenOperacion) => {
    try {
      await updateMutation.mutateAsync({
        ordenId,
        operacionOrdenId: op.id,
        data: { completada: !op.completada },
      });
      onRefresh?.();
    } catch {
      toast.error("Error al actualizar la operación");
    }
  };

  const eliminar = async () => {
    if (!deleteTarget) return;
    try {
      await removeMutation.mutateAsync({ ordenId, operacionOrdenId: deleteTarget.id });
      toast.success("Operación eliminada");
      setDeleteTarget(null);
      onRefresh?.();
    } catch {
      toast.error("Error al eliminar la operación");
    }
  };

  return (
    <CardShell>
      <CardHeader
        icon={<CheckCircle2 size={20} />}
        title="Procesos ejecutados"
        description={`${operaciones.filter((o) => o.completada).length} de ${operaciones.length} completados`}
        actions={
          editable ? (
            <Button variant="secondary" onClick={abrirNueva} iconLeft={<Plus className="h-4 w-4" />}>
              Registrar proceso
            </Button>
          ) : undefined
        }
      />

      {operaciones.length === 0 ? (
        <p className="py-4 text-center text-sm text-gray-500">
          No hay procesos registrados todavía.
        </p>
      ) : (
        <ul className="divide-y divide-gray-100">
          {operaciones.map((op) => (
            <li key={op.id} className="flex items-center gap-3 py-2.5">
              <button
                type="button"
                onClick={() => alternarCompletada(op)}
                disabled={!editable}
                className="shrink-0 disabled:opacity-50"
                aria-label={op.completada ? "Marcar como pendiente" : "Marcar como completada"}
              >
                {op.completada ? (
                  <CheckCircle2 className="h-5 w-5 text-forest-600" />
                ) : (
                  <Circle className="h-5 w-5 text-gray-300" />
                )}
              </button>

              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-[#111827]">
                  <span className="mr-2 text-xs text-gray-400">{op.orden}.</span>
                  {op.operacion.nombre}
                </p>
                <div className="mt-0.5 flex flex-wrap gap-2 text-xs text-gray-500">
                  {op.operario && <span>Operario: {op.operario}</span>}
                  {op.peso_antes != null && <span>Antes: {Number(op.peso_antes).toLocaleString("es-PE")} kg</span>}
                  {op.peso_despues != null && <span>Después: {Number(op.peso_despues).toLocaleString("es-PE")} kg</span>}
                  {op.humedad != null && <span>Humedad: {Number(op.humedad)}%</span>}
                  {op.resultado && <Badge variant="gray">{op.resultado}</Badge>}
                </div>
                {op.observaciones && (
                  <p className="mt-0.5 text-xs text-gray-400">{op.observaciones}</p>
                )}
              </div>

              {editable && (
                <button
                  type="button"
                  onClick={() => setDeleteTarget(op)}
                  className="shrink-0 rounded-lg p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-600"
                  aria-label="Eliminar"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              )}
            </li>
          ))}
        </ul>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Registrar proceso ejecutado">
        <div className="space-y-4">
          <Field label="Operación" mode="edit" required>
            <Select
              options={catalogo.map((c) => ({ value: String(c.id), label: `${c.nombre} (${c.codigo})` }))}
              value={String(form.operacion_id)}
              onChange={(v) => setForm({ ...form, operacion_id: Number(v) })}
            />
          </Field>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Operario" mode="edit">
              <Input
                value={form.operario ?? ""}
                onChange={(e) => setForm({ ...form, operario: e.target.value })}
                placeholder="Nombre del operario"
              />
            </Field>
            <Field label="Resultado" mode="edit">
              <Input
                value={form.resultado ?? ""}
                onChange={(e) => setForm({ ...form, resultado: e.target.value })}
                placeholder="Ej. OK, Con observaciones"
              />
            </Field>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <Field label="Peso antes (kg)" mode="edit">
              <Input
                type="number"
                min="0"
                step="0.01"
                value={form.peso_antes != null ? String(form.peso_antes) : ""}
                onChange={(e) => setForm({ ...form, peso_antes: e.target.value ? Number(e.target.value) : null })}
              />
            </Field>
            <Field label="Peso después (kg)" mode="edit">
              <Input
                type="number"
                min="0"
                step="0.01"
                value={form.peso_despues != null ? String(form.peso_despues) : ""}
                onChange={(e) => setForm({ ...form, peso_despues: e.target.value ? Number(e.target.value) : null })}
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

          <div className="flex justify-end gap-2 border-t border-gray-100 pt-4">
            <Button variant="ghost" onClick={() => setModalOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={guardar} disabled={addMutation.isPending}>
              Registrar
            </Button>
          </div>
        </div>
      </Modal>

      <ConfirmDialog
        open={deleteTarget !== null}
        onClose={() => setDeleteTarget(null)}
        onConfirm={eliminar}
        title="Eliminar proceso"
        message="¿Estás seguro de eliminar este proceso registrado?"
        confirmText={removeMutation.isPending ? "Eliminando..." : "Eliminar"}
        variant="danger"
      />
    </CardShell>
  );
}
