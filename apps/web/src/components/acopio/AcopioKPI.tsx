import { Boxes, Scale, Warehouse, TrendingUp } from "lucide-react";
import { Card } from "../ui";

export interface AcopioKpiItem {
  label: string;
  value: string;
  iconClass: string;
}

const icons: Record<string, typeof Boxes> = {
  warehouse: Warehouse,
  boxes: Boxes,
  scale: Scale,
  trending: TrendingUp,
};

interface AcopioKPIProps {
  stats: AcopioKpiItem[];
}

export default function AcopioKPI({ stats }: AcopioKPIProps) {
  return (
    <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((kpi, i) => {
        const Icon = icons[Object.keys(icons)[i % Object.keys(icons).length]];
        return (
          <Card key={kpi.label}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-gray-500">{kpi.label}</p>
                <p className="mt-1.5 text-2xl font-bold text-[#111827]">{kpi.value}</p>
              </div>
              <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${kpi.iconClass}`}>
                <Icon className="h-5 w-5" />
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
