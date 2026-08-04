import { UserCheck, Package, Camera, Timer, ClipboardCheck } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Card } from "../ui";
import { ActividadEstadoBadge } from "./ActividadBadges";
import type { Actividad } from "../../pages/actividades/actividadMock";

type ActividadDetalleKPIProps = {
  actividad: Actividad;
};

type Kpi = {
  label: string;
  value: string;
  icon: LucideIcon;
  iconClass: string;
  badge?: boolean;
};

export function ActividadDetalleKPI({ actividad }: ActividadDetalleKPIProps) {
  const kpis: Kpi[] = [
    {
      label: "Jornales Utilizados",
      value: actividad.jornales,
      icon: UserCheck,
      iconClass: "bg-forest-600/10 text-forest-600",
    },
    {
      label: "Insumos Utilizados",
      value: String(actividad.insumos.length),
      icon: Package,
      iconClass: "bg-forest-600/10 text-forest-600",
    },
    {
      label: "Fotografías Registradas",
      value: String(actividad.fotos.length),
      icon: Camera,
      iconClass: "bg-sun-100 text-sun-700",
    },
    {
      label: "Duración de la Actividad",
      value: actividad.duracionEstimada,
      icon: Timer,
      iconClass: "bg-sun-100 text-sun-700",
    },
    {
      label: "Estado de la Actividad",
      value: actividad.estado,
      icon: ClipboardCheck,
      iconClass: "bg-forest-600/10 text-forest-600",
      badge: true,
    },
  ];

  return (
    <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
      {kpis.map((kpi) => (
        <Card key={kpi.label}>
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="truncate text-xs font-medium uppercase tracking-wider text-gray-500">
                {kpi.label}
              </p>
              <div className="mt-1.5">
                {kpi.badge ? (
                  <ActividadEstadoBadge estado={actividad.estado} />
                ) : (
                  <p className="truncate text-2xl font-bold text-[#111827]">{kpi.value}</p>
                )}
              </div>
            </div>
            <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${kpi.iconClass}`}>
              <kpi.icon className="h-5 w-5" />
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
