import { Pencil, Eye, Trash2, Wheat } from "lucide-react";
import { DataTable } from "../ui";
import type { Cultivo } from "../../pages/cultivos/cultivoMock";
import { cultivoEstadoBadge } from "./cultivoEstadoBadge";

interface CultivoTableProps {
  data: Cultivo[];
  onView: (cultivo: Cultivo) => void;
  onEdit: (cultivo: Cultivo) => void;
  onDelete: (cultivo: Cultivo) => void;
  currentPage?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
}

export default function CultivoTable({ data, onView, onEdit, onDelete, currentPage, totalPages, onPageChange }: CultivoTableProps) {
  const columns = [
    { key: "codigo", label: "Código", className: "font-medium text-forest-700" },
    {
      key: "campania",
      label: "Campaña",
      render: (cultivo: Cultivo) => (
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-forest-600/10 text-forest-600">
            <Wheat className="h-4 w-4" />
          </div>
          <span className="font-medium text-[#111827]">{cultivo.campania}</span>
        </div>
      ),
    },
    { key: "productor", label: "Productor" },
    { key: "parcela", label: "Parcela" },
    { key: "cultivo", label: "Cultivo" },
    { key: "variedad", label: "Variedad" },
    { key: "areaSembrada", label: "Área", render: (cultivo: Cultivo) => `${cultivo.areaSembrada.toFixed(2)} ha` },
    { key: "estado", label: "Estado", render: (cultivo: Cultivo) => cultivoEstadoBadge(cultivo.estado) },
    {
      key: "acciones",
      label: "",
      className: "text-right",
      render: (cultivo: Cultivo) => (
        <div className="flex justify-end gap-1">
          <button
            type="button"
            aria-label={`Ver ${cultivo.codigo}`}
            onClick={() => onView(cultivo)}
            className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-forest-600/10 hover:text-forest-700"
          >
            <Eye className="h-4 w-4" />
          </button>
          <button
            type="button"
            aria-label={`Editar ${cultivo.codigo}`}
            onClick={() => onEdit(cultivo)}
            className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-forest-600/10 hover:text-forest-700"
          >
            <Pencil className="h-4 w-4" />
          </button>
          <button
            type="button"
            aria-label={`Eliminar ${cultivo.codigo}`}
            onClick={() => onDelete(cultivo)}
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
      emptyDescription="Comienza registrando el primer cultivo de la campaña."
      emptyActionLabel="Registrar Cultivo"
      emptyActionTo="/cultivos/nuevo"
      currentPage={currentPage}
      totalPages={totalPages}
      onPageChange={onPageChange}
    />
  );
}
