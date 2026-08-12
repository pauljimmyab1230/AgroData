import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Calendar, DollarSign, MapPin, Package, Pencil, TrendingUp, User } from "lucide-react";
import { Breadcrumb, Button, Card, Badge } from "../../components/ui";
import { fetchInventarioItem, calcularValorInventario, formatearFecha, formatearPeso, type InventarioItem } from "../../services/inventarios";

const estadoBadgeVariant: Record<string, "green" | "yellow" | "red" | "gray"> = {
  DISPONIBLE: "green",
  RESERVADO: "yellow",
  AGOTADO: "red",
  VENCIDO: "gray",
};

const categoriaLabels: Record<string, string> = {
  MATERIA_PRIMA: "Materia Prima",
  PRODUCTO_TERMINADO: "Producto Terminado",
  EMPAQUE: "Empaque",
  INSUMO: "Insumo",
};

export default function InventarioView() {
  const { id } = useParams();
  const [item, setItem] = useState<InventarioItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    fetchInventarioItem(id)
      .then(setItem)
      .catch(() => setItem(null))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-sm text-gray-400">Cargando item...</p>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-sm text-gray-400">Item no encontrado.</p>
      </div>
    );
  }

  const valorTotal = calcularValorInventario(item.cantidadActual, item.costoUnitario);

  return (
    <div>
      <Breadcrumb items={[{ label: "Inventario", to: "/inventario" }, { label: item.codigo }]} />

      <div className="mb-8 flex items-center gap-4">
        <Button variant="ghost" as="link" to="/inventario" iconLeft={<ArrowLeft className="h-4 w-4" />}>
          Inventario
        </Button>
      </div>

      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#111827]">{item.producto}</h1>
          <p className="text-sm text-gray-500">{item.codigo}</p>
        </div>
        <Button
          variant="secondary"
          as="link"
          to={`/inventario/${item.id}/editar`}
          iconLeft={<Pencil className="h-4 w-4" />}
        >
          Editar
        </Button>
      </div>

      <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-gray-500">Stock Actual</p>
              <p className="mt-1.5 text-2xl font-bold text-[#111827]">{item.cantidadActual} {item.unidad}</p>
            </div>
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-forest-600/10 text-forest-600">
              <Package className="h-5 w-5" />
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-gray-500">Stock Mínimo</p>
              <p className="mt-1.5 text-2xl font-bold text-[#111827]">{item.cantidadMinima} {item.unidad}</p>
            </div>
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-100 text-amber-700">
              <TrendingUp className="h-5 w-5" />
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-gray-500">Estado</p>
              <p className="mt-1.5 text-2xl font-bold text-[#111827]">
                <Badge variant={estadoBadgeVariant[item.estado] || "gray"}>{item.estado}</Badge>
              </p>
            </div>
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
              <Package className="h-5 w-5" />
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-gray-500">Valor Total</p>
              <p className="mt-1.5 text-2xl font-bold text-[#111827]">S/ {valorTotal.toFixed(2)}</p>
            </div>
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-100 text-purple-600">
              <DollarSign className="h-5 w-5" />
            </div>
          </div>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-500">Información Básica</h3>
          <div className="space-y-3">
            <div className="flex justify-between border-b border-gray-100 py-2">
              <span className="text-sm text-gray-500">Código</span>
              <span className="text-sm font-medium text-[#111827]">{item.codigo}</span>
            </div>
            <div className="flex justify-between border-b border-gray-100 py-2">
              <span className="text-sm text-gray-500">Producto</span>
              <span className="text-sm font-medium text-[#111827]">{item.producto}</span>
            </div>
            <div className="flex justify-between border-b border-gray-100 py-2">
              <span className="text-sm text-gray-500">Categoría</span>
              <Badge variant="forest">{categoriaLabels[item.categoria] || item.categoria}</Badge>
            </div>
            <div className="flex justify-between border-b border-gray-100 py-2">
              <span className="text-sm text-gray-500">Unidad</span>
              <span className="text-sm font-medium text-[#111827]">{item.unidad}</span>
            </div>
            <div className="flex justify-between border-b border-gray-100 py-2">
              <span className="text-sm text-gray-500">Ubicación</span>
              <span className="text-sm font-medium text-[#111827] flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5 text-gray-400" /> {item.ubicacion}
              </span>
            </div>
            <div className="flex justify-between border-b border-gray-100 py-2">
              <span className="text-sm text-gray-500">Costo Unitario</span>
              <span className="text-sm font-medium text-[#111827]">S/ {item.costoUnitario.toFixed(2)}</span>
            </div>
            <div className="flex justify-between border-b border-gray-100 py-2">
              <span className="text-sm text-gray-500">Lote</span>
              <span className="text-sm font-medium text-[#111827]">{item.loteCodigo || "—"}</span>
            </div>
            <div className="flex justify-between border-b border-gray-100 py-2">
              <span className="text-sm text-gray-500">Proveedor</span>
              <span className="text-sm font-medium text-[#111827] flex items-center gap-1.5">
                <User className="h-3.5 w-3.5 text-gray-400" /> {item.proveedor || "—"}
              </span>
            </div>
            <div className="flex justify-between border-b border-gray-100 py-2">
              <span className="text-sm text-gray-500">Fecha de Ingreso</span>
              <span className="text-sm font-medium text-[#111827] flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5 text-gray-400" /> {formatearFecha(item.fechaIngreso) || "—"}
              </span>
            </div>
            <div className="flex justify-between border-b border-gray-100 py-2">
              <span className="text-sm text-gray-500">Fecha de Vencimiento</span>
              <span className="text-sm font-medium text-[#111827] flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5 text-gray-400" /> {formatearFecha(item.fechaVencimiento) || "—"}
              </span>
            </div>
            {item.observaciones && (
              <div className="flex justify-between py-2">
                <span className="text-sm text-gray-500">Observaciones</span>
                <span className="max-w-xs text-right text-sm text-[#111827]">{item.observaciones}</span>
              </div>
            )}
          </div>
        </Card>

        <Card>
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-500">Historial de Movimientos</h3>
          {item.movimientos.length === 0 ? (
            <p className="py-8 text-center text-sm text-gray-400">No hay movimientos registrados.</p>
          ) : (
            <div className="space-y-3">
              {item.movimientos.map((m) => (
                <div
                  key={m.id}
                  className="flex items-start gap-3 rounded-xl border border-gray-100 p-3"
                >
                  <div
                    className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-xs font-bold ${
                      m.tipo === "ENTRADA"
                        ? "bg-emerald-100 text-emerald-700"
                        : m.tipo === "SALIDA"
                          ? "bg-red-100 text-red-700"
                          : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {m.tipo === "ENTRADA" ? "+" : m.tipo === "SALIDA" ? "-" : "~"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-sm font-medium text-[#111827]">{m.tipo}</span>
                      <span className="text-xs text-gray-400">{formatearFecha(m.fecha)}</span>
                    </div>
                    <p className="mt-0.5 text-sm text-gray-500">
                      {m.cantidad} {item.unidad} — {m.descripcion || "Sin descripción"}
                    </p>
                    <p className="mt-0.5 text-xs text-gray-400">
                      Ref: {m.referencia || "—"} · {m.usuario}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
