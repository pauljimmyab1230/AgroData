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
import { FotografiasCard } from "./FotografiasCard";
import { MapaCard } from "./MapaCard";
import { ObservacionesCard } from "./ObservacionesCard";
import { ResultadosCard } from "./ResultadosCard";
import {
  actividadToFormData,
  emptyActividad,
  obtenerSiguienteCodigo,
  type Actividad,
  type ActividadFormData,
} from "../../pages/actividades/actividadMock";

type ActividadFormProps = {
  mode: Extract<FormMode, "create" | "edit">;
  values?: Actividad;
};

export function ActividadForm({ mode, values }: ActividadFormProps) {
  const [formData, setFormData] = useState<ActividadFormData>(() =>
    values ? actividadToFormData(values) : { ...emptyActividad, codigo: obtenerSiguienteCodigo() },
  );
  const navigate = useNavigate();

  const update = (patch: Partial<ActividadFormData>) =>
    setFormData((prev) => ({ ...prev, ...patch }));

  const handleSave = () => {
    navigate(mode === "create" ? "/actividades" : `/actividades/${values?.id ?? 1}`);
  };

  return (
    <div>
      <div className="grid gap-6">
        <InformacionGeneralCard mode={mode} value={formData} onChange={update} />
        <ActividadCard mode={mode} value={formData} onChange={update} />
        <InsumosCard mode={mode} value={formData} onChange={update} />
        <ManoObraCard mode={mode} value={formData} onChange={update} />
        <MaquinariaCard mode={mode} value={formData} onChange={update} />
        <FotografiasCard mode={mode} value={formData} onChange={update} />
        <MapaCard mode={mode} value={formData} onChange={update} />
        <ObservacionesCard mode={mode} value={formData} onChange={update} />
        <ResultadosCard mode={mode} value={formData} onChange={update} />
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-gray-200 bg-white px-5 py-4 shadow-sm">
        <Button variant="ghost" as="link" to="/actividades">
          Cancelar
        </Button>
        <Button onClick={handleSave} iconLeft={<Save className="h-4 w-4" />}>
          {mode === "create" ? "Registrar Actividad" : "Guardar Cambios"}
        </Button>
      </div>
    </div>
  );
}
