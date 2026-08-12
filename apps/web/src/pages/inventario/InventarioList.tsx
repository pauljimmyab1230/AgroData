import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AlertTriangle, Boxes, Eye, Pencil, Plus, ShieldCheck, Tag, X } from "lucide-react";
import { Breadcrumb, Button, Card, ConfirmDialog, DataTable, Pagination, SearchInput, SectionHeader, Select, Badge } from "../../components/ui";
import {
  fetchInventario,
  deleteInventarioItem,
  inventarioEstados,
  inventarioCategorias,
  calcularValorInventario,
  type InventarioItem,
  type InventariosQuery,
} from "../../services/inventarios";

const pageSize = 10;

const toOptions = (items: readonly string[]) =>
  items.map((item) => ({ value: item, label: item }));

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

const estadoBadgeVariant: Record<string, "green" | "yellow" | "red" | "gray"> = {
  DISPONIBLE: "green",
  RESERVADO: "yellow",
  AGOTADO: "red",
  VENCIDO: "gray",
};

const categoriaLabels: Record<string, string> = {
  MATERIA_PRIMA: "Materia Prima",
  PRODUCTO_TERMINADO: "Producto Terminado",
  EMPAQUE: "Empaque",
  INSUMO: "Insumo",
};

export default function InventarioList() {
  const [search, setSearch] = useState("");
  const [filtroEstado, setFiltroEstado] = useState("");
  const [filtroCategoria, setFiltroCategoria] = useState("");
  const [page, setPage] = useState(1);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const [items, setItems] = useState<InventarioItem[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const load = () => {
    const params: InventariosQuery = { page, limit: pageSize };
    if (search) params.search = search;
    if (filtroEstado) params.estado = filtroEstado;
    if (filtroCategoria) params.categoria = filtroCategoria;

    fetchInventario(params)
      .then((res) => {
        setItems(res.data);
        setTotal(res.total);
        setTotalPages(res.totalPages);
      })
      .catch(() => {
        setItems([]);
      });
  };

  useEffect(() => {
    load();
  }, [search, filtroEstado, filtroCategoria, page]);

  const kpis = [
    {
      label: "Total Items",
      value: String(total),
      icon: Boxes,
      iconClass: "bg-forest-600/10 text-forest-600",
    },
    {
      label: "Disponibles",
      value: String(items.filter((i) => i.estado === "DISPONIBLE").length),
      icon: ShieldCheck,
      iconClass: "bg-emerald-100 text-emerald-700",
    },
    {
      label: "Reservados",
      value: String(items.filter((i) => i.estado === "RESERVADO").length),
      icon: Tag,
      iconClass: "bg-amber-100 text-amber-700",
    },
    {
      label: "Bajo Stock",
      value: String(
        items.filter((i) => i.cantidadActual < i.cantidadMinima).length
      ),
      icon: AlertTriangle,
      iconClass: "bg-red-50 text-red-600",
    },
  ];

  const hasFilters = Boolean(search) || Boolean(filtroEstado) || Boolean(filtroCategoria);

  const clearFilters = () => {
    setSearch("");
    setFiltroEstado("");
    setFiltroCategoria("");
    setPage(1);
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteInventarioItem(deleteId);
      setDeleteId(null);
      load();
    } catch {
      // ignore
    }
  };

  return (
    <div>
      <Breadcrumb items={[{ label: "Inventario" }]} />

      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <SectionHeader
          title="Inventario"
          description="Control de existencias de materias primas y productos terminados."
        />
        <div className="flex items-center gap-2">
          <Button as="link" to="/inventario/nuevo" iconLeft={<Plus className="h-4 w-4" />}>
            Nuevo Item
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
            placeholder="Buscar por código, producto, proveedor..."
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
          options={toOptions([...inventarioEstados])}
          value={filtroEstado}
          onChange={(val) => {
            setFiltroEstado(val);
            setPage(1);
          }}
        />
        <FilterSelect
          label="Categoría"
          placeholder="Todas"
          options={toOptions([...inventarioCategorias])}
          value={filtroCategoria}
          onChange={(val) => {
            setFiltroCategoria(val);
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
        columns={[
          { key: "codigo", label: "Código", sortable: true },
          {
            key: "producto",
            label: "Producto",
            sortable: true,
            render: (item: InventarioItem) => (
              <span className="font-medium text-[#111827]">{item.producto}</span>
            ),
          },
          {
            key: "categoria",
            label: "Categoría",
            sortable: true,
            render: (item: InventarioItem) => (
              <Badge variant="forest">{categoriaLabels[item.categoria] || item.categoria}</Badge>
            ),
          },
          {
            key: "cantidadActual",
            label: "Stock",
            sortable: true,
            render: (item: InventarioItem) => (
              <span className={`${item.cantidadActual < item.cantidadMinima ? "font-semibold text-red-600" : ""}`}>
                {item.cantidadActual} {item.unidad}
              </span>
            ),
          },
          { key: "ubicacion", label: "Ubicación", sortable: true },
          {
            key: "estado",
            label: "Estado",
            sortable: true,
            render: (item: InventarioItem) => (
              <Badge variant={estadoBadgeVariant[item.estado] || "gray"}>{item.estado}</Badge>
            ),
          },
          {
            key: "acciones",
            label: "Acciones",
            className: "text-right",
            render: (item: InventarioItem) => (
              <div className="flex items-center justify-end gap-1">
                <Link
                  to={`/inventario/${item.id}`}
                  className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-forest-600"
                  title="Ver"
                >
                  <Eye className="h-4 w-4" />
                </Link>
                <Link
                  to={`/inventario/${item.id}/editar`}
                  className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-forest-600"
                  title="Editar"
                >
                  <Pencil className="h-4 w-4" />
                </Link>
                <button
                  onClick={() => setDeleteId(item.id)}
                  className="rounded-lg p-2 text-gray-400 hover:bg-red-50 hover:text-red-600"
                  title="Eliminar"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ),
          },
        ]}
        data={items}
        emptyTitle="Sin items de inventario"
        emptyDescription="No se encontraron items en el inventario."
        emptyActionTo="/inventario/nuevo"
        emptyActionLabel="Crear primer item"
        currentPage={page}
        totalPages={totalPages}
        onPageChange={setPage}
      />

      <ConfirmDialog
        open={deleteId !== null}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Eliminar Item"
        message="¿Estás seguro de eliminar este item del inventario? Esta acción no se puede deshacer."
        confirmText="Eliminar"
        variant="danger"
      />
    </div>
  );
}
