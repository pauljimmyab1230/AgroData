import { useState } from "react";
import { useParams } from "react-router-dom";
import { ArrowLeft, Calendar, DollarSign, MapPin, Package, Pencil, Plus, TrendingUp, User, Trash2 } from "lucide-react";
import { Button, Card, Badge, FormField, Input, Select, Textarea, DatePicker, ConfirmDialog } from "../../components/ui";
import { useKardexItem, useAddMovimiento, useRemoveMovimiento } from "../../hooks/queries";
import {
  calcularValorInventario,
  formatearFecha,
} from "../../services/kardex";

const estadoBadgeVariant: Record<string, "green" | "yellow" | "red" | "gray"> = {
  DISPONIBLE: "green",
  RESERVADO: "yellow",
  CONSUMIDO: "red",
  VENCIDO: "gray",
};

const categoriaLabels: Record<string, string> = {
  MATERIA_PRIMA: "Materia Prima",
  PRODUCTO_TERMINADO: "Producto Terminado",
  EMPAQUE: "Empaque",
  INSUMO: "Insumo",
};

const tipoMovimientoOptions = [
  { value: "ENTRADA", label: "Entrada" },
  { value: "SALIDA", label: "Salida" },
  { value: "TRANSFERENCIA", label: "Transferencia" },
  { value: "AJUSTE", label: "Ajuste" },
];

