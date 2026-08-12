import { useState } from "react";
import { ArrowLeft, Save } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Breadcrumb, Button, Card, FormField, Input, Select, Textarea, SectionHeader } from "../../components/ui";
import {
  createTrazabilidad,
  emptyTrazabilidadForm,
  trazabilidadEstados,
  type TrazabilidadFormData,
} from "../../services/trazabilidades";

const toOptions = (items: readonly string[]) =>
  items.map((item) => ({
    value: item,
    label: item.replace(/_/g, " ").toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase()),
  }));

const certOptions = ["ORGANICO", "CONVENCIONAL", "FAIR_TRADE", "RAINFOREST", "GLOBAL_G.A.P."].map((v) => ({
  value: v,
  label: v.replace(/_/g, " "),
}));

const unidadOptions = ["KG", "LB", "TON", "UNIDAD"].map((v) => ({ value: v, label: v }));

export default function TrazabilidadCreate() {
  const navigate = useNavigate();
  const [form, setForm] = useState<TrazabilidadFormData>({ ...emptyTrazabilidadForm });
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const set = (key: keyof TrazabilidadFormData, value: string | number) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    if (!form.codigo.trim()) errs.codigo = "Requerido";
    if (!form.loteId.trim()) errs.loteId = "Requerido";
    if (!form.producto.trim()) errs.producto = "Requerido";
    if (!form.cultivo.trim()) errs.cultivo = "Requerido";
    if (!form.origen.trim()) errs.origen = "Requerido";
    if (!form.productor.trim()) errs.productor = "Requerido";
    if (form.pesoTotal <= 0) errs.pesoTotal = "Debe ser mayor a 0";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSaving(true);
    try {
      await createTrazabilidad(form);
      navigate("/trazabilidad");
    } catch {
      setSaving(false);
    }
  };

  return (
    <div>
      <Breadcrumb items={[{ label: "Trazabilidad", to: "/trazabilidad" }, { label: "Nuevo Registro" }]} />

      <div className="mb-8 flex items-center gap-4">
        <Button variant="ghost" as="link" to="/trazabilidad" iconLeft={<ArrowLeft className="h-4 w-4" />}>
          Volver
        </Button>
        <SectionHeader
          title="Nuevo Registro de Trazabilidad"
          description="Complete los datos para registrar un nuevo seguimiento en la cadena productiva."
        />
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card padding="md">
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-500">Informacion del Producto</h3>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <FormField label="Codigo" required error={errors.codigo}>
              <Input value={form.codigo} onChange={(e) => set("codigo", e.target.value)} placeholder="TRZ-001" />
            </FormField>
            <FormField label="Lote ID" required error={errors.loteId}>
              <Input value={form.loteId} onChange={(e) => set("loteId", e.target.value)} placeholder="ID del lote" />
            </FormField>
            <FormField label="Producto" required error={errors.producto}>
              <Input value={form.producto} onChange={(e) => set("producto", e.target.value)} placeholder="Cafe Arabica" />
            </FormField>
            <FormField label="Cultivo" required error={errors.cultivo}>
              <Input value={form.cultivo} onChange={(e) => set("cultivo", e.target.value)} placeholder="Cafe" />
            </FormField>
            <FormField label="Origen" required error={errors.origen}>
              <Input value={form.origen} onChange={(e) => set("origen", e.target.value)} placeholder="San Martin" />
            </FormField>
            <FormField label="Unidad">
              <Select options={unidadOptions} value={form.unidad} onChange={(val) => set("unidad", val)} />
            </FormField>
          </div>
        </Card>

        <Card padding="md">
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-500">Datos de Produccion</h3>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <FormField label="Productor" required error={errors.productor}>
              <Input value={form.productor} onChange={(e) => set("productor", e.target.value)} placeholder="Juan Perez" />
            </FormField>
            <FormField label="Parcela">
              <Input value={form.parcela} onChange={(e) => set("parcela", e.target.value)} placeholder="Parcela A" />
            </FormField>
            <FormField label="Comunidad">
              <Input value={form.comunidad} onChange={(e) => set("comunidad", e.target.value)} placeholder="Comunidad San Jose" />
            </FormField>
            <FormField label="Fecha Siembra">
              <Input type="date" value={form.fechaSiembra} onChange={(e) => set("fechaSiembra", e.target.value)} />
            </FormField>
            <FormField label="Fecha Cosecha">
              <Input type="date" value={form.fechaCosecha} onChange={(e) => set("fechaCosecha", e.target.value)} />
            </FormField>
            <FormField label="Fecha Procesamiento">
              <Input type="date" value={form.fechaProcesamiento} onChange={(e) => set("fechaProcesamiento", e.target.value)} />
            </FormField>
          </div>
        </Card>

        <Card padding="md">
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-500">Calidad y Certificacion</h3>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <FormField label="Peso Total (kg)" required error={errors.pesoTotal}>
              <Input
                type="number"
                min={0}
                step={0.01}
                value={form.pesoTotal}
                onChange={(e) => set("pesoTotal", parseFloat(e.target.value) || 0)}
              />
            </FormField>
            <FormField label="Calidad">
              <Input value={form.calidad} onChange={(e) => set("calidad", e.target.value)} placeholder="Extra, Premium..." />
            </FormField>
            <FormField label="Certificacion">
              <Select
                options={certOptions}
                placeholder="Sin certificacion"
                value={form.certificacion}
                onChange={(val) => set("certificacion", val)}
              />
            </FormField>
            <FormField label="Destino">
              <Input value={form.destino} onChange={(e) => set("destino", e.target.value)} placeholder="Lima, Exportacion..." />
            </FormField>
            <FormField label="Estado">
              <Select options={toOptions(trazabilidadEstados)} value={form.estado} onChange={(val) => set("estado", val)} />
            </FormField>
          </div>
        </Card>

        <Card padding="md">
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-500">Observaciones</h3>
          <FormField label="Observaciones">
            <Textarea
              rows={4}
              value={form.observaciones}
              onChange={(e) => set("observaciones", e.target.value)}
              placeholder="Notas adicionales sobre el registro..."
            />
          </FormField>
        </Card>

        <div className="flex justify-end gap-3">
          <Button variant="ghost" as="link" to="/trazabilidad">
            Cancelar
          </Button>
          <Button type="submit" loading={saving} iconLeft={<Save className="h-4 w-4" />}>
            Crear Registro
          </Button>
        </div>
      </form>
    </div>
  );
}
