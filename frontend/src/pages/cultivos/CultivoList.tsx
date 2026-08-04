import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, X } from "lucide-react";
import { Button, ConfirmDialog, SearchInput, Select } from "../../components/ui";
import CultivoHeader from "../../components/cultivos/CultivoHeader";
import CultivoKPI from "../../components/cultivos/CultivoKPI";
import CultivoTable from "../../components/cultivos/CultivoTable";
import {
  campanasOpciones,
  cultivosMock,
  cultivosOpciones,
  estadosOpciones,
  parcelasOpciones,
  productoresOpciones,
} from "./cultivoMock";

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

export default function CultivoList() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [filtroCampania, setFiltroCampania] = useState("");
  const [filtroCultivo, setFiltroCultivo] = useState("");
  const [filtroProductor, setFiltroProductor] = useState("");
  const [filtroParcela, setFiltroParcela] = useState("");
  const [filtroEstado, setFiltroEstado] = useState("");
  const [page, setPage] = useState(1);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const hasFilters =
    Boolean(search) ||
    Boolean(filtroCampania) ||
    Boolean(filtroCultivo) ||
    Boolean(filtroProductor) ||
    Boolean(filtroParcela) ||
    Boolean(filtroEstado);

  const clearFilters = () => {
    setSearch("");
    setFiltroCampania("");
    setFiltroCultivo("");
    setFiltroProductor("");
    setFiltroParcela("");
    setFiltroEstado("");
    setPage(1);
  };

  const filtrados = cultivosMock.filter((cultivo) => {
    const texto =
      `${cultivo.codigo} ${cultivo.campania} ${cultivo.productor} ${cultivo.parcela} ${cultivo.cultivo} ${cultivo.variedad}`.toLowerCase();
    return (
      texto.includes(search.toLowerCase()) &&
      (!filtroCampania || cultivo.campania === filtroCampania) &&
      (!filtroCultivo || cultivo.cultivo === filtroCultivo) &&
      (!filtroProductor || cultivo.productor === filtroProductor) &&
      (!filtroParcela || cultivo.parcela === filtroParcela) &&
      (!filtroEstado || cultivo.estado === filtroEstado)
    );
  });

  const totalPages = Math.max(1, Math.ceil(filtrados.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const visibles = filtrados.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div>
      <CultivoHeader
        title="Cultivos"
        description="Gestión de los cultivos sembrados por los socios de la cooperativa"
        crumbs={[{ label: "Cultivos" }]}
        actions={
          <Button as="link" to="/cultivos/nuevo" iconLeft={<Plus className="h-4 w-4" />}>
            Nuevo Cultivo
          </Button>
        }
      />

      <CultivoKPI data={cultivosMock} />

      <div className="mb-6 flex flex-wrap items-end gap-3">
        <div className="max-w-md min-w-[200px] flex-1">
          <SearchInput
            placeholder="Buscar por código, campaña, productor, parcela o cultivo..."
            value={search}
            onChange={(val) => {
              setSearch(val);
              setPage(1);
            }}
          />
        </div>

        <FilterSelect
          label="Campaña"
          placeholder="Todas"
          options={toOptions(campanasOpciones)}
          value={filtroCampania}
          onChange={(val) => {
            setFiltroCampania(val);
            setPage(1);
          }}
        />
        <FilterSelect
          label="Cultivo"
          placeholder="Todos"
          options={toOptions(cultivosOpciones)}
          value={filtroCultivo}
          onChange={(val) => {
            setFiltroCultivo(val);
            setPage(1);
          }}
        />
        <FilterSelect
          label="Productor"
          placeholder="Todos"
          options={toOptions(productoresOpciones)}
          value={filtroProductor}
          onChange={(val) => {
            setFiltroProductor(val);
            setPage(1);
          }}
        />
        <FilterSelect
          label="Parcela"
          placeholder="Todas"
          options={toOptions(parcelasOpciones)}
          value={filtroParcela}
          onChange={(val) => {
            setFiltroParcela(val);
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

      <CultivoTable
        data={visibles}
        onView={(cultivo) => navigate(`/cultivos/${cultivo.id}`)}
        onEdit={(cultivo) => navigate(`/cultivos/${cultivo.id}/editar`)}
        onDelete={(cultivo) => setDeleteId(cultivo.id)}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setPage}
      />

      <ConfirmDialog
        open={deleteId !== null}
        onClose={() => setDeleteId(null)}
        onConfirm={() => setDeleteId(null)}
        title="Eliminar Cultivo"
        message="¿Estás seguro de eliminar este cultivo? Esta acción no se puede deshacer."
        confirmText="Eliminar"
        variant="danger"
      />
    </div>
  );
}
