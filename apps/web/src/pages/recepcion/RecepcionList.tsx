import { useEffect, useState } from "react";
import { Hash, PackageCheck, Plus, Scale, Timer, X } from "lucide-react";
import { Breadcrumb, Button, ConfirmDialog, SearchInput, SectionHeader, Select } from "../../components/ui";
import RecepcionKPI from "../../components/recepcion/RecepcionKPI";
import RecepcionTable from "../../components/recepcion/RecepcionTable";
import {
  type Recepcion,
  fetchRecepciones,
  deleteRecepcion,
  formatearPeso,
  recepcionEstados,
} from "../../services/recepciones";

const pageSize = 20;

const toOptions = (items: readonly string[]) =>
  items.map((item) => ({ value: item, label: item }));

const estadoLabels: Record<string, string> = {
  PENDIENTE_PESAJE: "Pendiente de Pesaje",
  EN_CONTROL_CALIDAD: "En Control de Calidad",
  DISPONIBLE: "Disponible",
  RECHAZADA: "Rechazada",
};

const estadoOptions = recepcionEstados.map((e) => ({
  value: e,
  label: estadoLabels[e] ?? e,
}));

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

export default function RecepcionList() {
  const [search, setSearch] = useState("");
  const [filtroEstado, setFiltroEstado] = useState("");
  const [page, setPage] = useState(1);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const [recepciones, setRecepciones] = useState<Recepcion[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      setLoading(true);
      try {
        const result = await fetchRecepciones({
          search: search || undefined,
          estado: filtroEstado || undefined,
          page,
          limit: pageSize,
        });
        if (!cancelled) {
          setRecepciones(result.data);
          setTotal(result.total);
          setTotalPages(result.totalPages);
        }
      } catch (err) {
        console.error("Error fetching recepciones:", err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, [search, filtroEstado, page]);

  const hasFilters = Boolean(search) || Boolean(filtroEstado);

  const clearFilters = () => {
    setSearch("");
    setFiltroEstado("");
    setPage(1);
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      await deleteRecepcion(deleteId);
      setDeleteId(null);
      const result = await fetchRecepciones({
        search: search || undefined,
        estado: filtroEstado || undefined,
        page,
        limit: pageSize,
      });
      setRecepciones(result.data);
      setTotal(result.total);
      setTotalPages(result.totalPages);
    } catch (err) {
      console.error("Error deleting recepcion:", err);
    } finally {
      setDeleting(false);
    }
  };

  const kpis = [
    {
      label: "Recepciones",
      value: loading ? "—" : String(total),
      icon: PackageCheck,
      iconClass: "bg-forest-600/10 text-forest-600",
    },
    {
      label: "Kilogramos Recibidos",
      value: loading ? "—" : formatearPeso(recepciones.reduce((acc, r) => acc + (r.pesoNeto ?? 0), 0)),
      icon: Scale,
      iconClass: "bg-sun-100 text-sun-700",
    },
    {
      label: "LP Recepcionados",
      value: loading ? "—" : String(new Set(recepciones.map((r) => r.loteProductor)).size),
      icon: Hash,
      iconClass: "bg-purple-50 text-purple-600",
    },
    {
      label: "Pendientes de Procesamiento",
      value: loading ? "—" : String(recepciones.filter((r) => r.estado === "PENDIENTE_PESAJE").length),
      icon: Timer,
      iconClass: "bg-red-50 text-red-600",
    },
  ];

  return (
    <div>
      <Breadcrumb items={[{ label: "Recepción" }]} />

      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <SectionHeader
          title="Recepción de Materia Prima"
          description="Registro y verificación de la materia prima que ingresa del Acopio hacia la planta."
        />
        <div className="flex items-center gap-2">
          <Button as="link" to="/recepcion/nuevo" iconLeft={<Plus className="h-4 w-4" />}>
            Nueva Recepción
          </Button>
        </div>
      </div>

      <RecepcionKPI items={kpis} />

      <div className="mb-6 flex flex-wrap items-end gap-3">
        <div className="max-w-md min-w-[200px] flex-1">
          <SearchInput
            placeholder="Buscar por código, LP..."
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
          options={estadoOptions}
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

      <RecepcionTable
        data={recepciones}
        currentPage={page}
        totalPages={totalPages}
        onPageChange={setPage}
        onDelete={(recepcion) => setDeleteId(recepcion.id)}
      />

      <ConfirmDialog
        open={deleteId !== null}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Eliminar Recepción"
        message="¿Estás seguro de eliminar esta recepción? Esta acción no se puede deshacer."
        confirmText={deleting ? "Eliminando..." : "Eliminar"}
        variant="danger"
      />
    </div>
  );
}
