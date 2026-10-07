import { useState } from "react";
import { CheckSquare, Plus, GripVertical, X } from "lucide-react";
import { Button, Select } from "../ui";
import { CardHeader, CardShell, type FormMode } from "../shared/formControls";
import type { OperacionProceso } from "../../services/ordenes";

export interface OperacionSeleccionada {
  operacion_id: number;
  orden: number;
  nombre: string;
  codigo: string;
}

interface OperacionesChecklistProps {
  mode: FormMode;
  seleccionadas: OperacionSeleccionada[];
  catalogo: OperacionProceso[];
  onChange: (seleccion: OperacionSeleccionada[]) => void;
}

export function OperacionesChecklist({ mode, seleccionadas, catalogo, onChange }: OperacionesChecklistProps) {
  const [nuevaOperacionId, setNuevaOperacionId] = useState<string>("");
  const editable = mode !== "view";

  const idsSeleccionados = new Set(seleccionadas.map((s) => s.operacion_id));
  const disponibles = catalogo.filter((op) => !idsSeleccionados.has(op.id));

  const toggle = (op: OperacionProceso) => {
    if (!editable) return;
    if (idsSeleccionados.has(op.id)) {
      onChange(seleccionadas.filter((s) => s.operacion_id !== op.id));
    } else {
      onChange([
        ...seleccionadas,
        { operacion_id: op.id, orden: seleccionadas.length + 1, nombre: op.nombre, codigo: op.codigo },
      ]);
    }
  };

  const quitar = (operacionId: number) => {
    if (!editable) return;
    onChange(seleccionadas.filter((s) => s.operacion_id !== operacionId));
  };

  const mover = (index: number, direccion: -1 | 1) => {
    if (!editable) return;
    const nuevo = [...seleccionadas];
    const destino = index + direccion;
    if (destino < 0 || destino >= nuevo.length) return;
    [nuevo[index], nuevo[destino]] = [nuevo[destino], nuevo[index]];
    onChange(nuevo.map((s, i) => ({ ...s, orden: i + 1 })));
  };

  const agregarDelCatalogo = () => {
    if (!editable || !nuevaOperacionId) return;
    const op = catalogo.find((o) => o.id === Number(nuevaOperacionId));
    if (!op) return;
    onChange([
      ...seleccionadas,
      { operacion_id: op.id, orden: seleccionadas.length + 1, nombre: op.nombre, codigo: op.codigo },
    ]);
    setNuevaOperacionId("");
  };

  return (
    <CardShell>
      <CardHeader
        icon={<CheckSquare size={20} />}
        title="Procesos a aplicar"
        description={`${seleccionadas.length} operación${seleccionadas.length === 1 ? "" : "es"} seleccionada${seleccionadas.length === 1 ? "" : "s"}`}
      />

      {seleccionadas.length === 0 ? (
        <p className="py-4 text-center text-sm text-gray-500">
          No hay operaciones seleccionadas. Marca las que aplican al producto.
        </p>
      ) : (
        <ul className="divide-y divide-gray-100">
          {seleccionadas.map((s, index) => (
            <li key={s.operacion_id} className="flex items-center gap-3 py-2.5">
              <button
                type="button"
                onClick={() => { const op = catalogo.find((c) => c.id === s.operacion_id); if (op) toggle(op); }}
                disabled={!editable}
                className="shrink-0 text-forest-600 disabled:opacity-50"
                aria-label="Quitar operación"
              >
                <CheckSquare className="h-5 w-5" />
              </button>

              {editable && (
                <div className="flex shrink-0 flex-col">
                  <button
                    type="button"
                    onClick={() => mover(index, -1)}
                    disabled={index === 0}
                    className="text-gray-300 hover:text-gray-500 disabled:opacity-30"
                    aria-label="Subir"
                  >
                    <GripVertical className="h-3 w-3 rotate-180" />
                  </button>
                  <button
                    type="button"
                    onClick={() => mover(index, 1)}
                    disabled={index === seleccionadas.length - 1}
                    className="text-gray-300 hover:text-gray-500 disabled:opacity-30"
                    aria-label="Bajar"
                  >
                    <GripVertical className="h-3 w-3" />
                  </button>
                </div>
              )}

              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-[#111827]">
                  <span className="mr-2 text-xs text-gray-400">{index + 1}.</span>
                  {s.nombre}
                </p>
                <p className="text-xs text-gray-500">{s.codigo}</p>
              </div>

              {editable && (
                <button
                  type="button"
                  onClick={() => quitar(s.operacion_id)}
                  className="shrink-0 rounded-lg p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-600"
                  aria-label="Eliminar"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </li>
          ))}
        </ul>
      )}

      {editable && (
        <div className="mt-4 flex items-end gap-2 border-t border-gray-100 pt-4">
          <div className="flex-1">
            <Select
              options={disponibles.map((op) => ({ value: String(op.id), label: `${op.nombre} (${op.codigo})` }))}
              placeholder="Añadir operación del catálogo..."
              value={nuevaOperacionId}
              onChange={setNuevaOperacionId}
            />
          </div>
          <Button
            variant="secondary"
            onClick={agregarDelCatalogo}
            disabled={!nuevaOperacionId}
            iconLeft={<Plus className="h-4 w-4" />}
          >
            Añadir
          </Button>
        </div>
      )}

      {catalogo.length === 0 && (
        <p className="mt-2 text-xs text-amber-600">
          No hay operaciones en el catálogo. Añádelas en el módulo de catálogos.
        </p>
      )}
    </CardShell>
  );
}
