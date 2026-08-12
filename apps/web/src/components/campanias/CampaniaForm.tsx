import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, ChevronLeft, Info, Activity, Settings, MessageSquare, Save } from "lucide-react";
import { Button, Stepper, type StepperStep } from "../ui";
import type { FormMode } from "../shared/formControls";
import { DatosGeneralesCard } from "./DatosGeneralesCard";
import { CampaniaStatusCard } from "./CampaniaStatusCard";
import { ConfiguracionCard } from "./ConfiguracionCard";
import { ObservacionesCard } from "./ObservacionesCard";
import { createCampania, updateCampania, type Campania } from "../../services/campanias";

const pasos: StepperStep[] = [
  { id: 1, label: "Información General", icon: Info },
  { id: 2, label: "Estado", icon: Activity },
  { id: 3, label: "Configuración", icon: Settings },
  { id: 4, label: "Observaciones", icon: MessageSquare },
];

const totalPasos = pasos.length;

interface CampaniaFormData {
  codigo: string;
  nombre: string;
  anioAgricola: string;
  fechaInicio: string;
  fechaFin: string;
  descripcion: string;
  estado: string;
  responsable: string;
  tecnicoCoordinador: string;
  objetivo: string;
  permitirCultivos: boolean;
  permitirActividades: boolean;
  permitirCosechas: boolean;
  permitirInspecciones: boolean;
  permitirAcopio: boolean;
  permitirProcesamiento: boolean;
  visible: boolean;
  activa: boolean;
  observaciones: string;
}

const emptyForm: CampaniaFormData = {
  codigo: "",
  nombre: "",
  anioAgricola: "",
  fechaInicio: "",
  fechaFin: "",
  descripcion: "",
  estado: "PLANIFICADA",
  responsable: "",
  tecnicoCoordinador: "",
  objetivo: "",
  permitirCultivos: true,
  permitirActividades: true,
  permitirCosechas: true,
  permitirInspecciones: true,
  permitirAcopio: true,
  permitirProcesamiento: true,
  visible: true,
  activa: false,
  observaciones: "",
};

function campaniaToForm(c: Campania): CampaniaFormData {
  return {
    codigo: c.codigo,
    nombre: c.nombre,
    anioAgricola: c.anioAgricola,
    fechaInicio: c.fechaInicio,
    fechaFin: c.fechaFin,
    descripcion: c.descripcion,
    estado: c.estado,
    responsable: c.responsable,
    tecnicoCoordinador: c.tecnicoCoordinador,
    objetivo: c.objetivo,
    permitirCultivos: c.permitirCultivos,
    permitirActividades: c.permitirActividades,
    permitirCosechas: c.permitirCosechas,
    permitirInspecciones: c.permitirInspecciones,
    permitirAcopio: c.permitirAcopio,
    permitirProcesamiento: c.permitirProcesamiento,
    visible: c.visible,
    activa: c.activa,
    observaciones: c.observaciones,
  };
}

type CampaniaFormProps = {
  mode: Extract<FormMode, "create" | "edit">;
  values?: Campania;
};

export function CampaniaForm({ mode, values }: CampaniaFormProps) {
  const [paso, setPaso] = useState(1);
  const [formData, setFormData] = useState<CampaniaFormData>(() =>
    values ? campaniaToForm(values) : { ...emptyForm },
  );
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();

  const update = (patch: Partial<CampaniaFormData>) =>
    setFormData((prev) => ({ ...prev, ...patch }));

  const handleSave = async () => {
    setSaving(true);
    try {
      if (mode === "create") {
        const result = await createCampania(formData);
        navigate(`/campanias/${result.id}`);
      } else {
        await updateCampania(values!.id, formData);
        navigate(`/campanias/${values!.id}`);
      }
    } catch (err: unknown) {
      console.error(err);
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || "Error al guardar. Verifique los datos.";
      alert(msg);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <Stepper steps={pasos} active={paso} onChange={setPaso} />

      <div className="space-y-6">
        {paso === 1 && <DatosGeneralesCard mode={mode} value={formData} onChange={update} />}
        {paso === 2 && <CampaniaStatusCard mode={mode} value={formData} onChange={update} />}
        {paso === 3 && <ConfiguracionCard mode={mode} value={formData} onChange={update} />}
        {paso === 4 && <ObservacionesCard mode={mode} value={formData} onChange={update} />}
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-gray-200 bg-white px-5 py-4 shadow-sm">
        <Button
          variant="secondary"
          onClick={() => setPaso((p) => Math.max(1, p - 1))}
          disabled={paso === 1}
          iconLeft={<ChevronLeft className="h-4 w-4" />}
        >
          Anterior
        </Button>

        <p className="text-sm text-gray-500">
          Paso <span className="font-semibold text-forest-700">{paso}</span> de{" "}
          <span className="font-semibold text-[#111827]">{totalPasos}</span>
        </p>

        {paso === totalPasos ? (
          <Button onClick={handleSave} disabled={saving} iconLeft={<Save className="h-4 w-4" />}>
            {saving ? "Guardando..." : mode === "create" ? "Crear Campaña" : "Guardar Cambios"}
          </Button>
        ) : (
          <Button
            onClick={() => setPaso((p) => Math.min(totalPasos, p + 1))}
            iconRight={<ArrowRight className="h-4 w-4" />}
          >
            Siguiente
          </Button>
        )}
      </div>
    </div>
  );
}
