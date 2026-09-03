import { Scale, TrendingDown, ArrowDownRight, ArrowUpRight, Timer } from "lucide-react";
import { Input } from "../ui";
import { CardHeader, CardShell, Field, type FormMode } from "../shared/formControls";
import { formatKg, formatPct, type OrdenProcesamiento } from "../../services/procesamientos";

type ControlProcesoCardProps = {
  mode: FormMode;
  values?: Partial<OrdenProcesamiento>;
};

export function ControlProcesoCard({ mode, values }: ControlProcesoCardProps) {
  const editable = mode !== "view";

  const comparacion = [
    {
      label: "Peso Entrada",
      value: formatKg(values?.pesoEntrada ?? 0),
      icon: Scale,
      iconClass: "bg-sun-100 text-sun-700",
    },
    {
      label: "Peso Salida",
      value: formatKg(values?.pesoSalida ?? 0),
      icon: Scale,
      iconClass: "bg-[#0A4174]/10 text-[#0A4174]",
    },
    {
      label: "Merma",
      value: formatKg(values?.merma ?? 0),
      icon: TrendingDown,
      iconClass: "bg-red-50 text-red-600",
    },
    {
      label: "Rendimiento",
      value: formatPct(values?.rendimiento ?? 0),
      icon: values?.rendimiento && values.rendimiento > 0 ? ArrowUpRight : ArrowDownRight,
      iconClass: values?.rendimiento && values.rendimiento > 0 ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600",
    },
  ];

  return (
    <CardShell>
      <CardHeader
        icon={<Scale size={20} />}
        title="Control de Proceso"
        description="Registro de pesos de entrada y salida, merma y rendimiento"
      />

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Field label="Peso Entrada (kg)" mode={mode} value={values?.pesoEntrada ? formatKg(values.pesoEntrada) : undefined}>
          <Input
            type="number"
            step="0.1"
            min="0"
            placeholder="0.0"
            value={values?.pesoEntrada ?? ""}
            onChange={(e) => {}}
            disabled
          />
        </Field>

        <Field label="Peso Salida (kg)" mode={mode} value={values?.pesoSalida ? formatKg(values.pesoSalida) : undefined}>
          <Input
            type="number"
            step="0.1"
            min="0"
            placeholder="0.0"
            value={values?.pesoSalida ?? ""}
            onChange={(e) => {}}
            disabled={!editable}
          />
        </Field>

        <Field label="Merma (kg)" mode={mode} value={values?.merma ? formatKg(values.merma) : undefined}>
          <Input
            type="number"
            step="0.1"
            min="0"
            placeholder="0.0"
            value={values?.merma ?? ""}
            onChange={(e) => {}}
            disabled
          />
        </Field>

        <Field label="Rendimiento (%)" mode={mode} value={values?.rendimiento ? formatPct(values.rendimiento) : undefined}>
          <Input
            type="number"
            step="0.1"
            min="0"
            max="100"
            placeholder="0.0"
            value={values?.rendimiento ?? ""}
            onChange={(e) => {}}
            disabled
          />
        </Field>
      </div>

      <div className="mt-6 rounded-2xl border border-gray-200 bg-gray-50/50 p-5">
        <div className="mb-4 flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#0A4174]/10 text-[#0A4174]">
            <Scale size={14} />
          </span>
          <h4 className="text-sm font-semibold text-[#111827]">Comparación de Pesos</h4>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {comparacion.map((item) => (
            <div key={item.label} className="rounded-xl border border-gray-200 bg-white p-4">
              <div className="mb-3 flex items-center gap-2">
                <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${item.iconClass}`}>
                  <item.icon className="h-4 w-4" />
                </span>
                <p className="text-xs font-medium uppercase tracking-wider text-gray-500">{item.label}</p>
              </div>
              <p className="text-xl font-bold text-[#111827]">{item.value}</p>
            </div>
          ))}
        </div>
      </div>
    </CardShell>
  );
}
