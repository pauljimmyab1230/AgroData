import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, X } from "lucide-react";
import { Breadcrumb, Button, ConfirmDialog, SearchInput, Select } from "../../components/ui";
import { CampaniaHeader } from "../../components/campanias/CampaniaHeader";
import { CampaniaKPI } from "../../components/campanias/CampaniaKPI";
import { CampaniaTable } from "../../components/campanias/CampaniaTable";
import { aniosAgricolas, campaniasMock, estadosOpciones } from "./campaniaMock";

const pageSize = 5;

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
  const [search, setSearch] = useState("");
  const [filtroAnio, setFiltroAnio] = useState("");
  const [filtroEstado, setFiltroEstado] = useState("");
  const [page, setPage] = useState(1);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const hasFilters = Boolean(search) || Boolean(filtroAnio) || Boolean(filtroEstado);

  const clearFilters = () => {
    setSearch("");
    setFiltroAnio("");
    setFiltroEstado("");
    setPage(1);
  };

  const filtradas = campaniasMock.filter((campania) => {
    const texto = `${campania.codigo} ${campania.nombre} ${campania.anioAgricola}`.toLowerCase();
    return (
      texto.includes(search.toLowerCase()) &&
      (!filtroAnio || campania.anioAgricola === filtroAnio) &&
      (!filtroEstado || campania.estado === filtroEstado)
    );
  });

  const totalPages = Math.max(1, Math.ceil(filtradas.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const visibles = filtradas.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const campaniaAEliminar = campaniasMock.find((c) => c.id === deleteId);

  const handleView = (id: number) => navigate(`/campanias/${id}`);
  const handleEdit = (id: number) => navigate(`/campanias/${id}/editar`);
  const handleDelete = (id: number) => setDeleteId(id);

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

      <CampaniaKPI campanias={campaniasMock} />

      <div className="mb-6 flex flex-wrap items-end gap-3">
        <div className="max-w-md min-w-[200px] flex-1">
          <SearchInput
            placeholder="Buscar por código, nombre o año agrícola..."
            value={search}
            onChange={(val) => {
              setSearch(val);
              setPage(1);
            }}
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
        data={visibles}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setPage}
      />

      <ConfirmDialog
        open={deleteId !== null}
        onClose={() => setDeleteId(null)}
        onConfirm={() => setDeleteId(null)}
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
