import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Save } from "lucide-react";
import { Breadcrumb, Button, Card, FormField, Input, Select, Textarea, DatePicker, SectionHeader } from "../../components/ui";
import {
  fetchInventarioItem,
  updateInventarioItem,
  inventarioEstados,
  inventarioCategorias,
  type InventarioItem,
  type InventarioItemFormData,
} from "../../services/inventarios";

const toOptions = (items: readonly string[]) =>
  items.map((item) => ({ value: item, label: item }));

const unidadOptions = [
  { value: "KG", label: "Kilogramos (KG)" },
  { value: "LT", label: "Litros (LT)" },
  { value: "UN", label: "Unidades (UN)" },
  { value: "MT", label: "Metros (MT)" },
  { value: "M2", label: "Metros Cuadrados (M2)" },
  { value: "M3", label: "Metros Cúbicos (M3)" },
  { value: "GL", label: "Galones (GL)" },
  { value: "LB", label: "Libras (LB)" },
];

function toFormData(item: InventarioItem): InventarioItemFormData {
  return {
    codigo: item.codigo,
    producto: item.producto,
    categoria: item.categoria,
    unidad: item.unidad,
    cantidadActual: item.cantidadActual,
    cantidadMinima: item.cantidadMinima,
    cantidadMaxima: item.cantidadMaxima,
    ubicacion: item.ubicacion,
    estado: item.estado,
    loteId: item.loteId,
    fechaIngreso: item.fechaIngreso,
    fechaVencimiento: item.fechaVencimiento,
    proveedor: item.proveedor,
    costoUnitario: item.costoUnitario,
    observaciones: item.observaciones,
  };
}

