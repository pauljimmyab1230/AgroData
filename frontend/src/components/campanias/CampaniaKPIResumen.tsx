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
import { Card } from "../ui";
import { campaniaKPIsResumenMock } from "../../pages/campañas/campaniaMock";

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

export function CampaniaKPIResumen() {
  return (
    <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {campaniaKPIsResumenMock.map((kpi, i) => {
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
