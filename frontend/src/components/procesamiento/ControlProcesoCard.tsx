import { Scale, TrendingDown, Clock, ArrowDownRight, ArrowUpRight, Timer } from "lucide-react";
import { Input } from "../ui";
import { CardHeader, CardShell, Field, type FormMode } from "../shared/formControls";
import { formatKg, formatPct, type OrdenProcesamiento } from "../../pages/procesamiento/procesamientoMock";

type ControlProcesoCardProps = {
  mode: FormMode;
  values?: Partial<OrdenProcesamiento>;
};

export function ControlProcesoCard({ mode, values }: ControlProcesoCardProps) {
  const editable = mode !== "view";
  const resultado = values?.resultado;

  const comparacion = [
    {
      label: "Peso Entrada",
      value: formatKg(resultado?.pesoEntrada),
      icon: Scale,
      iconClass: "bg-sun-100 text-sun-700",
    },
    {
      label: "Peso Salida",
      value: formatKg(resultado?.pesoSalida),
      icon: Scale,
      iconClass: "bg-forest-600/10 text-forest-600",
    },
    {
      label: "Merma",
      value: formatKg(resultado?.merma),
      icon: (resultado?.merma ?? 0) > 0 ? ArrowDownRight : ArrowUpRight,
      iconClass: (resultado?.merma ?? 0) > 0 ? "bg-red-50 text-red-600" : "bg-emerald-50 text-emerald-600",
    },
    {
      label: "Rendimiento",
      value: formatPct(resultado?.rendimiento),
      icon: TrendingDown,
      iconClass: "bg-purple-50 text-purple-600",
    },
  ];

  return (
    <CardShell>
      <CardHeader
        icon={<Scale size={20} />}
        title="Control del Proceso"
        description="Control de pesos, merma, rendimiento y tiempos del procesamiento"
      />

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <Field
          label="Peso de Entrada (kg)"
          mode={mode}
          value={resultado?.pesoEntrada !== undefined ? formatKg(resultado.pesoEntrada) : undefined}
        >
          <Input
            type="number"
            step="0.1"
            min="0"
            placeholder="0.0"
            defaultValue={editable ? resultado?.pesoEntrada : undefined}
          />
        </Field>

        <Field
          label="Peso de Salida (kg)"
          mode={mode}
          value={resultado?.pesoSalida !== undefined ? formatKg(resultado.pesoSalida) : undefined}
        >
          <Input
            type="number"
            step="0.1"
            min="0"
            placeholder="0.0"
            defaultValue={editable ? resultado?.pesoSalida : undefined}
          />
        </Field>

        <Field
          label="Merma (kg)"
          mode={mode}
          value={resultado?.merma !== undefined ? formatKg(resultado.merma) : undefined}
        >
          <Input
            type="number"
            step="0.1"
            min="0"
            placeholder="0.0"
            defaultValue={editable ? resultado?.merma : undefined}
          />
        </Field>

        <Field
          label="Hora de Inicio"
          mode={mode}
          value="08:00"
        >
          <Input type="time" defaultValue="08:00" />
        </Field>

        <Field
          label="Hora de Finalización"
          mode={mode}
          value="16:30"
        >
          <Input type="time" defaultValue="16:30" />
        </Field>

        <div className="flex items-center gap-3 rounded-xl border border-gray-200 bg-gray-50/50 p-4">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
            <Timer className="h-4 w-4" />
          </div>
          <div>
            <p className="text-xs font-medium text-gray-500">Duración Total</p>
            <p className="text-sm font-semibold text-[#111827]">8h 30min</p>
          </div>
        </div>
      </div>

      <div className="mt-6 rounded-xl border border-gray-200 bg-gray-50/50 p-5">
        <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
          Resumen del Control
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
