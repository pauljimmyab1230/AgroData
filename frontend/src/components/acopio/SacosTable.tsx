import { useRef, useState } from "react";
import { Plus, Trash2, Weight } from "lucide-react";
import { Button, EmptyState, Input } from "../ui";
import { CardHeader, CardShell, type FormMode } from "../shared/formControls";
import { formatKg, type Saco } from "../../pages/acopio/acopioMock";

type SacosTableProps = {
  mode: FormMode;
  sacos?: Saco[];
};

export default function SacosTable({ mode, sacos }: SacosTableProps) {
  const editable = mode !== "view";
  const [items, setItems] = useState<Saco[]>(sacos ?? []);
  const nextNumRef = useRef((sacos?.length ?? 0) + 1);

  const addSaco = () => {
    const n = nextNumRef.current++;
    setItems((prev) => [
      ...prev,
      { id: n, codigo: `SAC-${String(n).padStart(3, "0")}`, peso: 0, observaciones: "" },
    ]);
  };

  const removeSaco = (id: number) => setItems((prev) => prev.filter((saco) => saco.id !== id));

  return (
    <CardShell>
      <CardHeader
        icon={<Weight size={20} />}
        title="Registro de Sacos"
        description="Detalle de los sacos recepcionados con su peso individual"
        actions={
          editable ? (
            <Button variant="secondary" size="sm" onClick={addSaco} iconLeft={<Plus className="h-4 w-4" />}>
              Agregar Saco
            </Button>
          ) : undefined
        }
      />

      {items.length === 0 ? (
        <EmptyState
          icon={<Weight className="h-8 w-8" />}
          iconClassName="bg-forest-600/10 text-forest-600"
          title="Sin sacos registrados"
          description="No se han registrado sacos en este acopio. Agrega el primer saco con el botón superior."
        />
      ) : (
        <div className="overflow-hidden rounded-xl border border-gray-200">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/50">
                  <th className="w-14 px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-gray-500">
                    N°
                  </th>
                  <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Código del Saco
                  </th>
                  <th className="w-40 px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Peso (kg)
                  </th>
                  <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Observaciones
                  </th>
                  {editable && <th className="w-16 px-5 py-3.5" />}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {items.map((saco, index) => (
                  <tr key={saco.id} className="transition-colors hover:bg-gray-50/50">
                    <td className="px-5 py-3 text-gray-400">{index + 1}</td>
                    <td className="px-5 py-3 font-medium text-forest-700">{saco.codigo}</td>
                    <td className="px-5 py-3">
                      {editable ? (
                        <Input
                          type="number"
                          step="0.1"
                          min="0"
                          defaultValue={saco.peso || undefined}
                          placeholder="0.0"
                          className="w-28"
                        />
                      ) : (
                        <span className="font-medium text-[#111827]">{formatKg(saco.peso)}</span>
                      )}
                    </td>
                    <td className="px-5 py-3">
                      {editable ? (
                        <Input defaultValue={saco.observaciones} placeholder="Opcional" />
                      ) : (
                        <span className="text-gray-600">{saco.observaciones || "—"}</span>
                      )}
                    </td>
                    {editable && (
                      <td className="px-5 py-3 text-right">
                        <button
                          type="button"
                          aria-label={`Eliminar ${saco.codigo}`}
                          onClick={() => removeSaco(saco.id)}
                          className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-600"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </CardShell>
  );
}
