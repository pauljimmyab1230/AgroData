import { useState, useEffect, useCallback } from "react";
import { Factory, Hash, Scale, TrendingDown, X } from "lucide-react";
import { Breadcrumb, Button, ConfirmDialog, SearchInput, SectionHeader, Select } from "../../components/ui";
import ProcesamientoKPI from "../../components/procesamiento/ProcesamientoKPI";
import ProcesamientoTable from "../../components/procesamiento/ProcesamientoTable";
import {
  type OrdenProcesamiento,
  type ProcesamientosQuery,
  fetchProcesamientos,
  procesamientoEstados,
  formatearPeso,
} from "../../services/procesamientos";

const pageSize = 5;

const toOptions = (items: readonly string[]) => items.map((item) => ({ value: item, label: item }));

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

export default function ProcesamientoList() {
  const [search, setSearch] = useState("");
  const [filtroCampania, setFiltroCampania] = useState("");
  const [filtroProducto, setFiltroProducto] = useState("");
  const [filtroEstado, setFiltroEstado] = useState("");
  const [filtroResponsable, setFiltroResponsable] = useState("");
  const [page, setPage] = useState(1);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const [data, setData] = useState<OrdenProcesamiento[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const params: ProcesamientosQuery = {
        page,
        limit: pageSize,
      };
      if (search) params.search = search;
      if (filtroEstado) params.estado = filtroEstado;

      const result = await fetchProcesamientos(params);
      setData(result.data);
      setTotal(result.total);
      setTotalPages(result.totalPages);
    } catch (err) {
      console.error("Error loading procesamientos:", err);
    } finally {
      setLoading(false);
    }
  }, [page, search, filtroEstado]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const completadas = data.filter((o) => o.estado === "COMPLETADA");
  const totalProcesados = completadas.reduce((acc, o) => acc + o.lotes.length, 0);
  const kgProcesados = completadas.reduce((acc, o) => acc + o.pesoSalida, 0);
  const rendimientoPromedio =
    completadas.length > 0
      ? completadas.reduce((acc, o) => acc + o.rendimiento, 0) / completadas.length
      : 0;

  const kpis = [
    {
      label: "Órdenes de Procesamiento",
      value: String(total),
      icon: Factory,
      iconClass: "bg-forest-600/10 text-forest-600",
    },
    {
      label: "Kilogramos Procesados",
      value: formatearPeso(kgProcesados),
      icon: Scale,
      iconClass: "bg-sun-100 text-sun-700",
    },
    {
      label: "Productos Base Generados",
      value: String(totalProcesados),
      icon: Hash,
      iconClass: "bg-purple-50 text-purple-600",
    },
    {
      label: "Rendimiento Promedio",
      value: `${rendimientoPromedio.toFixed(1)}%`,
      icon: TrendingDown,
      iconClass: "bg-emerald-50 text-emerald-600",
    },
  ];

  const hasFilters =
    Boolean(search) ||
    Boolean(filtroCampania) ||
    Boolean(filtroProducto) ||
    Boolean(filtroEstado) ||
    Boolean(filtroResponsable);

  const clearFilters = () => {
    setSearch("");
    setFiltroCampania("");
    setFiltroProducto("");
    setFiltroEstado("");
    setFiltroResponsable("");
    setPage(1);
  };

  return (
    <div>
      <Breadcrumb items={[{ label: "Procesamiento" }]} />

      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <SectionHeader
          title="Procesamiento Primario"
          description="Registro y seguimiento de Órdenes de Procesamiento de materia prima."
        />
        <div className="flex items-center gap-2">
          <Button as="link" to="/procesamiento/nuevo" iconLeft={<Factory className="h-4 w-4" />}>
            Nueva Orden de Procesamiento
          </Button>
        </div>
      </div>

      <ProcesamientoKPI items={kpis} />

      <div className="mb-6 flex flex-wrap items-end gap-3">
        <div className="max-w-md min-w-[200px] flex-1">
          <SearchInput
            placeholder="Buscar por código, producto, responsable, LP..."
            value={search}
            onChange={(val) => {
              setSearch(val);
              setPage(1);
            }}
          />
        </div>

        <FilterSelect
          label="Estado"
          placeholder="Todos"
          options={toOptions(procesamientoEstados)}
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

      <ProcesamientoTable
        data={data}
        currentPage={page}
        totalPages={totalPages}
        onPageChange={setPage}
        onDelete={(op) => setDeleteId(op.id ?? null)}
      />

      <ConfirmDialog
        open={deleteId !== null}
        onClose={() => setDeleteId(null)}
        onConfirm={() => setDeleteId(null)}
        title="Eliminar Orden de Procesamiento"
        message="¿Estás seguro de eliminar esta orden de procesamiento? Esta acción no se puede deshacer."
        confirmText="Eliminar"
        variant="danger"
      />
    </div>
  );
}
