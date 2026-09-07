import {
  ClipboardList,
  MapPin,
  Ruler,
  SearchCheck,
  Users,
  Warehouse,
  Wheat,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Card, LoadingSpinner } from "../ui";
import { useCampaniaStats } from "../../hooks/queries";

type KPI = { label: string; value: string; hint: string };

const iconos: Record<string, LucideIcon> = {
  "Productores Inscritos": Users,
  "Parcelas Registradas": MapPin,
  "Cultivos Registrados": Wheat,
  "Área Sembrada": Ruler,
  "Actividades Agrícolas": ClipboardList,
  "Inspecciones Realizadas": SearchCheck,
  "Acopios Registrados": Warehouse,
};

const iconosClase = ["bg-forest-600/10 text-forest-600", "bg-sun-100 text-sun-700"];

interface CampaniaKPIResumenProps {
  campaniaId: number;
}

export function CampaniaKPIResumen({ campaniaId }: CampaniaKPIResumenProps) {
  const { data: stats, isLoading } = useCampaniaStats(campaniaId);

  if (isLoading) {
    return (
      <div className="mb-6 flex justify-center py-8">
        <LoadingSpinner />
      </div>
    );
  }

  const kpis: KPI[] = [
    { label: "Productores Inscritos", value: String(stats?.productores ?? 0), hint: "socios participantes" },
    { label: "Parcelas Registradas", value: String(stats?.parcelas ?? 0), hint: "parcelas en campaña" },
    { label: "Cultivos Registrados", value: String(stats?.cultivos ?? 0), hint: "cultivos asociados" },
    { label: "Área Sembrada", value: `${stats?.areaSembrada ?? 0} ha`, hint: "hectáreas totales" },
    { label: "Actividades Agrícolas", value: String(stats?.actividades ?? 0), hint: "actividades registradas" },
    { label: "Inspecciones Realizadas", value: String(stats?.inspecciones ?? 0), hint: "inspecciones completadas" },
    { label: "Acopios Registrados", value: String(stats?.acopios ?? 0), hint: "acopios realizados" },
  ];

  return (
    <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {kpis.map((kpi, i) => {
        const Icon = iconos[kpi.label] ?? Users;
        return (
          <Card key={kpi.label}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-gray-500">{kpi.label}</p>
                <p className="mt-1.5 text-2xl font-bold text-[#111827]">{kpi.value}</p>
                <p className="mt-1 text-xs text-gray-500">{kpi.hint}</p>
              </div>
              <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${iconosClase[i % 2]}`}>
                <Icon className="h-5 w-5" />
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