export default function KardexView() {
  const { id } = useParams();
  const { data: item, isLoading: loading } = useKardexItem(id);
  const addMovimientoMutation = useAddMovimiento();
  const removeMovimientoMutation = useRemoveMovimiento();
  const [showMovimientoForm, setShowMovimientoForm] = useState(false);
  const [movimientoForm, setMovimientoForm] = useState({
    tipo: "ENTRADA",
    cantidad: 0,
    destino: "",
    referencia: "",
    responsable: "",
    observaciones: "",
    fecha: new Date().toISOString().split("T")[0],
  });
  const [saving, setSaving] = useState(false);
  const [deleteMovimientoId, setDeleteMovimientoId] = useState<number | null>(null);

  const handleAddMovimiento = async () => {
    if (!id || !movimientoForm.cantidad) return;
    setSaving(true);
    try {
      await addMovimientoMutation.mutateAsync({ kardexId: id, data: movimientoForm });
      setShowMovimientoForm(false);
      setMovimientoForm({
        tipo: "ENTRADA",
        cantidad: 0,
        destino: "",
        referencia: "",
        responsable: "",
        observaciones: "",
        fecha: new Date().toISOString().split("T")[0],
      });
    } catch {
      // ignore
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteMovimiento = async () => {
    if (!id || !deleteMovimientoId) return;
    try {
      await removeMovimientoMutation.mutateAsync({ kardexId: id, movimientoId: deleteMovimientoId });
      setDeleteMovimientoId(null);
    } catch {
      // ignore
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-sm text-gray-400">Cargando item...</p>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-sm text-gray-400">Item no encontrado.</p>
      </div>
    );
  }

  const valorTotal = calcularValorInventario(item.cantidadActual, item.costoUnitario);

  return (
    <div>
      <div className="mb-8 flex items-center gap-4">
        <Button variant="ghost" as="link" to="/kardex" iconLeft={<ArrowLeft className="h-4 w-4" />}>
          Kardex
        </Button>
      </div>

      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#111827]">{item.producto}</h1>
          <p className="text-sm text-gray-500">{item.codigo}</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="primary"
            onClick={() => setShowMovimientoForm(true)}
            iconLeft={<Plus className="h-4 w-4" />}
          >
            Nuevo Movimiento
          </Button>
          <Button
            variant="secondary"
            as="link"
            to={`/kardex/${item.id}/editar`}
            iconLeft={<Pencil className="h-4 w-4" />}
          >
            Editar
          </Button>
        </div>
      </div>

      <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-gray-500">Saldo Actual</p>
              <p className="mt-1.5 text-2xl font-bold text-[#111827]">{item.cantidadActual} {item.unidad}</p>
            </div>
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-forest-600/10 text-forest-600">
              <Package className="h-5 w-5" />
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-gray-500">Stock Mínimo</p>
              <p className="mt-1.5 text-2xl font-bold text-[#111827]">{item.cantidadMinima ?? "—"} {item.unidad}</p>
            </div>
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-100 text-amber-700">
              <TrendingUp className="h-5 w-5" />
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-gray-500">Estado</p>
              <p className="mt-1.5 text-2xl font-bold text-[#111827]">
                <Badge variant={estadoBadgeVariant[item.estado] || "gray"}>{item.estado}</Badge>
              </p>
            </div>
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
              <Package className="h-5 w-5" />
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-gray-500">Valor Total</p>
              <p className="mt-1.5 text-2xl font-bold text-[#111827]">S/ {valorTotal.toFixed(2)}</p>
            </div>
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-100 text-purple-600">
              <DollarSign className="h-5 w-5" />
            </div>
          </div>
        </Card>
      </div>

      {showMovimientoForm && (
        <Card className="mb-6">
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-500">Nuevo Movimiento</h3>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <FormField label="Tipo" required>
              <Select
                options={tipoMovimientoOptions}
                value={movimientoForm.tipo}
                onChange={(val) => setMovimientoForm((prev) => ({ ...prev, tipo: val }))}
              />
            </FormField>
            <FormField label="Cantidad" required>
              <Input
                type="number"
                min="0.01"
                step="0.01"
                value={movimientoForm.cantidad}
                onChange={(e) => setMovimientoForm((prev) => ({ ...prev, cantidad: Number(e.target.value) }))}
              />
            </FormField>
            <FormField label="Fecha">
              <DatePicker
                selected={movimientoForm.fecha ? new Date(movimientoForm.fecha + "T00:00:00") : null}
                onChange={(date) => setMovimientoForm((prev) => ({
                  ...prev,
                  fecha: date ? date.toISOString().split("T")[0] : "",
                }))}
                placeholder="dd/mm/aaaa"
              />
            </FormField>
            <FormField label="Destino">
              <Input
                value={movimientoForm.destino}
                onChange={(e) => setMovimientoForm((prev) => ({ ...prev, destino: e.target.value }))}
                placeholder="Destino del movimiento"
              />
            </FormField>
            <FormField label="Referencia">
              <Input
                value={movimientoForm.referencia}
                onChange={(e) => setMovimientoForm((prev) => ({ ...prev, referencia: e.target.value }))}
                placeholder="Referencia del movimiento"
              />
            </FormField>
            <FormField label="Responsable">
              <Input
                value={movimientoForm.responsable}
                onChange={(e) => setMovimientoForm((prev) => ({ ...prev, responsable: e.target.value }))}
                placeholder="Persona responsable"
              />
            </FormField>
          </div>
          <FormField label="Observaciones" className="mt-4">
            <Textarea
              value={movimientoForm.observaciones}
              onChange={(e) => setMovimientoForm((prev) => ({ ...prev, observaciones: e.target.value }))}
              placeholder="Detalles del movimiento..."
              rows={2}
            />
          </FormField>
          <div className="mt-4 flex justify-end gap-2">
            <Button variant="ghost" onClick={() => setShowMovimientoForm(false)}>
              Cancelar
            </Button>
            <Button onClick={handleAddMovimiento} disabled={saving}>
              {saving ? "Guardando..." : "Registrar Movimiento"}
            </Button>
          </div>
        </Card>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-500">Información Básica</h3>
          <div className="space-y-3">
            <div className="flex justify-between border-b border-gray-100 py-2">
              <span className="text-sm text-gray-500">Código</span>
              <span className="text-sm font-medium text-[#111827]">{item.codigo}</span>
            </div>
            <div className="flex justify-between border-b border-gray-100 py-2">
              <span className="text-sm text-gray-500">Producto</span>
              <span className="text-sm font-medium text-[#111827]">{item.producto}</span>
            </div>
            <div className="flex justify-between border-b border-gray-100 py-2">
              <span className="text-sm text-gray-500">Categoría</span>
              <Badge variant="forest">{categoriaLabels[item.categoria] || item.categoria}</Badge>
            </div>
            <div className="flex justify-between border-b border-gray-100 py-2">
              <span className="text-sm text-gray-500">Unidad</span>
              <span className="text-sm font-medium text-[#111827]">{item.unidad}</span>
            </div>
            <div className="flex justify-between border-b border-gray-100 py-2">
              <span className="text-sm text-gray-500">Ubicación</span>
              <span className="text-sm font-medium text-[#111827] flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5 text-gray-400" /> {item.ubicacion}
              </span>
            </div>
            <div className="flex justify-between border-b border-gray-100 py-2">
              <span className="text-sm text-gray-500">Costo Unitario</span>
              <span className="text-sm font-medium text-[#111827]">S/ {item.costoUnitario != null ? item.costoUnitario.toFixed(2) : "—"}</span>
            </div>
            <div className="flex justify-between border-b border-gray-100 py-2">
              <span className="text-sm text-gray-500">Proveedor</span>
              <span className="text-sm font-medium text-[#111827] flex items-center gap-1.5">
                <User className="h-3.5 w-3.5 text-gray-400" /> {item.proveedor || "—"}
              </span>
            </div>
            <div className="flex justify-between border-b border-gray-100 py-2">
              <span className="text-sm text-gray-500">Fecha de Ingreso</span>
              <span className="text-sm font-medium text-[#111827] flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5 text-gray-400" /> {formatearFecha(item.fechaIngreso) || "—"}
              </span>
            </div>
            <div className="flex justify-between border-b border-gray-100 py-2">
              <span className="text-sm text-gray-500">Fecha de Vencimiento</span>
              <span className="text-sm font-medium text-[#111827] flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5 text-gray-400" /> {formatearFecha(item.fechaVencimiento) || "—"}
              </span>
            </div>
            {item.observaciones && (
              <div className="flex justify-between py-2">
                <span className="text-sm text-gray-500">Observaciones</span>
                <span className="max-w-xs text-right text-sm text-[#111827]">{item.observaciones}</span>
              </div>
            )}
          </div>
        </Card>

        <Card>
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-500">Historial de Movimientos</h3>
          {item.movimientos.length === 0 ? (
            <p className="py-8 text-center text-sm text-gray-400">No hay movimientos registrados.</p>
          ) : (
            <div className="space-y-3">
              {item.movimientos.map((m) => (
                <div
                  key={m.id}
                  className="flex items-start gap-3 rounded-xl border border-gray-100 p-3"
                >
                  <div
                    className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-xs font-bold ${
                      m.tipo === "ENTRADA"
                        ? "bg-emerald-100 text-emerald-700"
                        : m.tipo === "SALIDA"
                          ? "bg-red-100 text-red-700"
                          : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {m.tipo === "ENTRADA" ? "+" : m.tipo === "SALIDA" ? "-" : "~"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-sm font-medium text-[#111827]">{m.tipo}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-400">{formatearFecha(m.fecha)}</span>
                        <button
                          onClick={() => setDeleteMovimientoId(m.id || null)}
                          className="rounded p-1 text-gray-400 hover:bg-red-50 hover:text-red-600"
                          title="Eliminar movimiento"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                    <p className="mt-0.5 text-sm text-gray-500">
                      {m.cantidad} {item.unidad} — Saldo: {m.saldoAnterior} → {m.saldoPosterior}
                    </p>
                    {m.destino && (
                      <p className="mt-0.5 text-xs text-gray-400">Destino: {m.destino}</p>
                    )}
                    {m.referencia && (
                      <p className="mt-0.5 text-xs text-gray-400">Ref: {m.referencia}</p>
                    )}
                    {m.observaciones && (
                      <p className="mt-0.5 text-xs text-gray-400">{m.observaciones}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      <ConfirmDialog
        open={deleteMovimientoId !== null}
        onClose={() => setDeleteMovimientoId(null)}
        onConfirm={handleDeleteMovimiento}
        title="Eliminar Movimiento"
        message="¿Estás seguro de eliminar este movimiento? El saldo se recalculará automáticamente."
        confirmText="Eliminar"
        variant="danger"
      />
    </div>
  );
}
