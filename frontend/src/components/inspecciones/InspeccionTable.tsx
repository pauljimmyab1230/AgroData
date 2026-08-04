import { useNavigate } from "react-router-dom";
import { Eye, Pencil, SearchCheck, Trash2 } from "lucide-react";
import { DataTable } from "../ui";
import { EstadoBadge, ResultadoBadge } from "./badges";
import { formatFecha, type Inspeccion } from "../../pages/inspecciones/inspeccionMock";

interface InspeccionTableProps {
  data: Inspeccion[];
  currentPage?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
  onDelete: (inspeccion: Inspeccion) => void;
}

export default function InspeccionTable({
  data,
  currentPage,
  totalPages,
  onPageChange,
  onDelete,
}: InspeccionTableProps) {
  const navigate = useNavigate();

  const columns = [
    { key: "codigo", label: "Código", sortable: true, className: "font-medium text-forest-700" },
    {
      key: "fecha",
      label: "Fecha",
      sortable: true,
      render: (inspeccion: Inspeccion) => (
        <span className="text-gray-600">{formatFecha(inspeccion.fecha)}</span>
      ),
    },
    {
      key: "productor",
      label: "Productor",
      render: (inspeccion: Inspeccion) => (
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-forest-600/10 text-forest-700">
            <SearchCheck className="h-4 w-4" />
          </div>
          <div>
            <p className="font-medium text-[#111827]">{inspeccion.productor}</p>
            <p className="text-xs text-gray-500">{inspeccion.cultivo}</p>
          </div>
        </div>
      ),
    },
    { key: "parcela", label: "Parcela" },
    { key: "inspector", label: "Inspector" },
    {
      key: "estado",
      label: "Estado",
      render: (inspeccion: Inspeccion) => <EstadoBadge estado={inspeccion.estado} />,
    },
    {
      key: "resultado",
      label: "Resultado",
      render: (inspeccion: Inspeccion) => <ResultadoBadge resultado={inspeccion.resultado} />,
    },
    {
      key: "acciones",
      label: "",
      className: "text-right",
      render: (inspeccion: Inspeccion) => (
        <div className="flex justify-end gap-1">
          <button
            type="button"
            aria-label={`Ver ${inspeccion.codigo}`}
            onClick={() => navigate(`/inspecciones/${inspeccion.id}`)}
            className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-forest-600/10 hover:text-forest-700"
          >
            <Eye className="h-4 w-4" />
          </button>
          <button
            type="button"
            aria-label={`Editar ${inspeccion.codigo}`}
            onClick={() => navigate(`/inspecciones/${inspeccion.id}/editar`)}
            className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-forest-600/10 hover:text-forest-700"
          >
            <Pencil className="h-4 w-4" />
          </button>
          <button
            type="button"
            aria-label={`Eliminar ${inspeccion.codigo}`}
            onClick={() => onDelete(inspeccion)}
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
      emptyTitle="No hay inspecciones registradas"
      emptyDescription="Comienza registrando la primera inspección de campo de la cooperativa."
      emptyActionLabel="Nueva Inspección"
      emptyActionTo="/inspecciones/nueva"
      currentPage={currentPage}
      totalPages={totalPages}
      onPageChange={onPageChange}
    />
  );
}
