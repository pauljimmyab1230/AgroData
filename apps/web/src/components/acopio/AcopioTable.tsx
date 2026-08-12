import { useNavigate } from "react-router-dom";
import { Eye, Pencil, Trash2, UserRound } from "lucide-react";
import { Badge, DataTable } from "../ui";
import { EstadoAcopioBadge } from "./badges";
import { formatFecha, formatKg, type AcopioView } from "../../services/acopios";

interface AcopioTableProps {
  data: AcopioView[];
  currentPage?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
  onDelete: (acopio: AcopioView) => void;
}

export default function AcopioTable({
  data,
  currentPage,
  totalPages,
  onPageChange,
  onDelete,
}: AcopioTableProps) {
  const navigate = useNavigate();

  const columns = [
    { key: "codigo", label: "Código", sortable: true, className: "font-medium text-forest-700" },
    {
      key: "fecha",
      label: "Fecha",
      sortable: true,
      render: (acopio: Acopio) => <span className="text-gray-600">{formatFecha(acopio.fecha)}</span>,
    },
    {
      key: "productor",
      label: "Productor",
      render: (acopio: Acopio) => (
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-forest-600/10 text-forest-700">
            <UserRound className="h-4 w-4" />
          </div>
          <div>
            <p className="font-medium text-[#111827]">{acopio.productor}</p>
            <p className="text-xs text-gray-500">{acopio.cultivo}</p>
          </div>
        </div>
      ),
    },
    { key: "comunidad", label: "Comunidad" },
    {
      key: "totalSacos",
      label: "Sacos",
      sortable: true,
      render: (acopio: Acopio) => <Badge variant="gray">{acopio.totalSacos}</Badge>,
    },
    {
      key: "pesoTotal",
      label: "Peso Total",
      sortable: true,
      render: (acopio: Acopio) => <span className="font-medium text-[#111827]">{formatKg(acopio.pesoTotal)}</span>,
    },
    { key: "acopiador", label: "Acopiador" },
    {
      key: "estado",
      label: "Estado",
      render: (acopio: Acopio) => <EstadoAcopioBadge estado={acopio.estado} />,
    },
    {
      key: "acciones",
      label: "",
      className: "text-right",
      render: (acopio: Acopio) => (
        <div className="flex justify-end gap-1">
          <button
            type="button"
            aria-label={`Ver ${acopio.codigo}`}
            onClick={() => navigate(`/acopio/${acopio.id}`)}
            className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-forest-600/10 hover:text-forest-700"
          >
            <Eye className="h-4 w-4" />
          </button>
          <button
            type="button"
            aria-label={`Editar ${acopio.codigo}`}
            onClick={() => navigate(`/acopio/${acopio.id}/editar`)}
            className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-forest-600/10 hover:text-forest-700"
          >
            <Pencil className="h-4 w-4" />
          </button>
          <button
            type="button"
            aria-label={`Eliminar ${acopio.codigo}`}
            onClick={() => onDelete(acopio)}
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
