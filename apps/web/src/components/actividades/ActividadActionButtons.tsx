import { Eye, Pencil, Trash2 } from "lucide-react";
import type { Actividad } from "../../services/actividades";

type ActividadActionButtonsProps = {
  actividad: Actividad;
  onView: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
};

const baseClass = "rounded-lg p-1.5 text-gray-400 transition-colors";
const normalClass = `${baseClass} hover:bg-forest-600/10 hover:text-forest-700`;
const dangerClass = `${baseClass} hover:bg-red-50 hover:text-red-600`;

export function ActividadActionButtons({
  actividad,
  onView,
  onEdit,
  onDelete,
}: ActividadActionButtonsProps) {
  return (
    <div className="flex justify-end gap-1">
      <button
        type="button"
        aria-label={`Ver ${actividad.codigo}`}
        onClick={() => onView(actividad.id)}
        className={normalClass}
      >
        <Eye className="h-4 w-4" />
      </button>
      <button
        type="button"
        aria-label={`Editar ${actividad.codigo}`}
        onClick={() => onEdit(actividad.id)}
        className={normalClass}
      >
        <Pencil className="h-4 w-4" />
      </button>
      <button
        type="button"
        aria-label={`Eliminar ${actividad.codigo}`}
        onClick={() => onDelete(actividad.id)}
        className={dangerClass}
      >
        <Trash2 className="h-4 w-4" />
      </button>
    </div>
  );
}
