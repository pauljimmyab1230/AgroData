import { useState } from "react";
import { Factory, Plus, X, Package, TrendingUp, Layers, Pencil, Eye } from "lucide-react";
import {
  Button,
  ConfirmDialog,
  FilterSelect,
  LoadingSpinner,
  SearchInput,
  SectionHeader,
  Badge,
} from "../../components/ui";
import OrdenModal from "../../components/procesamiento/OrdenModal";
import { useOrdenes, useOrdenStats, useDeleteOrden } from "../../hooks/queries";
import type { OrdenProcesamiento } from "../../services/ordenes";
import { toast } from "../../utils/toast";

const pageSize = 10;

const estadoLabels: Record<string, string> = {
  BORRADOR: "Borrador",
  EN_PROCESO: "En proceso",
  FINALIZADO: "Finalizado",
  PAUSADA: "Pausada",
  CANCELADA: "Cancelada",
};

const etapaLabels: Record<string, string> = {
  PRIMARIA: "Primaria",
  SECUNDARIA: "Secundaria",
  EMPAQUE: "Empaque",
};

const estadoOptions = Object.entries(estadoLabels).map(([value, label]) => ({ value, label }));
const etapaOptions = Object.entries(etapaLabels).map(([value, label]) => ({ value, label }));

const estadoBadge: Record<string, "forest" | "yellow" | "purple" | "red" | "gray"> = {
  BORRADOR: "gray",
  EN_PROCESO: "yellow",
  FINALIZADO: "forest",
  PAUSADA: "purple",
  CANCELADA: "red",
};

