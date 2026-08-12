import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, X } from "lucide-react";
import { Breadcrumb, Button, ConfirmDialog, LoadingSpinner, SearchInput, Select } from "../../components/ui";
import { CampaniaHeader } from "../../components/campanias/CampaniaHeader";
import { CampaniaKPI } from "../../components/campanias/CampaniaKPI";
import { CampaniaTable } from "../../components/campanias/CampaniaTable";
import { fetchCampanias, deleteCampania, type Campania } from "../../services/campanias";

const aniosAgricolas = ["2025-2026", "2024-2025", "2023-2024", "2022-2023", "2021-2022"];
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
  const navigate = useNavigate();
  const [campanias, setCampanias] = useState<Campania[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filtroAnio, setFiltroAnio] = useState("");
  const [filtroEstado, setFiltroEstado] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const result = await fetchCampanias({
        search: search || undefined,
        estado: filtroEstado || undefined,
        anioAgricola: filtroAnio || undefined,
        page,
        limit: 10,
      });
      setCampanias(result.data);
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
  }, [page, filtroAnio, filtroEstado]);

  const hasFilters = Boolean(search) || Boolean(filtroAnio) || Boolean(filtroEstado);

  const clearFilters = () => {
    setSearch("");
    setFiltroAnio("");
    setFiltroEstado("");
    setPage(1);
  };

  const campaniaAEliminar = campanias.find((c) => c.id === deleteId);

  const handleView = (id: string) => navigate(`/campanias/${id}`);
  const handleEdit = (id: string) => navigate(`/campanias/${id}/editar`);
  const handleDelete = (id: string) => setDeleteId(id);

  if (loading && campanias.length === 0) {
    return (
      <div className="flex items-center justify-center py-20">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div>
      <Breadcrumb items={[{ label: "Campañas" }]} />

      <CampaniaHeader
        title="Campañas"
        description="Planificación y seguimiento de las campañas agrícolas de la cooperativa."
        actions={
          <Button as="link" to="/campanias/nueva" iconLeft={<Plus className="h-4 w-4" />}>
            Nueva Campaña
          </Button>
        }
      />

      <CampaniaKPI campanias={campanias} total={total} />

      <div className="mb-6 flex flex-wrap items-end gap-3">
        <div className="max-w-md min-w-[200px] flex-1">
          <SearchInput
            placeholder="Buscar por código, nombre o año agrícola..."
            value={search}
            onChange={(val) => setSearch(val)}
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
            await deleteCampania(deleteId);
            setCampanias((prev) => prev.filter((c) => c.id !== deleteId));
            setDeleteId(null);
          } catch (err) {
            console.error(err);
          }
        }}
        title="Eliminar Campaña"
        message={
          campaniaAEliminar
            ? `¿Estás seguro de eliminar la campaña ${campaniaAEliminar.codigo} - ${campaniaAEliminar.nombre}? Esta acción no se puede deshacer.`
            : "¿Estás seguro de eliminar esta campaña? Esta acción no se puede deshacer."
        }
        confirmText="Eliminar"
        variant="danger"
      />
    </div>
  );
}
