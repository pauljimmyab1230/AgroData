import { useEffect, useState } from "react";
import { Boxes, Plus, Scale, Users, Warehouse, X } from "lucide-react";
import { Button, ConfirmDialog, LoadingSpinner, SearchInput, SectionHeader, Select } from "../../components/ui";
import AcopioKPI from "../../components/acopio/AcopioKPI";
import AcopioTable from "../../components/acopio/AcopioTable";
import {
  fetchAcopios,
  fetchAcopioStats,
  deleteAcopio,
  type AcopioView,
  type AcopiosQuery,
} from "../../services/acopios";
import {
  fetchCampanias,
  type Campania,
} from "../../services/campanias";
import {
  fetchProductores,
  type Productor,
} from "../../services/productores";
import AcopioModal from "../../components/acopio/AcopioModal";

const pageSize = 10;

const displayToApiEstado: Record<string, string> = {
  "En Proceso": "EN_PROCESO",
  Completado: "COMPLETADO",
  "En Planta": "EN_PLANTA",
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

export default function AcopioList() {
  const [search, setSearch] = useState("");
  const [filtroCampania, setFiltroCampania] = useState("");
  const [filtroComunidad, setFiltroComunidad] = useState("");
  const [filtroProductor, setFiltroProductor] = useState("");
  const [filtroAcopiador, setFiltroAcopiador] = useState("");
  const [filtroEstado, setFiltroEstado] = useState("");
  const [page, setPage] = useState(1);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [viewId, setViewId] = useState<string | null>(null);

  const [acopios, setAcopios] = useState<AcopioView[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  const [stats, setStats] = useState({
    total_acopios: 0,
    productores_atendidos: 0,
    sacos_recibidos: 0,
    kilogramos_acopiados: 0,
  });

  const [campaniasOpts, setCampaniasOpts] = useState<{ value: string; label: string }[]>([]);
  const [productoresOpts, setProductoresOpts] = useState<{ value: string; label: string }[]>([]);

  useEffect(() => {
    Promise.all([
      fetchCampanias({ limit: 100 }).catch(() => ({ data: [] })),
      fetchProductores({ limit: 100 }).catch(() => ({ data: [] })),
    ]).then(([campaniasRes, productoresRes]) => {
      setCampaniasOpts(
        (campaniasRes.data as Campania[]).map((c) => ({ value: c.id, label: c.nombre }))
      );
      setProductoresOpts(
        (productoresRes.data as Productor[]).map((p) => ({
          value: p.id,
          label: `${p.nombres} ${p.apellidoPaterno}`,
        }))
      );
    });
  }, []);

  const loadData = () => {
    const params: AcopiosQuery = { page, limit: pageSize };
    if (search) params.search = search;
    if (filtroCampania) params.campania_id = filtroCampania;
    if (filtroComunidad) params.comunidad = filtroComunidad;
    if (filtroProductor) params.productor_id = filtroProductor;
    if (filtroAcopiador) params.acopiador = filtroAcopiador;
    if (filtroEstado) params.estado = displayToApiEstado[filtroEstado] ?? filtroEstado;

    setLoading(true);
    fetchAcopios(params)
      .then((res) => {
        setAcopios(res.data);
        setTotalPages(res.totalPages);
      })
      .catch(() => {
        setAcopios([]);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
  }, [search, filtroCampania, filtroComunidad, filtroProductor, filtroAcopiador, filtroEstado, page]);

  useEffect(() => {
    fetchAcopioStats()
      .then(setStats)
      .catch(() => {});
  }, []);

  const kpis = [
    {
      label: "Total Acopios",
      value: String(stats.total_acopios),
      icon: Warehouse,
      iconClass: "bg-forest-600/10 text-forest-600",
    },
    {
      label: "Productores Atendidos",
      value: String(stats.productores_atendidos),
      icon: Users,
      iconClass: "bg-sun-100 text-sun-700",
    },
    {
      label: "Sacos Recibidos",
      value: String(stats.sacos_recibidos),
      icon: Boxes,
      iconClass: "bg-forest-600/10 text-forest-600",
    },
    {
      label: "Kilogramos Acopiados",
      value: `${Intl.NumberFormat("es-PE", { maximumFractionDigits: 1 }).format(stats.kilogramos_acopiados)} kg`,
      icon: Scale,
      iconClass: "bg-red-50 text-red-600",
    },
  ];

  const hasFilters =
    Boolean(search) ||
    Boolean(filtroCampania) ||
    Boolean(filtroComunidad) ||
    Boolean(filtroProductor) ||
    Boolean(filtroAcopiador) ||
    Boolean(filtroEstado);

  const clearFilters = () => {
    setSearch("");
    setFiltroCampania("");
    setFiltroComunidad("");
    setFiltroProductor("");
    setFiltroAcopiador("");
    setFiltroEstado("");
    setPage(1);
  };

  const handleModalClose = () => {
    setShowCreateModal(false);
    setEditId(null);
    setViewId(null);
    loadData();
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteAcopio(deleteId);
      setDeleteId(null);
      loadData();
    } catch {
      // ignore
    }
  };

  return (
    <div>
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <SectionHeader
          title="Acopio"
          description="Recepción de la producción de los productores"
        />
        <div className="flex items-center gap-2">
          <Button onClick={() => setShowCreateModal(true)} iconLeft={<Plus className="h-4 w-4" />}>
            Nuevo Acopio
          </Button>
        </div>
      </div>

      <AcopioKPI items={kpis} />

      <div className="mb-6 flex flex-wrap items-end gap-3">
        <div className="max-w-md min-w-[200px] flex-1">
          <SearchInput
            placeholder="Buscar por código, productor, comunidad o acopiador..."
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
          options={campaniasOpts}
          value={filtroCampania}
          onChange={(val) => {
            setFiltroCampania(val);
            setPage(1);
          }}
        />
        <FilterSelect
          label="Productor"
          placeholder="Todos"
          options={productoresOpts}
          value={filtroProductor}
          onChange={(val) => {
            setFiltroProductor(val);
            setPage(1);
          }}
        />
        <FilterSelect
          label="Estado"
          placeholder="Todos"
          options={[
            { value: "EN_PROCESO", label: "En Proceso" },
            { value: "COMPLETADO", label: "Completado" },
            { value: "EN_PLANTA", label: "En Planta" },
          ]}
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
        <div className="flex items-center justify-center py-20">
          <LoadingSpinner />
        </div>
      ) : (
        <AcopioTable
          data={acopios}
          currentPage={page}
          totalPages={totalPages}
          onPageChange={setPage}
          onView={(acopio) => setViewId(String(acopio.id))}
          onEdit={(acopio) => setEditId(String(acopio.id))}
          onDelete={(acopio) => setDeleteId(String(acopio.id))}
        />
      )}

      <ConfirmDialog
        open={deleteId !== null}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Eliminar Acopio"
        message="¿Estás seguro de eliminar este acopio? Esta acción no se puede deshacer."
        confirmText="Eliminar"
        variant="danger"
      />

      <AcopioModal
        open={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSave={handleModalClose}
        mode="create"
      />

      <AcopioModal
        open={editId !== null}
        onClose={() => setEditId(null)}
        onSave={handleModalClose}
        mode="edit"
        acopioId={editId || undefined}
      />

      <AcopioModal
        open={viewId !== null}
        onClose={() => setViewId(null)}
        mode="view"
        acopioId={viewId || undefined}
      />
    </div>
  );
}
