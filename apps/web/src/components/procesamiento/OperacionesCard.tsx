import { Settings } from "lucide-react";
import { Textarea } from "../ui";
import { CardHeader, CardShell, type FormMode } from "../shared/formControls";
import { EstadoOperacionBadge } from "./badges";
import { type Operacion, type OrdenProcesamiento } from "../../services/procesamientos";

type OperacionesCardProps = {
  mode: FormMode;
  values?: Partial<OrdenProcesamiento>;
};

export function OperacionesCard({ mode, values }: OperacionesCardProps) {
  const editable = mode !== "view";
  const operaciones: Operacion[] = values?.operaciones ?? [];

  return (
    <CardShell>
      <CardHeader
        icon={<Settings size={20} />}
        title="Operaciones del Proceso"
        description="Flujo de operaciones del procesamiento de la materia prima"
      />

      {operaciones.length === 0 ? (
        <div className="rounded-xl border-2 border-dashed border-gray-200 bg-gray-50/50 p-10 text-center">
          <Settings className="mx-auto mb-3 h-8 w-8 text-gray-300" />
          <p className="text-sm font-medium text-gray-500">No hay operaciones definidas</p>
          <p className="mt-1 text-xs text-gray-400">
            Las operaciones se definirán al iniciar el procesamiento.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {operaciones.map((op, idx) => (
            <div
              key={op.nombre}
              className="rounded-xl border border-gray-200 bg-gray-50/50 p-5 transition-colors hover:bg-gray-50"
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-forest-600/10 text-forest-600">
                    <span className="text-sm font-bold">{idx + 1}</span>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-[#111827]">{op.nombre}</h4>
                    {op.responsable && (
                      <p className="text-xs text-gray-500">Responsable: {op.responsable}</p>
                    )}
                  </div>
                </div>
                <EstadoOperacionBadge estado={op.estado} />
              </div>

              {editable ? (
                <div className="mt-4">
                  <label className="mb-1 block text-xs font-medium text-gray-500">Observaciones</label>
                  <Textarea
                    rows={2}
                    placeholder="Observaciones de la operación..."
                    defaultValue={op.observaciones}
                  />
                </div>
              ) : (
                op.observaciones && (
                  <div className="mt-3 rounded-lg border border-gray-200 bg-white p-3">
                    <p className="text-xs font-medium text-gray-500">Observaciones</p>
                    <p className="mt-1 text-sm text-[#111827]">{op.observaciones}</p>
                  </div>
                )
              )}

              {idx < operaciones.length - 1 && (
                <div className="mt-4 flex justify-center">
                  <div className="h-6 w-px bg-gray-300" />
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </CardShell>
  );
}
