import { useEffect, useState } from "react";
import { Boxes, Plus, Scale, Users, Warehouse, X } from "lucide-react";
import { Breadcrumb, Button, ConfirmDialog, SearchInput, SectionHeader, Select } from "../../components/ui";
import AcopioKPI from "../../components/acopio/AcopioKPI";
import AcopioTable from "../../components/acopio/AcopioTable";
import {
  fetchAcopios,
  fetchAcopioStats,
  deleteAcopio,
  type AcopioView,
  type AcopiosQuery,
} from "../../services/acopios";
import {
  acopiadoresOpciones,
  campaniasOpciones,
  comunidadesOpciones,
  estadosAcopioOpciones,
  productoresOpciones,
} from "./acopioMock";

const pageSize = 10;

const toOptions = (items: string[]) => items.map((item) => ({ value: item, label: item }));

const displayToApiEstado: Record<string, string> = {
  "En Proceso": "EN_PROCESO",
  Completado: "COMPLETADO",
  "En Planta": "EN_PLANTA",
};

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
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const [acopios, setAcopios] = useState<AcopioView[]>([]);
  const [totalPages, setTotalPages] = useState(1);

  const [stats, setStats] = useState({
    total_acopios: 0,
    productores_atendidos: 0,
    sacos_recibidos: 0,
    kilogramos_acopiados: 0,
  });

  useEffect(() => {
    const params: AcopiosQuery = { page, limit: pageSize };
    if (search) params.search = search;
    if (filtroCampania) params.campania_id = filtroCampania;
    if (filtroComunidad) params.comunidad = filtroComunidad;
    if (filtroProductor) params.productor_id = filtroProductor;
    if (filtroAcopiador) params.acopiador = filtroAcopiador;
    if (filtroEstado) params.estado = displayToApiEstado[filtroEstado] ?? filtroEstado;

    fetchAcopios(params)
      .then((res) => {
        setAcopios(res.data);
        setTotalPages(res.totalPages);
      })
      .catch(() => {
        setAcopios([]);
      });
  }, [search, filtroCampania, filtroComunidad, filtroProductor, filtroAcopiador, filtroEstado, page]);

  useEffect(() => {
    fetchAcopioStats()
      .then(setStats)
      .catch(() => {});
  }, []);

  const kpis = [
    {
      label: "Total Acopios",
      value: String(stats.total_acopios),
      icon: Warehouse,
      iconClass: "bg-forest-600/10 text-forest-600",
    },
    {
      label: "Productores Atendidos",
      value: String(stats.productores_atendidos),
      icon: Users,
      iconClass: "bg-sun-100 text-sun-700",
    },
    {
      label: "Sacos Recibidos",
      value: String(stats.sacos_recibidos),
      icon: Boxes,
      iconClass: "bg-forest-600/10 text-forest-600",
    },
    {
      label: "Kilogramos Acopiados",
      value: `${Intl.NumberFormat("es-PE", { maximumFractionDigits: 1 }).format(stats.kilogramos_acopiados)} kg`,
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

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteAcopio(deleteId);
      setDeleteId(null);
      setPage(1);
    } catch {
      // ignore
    }
  };

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
        data={acopios}
        currentPage={page}
        totalPages={totalPages}
        onPageChange={setPage}
        onDelete={(acopio) => setDeleteId(String(acopio.id))}
      />

      <ConfirmDialog
        open={deleteId !== null}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Eliminar Acopio"
        message="¿Estás seguro de eliminar este acopio? Esta acción no se puede deshacer."
        confirmText="Eliminar"
        variant="danger"
      />
    </div>
  );
}
