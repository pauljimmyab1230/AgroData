import { useNavigate } from "react-router-dom";
import { Eye, Pencil, Trash2, UserRound } from "lucide-react";
import { Badge, DataTable } from "../ui";
import { EstadoRecepcionBadge } from "./badges";
import { type Recepcion, formatearFecha, formatearPeso } from "../../services/recepciones";

interface RecepcionTableProps {
  data: Recepcion[];
  currentPage?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
  onDelete: (recepcion: Recepcion) => void;
}

export default function RecepcionTable({
  data,
  currentPage,
  totalPages,
  onPageChange,
  onDelete,
}: RecepcionTableProps) {
  const navigate = useNavigate();

  const columns = [
    { key: "codigo", label: "Código", sortable: true, className: "font-medium text-forest-700" },
    {
      key: "fecha",
      label: "Fecha",
      sortable: true,
      render: (recepcion: Recepcion) => (
        <span className="text-gray-600">{formatearFecha(recepcion.fecha)}</span>
      ),
    },
    {
      key: "loteProductor",
      label: "LP",
      sortable: true,
      render: (recepcion: Recepcion) => <Badge variant="purple">{recepcion.loteProductor}</Badge>,
    },
    {
      key: "campaniaNombre",
      label: "Campaña",
      render: (recepcion: Recepcion) => (
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-forest-600/10 text-forest-700">
            <UserRound className="h-4 w-4" />
          </div>
          <div>
            <p className="font-medium text-[#111827]">{recepcion.campaniaNombre || "—"}</p>
            <p className="text-xs text-gray-500">{recepcion.acopioCodigo}</p>
          </div>
        </div>
      ),
    },
    {
      key: "pesoCampo",
      label: "Peso Campo",
      sortable: true,
      render: (recepcion: Recepcion) => (
        <span className="font-medium text-[#111827]">{formatearPeso(recepcion.pesoCampo)}</span>
      ),
    },
    {
      key: "pesoNeto",
      label: "Peso Planta",
      sortable: true,
      render: (recepcion: Recepcion) => (
        <span className="font-medium text-[#111827]">{formatearPeso(recepcion.pesoNeto)}</span>
      ),
    },
    {
      key: "estado",
      label: "Estado",
      render: (recepcion: Recepcion) => <EstadoRecepcionBadge estado={recepcion.estado} />,
    },
    {
      key: "acciones",
      label: "",
      className: "text-right",
      render: (recepcion: Recepcion) => (
        <div className="flex justify-end gap-1">
          <button
            type="button"
            aria-label={`Ver ${recepcion.codigo}`}
            onClick={() => navigate(`/recepcion/${recepcion.id}`)}
            className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-forest-600/10 hover:text-forest-700"
          >
            <Eye className="h-4 w-4" />
          </button>
          <button
            type="button"
            aria-label={`Editar ${recepcion.codigo}`}
            onClick={() => navigate(`/recepcion/${recepcion.id}/editar`)}
            className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-forest-600/10 hover:text-forest-700"
          >
            <Pencil className="h-4 w-4" />
          </button>
          <button
            type="button"
            aria-label={`Eliminar ${recepcion.codigo}`}
            onClick={() => onDelete(recepcion)}
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
      emptyTitle="No hay recepciones registradas"
      emptyDescription="Comienza registrando la primera recepción de materia prima en la planta."
      emptyActionLabel="Nueva Recepción"
      emptyActionTo="/recepcion/nuevo"
      currentPage={currentPage}
      totalPages={totalPages}
      onPageChange={onPageChange}
    />
  );
}
