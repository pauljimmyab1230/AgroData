import { ArrowRight, Package } from "lucide-react";
import { Badge, Button } from "../ui";
import { CardHeader, CardShell } from "../shared/formControls";
import type { OrdenProcesamiento } from "../../services/ordenes";

interface EncadenarPanelProps {
  orden: OrdenProcesamiento;
  onEncadenar: () => void;
}

export function EncadenarPanel({ orden, onEncadenar }: EncadenarPanelProps) {
  const productoBueno = (orden.salidas ?? []).find(
    (s) => s.tipo_salida === "PRODUCTO_BUENO" && s.cuenta_en_balance,
  );
  const esEtapaPrimaria = orden.etapa === "PRIMARIA";
  const puedeEncadenar = orden.estado === "FINALIZADO" && esEtapaPrimaria && productoBueno;

  return (
    <CardShell>
      <CardHeader
        icon={<ArrowRight size={20} />}
        title="Siguiente etapa"
        description={
          esEtapaPrimaria
            ? "Transforma el producto bueno en harina, hojuelas, pop u otro formato"
            : "Esta orden ya es de la etapa final"
        }
      />

      {!esEtapaPrimaria ? (
        <p className="py-2 text-sm text-gray-500">
          Las órdenes de etapa {orden.etapa.toLowerCase()} no generan etapas siguientes.
        </p>
      ) : (
        <div className="space-y-3">
          {productoBueno ? (
            <div className="flex items-center gap-3 rounded-lg border border-forest-100 bg-forest-50/50 p-3">
              <Package className="h-4 w-4 shrink-0 text-forest-600" />
              <div className="flex-1">
                <p className="text-xs font-medium text-forest-700">Disponible para transformar</p>
                <p className="text-sm font-medium text-[#111827]">
                  {orden.producto_salida} · {Number(productoBueno.cantidad).toLocaleString("es-PE")}{" "}
                  {productoBueno.unidad}
                </p>
              </div>
              <Badge variant="forest">{productoBueno.unidad}</Badge>
            </div>
          ) : (
            <p className="py-2 text-sm text-amber-600">
              Registra primero una salida de tipo "Producto bueno" para poder encadenar la siguiente etapa.
            </p>
          )}

          <Button
            onClick={onEncadenar}
            disabled={!puedeEncadenar}
            iconLeft={<ArrowRight className="h-4 w-4" />}
          >
            Crear orden de la siguiente etapa
          </Button>

          {orden.estado !== "FINALIZADO" && (
            <p className="text-xs text-gray-500">
              La orden debe estar finalizada para poder encadenar.
            </p>
          )}
        </div>
      )}
    </CardShell>
  );
}
