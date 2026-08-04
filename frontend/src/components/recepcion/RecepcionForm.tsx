import { useNavigate } from "react-router-dom";
import { InformacionGeneralCard } from "./InformacionGeneralCard";
import { LoteProductorCard } from "./LoteProductorCard";
import { PesajeCard } from "./PesajeCard";
import ResumenRecepcionCard from "./ResumenRecepcionCard";
import { CalidadCard } from "./CalidadCard";
import { ClasificacionCard } from "./ClasificacionCard";
import { ResultadoCard } from "./ResultadoCard";
import { EvidenciasCard } from "./EvidenciasCard";
import { ObservacionesCard } from "./ObservacionesCard";
import ActionButtons from "./ActionButtons";
import type { FormMode } from "../shared/formControls";
import type { Recepcion } from "../../pages/recepcion/recepcionMock";

interface RecepcionFormProps {
  mode: Extract<FormMode, "create" | "edit">;
  values?: Recepcion;
}

export default function RecepcionForm({ mode, values }: RecepcionFormProps) {
  const navigate = useNavigate();
  const detailTo = `/recepcion/${values?.id ?? 1}`;

  const handleSave = () => {
    navigate(mode === "create" ? "/recepcion" : detailTo);
  };

  return (
    <div className="space-y-6">
      <InformacionGeneralCard mode={mode} values={values} />
      <LoteProductorCard mode={mode} values={values} />
      <PesajeCard mode={mode} values={values} />
      <ResumenRecepcionCard mode={mode} values={values} />
      <CalidadCard mode={mode} values={values} />
      <ClasificacionCard mode={mode} values={values} />
      <ResultadoCard mode={mode} values={values} />
      <EvidenciasCard mode={mode} values={values} />
      <ObservacionesCard mode={mode} values={values} />

      <ActionButtons
        cancelTo={mode === "create" ? "/recepcion" : detailTo}
        submitLabel={mode === "create" ? "Guardar Recepción" : "Guardar Cambios"}
        onSubmit={handleSave}
      />
    </div>
  );
}
