import { CalendarDays } from "lucide-react";
import { DataTable } from "../ui";
import { CampaniaActions } from "./CampaniaActions";
import { CampaniaEstadoBadge } from "./CampaniaEstadoBadge";
import type { Campania } from "../../services/campanias";

const formatFecha = (fecha: string) => {
  if (!fecha) return "—";
  const [y, m, d] = fecha.split("-").map(Number);
  const meses = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];
  return `${d} ${meses[m - 1]} ${y}`;
};

type CampaniaTableProps = {
  data: Campania[];
  onView: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  currentPage?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
};

export function CampaniaTable({
  data,
  onView,
  onEdit,
  onDelete,
  currentPage,
  totalPages,
  onPageChange,
}: CampaniaTableProps) {
  const columns = [
    { key: "codigo", label: "Código", sortable: true, className: "font-medium text-forest-700" },
    {
      key: "nombre",
      label: "Nombre",
      sortable: true,
      render: (campania: Campania) => (
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-forest-600/10 text-forest-600">
            <CalendarDays className="h-4 w-4" />
          </div>
          <span className="font-medium text-[#111827]">{campania.nombre}</span>
        </div>
      ),
    },
    { key: "anioAgricola", label: "Año Agrícola", sortable: true },
    { key: "fechaInicio", label: "Fecha Inicio", render: (c: Campania) => formatFecha(c.fechaInicio) },
    { key: "fechaFin", label: "Fecha Fin", render: (c: Campania) => formatFecha(c.fechaFin) },
    { key: "estado", label: "Estado", sortable: true, render: (c: Campania) => <CampaniaEstadoBadge estado={c.estado} /> },
    {
      key: "acciones",
      label: "",
      className: "text-right",
      render: (c: Campania) => (
        <CampaniaActions campania={c} onView={onView} onEdit={onEdit} onDelete={onDelete} />
      ),
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={data}
      keyField="id"
      emptyTitle="No hay campañas registradas"
      emptyDescription="Comienza registrando la primera campaña de la cooperativa."
      emptyActionLabel="Nueva Campaña"
      emptyActionTo="/campanias/nueva"
      currentPage={currentPage}
      totalPages={totalPages}
      onPageChange={onPageChange}
    />
  );
}
