import { useEffect, useState } from "react";
import { Boxes, Eye, Plus, Shield, Tag, Truck, X } from "lucide-react";
import { Link } from "react-router-dom";
import { Badge, Breadcrumb, Button, Card, ConfirmDialog, DataTable, Pagination, SearchInput, SectionHeader, Select } from "../../components/ui";
import type { Trazabilidad } from "../../services/trazabilidades";
import {
  fetchTrazabilidades,
  deleteTrazabilidad,
  trazabilidadEstados,
  trazabilidadEventos,
} from "../../services/trazabilidades";

const pageSize = 10;

const toOptions = (items: readonly string[]) =>
  items.map((item) => ({
    value: item,
    label: item.replace(/_/g, " ").toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase()),
  }));

const allEstados = [...trazabilidadEstados];
const allCertificaciones = ["ORGANICO", "CONVENCIONAL", "FAIR_TRADE", "RAINFOREST", "GLOBAL_G.A.P."];

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

function estadoBadge(estado: string) {
  const map: Record<string, { variant: "green" | "yellow" | "forest" | "gray" | "default" }> = {
    COMPLETADO: { variant: "green" },
    EN_PROCESO: { variant: "yellow" },
    PENDIENTE_VERIFICACION: { variant: "forest" },
  };
  return <Badge variant={map[estado]?.variant ?? "default"}>{estado.replace(/_/g, " ")}</Badge>;
}

function certBadge(cert: string) {
  if (!cert) return <span className="text-sm text-gray-400">-</span>;
  return (
    <Badge variant={cert === "ORGANICO" ? "green" : cert === "FAIR_TRADE" ? "purple" : "default"}>
      {cert.replace(/_/g, " ")}
    </Badge>
  );
}

export default function TrazabilidadList() {
  const [search, setSearch] = useState("");
  const [filtroEstado, setFiltroEstado] = useState("");
  const [filtroCert, setFiltroCert] = useState("");
  const [page, setPage] = useState(1);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const [items, setItems] = useState<Trazabilidad[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [stats, setStats] = useState({ total: 0, conCert: 0, enProceso: 0, completados: 0 });

  useEffect(() => {
    const params: Record<string, string | number> = { page, limit: pageSize };
    if (search) params.search = search;
    if (filtroEstado) params.estado = filtroEstado;
    if (filtroCert) params.certificacion = filtroCert;

    fetchTrazabilidades(params as Parameters<typeof fetchTrazabilidades>[0])
      .then((res) => {
        setItems(res.data);
        setTotalPages(res.totalPages);
        setStats({
          total: res.total,
          conCert: res.data.filter((t) => t.certificacion).length,
          enProceso: res.data.filter((t) => t.estado === "EN_PROCESO").length,
          completados: res.data.filter((t) => t.estado === "COMPLETADO").length,
        });
      })
      .catch(() => setItems([]));
  }, [search, filtroEstado, filtroCert, page]);

  const hasFilters = Boolean(search) || Boolean(filtroEstado) || Boolean(filtroCert);

  const clearFilters = () => {
    setSearch("");
    setFiltroEstado("");
    setFiltroCert("");
    setPage(1);
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteTrazabilidad(deleteId);
      setDeleteId(null);
      setPage(1);
    } catch {
      // ignore
    }
  };

  const kpis = [
    { label: "Total Registros", value: String(stats.total), icon: Boxes, iconClass: "bg-forest-600/10 text-forest-600" },
    { label: "Con Certificacion", value: String(stats.conCert), icon: Shield, iconClass: "bg-emerald-50 text-emerald-600" },
    { label: "En Proceso", value: String(stats.enProceso), icon: Truck, iconClass: "bg-amber-50 text-amber-600" },
    { label: "Completados", value: String(stats.completados), icon: Tag, iconClass: "bg-purple-50 text-purple-600" },
  ];

  const columns = [
    { key: "codigo", label: "Codigo", sortable: true },
    { key: "producto", label: "Producto", sortable: true, render: (t: Trazabilidad) => <span className="font-medium">{t.producto}</span> },
    { key: "cultivo", label: "Cultivo", sortable: true },
    { key: "productor", label: "Productor", sortable: true },
    { key: "comunidad", label: "Comunidad", sortable: true },
    { key: "certificacion", label: "Certificacion", sortable: true, render: (t: Trazabilidad) => certBadge(t.certificacion) },
    { key: "estado", label: "Estado", sortable: true, render: (t: Trazabilidad) => estadoBadge(t.estado) },
    {
      key: "acciones",
      label: "",
      className: "w-20",
      render: (t: Trazabilidad) => (
        <div className="flex items-center gap-1">
          <Link
            to={`/trazabilidad/${t.id}`}
            className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-forest-600"
            title="Ver detalle"
          >
            <Eye className="h-4 w-4" />
          </Link>
          <Link
            to={`/trazabilidad/${t.id}/editar`}
            className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-forest-600"
            title="Editar"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487z" />
            </svg>
          </Link>
          <button
            type="button"
            onClick={() => setDeleteId(t.id)}
            className="rounded-lg p-2 text-gray-400 hover:bg-red-50 hover:text-red-600"
            title="Eliminar"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
            </svg>
          </button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <Breadcrumb items={[{ label: "Trazabilidad" }]} />

      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <SectionHeader
          title="Trazabilidad"
          description="Seguimiento completo de la cadena productiva desde semilla hasta producto final."
        />
        <Button as="link" to="/trazabilidad/nuevo" iconLeft={<Plus className="h-4 w-4" />}>
          Nuevo Registro
        </Button>
      </div>

      <Card padding="md" className="mb-6">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {kpis.map((kpi) => (
            <div key={kpi.label} className="flex items-center gap-3">
              <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${kpi.iconClass}`}>
                <kpi.icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs text-gray-500">{kpi.label}</p>
                <p className="text-lg font-bold text-[#111827]">{kpi.value}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <div className="mb-6 flex flex-wrap items-end gap-3">
        <div className="max-w-md min-w-[200px] flex-1">
          <SearchInput
            placeholder="Buscar por codigo, producto, productor, comunidad..."
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
          options={toOptions(allEstados)}
          value={filtroEstado}
          onChange={(val) => {
            setFiltroEstado(val);
            setPage(1);
          }}
        />
        <FilterSelect
          label="Certificacion"
          placeholder="Todas"
          options={toOptions(allCertificaciones)}
          value={filtroCert}
          onChange={(val) => {
            setFiltroCert(val);
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
        data={items}
        currentPage={page}
        totalPages={totalPages}
        onPageChange={setPage}
        emptyTitle="Sin registros de trazabilidad"
        emptyDescription="No se encontraron registros con los filtros aplicados."
      />

      <ConfirmDialog
        open={deleteId !== null}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Eliminar Registro"
        message="¿Estás seguro de eliminar este registro de trazabilidad? Esta acción no se puede deshacer."
        confirmText="Eliminar"
        variant="danger"
      />
    </div>
  );
}
