import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, X } from "lucide-react";
import { Button, ConfirmDialog, LoadingSpinner, SearchInput, Select } from "../../components/ui";
import CultivoHeader from "../../components/cultivos/CultivoHeader";
import CultivoKPI from "../../components/cultivos/CultivoKPI";
import CultivoTable from "../../components/cultivos/CultivoTable";
import { fetchCultivos, deleteCultivo, type Cultivo, estadosCultivo } from "../../services/cultivos";

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
  const navigate = useNavigate();
  const [cultivos, setCultivos] = useState<Cultivo[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filtroEstado, setFiltroEstado] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const result = await fetchCultivos({
        search: search || undefined,
        estado: filtroEstado || undefined,
        page,
        limit: 10,
      });
      setCultivos(result.data);
      setTotalPages(result.totalPages);
      setTotal(result.total);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [page, filtroEstado]);

  const hasFilters = Boolean(search) || Boolean(filtroEstado);

  const clearFilters = () => {
    setSearch("");
    setFiltroEstado("");
    setPage(1);
  };

  const cultivoAEliminar = cultivos.find((c) => c.id === deleteId);

  const handleView = (id: string) => navigate(`/cultivos/${id}`);
  const handleEdit = (id: string) => navigate(`/cultivos/${id}/editar`);
  const handleDelete = (id: string) => setDeleteId(id);

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
        description="Gestión y seguimiento de cultivos de la cooperativa"
        crumbs={[{ label: "Cultivos" }]}
        actions={
          <Button as="link" to="/cultivos/nuevo" iconLeft={<Plus className="h-4 w-4" />}>
            Nuevo Cultivo
          </Button>
        }
      />

      <CultivoKPI cultivos={cultivos} total={total} />

      <div className="mb-6 flex flex-wrap items-end gap-3">
        <div className="max-w-md min-w-[200px] flex-1">
          <SearchInput
            placeholder="Buscar por código, cultivo o variedad..."
            value={search}
            onChange={(val) => setSearch(val)}
          />
        </div>

        <FilterSelect
          label="Estado"
          placeholder="Todos"
          options={toOptions(estadosCultivo)}
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
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
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
            setCultivos((prev) => prev.filter((c) => c.id !== deleteId));
            setDeleteId(null);
          } catch (err) {
            console.error(err);
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
    </div>
  );
}
