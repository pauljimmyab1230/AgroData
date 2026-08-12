import { Pencil, Eye, Trash2, Wheat } from "lucide-react";
import { DataTable } from "../ui";
import type { Cultivo } from "../../services/cultivos";
import { cultivoEstadoBadge } from "./cultivoEstadoBadge";

interface CultivoTableProps {
  data: Cultivo[];
  onView: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  currentPage?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
}

export default function CultivoTable({ data, onView, onEdit, onDelete, currentPage, totalPages, onPageChange }: CultivoTableProps) {
  const columns = [
    { key: "codigo", label: "Código", className: "font-medium text-forest-700" },
    {
      key: "cultivo",
      label: "Cultivo",
      render: (c: Cultivo) => (
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-forest-600/10 text-forest-600">
            <Wheat className="h-4 w-4" />
          </div>
          <div>
            <p className="font-medium text-[#111827]">{c.cultivo}</p>
            <p className="text-xs text-gray-500">{c.variedad || "Sin variedad"}</p>
          </div>
        </div>
      ),
    },
    { key: "campaniaNombre", label: "Campaña" },
    { key: "productorNombre", label: "Productor" },
    {
      key: "areaSembrada",
      label: "Área",
      render: (c: Cultivo) => c.areaSembrada ? `${c.areaSembrada} ha` : "—",
    },
    { key: "estado", label: "Estado", render: (c: Cultivo) => cultivoEstadoBadge(c.estado) },
    {
      key: "acciones",
      label: "",
      className: "text-right",
      render: (c: Cultivo) => (
        <div className="flex justify-end gap-1">
          <button
            type="button"
            aria-label={`Ver ${c.cultivo}`}
            onClick={() => onView(c.id)}
            className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-forest-600/10 hover:text-forest-700"
          >
            <Eye className="h-4 w-4" />
          </button>
          <button
            type="button"
            aria-label={`Editar ${c.cultivo}`}
            onClick={() => onEdit(c.id)}
            className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-forest-600/10 hover:text-forest-700"
          >
            <Pencil className="h-4 w-4" />
          </button>
          <button
            type="button"
            aria-label={`Eliminar ${c.cultivo}`}
            onClick={() => onDelete(c.id)}
            className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-600"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={data}
      keyField="id"
      emptyTitle="No hay cultivos registrados"
      emptyDescription="Comienza registrando el primer cultivo de la cooperativa."
      emptyActionLabel="Registrar Cultivo"
      emptyActionTo="/cultivos/nuevo"
      currentPage={currentPage}
      totalPages={totalPages}
      onPageChange={onPageChange}
    />
  );
}
