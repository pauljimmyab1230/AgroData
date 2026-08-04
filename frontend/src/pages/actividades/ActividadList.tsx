import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, X } from "lucide-react";
import { Breadcrumb, Button, ConfirmDialog, SearchInput, Select } from "../../components/ui";
import { ActividadHeader } from "../../components/actividades/ActividadHeader";
import { ActividadKPI } from "../../components/actividades/ActividadKPI";
import { ActividadTable } from "../../components/actividades/ActividadTable";
import { actividadesMock, tiposActividad } from "./actividadMock";

const pageSize = 6;

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
    <div className="w-48">
      <label className="mb-1 block text-xs font-medium text-gray-500">{label}</label>
      <Select options={options} placeholder={placeholder} value={value} onChange={onChange} />
    </div>
  );
}

const unicos = (items: string[]) => [...new Set(items)];

export default function ActividadList() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [filtroCampania, setFiltroCampania] = useState("");
  const [filtroCultivo, setFiltroCultivo] = useState("");
  const [filtroParcela, setFiltroParcela] = useState("");
  const [filtroProductor, setFiltroProductor] = useState("");
  const [filtroTipo, setFiltroTipo] = useState("");
  const [filtroTecnico, setFiltroTecnico] = useState("");
  const [page, setPage] = useState(1);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const hasFilters = Boolean(
    search ||
      filtroCampania ||
      filtroCultivo ||
      filtroParcela ||
      filtroProductor ||
      filtroTipo ||
      filtroTecnico,
  );

  const clearFilters = () => {
    setSearch("");
    setFiltroCampania("");
    setFiltroCultivo("");
    setFiltroParcela("");
    setFiltroProductor("");
    setFiltroTipo("");
    setFiltroTecnico("");
    setPage(1);
  };

  const campaniaOpciones = unicos(actividadesMock.map((a) => a.campania));
  const cultivoOpciones = unicos(actividadesMock.map((a) => a.cultivo));
  const parcelaOpciones = unicos(actividadesMock.map((a) => a.parcela));
  const productorOpciones = unicos(actividadesMock.map((a) => a.productor));
  const tecnicoOpciones = unicos(actividadesMock.map((a) => a.responsableTecnico));

  const filtradas = actividadesMock.filter((actividad) => {
    const texto =
      `${actividad.codigo} ${actividad.productor} ${actividad.parcela} ${actividad.cultivo} ${actividad.tipoActividad} ${actividad.responsableTecnico} ${actividad.campania}`.toLowerCase();
    return (
      texto.includes(search.toLowerCase()) &&
      (!filtroCampania || actividad.campania === filtroCampania) &&
      (!filtroCultivo || actividad.cultivo === filtroCultivo) &&
      (!filtroParcela || actividad.parcela === filtroParcela) &&
      (!filtroProductor || actividad.productor === filtroProductor) &&
      (!filtroTipo || actividad.tipoActividad === filtroTipo) &&
      (!filtroTecnico || actividad.responsableTecnico === filtroTecnico)
    );
  });

  const totalPages = Math.max(1, Math.ceil(filtradas.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const visibles = filtradas.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const actividadAEliminar = actividadesMock.find((a) => a.id === deleteId);

  const handleView = (id: number) => navigate(`/actividades/${id}`);
  const handleEdit = (id: number) => navigate(`/actividades/${id}/editar`);
  const handleDelete = (id: number) => setDeleteId(id);

  return (
    <div>
      <Breadcrumb items={[{ label: "Actividades Agrícolas" }]} />

      <ActividadHeader
        title="Actividades Agrícolas"
        description="Registro de las actividades y labores realizadas en el campo."
        actions={
          <Button as="link" to="/actividades/nueva" iconLeft={<Plus className="h-4 w-4" />}>
            Nueva Actividad
          </Button>
        }
      />

      <ActividadKPI actividades={actividadesMock} />

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
          label="Campaña"
          placeholder="Todos"
          options={toOptions(campaniaOpciones)}
          value={filtroCampania}
          onChange={(val) => {
            setFiltroCampania(val);
            setPage(1);
          }}
        />
        <FilterSelect
          label="Cultivo"
          placeholder="Todos"
          options={toOptions(cultivoOpciones)}
          value={filtroCultivo}
          onChange={(val) => {
            setFiltroCultivo(val);
            setPage(1);
          }}
        />
        <FilterSelect
          label="Parcela"
          placeholder="Todas"
          options={toOptions(parcelaOpciones)}
          value={filtroParcela}
          onChange={(val) => {
            setFiltroParcela(val);
            setPage(1);
          }}
        />
        <FilterSelect
          label="Productor"
          placeholder="Todos"
          options={toOptions(productorOpciones)}
          value={filtroProductor}
          onChange={(val) => {
            setFiltroProductor(val);
            setPage(1);
          }}
        />
        <FilterSelect
          label="Tipo de Actividad"
          placeholder="Todos"
          options={toOptions(tiposActividad)}
          value={filtroTipo}
          onChange={(val) => {
            setFiltroTipo(val);
            setPage(1);
          }}
        />
        <FilterSelect
          label="Técnico"
          placeholder="Todos"
          options={toOptions(tecnicoOpciones)}
          value={filtroTecnico}
          onChange={(val) => {
            setFiltroTecnico(val);
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
        title="Eliminar Actividad"
        message={
          actividadAEliminar
            ? `¿Estás seguro de eliminar la actividad ${actividadAEliminar.codigo} (${actividadAEliminar.tipoActividad})? Esta acción no se puede deshacer.`
            : "¿Estás seguro de eliminar esta actividad? Esta acción no se puede deshacer."
        }
        confirmText="Eliminar"
        variant="danger"
      />
    </div>
  );
}
