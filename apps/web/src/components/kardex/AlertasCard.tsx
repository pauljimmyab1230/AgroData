import { AlertTriangle, Clock, CheckCircle2, TrendingDown } from "lucide-react";
import { Badge, Card, EmptyState } from "../ui";
import type { AlertasKardex } from "../../services/kardex";
import { kardexCategoriaLabels } from "../../services/kardex";

interface AlertasCardProps {
  alertas: AlertasKardex | undefined;
}

export function AlertasCard({ alertas }: AlertasCardProps) {
  if (!alertas) return null;

  const total = alertas.total_alertas;

  return (
    <Card>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-amber-500" />
          <h3 className="font-semibold text-gray-900">Alertas de inventario</h3>
        </div>
        <Badge variant={total > 0 ? "red" : "green"}>
          {total > 0 ? `${total} alertas` : "Sin alertas"}
        </Badge>
      </div>

      {total === 0 ? (
        <EmptyState
          icon={<CheckCircle2 className="h-10 w-10 text-green-500" />}
          title="Todo en orden"
          description="No hay items bajo mínimo ni próximos a vencer."
        />
      ) : (
        <div className="mt-4 space-y-4">
          {alertas.bajo_minimo.length > 0 && (
            <div>
              <h4 className="mb-2 flex items-center gap-1.5 text-sm font-medium text-gray-700">
                <TrendingDown className="h-4 w-4 text-red-500" />
                Bajo stock mínimo ({alertas.bajo_minimo.length})
              </h4>
              <div className="space-y-1.5">
                {alertas.bajo_minimo.slice(0, 8).map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between rounded-lg border border-red-100 bg-red-50 px-3 py-2"
                  >
                    <div>
                      <p className="text-sm font-medium text-gray-900">{item.producto}</p>
                      <p className="text-xs text-gray-500">
                        {kardexCategoriaLabels[item.categoria] ?? item.categoria} · {item.ubicacion ?? "Sin ubicación"}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-red-600">
                        {Number(item.cantidad_actual).toLocaleString("es-PE")} {item.unidad}
                      </p>
                      <p className="text-xs text-gray-500">
                        mín: {item.cantidad_minima != null ? Number(item.cantidad_minima).toLocaleString("es-PE") : "—"}
                      </p>
                    </div>
                  </div>
                ))}
                {alertas.bajo_minimo.length > 8 && (
                  <p className="text-xs text-gray-500">
                    +{alertas.bajo_minimo.length - 8} más...
                  </p>
                )}
              </div>
            </div>
          )}

          {alertas.proximos_vencer.length > 0 && (
            <div>
              <h4 className="mb-2 flex items-center gap-1.5 text-sm font-medium text-gray-700">
                <Clock className="h-4 w-4 text-amber-500" />
                Próximos a vencer ({alertas.proximos_vencer.length})
              </h4>
              <div className="space-y-1.5">
                {alertas.proximos_vencer.slice(0, 5).map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between rounded-lg border border-amber-100 bg-amber-50 px-3 py-2"
                  >
                    <div>
                      <p className="text-sm font-medium text-gray-900">{item.producto}</p>
                      <p className="text-xs text-gray-500">
                        Vence: {item.fecha_vencimiento ? new Date(item.fecha_vencimiento).toLocaleDateString("es-PE") : "—"}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-amber-600">
                        {Number(item.cantidad_actual).toLocaleString("es-PE")} {item.unidad}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {alertas.vencidos.length > 0 && (
            <div>
              <h4 className="mb-2 flex items-center gap-1.5 text-sm font-medium text-gray-700">
                <AlertTriangle className="h-4 w-4 text-red-600" />
                Vencidos ({alertas.vencidos.length})
              </h4>
              <div className="space-y-1.5">
                {alertas.vencidos.slice(0, 5).map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between rounded-lg border border-red-200 bg-red-100 px-3 py-2"
                  >
                    <div>
                      <p className="text-sm font-medium text-gray-900">{item.producto}</p>
                      <p className="text-xs text-gray-500">
                        Venció: {item.fecha_vencimiento ? new Date(item.fecha_vencimiento).toLocaleDateString("es-PE") : "—"}
                      </p>
                    </div>
                    <Badge variant="red">Dar de baja</Badge>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </Card>
  );
}
