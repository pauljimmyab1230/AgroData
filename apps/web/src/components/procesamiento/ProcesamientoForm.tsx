import { useNavigate } from "react-router-dom";
import { InformacionGeneralCard } from "./InformacionGeneralCard";
import { MateriaPrimaCard } from "./MateriaPrimaCard";
import { OperacionesCard } from "./OperacionesCard";
import { ControlProcesoCard } from "./ControlProcesoCard";
import { ProductoBaseCard } from "./ProductoBaseCard";
import { ReporteProcesamientoCard } from "./ReporteProcesamientoCard";
import { ObservacionesCard } from "./ObservacionesCard";
import ActionButtons from "./ActionButtons";
import type { FormMode } from "../shared/formControls";
import type { OrdenProcesamiento } from "../../services/procesamientos";

interface ProcesamientoFormProps {
  mode: Extract<FormMode, "create" | "edit">;
  values?: OrdenProcesamiento;
  inModal?: boolean;
  onSave?: () => void;
}

export default function ProcesamientoForm({ mode, values, inModal, onSave }: ProcesamientoFormProps) {
  const navigate = useNavigate();
  const detailTo = `/procesamiento/${values?.id ?? 1}`;

  const handleSave = () => {
    if (!inModal) {
      navigate(mode === "create" ? "/procesamiento" : detailTo);
    } else {
      onSave?.();
    }
  };

  return (
    <div className="space-y-6">
      <InformacionGeneralCard mode={mode} values={values} />
      <MateriaPrimaCard mode={mode} values={values} />
      <OperacionesCard mode={mode} values={values} />
      <ControlProcesoCard mode={mode} values={values} />
      <ProductoBaseCard mode={mode} values={values} />
      <ReporteProcesamientoCard mode={mode} values={values} />
      <ObservacionesCard mode={mode} values={values} />

      <ActionButtons
        cancelTo={mode === "create" ? "/procesamiento" : detailTo}
        submitLabel={mode === "create" ? "Guardar Orden de Procesamiento" : "Guardar Cambios"}
        onSubmit={handleSave}
      />
    </div>
  );
}
