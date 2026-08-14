import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Pencil, Eye, Trash2, Download, GraduationCap, Users, BookOpen } from "lucide-react";
import {
  Badge,
  Breadcrumb,
  Button,
  Card,
  ConfirmDialog,
  DataTable,
  LoadingSpinner,
  SearchInput,
  SectionHeader,
  Select,
} from "../../components/ui";
import { fetchCapacitaciones, deleteCapacitacion, type Capacitacion } from "../../services/capacitaciones";

const tipoBadge = (tipo: string) => {
  switch (tipo) {
    case "PRODUCTORES":
      return <Badge variant="green">Productores</Badge>;
    case "PERSONAL_SIC":
      return <Badge variant="forest">Personal SIC</Badge>;
    default:
      return <Badge>{tipo}</Badge>;
  }
};

export default function CapacitacionList() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [tipoFilter, setTipoFilter] = useState("");
  const [page, setPage] = useState(1);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [capacitaciones, setCapacitaciones] = useState<Capacitacion[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(timer);
  }, [search]);

  const loadData = async () => {
    setLoading(true);
    try {
      const result = await fetchCapacitaciones({
        search: debouncedSearch || undefined,
        tipo: tipoFilter || undefined,
        page,
        limit: 10,
      });
      setCapacitaciones(result.data);
      setTotalPages(result.totalPages);
      setTotal(result.total);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [debouncedSearch, tipoFilter, page]);

  const kpis = [
    {
      label: "Total Capacitaciones",
      value: String(total),
      hint: "registradas",
      icon: GraduationCap,
      iconClass: "bg-indigo-100 text-indigo-700",
    },
    {
      label: "Productores",
      value: String(capacitaciones.filter((c) => c.tipo === "PRODUCTORES").length),
      hint: "en la página actual",
      icon: Users,
      iconClass: "bg-green-100 text-green-700",
    },
    {
      label: "Personal SIC",
      value: String(capacitaciones.filter((c) => c.tipo === "PERSONAL_SIC").length),
      hint: "en la página actual",
      icon: BookOpen,
      iconClass: "bg-blue-100 text-blue-700",
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <LoadingSpinner />
      </div>
    );
  }

  const handleExportCsv = () => {
    const headers = ["Código", "Tema", "Tipo", "Capacitador", "Fecha", "Lugar", "Participantes"];
    const rows = capacitaciones.map((c) => [
      c.codigo,
      c.tema,
      c.tipo === "PRODUCTORES" ? "Productores" : "Personal SIC",
      c.capacitador,
      c.fecha,
      c.lugar,
      String(c._count?.participantes || 0),
    ]);
    const csv = [headers, ...rows]
      .map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(","))
      .join("\n");
    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "capacitaciones.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleResetFilters = () => {
    setSearch("");
    setTipoFilter("");
    setPage(1);
  };

  const hasActiveFilters = search || tipoFilter;

  const columns = [
    { key: "codigo", label: "Código", className: "font-medium text-indigo-700" },
    {
      key: "tema",
      label: "Tema",
      sortable: true,
      render: (cap: Capacitacion) => (
        <div>
          <p className="font-medium text-[#111827]">{cap.tema}</p>
          <p className="text-xs text-gray-500">{cap.lugar}</p>
        </div>
      ),
    },
    { key: "tipo", label: "Tipo", render: (cap: Capacitacion) => tipoBadge(cap.tipo) },
    { key: "capacitador", label: "Capacitador" },
    { key: "fecha", label: "Fecha" },
    {
      key: "participantes",
      label: "Participantes",
      render: (cap: Capacitacion) => (
        <span className="inline-flex items-center gap-1 text-sm text-gray-600">
          <Users className="h-3.5 w-3.5" />
          {cap._count?.participantes || 0}
        </span>
      ),
    },
    {
      key: "acciones",
      label: "",
      className: "text-right",
      render: (cap: Capacitacion) => (
        <div className="flex justify-end gap-1">
          <button
            type="button"
            aria-label={`Ver ${cap.tema}`}
            onClick={() => navigate(`/capacitaciones/${cap.id}`)}
            className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-indigo-600/10 hover:text-indigo-700"
          >
            <Eye className="h-4 w-4" />
          </button>
          <button
            type="button"
            aria-label={`Editar ${cap.tema}`}
            onClick={() => navigate(`/capacitaciones/${cap.id}/editar`)}
            className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-indigo-600/10 hover:text-indigo-700"
          >
            <Pencil className="h-4 w-4" />
          </button>
          <button
            type="button"
            aria-label={`Eliminar ${cap.tema}`}
            onClick={() => setDeleteId(cap.id)}
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
      <Breadcrumb items={[{ label: "Capacitaciones" }]} />

      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <SectionHeader
          title="Capacitaciones"
          description="Registro de capacitaciones del SIC a productores y personal"
        />
        <div className="flex items-center gap-2">
          <Button variant="secondary" onClick={handleExportCsv} iconLeft={<Download className="h-4 w-4" />}>
            Exportar CSV
          </Button>
          <Button as="link" to="/capacitaciones/nueva" iconLeft={<Plus className="h-4 w-4" />}>
            Nueva Capacitación
          </Button>
        </div>
      </div>

      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {kpis.map((kpi) => (
          <Card key={kpi.label} padding="md" hover={false} className="shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">{kpi.label}</p>
                <p className="mt-1.5 text-2xl font-bold text-[#111827]">{kpi.value}</p>
                <p className="mt-1 text-xs text-gray-400">{kpi.hint}</p>
              </div>
              <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg ${kpi.iconClass}`}>
                <kpi.icon className="h-5 w-5" />
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="mb-6 flex flex-wrap items-end gap-3">
        <div className="max-w-md min-w-[200px] flex-1">
          <SearchInput
            placeholder="Buscar por código, tema o capacitador..."
            value={search}
            onChange={(val) => { setSearch(val); setPage(1); }}
          />
        </div>
        <div className="w-44">
          <label className="mb-1 block text-xs font-medium text-gray-500">Tipo</label>
          <Select
            options={[
              { value: "", label: "Todos" },
              { value: "PRODUCTORES", label: "Productores" },
              { value: "PERSONAL_SIC", label: "Personal SIC" },
            ]}
            placeholder="Todos"
            value={tipoFilter}
            onChange={(val) => { setTipoFilter(val); setPage(1); }}
          />
        </div>
        {hasActiveFilters && (
          <button
            type="button"
            onClick={handleResetFilters}
            className="mb-0.5 text-xs font-medium text-indigo-600 transition-colors hover:text-indigo-800"
          >
            Limpiar filtros
          </button>
        )}
      </div>

      <DataTable
        columns={columns}
        data={capacitaciones}
        keyField="id"
        emptyTitle="No hay capacitaciones registradas"
        emptyDescription="Comienza registrando la primera capacitación del SIC."
        emptyActionLabel="Registrar Capacitación"
        emptyActionTo="/capacitaciones/nueva"
        currentPage={page}
        totalPages={totalPages}
        onPageChange={setPage}
      />

      <ConfirmDialog
        open={deleteId !== null}
        onClose={() => setDeleteId(null)}
        onConfirm={async () => {
          if (!deleteId) return;
          try {
            await deleteCapacitacion(deleteId);
            setCapacitaciones(prev => prev.filter(c => c.id !== deleteId));
            setDeleteId(null);
          } catch (err) {
            console.error(err);
          }
        }}
        title="Eliminar Capacitación"
        message="¿Estás seguro de eliminar esta capacitación? Esta acción no se puede deshacer."
        confirmText="Eliminar"
        variant="danger"
      />
    </div>
  );
}
