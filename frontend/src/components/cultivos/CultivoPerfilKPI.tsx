import { Ruler, CalendarDays, ClipboardList, SearchCheck, Package, Sprout } from "lucide-react";
import { Card } from "../ui";
import type { Cultivo } from "../../pages/cultivos/cultivoMock";

interface CultivoPerfilKPIProps {
  cultivo: Cultivo;
}

export default function CultivoPerfilKPI({ cultivo }: CultivoPerfilKPIProps) {
  const kpis = [
    {
      label: "Área Sembrada",
      value: `${cultivo.areaSembrada.toFixed(2)} ha`,
      icon: Ruler,
      iconClass: "bg-forest-600/10 text-forest-600",
    },
    {
      label: "Edad del Cultivo",
      value: `${cultivo.edadCultivoDias} días`,
      icon: CalendarDays,
      iconClass: "bg-sun-100 text-sun-700",
    },
    {
      label: "Actividades Registradas",
      value: String(cultivo.actividadesRegistradas),
      icon: ClipboardList,
      iconClass: "bg-forest-600/10 text-forest-600",
    },
    {
      label: "Inspecciones",
      value: String(cultivo.inspecciones),
      icon: SearchCheck,
      iconClass: "bg-sun-100 text-sun-700",
    },
    {
      label: "Producción Estimada",
      value: `${cultivo.produccionEstimada.toLocaleString("es-PE")} kg`,
      icon: Package,
      iconClass: "bg-forest-600/10 text-forest-600",
    },
    {
      label: "Estado Fenológico",
      value: cultivo.estadoFenologico,
      icon: Sprout,
      iconClass: "bg-sun-100 text-sun-700",
    },
  ];

  return (
    <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
      {kpis.map((kpi) => (
        <Card key={kpi.label}>
          <div className="flex flex-col gap-3">
            <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${kpi.iconClass}`}>
              <kpi.icon className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[11px] font-medium uppercase tracking-wider text-gray-500">{kpi.label}</p>
              <p className="mt-1 text-lg font-bold leading-snug text-[#111827]">{kpi.value}</p>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
