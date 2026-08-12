import { FileBarChart, Scale, TrendingDown, UserRound, Package } from "lucide-react";
import { Card } from "../ui";
import { CardHeader, CardShell, type FormMode } from "../shared/formControls";
import { formatKg, formatPct, type OrdenProcesamiento } from "../../services/procesamientos";

type ReporteProcesamientoCardProps = {
  mode: FormMode;
  values?: Partial<OrdenProcesamiento>;
};

export function ReporteProcesamientoCard({ values }: ReporteProcesamientoCardProps) {
  const orden = values as OrdenProcesamiento | undefined;
  const resultado = orden?.resultado;

  const resumenItems = [
    {
      label: "LP Utilizados",
      value: String(orden?.lotesProductor?.length ?? 0),
      icon: Package,
      iconClass: "bg-purple-50 text-purple-600",
    },
    {
      label: "Peso Inicial",
      value: formatKg(resultado?.pesoEntrada),
      icon: Scale,
      iconClass: "bg-sun-100 text-sun-700",
    },
    {
      label: "Peso Final",
      value: formatKg(resultado?.pesoSalida),
      icon: Scale,
      iconClass: "bg-forest-600/10 text-forest-600",
    },
    {
      label: "Merma",
      value: formatKg(resultado?.merma),
      icon: TrendingDown,
      iconClass: "bg-red-50 text-red-600",
    },
    {
      label: "Rendimiento",
      value: formatPct(resultado?.rendimiento),
      icon: TrendingDown,
      iconClass: "bg-emerald-50 text-emerald-600",
    },
    {
      label: "Responsable",
      value: orden?.responsable ?? "—",
      icon: UserRound,
      iconClass: "bg-sky-50 text-sky-600",
    },
  ];

  return (
    <CardShell>
      <CardHeader
        icon={<FileBarChart size={20} />}
        title="Reporte de Procesamiento"
        description="Resumen consolidado del procesamiento realizado"
      />

      {!resultado ? (
        <div className="rounded-xl border-2 border-dashed border-gray-200 bg-gray-50/50 p-10 text-center">
          <FileBarChart className="mx-auto mb-3 h-8 w-8 text-gray-300" />
          <p className="text-sm font-medium text-gray-500">Reporte no disponible</p>
          <p className="mt-1 text-xs text-gray-400">
            El reporte se generará una vez completado el procesamiento.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {resumenItems.map((item) => (
            <Card key={item.label} padding="md">
              <div className="flex items-center gap-3">
                <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${item.iconClass}`}>
                  <item.icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-gray-500">{item.label}</p>
                  <p className="mt-0.5 text-lg font-bold text-[#111827]">{item.value}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </CardShell>
  );
}
