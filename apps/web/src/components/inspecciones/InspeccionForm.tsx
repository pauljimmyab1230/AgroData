import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { InformacionGeneralCard } from "./InformacionGeneralCard";
import { ChecklistCard } from "./ChecklistCard";
import { NoConformidadesCard } from "./NoConformidadesCard";
import { AccionesCorrectivasCard } from "./AccionesCorrectivasCard";
import { EvidenciasCard } from "./EvidenciasCard";
import { MapaCard } from "./MapaCard";
import { ObservacionesCard } from "./ObservacionesCard";
import { RecomendacionesCard } from "./RecomendacionesCard";
import { ResultadoCard } from "./ResultadoCard";
import ActionButtons from "./ActionButtons";
import type { FormMode } from "../shared/formControls";
import type { Inspeccion } from "../../services/inspecciones";
import { toast } from "../../utils/toast";

interface InspeccionFormProps {
  mode: Extract<FormMode, "create" | "edit">;
  values?: Inspeccion;
  inModal?: boolean;
  onSave?: () => void;
}

export default function InspeccionForm({ mode, values: initialValues, inModal, onSave }: InspeccionFormProps) {
  const navigate = useNavigate();
  const [values, setValues] = useState<Inspeccion | undefined>(initialValues);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const detailTo = `/inspecciones/${values?.id ?? ""}`;

  const updateValues = (patch: Partial<Inspeccion>) => {
    setValues((prev) => prev ? { ...prev, ...patch } : prev);
  };

  const validate = (): boolean => {
    const e: Record<string, string> = {};
    if (!values?.fecha) e.fecha = "La fecha es obligatoria";
    if (!values?.inspector) e.inspector = "El inspector es obligatorio";
    if (!values?.parcelaId) e.parcelaId = "La parcela es obligatoria";
    setErrors(e);
    if (Object.keys(e).length > 0) {
      toast.error(`Campos obligatorios:\n• ${Object.values(e).join("\n• ")}`);
      return false;
    }
    return true;
  };

  const handleSave = () => {
    if (!validate()) return;

    if (!inModal) {
      navigate(mode === "create" ? "/inspecciones" : detailTo);
    } else {
      onSave?.();
    }
  };

  return (
    <div className="space-y-6">
      <InformacionGeneralCard mode={mode} values={values} onChange={updateValues} errors={errors} />
      <ChecklistCard mode={mode} values={values} />
      <NoConformidadesCard mode={mode} values={values} />
      <AccionesCorrectivasCard mode={mode} values={values} />
      <EvidenciasCard mode={mode} values={values} />
      <MapaCard mode={mode} values={values} />
      <ObservacionesCard mode={mode} values={values} />
      <RecomendacionesCard mode={mode} values={values} />
      <ResultadoCard mode={mode} values={values} />

      <ActionButtons
        cancelTo={mode === "create" ? "/inspecciones" : detailTo}
        submitLabel={mode === "create" ? "Guardar Inspección" : "Guardar Cambios"}
        onSubmit={handleSave}
      />
    </div>
  );
}
