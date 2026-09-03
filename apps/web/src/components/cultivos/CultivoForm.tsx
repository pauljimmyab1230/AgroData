import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { DatosGeneralesCard } from "./DatosGeneralesCard";
import { InformacionCultivoCard } from "./InformacionCultivoCard";
import { InformacionTecnicaCard } from "./InformacionTecnicaCard";
import { EstimacionProduccionCard } from "./EstimacionProduccionCard";
import { ObservacionesCard } from "./ObservacionesCard";
import ActionButtons from "./ActionButtons";
import { createCultivo, updateCultivo, type Cultivo } from "../../services/cultivos";
import { toast } from "../../utils/toast";
import type { FormMode } from "../shared/formControls";

type CultivoFormData = Partial<Cultivo>;

interface CultivoFormProps {
  mode: Extract<FormMode, "create" | "edit">;
  values?: Partial<Cultivo>;
  inModal?: boolean;
  onSave?: () => void;
}

export default function CultivoForm({ mode, values, inModal, onSave }: CultivoFormProps) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<CultivoFormData>(() => ({ ...values }));
  const [saving, setSaving] = useState(false);

  const updateField = (patch: Partial<Cultivo>) => {
    setFormData((prev) => ({ ...prev, ...patch }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      if (mode === "create") {
        await createCultivo(formData);
        if (!inModal) {
          navigate("/cultivos");
        } else {
          onSave?.();
        }
      } else if (values?.id) {
        await updateCultivo(values.id, formData);
        if (!inModal) {
          navigate(`/cultivos/${values.id}`);
        } else {
          onSave?.();
        }
      }
    } catch (err: unknown) {
      console.error(err);
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || "Error al guardar.";
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  const cancelTo = mode === "create" ? "/cultivos" : `/cultivos/${values?.id ?? ""}`;

  return (
    <div className="space-y-6">
      <DatosGeneralesCard mode={mode} values={formData} onChange={updateField} />
      <InformacionCultivoCard mode={mode} values={formData} onChange={updateField} />
      <InformacionTecnicaCard mode={mode} values={formData} onChange={updateField} />
      <EstimacionProduccionCard mode={mode} values={formData} onChange={updateField} />
      <ObservacionesCard mode={mode} value={formData.observaciones} onChange={(v) => updateField({ observaciones: v })} />
      <ActionButtons cancelTo={cancelTo} onSave={handleSave} disabled={saving} />
    </div>
  );
}
