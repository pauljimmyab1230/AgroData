import { Eye, Pencil, Trash2 } from "lucide-react";
import { Badge, DataTable } from "../ui";
import { formatFecha, formatKg, type Acopio } from "../../services/acopios";

interface AcopioTableProps {
  data: Acopio[];
  onView: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  currentPage?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
}

const estadoLabels: Record<string, string> = {
  EN_PROCESO: "En Proceso",
  COMPLETADO: "Completado",
  EN_PLANTA: "En Planta",
};

export default function AcopioTable({
  data,
  onView,
  onEdit,
  onDelete,
  currentPage,
  totalPages,
  onPageChange,
}: AcopioTableProps) {
  const columns = [
    { key: "codigo", label: "Código", sortable: true, className: "font-medium text-forest-700" },
    {
      key: "fecha",
      label: "Fecha",
      sortable: true,
      render: (a: Acopio) => <span className="text-gray-600">{formatFecha(a.fecha)}</span>,
    },
    { key: "acopiador", label: "Acopiador" },
    {
      key: "detalles",
      label: "Productores",
      render: (a: Acopio) => (
        <span className="text-sm text-gray-600">{a.detalles.length} productor(es)</span>
      ),
    },
    {
      key: "totalSacos",
      label: "Sacos",
      sortable: true,
      render: (a: Acopio) => <Badge variant="gray">{a.totalSacos}</Badge>,
    },
    {
      key: "pesoTotal",
      label: "Peso Total",
      sortable: true,
      render: (a: Acopio) => <span className="font-medium text-[#111827]">{formatKg(a.pesoTotal)}</span>,
    },
    {
      key: "estado",
      label: "Estado",
      render: (a: Acopio) => {
        const variant = a.estado === "COMPLETADO" ? "green" : a.estado === "EN_PLANTA" ? "blue" : "yellow";
        return <Badge variant={variant}>{estadoLabels[a.estado] || a.estado}</Badge>;
      },
    },
    {
      key: "acciones",
      label: "",
      className: "text-right",
      render: (a: Acopio) => (
        <div className="flex justify-end gap-1">
          <button
            type="button"
            aria-label={`Ver ${a.codigo}`}
            onClick={() => onView(a.id)}
            className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-forest-600/10 hover:text-forest-700"
          >
            <Eye className="h-4 w-4" />
          </button>
          <button
            type="button"
            aria-label={`Editar ${a.codigo}`}
            onClick={() => onEdit(a.id)}
            className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-forest-600/10 hover:text-forest-700"
          >
            <Pencil className="h-4 w-4" />
          </button>
          <button
            type="button"
            aria-label={`Eliminar ${a.codigo}`}
            onClick={() => onDelete(a.id)}
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
      emptyTitle="No hay acopios registrados"
      emptyDescription="Comienza registrando el primer acopio de producción de la cooperativa."
      emptyActionLabel="Nuevo Acopio"
      emptyActionTo="/acopio/nuevo"
      currentPage={currentPage}
      totalPages={totalPages}
      onPageChange={onPageChange}
    />
  );
}
