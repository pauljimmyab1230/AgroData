import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Save } from "lucide-react";
import { Button, DatePicker, Input, Select, Textarea } from "../ui";
import { useCreateCampania, useUpdateCampania } from "../../hooks/queries";
import type { Campania, CampaniaFormData } from "../../services/campanias";
import { aniosAgricolas } from "../../constants/campanias";
import { toast } from "../../utils/toast";

const toOptions = (items: string[]) => items.map((item) => ({ value: item, label: item }));

const estadoOptions = [
  { value: "PLANIFICADA", label: "Planificada" },
  { value: "ACTIVA", label: "Activa" },
  { value: "FINALIZADA", label: "Finalizada" },
  { value: "CANCELADA", label: "Cancelada" },
];

const emptyForm: CampaniaFormData = {
  codigo: "",
  nombre: "",
  anioAgricola: "",
  fechaInicio: "",
  fechaFin: "",
  descripcion: "",
  estado: "PLANIFICADA",
  responsable: "",
  tecnicoCoordinador: "",
  objetivo: "",
  permitirCultivos: true,
  permitirActividades: true,
  permitirCosechas: true,
  permitirInspecciones: true,
  permitirAcopio: true,
  permitirProcesamiento: true,
  visible: true,
  activa: false,
  observaciones: "",
};

function campaniaToForm(c: Campania): CampaniaFormData {
  return {
    codigo: c.codigo,
    nombre: c.nombre,
    anioAgricola: c.anioAgricola,
    fechaInicio: c.fechaInicio,
    fechaFin: c.fechaFin,
    descripcion: c.descripcion,
    estado: c.estado,
    responsable: c.responsable,
    tecnicoCoordinador: c.tecnicoCoordinador,
    objetivo: c.objetivo,
    permitirCultivos: c.permitirCultivos,
    permitirActividades: c.permitirActividades,
    permitirCosechas: c.permitirCosechas,
    permitirInspecciones: c.permitirInspecciones,
    permitirAcopio: c.permitirAcopio,
    permitirProcesamiento: c.permitirProcesamiento,
    visible: c.visible,
    activa: c.activa,
    observaciones: c.observaciones,
  };
}

type CampaniaFormProps = {
  mode: "create" | "edit";
  values?: Campania;
  inModal?: boolean;
  onSave?: () => void;
};

