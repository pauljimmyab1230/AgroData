import { useState } from "react";
import { BadgeCheck, CalendarClock, ClipboardCheck, Plus, TriangleAlert, X } from "lucide-react";
import { Button, ConfirmDialog, FilterSelect, LoadingSpinner, SearchInput, SectionHeader } from "../../components/ui";
import InspeccionKPI from "../../components/inspecciones/InspeccionKPI";
import InspeccionTable from "../../components/inspecciones/InspeccionTable";
import { useInspecciones, useDeleteInspeccion } from "../../hooks/queries";
import InspeccionModal from "../../components/inspecciones/InspeccionModal";
import { toast } from "../../utils/toast";

const estadoLabels: Record<string, string> = {
  PENDIENTE: "Pendiente",
  APROBADA: "Aprobada",
  NO_CONFORME: "No Conforme",
};

export default function InspeccionList() {
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
    limit: 10,
  };

  const { data: result, isLoading: loading } = useInspecciones(filters);
  const deleteMutation = useDeleteInspeccion();

  const inspecciones = result?.data ?? [];
  const total = result?.total ?? 0;
  const totalPages = result?.totalPages ?? 1;

  const kpis = [
    {
      label: "Total Inspecciones",
      value: String(total),
      icon: ClipboardCheck,
      iconClass: "bg-forest-600/10 text-forest-600",
    },
    {
      label: "Inspecciones Pendientes",
      value: String(inspecciones.filter((i) => i.estado === "PENDIENTE").length),
      icon: CalendarClock,
      iconClass: "bg-sun-100 text-sun-700",
    },
    {
      label: "Inspecciones Aprobadas",
      value: String(inspecciones.filter((i) => i.estado === "APROBADA").length),
      icon: BadgeCheck,
      iconClass: "bg-forest-600/10 text-forest-600",
    },
    {
      label: "No Conformidades",
      value: String(
        inspecciones.reduce((acc, i) => acc + (i.resultado === "NO_CONFORME" ? 1 : 0), 0),
      ),
      icon: TriangleAlert,
      iconClass: "bg-red-50 text-red-600",
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
      toast.success("Inspección eliminada correctamente");
    } catch {
      toast.error("Error al eliminar la inspección");
    }
  };

  return (
    <div>
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <SectionHeader
          title="Inspecciones"
          description="Registro de inspecciones de campo"
        />
        <div className="flex items-center gap-2">
          <Button onClick={() => setShowCreateModal(true)} iconLeft={<Plus className="h-4 w-4" />}>
            Nueva Inspección
          </Button>
        </div>
      </div>

      <InspeccionKPI items={kpis} />

      <div className="mb-6 flex flex-wrap items-end gap-3">
        <div className="max-w-md min-w-[200px] flex-1">
          <SearchInput
            placeholder="Buscar por código, inspector..."
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
          options={Object.entries(estadoLabels).map(([value, label]) => ({ value, label }))}
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
        <InspeccionTable
          data={inspecciones}
          currentPage={page}
          totalPages={totalPages}
          onPageChange={setPage}
          onView={(inspeccion) => setViewId(String(inspeccion.id))}
          onEdit={(inspeccion) => setEditId(String(inspeccion.id))}
          onDelete={(inspeccion) => setDeleteId(String(inspeccion.id))}
        />
      )}

      <ConfirmDialog
        open={deleteId !== null}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Eliminar Inspección"
        message="¿Estás seguro de eliminar esta inspección? Esta acción no se puede deshacer."
        confirmText="Eliminar"
        variant="danger"
      />

      <InspeccionModal
        open={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSave={handleModalClose}
        mode="create"
      />

      <InspeccionModal
        open={editId !== null}
        onClose={() => setEditId(null)}
        onSave={handleModalClose}
        mode="edit"
        inspeccionId={editId || undefined}
      />

      <InspeccionModal
        open={viewId !== null}
        onClose={() => setViewId(null)}
        onSave={handleModalClose}
        onEdit={() => {
          const id = viewId;
          setViewId(null);
          setEditId(id);
        }}
        mode="view"
        inspeccionId={viewId || undefined}
      />
    </div>
  );
}
