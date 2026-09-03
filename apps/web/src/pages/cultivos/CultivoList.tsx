import { useState, useEffect } from "react";
import { Plus, X } from "lucide-react";
import { Button, ConfirmDialog, LoadingSpinner, SearchInput, Select } from "../../components/ui";
import CultivoHeader from "../../components/cultivos/CultivoHeader";
import CultivoKPI from "../../components/cultivos/CultivoKPI";
import CultivoTable from "../../components/cultivos/CultivoTable";
import { fetchCultivos, deleteCultivo, fetchCultivoGlobalStats, type Cultivo, type CultivoGlobalStats, estadosCultivoValues } from "../../services/cultivos";
import CultivoModal from "../../components/cultivos/CultivoModal";

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

export default function CultivoList() {
  const [cultivos, setCultivos] = useState<Cultivo[]>([]);
  const [globalStats, setGlobalStats] = useState<CultivoGlobalStats>({ total: 0, estados: {}, areaSembrada: 0, campaniasActivas: 0 });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
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
      };
      const [result, stats] = await Promise.all([
        fetchCultivos({ ...filters, page, limit: 10 }),
        fetchCultivoGlobalStats(filters),
      ]);
      setCultivos(result.data);
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
  }, [page, filtroEstado, search]);

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

  const cultivoAEliminar = cultivos.find((c) => c.id === deleteId);

  if (loading && cultivos.length === 0) {
    return (
      <div className="flex items-center justify-center py-20">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div>
      <CultivoHeader
        title="Cultivos"
        description="Gestión y seguimiento de cultivos"
        crumbs={[]}
        actions={
          <Button onClick={() => setShowCreateModal(true)} iconLeft={<Plus className="h-4 w-4" />}>
            Nuevo Cultivo
          </Button>
        }
      />

      <CultivoKPI stats={globalStats} />

      <div className="mb-6 flex flex-wrap items-end gap-3">
        <div className="max-w-md min-w-[200px] flex-1">
          <SearchInput
            placeholder="Buscar por código, cultivo o variedad..."
            value={search}
            onChange={(val) => { setSearch(val); setPage(1); }}
          />
        </div>

        <FilterSelect
          label="Estado"
          placeholder="Todos"
          options={toOptions(estadosCultivoValues)}
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

      <CultivoTable
        data={cultivos}
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
            await deleteCultivo(deleteId);
            setDeleteId(null);
            loadData();
          } catch {
            // handled silently
          }
        }}
        title="Eliminar Cultivo"
        message={
          cultivoAEliminar
            ? `¿Estás seguro de eliminar el cultivo ${cultivoAEliminar.codigo} - ${cultivoAEliminar.cultivo}? Esta acción no se puede deshacer.`
            : "¿Estás seguro de eliminar este cultivo? Esta acción no se puede deshacer."
        }
        confirmText="Eliminar"
        variant="danger"
      />

      <CultivoModal
        open={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSave={handleModalClose}
        mode="create"
      />

      <CultivoModal
        open={editId !== null}
        onClose={() => setEditId(null)}
        onSave={handleModalClose}
        mode="edit"
        cultivoId={editId || undefined}
      />

      <CultivoModal
        open={viewId !== null}
        onClose={() => setViewId(null)}
        mode="view"
        cultivoId={viewId || undefined}
      />
    </div>
  );
}
