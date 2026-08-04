import { useNavigate } from "react-router-dom";
import { DatosGeneralesCard } from "./DatosGeneralesCard";
import { InformacionCultivoCard } from "./InformacionCultivoCard";
import { InformacionTecnicaCard } from "./InformacionTecnicaCard";
import { EstimacionProduccionCard } from "./EstimacionProduccionCard";
import { EstadoFenologicoCard } from "./EstadoFenologicoCard";
import { CronogramaCard } from "./CronogramaCard";
import { FotografiasCard } from "./FotografiasCard";
import { ObservacionesCard } from "./ObservacionesCard";
import ActionButtons from "./ActionButtons";
import type { Cultivo } from "../../pages/cultivos/cultivoMock";
import type { FormMode } from "../shared/formControls";

interface CultivoFormProps {
  mode: Extract<FormMode, "create" | "edit">;
  values?: Partial<Cultivo>;
}

export default function CultivoForm({ mode, values }: CultivoFormProps) {
  const navigate = useNavigate();

  const handleSave = () => {
    navigate(mode === "create" ? "/cultivos" : `/cultivos/${values?.id ?? 1}`);
  };

  const cancelTo = mode === "create" ? "/cultivos" : `/cultivos/${values?.id ?? 1}`;

  return (
    <div className="space-y-6">
      <DatosGeneralesCard mode={mode} values={values} />
      <InformacionCultivoCard mode={mode} values={values} />
      <InformacionTecnicaCard mode={mode} values={values} />
      <EstimacionProduccionCard mode={mode} values={values} />
      <EstadoFenologicoCard mode={mode} values={values} />
      <CronogramaCard mode={mode} values={values} />
      <FotografiasCard mode={mode} />
      <ObservacionesCard mode={mode} value={values?.observaciones} />
      <ActionButtons cancelTo={cancelTo} onSave={handleSave} />
    </div>
  );
}
