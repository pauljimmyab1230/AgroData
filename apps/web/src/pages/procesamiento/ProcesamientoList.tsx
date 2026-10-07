import { useState } from "react";
import { Factory, Hash, Scale, TrendingDown, X } from "lucide-react";
import { Button, ConfirmDialog, FilterSelect, LoadingSpinner, SearchInput, SectionHeader } from "../../components/ui";
import ProcesamientoKPI from "../../components/procesamiento/ProcesamientoKPI";
import ProcesamientoTable from "../../components/procesamiento/ProcesamientoTable";
import { useProcesamientos, useDeleteProcesamiento } from "../../hooks/queries";
import {
  procesamientoEstados,
  formatearPeso,
} from "../../services/procesamientos";
import ProcesamientoModal from "../../components/procesamiento/ProcesamientoModal";
import { toast } from "../../utils/toast";

const pageSize = 10;

const toOptions = (items: readonly string[]) => items.map((item) => ({ value: item, label: item }));

export default function ProcesamientoList() {
  const [search, setSearch] = useState("");
  const [filtroEstado, setFiltroEstado] = useState("");
  const [page, setPage] = useState(1);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [viewId, setViewId] = useState<string | null>(null);

  const filters = {
    search: search || undefined,
    estado: filtroEstado || undefined,
    page,
    limit: pageSize,
  };

  const { data: result, isLoading: loading } = useProcesamientos(filters);
  const deleteMutation = useDeleteProcesamiento();

  const data = result?.data ?? [];
  const total = result?.total ?? 0;
  const totalPages = result?.totalPages ?? 1;

  const completadas = data.filter((o) => o.estado === "COMPLETADA");
  const totalProcesados = completadas.reduce((acc, o) => acc + o.lotes.length, 0);
  const kgProcesados = completadas.reduce((acc, o) => acc + o.pesoSalida, 0);
  const rendimientoPromedio =
    completadas.length > 0
      ? completadas.reduce((acc, o) => acc + o.rendimiento, 0) / completadas.length
      : 0;

  const kpis = [
    {
      label: "Órdenes de Procesamiento",
      value: String(total),
      icon: Factory,
      iconClass: "bg-forest-600/10 text-forest-600",
    },
    {
      label: "Kilogramos Procesados",
      value: formatearPeso(kgProcesados),
      icon: Scale,
      iconClass: "bg-sun-100 text-sun-700",
    },
    {
      label: "Productos Base Generados",
      value: String(totalProcesados),
      icon: Hash,
      iconClass: "bg-purple-50 text-purple-600",
    },
    {
      label: "Rendimiento Promedio",
      value: `${rendimientoPromedio.toFixed(1)}%`,
      icon: TrendingDown,
      iconClass: "bg-emerald-50 text-emerald-600",
    },
  ];

  const hasFilters =
    Boolean(search) ||
    Boolean(filtroEstado);

  const clearFilters = () => {
    setSearch("");
    setFiltroEstado("");
    setPage(1);
  };

  const handleModalClose = () => {
    setShowCreateModal(false);
    setEditId(null);
    setViewId(null);
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteMutation.mutateAsync(deleteId);
      setDeleteId(null);
      toast.success("Procesamiento eliminado correctamente");
    } catch {
      toast.error("Error al eliminar el procesamiento");
    }
  };

  return (
    <div>
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <SectionHeader
          title="Procesamiento Primario"
          description="Registro y seguimiento de órdenes de procesamiento"
        />
        <div className="flex items-center gap-2">
          <Button onClick={() => setShowCreateModal(true)} iconLeft={<Factory className="h-4 w-4" />}>
            Nueva Orden de Procesamiento
          </Button>
        </div>
      </div>

      <ProcesamientoKPI items={kpis} />

      <div className="mb-6 flex flex-wrap items-end gap-3">
        <div className="max-w-md min-w-[200px] flex-1">
          <SearchInput
            placeholder="Buscar por código, producto, responsable, LP..."
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
          options={toOptions(procesamientoEstados)}
          value={filtroEstado}
          onChange={(val) => {
            setFiltroEstado(val);
            setPage(1);
          }}
        />

        {hasFilters && (
          <Button variant="ghost" onClick={clearFilters} iconLeft={<X className="h-4 w-4" />}>
            Limpiar filtros
          </Button>
        )}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <LoadingSpinner />
        </div>
      ) : (
        <ProcesamientoTable
          data={data}
          currentPage={page}
          totalPages={totalPages}
          onPageChange={setPage}
          onView={(op) => setViewId(op.id ?? null)}
          onEdit={(op) => setEditId(op.id ?? null)}
          onDelete={(op) => setDeleteId(op.id ?? null)}
        />
      )}

      <ConfirmDialog
        open={deleteId !== null}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Eliminar Orden de Procesamiento"
        message="¿Estás seguro de eliminar esta orden de procesamiento? Esta acción no se puede deshacer."
        confirmText={deleteMutation.isPending ? "Eliminando..." : "Eliminar"}
        variant="danger"
      />

      <ProcesamientoModal
        open={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSave={handleModalClose}
        mode="create"
      />

      <ProcesamientoModal
        open={editId !== null}
        onClose={() => setEditId(null)}
        onSave={handleModalClose}
        mode="edit"
        procesamientoId={editId || undefined}
      />

      <ProcesamientoModal
        open={viewId !== null}
        onClose={() => setViewId(null)}
        mode="view"
        procesamientoId={viewId || undefined}
      />
    </div>
  );
}
