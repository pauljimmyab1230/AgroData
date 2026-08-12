import { useState, useEffect } from "react";
import { MapPin, Plus, Pencil, Trash2, Ruler, ShieldCheck, Sprout, Layers, Loader2 } from "lucide-react";
import { Badge, Button, Card, ConfirmDialog, DataTable } from "../ui";
import { CardHeader, CardShell, type FormMode } from "../shared/formControls";
import { useProductorForm } from "../../contexts/ProductorFormContext";
import {
  fetchParcelas,
  createParcela,
  updateParcela,
  deleteParcela,
  type Parcela,
} from "../../services/productores";
import { ParcelaModal, type ParcelaFormData } from "./ParcelaModal";

type ParcelaTableProps = {
  mode: FormMode;
  productorId?: string;
};

const certificacionLabel: Record<string, string> = {
  ORGANICA: "Orgánica",
  EN_TRANSICION: "En Transición",
  CONVENCIONAL: "Convencional",
};

const areaUnidadLabel: Record<string, string> = {
  ha: "ha",
  m2: "m²",
};

export function ParcelaTable({ mode, productorId }: ParcelaTableProps) {
  const readOnly = mode === "view";
  const { parcelas, setParcelas } = useProductorForm();

  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Parcela | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Parcela | null>(null);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState<boolean>(mode !== "create" && !!productorId);

  useEffect(() => {
    if (mode === "create" || !productorId) return;
    fetchParcelas(productorId)
      .then(setParcelas)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [mode, productorId, setParcelas]);

  const totalParcelas = parcelas.length;
  const areaTotal = parcelas.reduce((sum, p) => sum + parseFloat(p.area), 0);
  const areaCertificada = parcelas
    .filter((p) => p.certificacion === "ORGANICA")
    .reduce((sum, p) => sum + parseFloat(p.area), 0);
  const cultivosActivos = new Set(
    parcelas.filter((p) => p.estado === "ACTIVA").map((p) => p.cultivo),
  ).size;

  const kpis = [
    {
      label: "Parcelas Registradas",
      value: String(totalParcelas),
      icon: Layers,
      iconClass: "bg-forest-600/10 text-forest-600",
    },
    {
      label: "Área Total",
      value: `${areaTotal.toFixed(2)} ha`,
      icon: Ruler,
      iconClass: "bg-sun-100 text-sun-700",
    },
    {
      label: "Área Certificada",
      value: `${areaCertificada.toFixed(2)} ha`,
      icon: ShieldCheck,
      iconClass: "bg-emerald-100 text-emerald-700",
    },
    {
      label: "Cultivos Activos",
      value: String(cultivosActivos),
      icon: Sprout,
      iconClass: "bg-forest-600/10 text-forest-600",
    },
  ];

  const handleSave = async (form: ParcelaFormData) => {
    setSaving(true);
    try {
      if (editTarget) {
        if (mode === "create") {
          setParcelas(parcelas.map((p) => (p.id === editTarget.id ? { ...editTarget, ...form } : p)));
        } else if (productorId) {
          const updated = await updateParcela(productorId, editTarget.id, form);
          setParcelas(parcelas.map((p) => (p.id === updated.id ? updated : p)));
        }
      } else {
        if (mode === "create") {
          setParcelas([...parcelas, { id: `temp-${Date.now()}`, ...form }]);
        } else if (productorId) {
          const created = await createParcela(productorId, form);
          setParcelas([...parcelas, created]);
        }
      }
      setModalOpen(false);
      setEditTarget(null);
    } catch (err) {
      console.error(err);
      alert("Error al guardar la parcela.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      if (mode === "create") {
        setParcelas(parcelas.filter((p) => p.id !== deleteTarget.id));
      } else if (productorId) {
        await deleteParcela(productorId, deleteTarget.id);
        setParcelas(parcelas.filter((p) => p.id !== deleteTarget.id));
      }
      setDeleteTarget(null);
    } catch (err) {
      console.error(err);
      alert("Error al eliminar la parcela.");
    }
  };

  const columns = [
    { key: "codigo", label: "Código", className: "font-medium text-forest-700" },
    { key: "nombre", label: "Nombre Parcela" },
    { key: "cultivo", label: "Cultivo" },
    {
      key: "area",
      label: "Área",
      render: (parcela: Parcela) => `${parcela.area} ${areaUnidadLabel[parcela.areaUnidad] ?? parcela.areaUnidad}`,
    },
    { key: "ubicacion", label: "Ubicación" },
    {
      key: "certificacion",
      label: "Certificación",
      render: (parcela: Parcela) =>
        parcela.certificacion === "ORGANICA" ? (
          <Badge variant="green">{certificacionLabel[parcela.certificacion] ?? parcela.certificacion}</Badge>
        ) : parcela.certificacion === "EN_TRANSICION" ? (
          <Badge variant="yellow">{certificacionLabel[parcela.certificacion] ?? parcela.certificacion}</Badge>
        ) : (
          <Badge variant="gray">{certificacionLabel[parcela.certificacion] ?? parcela.certificacion}</Badge>
        ),
    },
    {
      key: "estado",
      label: "Estado",
      render: (parcela: Parcela) =>
        parcela.estado === "ACTIVA" ? (
          <Badge variant="forest">Activa</Badge>
        ) : (
          <Badge variant="gray">Inactiva</Badge>
        ),
    },
    ...(!readOnly
      ? [
          {
            key: "acciones",
            label: "",
            className: "text-right",
            render: (parcela: Parcela) => (
              <div className="flex justify-end gap-1">
                <button
                  type="button"
                  aria-label={`Editar ${parcela.nombre}`}
                  onClick={() => {
                    setEditTarget(parcela);
                    setModalOpen(true);
                  }}
                  className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-forest-600/10 hover:text-forest-700"
                >
                  <Pencil className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  aria-label={`Eliminar ${parcela.nombre}`}
                  onClick={() => setDeleteTarget(parcela)}
                  className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-600"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ),
          },
        ]
      : []),
  ];

  return (
    <CardShell>
      <CardHeader
        icon={<MapPin size={20} />}
        title="Parcelas"
        description="Parcelas asociadas al productor con datos de cultivo y certificación"
        actions={
          !readOnly ? (
            <Button
              variant="secondary"
              size="sm"
              iconLeft={<Plus className="h-4 w-4" />}
              onClick={() => {
                setEditTarget(null);
                setModalOpen(true);
              }}
            >
              Agregar Parcela
            </Button>
          ) : undefined
        }
      />

      <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {kpis.map((kpi) => (
          <Card key={kpi.label} padding="md" hover={false} className="shadow-sm">
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="truncate text-xs font-medium uppercase tracking-wider text-gray-500">
                  {kpi.label}
                </p>
                <p className="mt-1.5 text-xl font-bold text-[#111827]">{kpi.value}</p>
              </div>
              <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${kpi.iconClass}`}>
                <kpi.icon className="h-5 w-5" />
              </div>
            </div>
          </Card>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-10">
          <Loader2 className="h-6 w-6 animate-spin text-forest-600" />
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={parcelas}
          keyField="id"
          emptyTitle="Sin parcelas registradas"
          emptyDescription="Agrega las parcelas del productor para el proceso de certificación."
        />
      )}

      <ParcelaModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditTarget(null);
        }}
        onSave={handleSave}
        parcela={editTarget}
        saving={saving}
      />

      <ConfirmDialog
        open={deleteTarget !== null}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Eliminar Parcela"
        message="¿Estás seguro de eliminar esta parcela? Esta acción no se puede deshacer."
        confirmText="Eliminar"
        variant="danger"
      />
    </CardShell>
  );
}
