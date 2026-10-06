import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Save } from "lucide-react";
import { Button } from "../ui";
import type { FormMode } from "../shared/formControls";
import { InformacionGeneralCard } from "./InformacionGeneralCard";
import { InsumosCard } from "./InsumosCard";
import { ManoObraCard } from "./ManoObraCard";
import { MaquinariaCard } from "./MaquinariaCard";
import { ObservacionesCard } from "./ObservacionesCard";
import { CostosCard } from "./CostosCard";
import {
  createActividad,
  updateActividad,
  actividadToFormData,
  formDataToActividad,
  emptyActividad,
  type Actividad,
  type ActividadFormData,
} from "../../services/actividades";
import { toast } from "../../utils/toast";

type ActividadFormProps = {
  mode: Extract<FormMode, "create" | "edit">;
  values?: Actividad;
  inModal?: boolean;
  onSave?: () => void;
};

export function ActividadForm({ mode, values, inModal, onSave }: ActividadFormProps) {
  const [formData, setFormData] = useState<ActividadFormData>(() =>
    values ? actividadToFormData(values) : { ...emptyActividad },
  );
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();

  const update = (patch: Partial<ActividadFormData>) => {
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
    if (!formData.fecha) e.fecha = "La fecha es obligatoria";
    if (!formData.cultivoId) e.cultivoId = "El cultivo es obligatorio";
    if (!formData.responsableTecnico?.trim()) e.responsableTecnico = "El responsable técnico es obligatorio";
    setErrors(e);
    if (Object.keys(e).length > 0) {
      toast.error(`Campos obligatorios:\n• ${Object.values(e).join("\n• ")}`);
      return false;
    }
    return true;
  };

  const handleSave = async () => {
    if (!validate()) return;
    setSaving(true);
    try {
      const payload = formDataToActividad(formData);
      if (mode === "create") {
        await createActividad(payload);
      } else {
        await updateActividad(String(values!.id), payload);
      }
      toast.success(mode === "create" ? "Actividad registrada exitosamente" : "Actividad actualizada exitosamente");
      if (!inModal) {
        navigate("/actividades");
      } else {
        onSave?.();
      }
    } catch (err) {
      console.error(err);
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || "Error al guardar.";
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div className="grid w-full gap-4 overflow-hidden">
        <InformacionGeneralCard mode={mode} value={formData} onChange={update} errors={errors} />
        <InsumosCard mode={mode} value={formData} onChange={update} />
        <ManoObraCard mode={mode} value={formData} onChange={update} />
        <MaquinariaCard mode={mode} value={formData} onChange={update} />
        <CostosCard mode={mode} value={formData} />
        <ObservacionesCard mode={mode} value={formData} onChange={update} />
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-gray-200 bg-white px-5 py-3 shadow-sm">
        <Button variant="ghost" as="link" to="/actividades">
          Cancelar
        </Button>
        <Button onClick={handleSave} disabled={saving} iconLeft={<Save className="h-4 w-4" />}>
          {saving
            ? "Guardando..."
            : mode === "create"
              ? "Registrar Actividad"
              : "Guardar Cambios"}
        </Button>
      </div>
    </div>
  );
}
