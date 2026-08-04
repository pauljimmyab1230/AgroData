import { useState } from "react";
import { BadgeCheck, CalendarClock, ClipboardCheck, Plus, TriangleAlert, X } from "lucide-react";
import { Breadcrumb, Button, ConfirmDialog, SearchInput, SectionHeader, Select } from "../../components/ui";
import InspeccionKPI from "../../components/inspecciones/InspeccionKPI";
import InspeccionTable from "../../components/inspecciones/InspeccionTable";
import {
  campaniasOpciones,
  estadosOpciones,
  inspectoresOpciones,
  inspeccionesMock,
  parcelasOpciones,
  productoresOpciones,
} from "./inspeccionMock";

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

export default function InspeccionList() {
  const [search, setSearch] = useState("");
  const [filtroCampania, setFiltroCampania] = useState("");
  const [filtroProductor, setFiltroProductor] = useState("");
  const [filtroParcela, setFiltroParcela] = useState("");
  const [filtroInspector, setFiltroInspector] = useState("");
  const [filtroEstado, setFiltroEstado] = useState("");
  const [page, setPage] = useState(1);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const kpis = [
    {
      label: "Total Inspecciones",
      value: String(inspeccionesMock.length),
      icon: ClipboardCheck,
      iconClass: "bg-forest-600/10 text-forest-600",
    },
    {
      label: "Inspecciones Pendientes",
      value: String(inspeccionesMock.filter((i) => i.estado === "Pendiente").length),
      icon: CalendarClock,
      iconClass: "bg-sun-100 text-sun-700",
    },
    {
      label: "Inspecciones Aprobadas",
      value: String(inspeccionesMock.filter((i) => i.estado === "Aprobada").length),
      icon: BadgeCheck,
      iconClass: "bg-forest-600/10 text-forest-600",
    },
    {
      label: "No Conformidades",
      value: String(
        inspeccionesMock.reduce((acc, i) => acc + (i.resultado === "No Conforme" ? 1 : 0), 0),
      ),
      icon: TriangleAlert,
      iconClass: "bg-red-50 text-red-600",
    },
  ];

  const hasFilters =
    Boolean(search) ||
    Boolean(filtroCampania) ||
    Boolean(filtroProductor) ||
    Boolean(filtroParcela) ||
    Boolean(filtroInspector) ||
    Boolean(filtroEstado);

  const clearFilters = () => {
    setSearch("");
    setFiltroCampania("");
    setFiltroProductor("");
    setFiltroParcela("");
    setFiltroInspector("");
    setFiltroEstado("");
    setPage(1);
  };

  const filtradas = inspeccionesMock.filter((inspeccion) => {
    const texto =
      `${inspeccion.codigo} ${inspeccion.productor} ${inspeccion.parcela} ${inspeccion.inspector} ${inspeccion.cultivo}`.toLowerCase();
    return (
      texto.includes(search.toLowerCase()) &&
      (!filtroCampania || inspeccion.campania === filtroCampania) &&
      (!filtroProductor || inspeccion.productor === filtroProductor) &&
      (!filtroParcela || inspeccion.parcela === filtroParcela) &&
      (!filtroInspector || inspeccion.inspector === filtroInspector) &&
      (!filtroEstado || inspeccion.estado === filtroEstado)
    );
  });

  const totalPages = Math.max(1, Math.ceil(filtradas.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const visibles = filtradas.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div>
      <Breadcrumb items={[{ label: "Inspecciones" }]} />

      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <SectionHeader
          title="Inspecciones"
          description="Registro de inspecciones realizadas a las parcelas y actividades agrícolas."
        />
        <div className="flex items-center gap-2">
          <Button as="link" to="/inspecciones/nueva" iconLeft={<Plus className="h-4 w-4" />}>
            Nueva Inspección
          </Button>
        </div>
      </div>

      <InspeccionKPI items={kpis} />

      <div className="mb-6 flex flex-wrap items-end gap-3">
        <div className="max-w-md min-w-[200px] flex-1">
          <SearchInput
            placeholder="Buscar por código, productor, parcela o inspector..."
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
          label="Inspector"
          placeholder="Todos"
          options={toOptions(inspectoresOpciones)}
          value={filtroInspector}
          onChange={(val) => {
            setFiltroInspector(val);
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

      <InspeccionTable
        data={visibles}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setPage}
        onDelete={(inspeccion) => setDeleteId(inspeccion.id)}
      />

      <ConfirmDialog
        open={deleteId !== null}
        onClose={() => setDeleteId(null)}
        onConfirm={() => setDeleteId(null)}
        title="Eliminar Inspección"
        message="¿Estás seguro de eliminar esta inspección? Esta acción no se puede deshacer."
        confirmText="Eliminar"
        variant="danger"
      />
    </div>
  );
}
