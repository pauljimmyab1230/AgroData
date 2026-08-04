import { useNavigate } from "react-router-dom";
import { Eye, Pencil, Trash2, Factory } from "lucide-react";
import { Badge, DataTable } from "../ui";
import { EstadoProcesamientoBadge } from "./badges";
import { formatFecha, formatKg, type OrdenProcesamiento } from "../../pages/procesamiento/procesamientoMock";

interface ProcesamientoTableProps {
  data: OrdenProcesamiento[];
  currentPage?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
  onDelete: (orden: OrdenProcesamiento) => void;
}

export default function ProcesamientoTable({
  data,
  currentPage,
  totalPages,
  onPageChange,
  onDelete,
}: ProcesamientoTableProps) {
  const navigate = useNavigate();

  const columns = [
    { key: "codigo", label: "Código OP", sortable: true, className: "font-medium text-forest-700" },
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
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-forest-600/10 text-forest-700">
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
      key: "lotesProductor",
      label: "LP",
      sortable: false,
      render: (op: OrdenProcesamiento) => (
        <div className="flex flex-wrap gap-1">
          {op.lotesProductor.map((lp) => (
            <Badge key={lp.loteProductor} variant="purple">
              {lp.loteProductor}
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
          {op.resultado ? formatKg(op.resultado.pesoEntrada) : "—"}
        </span>
      ),
    },
    {
      key: "pesoSalida",
      label: "Peso Salida",
      sortable: false,
      render: (op: OrdenProcesamiento) => (
        <span className="font-medium text-[#111827]">
          {op.resultado ? formatKg(op.resultado.pesoSalida) : "—"}
        </span>
      ),
    },
    {
      key: "rendimiento",
      label: "Rendimiento",
      sortable: false,
      render: (op: OrdenProcesamiento) => (
        <span className="font-medium text-forest-700">
          {op.resultado ? `${op.resultado.rendimiento}%` : "—"}
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
          <button
            type="button"
            aria-label={`Ver ${op.codigo}`}
            onClick={() => navigate(`/procesamiento/${op.id}`)}
            className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-forest-600/10 hover:text-forest-700"
          >
            <Eye className="h-4 w-4" />
          </button>
          <button
            type="button"
            aria-label={`Editar ${op.codigo}`}
            onClick={() => navigate(`/procesamiento/${op.id}/editar`)}
            className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-forest-600/10 hover:text-forest-700"
          >
            <Pencil className="h-4 w-4" />
          </button>
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
      emptyDescription="Comienza registrando la primera orden de procesamiento."
      emptyActionLabel="Nueva Orden"
      emptyActionTo="/procesamiento/nuevo"
      currentPage={currentPage}
      totalPages={totalPages}
      onPageChange={onPageChange}
    />
  );
}
