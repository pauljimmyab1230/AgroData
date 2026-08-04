import {
  Check,
  ClipboardList,
  Eye,
  Factory,
  PlayCircle,
  SearchCheck,
  Settings2,
  Sprout,
  Warehouse,
  Wheat,
  X,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { CardHeader, CardShell, type FormMode } from "../shared/formControls";
import type { CampaniaFormData } from "../../pages/campañas/campaniaMock";

type ConfiguracionCardProps = {
  mode: FormMode;
  value: CampaniaFormData;
  onChange?: (patch: Partial<CampaniaFormData>) => void;
};

type CampoConfiguracion = keyof Pick<
  CampaniaFormData,
  | "permitirCultivos"
  | "permitirActividades"
  | "permitirCosechas"
  | "permitirInspecciones"
  | "permitirAcopio"
  | "permitirProcesamiento"
  | "visible"
  | "activa"
>;

type OpcionConfiguracion = {
  key: CampoConfiguracion;
  label: string;
  descripcion: string;
  icon: LucideIcon;
};

const opcionesConfiguracion: OpcionConfiguracion[] = [
  {
    key: "permitirCultivos",
    label: "Registro de Cultivos",
    descripcion: "Permite registrar cultivos dentro de la campaña",
    icon: Sprout,
  },
  {
    key: "permitirActividades",
    label: "Registro de Actividades",
    descripcion: "Permite registrar actividades agrícolas y su seguimiento",
    icon: ClipboardList,
  },
  {
    key: "permitirCosechas",
    label: "Registro de Cosechas",
    descripcion: "Permite registrar cosechas y rendimientos obtenidos",
    icon: Wheat,
  },
  {
    key: "permitirInspecciones",
    label: "Registro de Inspecciones",
    descripcion: "Permite registrar inspecciones en campo",
    icon: SearchCheck,
  },
  {
    key: "permitirAcopio",
    label: "Registro de Acopio",
    descripcion: "Permite registrar operaciones de acopio",
    icon: Warehouse,
  },
  {
    key: "permitirProcesamiento",
    label: "Procesamiento",
    descripcion: "Permite habilitar el procesamiento de productos",
    icon: Factory,
  },
  {
    key: "visible",
    label: "Campaña Visible",
    descripcion: "La campaña es visible para los socios",
    icon: Eye,
  },
  {
    key: "activa",
    label: "Campaña Activa",
    descripcion: "La campaña se encuentra en ejecución",
    icon: PlayCircle,
  },
];

export function ConfiguracionCard({ mode, value, onChange }: ConfiguracionCardProps) {
  const editable = mode !== "view";

  const handleToggle = (key: CampoConfiguracion) => {
    if (!onChange) return;
    onChange({ [key]: !value[key] } as Partial<CampaniaFormData>);
  };

  return (
    <CardShell>
      <CardHeader
        icon={<Settings2 size={20} />}
        title="Configuración"
        description="Registros y funcionalidades permitidas durante el desarrollo de la campaña"
      />

      <div className="grid gap-3 sm:grid-cols-2">
        {opcionesConfiguracion.map(({ key, label, descripcion, icon: Icon }) => {
          const habilitado = value[key];

          return (
            <div
              key={key}
              className="flex items-center justify-between gap-4 rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-3.5"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-forest-600/10 text-forest-600">
                  <Icon className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-sm font-medium text-[#111827]">{label}</p>
                  <p className="text-xs text-gray-500">{descripcion}</p>
                </div>
              </div>

              {editable ? (
                <button
                  type="button"
                  role="switch"
                  aria-checked={habilitado}
                  onClick={() => handleToggle(key)}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full transition-colors ${
                    habilitado ? "bg-forest-600" : "bg-gray-200"
                  }`}
                >
                  <span
                    className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform ${
                      habilitado ? "translate-x-[22px]" : "translate-x-0.5"
                    }`}
                  />
                </button>
              ) : habilitado ? (
                <span className="inline-flex items-center gap-1.5 text-sm font-medium text-emerald-600">
                  <Check className="h-4 w-4" /> Sí
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-400">
                  <X className="h-4 w-4" /> No
                </span>
              )}
            </div>
          );
        })}
      </div>
    </CardShell>
  );
}
