import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import {
  Breadcrumb,
  Button,
  Card,
  FormField,
  Input,
  Textarea,
  Select,
  DatePicker,
  SectionHeader,
  LoadingSpinner,
} from "../../components/ui";
import {
  createLote,
  emptyLoteForm,
  loteEstados,
  loteUnidades,
  type LoteFormData,
} from "../../services/lotes";

const toOptions = (items: readonly string[]) => items.map((item) => ({ value: item, label: item }));

const campaniaOpciones = [
  { value: "", label: "Seleccionar campaña" },
];

const cultivoOpciones = [
  { value: "", label: "Seleccionar cultivo" },
];

export default function LoteCreate() {
  const navigate = useNavigate();
  const [form, setForm] = useState<LoteFormData>({ ...emptyLoteForm });
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof LoteFormData, string>>>({});

  const updateField = <K extends keyof LoteFormData>(field: K, value: LoteFormData[K]) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof LoteFormData, string>> = {};

    if (!form.codigo.trim()) newErrors.codigo = "El código es obligatorio";
    if (!form.nombre.trim()) newErrors.nombre = "El nombre es obligatorio";
    if (!form.campaniaId) newErrors.campaniaId = "La campaña es obligatoria";
    if (!form.cultivoId) newErrors.cultivoId = "El cultivo es obligatorio";
    if (!form.origen.trim()) newErrors.origen = "El origen es obligatorio";
    if (form.pesoInicial <= 0) newErrors.pesoInicial = "El peso inicial debe ser mayor a 0";
    if (!form.unidad) newErrors.unidad = "La unidad es obligatoria";
    if (!form.estado) newErrors.estado = "El estado es obligatorio";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setSaving(true);
    try {
      await createLote(form);
      navigate("/lotes");
    } catch {
      setSaving(false);
    }
  };

  return (
    <div>
      <Breadcrumb items={[{ label: "Lotes", to: "/lotes" }, { label: "Nuevo Lote" }]} />

      <div className="mb-8 flex items-center gap-4">
        <Button variant="ghost" as="link" to="/lotes" iconLeft={<ArrowLeft className="h-4 w-4" />}>
          Volver
        </Button>
        <SectionHeader
          title="Nuevo Lote"
          description="Registro de un nuevo lote de producción."
        />
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card padding="md" hover={false}>
          <h3 className="mb-4 text-sm font-semibold text-[#111827]">Información General</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField label="Código" required error={errors.codigo}>
              <Input
                placeholder="Ej: LOT-001"
                value={form.codigo}
                onChange={(e) => updateField("codigo", e.target.value)}
                error={errors.codigo}
              />
            </FormField>
            <FormField label="Nombre" required error={errors.nombre}>
              <Input
                placeholder="Nombre del lote"
                value={form.nombre}
                onChange={(e) => updateField("nombre", e.target.value)}
                error={errors.nombre}
              />
            </FormField>
            <FormField label="Campaña" required error={errors.campaniaId}>
              <Select
                options={campaniaOpciones}
                placeholder="Seleccionar campaña"
                value={form.campaniaId}
                onChange={(val) => updateField("campaniaId", val)}
                error={errors.campaniaId}
              />
            </FormField>
            <FormField label="Cultivo" required error={errors.cultivoId}>
              <Select
                options={cultivoOpciones}
                placeholder="Seleccionar cultivo"
                value={form.cultivoId}
                onChange={(val) => updateField("cultivoId", val)}
                error={errors.cultivoId}
              />
            </FormField>
            <FormField label="Origen" required error={errors.origen}>
              <Input
                placeholder="Origen del lote"
                value={form.origen}
                onChange={(e) => updateField("origen", e.target.value)}
                error={errors.origen}
              />
            </FormField>
            <FormField label="Ubicación">
              <Input
                placeholder="Ubicación del lote"
                value={form.ubicacion}
                onChange={(e) => updateField("ubicacion", e.target.value)}
              />
            </FormField>
          </div>
        </Card>

        <Card padding="md" hover={false}>
          <h3 className="mb-4 text-sm font-semibold text-[#111827]">Pesos y Unidades</h3>
          <div className="grid gap-4 sm:grid-cols-3">
            <FormField label="Peso Inicial" required error={errors.pesoInicial}>
              <Input
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                value={form.pesoInicial || ""}
                onChange={(e) => updateField("pesoInicial", parseFloat(e.target.value) || 0)}
                error={errors.pesoInicial}
              />
            </FormField>
            <FormField label="Unidad" required error={errors.unidad}>
              <Select
                options={toOptions(loteUnidades)}
                placeholder="Seleccionar unidad"
                value={form.unidad}
                onChange={(val) => updateField("unidad", val)}
                error={errors.unidad}
              />
            </FormField>
            <FormField label="Estado" required error={errors.estado}>
              <Select
                options={toOptions(loteEstados)}
                placeholder="Seleccionar estado"
                value={form.estado}
                onChange={(val) => updateField("estado", val)}
                error={errors.estado}
              />
            </FormField>
          </div>
        </Card>

        <Card padding="md" hover={false}>
          <h3 className="mb-4 text-sm font-semibold text-[#111827]">Fechas y Calidad</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField label="Fecha de Producción">
              <DatePicker
                selected={form.fechaProduccion ? new Date(form.fechaProduccion) : null}
                onChange={(date) =>
                  updateField("fechaProduccion", date ? date.toISOString().split("T")[0] : "")
                }
                placeholder="Seleccionar fecha"
              />
            </FormField>
            <FormField label="Fecha de Vencimiento">
              <DatePicker
                selected={form.fechaVencimiento ? new Date(form.fechaVencimiento) : null}
                onChange={(date) =>
                  updateField("fechaVencimiento", date ? date.toISOString().split("T")[0] : "")
                }
                placeholder="Seleccionar fecha"
              />
            </FormField>
            <FormField label="Calidad">
              <Input
                placeholder="Calidad del producto"
                value={form.calidad}
                onChange={(e) => updateField("calidad", e.target.value)}
              />
            </FormField>
            <FormField label="Certificación">
              <Input
                placeholder="Certificación del lote"
                value={form.certificacion}
                onChange={(e) => updateField("certificacion", e.target.value)}
              />
            </FormField>
          </div>
        </Card>

        <Card padding="md" hover={false}>
          <h3 className="mb-4 text-sm font-semibold text-[#111827]">Observaciones</h3>
          <FormField label="Observaciones">
            <Textarea
              placeholder="Notas adicionales sobre el lote..."
              rows={4}
              value={form.observaciones}
              onChange={(e) => updateField("observaciones", e.target.value)}
            />
          </FormField>
        </Card>

        <div className="flex justify-end gap-3">
          <Button variant="ghost" as="link" to="/lotes">
            Cancelar
          </Button>
          <Button type="submit" loading={saving}>
            Guardar Lote
          </Button>
        </div>
      </form>
    </div>
  );
}
