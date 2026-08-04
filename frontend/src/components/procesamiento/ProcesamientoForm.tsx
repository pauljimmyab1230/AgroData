import { useNavigate } from "react-router-dom";
import { InformacionGeneralCard } from "./InformacionGeneralCard";
import { MateriaPrimaCard } from "./MateriaPrimaCard";
import { OperacionesCard } from "./OperacionesCard";
import { ControlProcesoCard } from "./ControlProcesoCard";
import { ProductoBaseCard } from "./ProductoBaseCard";
import { ReporteProcesamientoCard } from "./ReporteProcesamientoCard";
import { EvidenciasCard } from "./EvidenciasCard";
import { ObservacionesCard } from "./ObservacionesCard";
import ActionButtons from "./ActionButtons";
import type { FormMode } from "../shared/formControls";
import type { OrdenProcesamiento } from "../../pages/procesamiento/procesamientoMock";

interface ProcesamientoFormProps {
  mode: Extract<FormMode, "create" | "edit">;
  values?: OrdenProcesamiento;
}

export default function ProcesamientoForm({ mode, values }: ProcesamientoFormProps) {
  const navigate = useNavigate();
  const detailTo = `/procesamiento/${values?.id ?? 1}`;

  const handleSave = () => {
    navigate(mode === "create" ? "/procesamiento" : detailTo);
  };

  return (
    <div className="space-y-6">
      <InformacionGeneralCard mode={mode} values={values} />
      <MateriaPrimaCard mode={mode} values={values} />
      <OperacionesCard mode={mode} values={values} />
      <ControlProcesoCard mode={mode} values={values} />
      <ProductoBaseCard mode={mode} values={values} />
      <ReporteProcesamientoCard mode={mode} values={values} />
      <EvidenciasCard mode={mode} values={values} />
      <ObservacionesCard mode={mode} values={values} />

      <ActionButtons
        cancelTo={mode === "create" ? "/procesamiento" : detailTo}
        submitLabel={mode === "create" ? "Guardar Orden de Procesamiento" : "Guardar Cambios"}
        onSubmit={handleSave}
      />
    </div>
  );
}
