import { useState, useEffect } from "react";
import { Plus, X } from "lucide-react";
import { Button, ConfirmDialog, LoadingSpinner, SearchInput, Select } from "../../components/ui";
import { CampaniaHeader } from "../../components/campanias/CampaniaHeader";
import { CampaniaKPI } from "../../components/campanias/CampaniaKPI";
import { CampaniaTable } from "../../components/campanias/CampaniaTable";
import { fetchCampanias, deleteCampania, fetchCampaniaGlobalStats, type Campania, type CampaniaGlobalStats } from "../../services/campanias";
import CampaniaModal from "../../components/campanias/CampaniaModal";

const currentYear = new Date().getFullYear();
const aniosAgricolas = Array.from({ length: 5 }, (_, i) => {
  const y = currentYear - i;
  return `${y}-${y + 1}`;
});
const estadosOpciones = ["PLANIFICADA", "ACTIVA", "FINALIZADA", "CANCELADA"];

const toOptions = (items: string[]) => items.map((item) => ({ value: item, label: item }));

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

export default function CampaniaList() {
  const [campanias, setCampanias] = useState<Campania[]>([]);
  const [globalStats, setGlobalStats] = useState<CampaniaGlobalStats>({ total: 0, estados: {} });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filtroAnio, setFiltroAnio] = useState("");
  const [filtroEstado, setFiltroEstado] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [viewId, setViewId] = useState<string | null>(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const filters = {
        search: search || undefined,
        estado: filtroEstado || undefined,
        anioAgricola: filtroAnio || undefined,
      };
      const [result, stats] = await Promise.all([
        fetchCampanias({ ...filters, page, limit: 10 }),
        fetchCampaniaGlobalStats(filters),
      ]);
      setCampanias(result.data);
      setGlobalStats(stats);
      setTotalPages(result.totalPages);
      setTotal(result.total);
    } catch {
      // handled silently
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [page, filtroAnio, filtroEstado, search]);

  const hasFilters = Boolean(search) || Boolean(filtroAnio) || Boolean(filtroEstado);

  const clearFilters = () => {
    setSearch("");
    setFiltroAnio("");
    setFiltroEstado("");
    setPage(1);
  };

  const handleModalClose = () => {
    setShowCreateModal(false);
    setEditId(null);
    setViewId(null);
    loadData();
  };

  const campaniaAEliminar = campanias.find((c) => c.id === deleteId);

  if (loading && campanias.length === 0) {
    return (
      <div className="flex items-center justify-center py-20">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div>
      <CampaniaHeader
        title="Campañas"
        description="Planificación y seguimiento de las campañas agrícolas"
        actions={
          <Button onClick={() => setShowCreateModal(true)} iconLeft={<Plus className="h-4 w-4" />}>
            Nueva Campaña
          </Button>
        }
      />

      <CampaniaKPI stats={globalStats} />

      <div className="mb-6 flex flex-wrap items-end gap-3">
        <div className="max-w-md min-w-[200px] flex-1">
          <SearchInput
            placeholder="Buscar por código, nombre o año agrícola..."
            value={search}
            onChange={(val) => { setSearch(val); setPage(1); }}
          />
        </div>

        <FilterSelect
          label="Año"
          placeholder="Todos"
          options={toOptions(aniosAgricolas)}
          value={filtroAnio}
          onChange={(val) => {
            setFiltroAnio(val);
            setPage(1);
          }}
        />

        <FilterSelect
          label="Estado"
          placeholder="Todos"
          options={toOptions(estadosOpciones)}
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

      <CampaniaTable
        data={campanias}
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
        onConfirm={async () => {
          if (!deleteId) return;
          try {
            await deleteCampania(deleteId);
            setDeleteId(null);
            loadData();
          } catch {
            // handled silently
          }
        }}
        title="Eliminar Campaña"
        message={
          campaniaAEliminar
            ? `¿Estás seguro de eliminar la campaña ${campaniaAEliminar.codigo} - ${campaniaAEliminar.nombre}? La campaña dejará de estar activa.`
            : "¿Estás seguro de eliminar esta campaña? La campaña dejará de estar activa."
        }
        confirmText="Eliminar"
        variant="danger"
      />

      <CampaniaModal
        open={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSave={handleModalClose}
        mode="create"
      />

      <CampaniaModal
        open={editId !== null}
        onClose={() => setEditId(null)}
        onSave={handleModalClose}
        mode="edit"
        campaniaId={editId || undefined}
      />

      <CampaniaModal
        open={viewId !== null}
        onClose={() => setViewId(null)}
        mode="view"
        campaniaId={viewId || undefined}
      />
    </div>
  );
}
