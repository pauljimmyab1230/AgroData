import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { DatosGeneralesCard } from "./DatosGeneralesCard";
import { InformacionCultivoCard } from "./InformacionCultivoCard";
import { InformacionTecnicaCard } from "./InformacionTecnicaCard";
import { EstimacionProduccionCard } from "./EstimacionProduccionCard";
import { ObservacionesCard } from "./ObservacionesCard";
import ActionButtons from "./ActionButtons";
import { useCreateCultivo, useUpdateCultivo } from "../../hooks/queries";
import type { Cultivo } from "../../services/cultivos";
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
  const [errors, setErrors] = useState<Record<string, string>>({});
  const createMutation = useCreateCultivo();
  const updateMutation = useUpdateCultivo();
  const saving = createMutation.isPending || updateMutation.isPending;

  const updateField = (patch: Partial<Cultivo>) => {
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
    const newErrors: Record<string, string> = {};
    if (!formData.campaniaId) newErrors.campaniaId = "La campaña es obligatoria";
    if (!formData.parcelaId) newErrors.parcelaId = "La parcela es obligatoria";
    if (!formData.cultivo?.trim()) newErrors.cultivo = "El cultivo es obligatorio";
    if (!formData.variedad?.trim()) newErrors.variedad = "La variedad es obligatoria";
    if (!formData.areaSembrada || formData.areaSembrada <= 0) newErrors.areaSembrada = "El área sembrada es obligatoria";
    if (!formData.fechaSiembra) newErrors.fechaSiembra = "La fecha de siembra es obligatoria";
    if (!formData.metodoSiembra?.trim()) newErrors.metodoSiembra = "El método de siembra es obligatorio";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) {
      const msgs = Object.values(errors);
      toast.error(msgs.length ? `Campos obligatorios:\n• ${msgs.join("\n• ")}` : "Complete los campos obligatorios");
      return;
    }
    try {
      if (mode === "create") {
        await createMutation.mutateAsync(formData);
        toast.success("Cultivo creado exitosamente");
        if (!inModal) {
          navigate("/cultivos");
        } else {
          onSave?.();
        }
      } else if (values?.id) {
        await updateMutation.mutateAsync({ id: String(values.id), data: formData });
        toast.success("Cultivo actualizado exitosamente");
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
    }
  };

  const cancelTo = mode === "create" ? "/cultivos" : `/cultivos/${values?.id ?? ""}`;

  return (
    <div className="space-y-6">
      <DatosGeneralesCard mode={mode} values={formData} onChange={updateField} errors={errors} />
      <InformacionCultivoCard mode={mode} values={formData} onChange={updateField} errors={errors} />
      <InformacionTecnicaCard mode={mode} values={formData} onChange={updateField} />
      <EstimacionProduccionCard mode={mode} values={formData} onChange={updateField} />
      <ObservacionesCard mode={mode} value={formData.observaciones ?? undefined} onChange={(v) => updateField({ observaciones: v })} />
      <ActionButtons cancelTo={cancelTo} onCancel={inModal ? onSave : undefined} onSave={handleSave} disabled={saving} inModal={inModal} />
    </div>
  );
}