export function CampaniaForm({ mode, values, inModal, onSave }: CampaniaFormProps) {
  const [formData, setFormData] = useState<CampaniaFormData>(() =>
    values ? campaniaToForm(values) : { ...emptyForm },
  );
  const [errors, setErrors] = useState<Record<string, string>>({});
  const navigate = useNavigate();
  const createMutation = useCreateCampania();
  const updateMutation = useUpdateCampania();
  const saving = createMutation.isPending || updateMutation.isPending;

  const update = (patch: Partial<CampaniaFormData>) => {
    setFormData((prev) => ({ ...prev, ...patch }));
    const keys = Object.keys(patch);
    setErrors((prev) => {
      const hasAny = keys.some((k) => k in prev);
      if (!hasAny) return prev;
      const next = { ...prev };
      for (const key of keys) delete next[key];
      return next;
    });
  };

  const validate = (): boolean => {
    const e: Record<string, string> = {};
    if (!formData.nombre.trim()) e.nombre = "El nombre es obligatorio";
    if (!formData.anioAgricola) e.anioAgricola = "El año agrícola es obligatorio";
    if (!formData.fechaInicio) e.fechaInicio = "La fecha de inicio es obligatoria";
    if (!formData.fechaFin) e.fechaFin = "La fecha de fin es obligatoria";
    if (!formData.responsable.trim()) e.responsable = "El responsable es obligatorio";
    if (!formData.tecnicoCoordinador.trim()) e.tecnicoCoordinador = "El técnico coordinador es obligatorio";
    if (!formData.objetivo.trim()) e.objetivo = "El objetivo es obligatorio";
    if (formData.fechaInicio && formData.fechaFin && formData.fechaInicio > formData.fechaFin) {
      e.fechaFin = "La fecha de fin debe ser posterior a la de inicio";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) {
      toast.error("Complete los campos obligatorios");
      return;
    }
    try {
      if (mode === "create") {
        await createMutation.mutateAsync(formData);
        toast.success("Campaña creada exitosamente");
        if (!inModal) navigate("/campanias");
        else onSave?.();
      } else {
        if (!values?.id) return;
        await updateMutation.mutateAsync({ id: values.id, data: formData });
        toast.success("Campaña actualizada exitosamente");
        if (!inModal) navigate(`/campanias/${values.id}`);
        else onSave?.();
      }
    } catch (err: unknown) {
      console.error(err);
      const axiosError = err as { response?: { data?: { message?: string } } };
      toast.error(axiosError?.response?.data?.message || "Error al guardar. Verifique los datos.");
    }
  };

  return (
    <div className="space-y-6">
      {/* Datos Generales */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h3 className="mb-4 text-sm font-semibold text-gray-900">Información General</h3>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-500">Código</label>
            <Input value={formData.codigo} disabled placeholder="Se genera automáticamente" />
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-gray-500">Nombre <span className="text-red-500">*</span></label>
            <Input value={formData.nombre} onChange={(e) => update({ nombre: e.target.value })} placeholder="Ej. Campaña 2025-2026" />
            {errors.nombre && <p className="mt-1 text-xs text-red-500">{errors.nombre}</p>}
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-gray-500">Año Agrícola <span className="text-red-500">*</span></label>
            <Select options={toOptions(aniosAgricolas)} placeholder="Seleccione" value={formData.anioAgricola} onChange={(v) => update({ anioAgricola: v })} />
            {errors.anioAgricola && <p className="mt-1 text-xs text-red-500">{errors.anioAgricola}</p>}
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-gray-500">Fecha de Inicio <span className="text-red-500">*</span></label>
            <DatePicker
              selected={formData.fechaInicio ? new Date(formData.fechaInicio + "T00:00:00") : null}
              onChange={(date) => update({ fechaInicio: date?.toISOString().split("T")[0] ?? "" })}
            />
            {errors.fechaInicio && <p className="mt-1 text-xs text-red-500">{errors.fechaInicio}</p>}
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-gray-500">Fecha de Fin <span className="text-red-500">*</span></label>
            <DatePicker
              selected={formData.fechaFin ? new Date(formData.fechaFin + "T00:00:00") : null}
              onChange={(date) => update({ fechaFin: date?.toISOString().split("T")[0] ?? "" })}
            />
            {errors.fechaFin && <p className="mt-1 text-xs text-red-500">{errors.fechaFin}</p>}
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-gray-500">Estado</label>
            <Select options={estadoOptions} placeholder="Seleccione" value={formData.estado} onChange={(v) => update({ estado: v as CampaniaFormData["estado"] })} />
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-gray-500">Responsable <span className="text-red-500">*</span></label>
            <Input value={formData.responsable} onChange={(e) => update({ responsable: e.target.value })} placeholder="Nombre del responsable" />
            {errors.responsable && <p className="mt-1 text-xs text-red-500">{errors.responsable}</p>}
          </div>

          <div className="sm:col-span-2">
            <label className="mb-1 block text-xs font-medium text-gray-500">Técnico Coordinador <span className="text-red-500">*</span></label>
            <Input value={formData.tecnicoCoordinador} onChange={(e) => update({ tecnicoCoordinador: e.target.value })} placeholder="Nombre del técnico coordinador" />
            {errors.tecnicoCoordinador && <p className="mt-1 text-xs text-red-500">{errors.tecnicoCoordinador}</p>}
          </div>

          <div className="sm:col-span-2 lg:col-span-3">
            <label className="mb-1 block text-xs font-medium text-gray-500">Descripción</label>
            <Textarea rows={2} value={formData.descripcion} onChange={(e) => update({ descripcion: e.target.value })} placeholder="Alcance general de la campaña..." />
          </div>

          <div className="sm:col-span-2 lg:col-span-3">
            <label className="mb-1 block text-xs font-medium text-gray-500">Objetivo <span className="text-red-500">*</span></label>
            <Textarea rows={2} value={formData.objetivo} onChange={(e) => update({ objetivo: e.target.value })} placeholder="Describe el objetivo principal..." />
            {errors.objetivo && <p className="mt-1 text-xs text-red-500">{errors.objetivo}</p>}
          </div>

          <div className="sm:col-span-2 lg:col-span-3">
            <label className="mb-1 block text-xs font-medium text-gray-500">Observaciones</label>
            <Textarea rows={2} value={formData.observaciones} onChange={(e) => update({ observaciones: e.target.value })} placeholder="Notas generales..." />
          </div>
        </div>
      </div>

      {/* Save button */}
      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={saving} iconLeft={<Save className="h-4 w-4" />}>
          {saving ? "Guardando..." : mode === "create" ? "Crear Campaña" : "Guardar Cambios"}
        </Button>
      </div>
    </div>
  );
}
