import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Save } from "lucide-react";
import { Button } from "../ui";
import type { FormMode } from "../shared/formControls";
import { InformacionGeneralCard } from "./InformacionGeneralCard";
import { ActividadCard } from "./ActividadCard";
import { InsumosCard } from "./InsumosCard";
import { ManoObraCard } from "./ManoObraCard";
import { MaquinariaCard } from "./MaquinariaCard";
import { ObservacionesCard } from "./ObservacionesCard";
import { ResultadosCard } from "./ResultadosCard";
import {
  createActividad,
  updateActividad,
  actividadToFormData,
  formDataToActividad,
  emptyActividad,
  type Actividad,
  type ActividadFormData,
} from "../../services/actividades";

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
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();

  const update = (patch: Partial<ActividadFormData>) =>
    setFormData((prev) => ({ ...prev, ...patch }));

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload = formDataToActividad(formData);
      if (mode === "create") {
        await createActividad(payload);
      } else {
        await updateActividad(values!.id, payload);
      }
      if (!inModal) {
        navigate("/actividades");
      } else {
        onSave?.();
      }
    } catch {
      // Error handled silently - form remains open for retry
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div className="grid w-full gap-4 overflow-hidden">
        <InformacionGeneralCard mode={mode} value={formData} onChange={update} />
        <ActividadCard mode={mode} value={formData} onChange={update} />
        <InsumosCard mode={mode} value={formData} onChange={update} />
        <ManoObraCard mode={mode} value={formData} onChange={update} />
        <MaquinariaCard mode={mode} value={formData} onChange={update} />
        <ObservacionesCard mode={mode} value={formData} onChange={update} />
        <ResultadosCard mode={mode} value={formData} onChange={update} />
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
