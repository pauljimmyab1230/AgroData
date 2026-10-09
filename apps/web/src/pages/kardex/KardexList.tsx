import { useState } from "react";
import {
  AlertTriangle,
  ArrowDownRight,
  Boxes,
  Eye,
  MinusCircle,
  Pencil,
  Plus,
} from "lucide-react";
import {
  Button,
  Card,
  ConfirmDialog,
  SearchInput,
  SectionHeader,
  Select,
  Badge,
  LoadingSpinner,
} from "../../components/ui";
import { AlertasCard } from "../../components/kardex/AlertasCard";
import { StatsCard } from "../../components/kardex/StatsCard";
import { BajaModal } from "../../components/kardex/BajaModal";
import { SalidaModal } from "../../components/kardex/SalidaModal";
import KardexModal from "../../components/kardex/KardexModal";
import {
  useInventario,
  useAlertas,
  useKardexStats,
  useDarDeBaja,
  useDeleteKardex,
  useRegistrarSalida,
} from "../../hooks/queries";
import {
  kardexOrigenLabels,
  kardexCategoriaLabels,
  kardexEtapaLabels,
  type InventarioItem,
} from "../../services/kardex";

const pageSize = 20;

const origenOptions = [
  { value: "CAMPO", label: "De campo" },
  { value: "PROCESAMIENTO", label: "Procesamiento" },
  { value: "AJUSTE", label: "Ajuste" },
  { value: "OTRO", label: "Otro" },
];

const categoriaOptions = [
  { value: "PRODUCTO_CAMPO", label: "Producto de campo" },
  { value: "PRODUCTO_PROCESADO", label: "Producto procesado" },
  { value: "SUBPRODUCTO", label: "Subproducto" },
  { value: "ENVASE", label: "Envase" },
];

const estadoOptions = [
  { value: "DISPONIBLE", label: "Disponible" },
  { value: "RESERVADO", label: "Reservado" },
  { value: "CONSUMIDO", label: "Consumido" },
  { value: "VENCIDO", label: "Vencido" },
];

const estadoBadgeVariant: Record<string, "green" | "yellow" | "red" | "gray"> = {
  DISPONIBLE: "green",
  RESERVADO: "yellow",
  CONSUMIDO: "red",
  VENCIDO: "gray",
};

const categoriaColors: Record<string, string> = {
  PRODUCTO_CAMPO: "bg-blue-50 text-blue-700",
  PRODUCTO_PROCESADO: "bg-green-50 text-green-700",
  SUBPRODUCTO: "bg-amber-50 text-amber-700",
  ENVASE: "bg-purple-50 text-purple-700",
};

