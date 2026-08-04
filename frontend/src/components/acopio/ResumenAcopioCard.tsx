import { ArrowDown, ArrowUp, Hash, Scale, TrendingUp } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { CardHeader, CardShell, type FormMode } from "../shared/formControls";
import { formatKg, type Acopio } from "../../pages/acopio/acopioMock";

type ResumenAcopioCardProps = {
  mode: FormMode;
  values?: Partial<Acopio>;
};

type ResumenItem = {
  label: string;
  value?: string;
  icon: LucideIcon;
  iconClass: string;
};

export default function ResumenAcopioCard({ mode, values }: ResumenAcopioCardProps) {
  const isView = mode === "view";

  const items: ResumenItem[] = [
    {
      label: "Número de Sacos",
      value: values?.totalSacos !== undefined ? String(values.totalSacos) : undefined,
      icon: Hash,
      iconClass: "bg-forest-600/10 text-forest-600",
    },
    {
      label: "Peso Total",
      value: values?.pesoTotal !== undefined ? formatKg(values.pesoTotal) : undefined,
      icon: Scale,
      iconClass: "bg-sun-100 text-sun-700",
    },
    {
      label: "Peso Promedio",
      value: values?.pesoPromedio !== undefined ? formatKg(values.pesoPromedio) : undefined,
      icon: TrendingUp,
      iconClass: "bg-forest-600/10 text-forest-600",
    },
    {
      label: "Peso Máximo",
      value: values?.pesoMaximo !== undefined ? formatKg(values.pesoMaximo) : undefined,
      icon: ArrowUp,
      iconClass: "bg-emerald-50 text-emerald-600",
    },
    {
      label: "Peso Mínimo",
      value: values?.pesoMinimo !== undefined ? formatKg(values.pesoMinimo) : undefined,
      icon: ArrowDown,
      iconClass: "bg-red-50 text-red-600",
    },
  ];

  return (
    <CardShell>
      <CardHeader
        icon={<Scale size={20} />}
        title="Resumen del Acopio"
        description="Indicadores del peso y cantidad de sacos registrados"
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {items.map((item) => (
          <div key={item.label} className="rounded-xl border border-gray-200 bg-gray-50/50 p-4">
            <div className="mb-3 flex items-center gap-2">
              <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${item.iconClass}`}>
                <item.icon className="h-4 w-4" />
              </span>
              <p className="text-xs font-medium uppercase tracking-wider text-gray-500">{item.label}</p>
            </div>
            <p className={`text-xl font-bold ${isView ? "text-forest-700" : "text-[#111827]"}`}>
              {item.value ?? "—"}
            </p>
          </div>
        ))}
      </div>
    </CardShell>
  );
}
