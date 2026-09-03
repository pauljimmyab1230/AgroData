import { Pencil, Tractor, Trash2 } from "lucide-react";
import type { FormMode } from "../shared/formControls";
import type { ActividadMaquinaria as Equipo } from "../../services/actividades";

type ActividadEquipmentProps = {
  equipos: Equipo[];
  mode: FormMode;
  onEdit?: (equipo: Equipo) => void;
  onRemove?: (id: string) => void;
};

export function ActividadEquipment({ equipos, mode, onEdit, onRemove }: ActividadEquipmentProps) {
  const editable = mode !== "view";

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-gray-100 bg-gray-50/50">
            <tr>
              <th className="whitespace-nowrap px-3 py-2.5 text-xs font-semibold uppercase tracking-wider text-gray-500">Equipo</th>
              <th className="whitespace-nowrap px-3 py-2.5 text-xs font-semibold uppercase tracking-wider text-gray-500">Operador</th>
              <th className="whitespace-nowrap px-3 py-2.5 text-xs font-semibold uppercase tracking-wider text-gray-500">Horas</th>
              <th className="whitespace-nowrap px-3 py-2.5 text-xs font-semibold uppercase tracking-wider text-gray-500">Combustible</th>
              {editable && (
                <th className="px-3 py-2.5 text-right text-xs font-semibold uppercase tracking-wider text-gray-500">Acciones</th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {equipos.map((equipo) => (
              <tr key={equipo.id} className="transition-colors hover:bg-gray-50/50">
                <td className="max-w-[180px] truncate px-3 py-2.5 font-medium text-[#111827]">{equipo.equipo}</td>
                <td className="max-w-[140px] truncate whitespace-nowrap px-3 py-2.5 text-gray-600">{equipo.operador || "—"}</td>
                <td className="px-3 py-2.5 text-[#111827]">{equipo.horasUso ?? "—"}</td>
                <td className="px-3 py-2.5">
                  <span className="inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600">
                    {equipo.combustible || "—"}
                  </span>
                </td>
                {editable && (
                  <td className="px-3 py-2.5">
                    <div className="flex justify-end gap-1">
                      <button
                        type="button"
                        aria-label={`Editar equipo ${equipo.equipo}`}
                        onClick={() => onEdit?.(equipo)}
                        className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-forest-600/10 hover:text-forest-700"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </button>
                      <button
                        type="button"
                        aria-label={`Eliminar equipo ${equipo.equipo}`}
                        onClick={() => onRemove?.(equipo.id ?? "")}
                        className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-600"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </td>
                )}
              </tr>
            ))}

            {equipos.length === 0 && (
              <tr>
                <td colSpan={editable ? 5 : 4} className="px-3 py-8">
                  <div className="flex flex-col items-center justify-center gap-2 text-center">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100 text-gray-400">
                      <Tractor className="h-5 w-5" />
                    </span>
                    <p className="text-sm font-medium text-gray-500">
                      {editable ? "Aún no se han agregado equipos" : "No se registró maquinaria"}
                    </p>
                    {editable && (
                      <p className="text-xs text-gray-400">
                        Usa el botón "Agregar Equipo" para registrar la maquinaria utilizada.
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
