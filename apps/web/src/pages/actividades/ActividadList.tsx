import { useState, useEffect, useCallback } from "react";
import { Plus, X } from "lucide-react";
import { Button, ConfirmDialog, LoadingSpinner, SearchInput, Select } from "../../components/ui";
import { ActividadHeader } from "../../components/actividades/ActividadHeader";
import { ActividadKPI } from "../../components/actividades/ActividadKPI";
import { ActividadTable } from "../../components/actividades/ActividadTable";
import { fetchActividades, deleteActividad, tiposActividad, type Actividad } from "../../services/actividades";
import ActividadModal from "../../components/actividades/ActividadModal";

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
    <div className="w-48">
      <label className="mb-1 block text-xs font-medium text-gray-500">{label}</label>
      <Select options={options} placeholder={placeholder} value={value} onChange={onChange} />
    </div>
  );
}

export default function ActividadList() {
  const [actividades, setActividades] = useState<Actividad[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filtroTipo, setFiltroTipo] = useState("");
  const [filtroEstado, setFiltroEstado] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [viewId, setViewId] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const result = await fetchActividades({
        search: search || undefined,
        tipo_actividad: filtroTipo || undefined,
        estado: filtroEstado || undefined,
        page,
        limit: 10,
      });
      setActividades(result.data);
      setTotalPages(result.totalPages);
    } catch {
      // handled silently
    } finally {
      setLoading(false);
    }
  }, [search, filtroTipo, filtroEstado, page]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const hasFilters = Boolean(search) || Boolean(filtroTipo) || Boolean(filtroEstado);

  const clearFilters = () => {
    setSearch("");
    setFiltroTipo("");
    setFiltroEstado("");
    setPage(1);
  };

  const handleModalClose = () => {
    setShowCreateModal(false);
    setEditId(null);
    setViewId(null);
    loadData();
  };

  const actividadAEliminar = actividades.find((a) => a.id === deleteId);

  const handleConfirmDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteActividad(deleteId);
      setActividades((prev) => prev.filter((a) => a.id !== deleteId));
    } catch {
      // handled silently
    } finally {
      setDeleteId(null);
    }
  };

  if (loading && actividades.length === 0) {
    return (
      <div className="flex items-center justify-center py-20">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div>
      <ActividadHeader
        title="Actividades Agrícolas"
        description="Registro de actividades y labores del campo"
        actions={
          <Button onClick={() => setShowCreateModal(true)} iconLeft={<Plus className="h-4 w-4" />}>
            Nueva Actividad
          </Button>
        }
      />

      <ActividadKPI actividades={actividades} />

      <div className="mb-6 flex flex-wrap items-end gap-3">
        <div className="max-w-md min-w-[200px] flex-1">
          <SearchInput
            placeholder="Buscar por código, productor, parcela, cultivo o técnico..."
            value={search}
            onChange={(val) => {
              setSearch(val);
              setPage(1);
            }}
          />
        </div>

        <FilterSelect
          label="Tipo de Actividad"
          placeholder="Todos"
          options={tiposActividad}
          value={filtroTipo}
          onChange={(val) => {
            setFiltroTipo(val);
            setPage(1);
          }}
        />
        <FilterSelect
          label="Estado"
          placeholder="Todos"
          options={[
            { value: "PROGRAMADA", label: "Programada" },
            { value: "EN_PROCESO", label: "En Proceso" },
            { value: "COMPLETADA", label: "Completada" },
          ]}
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

      <ActividadTable
        data={actividades}
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
        onConfirm={handleConfirmDelete}
        title="Eliminar Actividad"
        message={
          actividadAEliminar
            ? `¿Estás seguro de eliminar la actividad ${actividadAEliminar.codigo} (${actividadAEliminar.tipoActividad})? Esta acción no se puede deshacer.`
            : "¿Estás seguro de eliminar esta actividad? Esta acción no se puede deshacer."
        }
        confirmText="Eliminar"
        variant="danger"
      />

      <ActividadModal
        open={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSave={handleModalClose}
        mode="create"
      />

      <ActividadModal
        open={editId !== null}
        onClose={() => setEditId(null)}
        onSave={handleModalClose}
        mode="edit"
        actividadId={editId || undefined}
      />

      <ActividadModal
        open={viewId !== null}
        onClose={() => setViewId(null)}
        mode="view"
        actividadId={viewId || undefined}
      />
    </div>
  );
}
