import { useState, useEffect, useCallback } from "react";
import { BadgeCheck, CalendarClock, ClipboardCheck, Plus, TriangleAlert, X } from "lucide-react";
import { Breadcrumb, Button, ConfirmDialog, SearchInput, SectionHeader, Select } from "../../components/ui";
import InspeccionKPI from "../../components/inspecciones/InspeccionKPI";
import InspeccionTable from "../../components/inspecciones/InspeccionTable";
import {
  campaniasOpciones,
  estadosOpciones,
  fetchInspecciones,
  deleteInspeccion,
  type Inspeccion,
} from "../../services/inspecciones";

const toOptions = (items: string[]) => items.map((item) => ({ value: item, label: item }));

const estadoLabels: Record<string, string> = {
  PENDIENTE: "Pendiente",
  APROBADA: "Aprobada",
  NO_CONFORME: "No Conforme",
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

export default function InspeccionList() {
  const [search, setSearch] = useState("");
  const [filtroCampania, setFiltroCampania] = useState("");
  const [filtroEstado, setFiltroEstado] = useState("");
  const [page, setPage] = useState(1);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const [inspecciones, setInspecciones] = useState<Inspeccion[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const result = await fetchInspecciones({
        search: search || undefined,
        estado: filtroEstado || undefined,
        campania_id: filtroCampania || undefined,
        page,
        limit: 10,
      });
      setInspecciones(result.data);
      setTotal(result.total);
      setTotalPages(result.totalPages);
    } catch (error) {
      console.error("Error loading inspecciones:", error);
    } finally {
      setLoading(false);
    }
  }, [search, filtroEstado, filtroCampania, page]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const kpis = [
    {
      label: "Total Inspecciones",
      value: String(total),
      icon: ClipboardCheck,
      iconClass: "bg-forest-600/10 text-forest-600",
    },
    {
      label: "Inspecciones Pendientes",
      value: String(inspecciones.filter((i) => i.estado === "PENDIENTE").length),
      icon: CalendarClock,
      iconClass: "bg-sun-100 text-sun-700",
    },
    {
      label: "Inspecciones Aprobadas",
      value: String(inspecciones.filter((i) => i.estado === "APROBADA").length),
      icon: BadgeCheck,
      iconClass: "bg-forest-600/10 text-forest-600",
    },
    {
      label: "No Conformidades",
      value: String(
        inspecciones.reduce((acc, i) => acc + (i.resultado === "NO_CONFORME" ? 1 : 0), 0),
      ),
      icon: TriangleAlert,
      iconClass: "bg-red-50 text-red-600",
    },
  ];

  const hasFilters =
    Boolean(search) ||
    Boolean(filtroCampania) ||
    Boolean(filtroEstado);

  const clearFilters = () => {
    setSearch("");
    setFiltroCampania("");
    setFiltroEstado("");
    setPage(1);
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteInspeccion(deleteId);
      setDeleteId(null);
      loadData();
    } catch (error) {
      console.error("Error deleting inspeccion:", error);
    }
  };

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
            placeholder="Buscar por código, inspector..."
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
          label="Estado"
          placeholder="Todos"
          options={estadosOpciones.map((e) => ({ value: e, label: estadoLabels[e] ?? e }))}
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

      {loading ? (
        <div className="py-12 text-center text-gray-500">Cargando inspecciones...</div>
      ) : (
        <InspeccionTable
          data={inspecciones}
          currentPage={page}
          totalPages={totalPages}
          onPageChange={setPage}
          onDelete={(inspeccion) => setDeleteId(inspeccion.id)}
        />
      )}

      <ConfirmDialog
        open={deleteId !== null}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Eliminar Inspección"
        message="¿Estás seguro de eliminar esta inspección? Esta acción no se puede deshacer."
        confirmText="Eliminar"
        variant="danger"
      />
    </div>
  );
}
