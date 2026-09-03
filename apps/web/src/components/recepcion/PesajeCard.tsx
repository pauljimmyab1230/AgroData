import { ArrowDownRight, ArrowUpRight, Scale, TrendingDown, Warehouse } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Input } from "../ui";
import { CardHeader, CardShell, Field, type FormMode } from "../shared/formControls";
import { formatearPeso } from "../../services/recepciones";
import type { Recepcion } from "../../services/recepciones";

type PesajeCardProps = {
  mode: FormMode;
  values?: Partial<Recepcion>;
  onChange?: <K extends keyof Recepcion>(field: K, value: Recepcion[K]) => void;
};

type ComparacionItem = {
  label: string;
  value: string;
  icon: LucideIcon;
  iconClass: string;
};

export function PesajeCard({ mode, values, onChange }: PesajeCardProps) {
  const editable = mode !== "view";

  const comparacion: ComparacionItem[] = [
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
      label: "Diferencia",
      value: formatearPeso(values?.diferencia ?? 0),
      icon: (values?.diferencia ?? 0) < 0 ? ArrowDownRight : ArrowUpRight,
      iconClass: (values?.diferencia ?? 0) < 0 ? "bg-red-50 text-red-600" : "bg-emerald-50 text-emerald-600",
    },
    {
      label: "Merma",
      value: values?.merma != null ? `${Intl.NumberFormat("es-PE", { maximumFractionDigits: 2 }).format(values.merma)}%` : "—",
      icon: TrendingDown,
      iconClass: "bg-purple-50 text-purple-600",
    },
  ];

  return (
    <CardShell>
      <CardHeader
        icon={<Scale size={20} />}
        title="Pesaje de Recepción"
        description="Registro de los pesos en la balanza de plataforma de la planta"
      />

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <Field
          label="Peso Bruto (kg)"
          mode={mode}
          value={values?.pesoBruto !== undefined ? formatearPeso(values.pesoBruto) : undefined}
        >
          <Input
            type="number"
            step="0.1"
            min="0"
            placeholder="0.0"
            value={values?.pesoBruto ?? ""}
            onChange={(e) => onChange?.("pesoBruto", parseFloat(e.target.value) || 0)}
          />
        </Field>

        <Field
          label="Tara (kg)"
          mode={mode}
          value={values?.tara !== undefined ? formatearPeso(values.tara) : undefined}
        >
          <Input
            type="number"
            step="0.1"
            min="0"
            placeholder="0.0"
            value={values?.tara ?? ""}
            onChange={(e) => onChange?.("tara", parseFloat(e.target.value) || 0)}
          />
        </Field>

        <Field
          label="Peso Neto (kg)"
          mode={mode}
          value={values?.pesoNeto !== undefined ? formatearPeso(values.pesoNeto) : undefined}
        >
          <Input
            type="number"
            step="0.1"
            min="0"
            placeholder="0.0"
            value={values?.pesoNeto ?? ""}
            onChange={(e) => onChange?.("pesoNeto", parseFloat(e.target.value) || 0)}
          />
        </Field>
      </div>

      <div className="mt-6 rounded-xl border border-gray-200 bg-gray-50/50 p-5">
        <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
          Comparación de pesos
        </p>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {comparacion.map((item) => (
            <div key={item.label} className="rounded-xl border border-gray-200 bg-white p-4">
              <div className="mb-3 flex items-center gap-2">
                <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${item.iconClass}`}>
                  <item.icon className="h-4 w-4" />
                </span>
                <p className="text-xs font-medium uppercase tracking-wider text-gray-500">{item.label}</p>
              </div>
              <p className="text-xl font-bold text-forest-700">{item.value}</p>
            </div>
          ))}
        </div>
      </div>
    </CardShell>
  );
}
