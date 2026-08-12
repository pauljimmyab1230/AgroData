import { Activity, CalendarClock, Check, Flag, PlayCircle, XCircle } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { CardHeader, CardShell, type FormMode } from "../shared/formControls";
import { campaniaEstados, type CampaniaFormData } from "../../services/campanias";
import { CampaniaEstadoBadge } from "./CampaniaEstadoBadge";

type CampaniaStatusCardProps = {
  mode: FormMode;
  value: CampaniaFormData;
  onChange?: (patch: Partial<CampaniaFormData>) => void;
};

type EstadoConfig = {
  icon: LucideIcon;
  descripcion: string;
  activo: string;
  iconBox: string;
};

const configuracionEstado: Record<string, EstadoConfig> = {
  PLANIFICADA: {
    icon: CalendarClock,
    descripcion: "Campaña definida que aún no ha iniciado operaciones en campo.",
    activo: "border-amber-500 bg-amber-50/80",
    iconBox: "bg-amber-100 text-amber-700",
  },
  ACTIVA: {
    icon: PlayCircle,
    descripcion: "Campaña en ejecución con actividades y registros en curso.",
    activo: "border-forest-600 bg-forest-50/80",
    iconBox: "bg-forest-100 text-forest-700",
  },
  FINALIZADA: {
    icon: Flag,
    descripcion: "Campaña cerrada con las cosechas y el acopio concluidos.",
    activo: "border-slate-500 bg-slate-50",
    iconBox: "bg-slate-200 text-slate-700",
  },
  CANCELADA: {
    icon: XCircle,
    descripcion: "Campaña suspendida o anulada antes de su conclusión.",
    activo: "border-red-500 bg-red-50/80",
    iconBox: "bg-red-100 text-red-700",
  },
};

export function CampaniaStatusCard({ mode, value, onChange }: CampaniaStatusCardProps) {
  const editable = mode !== "view";
  const config = configuracionEstado[value.estado];
  const Icon = config.icon;

  if (!editable) {
    return (
      <CardShell>
        <CardHeader
          icon={<Activity size={20} />}
          title="Estado de la Campaña"
          description="Situación actual de la campaña dentro del ciclo agrícola"
        />

        <div className="flex flex-col gap-4 rounded-2xl border border-gray-200 bg-gray-50/60 p-5 sm:flex-row sm:items-center">
          <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${config.iconBox}`}>
            <Icon className="h-6 w-6" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-[#111827]">{value.estado}</p>
            <p className="mt-0.5 text-sm text-gray-500">{config.descripcion}</p>
          </div>
          <CampaniaEstadoBadge estado={value.estado} />
        </div>
      </CardShell>
    );
  }

  return (
    <CardShell>
      <CardHeader
        icon={<Activity size={20} />}
        title="Estado de la Campaña"
        description="Selecciona la situación actual de la campaña"
      />

      <div className="grid gap-3 sm:grid-cols-2">
        {campaniaEstados.map((estado) => {
          const opcion = configuracionEstado[estado];
          const OptionIcon = opcion.icon;
          const seleccionado = estado === value.estado;

          return (
            <button
              key={estado}
              type="button"
              onClick={() => onChange?.({ estado })}
              className={`flex items-start gap-3 rounded-2xl border-2 p-4 text-left transition-all ${
                seleccionado
                  ? opcion.activo
                  : "border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50"
              }`}
            >
              <div
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                  seleccionado ? opcion.iconBox : "bg-gray-100 text-gray-400"
                }`}
              >
                <OptionIcon className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-[#111827]">{estado}</p>
                <p className="mt-0.5 text-xs text-gray-500">{opcion.descripcion}</p>
              </div>
              <span
                className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors ${
                  seleccionado ? "border-forest-600 bg-forest-600 text-white" : "border-gray-300"
                }`}
              >
                {seleccionado && <Check className="h-3 w-3" />}
              </span>
            </button>
          );
        })}
      </div>
    </CardShell>
  );
}
