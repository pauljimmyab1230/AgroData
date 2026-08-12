import { BadgeCheck, Boxes, Scale, TrendingDown, Warehouse } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { CardHeader, CardShell, type FormMode } from "../shared/formControls";
import { formatearPeso } from "../../services/recepciones";
import type { Recepcion } from "../../services/recepciones";
import { ResultadoRecepcionBadge } from "./badges";

function formatPct(valor: number | undefined): string {
  if (valor === undefined) return "—";
  return `${Intl.NumberFormat("es-PE", { maximumFractionDigits: 2 }).format(valor)}%`;
}

type ResumenRecepcionCardProps = {
  mode: FormMode;
  values?: Partial<Recepcion>;
};

type ResumenItem = {
  label: string;
  value?: string;
  icon: LucideIcon;
  iconClass: string;
};

export default function ResumenRecepcionCard({ mode, values }: ResumenRecepcionCardProps) {
  const isView = mode === "view";

  const items: ResumenItem[] = [
    {
      label: "Número de Sacos",
      value: values?.sacos !== undefined ? String(values.sacos) : undefined,
      icon: Boxes,
      iconClass: "bg-forest-600/10 text-forest-600",
    },
    {
      label: "Peso Campo",
      value: formatearPeso(values?.pesoCampo ?? 0),
      icon: Scale,
      iconClass: "bg-sun-100 text-sun-700",
    },
    {
      label: "Peso Planta",
      value: formatearPeso(values?.pesoNeto ?? 0),
      icon: Warehouse,
      iconClass: "bg-forest-600/10 text-forest-600",
    },
    {
      label: "Merma",
      value: formatPct(values?.merma),
      icon: TrendingDown,
      iconClass: "bg-purple-50 text-purple-600",
    },
  ];

  return (
    <CardShell>
      <CardHeader
        icon={<BadgeCheck size={20} />}
        title="Resumen de la Recepción"
        description="Indicadores del ingreso de la materia prima a la planta"
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

        <div className="rounded-xl border border-gray-200 bg-gray-50/50 p-4">
          <div className="mb-3 flex items-center gap-2">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
              <BadgeCheck className="h-4 w-4" />
            </span>
            <p className="text-xs font-medium uppercase tracking-wider text-gray-500">Resultado</p>
          </div>
          <div className={isView ? "text-forest-700" : "text-[#111827]"}>
            <ResultadoRecepcionBadge resultado={values?.resultado} />
          </div>
        </div>
      </div>
    </CardShell>
  );
}
