import { FileBarChart, Scale, TrendingDown, UserRound, Package } from "lucide-react";
import { CardHeader, CardShell, type FormMode } from "../shared/formControls";
import { formatKg, formatPct, type OrdenProcesamiento } from "../../services/procesamientos";

type ReporteProcesamientoCardProps = {
  mode: FormMode;
  values?: Partial<OrdenProcesamiento>;
};

export function ReporteProcesamientoCard({ values }: ReporteProcesamientoCardProps) {
  const orden = values as OrdenProcesamiento | undefined;

  const resumenItems = [
    {
      label: "LP Utilizados",
      value: String(orden?.lotes?.length ?? 0),
      icon: Package,
      iconClass: "bg-purple-50 text-purple-600",
    },
    {
      label: "Peso Inicial",
      value: formatKg(orden?.pesoEntrada ?? 0),
      icon: Scale,
      iconClass: "bg-sun-100 text-sun-700",
    },
    {
      label: "Peso Final",
      value: formatKg(orden?.pesoSalida ?? 0),
      icon: Scale,
      iconClass: "bg-[#0A4174]/10 text-[#0A4174]",
    },
    {
      label: "Merma",
      value: formatKg(orden?.merma ?? 0),
      icon: TrendingDown,
      iconClass: "bg-red-50 text-red-600",
    },
    {
      label: "Rendimiento",
      value: formatPct(orden?.rendimiento ?? 0),
      icon: TrendingDown,
      iconClass: "bg-emerald-50 text-emerald-600",
    },
  ];

  return (
    <CardShell>
      <CardHeader
        icon={<FileBarChart size={20} />}
        title="Resumen del Procesamiento"
        description="Consolidado de la orden de procesamiento"
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {resumenItems.map((item) => (
          <div key={item.label} className="rounded-xl border border-gray-200 bg-gray-50/50 p-4">
            <div className="mb-2 flex items-center gap-2">
              <span className={`flex h-7 w-7 items-center justify-center rounded-lg ${item.iconClass}`}>
                <item.icon size={14} />
              </span>
              <p className="text-xs font-medium uppercase tracking-wider text-gray-500">{item.label}</p>
            </div>
            <p className="text-lg font-bold text-[#111827]">{item.value}</p>
          </div>
        ))}
      </div>
    </CardShell>
  );
}