export default function OrdenList() {
  const [search, setSearch] = useState("");
  const [filtroEstado, setFiltroEstado] = useState("");
  const [filtroEtapa, setFiltroEtapa] = useState("");
  const [page, setPage] = useState(1);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  // Estado del modal
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit" | "view">("create");
  const [modalOrdenId, setModalOrdenId] = useState<number | undefined>();
  const [modalOrigenId, setModalOrigenId] = useState<number | undefined>();

  const abrirCrear = () => {
    setModalMode("create");
    setModalOrdenId(undefined);
    setModalOrigenId(undefined);
    setModalOpen(true);
  };

  const abrirVer = (id: number) => {
    setModalMode("view");
    setModalOrdenId(id);
    setModalOrigenId(undefined);
    setModalOpen(true);
  };

  const abrirEditar = (id: number) => {
    setModalMode("edit");
    setModalOrdenId(id);
    setModalOrigenId(undefined);
    setModalOpen(true);
  };

  const cerrarModal = () => {
    setModalOpen(false);
    setModalOrdenId(undefined);
    setModalOrigenId(undefined);
  };

  const filters = {
    search: search || undefined,
    estado: filtroEstado || undefined,
    etapa: filtroEtapa || undefined,
    page,
    limit: pageSize,
  };

  const { data: result, isLoading: loading } = useOrdenes(filters);
  const { data: stats } = useOrdenStats();
  const deleteMutation = useDeleteOrden();

  const ordenes = result?.data ?? [];
  const totalPages = result?.totalPages ?? 1;

  const hasFilters = Boolean(search) || Boolean(filtroEstado) || Boolean(filtroEtapa);

  const clearFilters = () => {
    setSearch("");
    setFiltroEstado("");
    setFiltroEtapa("");
    setPage(1);
  };

  const handleDelete = async () => {
    if (deleteId == null) return;
    try {
      await deleteMutation.mutateAsync(deleteId);
      toast.success("Orden eliminada exitosamente");
      setDeleteId(null);
    } catch {
      toast.error("Error al eliminar la orden");
    }
  };

  const kpis = [
    {
      label: "Órdenes totales",
      value: String(stats?.total_ordenes ?? 0),
      icon: Factory,
      iconClass: "bg-forest-600/10 text-forest-600",
    },
    {
      label: "Kg procesados",
      value: `${(stats?.kg_procesados ?? 0).toLocaleString("es-PE")} kg`,
      icon: TrendingUp,
      iconClass: "bg-sun-100 text-sun-700",
    },
    {
      label: "Kg a kardex",
      value: `${(stats?.kg_a_kardex ?? 0).toLocaleString("es-PE")} kg`,
      icon: Package,
      iconClass: "bg-purple-50 text-purple-600",
    },
    {
      label: "En proceso",
      value: String(stats?.por_estado?.EN_PROCESO ?? 0),
      icon: Layers,
      iconClass: "bg-blue-50 text-blue-600",
    },
  ];

  return (
    <div>
      <SectionHeader
        title="Procesamiento"
        description="Órdenes de proceso, balance de masa y producto terminado"
        actions={
          <Button onClick={abrirCrear} iconLeft={<Plus className="h-4 w-4" />}>
            Nueva orden
          </Button>
        }
      />

      <div className="mb-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {kpis.map((k) => (
          <div key={k.label} className="rounded-xl border border-gray-100 bg-white p-4">
            <div className="flex items-center gap-2">
              <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${k.iconClass}`}>
                <k.icon className="h-4 w-4" />
              </div>
              <p className="text-xs font-medium text-gray-500">{k.label}</p>
            </div>
            <p className="mt-2 text-xl font-bold text-[#111827]">{k.value}</p>
          </div>
        ))}
      </div>

      <div className="mb-6 flex flex-wrap items-end gap-3">
        <div className="max-w-md min-w-[200px] flex-1">
          <SearchInput
            placeholder="Buscar por código, producto, planta..."
            value={search}
            onChange={(val) => {
              setSearch(val);
              setPage(1);
            }}
          />
        </div>

        <FilterSelect
          label="Estado"
          placeholder="Todos"
          options={estadoOptions}
          value={filtroEstado}
          onChange={(val) => {
            setFiltroEstado(val);
            setPage(1);
          }}
        />

        <FilterSelect
          label="Etapa"
          placeholder="Todas"
          options={etapaOptions}
          value={filtroEtapa}
          onChange={(val) => {
            setFiltroEtapa(val);
            setPage(1);
          }}
        />

        {hasFilters && (
          <Button variant="ghost" onClick={clearFilters} iconLeft={<X className="h-4 w-4" />}>
            Limpiar filtros
          </Button>
        )}
      </div>

      {loading && ordenes.length === 0 ? (
        <div className="flex items-center justify-center py-20">
          <LoadingSpinner />
        </div>
      ) : (
        <div className="rounded-xl border border-gray-100 bg-white">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 text-left text-xs font-semibold uppercase tracking-wider text-gray-400">
                  <th className="px-4 py-3">Código</th>
                  <th className="px-4 py-3">Producto salida</th>
                  <th className="px-4 py-3">Etapa</th>
                  <th className="px-4 py-3">Formato</th>
                  <th className="px-4 py-3">Estado</th>
                  <th className="px-4 py-3 text-right">Entrada</th>
                  <th className="px-4 py-3 text-right">Salida</th>
                  <th className="px-4 py-3 text-right">Rendimiento</th>
                  <th className="px-4 py-3 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {ordenes.map((o: OrdenProcesamiento) => (
                  <tr key={o.id} className="hover:bg-gray-50/50">
                    <td className="px-4 py-3">
                      <button
                        type="button"
                        onClick={() => abrirVer(o.id)}
                        className="font-medium text-forest-700 hover:underline"
                      >
                        {o.codigo}
                      </button>
                    </td>
                    <td className="px-4 py-3 text-[#111827]">{o.producto_salida}</td>
                    <td className="px-4 py-3">
                      <Badge variant="purple">{etapaLabels[o.etapa] ?? o.etapa}</Badge>
                    </td>
                    <td className="px-4 py-3 text-gray-500">{o.formato_salida}</td>
                    <td className="px-4 py-3">
                      <Badge variant={estadoBadge[o.estado] ?? "gray"}>
                        {estadoLabels[o.estado] ?? o.estado}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-right text-gray-600">
                      {Number(o.peso_entrada).toLocaleString("es-PE")} kg
                    </td>
                    <td className="px-4 py-3 text-right text-gray-600">
                      {Number(o.peso_salida_total).toLocaleString("es-PE")} kg
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span className={o.balance_ok ? "text-forest-700" : "text-amber-600"}>
                        {Number(o.rendimiento).toFixed(1)}%
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-1">
                        <button
                          type="button"
                          onClick={() => abrirVer(o.id)}
                          className="rounded-lg p-1.5 text-gray-400 hover:bg-forest-600/10 hover:text-forest-700"
                          aria-label="Ver"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => abrirEditar(o.id)}
                          disabled={o.estado === "FINALIZADO"}
                          className="rounded-lg p-1.5 text-gray-400 hover:bg-forest-600/10 hover:text-forest-700 disabled:opacity-30"
                          aria-label="Editar"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteId(o.id)}
                          disabled={o.estado === "FINALIZADO"}
                          className="rounded-lg p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-600 disabled:opacity-30"
                          aria-label="Eliminar"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {ordenes.length === 0 && (
            <div className="py-16 text-center">
              <Factory className="mx-auto h-10 w-10 text-gray-300" />
              <p className="mt-2 text-sm text-gray-500">No hay órdenes de procesamiento</p>
              <Button className="mt-4" onClick={abrirCrear}>
                Crear la primera orden
              </Button>
            </div>
          )}

          {totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-gray-100 px-4 py-3">
              <Button variant="ghost" disabled={page <= 1} onClick={() => setPage(page - 1)}>
                Anterior
              </Button>
              <span className="text-sm text-gray-500">
                Página {page} de {totalPages}
              </span>
              <Button variant="ghost" disabled={page >= totalPages} onClick={() => setPage(page + 1)}>
                Siguiente
              </Button>
            </div>
          )}
        </div>
      )}

      <ConfirmDialog
        open={deleteId !== null}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Eliminar orden"
        message="¿Estás seguro de eliminar esta orden de procesamiento? Esta acción no se puede deshacer."
        confirmText={deleteMutation.isPending ? "Eliminando..." : "Eliminar"}
        variant="danger"
      />

      <OrdenModal
        open={modalOpen}
        onClose={cerrarModal}
        onSave={cerrarModal}
        onEdit={(id) => {
          setModalMode("edit");
          setModalOrdenId(id);
        }}
        mode={modalMode}
        ordenId={modalOrdenId}
        ordenOrigenId={modalOrigenId}
      />
    </div>
  );
}
