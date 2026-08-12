import { ClipboardList, CalendarDays, MapPin, UserCheck } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Card } from "../ui";
import type { Actividad } from "../../services/actividades";

type ActividadKPIProps = {
  actividades: Actividad[];
};

type Kpi = {
  label: string;
  value: string;
  icon: LucideIcon;
  iconClass: string;
};

function mesActual(): string {
  const now = new Date();
  const mes = String(now.getMonth() + 1).padStart(2, "0");
  return `${now.getFullYear()}-${mes}`;
}

export function ActividadKPI({ actividades }: ActividadKPIProps) {
  const kpis: Kpi[] = [
    {
      label: "Total Actividades",
      value: String(actividades.length),
      icon: ClipboardList,
      iconClass: "bg-forest-600/10 text-forest-600",
    },
    {
      label: "Actividades del Mes",
      value: String(actividades.filter((a) => a.fecha.startsWith(mesActual())).length),
      icon: CalendarDays,
      iconClass: "bg-forest-600/10 text-forest-600",
    },
    {
      label: "Parcelas Atendidas",
      value: String(new Set(actividades.map((a) => a.parcelaNombre)).size),
      icon: MapPin,
      iconClass: "bg-sun-100 text-sun-700",
    },
    {
      label: "Técnicos Activos",
      value: String(new Set(actividades.map((a) => a.responsableTecnico)).size),
      icon: UserCheck,
      iconClass: "bg-sun-100 text-sun-700",
    },
  ];

  return (
    <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {kpis.map((kpi) => (
        <Card key={kpi.label}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-gray-500">{kpi.label}</p>
              <p className="mt-1.5 text-2xl font-bold text-[#111827]">{kpi.value}</p>
            </div>
            <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${kpi.iconClass}`}>
              <kpi.icon className="h-5 w-5" />
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
