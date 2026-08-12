import { ClipboardList } from "lucide-react";
import { DataTable } from "../ui";
import { ActividadActionButtons } from "./ActividadActionButtons";
import { formatearFecha, tipoActividadLabels, type Actividad } from "../../services/actividades";

type ActividadTableProps = {
  data: Actividad[];
  onView: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  currentPage?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
};

export function ActividadTable({
  data,
  onView,
  onEdit,
  onDelete,
  currentPage,
  totalPages,
  onPageChange,
}: ActividadTableProps) {
  const columns = [
    { key: "codigo", label: "Código", sortable: true, className: "font-medium text-forest-700" },
    { key: "fecha", label: "Fecha", sortable: true, render: (a: Actividad) => formatearFecha(a.fecha) },
    { key: "productorNombre", label: "Productor", sortable: true },
    { key: "parcelaNombre", label: "Parcela", sortable: true },
    { key: "cultivoNombre", label: "Cultivo", sortable: true },
    {
      key: "tipoActividad",
      label: "Actividad",
      sortable: true,
      render: (a: Actividad) => (
        <div className="flex items-center gap-2">
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-forest-600/10 text-forest-600">
            <ClipboardList className="h-3.5 w-3.5" />
          </span>
          <span className="font-medium text-[#111827]">{tipoActividadLabels[a.tipoActividad] ?? a.tipoActividad}</span>
        </div>
      ),
    },
    { key: "responsableTecnico", label: "Responsable", sortable: true },
    {
      key: "acciones",
      label: "",
      className: "text-right",
      render: (a: Actividad) => (
        <ActividadActionButtons actividad={a} onView={onView} onEdit={onEdit} onDelete={onDelete} />
      ),
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={data}
      keyField="id"
      emptyTitle="No hay actividades registradas"
      emptyDescription="Comienza registrando la primera actividad agrícola de la campaña."
      emptyActionLabel="Nueva Actividad"
      emptyActionTo="/actividades/nueva"
      currentPage={currentPage}
      totalPages={totalPages}
      onPageChange={onPageChange}
    />
  );
}
