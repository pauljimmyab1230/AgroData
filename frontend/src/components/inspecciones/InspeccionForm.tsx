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
import { HistorialCard } from "./HistorialCard";
import ActionButtons from "./ActionButtons";
import type { FormMode } from "../shared/formControls";
import type { Inspeccion } from "../../pages/inspecciones/inspeccionMock";

interface InspeccionFormProps {
  mode: Extract<FormMode, "create" | "edit">;
  values?: Inspeccion;
}

export default function InspeccionForm({ mode, values }: InspeccionFormProps) {
  const navigate = useNavigate();
  const detailTo = `/inspecciones/${values?.id ?? 1}`;

  const handleSave = () => {
    navigate(mode === "create" ? "/inspecciones" : detailTo);
  };

  return (
    <div className="space-y-6">
      <InformacionGeneralCard mode={mode} values={values} />
      <ChecklistCard mode={mode} values={values} />
      <NoConformidadesCard mode={mode} values={values} />
      <AccionesCorrectivasCard mode={mode} values={values} />
      <EvidenciasCard mode={mode} values={values} />
      <MapaCard mode={mode} values={values} />
      <ObservacionesCard mode={mode} values={values} />
      <RecomendacionesCard mode={mode} values={values} />
      <ResultadoCard mode={mode} values={values} />

      {values?.historial && <HistorialCard eventos={values.historial} />}

      <ActionButtons
        cancelTo={mode === "create" ? "/inspecciones" : detailTo}
        submitLabel={mode === "create" ? "Guardar Inspección" : "Guardar Cambios"}
        onSubmit={handleSave}
      />
    </div>
  );
}
