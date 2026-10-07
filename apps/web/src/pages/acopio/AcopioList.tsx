import { useState } from "react";
import { Plus, X } from "lucide-react";
import { Button, ConfirmDialog, FilterSelect, LoadingSpinner, SearchInput, SectionHeader } from "../../components/ui";
import AcopioKPI from "../../components/acopio/AcopioKPI";
import AcopioTable from "../../components/acopio/AcopioTable";
import { useAcopios, useAcopioStats, useDeleteAcopio } from "../../hooks/queries";
import { formatKg, ESTADO_ACOPIO_OPTIONS } from "../../services/acopios";
import AcopioModal from "../../components/acopio/AcopioModal";
import { toast } from "../../utils/toast";

const pageSize = 10;

export default function AcopioList() {
  const [search, setSearch] = useState("");
  const [filtroEstado, setFiltroEstado] = useState("");
  const [page, setPage] = useState(1);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [viewId, setViewId] = useState<number | null>(null);

  const filters = {
    page,
    limit: pageSize,
    search: search || undefined,
    estado: filtroEstado || undefined,
  };

  const { data: result, isLoading: loading } = useAcopios(filters);
  const { data: stats } = useAcopioStats();
  const deleteMutation = useDeleteAcopio();

  const acopios = result?.data ?? [];
  const totalPages = result?.totalPages ?? 1;

  const kpis = [
    {
      label: "Total Acopios",
      value: String(stats?.total_acopios ?? 0),
      iconClass: "bg-forest-600/10 text-forest-600",
    },
    {
      label: "Sacos Recibidos",
      value: String(stats?.sacos_recibidos ?? 0),
      iconClass: "bg-forest-600/10 text-forest-600",
    },
    {
      label: "Kilogramos Acopiados",
      value: formatKg(stats?.kilogramos_acopiados ?? 0),
      iconClass: "bg-red-50 text-red-600",
    },
    {
      label: "Kilogramos Netos",
      value: formatKg(stats?.kilogramos_neto ?? 0),
      iconClass: "bg-violet-100 text-violet-600",
    },
  ];

  const hasFilters = Boolean(search) || Boolean(filtroEstado);

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
    if (deleteId == null) return;
    try {
      await deleteMutation.mutateAsync(deleteId);
      setDeleteId(null);
      toast.success("Acopio eliminado correctamente");
    } catch {
      toast.error("Error al eliminar el acopio");
    }
  };

  const acopioAEliminar = acopios.find((a) => a.id === deleteId);

  if (loading && acopios.length === 0) {
    return (
      <div className="flex items-center justify-center py-20">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div>
      <SectionHeader
        title="Acopios"
        description="Gestión de acopios de producción"
        actions={
          <Button onClick={() => setShowCreateModal(true)} iconLeft={<Plus className="h-4 w-4" />}>
            Nuevo Acopio
          </Button>
        }
      />

      <AcopioKPI stats={kpis} />

      <div className="mb-6 flex flex-wrap items-end gap-3">
        <div className="max-w-md min-w-[200px] flex-1">
          <SearchInput
            placeholder="Buscar por código o acopiador..."
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
          options={ESTADO_ACOPIO_OPTIONS}
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

      <AcopioTable
        data={acopios}
        onView={(id: number) => setViewId(id)}
        onEdit={(id: number) => setEditId(id)}
        onDelete={(id: number) => setDeleteId(id)}
        currentPage={page}
        totalPages={totalPages}
        onPageChange={setPage}
      />

      <ConfirmDialog
        open={deleteId !== null}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Eliminar Acopio"
        message={
          acopioAEliminar
            ? `¿Estás seguro de eliminar el acopio ${acopioAEliminar.codigo}? Esta acción no se puede deshacer.`
            : "¿Estás seguro de eliminar este acopio? Esta acción no se puede deshacer."
        }
        confirmText={deleteMutation.isPending ? "Eliminando..." : "Eliminar"}
        variant="danger"
      />

      <AcopioModal open={showCreateModal} onClose={() => setShowCreateModal(false)} onSave={handleModalClose} mode="create" />

      <AcopioModal open={editId !== null} onClose={() => setEditId(null)} onSave={handleModalClose} mode="edit" acopioId={editId ? String(editId) : undefined} />

      <AcopioModal open={viewId !== null} onClose={() => setViewId(null)} mode="view" acopioId={viewId ? String(viewId) : undefined} />
    </div>
  );
}
