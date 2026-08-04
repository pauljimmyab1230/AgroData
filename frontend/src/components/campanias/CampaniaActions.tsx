import { Eye, Pencil, Trash2 } from "lucide-react";
import type { Campania } from "../../pages/campañas/campaniaMock";

type CampaniaActionsProps = {
  campania: Campania;
  onView: (id: number) => void;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
};

const baseClass = "rounded-lg p-1.5 text-gray-400 transition-colors";
const normalClass = `${baseClass} hover:bg-forest-600/10 hover:text-forest-700`;
const dangerClass = `${baseClass} hover:bg-red-50 hover:text-red-600`;

export function CampaniaActions({ campania, onView, onEdit, onDelete }: CampaniaActionsProps) {
  return (
    <div className="flex justify-end gap-1">
      <button
        type="button"
        aria-label={`Ver ${campania.nombre}`}
        onClick={() => onView(campania.id)}
        className={normalClass}
      >
        <Eye className="h-4 w-4" />
      </button>
      <button
        type="button"
        aria-label={`Editar ${campania.nombre}`}
        onClick={() => onEdit(campania.id)}
        className={normalClass}
      >
        <Pencil className="h-4 w-4" />
      </button>
      <button
        type="button"
        aria-label={`Eliminar ${campania.nombre}`}
        onClick={() => onDelete(campania.id)}
        className={dangerClass}
      >
        <Trash2 className="h-4 w-4" />
      </button>
    </div>
  );
}
