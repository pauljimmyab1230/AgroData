import { TrendingUp, TrendingDown, Scale, AlertTriangle, CheckCircle2 } from "lucide-react";
import { CardShell, CardHeader } from "../shared/formControls";
import { Badge } from "../ui";
import type { BalanceOrden } from "../../services/ordenes";

const TIPO_LABELS: Record<string, string> = {
  PRODUCTO_BUENO: "Producto bueno",
  MERMA: "Merma",
  PIEDRAS: "Piedras",
  SAPONINA: "Saponina",
  ENVASE: "Envases",
  OTRO: "Otros",
};

const TIPO_COLORES: Record<string, string> = {
  PRODUCTO_BUENO: "bg-forest-600/10 text-forest-700",
  MERMA: "bg-red-50 text-red-600",
  PIEDRAS: "bg-amber-50 text-amber-700",
  SAPONINA: "bg-purple-50 text-purple-600",
  ENVASE: "bg-blue-50 text-blue-600",
  OTRO: "bg-gray-100 text-gray-600",
};

interface BalanceCardProps {
  balance: BalanceOrden;
}

export function BalanceCard({ balance }: BalanceCardProps) {
  const formatKg = (n: number) => `${n.toLocaleString("es-PE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} kg`;

  return (
    <CardShell>
      <CardHeader
        icon={<Scale size={20} />}
        title="Balance de masa"
        description="Entrada vs salidas pesadas"
        actions={
          balance.balance_ok ? (
            <Badge variant="forest">
              <CheckCircle2 className="mr-1 h-3 w-3" /> Balance OK
            </Badge>
          ) : (
            <Badge variant="red">
              <AlertTriangle className="mr-1 h-3 w-3" /> Revisar balance
            </Badge>
          )
        }
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-gray-100 bg-white p-4">
          <div className="flex items-center gap-2 text-xs font-medium text-gray-500">
            <TrendingDown className="h-3.5 w-3.5 text-forest-600" />
            Entrada
          </div>
          <p className="mt-1 text-xl font-bold text-[#111827]">{formatKg(balance.peso_entrada)}</p>
        </div>

        <div className="rounded-xl border border-gray-100 bg-white p-4">
          <div className="flex items-center gap-2 text-xs font-medium text-gray-500">
            <TrendingUp className="h-3.5 w-3.5 text-sun-600" />
            Salidas
          </div>
          <p className="mt-1 text-xl font-bold text-[#111827]">{formatKg(balance.suma_salidas)}</p>
        </div>

        <div className="rounded-xl border border-gray-100 bg-white p-4">
          <div className="flex items-center gap-2 text-xs font-medium text-gray-500">
            <Scale className="h-3.5 w-3.5 text-gray-400" />
            Diferencia
          </div>
          <p
            className={`mt-1 text-xl font-bold ${
              balance.balance_ok ? "text-forest-700" : "text-red-600"
            }`}
          >
            {balance.diferencia >= 0 ? "+" : ""}
            {formatKg(balance.diferencia)}
          </p>
          <p className="mt-0.5 text-xs text-gray-500">
            {balance.diferencia_pct.toFixed(2)}% · tolera {balance.tolerancia_pct}%
          </p>
        </div>
      </div>

      {Object.keys(balance.por_tipo).length > 0 && (
        <div className="mt-4">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-400">
            Desglose por tipo
          </p>
          <div className="flex flex-wrap gap-2">
            {Object.entries(balance.por_tipo).map(([tipo, cantidad]) => (
              <div
                key={tipo}
                className={`flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm ${TIPO_COLORES[tipo] ?? "bg-gray-100 text-gray-600"}`}
              >
                <span className="font-medium">{TIPO_LABELS[tipo] ?? tipo}</span>
                <span className="font-bold">{formatKg(cantidad)}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </CardShell>
  );
}
