import { Package, TrendingUp, DollarSign, ArrowDownRight, ArrowUpRight, MinusCircle } from "lucide-react";
import { Card, Badge } from "../ui";
import type { StatsKardex } from "../../services/kardex";
import { kardexCategoriaLabels, kardexOrigenLabels } from "../../services/kardex";

interface StatsCardProps {
  stats: StatsKardex | undefined;
}

export function StatsCard({ stats }: StatsCardProps) {
  if (!stats) return null;

  const kpis = [
    {
      label: "Items en inventario",
      value: stats.total_items.toLocaleString("es-PE"),
      icon: Package,
      color: "text-blue-600",
    },
    {
      label: "Kg totales en planta",
      value: `${stats.kg_totales.toLocaleString("es-PE")} kg`,
      icon: TrendingUp,
      color: "text-green-600",
    },
    {
      label: "Valor de inventario",
      value: `S/ ${stats.valor_total.toLocaleString("es-PE", { minimumFractionDigits: 2 })}`,
      icon: DollarSign,
      color: "text-purple-600",
    },
    {
      label: "Entradas del mes",
      value: `${stats.movimientos_mes.entradas.total.toLocaleString("es-PE")} kg`,
      icon: ArrowUpRight,
      color: "text-green-500",
    },
    {
      label: "Salidas del mes",
      value: `${stats.movimientos_mes.salidas.total.toLocaleString("es-PE")} kg`,
      icon: ArrowDownRight,
      color: "text-red-500",
    },
    {
      label: "Bajas del mes",
      value: `${stats.movimientos_mes.bajas.total.toLocaleString("es-PE")} kg`,
      icon: MinusCircle,
      color: "text-amber-500",
    },
  ];

  return (
    <Card>
      <h3 className="mb-4 font-semibold text-gray-900">Resumen de inventario</h3>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {kpis.map((k) => (
          <div key={k.label} className="rounded-xl border border-gray-100 bg-gray-50 p-3">
            <div className="flex items-center gap-1.5">
              <k.icon className={`h-3.5 w-3.5 ${k.color}`} />
              <p className="text-xs text-gray-500">{k.label}</p>
            </div>
            <p className="mt-1 text-sm font-bold text-gray-900">{k.value}</p>
          </div>
        ))}
      </div>

      <div className="mt-4 space-y-3">
        <div>
          <p className="mb-1.5 text-xs font-medium text-gray-500">Por categoría</p>
          <div className="flex flex-wrap gap-1.5">
            {Object.entries(stats.por_categoria).map(([cat, data]) => (
              <Badge key={cat} variant="default">
                {kardexCategoriaLabels[cat] ?? cat}: {data.cantidad} items · {Number(data.total).toLocaleString("es-PE")}
              </Badge>
            ))}
          </div>
        </div>

        <div>
          <p className="mb-1.5 text-xs font-medium text-gray-500">Por origen</p>
          <div className="flex flex-wrap gap-1.5">
            {Object.entries(stats.por_origen).map(([origen, data]) => (
              <Badge key={origen} variant="default">
                {kardexOrigenLabels[origen] ?? origen}: {data.cantidad} items · {Number(data.total).toLocaleString("es-PE")}
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
}
