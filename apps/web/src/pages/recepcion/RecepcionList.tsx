import { useEffect, useState } from "react";
import { Hash, PackageCheck, Plus, Scale, Timer, X } from "lucide-react";
import { Button, ConfirmDialog, FilterSelect, LoadingSpinner, SearchInput, SectionHeader } from "../../components/ui";
import RecepcionKPI from "../../components/recepcion/RecepcionKPI";
import RecepcionTable from "../../components/recepcion/RecepcionTable";
import {
  type Recepcion,
  type RecepcionStats,
  fetchRecepciones,
  fetchRecepcionStats,
  deleteRecepcion,
  formatearPeso,
  recepcionEstados,
} from "../../services/recepciones";
import RecepcionModal from "../../components/recepcion/RecepcionModal";
import { toast } from "../../utils/toast";

const pageSize = 10;

const estadoLabels: Record<string, string> = {
  PENDIENTE_PESAJE: "Pendiente de Pesaje",
  EN_CONTROL_CALIDAD: "En Control de Calidad",
  DISPONIBLE: "Disponible",
  RECHAZADA: "Rechazada",
};

const estadoOptions = recepcionEstados.map((e) => ({
  value: e,
  label: estadoLabels[e] ?? e,
}));

export default function RecepcionList() {
  const [search, setSearch] = useState("");
  const [filtroEstado, setFiltroEstado] = useState("");
  const [page, setPage] = useState(1);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [viewId, setViewId] = useState<number | null>(null);

  const [recepciones, setRecepciones] = useState<Recepcion[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<RecepcionStats | null>(null);

  const loadData = () => {
    setLoading(true);
    fetchRecepciones({
      search: search || undefined,
      estado: filtroEstado || undefined,
      page,
      limit: pageSize,
    })
      .then((result) => {
        setRecepciones(result.data);
        setTotal(result.total);
        setTotalPages(result.totalPages);
      })
      .catch(() => {
        toast.error("Error al cargar recepciones");
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
  }, [search, filtroEstado, page]);

  useEffect(() => {
    fetchRecepcionStats()
      .then(setStats)
      .catch(() => undefined);
  }, [recepciones.length]);

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
    loadData();
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      await deleteRecepcion(String(deleteId));
      setDeleteId(null);
      loadData();
      toast.success("Recepción eliminada correctamente");
    } catch {
      toast.error("Error al eliminar la recepción");
    } finally {
      setDeleting(false);
    }
  };

  const kpis = [
    {
      label: "Recepciones",
      value: loading ? "—" : String(total),
      icon: PackageCheck,
      iconClass: "bg-forest-600/10 text-forest-600",
    },
    {
      label: "Kilogramos Recibidos",
      value: loading || !stats ? "—" : formatearPeso(stats.peso_neto_total),
      icon: Scale,
      iconClass: "bg-sun-100 text-sun-700",
    },
    {
      label: "LP Recepcionados",
      value: loading || !stats ? "—" : String(stats.lotes_distintos),
      icon: Hash,
      iconClass: "bg-purple-50 text-purple-600",
    },
    {
      label: "Pendientes de Procesamiento",
      value: loading || !stats ? "—" : String(stats.pendientes_pesaje),
      icon: Timer,
      iconClass: "bg-red-50 text-red-600",
    },
  ];

  return (
    <div>
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <SectionHeader
          title="Recepción de Materia Prima"
          description="Registro y verificación de materia prima"
        />
        <div className="flex items-center gap-2">
          <Button onClick={() => setShowCreateModal(true)} iconLeft={<Plus className="h-4 w-4" />}>
            Nueva Recepción
          </Button>
        </div>
      </div>

      <RecepcionKPI items={kpis} />

      <div className="mb-6 flex flex-wrap items-end gap-3">
        <div className="max-w-md min-w-[200px] flex-1">
          <SearchInput
            placeholder="Buscar por código, LP..."
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
        <RecepcionTable
          data={recepciones}
          currentPage={page}
          totalPages={totalPages}
          onPageChange={setPage}
          onView={(recepcion) => setViewId(recepcion.id)}
          onEdit={(recepcion) => setEditId(recepcion.id)}
          onDelete={(recepcion) => setDeleteId(recepcion.id)}
        />
      )}

      <ConfirmDialog
        open={deleteId !== null}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Eliminar Recepción"
        message="¿Estás seguro de eliminar esta recepción? Esta acción no se puede deshacer."
        confirmText={deleting ? "Eliminando..." : "Eliminar"}
        variant="danger"
      />

      <RecepcionModal
        open={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSave={handleModalClose}
        mode="create"
      />

      <RecepcionModal
        open={editId !== null}
        onClose={() => setEditId(null)}
        onSave={handleModalClose}
        mode="edit"
        recepcionId={editId || undefined}
      />

      <RecepcionModal
        open={viewId !== null}
        onClose={() => setViewId(null)}
        onEdit={(id) => { setViewId(null); setEditId(Number(id)); }}
        mode="view"
        recepcionId={viewId || undefined}
      />
    </div>
  );
}
