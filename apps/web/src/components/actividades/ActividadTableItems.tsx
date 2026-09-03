import { Pencil, Trash2, Wrench } from "lucide-react";
import type { FormMode } from "../shared/formControls";
import { tipoActividadLabels, prioridadLabels } from "../../services/actividades";

export type ActividadItem = {
  id: string;
  tipoActividad: string;
  horaInicio: string;
  horaFin: string;
  duracionEstimada: string;
  prioridad: string;
  descripcion: string;
};

type ActividadTableProps = {
  items: ActividadItem[];
  mode: FormMode;
  onEdit?: (item: ActividadItem) => void;
  onRemove?: (id: string) => void;
};

export function ActividadTable({ items, mode, onEdit, onRemove }: ActividadTableProps) {
  const editable = mode !== "view";

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-gray-100 bg-gray-50/50">
            <tr>
              <th className="whitespace-nowrap px-3 py-2.5 text-xs font-semibold uppercase tracking-wider text-gray-500">Tipo</th>
              <th className="whitespace-nowrap px-3 py-2.5 text-xs font-semibold uppercase tracking-wider text-gray-500">Horario</th>
              <th className="whitespace-nowrap px-3 py-2.5 text-xs font-semibold uppercase tracking-wider text-gray-500">Duración</th>
              <th className="whitespace-nowrap px-3 py-2.5 text-xs font-semibold uppercase tracking-wider text-gray-500">Prioridad</th>
              <th className="px-3 py-2.5 text-xs font-semibold uppercase tracking-wider text-gray-500">Descripción</th>
              {editable && (
                <th className="px-3 py-2.5 text-right text-xs font-semibold uppercase tracking-wider text-gray-500">Acciones</th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {items.map((item) => (
              <tr key={item.id} className="transition-colors hover:bg-gray-50/50">
                <td className="whitespace-nowrap px-3 py-2.5 font-medium text-[#111827]">
                  {(tipoActividadLabels[item.tipoActividad] ?? item.tipoActividad) || "—"}
                </td>
                <td className="whitespace-nowrap px-3 py-2.5 text-gray-600">
                  {item.horaInicio || "—"}{item.horaFin ? ` - ${item.horaFin}` : ""}
                </td>
                <td className="whitespace-nowrap px-3 py-2.5 text-gray-600">{item.duracionEstimada || "—"}</td>
                <td className="whitespace-nowrap px-3 py-2.5">
                  <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold ${
                    item.prioridad === "ALTA" ? "bg-red-50 text-red-700" :
                    item.prioridad === "BAJA" ? "bg-gray-100 text-gray-600" :
                    "bg-yellow-50 text-yellow-700"
                  }`}>
                    {(prioridadLabels[item.prioridad] ?? item.prioridad) || "—"}
                  </span>
                </td>
                <td className="max-w-[200px] truncate px-3 py-2.5 text-gray-500">{item.descripcion || "—"}</td>
                {editable && (
                  <td className="px-3 py-2.5">
                    <div className="flex justify-end gap-1">
                      <button
                        type="button"
                        aria-label="Editar actividad"
                        onClick={() => onEdit?.(item)}
                        className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-forest-600/10 hover:text-forest-700"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </button>
                      <button
                        type="button"
                        aria-label="Eliminar actividad"
                        onClick={() => onRemove?.(item.id)}
                        className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-600"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </td>
                )}
              </tr>
            ))}

            {items.length === 0 && (
              <tr>
                <td colSpan={editable ? 6 : 5} className="px-3 py-8">
                  <div className="flex flex-col items-center justify-center gap-2 text-center">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100 text-gray-400">
                      <Wrench className="h-5 w-5" />
                    </span>
                    <p className="text-sm font-medium text-gray-500">
                      {editable ? "Aún no se han registrado actividades" : "No se registraron actividades"}
                    </p>
                    {editable && (
                      <p className="text-xs text-gray-400">
                        Usa el botón "Agregar Actividad" para registrar una labor.
                      </p>
                    )}
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
