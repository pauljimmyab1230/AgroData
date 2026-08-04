import type { LucideIcon } from "lucide-react";
import { Card } from "../ui";

export interface InspeccionKpiItem {
  label: string;
  value: string;
  icon: LucideIcon;
  iconClass: string;
}

interface InspeccionKPIProps {
  items: InspeccionKpiItem[];
}

export default function InspeccionKPI({ items }: InspeccionKPIProps) {
  return (
    <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {items.map((kpi) => (
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
