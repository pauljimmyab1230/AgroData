import { CalendarClock, CalendarDays, Flag, PlayCircle } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Card } from "../ui";
import type { CampaniaGlobalStats } from "../../services/campanias";

type CampaniaKPIProps = {
  stats: CampaniaGlobalStats;
};

type Kpi = {
  label: string;
  value: string;
  icon: LucideIcon;
  iconClass: string;
};

export function CampaniaKPI({ stats }: CampaniaKPIProps) {
  const kpis: Kpi[] = [
    {
      label: "Total Campañas",
      value: String(stats.total),
      icon: CalendarDays,
      iconClass: "bg-forest-600/10 text-forest-600",
    },
    {
      label: "Campañas Activas",
      value: String(stats.estados.ACTIVA ?? 0),
      icon: PlayCircle,
      iconClass: "bg-forest-600/10 text-forest-600",
    },
    {
      label: "Campañas Finalizadas",
      value: String(stats.estados.FINALIZADA ?? 0),
      icon: Flag,
      iconClass: "bg-sun-100 text-sun-700",
    },
    {
      label: "Campañas Planificadas",
      value: String(stats.estados.PLANIFICADA ?? 0),
      icon: CalendarClock,
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
