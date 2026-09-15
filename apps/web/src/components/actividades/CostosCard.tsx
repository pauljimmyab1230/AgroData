import { DollarSign } from "lucide-react";
import { CardHeader, CardShell, type FormMode } from "../shared/formControls";
import type { ActividadFormData } from "../../services/actividades";

type CostosCardProps = {
  mode: FormMode;
  value: ActividadFormData;
};

const formatCurrency = (amount: number | null | undefined): string => {
  if (amount == null) return "S/ 0.00";
  return `S/ ${Number(amount).toFixed(2)}`;
};

export function CostosCard({ mode, value }: CostosCardProps) {
  const costoInsumos = value.insumos.reduce((sum, i) => sum + (i.costoTotal ?? 0), 0);
  const costoManoObra = value.manoObra.reduce((sum, m) => sum + (m.costoTotal ?? 0), 0);
  const costoMaquinaria = value.maquinaria.reduce((sum, m) => sum + (m.costoTotal ?? 0), 0);
  const costoTotal = costoInsumos + costoManoObra + costoMaquinaria;

  return (
    <CardShell>
      <CardHeader
        icon={<DollarSign size={20} />}
        title="Costos de Producción"
        description="Resumen de costos por categoría"
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-blue-200 bg-blue-50 p-4">
          <p className="text-sm font-medium text-blue-700">Insumos</p>
          <p className="mt-1 text-2xl font-bold text-blue-900">{formatCurrency(costoInsumos)}</p>
          <p className="mt-1 text-xs text-blue-600">{value.insumos.length} registro(s)</p>
        </div>

        <div className="rounded-xl border border-green-200 bg-green-50 p-4">
          <p className="text-sm font-medium text-green-700">Mano de Obra</p>
          <p className="mt-1 text-2xl font-bold text-green-900">{formatCurrency(costoManoObra)}</p>
          <p className="mt-1 text-xs text-green-600">{value.manoObra.length} registro(s)</p>
        </div>

        <div className="rounded-xl border border-orange-200 bg-orange-50 p-4">
          <p className="text-sm font-medium text-orange-700">Maquinaria</p>
          <p className="mt-1 text-2xl font-bold text-orange-900">{formatCurrency(costoMaquinaria)}</p>
          <p className="mt-1 text-xs text-orange-600">{value.maquinaria.length} registro(s)</p>
        </div>

        <div className="rounded-xl border border-purple-200 bg-purple-50 p-4">
          <p className="text-sm font-medium text-purple-700">Costo Total</p>
          <p className="mt-1 text-2xl font-bold text-purple-900">{formatCurrency(costoTotal)}</p>
          <p className="mt-1 text-xs text-purple-600">
            {value.insumos.length + value.manoObra.length + value.maquinaria.length} registro(s)
          </p>
        </div>
      </div>

      {costoTotal === 0 && (
        <p className="mt-3 text-center text-sm text-gray-500">
          Agregue insumos, mano de obra o maquinaria para calcular los costos de producción.
        </p>
      )}
    </CardShell>
  );
}
