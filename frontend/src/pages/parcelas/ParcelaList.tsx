import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Pencil, Eye, Trash2, MapPin, Ruler, Users, BadgeCheck, X } from "lucide-react";
import {
  Badge,
  Breadcrumb,
  Button,
  Card,
  ConfirmDialog,
  DataTable,
  SearchInput,
  SectionHeader,
  Select,
} from "../../components/ui";
import {
  parcelasMock,
  comunidadesOpciones,
  cultivosOpciones,
  estadosOpciones,
  productoresOpciones,
  type Parcela,
} from "./parcelaMock";

const pageSize = 5;

const estadoBadge = (estado: string) =>
  estado === "Activa" ? <Badge variant="forest">Activa</Badge> : <Badge variant="gray">Inactiva</Badge>;

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

export default function ParcelaList() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [filtroComunidad, setFiltroComunidad] = useState("");
  const [filtroCultivo, setFiltroCultivo] = useState("");
  const [filtroEstado, setFiltroEstado] = useState("");
  const [filtroProductor, setFiltroProductor] = useState("");
  const [page, setPage] = useState(1);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const hasFilters =
    Boolean(search) ||
    Boolean(filtroComunidad) ||
    Boolean(filtroCultivo) ||
    Boolean(filtroEstado) ||
    Boolean(filtroProductor);

  const clearFilters = () => {
    setSearch("");
    setFiltroComunidad("");
    setFiltroCultivo("");
    setFiltroEstado("");
    setFiltroProductor("");
    setPage(1);
  };

  const filtradas = parcelasMock.filter((parcela) => {
    const texto =
      `${parcela.codigo} ${parcela.nombre} ${parcela.productor} ${parcela.comunidad} ${parcela.cultivoPrincipal}`.toLowerCase();
    return (
      texto.includes(search.toLowerCase()) &&
      (!filtroComunidad || parcela.comunidad === filtroComunidad) &&
      (!filtroCultivo || parcela.cultivoPrincipal === filtroCultivo) &&
      (!filtroEstado || parcela.estado === filtroEstado) &&
      (!filtroProductor || parcela.productor === filtroProductor)
    );
  });

  const totalPages = Math.max(1, Math.ceil(filtradas.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const visibles = filtradas.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const kpis = [
    { label: "Total Parcelas", value: String(parcelasMock.length), icon: MapPin, iconClass: "bg-forest-600/10 text-forest-600" },
    {
      label: "Área Total",
      value: `${parcelasMock.reduce((acc, p) => acc + parseFloat(p.areaTotal), 0).toFixed(2)} ha`,
      icon: Ruler,
      iconClass: "bg-sun-100 text-sun-700",
    },
    {
      label: "Productores con Parcelas",
      value: String(new Set(parcelasMock.map((p) => p.productor)).size),
      icon: Users,
      iconClass: "bg-forest-600/10 text-forest-600",
    },
    {
      label: "Parcelas Certificadas",
      value: String(parcelasMock.filter((p) => p.certificacion === "Orgánica").length),
      icon: BadgeCheck,
      iconClass: "bg-sun-100 text-sun-700",
    },
  ];

  const columns = [
    { key: "codigo", label: "Código", className: "font-medium text-forest-700" },
    {
      key: "nombre",
      label: "Parcela",
      render: (parcela: Parcela) => (
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-forest-600/10 text-forest-600">
            <MapPin className="h-4 w-4" />
          </div>
          <span className="font-medium text-[#111827]">{parcela.nombre}</span>
        </div>
      ),
    },
    { key: "productor", label: "Productor" },
    { key: "comunidad", label: "Comunidad" },
    { key: "areaTotal", label: "Área" },
    { key: "cultivoPrincipal", label: "Cultivo Principal" },
    { key: "estado", label: "Estado", render: (parcela: Parcela) => estadoBadge(parcela.estado) },
    {
      key: "acciones",
      label: "",
      className: "text-right",
      render: (parcela: Parcela) => (
        <div className="flex justify-end gap-1">
          <button
            type="button"
            aria-label={`Ver ${parcela.nombre}`}
            onClick={() => navigate(`/parcelas/${parcela.id}`)}
            className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-forest-600/10 hover:text-forest-700"
          >
            <Eye className="h-4 w-4" />
          </button>
          <button
            type="button"
            aria-label={`Editar ${parcela.nombre}`}
            onClick={() => navigate(`/parcelas/${parcela.id}/editar`)}
            className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-forest-600/10 hover:text-forest-700"
          >
            <Pencil className="h-4 w-4" />
          </button>
          <button
            type="button"
            aria-label={`Eliminar ${parcela.nombre}`}
            onClick={() => setDeleteId(parcela.id)}
            className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-600"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <Breadcrumb items={[{ label: "Parcelas" }]} />

      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <SectionHeader
          title="Parcelas"
          description="Gestión de parcelas productivas de los socios de la cooperativa"
        />
        <div className="flex items-center gap-2">
          <Button as="link" to="/parcelas/nueva" iconLeft={<Plus className="h-4 w-4" />}>
            Nueva Parcela
          </Button>
        </div>
      </div>

      <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {kpis.map((kpi) => (
          <Card key={kpi.label}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-gray-500">{kpi.label}</p>
                <p className="mt-1.5 text-2xl font-bold text-[#111827]">{kpi.value}</p>
              </div>
              <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${kpi.iconClass}`}>
                <kpi.icon className="h-5 w-5" />
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="mb-6 flex flex-wrap items-end gap-3">
        <div className="max-w-md min-w-[200px] flex-1">
          <SearchInput
            placeholder="Buscar por código, parcela, productor o comunidad..."
            value={search}
            onChange={(val) => {
              setSearch(val);
              setPage(1);
            }}
          />
        </div>

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
          label="Estado"
          placeholder="Todos"
          options={toOptions(estadosOpciones)}
          value={filtroEstado}
          onChange={(val) => {
            setFiltroEstado(val);
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

        {hasFilters && (
          <Button variant="ghost" onClick={clearFilters} iconLeft={<X className="h-4 w-4" />}>
            Limpiar filtros
          </Button>
        )}
      </div>

      <DataTable
        columns={columns}
        data={visibles}
        keyField="id"
        emptyTitle="No hay parcelas registradas"
        emptyDescription="Comienza registrando la primera parcela de la cooperativa."
        emptyActionLabel="Registrar Parcela"
        emptyActionTo="/parcelas/nueva"
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setPage}
      />

      <ConfirmDialog
        open={deleteId !== null}
        onClose={() => setDeleteId(null)}
        onConfirm={() => setDeleteId(null)}
        title="Eliminar Parcela"
        message="¿Estás seguro de eliminar esta parcela? Esta acción no se puede deshacer."
        confirmText="Eliminar"
        variant="danger"
      />
    </div>
  );
}
