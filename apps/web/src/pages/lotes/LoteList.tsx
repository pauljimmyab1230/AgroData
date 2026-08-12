import { useEffect, useState } from "react";
import { Eye, Pencil, Plus, Trash2, X } from "lucide-react";
import { Link } from "react-router-dom";
import {
  Breadcrumb,
  Button,
  Card,
  ConfirmDialog,
  DataTable,
  Pagination,
  SearchInput,
  SectionHeader,
  Select,
  Badge,
  LoadingSpinner,
} from "../../components/ui";
import {
  fetchLotes,
  deleteLote,
  type Lote,
  type LotesQuery,
} from "../../services/lotes";

const pageSize = 10;

const toOptions = (items: string[]) => items.map((item) => ({ value: item, label: item }));

const loteEstados = ["REGISTRADO", "EN_PROCESIMIENTO", "DISPONIBLE", "CONSUMIDO", "VENCIDO"];

const estadoBadgeVariant: Record<string, "green" | "yellow" | "forest" | "red" | "gray"> = {
  REGISTRADO: "gray",
  EN_PROCESIMIENTO: "yellow",
  DISPONIBLE: "green",
  CONSUMIDO: "forest",
  VENCIDO: "red",
};

export default function LoteList() {
  const [search, setSearch] = useState("");
  const [filtroEstado, setFiltroEstado] = useState("");
  const [page, setPage] = useState(1);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const [lotes, setLotes] = useState<Lote[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  const [stats, setStats] = useState({
    total: 0,
    disponibles: 0,
    enProceso: 0,
    consumidos: 0,
  });

  const loadLotes = () => {
    setLoading(true);
    const params: LotesQuery = { page, limit: pageSize };
    if (search) params.search = search;
    if (filtroEstado) params.estado = filtroEstado;

    fetchLotes(params)
      .then((res) => {
        setLotes(res.data);
        setTotalPages(res.totalPages);

        const allParams: LotesQuery = { page: 1, limit: 9999 };
        if (search) allParams.search = search;
        if (filtroEstado) allParams.estado = filtroEstado;
        return fetchLotes(allParams);
      })
      .then((allRes) => {
        const all = allRes.data;
        setStats({
          total: allRes.total,
          disponibles: all.filter((l) => l.estado === "DISPONIBLE").length,
          enProceso: all.filter((l) => l.estado === "EN_PROCESIMIENTO").length,
          consumidos: all.filter((l) => l.estado === "CONSUMIDO").length,
        });
      })
      .catch(() => {
        setLotes([]);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadLotes();
  }, [search, filtroEstado, page]);

  const kpis = [
    {
      label: "Total Lotes",
      value: String(stats.total),
      iconClass: "bg-forest-600/10 text-forest-600",
    },
    {
      label: "Disponibles",
      value: String(stats.disponibles),
      iconClass: "bg-emerald-100 text-emerald-700",
    },
    {
      label: "En Proceso",
      value: String(stats.enProceso),
      iconClass: "bg-amber-100 text-amber-700",
    },
    {
      label: "Consumidos",
      value: String(stats.consumidos),
      iconClass: "bg-purple-100 text-purple-600",
    },
  ];

  const hasFilters = Boolean(search) || Boolean(filtroEstado);

  const clearFilters = () => {
    setSearch("");
    setFiltroEstado("");
    setPage(1);
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteLote(deleteId);
      setDeleteId(null);
      setPage(1);
      loadLotes();
    } catch {
      // ignore
    }
  };

  const columns = [
    {
      key: "codigo",
      label: "Código",
      sortable: true,
      render: (lote: Lote) => (
        <Link to={`/lotes/${lote.id}`} className="font-medium text-forest-700 hover:underline">
          {lote.codigo}
        </Link>
      ),
    },
    {
      key: "nombre",
      label: "Nombre",
      sortable: true,
      render: (lote: Lote) => <span className="text-gray-700">{lote.nombre}</span>,
    },
    {
      key: "cultivoNombre",
      label: "Cultivo",
      sortable: true,
      render: (lote: Lote) => <span className="text-gray-600">{lote.cultivoNombre}</span>,
    },
    {
      key: "pesoDisponible",
      label: "Peso Disponible",
      sortable: true,
      render: (lote: Lote) => (
        <span className="font-medium text-[#111827]">
          {lote.pesoDisponible.toFixed(2)} {lote.unidad}
        </span>
      ),
    },
    {
      key: "estado",
      label: "Estado",
      sortable: true,
      render: (lote: Lote) => (
        <Badge variant={estadoBadgeVariant[lote.estado] ?? "gray"}>
          {lote.estado}
        </Badge>
      ),
    },
    {
      key: "acciones",
      label: "Acciones",
      render: (lote: Lote) => (
        <div className="flex items-center gap-1">
          <Link
            to={`/lotes/${lote.id}`}
            className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-forest-600"
            title="Ver"
          >
            <Eye className="h-4 w-4" />
          </Link>
          <Link
            to={`/lotes/${lote.id}/editar`}
            className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-forest-600"
            title="Editar"
          >
            <Pencil className="h-4 w-4" />
          </Link>
          <button
            onClick={() => setDeleteId(lote.id)}
            className="rounded-lg p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-600"
            title="Eliminar"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <Breadcrumb items={[{ label: "Lotes" }]} />

      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <SectionHeader
          title="Lotes"
          description="Gestión de lotes de producción con seguimiento de pesos y estados."
        />
        <div className="flex items-center gap-2">
          <Button as="link" to="/lotes/nuevo" iconLeft={<Plus className="h-4 w-4" />}>
            Nuevo Lote
          </Button>
        </div>
      </div>

      <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {kpis.map((kpi) => (
          <Card key={kpi.label} padding="md" hover={false}>
            <div className="flex items-center gap-3">
              <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${kpi.iconClass}`}>
                <span className="text-lg font-bold">{kpi.value}</span>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500">{kpi.label}</p>
                <p className="text-lg font-bold text-[#111827]">{kpi.value}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="mb-6 flex flex-wrap items-end gap-3">
        <div className="max-w-md min-w-[200px] flex-1">
          <SearchInput
            placeholder="Buscar por código, nombre, cultivo o origen..."
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
            options={toOptions(loteEstados)}
            placeholder="Todos"
            value={filtroEstado}
            onChange={(val) => {
              setFiltroEstado(val);
              setPage(1);
            }}
          />
        </div>

        {hasFilters && (
          <Button variant="ghost" onClick={clearFilters} iconLeft={<X className="h-4 w-4" />}>
            Limpiar filtros
          </Button>
        )}
      </div>

      <DataTable
        columns={columns}
        data={lotes}
        keyField="id"
        loading={loading}
        emptyTitle="Sin lotes"
        emptyDescription="No se encontraron lotes con los filtros aplicados."
        emptyActionLabel="Crear Lote"
        emptyActionTo="/lotes/nuevo"
        currentPage={page}
        totalPages={totalPages}
        onPageChange={setPage}
      />

      <ConfirmDialog
        open={deleteId !== null}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Eliminar Lote"
        message="¿Estás seguro de eliminar este lote? Esta acción no se puede deshacer."
        confirmText="Eliminar"
        variant="danger"
      />
    </div>
  );
}