export default function KardexList() {
  const [search, setSearch] = useState("");
  const [filtroOrigen, setFiltroOrigen] = useState("");
  const [filtroCategoria, setFiltroCategoria] = useState("");
  const [filtroEstado, setFiltroEstado] = useState("");
  const [page, setPage] = useState(1);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [bajaItem, setBajaItem] = useState<InventarioItem | null>(null);
  const [salidaItem, setSalidaItem] = useState<InventarioItem | null>(null);
  const [modalState, setModalState] = useState<
    | { mode: "create" }
    | { mode: "edit" | "view"; kardexId: number }
    | null
  >(null);

  const filters = {
    search: search || undefined,
    origen: filtroOrigen || undefined,
    categoria: filtroCategoria || undefined,
    estado: filtroEstado || undefined,
    page,
    limit: pageSize,
  };

  const { data: result, isLoading } = useInventario(filters);
  const { data: alertas } = useAlertas();
  const { data: stats } = useKardexStats();
  const deleteMutation = useDeleteKardex();
  const bajaMutation = useDarDeBaja();
  const salidaMutation = useRegistrarSalida();

  const items = result?.data ?? [];
  const totalPages = result?.totalPages ?? 1;

  const hasFilters = Boolean(search) || Boolean(filtroOrigen) || Boolean(filtroCategoria) || Boolean(filtroEstado);

  const clearFilters = () => {
    setSearch("");
    setFiltroOrigen("");
    setFiltroCategoria("");
    setFiltroEstado("");
    setPage(1);
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteMutation.mutateAsync(deleteId);
      setDeleteId(null);
    } catch {
      // ignore
    }
  };

  const handleBaja = async (motivo: string, cantidad?: number, responsable?: string) => {
    if (!bajaItem) return;
    try {
      await bajaMutation.mutateAsync({
        kardexId: bajaItem.id,
        motivo,
        cantidad,
        responsable,
      });
      setBajaItem(null);
    } catch {
      // error handled by MutationCache
    }
  };

  const handleSalida = async (input: Parameters<typeof salidaMutation.mutateAsync>[0]) => {
    try {
      await salidaMutation.mutateAsync(input);
      setSalidaItem(null);
    } catch {
      // error handled by MutationCache
    }
  };

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Kardex"
        description="Inventario vivo de la planta/almacén: productos de campo, procesados, subproductos y envases."
        actions={
          <Button iconLeft={<Plus className="h-4 w-4" />} onClick={() => setModalState({ mode: "create" })}>
            Nuevo Item
          </Button>
        }
      />

      {/* Stats y alertas */}
      <StatsCard stats={stats} />
      <AlertasCard alertas={alertas} />

      {/* Filtros */}
      <Card>
        <div className="flex flex-wrap items-end gap-3">
          <div className="min-w-[200px] flex-1">
            <SearchInput
              placeholder="Buscar por producto, código o ubicación..."
              value={search}
              onChange={(val) => {
                setSearch(val);
                setPage(1);
              }}
            />
          </div>

          <div className="w-40">
            <label className="mb-1 block text-xs font-medium text-gray-500">Origen</label>
            <Select
              options={origenOptions}
              placeholder="Todos"
              value={filtroOrigen}
              onChange={(val) => {
                setFiltroOrigen(val);
                setPage(1);
              }}
            />
          </div>

          <div className="w-44">
            <label className="mb-1 block text-xs font-medium text-gray-500">Categoría</label>
            <Select
              options={categoriaOptions}
              placeholder="Todas"
              value={filtroCategoria}
              onChange={(val) => {
                setFiltroCategoria(val);
                setPage(1);
              }}
            />
          </div>

          <div className="w-36">
            <label className="mb-1 block text-xs font-medium text-gray-500">Estado</label>
            <Select
              options={estadoOptions}
              placeholder="Todos"
              value={filtroEstado}
              onChange={(val) => {
                setFiltroEstado(val);
                setPage(1);
              }}
            />
          </div>

          {hasFilters && (
            <Button variant="ghost" onClick={clearFilters}>
              Limpiar
            </Button>
          )}
        </div>
      </Card>

      {/* Tabla de inventario */}
      <Card>
        {isLoading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner />
          </div>
        ) : items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Boxes className="h-12 w-12 text-gray-300" />
            <p className="mt-2 text-sm text-gray-500">
              No hay items en el inventario con los filtros aplicados.
            </p>
            {hasFilters && (
              <Button variant="ghost" className="mt-2" onClick={clearFilters}>
                Limpiar filtros
              </Button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  <th className="px-3 py-2.5">Producto</th>
                  <th className="px-3 py-2.5">Categoría</th>
                  <th className="px-3 py-2.5">Origen</th>
                  <th className="px-3 py-2.5">Etapa</th>
                  <th className="px-3 py-2.5 text-right">Stock</th>
                  <th className="px-3 py-2.5 text-right">Mínimo</th>
                  <th className="px-3 py-2.5">Ubicación</th>
                  <th className="px-3 py-2.5">Estado</th>
                  <th className="px-3 py-2.5 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {items.map((item) => {
                  const bajoMinimo =
                    item.cantidad_minima != null && Number(item.cantidad_actual) <= Number(item.cantidad_minima);
                  return (
                    <tr key={item.id} className="hover:bg-gray-50/50">
                      <td className="px-3 py-2.5">
                        <button
                          type="button"
                          onClick={() => setModalState({ mode: "view", kardexId: item.id })}
                          className="font-medium text-gray-900 hover:text-forest-700 hover:underline"
                        >
                          {item.producto}
                        </button>
                        <p className="text-xs text-gray-500">{item.codigo}</p>
                      </td>
                      <td className="px-3 py-2.5">
                        <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${categoriaColors[item.categoria] ?? "bg-gray-100 text-gray-600"}`}>
                          {kardexCategoriaLabels[item.categoria] ?? item.categoria}
                        </span>
                      </td>
                      <td className="px-3 py-2.5 text-gray-600">
                        {kardexOrigenLabels[item.origen] ?? item.origen}
                      </td>
                      <td className="px-3 py-2.5 text-gray-600">
                        {item.etapa ? (kardexEtapaLabels[item.etapa] ?? item.etapa) : "—"}
                      </td>
                      <td className="px-3 py-2.5 text-right">
                        <span className={`font-semibold ${bajoMinimo ? "text-red-600" : "text-gray-900"}`}>
                          {Number(item.cantidad_actual).toLocaleString("es-PE")}
                        </span>
                        <span className="text-xs text-gray-500"> {item.unidad}</span>
                      </td>
                      <td className="px-3 py-2.5 text-right text-gray-500">
                        {item.cantidad_minima != null
                          ? Number(item.cantidad_minima).toLocaleString("es-PE")
                          : "—"}
                      </td>
                      <td className="px-3 py-2.5 text-gray-600">{item.ubicacion ?? "—"}</td>
                      <td className="px-3 py-2.5">
                        <Badge variant={estadoBadgeVariant[item.estado] ?? "gray"}>{item.estado}</Badge>
                      </td>
                      <td className="px-3 py-2.5">
                        <div className="flex justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            title="Ver detalle"
                            onClick={() => setModalState({ mode: "view", kardexId: item.id })}
                          >
                            <Eye className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            title="Editar"
                            onClick={() => setModalState({ mode: "edit", kardexId: item.id })}
                          >
                            <Pencil className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            title="Registrar salida"
                            onClick={() => setSalidaItem(item)}
                          >
                            <ArrowDownRight className="h-3.5 w-3.5 text-red-500" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            title="Dar de baja"
                            onClick={() => setBajaItem(item)}
                          >
                            <MinusCircle className="h-3.5 w-3.5 text-amber-600" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            title="Eliminar"
                            onClick={() => setDeleteId(item.id)}
                          >
                            <AlertTriangle className="h-3.5 w-3.5 text-red-500" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Paginación */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-gray-100 px-3 py-2.5">
            <p className="text-xs text-gray-500">
              Página {page} de {totalPages}
            </p>
            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="sm"
                disabled={page <= 1}
                onClick={() => setPage(page - 1)}
              >
                Anterior
              </Button>
              <Button
                variant="ghost"
                size="sm"
                disabled={page >= totalPages}
                onClick={() => setPage(page + 1)}
              >
                Siguiente
              </Button>
            </div>
          </div>
        )}
      </Card>

      {/* Modales */}
      <KardexModal
        open={modalState !== null}
        onClose={() => setModalState(null)}
        onSave={() => setModalState(null)}
        onEdit={(kardexId) => setModalState({ mode: "edit", kardexId })}
        mode={modalState?.mode ?? "view"}
        kardexId={modalState?.mode === "view" || modalState?.mode === "edit" ? modalState.kardexId : undefined}
      />

      <BajaModal
        open={bajaItem !== null}
        onClose={() => setBajaItem(null)}
        onConfirm={handleBaja}
        item={bajaItem}
        loading={bajaMutation.isPending}
      />

      <SalidaModal
        open={salidaItem !== null}
        onClose={() => setSalidaItem(null)}
        onConfirm={handleSalida}
        item={salidaItem}
        loading={salidaMutation.isPending}
      />

      <ConfirmDialog
        open={deleteId !== null}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Eliminar item"
        message="¿Estás seguro? Esta acción no se puede deshacer."
        confirmText="Eliminar"
        variant="danger"
      />
    </div>
  );
}
