import { PackagePlus, Pencil, Trash2 } from "lucide-react";
import type { FormMode } from "../shared/formControls";
import type { Insumo } from "../../pages/actividades/actividadMock";

type ActividadProductsProps = {
  insumos: Insumo[];
  mode: FormMode;
  onEdit?: (insumo: Insumo) => void;
  onRemove?: (id: string) => void;
};

export function ActividadProducts({ insumos, mode, onEdit, onRemove }: ActividadProductsProps) {
  const editable = mode !== "view";

  const encabezados = ["Producto", "Categoría", "Fabricante", "Cantidad", "Unidad", "Lote", "Costo Unitario", "Costo Total", "Observaciones"];

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-gray-100 bg-gray-50/50">
            <tr>
              {encabezados.map((encabezado) => (
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
            {insumos.map((insumo) => (
              <tr key={insumo.id} className="transition-colors hover:bg-gray-50/50">
                <td className="whitespace-nowrap px-5 py-3.5 font-medium text-[#111827]">{insumo.producto}</td>
                <td className="whitespace-nowrap px-5 py-3.5 text-gray-600">
                  <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-600">
                    {insumo.categoria || "—"}
                  </span>
                </td>
                <td className="whitespace-nowrap px-5 py-3.5 text-gray-600">{insumo.fabricante || "—"}</td>
                <td className="px-5 py-3.5 text-[#111827]">{insumo.cantidad}</td>
                <td className="px-5 py-3.5 text-gray-600">{insumo.unidad}</td>
                <td className="px-5 py-3.5 text-gray-600">
                  <span className="inline-flex items-center rounded-full bg-forest-50 px-2.5 py-0.5 text-xs font-semibold text-forest-700">
                    {insumo.lote || "—"}
                  </span>
                </td>
                <td className="whitespace-nowrap px-5 py-3.5 text-gray-600">{insumo.costoUnitario || "—"}</td>
                <td className="whitespace-nowrap px-5 py-3.5 font-semibold text-[#111827]">{insumo.costoTotal || "—"}</td>
                <td className="max-w-xs truncate px-5 py-3.5 text-gray-500">{insumo.observaciones || "—"}</td>
                {editable && (
                  <td className="px-5 py-3.5">
                    <div className="flex justify-end gap-1">
                      <button
                        type="button"
                        aria-label={`Editar insumo ${insumo.producto}`}
                        onClick={() => onEdit?.(insumo)}
                        className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-forest-600/10 hover:text-forest-700"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        aria-label={`Eliminar insumo ${insumo.producto}`}
                        onClick={() => onRemove?.(insumo.id)}
                        className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                )}
              </tr>
            ))}

            {insumos.length === 0 && (
              <tr>
                <td colSpan={editable ? encabezados.length + 1 : encabezados.length} className="px-5 py-10">
                  <div className="flex flex-col items-center justify-center gap-2 text-center">
                    <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-gray-100 text-gray-400">
                      <PackagePlus className="h-5 w-5" />
                    </span>
                    <p className="text-sm font-medium text-gray-500">
                      {editable ? "Aún no se han agregado insumos" : "No se registraron insumos"}
                    </p>
                    {editable && (
                      <p className="text-xs text-gray-400">
                        Usa el botón "Agregar Insumo" para registrar un producto utilizado.
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
