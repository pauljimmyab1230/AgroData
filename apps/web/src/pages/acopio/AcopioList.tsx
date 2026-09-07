import { useCallback, useEffect, useState } from "react";
import { Plus, X } from "lucide-react";
import { Button, ConfirmDialog, LoadingSpinner, SearchInput, SectionHeader, Select } from "../../components/ui";
import AcopioKPI from "../../components/acopio/AcopioKPI";
import AcopioTable from "../../components/acopio/AcopioTable";
import { fetchAcopios, fetchAcopioStats, deleteAcopio, type Acopio, formatKg } from "../../services/acopios";
import AcopioModal from "../../components/acopio/AcopioModal";
import { toast } from "../../utils/toast";

const pageSize = 10;

function FilterSelect({
  label,
  placeholder,
  options,
  value,
  onChange,
}: {
  label: string;
  placeholder: string;
  options: { value: string; label: string }[];
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="w-44">
      <label className="mb-1 block text-xs font-medium text-gray-500">{label}</label>
      <Select options={options} placeholder={placeholder} value={value} onChange={onChange} />
    </div>
  );
}

export default function AcopioList() {
  const [search, setSearch] = useState("");
  const [filtroEstado, setFiltroEstado] = useState("");
  const [page, setPage] = useState(1);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [viewId, setViewId] = useState<string | null>(null);

  const [acopios, setAcopios] = useState<Acopio[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  const [stats, setStats] = useState({
    total_acopios: 0,
    sacos_recibidos: 0,
    kilogramos_acopiados: 0,
  });

  const loadData = useCallback(() => {
    const params: Record<string, unknown> = { page, limit: pageSize };
    if (search) params.search = search;
    if (filtroEstado) params.estado = filtroEstado;

    setLoading(true);
    fetchAcopios(params as any)
      .then((res) => {
        setAcopios(res.data);
        setTotalPages(res.totalPages);
      })
      .catch(() => {
        setAcopios([]);
      })
      .finally(() => setLoading(false));
  }, [search, filtroEstado, page]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  useEffect(() => {
    fetchAcopioStats()
      .then(setStats)
      .catch(() => {});
  }, []);

  const kpis = [
    {
      label: "Total Acopios",
      value: String(stats.total_acopios),
      iconClass: "bg-forest-600/10 text-forest-600",
    },
    {
      label: "Sacos Recibidos",
      value: String(stats.sacos_recibidos),
      iconClass: "bg-forest-600/10 text-forest-600",
    },
    {
      label: "Kilogramos Acopiados",
      value: formatKg(stats.kilogramos_acopiados),
      iconClass: "bg-red-50 text-red-600",
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
    loadData();
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteAcopio(deleteId);
      setDeleteId(null);
      loadData();
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
            onChange={(val) => { setSearch(val); setPage(1); }}
          />
        </div>

        <FilterSelect
          label="Estado"
          placeholder="Todos"
          options={[
            { value: "EN_PROCESO", label: "En Proceso" },
            { value: "COMPLETADO", label: "Completado" },
            { value: "EN_PLANTA", label: "En Planta" },
          ]}
          value={filtroEstado}
          onChange={(val) => { setFiltroEstado(val); setPage(1); }}
        />

        {hasFilters && (
          <Button variant="ghost" onClick={clearFilters} iconLeft={<X className="h-4 w-4" />}>
            Limpiar filtros
          </Button>
        )}
      </div>

      <AcopioTable
        data={acopios}
        onView={(id) => setViewId(id)}
        onEdit={(id) => setEditId(id)}
        onDelete={(id) => setDeleteId(id)}
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
        confirmText="Eliminar"
        variant="danger"
      />

      <AcopioModal
        open={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSave={handleModalClose}
        mode="create"
      />

      <AcopioModal
        open={editId !== null}
        onClose={() => setEditId(null)}
        onSave={handleModalClose}
        mode="edit"
        acopioId={editId || undefined}
      />

      <AcopioModal
        open={viewId !== null}
        onClose={() => setViewId(null)}
        mode="view"
        acopioId={viewId || undefined}
      />
    </div>
  );
}
