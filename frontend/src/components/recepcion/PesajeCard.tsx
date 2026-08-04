import { ArrowDownRight, ArrowUpRight, Scale, TrendingDown, Warehouse } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Input } from "../ui";
import { CardHeader, CardShell, Field, type FormMode } from "../shared/formControls";
import { formatKg, formatPct, type Recepcion } from "../../pages/recepcion/recepcionMock";

type PesajeCardProps = {
  mode: FormMode;
  values?: Partial<Recepcion>;
};

type ComparacionItem = {
  label: string;
  value: string;
  icon: LucideIcon;
  iconClass: string;
};

export function PesajeCard({ mode, values }: PesajeCardProps) {
  const editable = mode !== "view";

  const comparacion: ComparacionItem[] = [
    {
      label: "Peso Campo",
      value: formatKg(values?.pesoCampo),
      icon: Scale,
      iconClass: "bg-sun-100 text-sun-700",
    },
    {
      label: "Peso Planta",
      value: formatKg(values?.pesoNeto),
      icon: Warehouse,
      iconClass: "bg-forest-600/10 text-forest-600",
    },
    {
      label: "Diferencia",
      value: formatKg(values?.diferencia),
      icon: (values?.diferencia ?? 0) < 0 ? ArrowDownRight : ArrowUpRight,
      iconClass: (values?.diferencia ?? 0) < 0 ? "bg-red-50 text-red-600" : "bg-emerald-50 text-emerald-600",
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
        icon={<Scale size={20} />}
        title="Pesaje de Recepción"
        description="Registro de los pesos en la balanza de plataforma de la planta"
      />

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <Field
          label="Peso Bruto (kg)"
          mode={mode}
          value={values?.pesoBruto !== undefined ? formatKg(values.pesoBruto) : undefined}
        >
          <Input
            type="number"
            step="0.1"
            min="0"
            placeholder="0.0"
            defaultValue={editable ? values?.pesoBruto : undefined}
          />
        </Field>

        <Field
          label="Tara (kg)"
          mode={mode}
          value={values?.tara !== undefined ? formatKg(values.tara) : undefined}
        >
          <Input
            type="number"
            step="0.1"
            min="0"
            placeholder="0.0"
            defaultValue={editable ? values?.tara : undefined}
          />
        </Field>

        <Field
          label="Peso Neto (kg)"
          mode={mode}
          value={values?.pesoNeto !== undefined ? formatKg(values.pesoNeto) : undefined}
        >
          <Input
            type="number"
            step="0.1"
            min="0"
            placeholder="0.0"
            defaultValue={editable ? values?.pesoNeto : undefined}
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
