import { useState, useEffect, useRef, useCallback } from "react";
import { UserPlus, Users, Pencil, Trash2, Loader2 } from "lucide-react";
import { Badge, Button, ConfirmDialog, DataTable } from "../ui";
import { CardHeader, CardShell, type FormMode } from "../shared/formControls";
import { useProductorForm } from "../../contexts/ProductorFormContext";
import { useFamiliares } from "../../hooks/queries";
import {
  createFamiliar,
  updateFamiliar,
  deleteFamiliar,
  type Familiar,
  type ProductorId,
} from "../../services/productores";
import { FamiliarModal } from "./FamiliarModal";
import type { FamiliarFormData } from "./FamiliarModal";
import { toast } from "../../utils/toast";

type FamiliarTableProps = {
  mode: FormMode;
  productorId?: ProductorId;
};

export function FamiliarTable({ mode, productorId }: FamiliarTableProps) {
  const readOnly = mode === "view";
  const { familiares, setFamiliares } = useProductorForm();
  const { data: fetchedFamiliares, isLoading: loadingFamiliares } = useFamiliares(
    mode !== "create" && productorId ? productorId : null
  );
  const tempIdCounter = useRef(0);

  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Familiar | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Familiar | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (mode !== "create" && fetchedFamiliares) {
      setFamiliares(fetchedFamiliares);
    }
  }, [mode, fetchedFamiliares, setFamiliares]);

  const handleSave = useCallback(async (form: FamiliarFormData) => {
    setSaving(true);
    try {
      if (editTarget) {
        if (mode === "create") {
          setFamiliares(familiares.map((f) => (f.id === editTarget.id ? ({ ...editTarget, ...form } as Familiar) : f)));
        } else if (productorId) {
          const updated = await updateFamiliar(productorId, editTarget.id, form);
          setFamiliares(familiares.map((f) => (f.id === updated.id ? updated : f)));
        }
      } else {
        if (mode === "create") {
          const provisional = { id: -(++tempIdCounter.current), ...form } as Familiar;
          setFamiliares([...familiares, provisional]);
        } else if (productorId) {
          const created = await createFamiliar(productorId, form);
          setFamiliares([...familiares, created]);
        }
      }
      setModalOpen(false);
      setEditTarget(null);
    } catch (error) {
      console.error("Error al guardar familiar:", error);
      toast.error("Error al guardar el familiar.");
    } finally {
      setSaving(false);
    }
  }, [editTarget, mode, productorId, familiares, setFamiliares]);

  const handleDelete = useCallback(async () => {
    if (!deleteTarget) return;
    try {
      if (mode === "create") {
        setFamiliares(familiares.filter((f) => f.id !== deleteTarget.id));
      } else if (productorId) {
        await deleteFamiliar(productorId, deleteTarget.id);
        setFamiliares(familiares.filter((f) => f.id !== deleteTarget.id));
      }
      setDeleteTarget(null);
    } catch (error) {
      console.error("Error al eliminar familiar:", error);
      toast.error("Error al eliminar el familiar.");
    }
  }, [deleteTarget, mode, productorId, familiares, setFamiliares]);

  const columns = [
    {
      key: "nombres",
      label: "Nombres",
      render: (familiar: Familiar) => (
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-forest-600/10 text-sm font-semibold text-forest-700">
            {familiar.nombres.charAt(0)}
          </div>
          <span className="font-medium text-[#111827]">{familiar.nombres}</span>
        </div>
      ),
    },
    { key: "parentesco", label: "Parentesco" },
    { key: "dni", label: "DNI", render: (f: Familiar) => f.dni ?? "—" },
    { key: "sexo", label: "Sexo", render: (f: Familiar) => (f.sexo === "MASCULINO" ? "Masculino" : "Femenino") },
    { key: "fechaNacimiento", label: "Fecha Nacimiento", render: (f: Familiar) => f.fechaNacimiento || "—" },
    { key: "ocupacion", label: "Ocupación", render: (f: Familiar) => f.ocupacion ?? "—" },
    { key: "nivelEducativo", label: "Nivel Educativo", render: (f: Familiar) => f.nivelEducativo ?? "—" },
    { key: "telefono", label: "Teléfono", render: (f: Familiar) => f.telefono ?? "—" },
    {
      key: "dependiente",
      label: "Dependiente",
      render: (familiar: Familiar) =>
        familiar.dependiente ? <Badge variant="green">Sí</Badge> : <Badge variant="gray">No</Badge>,
    },
    {
      key: "viveConProductor",
      label: "Vive con el productor",
      render: (familiar: Familiar) =>
        familiar.viveConProductor ? <Badge variant="forest">Sí</Badge> : <Badge variant="gray">No</Badge>,
    },
    ...(!readOnly
      ? [
          {
            key: "acciones",
            label: "",
            className: "text-right",
            render: (familiar: Familiar) => (
              <div className="flex justify-end gap-1">
                <button
                  type="button"
                  aria-label={`Editar ${familiar.nombres}`}
                  onClick={() => {
                    setEditTarget(familiar);
                    setModalOpen(true);
                  }}
                  className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-forest-600/10 hover:text-forest-700"
                >
                  <Pencil className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  aria-label={`Eliminar ${familiar.nombres}`}
                  onClick={() => setDeleteTarget(familiar)}
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
        icon={<Users size={20} />}
        title="Información Familiar"
        description="Registro de familiares dependientes y miembros del núcleo familiar"
        actions={
          !readOnly ? (
            <Button
              variant="secondary"
              size="sm"
              iconLeft={<UserPlus className="h-4 w-4" />}
              onClick={() => {
                setEditTarget(null);
                setModalOpen(true);
              }}
            >
              Agregar Familiar
            </Button>
          ) : undefined
        }
      />

      {loadingFamiliares ? (
        <div className="flex items-center justify-center py-10">
          <Loader2 className="h-6 w-6 animate-spin text-forest-600" />
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={familiares}
          keyField="id"
          emptyTitle="Sin familiares registrados"
          emptyDescription="Agrega los familiares del productor para completar la información."
        />
      )}

      <FamiliarModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditTarget(null);
        }}
        onSave={handleSave}
        familiar={editTarget}
        saving={saving}
      />

      <ConfirmDialog
        open={deleteTarget !== null}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Eliminar Familiar"
        message="¿Estás seguro de eliminar este familiar? Esta acción no se puede deshacer."
        confirmText="Eliminar"
        variant="danger"
      />
    </CardShell>
  );
}
