import { HardHat, Pencil, Trash2, UserPlus } from "lucide-react";
import type { FormMode } from "../shared/formControls";
import type { ActividadManoObra as Trabajador } from "../../services/actividades";

type ActividadWorkforceProps = {
  trabajadores: Trabajador[];
  mode: FormMode;
  onEdit?: (trabajador: Trabajador) => void;
  onRemove?: (id: string) => void;
};

export function ActividadWorkforce({
  trabajadores,
  mode,
  onEdit,
  onRemove,
}: ActividadWorkforceProps) {
  const editable = mode !== "view";

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-gray-100 bg-gray-50/50">
            <tr>
              {["Trabajador", "Función", "Jornales", "Horas Trabajadas", "Observaciones"].map((encabezado) => (
                <th key={encabezado} className="whitespace-nowrap px-5 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
                  {encabezado}
                </th>
              ))}
              {editable && (
                <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Acciones
                </th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {trabajadores.map((trabajador) => (
              <tr key={trabajador.id} className="transition-colors hover:bg-gray-50/50">
                <td className="whitespace-nowrap px-5 py-3.5 font-medium text-[#111827]">{trabajador.trabajador}</td>
                <td className="whitespace-nowrap px-5 py-3.5">
                  <span className="inline-flex items-center rounded-full bg-forest-50 px-2.5 py-0.5 text-xs font-semibold text-forest-700">
                    {trabajador.funcion}
                  </span>
                </td>
                <td className="px-5 py-3.5 text-[#111827]">{trabajador.jornales}</td>
                <td className="px-5 py-3.5 text-gray-600">{trabajador.horas} h</td>
                <td className="max-w-xs truncate px-5 py-3.5 text-gray-500">{trabajador.observaciones || "—"}</td>
                {editable && (
                  <td className="px-5 py-3.5">
                    <div className="flex justify-end gap-1">
                      <button
                        type="button"
                        aria-label={`Editar trabajador ${trabajador.trabajador}`}
                        onClick={() => onEdit?.(trabajador)}
                        className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-forest-600/10 hover:text-forest-700"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        aria-label={`Eliminar trabajador ${trabajador.trabajador}`}
                        onClick={() => onRemove?.(trabajador.id ?? "")}
                        className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                )}
              </tr>
            ))}

            {trabajadores.length === 0 && (
              <tr>
                <td colSpan={editable ? 6 : 5} className="px-5 py-10">
                  <div className="flex flex-col items-center justify-center gap-2 text-center">
                    <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-gray-100 text-gray-400">
                      <UserPlus className="h-5 w-5" />
                    </span>
                    <p className="text-sm font-medium text-gray-500">
                      {editable ? "Aún no se han agregado trabajadores" : "No se registró mano de obra"}
                    </p>
                    {editable && (
                      <p className="text-xs text-gray-400">
                        Usa el botón "Agregar Trabajador" para registrar el personal que participó.
                      </p>
                    )}
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {editable && (
        <div className="flex items-center justify-between border-t border-gray-100 bg-gray-50/50 px-5 py-2.5">
          <span className="flex items-center gap-1.5 text-xs text-gray-500">
            <HardHat className="h-3.5 w-3.5 text-forest-600" />
            Mano de obra registrada: {trabajadores.length} trabajador(es)
          </span>
        </div>
      )}
    </div>
  );
}
