import { useState } from "react";
import { Boxes, Plus, Scale, Users, Warehouse, X } from "lucide-react";
import { Breadcrumb, Button, ConfirmDialog, SearchInput, SectionHeader, Select } from "../../components/ui";
import AcopioKPI from "../../components/acopio/AcopioKPI";
import AcopioTable from "../../components/acopio/AcopioTable";
import {
  acopiadoresOpciones,
  acopiosMock,
  campaniasOpciones,
  comunidadesOpciones,
  estadosAcopioOpciones,
  formatKg,
  productoresOpciones,
} from "./acopioMock";

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

export default function AcopioList() {
  const [search, setSearch] = useState("");
  const [filtroCampania, setFiltroCampania] = useState("");
  const [filtroComunidad, setFiltroComunidad] = useState("");
  const [filtroProductor, setFiltroProductor] = useState("");
  const [filtroAcopiador, setFiltroAcopiador] = useState("");
  const [filtroEstado, setFiltroEstado] = useState("");
  const [page, setPage] = useState(1);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const kpis = [
    {
      label: "Total Acopios",
      value: String(acopiosMock.length),
      icon: Warehouse,
      iconClass: "bg-forest-600/10 text-forest-600",
    },
    {
      label: "Productores Atendidos",
      value: String(new Set(acopiosMock.map((a) => a.productor)).size),
      icon: Users,
      iconClass: "bg-sun-100 text-sun-700",
    },
    {
      label: "Sacos Recibidos",
      value: String(acopiosMock.reduce((acc, a) => acc + a.totalSacos, 0)),
      icon: Boxes,
      iconClass: "bg-forest-600/10 text-forest-600",
    },
    {
      label: "Kilogramos Acopiados",
      value: formatKg(acopiosMock.reduce((acc, a) => acc + a.pesoTotal, 0)),
      icon: Scale,
      iconClass: "bg-red-50 text-red-600",
    },
  ];

  const hasFilters =
    Boolean(search) ||
    Boolean(filtroCampania) ||
    Boolean(filtroComunidad) ||
    Boolean(filtroProductor) ||
    Boolean(filtroAcopiador) ||
    Boolean(filtroEstado);

  const clearFilters = () => {
    setSearch("");
    setFiltroCampania("");
    setFiltroComunidad("");
    setFiltroProductor("");
    setFiltroAcopiador("");
    setFiltroEstado("");
    setPage(1);
  };

  const filtradas = acopiosMock.filter((acopio) => {
    const texto =
      `${acopio.codigo} ${acopio.productor} ${acopio.comunidad} ${acopio.acopiador} ${acopio.cultivo}`.toLowerCase();
    return (
      texto.includes(search.toLowerCase()) &&
      (!filtroCampania || acopio.campania === filtroCampania) &&
      (!filtroComunidad || acopio.comunidad === filtroComunidad) &&
      (!filtroProductor || acopio.productor === filtroProductor) &&
      (!filtroAcopiador || acopio.acopiador === filtroAcopiador) &&
      (!filtroEstado || acopio.estado === filtroEstado)
    );
  });

  const totalPages = Math.max(1, Math.ceil(filtradas.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const visibles = filtradas.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div>
      <Breadcrumb items={[{ label: "Acopio" }]} />

      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <SectionHeader
          title="Acopio"
          description="Recepción de la producción de los productores en sus comunidades de origen."
        />
        <div className="flex items-center gap-2">
          <Button as="link" to="/acopio/nuevo" iconLeft={<Plus className="h-4 w-4" />}>
            Nuevo Acopio
          </Button>
        </div>
      </div>

      <AcopioKPI items={kpis} />

      <div className="mb-6 flex flex-wrap items-end gap-3">
        <div className="max-w-md min-w-[200px] flex-1">
          <SearchInput
            placeholder="Buscar por código, productor, comunidad o acopiador..."
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
          options={toOptions(campaniasOpciones)}
          value={filtroCampania}
          onChange={(val) => {
            setFiltroCampania(val);
            setPage(1);
          }}
        />
        <FilterSelect
          label="Comunidad"
          placeholder="Todas"
          options={toOptions(comunidadesOpciones)}
          value={filtroComunidad}
          onChange={(val) => {
            setFiltroComunidad(val);
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
          label="Acopiador"
          placeholder="Todos"
          options={toOptions(acopiadoresOpciones)}
          value={filtroAcopiador}
          onChange={(val) => {
            setFiltroAcopiador(val);
            setPage(1);
          }}
        />
        <FilterSelect
          label="Estado"
          placeholder="Todos"
          options={toOptions(estadosAcopioOpciones)}
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

      <AcopioTable
        data={visibles}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setPage}
        onDelete={(acopio) => setDeleteId(acopio.id)}
      />

      <ConfirmDialog
        open={deleteId !== null}
        onClose={() => setDeleteId(null)}
        onConfirm={() => setDeleteId(null)}
        title="Eliminar Acopio"
        message="¿Estás seguro de eliminar este acopio? Esta acción no se puede deshacer."
        confirmText="Eliminar"
        variant="danger"
      />
    </div>
  );
}
