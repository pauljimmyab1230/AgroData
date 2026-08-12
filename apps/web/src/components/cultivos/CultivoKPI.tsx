import { Wheat, Ruler, CalendarDays, BadgeCheck } from "lucide-react";
import { Card } from "../ui";
import type { Cultivo } from "../../services/cultivos";

interface CultivoKPIProps {
  cultivos: Cultivo[];
  total?: number;
}

export default function CultivoKPI({ cultivos, total }: CultivoKPIProps) {
  const areaSembrada = cultivos.reduce((acc, c) => acc + (c.areaSembrada ?? 0), 0);
  const campaniasActivas = new Set(cultivos.map((c) => c.campaniaId)).size;
  const cultivosActivos = cultivos.filter((c) => c.estado === "ACTIVO").length;

  const kpis = [
    {
      label: "Total Cultivos",
      value: String(total ?? cultivos.length),
      icon: Wheat,
      iconClass: "bg-forest-600/10 text-forest-600",
    },
    {
      label: "Área Sembrada",
      value: `${areaSembrada.toFixed(2)} ha`,
      icon: Ruler,
      iconClass: "bg-sun-100 text-sun-700",
    },
    {
      label: "Campañas Activas",
      value: String(campaniasActivas),
      icon: CalendarDays,
      iconClass: "bg-forest-600/10 text-forest-600",
    },
    {
      label: "Cultivos Activos",
      value: String(cultivosActivos),
      icon: BadgeCheck,
      iconClass: "bg-sun-100 text-sun-700",
    },
  ];

  return (
    <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
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
