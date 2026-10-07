import { Route, Warehouse, User, Package } from "lucide-react";
import { Badge } from "../ui";
import { CardHeader, CardShell } from "../shared/formControls";

interface TrazabilidadItem {
  id: number;
  codigo: string;
  lote_productor?: string | null;
  peso_neto?: number | null;
  cantidad_asignada?: number;
  acopio?: {
    id: number;
    codigo: string;
    detalles?: Array<{
      productor: {
        id: number;
        codigo: string;
        nombres: string;
        apellido_paterno: string;
        apellido_materno: string;
        dni: string;
      };
    }>;
  } | null;
}

interface TrazabilidadCardProps {
  recepciones: TrazabilidadItem[];
  ordenOrigen?: { id: number; codigo: string; producto_salida: string; etapa: string } | null;
  ordenesSiguientes?: Array<{ id: number; codigo: string; producto_salida: string; etapa: string }>;
  productoSalida: string;
}

export function TrazabilidadCard({
  recepciones,
  ordenOrigen,
  ordenesSiguientes,
  productoSalida,
}: TrazabilidadCardProps) {
  return (
    <CardShell>
      <CardHeader
        icon={<Route size={20} />}
        title="Trazabilidad"
        description="Cadena desde el origen hasta el producto"
      />

      <div className="space-y-3">
        {ordenOrigen && (
          <div className="flex items-start gap-3 rounded-lg border border-purple-100 bg-purple-50/50 p-3">
            <Package className="mt-0.5 h-4 w-4 shrink-0 text-purple-600" />
            <div>
              <p className="text-xs font-medium text-purple-700">Proviene de</p>
              <p className="text-sm font-medium text-[#111827]">
                {ordenOrigen.codigo} · {ordenOrigen.producto_salida}
              </p>
              <Badge variant="purple">{ordenOrigen.etapa}</Badge>
            </div>
          </div>
        )}

        {recepciones.length === 0 && !ordenOrigen ? (
          <p className="py-2 text-center text-sm text-gray-500">
            No hay recepciones asignadas ni orden de origen.
          </p>
        ) : (
          recepciones.map((r) => {
            const acopio = r.acopio;
            const productor = acopio?.detalles?.[0]?.productor;
            return (
              <div key={r.id} className="flex items-start gap-3 rounded-lg border border-gray-100 p-3">
                <Warehouse className="mt-0.5 h-4 w-4 shrink-0 text-forest-600" />
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-medium text-gray-500">Recepción</p>
                  <p className="text-sm font-medium text-[#111827]">
                    {r.codigo}
                    {r.lote_productor ? ` · ${r.lote_productor}` : ""}
                  </p>
                  {r.peso_neto != null && (
                    <p className="text-xs text-gray-500">
                      {Number(r.peso_neto).toLocaleString("es-PE")} kg netos · asignados{" "}
                      {Number(r.cantidad_asignada).toLocaleString("es-PE")} kg
                    </p>
                  )}
                  {acopio && (
                    <div className="mt-1 flex items-center gap-2 text-xs text-gray-500">
                      <Package className="h-3 w-3" />
                      <span>Acopio {acopio.codigo}</span>
                    </div>
                  )}
                  {productor && (
                    <div className="mt-1 flex items-center gap-2 text-xs text-gray-500">
                      <User className="h-3 w-3" />
                      <span>
                        {productor.nombres} {productor.apellido_paterno} {productor.apellido_materno} · DNI{" "}
                        {productor.dni}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}

        <div className="flex items-start gap-3 rounded-lg border border-forest-100 bg-forest-50/50 p-3">
          <Package className="mt-0.5 h-4 w-4 shrink-0 text-forest-600" />
          <div>
            <p className="text-xs font-medium text-forest-700">Producto de esta orden</p>
            <p className="text-sm font-medium text-[#111827]">{productoSalida}</p>
          </div>
        </div>

        {ordenesSiguientes && ordenesSiguientes.length > 0 && (
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
              Siguiente etapa
            </p>
            {ordenesSiguientes.map((o) => (
              <div key={o.id} className="flex items-start gap-3 rounded-lg border border-purple-100 bg-purple-50/50 p-3">
                <Package className="mt-0.5 h-4 w-4 shrink-0 text-purple-600" />
                <div>
                  <p className="text-sm font-medium text-[#111827]">
                    {o.codigo} · {o.producto_salida}
                  </p>
                  <Badge variant="purple">{o.etapa}</Badge>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </CardShell>
  );
}
