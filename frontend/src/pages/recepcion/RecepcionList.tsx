import { useState } from "react";
import { Hash, PackageCheck, Plus, Scale, Timer, X } from "lucide-react";
import { Breadcrumb, Button, ConfirmDialog, SearchInput, SectionHeader, Select } from "../../components/ui";
import RecepcionKPI from "../../components/recepcion/RecepcionKPI";
import RecepcionTable from "../../components/recepcion/RecepcionTable";
import {
  campaniasOpciones,
  comunidadesOpciones,
  estadosRecepcionOpciones,
  formatKg,
  productoresOpciones,
  recepcionesMock,
} from "./recepcionMock";

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

export default function RecepcionList() {
  const [search, setSearch] = useState("");
  const [filtroCampania, setFiltroCampania] = useState("");
  const [filtroComunidad, setFiltroComunidad] = useState("");
  const [filtroProductor, setFiltroProductor] = useState("");
  const [filtroEstado, setFiltroEstado] = useState("");
  const [page, setPage] = useState(1);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const kpis = [
    {
      label: "Recepciones",
      value: String(recepcionesMock.length),
      icon: PackageCheck,
      iconClass: "bg-forest-600/10 text-forest-600",
    },
    {
      label: "Kilogramos Recibidos",
      value: formatKg(recepcionesMock.reduce((acc, r) => acc + (r.pesoNeto ?? 0), 0)),
      icon: Scale,
      iconClass: "bg-sun-100 text-sun-700",
    },
    {
      label: "LP Recepcionados",
      value: String(new Set(recepcionesMock.map((r) => r.loteProductor)).size),
      icon: Hash,
      iconClass: "bg-purple-50 text-purple-600",
    },
    {
      label: "Pendientes de Procesamiento",
      value: String(
        recepcionesMock.filter((r) => r.estado === "Disponible para Procesamiento").length,
      ),
      icon: Timer,
      iconClass: "bg-red-50 text-red-600",
    },
  ];

  const hasFilters =
    Boolean(search) ||
    Boolean(filtroCampania) ||
    Boolean(filtroComunidad) ||
    Boolean(filtroProductor) ||
    Boolean(filtroEstado);

  const clearFilters = () => {
    setSearch("");
    setFiltroCampania("");
    setFiltroComunidad("");
    setFiltroProductor("");
    setFiltroEstado("");
    setPage(1);
  };

  const filtradas = recepcionesMock.filter((recepcion) => {
    const texto =
      `${recepcion.codigo} ${recepcion.productor} ${recepcion.comunidad} ${recepcion.cultivo} ${recepcion.loteProductor}`.toLowerCase();
    return (
      texto.includes(search.toLowerCase()) &&
      (!filtroCampania || recepcion.campania === filtroCampania) &&
      (!filtroComunidad || recepcion.comunidad === filtroComunidad) &&
      (!filtroProductor || recepcion.productor === filtroProductor) &&
      (!filtroEstado || recepcion.estado === filtroEstado)
    );
  });

  const totalPages = Math.max(1, Math.ceil(filtradas.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const visibles = filtradas.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div>
      <Breadcrumb items={[{ label: "Recepción" }]} />

      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <SectionHeader
          title="Recepción de Materia Prima"
          description="Registro y verificación de la materia prima que ingresa del Acopio hacia la planta."
        />
        <div className="flex items-center gap-2">
          <Button as="link" to="/recepcion/nuevo" iconLeft={<Plus className="h-4 w-4" />}>
            Nueva Recepción
          </Button>
        </div>
      </div>

      <RecepcionKPI items={kpis} />

      <div className="mb-6 flex flex-wrap items-end gap-3">
        <div className="max-w-md min-w-[200px] flex-1">
          <SearchInput
            placeholder="Buscar por código, productor, comunidad, cultivo o LP..."
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
          label="Estado"
          placeholder="Todos"
          options={toOptions(estadosRecepcionOpciones)}
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

      <RecepcionTable
        data={visibles}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setPage}
        onDelete={(recepcion) => setDeleteId(recepcion.id)}
      />

      <ConfirmDialog
        open={deleteId !== null}
        onClose={() => setDeleteId(null)}
        onConfirm={() => setDeleteId(null)}
        title="Eliminar Recepción"
        message="¿Estás seguro de eliminar esta recepción? Esta acción no se puede deshacer."
        confirmText="Eliminar"
        variant="danger"
      />
    </div>
  );
}
