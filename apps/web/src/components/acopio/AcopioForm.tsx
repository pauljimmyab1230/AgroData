import { useNavigate } from "react-router-dom";
import { InformacionGeneralCard } from "./InformacionGeneralCard";
import { ProductorCard } from "./ProductorCard";
import SacosTable from "./SacosTable";
import ResumenAcopioCard from "./ResumenAcopioCard";
import { CalidadCard } from "./CalidadCard";
import { EvidenciasCard } from "./EvidenciasCard";
import { ObservacionesCard } from "./ObservacionesCard";
import ActionButtons from "./ActionButtons";
import type { FormMode } from "../shared/formControls";
import type { AcopioView } from "../../services/acopios";

interface AcopioFormProps {
  mode: Extract<FormMode, "create" | "edit">;
  values?: AcopioView;
}

export default function AcopioForm({ mode, values }: AcopioFormProps) {
  const navigate = useNavigate();
  const detailTo = `/acopio/${values?.id ?? 1}`;

  const handleSave = () => {
    navigate(mode === "create" ? "/acopio" : detailTo);
  };

  return (
    <div className="space-y-6">
      <InformacionGeneralCard mode={mode} values={values} />
      <ProductorCard mode={mode} values={values} />
      <SacosTable mode={mode} sacos={values?.sacos} />
      <ResumenAcopioCard mode={mode} values={values} />
      <CalidadCard mode={mode} values={values} />
      <EvidenciasCard mode={mode} values={values} />
      <ObservacionesCard mode={mode} values={values} />

      <ActionButtons
        cancelTo={mode === "create" ? "/acopio" : detailTo}
        submitLabel={mode === "create" ? "Guardar Acopio" : "Guardar Cambios"}
        onSubmit={handleSave}
      />
    </div>
  );
}
