import { useState, useMemo } from "react";
import { Plus, Pencil, Eye, Trash2, MapPin, Ruler, Users, BadgeCheck, X, Download } from "lucide-react";
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
import { useParcelas, useDeleteParcela } from "../../hooks/queries";
import { fetchParcelas, type Parcela } from "../../services/parcelas";
import {
  comunidadesOpciones,
  cultivosOpciones,
  estadosOpciones,
  toOptions,
} from "../../constants/parcelaOpciones";
import ParcelaModal from "../../components/parcelas/ParcelaModal";
import { toast } from "../../utils/toast";

const estadoBadge = (estado: string) =>
  estado === "ACTIVA" ? <Badge variant="forest">Activa</Badge> : <Badge variant="gray">Inactiva</Badge>;

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
  const [search, setSearch] = useState("");
  const [filtroComunidad, setFiltroComunidad] = useState("");
  const [filtroCultivo, setFiltroCultivo] = useState("");
  const [filtroEstado, setFiltroEstado] = useState("");
  const [page, setPage] = useState(1);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [viewId, setViewId] = useState<string | null>(null);

  const filters = useMemo(() => ({
    search: search || undefined,
    comunidad: filtroComunidad || undefined,
    cultivo: filtroCultivo || undefined,
    estado: filtroEstado || undefined,
    page,
    limit: 10,
  }), [search, filtroComunidad, filtroCultivo, filtroEstado, page]);

  const { data, isLoading, isFetching } = useParcelas(filters);
  const deleteMutation = useDeleteParcela();

  const parcelas = data?.data ?? [];
  const totalPages = data?.totalPages ?? 1;
  const total = data?.total ?? 0;

  const kpis = useMemo(() => [
    { label: "Total Parcelas", value: String(total), icon: MapPin, iconClass: "bg-forest-600/10 text-forest-600" },
    {
      label: "Área Total",
      value: `${parcelas.reduce((acc, p) => acc + (Number.isNaN(Number(p.area)) ? 0 : Number(p.area)), 0).toFixed(2)} ha`,
      icon: Ruler,
      iconClass: "bg-sun-100 text-sun-700",
    },
    {
      label: "Productores con Parcelas",
      value: String(new Set(parcelas.map((p) => p.productorId)).size),
      icon: Users,
      iconClass: "bg-forest-600/10 text-forest-600",
    },
    {
      label: "Parcelas Certificadas",
      value: String(parcelas.filter((p) => p.certificacion === "ORGANICA").length),
      icon: BadgeCheck,
      iconClass: "bg-sun-100 text-sun-700",
    },
  ], [total, parcelas]);

  const hasFilters =
    Boolean(search) ||
    Boolean(filtroComunidad) ||
    Boolean(filtroCultivo) ||
    Boolean(filtroEstado);

  const clearFilters = () => {
    setSearch("");
    setFiltroComunidad("");
    setFiltroCultivo("");
    setFiltroEstado("");
    setPage(1);
  };

  const handleModalClose = () => {
    setShowCreateModal(false);
    setEditId(null);
    setViewId(null);
  };

  const handleExportCsv = async () => {
    try {
      const allResult = await fetchParcelas({
        search: search || undefined,
        comunidad: filtroComunidad || undefined,
        cultivo: filtroCultivo || undefined,
        estado: filtroEstado || undefined,
        limit: 1000,
      });
      const headers = ["Código", "Nombre", "Productor", "Comunidad", "Cultivo", "Área", "Estado", "Certificación"];
      const rows = allResult.data.map((p) => [
        p.codigo,
        p.nombre,
        p.productorNombre,
        p.comunidad,
        p.cultivo,
        `${p.area} ${p.areaUnidad}`,
        p.estado,
        p.certificacion,
      ]);
      const csv = [headers, ...rows]
        .map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(","))
        .join("\n");
      const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "parcelas.csv";
      a.click();
      URL.revokeObjectURL(url);
      toast.success(`CSV exportado: ${allResult.data.length} registros`);
    } catch {
      toast.error("Error al exportar el CSV");
    }
  };

  const columns = useMemo(() => [
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
    { key: "productorNombre", label: "Productor" },
    { key: "comunidad", label: "Comunidad" },
    {
      key: "area",
      label: "Área",
      render: (parcela: Parcela) => `${parcela.area || "0"} ${parcela.areaUnidad || "ha"}`,
    },
    { key: "cultivo", label: "Cultivo Principal" },
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
            onClick={() => setViewId(parcela.id)}
            className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-forest-600/10 hover:text-forest-700"
          >
            <Eye className="h-4 w-4" />
          </button>
          <button
            type="button"
            aria-label={`Editar ${parcela.nombre}`}
            onClick={() => setEditId(parcela.id)}
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
  ], []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div>
      {isFetching && (
        <div className="fixed inset-x-0 top-0 z-50 h-0.5">
          <div className="h-full w-full animate-pulse bg-forest-500/40" />
        </div>
      )}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <SectionHeader
          title="Parcelas"
          description="Gestión de parcelas productivas"
        />
        <div className="flex items-center gap-2">
          <Button variant="secondary" onClick={handleExportCsv} iconLeft={<Download className="h-4 w-4" />}>
            Exportar CSV
          </Button>
          <Button onClick={() => setShowCreateModal(true)} iconLeft={<Plus className="h-4 w-4" />}>
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
          options={estadosOpciones}
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

      <DataTable
        columns={columns}
        data={parcelas}
        keyField="id"
        emptyTitle="No hay parcelas registradas"
        emptyDescription="Comienza registrando la primera parcela de la cooperativa."
        emptyActionLabel="Registrar Parcela"
        emptyActionOnClick={() => setShowCreateModal(true)}
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
            await deleteMutation.mutateAsync(deleteId);
            setDeleteId(null);
            toast.success("Parcela eliminada correctamente");
          } catch {
            toast.error("Error al eliminar la parcela");
          }
        }}
        title="Eliminar Parcela"
        message="¿Estás seguro de eliminar esta parcela? Esta acción no se puede deshacer."
        confirmText="Eliminar"
        variant="danger"
      />

      <ParcelaModal
        open={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSave={handleModalClose}
        mode="create"
      />

      <ParcelaModal
        open={editId !== null}
        onClose={() => setEditId(null)}
        onSave={handleModalClose}
        mode="edit"
        parcelaId={editId || undefined}
      />

      <ParcelaModal
        open={viewId !== null}
        onClose={() => setViewId(null)}
        mode="view"
        parcelaId={viewId || undefined}
      />
    </div>
  );
}
