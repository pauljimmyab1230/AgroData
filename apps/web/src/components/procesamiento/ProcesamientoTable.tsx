import { Eye, Pencil, Trash2, Factory } from "lucide-react";
import { Badge, DataTable } from "../ui";
import { EstadoProcesamientoBadge } from "./badges";
import { formatFecha, formatKg, type OrdenProcesamiento } from "../../services/procesamientos";

interface ProcesamientoTableProps {
  data: OrdenProcesamiento[];
  currentPage?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
  onView?: (orden: OrdenProcesamiento) => void;
  onEdit?: (orden: OrdenProcesamiento) => void;
  onDelete: (orden: OrdenProcesamiento) => void;
}

export default function ProcesamientoTable({
  data,
  currentPage,
  totalPages,
  onPageChange,
  onView,
  onEdit,
  onDelete,
}: ProcesamientoTableProps) {
  const columns = [
    { key: "codigo", label: "Código OP", sortable: true, className: "font-medium text-[#0A4174]" },
    {
      key: "fecha",
      label: "Fecha",
      sortable: true,
      render: (op: OrdenProcesamiento) => <span className="text-gray-600">{formatFecha(op.fecha)}</span>,
    },
    {
      key: "producto",
      label: "Producto",
      sortable: true,
      render: (op: OrdenProcesamiento) => (
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#0A4174]/10 text-[#0A4174]">
            <Factory className="h-4 w-4" />
          </div>
          <div>
            <p className="font-medium text-[#111827]">{op.producto}</p>
            <p className="text-xs text-gray-500">{op.lineaProcesamiento}</p>
          </div>
        </div>
      ),
    },
    {
      key: "lotes",
      label: "LP",
      sortable: false,
      render: (op: OrdenProcesamiento) => (
        <div className="flex flex-wrap gap-1">
          {op.lotes.map((lp) => (
            <Badge key={lp} variant="purple">
              {lp}
            </Badge>
          ))}
        </div>
      ),
    },
    {
      key: "pesoEntrada",
      label: "Peso Entrada",
      sortable: false,
      render: (op: OrdenProcesamiento) => (
        <span className="font-medium text-[#111827]">
          {op.pesoEntrada ? formatKg(op.pesoEntrada) : "—"}
        </span>
      ),
    },
    {
      key: "pesoSalida",
      label: "Peso Salida",
      sortable: false,
      render: (op: OrdenProcesamiento) => (
        <span className="font-medium text-[#111827]">
          {op.pesoSalida ? formatKg(op.pesoSalida) : "—"}
        </span>
      ),
    },
    {
      key: "rendimiento",
      label: "Rendimiento",
      sortable: false,
      render: (op: OrdenProcesamiento) => (
        <span className="font-medium text-[#0A4174]">
          {op.rendimiento ? `${op.rendimiento}%` : "—"}
        </span>
      ),
    },
    {
      key: "estado",
      label: "Estado",
      render: (op: OrdenProcesamiento) => <EstadoProcesamientoBadge estado={op.estado} />,
    },
    {
      key: "acciones",
      label: "",
      className: "text-right",
      render: (op: OrdenProcesamiento) => (
        <div className="flex justify-end gap-1">
          {onView && (
            <button
              type="button"
              aria-label={`Ver ${op.codigo}`}
              onClick={() => onView(op)}
              className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-[#0A4174]/10 hover:text-[#0A4174]"
            >
              <Eye className="h-4 w-4" />
            </button>
          )}
          {onEdit && (
            <button
              type="button"
              aria-label={`Editar ${op.codigo}`}
              onClick={() => onEdit(op)}
              className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-[#0A4174]/10 hover:text-[#0A4174]"
            >
              <Pencil className="h-4 w-4" />
            </button>
          )}
          <button
            type="button"
            aria-label={`Eliminar ${op.codigo}`}
            onClick={() => onDelete(op)}
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
      emptyTitle="No hay órdenes de procesamiento"
      emptyDescription="Comienza registrando una nueva orden de procesamiento."
      currentPage={currentPage}
      totalPages={totalPages}
      onPageChange={onPageChange}
    />
  );
}
