import { useState, useMemo } from "react";
import { Plus, X } from "lucide-react";
import { Button, ConfirmDialog, SearchInput, Select } from "../../components/ui";
import { CampaniaHeader } from "../../components/campanias/CampaniaHeader";
import { CampaniaKPI } from "../../components/campanias/CampaniaKPI";
import { CampaniaTable } from "../../components/campanias/CampaniaTable";
import { useCampanias, useCampaniaGlobalStats, useDeleteCampania } from "../../hooks/queries";
import CampaniaModal from "../../components/campanias/CampaniaModal";
import { campaniaEstados } from "../../services/campanias";
import { toast } from "../../utils/toast";

const currentYear = new Date().getFullYear();
const aniosAgricolas = Array.from({ length: 5 }, (_, i) => {
  const y = currentYear - i;
  return `${y}-${y + 1}`;
});

const toOptions = (items: readonly string[]) => items.map((item) => ({ value: item, label: item }));

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
  const [search, setSearch] = useState("");
  const [filtroAnio, setFiltroAnio] = useState("");
  const [filtroEstado, setFiltroEstado] = useState("");
  const [page, setPage] = useState(1);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [viewId, setViewId] = useState<number | null>(null);

  const filters = useMemo(() => ({
    search: search || undefined,
    estado: filtroEstado || undefined,
    anioAgricola: filtroAnio || undefined,
  }), [search, filtroEstado, filtroAnio]);

  const { data: result, isLoading } = useCampanias({ ...filters, page, limit: 10 });
  const { data: globalStats } = useCampaniaGlobalStats(filters);
  const deleteMutation = useDeleteCampania();

  const campanias = result?.data ?? [];
  const totalPages = result?.totalPages ?? 1;
  const total = result?.total ?? 0;
  const stats = globalStats ?? { total: 0, estados: {} };

  const hasFilters = Boolean(search) || Boolean(filtroAnio) || Boolean(filtroEstado);

  const clearFilters = () => {
    setSearch("");
    setFiltroAnio("");
    setFiltroEstado("");
    setPage(1);
  };

  const campaniaAEliminar = campanias.find((c) => c.id === deleteId);

  if (isLoading && campanias.length === 0) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-forest-600 border-t-transparent" />
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

      <CampaniaKPI stats={stats} />

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
          options={toOptions(campaniaEstados)}
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

      <div className="mb-3 text-sm text-gray-500">
        Mostrando <span className="font-medium text-[#111827]">{campanias.length}</span> de{" "}
        <span className="font-medium text-[#111827]">{total}</span> campañas
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
            await deleteMutation.mutateAsync(deleteId);
            setDeleteId(null);
            toast.success("Campaña eliminada correctamente");
          } catch {
            toast.error("Error al eliminar la campaña");
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
        onSave={() => setShowCreateModal(false)}
        mode="create"
      />

      <CampaniaModal
        open={editId !== null}
        onClose={() => setEditId(null)}
        onSave={() => setEditId(null)}
        mode="edit"
        campaniaId={editId ?? undefined}
      />

      <CampaniaModal
        open={viewId !== null}
        onClose={() => setViewId(null)}
        mode="view"
        campaniaId={viewId ?? undefined}
      />
    </div>
  );
}
