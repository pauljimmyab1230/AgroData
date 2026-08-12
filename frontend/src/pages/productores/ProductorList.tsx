import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Pencil, Eye, Trash2, Download, Users, MapPin, Ruler } from "lucide-react";
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
import { fetchProductores, deleteProductor, type Productor } from "../../services/productores";

const estadoBadge = (estado: string) => {
  switch (estado) {
    case "ACTIVO":
      return <Badge variant="green">Activo</Badge>;
    case "SUSPENDIDO":
      return <Badge variant="yellow">Suspendido</Badge>;
    case "INACTIVO":
      return <Badge variant="gray">Inactivo</Badge>;
    default:
      return <Badge>{estado}</Badge>;
  }
};

const pageSize = 5;

export default function ProductorList() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [estadoFilter, setEstadoFilter] = useState("");
  const [page, setPage] = useState(1);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [productores, setProductores] = useState<Productor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProductores()
      .then(res => setProductores(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const kpis = [
    {
      label: "Productores",
      value: String(productores.length),
      hint: "socios registrados",
      icon: Users,
      iconClass: "bg-forest-100 text-forest-700",
    },
    {
      label: "Parcelas",
      value: String(productores.reduce((sum, p) => sum + (p._count?.parcelas ?? 0), 0)),
      hint: "parcelas asociadas",
      icon: MapPin,
      iconClass: "bg-sun-100 text-sun-700",
    },
    {
      label: "Área Total",
      value: "—",
      hint: "hectáreas en producción",
      icon: Ruler,
      iconClass: "bg-forest-100 text-forest-700",
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <LoadingSpinner />
      </div>
    );
  }

  const filtrados = productores.filter((productor) => {
    const texto = `${productor.codigo} ${productor.nombres} ${productor.apellidoPaterno} ${productor.apellidoMaterno} ${productor.dni} ${productor.comunidad}`.toLowerCase();
    const matchTexto = texto.includes(search.toLowerCase());
    const matchEstado = !estadoFilter || productor.estado === estadoFilter;
    return matchTexto && matchEstado;
  });

  const totalPages = Math.max(1, Math.ceil(filtrados.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const visibles = filtrados.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleExportCsv = () => {
    const headers = ["Código", "DNI", "Nombres", "Comunidad", "Estado", "Fecha Ingreso"];
    const rows = filtrados.map((p) => [
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
  };

  const columns = [
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
    { key: "estado", label: "Estado", render: (productor: Productor) => estadoBadge(productor.estado) },
    {
      key: "acciones",
      label: "",
      className: "text-right",
      render: (productor: Productor) => (
        <div className="flex justify-end gap-1">
          <button
            type="button"
            aria-label={`Ver ${productor.nombres}`}
            onClick={() => navigate(`/productores/${productor.id}`)}
            className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-forest-600/10 hover:text-forest-700"
          >
            <Eye className="h-4 w-4" />
          </button>
          <button
            type="button"
            aria-label={`Editar ${productor.nombres}`}
            onClick={() => navigate(`/productores/${productor.id}/editar`)}
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
  ];

  return (
    <div>
      <Breadcrumb items={[{ label: "Productores" }]} />

      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <SectionHeader
          title="Productores"
          description="Gestión de socios productores de la cooperativa"
        />
        <div className="flex items-center gap-2">
          <Button variant="secondary" onClick={handleExportCsv} iconLeft={<Download className="h-4 w-4" />}>
            Exportar CSV
          </Button>
          <Button as="link" to="/productores/nuevo" iconLeft={<Plus className="h-4 w-4" />}>
            Nuevo Productor
          </Button>
        </div>
      </div>

      <div className="mb-6 grid gap-4 sm:grid-cols-3">
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
            onChange={(val) => {
              setSearch(val);
              setPage(1);
            }}
          />
        </div>
        <div className="w-44">
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
            onChange={(val) => {
              setEstadoFilter(val);
              setPage(1);
            }}
          />
        </div>
      </div>

      <DataTable
        columns={columns}
        data={visibles}
        keyField="id"
        emptyTitle="No hay productores registrados"
        emptyDescription="Comienza registrando el primer productor de la cooperativa."
        emptyActionLabel="Registrar Productor"
        emptyActionTo="/productores/nuevo"
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setPage}
      />

      <ConfirmDialog
        open={deleteId !== null}
        onClose={() => setDeleteId(null)}
        onConfirm={async () => {
          if (!deleteId) return;
          try {
            await deleteProductor(deleteId);
            setProductores(prev => prev.filter(p => p.id !== deleteId));
            setDeleteId(null);
          } catch (err) {
            console.error(err);
          }
        }}
        title="Eliminar Productor"
        message="¿Estás seguro de eliminar este productor? Esta acción no se puede deshacer."
        confirmText="Eliminar"
        variant="danger"
      />
    </div>
  );
}
