import { useState, useMemo, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Plus, Pencil, Trash2, CheckCircle, XCircle } from "lucide-react";
import {
  Badge,
  Breadcrumb,
  Button,
  Card,
  ConfirmDialog,
  DataTable,
  Input,
  Modal,
  SearchInput,
  SectionHeader,
  Textarea,
} from "../../components/ui";
import { catalogoConfigs, type CatalogoItem } from "./catalogoMock";

export default function CatalogPage() {
  const { catalogoId } = useParams<{ catalogoId: string }>();
  const config = catalogoConfigs[catalogoId || ""];

  const [items, setItems] = useState<CatalogoItem[]>([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<CatalogoItem | null>(null);
  const [formNombre, setFormNombre] = useState("");
  const [formDescripcion, setFormDescripcion] = useState("");

  useEffect(() => {
    setItems(config?.items || []);
    setSearch("");
    setPage(1);
    setDeleteId(null);
    setModalOpen(false);
    setEditingItem(null);
  }, [catalogoId, config]);

  const limit = 10;

  const filtered = useMemo(() => {
    if (!search) return items;
    const q = search.toLowerCase();
    return items.filter(
      (item) =>
        item.nombre.toLowerCase().includes(q) ||
        item.descripcion.toLowerCase().includes(q)
    );
  }, [items, search]);

  const totalPages = Math.ceil(filtered.length / limit);
  const paginated = filtered.slice((page - 1) * limit, page * limit);

  if (!config) {
    return (
      <div className="py-20 text-center text-gray-500">
        <p>Catálogo no encontrado.</p>
      </div>
    );
  }

  const handleOpenCreate = () => {
    setEditingItem(null);
    setFormNombre("");
    setFormDescripcion("");
    setModalOpen(true);
  };

  const handleOpenEdit = (item: CatalogoItem) => {
    setEditingItem(item);
    setFormNombre(item.nombre);
    setFormDescripcion(item.descripcion);
    setModalOpen(true);
  };

  const handleSave = () => {
    if (!formNombre.trim()) return;

    if (editingItem) {
      setItems((prev) =>
        prev.map((item) =>
          item.id === editingItem.id
            ? { ...item, nombre: formNombre.trim(), descripcion: formDescripcion.trim() }
            : item
        )
      );
    } else {
      const newItem: CatalogoItem = {
        id: `new-${Date.now()}`,
        nombre: formNombre.trim(),
        descripcion: formDescripcion.trim(),
        activo: true,
        created_at: new Date().toISOString().split("T")[0],
      };
      setItems((prev) => [newItem, ...prev]);
    }
    setModalOpen(false);
  };

  const handleToggleActivo = (id: string) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, activo: !item.activo } : item
      )
    );
  };

  const handleDelete = () => {
    if (!deleteId) return;
    setItems((prev) => prev.filter((item) => item.id !== deleteId));
    setDeleteId(null);
  };

  const totalActivos = items.filter((i) => i.activo).length;
  const totalInactivos = items.filter((i) => !i.activo).length;

  const columns = [
    {
      key: "nombre",
      label: "Nombre",
      className: "font-medium text-[#111827]",
      render: (item: CatalogoItem) => (
        <div>
          <p className="font-medium text-[#111827]">{item.nombre}</p>
          <p className="text-xs text-gray-500">{item.descripcion}</p>
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
      <Breadcrumb
        items={[
          { label: "Catálogos", to: "/catalogos/departamentos" },
          { label: config.titulo },
        ]}
      />

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
              <p className="mt-1.5 text-2xl font-bold text-[#111827]">{items.length}</p>
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
        data={paginated}
        keyField="id"
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
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="secondary" onClick={() => setModalOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSave}>
              {editingItem ? "Guardar Cambios" : "Crear"}
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
