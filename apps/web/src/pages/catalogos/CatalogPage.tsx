import { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import { Plus, Pencil, Trash2, CheckCircle, XCircle, AlertTriangle } from "lucide-react";
import {
  Badge,
  Button,
  Card,
  ConfirmDialog,
  DataTable,
  Modal,
  SearchInput,
  SectionHeader,
  Textarea,
  Input,
} from "../../components/ui";
import {
  catalogoConfigs,
  fetchCatalogoItems,
  fetchCatalogoActivos,
  createCatalogoItem,
  updateCatalogoItem,
  toggleCatalogoItem,
  deleteCatalogoItem,
  type CatalogoItem,
} from "../../services/catalogos";

export default function CatalogPage() {
  const { catalogoId } = useParams<{ catalogoId: string }>();
  const config = catalogoId ? catalogoConfigs[catalogoId] : undefined;

  const [items, setItems] = useState<CatalogoItem[]>([]);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<CatalogoItem | null>(null);
  const [formNombre, setFormNombre] = useState("");
  const [formDescripcion, setFormDescripcion] = useState("");
  const [formOrden, setFormOrden] = useState(0);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [totalActivos, setTotalActivos] = useState(0);
  const [totalInactivos, setTotalInactivos] = useState(0);

  const limit = 10;

  const loadItems = useCallback(async () => {
    if (!catalogoId) return;
    setLoading(true);
    try {
      const [result, activos] = await Promise.all([
        fetchCatalogoItems(catalogoId, { search, page, limit }),
        fetchCatalogoActivos(catalogoId),
      ]);
      setItems(result.data);
      setTotal(result.total);
      setTotalActivos(activos.length);
      setTotalInactivos(result.total - activos.length);
    } catch {
      setItems([]);
      setTotal(0);
      setTotalActivos(0);
      setTotalInactivos(0);
    } finally {
      setLoading(false);
    }
  }, [catalogoId, search, page]);

  useEffect(() => {
    setSearch("");
    setPage(1);
  }, [catalogoId]);

  useEffect(() => {
    loadItems();
  }, [loadItems]);

  useEffect(() => {
    setDeleteId(null);
    setModalOpen(false);
    setEditingItem(null);
  }, [catalogoId]);

  if (!config || !catalogoId) {
    return (
      <div className="py-20 text-center text-gray-500">
        <p>Catálogo no encontrado.</p>
      </div>
    );
  }

  const totalPages = Math.ceil(total / limit);

  const handleOpenCreate = () => {
    setEditingItem(null);
    setFormNombre("");
    setFormDescripcion("");
    setFormOrden(0);
    setError("");
    setModalOpen(true);
  };

  const handleOpenEdit = (item: CatalogoItem) => {
    setEditingItem(item);
    setFormNombre(item.nombre);
    setFormDescripcion(item.descripcion ?? "");
    setFormOrden(item.orden);
    setError("");
    setModalOpen(true);
  };

  const handleSave = async () => {
    if (!formNombre.trim() || saving) return;
    setSaving(true);
    setError("");
    try {
      if (editingItem) {
        await updateCatalogoItem(editingItem.id, {
          nombre: formNombre.trim(),
          descripcion: formDescripcion.trim() || null,
          orden: formOrden,
        });
      } else {
        await createCatalogoItem(catalogoId, {
          nombre: formNombre.trim(),
          descripcion: formDescripcion.trim() || undefined,
          orden: formOrden,
        });
      }
      setModalOpen(false);
      loadItems();
    } catch (err: any) {
      setError(err?.response?.data?.message || "Error al guardar. Verifica que el nombre no esté duplicado.");
    } finally {
      setSaving(false);
    }
  };

  const handleToggleActivo = async (id: number) => {
    try {
      await toggleCatalogoItem(id);
      loadItems();
    } catch {
      // silent - toggle is low risk
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteCatalogoItem(deleteId);
      setDeleteId(null);
      loadItems();
    } catch (err: any) {
      setDeleteId(null);
      setError(err?.response?.data?.message || "Error al eliminar el registro.");
    }
  };

  const columns = [
    {
      key: "nombre",
      label: "Nombre",
      className: "font-medium text-[#111827]",
      render: (item: CatalogoItem) => (
        <div>
          <p className="font-medium text-[#111827]">{item.nombre}</p>
          {item.descripcion && <p className="text-xs text-gray-500">{item.descripcion}</p>}
        </div>
      ),
    },
    {
      key: "estado",
      label: "Estado",
      render: (item: CatalogoItem) =>
        item.activo ? (
          <Badge variant="green">Activo</Badge>
        ) : (
          <Badge variant="gray">Inactivo</Badge>
        ),
    },
    {
      key: "acciones",
      label: "",
      className: "text-right",
      render: (item: CatalogoItem) => (
        <div className="flex justify-end gap-1">
          <button
            type="button"
            aria-label={item.activo ? "Desactivar" : "Activar"}
            onClick={() => handleToggleActivo(item.id)}
            className={`rounded-lg p-1.5 transition-colors ${
              item.activo
                ? "text-gray-400 hover:bg-green-50 hover:text-green-600"
                : "text-gray-400 hover:bg-gray-100 hover:text-gray-600"
            }`}
          >
            {item.activo ? (
              <CheckCircle className="h-4 w-4" />
            ) : (
              <XCircle className="h-4 w-4" />
            )}
          </button>
          <button
            type="button"
            aria-label={`Editar ${item.nombre}`}
            onClick={() => handleOpenEdit(item)}
            className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-forest-600/10 hover:text-forest-700"
          >
            <Pencil className="h-4 w-4" />
          </button>
          <button
            type="button"
            aria-label={`Eliminar ${item.nombre}`}
            onClick={() => setDeleteId(item.id)}
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
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <SectionHeader title={config.titulo} description={config.descripcion} />
        <Button onClick={handleOpenCreate} iconLeft={<Plus className="h-4 w-4" />}>
          Nuevo
        </Button>
      </div>

      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <Card padding="md" hover={false} className="shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">Total</p>
              <p className="mt-1.5 text-2xl font-bold text-[#111827]">{total}</p>
              <p className="mt-1 text-xs text-gray-400">registros</p>
            </div>
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-forest-100 text-forest-700">
              <CheckCircle className="h-5 w-5" />
            </div>
          </div>
        </Card>
        <Card padding="md" hover={false} className="shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">Activos</p>
              <p className="mt-1.5 text-2xl font-bold text-green-600">{totalActivos}</p>
              <p className="mt-1 text-xs text-gray-400">disponibles</p>
            </div>
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-green-100 text-green-700">
              <CheckCircle className="h-5 w-5" />
            </div>
          </div>
        </Card>
        <Card padding="md" hover={false} className="shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">Inactivos</p>
              <p className="mt-1.5 text-2xl font-bold text-gray-500">{totalInactivos}</p>
              <p className="mt-1 text-xs text-gray-400">desactivados</p>
            </div>
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-gray-500">
              <XCircle className="h-5 w-5" />
            </div>
          </div>
        </Card>
      </div>

      <div className="mb-6">
        <div className="max-w-md min-w-[200px]">
          <SearchInput
            placeholder={`Buscar ${config.titulo.toLowerCase()}...`}
            value={search}
            onChange={(val) => { setSearch(val); setPage(1); }}
          />
        </div>
      </div>

      <DataTable
        columns={columns}
        data={items}
        keyField="id"
        loading={loading}
        emptyTitle={`No hay ${config.titulo.toLowerCase()}`}
        emptyDescription={`Comienza registrando el primer elemento del catálogo.`}
        emptyActionLabel="Registrar"
        emptyActionOnClick={handleOpenCreate}
        currentPage={page}
        totalPages={totalPages}
        onPageChange={setPage}
      />

      {/* Modal Crear/Editar */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingItem ? `Editar ${config.titulo}` : `Nuevo ${config.titulo}`}
      >
        <div className="space-y-4">
          {error && (
            <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              <AlertTriangle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}
          <Input
            label="Nombre"
            value={formNombre}
            onChange={(e) => setFormNombre(e.target.value)}
            placeholder="Ej: Quinua Real"
          />
          <Textarea
            label="Descripción"
            value={formDescripcion}
            onChange={(e) => setFormDescripcion(e.target.value)}
            placeholder="Descripción breve del elemento"
            rows={3}
          />
          <Input
            label="Orden"
            type="number"
            value={String(formOrden)}
            onChange={(e) => setFormOrden(Number(e.target.value) || 0)}
            placeholder="0"
          />
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="secondary" onClick={() => setModalOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving ? "Guardando..." : editingItem ? "Guardar Cambios" : "Crear"}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Confirmar Eliminación */}
      <ConfirmDialog
        open={deleteId !== null}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title={`Eliminar de ${config.titulo}`}
        message="¿Estás seguro de eliminar este registro? Esta acción no se puede deshacer."
        confirmText="Eliminar"
        variant="danger"
      />
    </div>
  );
}