export default function InventarioEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState<InventarioItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState<InventarioItemFormData | null>(null);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!id) return;
    fetchInventarioItem(id)
      .then((data) => {
        setItem(data);
        setForm(toFormData(data));
      })
      .catch(() => setItem(null))
      .finally(() => setLoading(false));
  }, [id]);

  const set = (field: keyof InventarioItemFormData, value: string | number) => {
    setForm((prev) => (prev ? { ...prev, [field]: value } : prev));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const validate = (): boolean => {
    if (!form) return false;
    const e: Record<string, string> = {};
    if (!form.codigo.trim()) e.codigo = "El código es obligatorio";
    if (!form.producto.trim()) e.producto = "El producto es obligatorio";
    if (!form.categoria) e.categoria = "La categoría es obligatoria";
    if (!form.unidad) e.unidad = "La unidad es obligatoria";
    if (form.cantidadActual < 0) e.cantidadActual = "La cantidad no puede ser negativa";
    if (form.cantidadMinima < 0) e.cantidadMinima = "La cantidad mínima no puede ser negativa";
    if (form.cantidadMaxima < 0) e.cantidadMaxima = "La cantidad máxima no puede ser negativa";
    if (form.cantidadMaxima > 0 && form.cantidadMinima > form.cantidadMaxima)
      e.cantidadMinima = "La cantidad mínima no puede ser mayor que la máxima";
    if (!form.ubicacion.trim()) e.ubicacion = "La ubicación es obligatoria";
    if (!form.estado) e.estado = "El estado es obligatorio";
    if (form.costoUnitario < 0) e.costoUnitario = "El costo no puede ser negativo";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!validate() || !form || !id) return;
    setSaving(true);
    try {
      await updateInventarioItem(id, form);
      navigate(`/inventario/${id}`);
    } catch {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-sm text-gray-400">Cargando item...</p>
      </div>
    );
  }

  if (!item || !form) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-sm text-gray-400">Item no encontrado.</p>
      </div>
    );
  }

  return (
    <div>
      <Breadcrumb
        items={[
          { label: "Inventario", to: "/inventario" },
          { label: item.codigo, to: `/inventario/${item.id}` },
          { label: "Editar Item" },
        ]}
      />

      <div className="mb-8 flex items-center gap-4">
        <Button
          variant="ghost"
          as="link"
          to={`/inventario/${item.id}`}
          iconLeft={<ArrowLeft className="h-4 w-4" />}
        >
          Volver
        </Button>
        <SectionHeader
          title="Editar Item de Inventario"
          description={`Actualizando la información de ${item.producto}`}
        />
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-500">Información Básica</h3>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <FormField label="Código" required error={errors.codigo}>
              <Input
                value={form.codigo}
                onChange={(e) => set("codigo", e.target.value)}
                placeholder="Ej: INV-001"
              />
            </FormField>
            <FormField label="Producto" required error={errors.producto} className="sm:col-span-2">
              <Input
                value={form.producto}
                onChange={(e) => set("producto", e.target.value)}
                placeholder="Nombre del producto"
              />
            </FormField>
            <FormField label="Categoría" required error={errors.categoria}>
              <Select
                options={toOptions([...inventarioCategorias])}
                placeholder="Seleccionar"
                value={form.categoria}
                onChange={(val) => set("categoria", val)}
              />
            </FormField>
            <FormField label="Unidad" required error={errors.unidad}>
              <Select
                options={unidadOptions}
                placeholder="Seleccionar"
                value={form.unidad}
                onChange={(val) => set("unidad", val)}
              />
            </FormField>
            <FormField label="Estado" required error={errors.estado}>
              <Select
                options={toOptions([...inventarioEstados])}
                placeholder="Seleccionar"
                value={form.estado}
                onChange={(val) => set("estado", val)}
              />
            </FormField>
          </div>
        </Card>

        <Card>
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-500">Stock y Cantidades</h3>
          <div className="grid gap-4 sm:grid-cols-3">
            <FormField label="Cantidad Actual" required error={errors.cantidadActual}>
              <Input
                type="number"
                min="0"
                step="0.01"
                value={form.cantidadActual}
                onChange={(e) => set("cantidadActual", Number(e.target.value))}
              />
            </FormField>
            <FormField label="Cantidad Mínima" required error={errors.cantidadMinima}>
              <Input
                type="number"
                min="0"
                step="0.01"
                value={form.cantidadMinima}
                onChange={(e) => set("cantidadMinima", Number(e.target.value))}
              />
            </FormField>
            <FormField label="Cantidad Máxima" required error={errors.cantidadMaxima}>
              <Input
                type="number"
                min="0"
                step="0.01"
                value={form.cantidadMaxima}
                onChange={(e) => set("cantidadMaxima", Number(e.target.value))}
              />
            </FormField>
          </div>
        </Card>

        <Card>
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-500">Ubicación y Lote</h3>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <FormField label="Ubicación" required error={errors.ubicacion}>
              <Input
                value={form.ubicacion}
                onChange={(e) => set("ubicacion", e.target.value)}
                placeholder="Ej: Almacén A, Estante 3"
              />
            </FormField>
            <FormField label="Lote ID" error={errors.loteId}>
              <Input
                value={form.loteId}
                onChange={(e) => set("loteId", e.target.value)}
                placeholder="Opcional"
              />
            </FormField>
            <FormField label="Costo Unitario (S/)" required error={errors.costoUnitario}>
              <Input
                type="number"
                min="0"
                step="0.01"
                value={form.costoUnitario}
                onChange={(e) => set("costoUnitario", Number(e.target.value))}
              />
            </FormField>
          </div>
        </Card>

        <Card>
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-500">Fechas y Proveedor</h3>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <FormField label="Fecha de Ingreso">
              <DatePicker
                selected={form.fechaIngreso ? new Date(form.fechaIngreso + "T00:00:00") : null}
                onChange={(date) => set("fechaIngreso", date ? date.toISOString().split("T")[0] : "")}
                placeholder="dd/mm/aaaa"
              />
            </FormField>
            <FormField label="Fecha de Vencimiento">
              <DatePicker
                selected={form.fechaVencimiento ? new Date(form.fechaVencimiento + "T00:00:00") : null}
                onChange={(date) => set("fechaVencimiento", date ? date.toISOString().split("T")[0] : "")}
                placeholder="dd/mm/aaaa"
                minDate={new Date()}
              />
            </FormField>
            <FormField label="Proveedor">
              <Input
                value={form.proveedor}
                onChange={(e) => set("proveedor", e.target.value)}
                placeholder="Nombre del proveedor"
              />
            </FormField>
          </div>
        </Card>

        <Card>
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-500">Observaciones</h3>
          <FormField label="Notas adicionales">
            <Textarea
              value={form.observaciones}
              onChange={(e) => set("observaciones", e.target.value)}
              placeholder="Detalles adicionales sobre el item..."
              rows={3}
            />
          </FormField>
        </Card>

        <div className="flex items-center justify-end gap-3">
          <Button variant="ghost" type="button" as="link" to={`/inventario/${item.id}`}>
            Cancelar
          </Button>
          <Button type="submit" disabled={saving} iconLeft={<Save className="h-4 w-4" />}>
            {saving ? "Guardando..." : "Guardar Cambios"}
          </Button>
        </div>
      </form>
    </div>
  );
}
