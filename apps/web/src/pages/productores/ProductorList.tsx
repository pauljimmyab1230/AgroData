import { useState, useMemo } from "react";
import { Plus, Pencil, Eye, Trash2, Download, Users, UserCheck, User } from "lucide-react";
import {
  Badge,
  Button,
  Card,
  ConfirmDialog,
  DataTable,
  LoadingSpinner,
  SearchInput,
  SectionHeader,
  Select,
} from "../../components/ui";
import { useProductores, useComunidades, useDeleteProductor, useProductorStats } from "../../hooks/queries";
import { fetchAllProductoresForCsv, type Productor } from "../../services/productores";
import ProductorModal from "../../components/productores/ProductorModal";
import ProductorViewModal from "../../components/productores/ProductorViewModal";
import { toast } from "../../utils/toast";
import { getEstadoProductorBadgeVariant, getEstadoProductorLabel } from "../../utils/formatters";

export default function ProductorList() {
  const [search, setSearch] = useState("");
  const [estadoFilter, setEstadoFilter] = useState("");
  const [cargoFilter, setCargoFilter] = useState("");
  const [sexoFilter, setSexoFilter] = useState("");
  const [comunidadFilter, setComunidadFilter] = useState("");
  const [page, setPage] = useState(1);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [viewId, setViewId] = useState<number | null>(null);

  const filters = useMemo(() => ({
    search: search || undefined,
    estado: estadoFilter || undefined,
    cargo: cargoFilter || undefined,
    sexo: sexoFilter || undefined,
    comunidad: comunidadFilter || undefined,
    page,
    limit: 10,
  }), [search, estadoFilter, cargoFilter, sexoFilter, comunidadFilter, page]);

  const { data, isLoading, isFetching } = useProductores(filters);
  const { data: comunidades = [] } = useComunidades();
  const { data: stats } = useProductorStats();
  const deleteMutation = useDeleteProductor();

  const productores = data?.data ?? [];
  const totalPages = data?.totalPages ?? 1;

  const kpis = useMemo(() => [
    {
      label: "Total Socios",
      value: String(stats?.total ?? 0),
      hint: "productores registrados",
      icon: Users,
      iconClass: "bg-forest-100 text-forest-700",
    },
    {
      label: "Activos",
      value: String(stats?.activos ?? 0),
      hint: `${stats?.suspendidos ?? 0} suspendidos`,
      icon: UserCheck,
      iconClass: "bg-green-100 text-green-700",
    },
    {
      label: "Mujeres",
      value: String(stats?.mujeres ?? 0),
      hint: "socias registradas",
      icon: User,
      iconClass: "bg-pink-100 text-pink-700",
    },
    {
      label: "Varones",
      value: String(stats?.varones ?? 0),
      hint: "socios registrados",
      icon: User,
      iconClass: "bg-blue-100 text-blue-700",
    },
  ], [stats]);

  const columns = useMemo(() => [
    { key: "codigo", label: "Código", className: "font-medium text-forest-700" },
    {
      key: "nombreCompleto",
      label: "Productor",
      sortable: true,
      render: (productor: Productor) => (
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-forest-600/10 text-sm font-semibold text-forest-700">
            {productor.nombres.charAt(0)}
            {productor.apellidoPaterno.charAt(0)}
          </div>
          <div>
            <p className="font-medium text-[#111827]">
              {productor.nombres} {productor.apellidoPaterno} {productor.apellidoMaterno}
            </p>
            <p className="text-xs text-gray-500">{productor.correo}</p>
          </div>
        </div>
      ),
    },
    { key: "dni", label: "DNI" },
    { key: "comunidad", label: "Comunidad" },
    { key: "fechaIngreso", label: "Ingreso" },
    { key: "estado", label: "Estado", render: (productor: Productor) => <Badge variant={getEstadoProductorBadgeVariant(productor.estado)}>{getEstadoProductorLabel(productor.estado)}</Badge> },
    {
      key: "acciones",
      label: "",
      className: "text-right",
      render: (productor: Productor) => (
        <div className="flex justify-end gap-1">
          <button
            type="button"
            aria-label={`Ver ${productor.nombres}`}
            onClick={() => setViewId(productor.id)}
            className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-forest-600/10 hover:text-forest-700"
          >
            <Eye className="h-4 w-4" />
          </button>
          <button
            type="button"
            aria-label={`Editar ${productor.nombres}`}
            onClick={() => setEditId(productor.id)}
            className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-forest-600/10 hover:text-forest-700"
          >
            <Pencil className="h-4 w-4" />
          </button>
          <button
            type="button"
            aria-label={`Eliminar ${productor.nombres}`}
            onClick={() => setDeleteId(productor.id)}
            className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-600"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ),
    },
  ], []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <LoadingSpinner />
      </div>
    );
  }

  const handleExportCsv = async () => {
    try {
      const allProductores = await fetchAllProductoresForCsv({
        search: search || undefined,
        estado: estadoFilter || undefined,
        cargo: cargoFilter || undefined,
        sexo: sexoFilter || undefined,
        comunidad: comunidadFilter || undefined,
      });
      const headers = ["Código", "DNI", "Nombres", "Comunidad", "Estado", "Fecha Ingreso"];
      const rows = allProductores.map((p) => [
        p.codigo,
        p.dni,
        `${p.nombres} ${p.apellidoPaterno} ${p.apellidoMaterno}`,
        p.comunidad,
        p.estado,
        p.fechaIngreso,
      ]);
      const csv = [headers, ...rows]
        .map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(","))
        .join("\n");
      const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "productores.csv";
      a.click();
      URL.revokeObjectURL(url);
      toast.success(`CSV exportado: ${allProductores.length} registros`);
    } catch (error) {
      console.error("Error al exportar CSV:", error);
      toast.error("Error al exportar el CSV");
    }
  };

  const handleResetFilters = () => {
    setSearch("");
    setEstadoFilter("");
    setCargoFilter("");
    setSexoFilter("");
    setComunidadFilter("");
    setPage(1);
  };

  const hasActiveFilters = search || estadoFilter || cargoFilter || sexoFilter || comunidadFilter;

  return (
    <div>
      {isFetching && (
        <div className="fixed inset-x-0 top-0 z-50 h-0.5">
          <div className="h-full w-full animate-pulse bg-forest-500/40" />
        </div>
      )}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <SectionHeader
          title="Productores"
          description="Gestión de productores"
        />
        <div className="flex items-center gap-2">
          <Button variant="secondary" onClick={handleExportCsv} iconLeft={<Download className="h-4 w-4" />}>
            Exportar CSV
          </Button>
          <Button onClick={() => setShowCreateModal(true)} iconLeft={<Plus className="h-4 w-4" />}>
            Nuevo Productor
          </Button>
        </div>
      </div>

      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
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
            placeholder="Buscar por código, DNI o nombres..."
            value={search}
            onChange={(val) => { setSearch(val); setPage(1); }}
          />
        </div>
        <div className="w-40">
          <label className="mb-1 block text-xs font-medium text-gray-500">Estado</label>
          <Select
            options={[
              { value: "", label: "Todos" },
              { value: "ACTIVO", label: "Activos" },
              { value: "INACTIVO", label: "Inactivos" },
              { value: "SUSPENDIDO", label: "Suspendidos" },
            ]}
            placeholder="Todos"
            value={estadoFilter}
            onChange={(val) => { setEstadoFilter(val); setPage(1); }}
          />
        </div>
        <div className="w-40">
          <label className="mb-1 block text-xs font-medium text-gray-500">Cargo</label>
          <Select
            options={[
              { value: "", label: "Todos" },
              { value: "PRESIDENTE", label: "Presidente" },
              { value: "VICEPRESIDENTE", label: "Vicepresidente" },
              { value: "SECRETARIO", label: "Secretario" },
              { value: "TESORERO", label: "Tesorero" },
              { value: "VOCAL", label: "Vocal" },
              { value: "SOCIO", label: "Socio" },
              { value: "DIRECTIVO", label: "Directivo" },
              { value: "OTRO", label: "Otro" },
            ]}
            placeholder="Todos"
            value={cargoFilter}
            onChange={(val) => { setCargoFilter(val); setPage(1); }}
          />
        </div>
        <div className="w-36">
          <label className="mb-1 block text-xs font-medium text-gray-500">Sexo</label>
          <Select
            options={[
              { value: "", label: "Todos" },
              { value: "MASCULINO", label: "Masculino" },
              { value: "FEMENINO", label: "Femenino" },
            ]}
            placeholder="Todos"
            value={sexoFilter}
            onChange={(val) => { setSexoFilter(val); setPage(1); }}
          />
        </div>
        <div className="w-48">
          <label className="mb-1 block text-xs font-medium text-gray-500">Comunidad</label>
          <Select
            options={[
              { value: "", label: "Todas" },
              ...comunidades.map((c) => ({ value: c, label: c })),
            ]}
            placeholder="Todas"
            value={comunidadFilter}
            onChange={(val) => { setComunidadFilter(val); setPage(1); }}
          />
        </div>
        {hasActiveFilters && (
          <button
            type="button"
            onClick={handleResetFilters}
            className="mb-0.5 text-xs font-medium text-forest-600 transition-colors hover:text-forest-800"
          >
            Limpiar filtros
          </button>
        )}
      </div>

      <DataTable
        columns={columns}
        data={productores}
        keyField="id"
        emptyTitle="No hay productores registrados"
        emptyDescription="Comienza registrando el primer productor de la cooperativa."
        emptyActionLabel="Registrar Productor"
        emptyActionOnClick={() => setShowCreateModal(true)}
        currentPage={page}
        totalPages={totalPages}
        onPageChange={setPage}
      />

      <ConfirmDialog
        open={deleteId !== null}
        onClose={() => setDeleteId(null)}
        onConfirm={async () => {
          if (deleteId === null) return;
          try {
            await deleteMutation.mutateAsync(deleteId);
            setDeleteId(null);
            toast.success("Productor eliminado correctamente");
          } catch {
            toast.error("Error al eliminar el productor");
          }
        }}
        title="Eliminar Productor"
        message="¿Estás seguro de eliminar este productor? Esta acción no se puede deshacer."
        confirmText="Eliminar"
        variant="danger"
      />

      <ProductorModal
        open={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSave={() => setShowCreateModal(false)}
        mode="create"
      />

      <ProductorModal
        open={editId !== null}
        onClose={() => setEditId(null)}
        onSave={() => setEditId(null)}
        mode="edit"
        productorId={editId || undefined}
      />

      <ProductorViewModal
        open={viewId !== null}
        onClose={() => setViewId(null)}
        productorId={viewId || undefined}
      />
    </div>
  );
}
