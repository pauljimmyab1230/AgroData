import { useState } from "react";
import { Package, UserRound, MapPin, Wheat, Scale, Plus, X } from "lucide-react";
import { Badge, Button, DataTable, Select } from "../ui";
import { CardHeader, CardShell, type FormMode } from "../shared/formControls";
import {
  formatKg,
  lotesProductorDisponibles,
  type LoteProductorProcesado,
  type OrdenProcesamiento,
} from "../../pages/procesamiento/procesamientoMock";

type MateriaPrimaCardProps = {
  mode: FormMode;
  values?: Partial<OrdenProcesamiento>;
};

const toOptions = (items: string[]) => items.map((item) => ({ value: item, label: item }));

export function MateriaPrimaCard({ mode, values }: MateriaPrimaCardProps) {
  const editable = mode !== "view";
  const [lotesSeleccionados, setLotesSeleccionados] = useState<LoteProductorProcesado[]>(
    values?.lotesProductor ?? []
  );
  const [loteDisponible, setLoteDisponible] = useState("");

  const agregarLote = () => {
    if (!loteDisponible) return;
    const lote = lotesProductorDisponibles.find((l) => l.loteProductor === loteDisponible);
    if (!lote) return;
    if (lotesSeleccionados.some((l) => l.loteProductor === lote.loteProductor)) return;
    setLotesSeleccionados((prev) => [...prev, lote]);
    setLoteDisponible("");
  };

  const eliminarLote = (codigo: string) => {
    setLotesSeleccionados((prev) => prev.filter((l) => l.loteProductor !== codigo));
  };

  const lotesDisponiblesFiltrados = lotesProductorDisponibles.filter(
    (l) => !lotesSeleccionados.some((ls) => ls.loteProductor === l.loteProductor)
  );

  const columns = [
    {
      key: "loteProductor",
      label: "Código LP",
      className: "font-medium text-forest-700",
    },
    {
      key: "productor",
      label: "Productor",
      render: (lote: LoteProductorProcesado) => (
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-forest-600/10 text-forest-700">
            <UserRound className="h-3.5 w-3.5" />
          </div>
          <span className="font-medium text-[#111827]">{lote.productor}</span>
        </div>
      ),
    },
    {
      key: "parcela",
      label: "Parcela",
      render: (lote: LoteProductorProcesado) => (
        <span className="flex items-center gap-1.5 text-gray-600">
          <MapPin className="h-3.5 w-3.5 text-gray-400" />
          {lote.parcela}
        </span>
      ),
    },
    {
      key: "cultivo",
      label: "Cultivo",
      render: (lote: LoteProductorProcesado) => (
        <Badge variant="yellow">{lote.cultivo}</Badge>
      ),
    },
    {
      key: "pesoRecepcionado",
      label: "Peso Recepcionado",
      render: (lote: LoteProductorProcesado) => (
        <span className="font-medium text-[#111827]">{formatKg(lote.pesoRecepcionado)}</span>
      ),
    },
    ...(editable
      ? [
          {
            key: "acciones",
            label: "",
            className: "text-right",
            render: (lote: LoteProductorProcesado) => (
              <button
                type="button"
                aria-label={`Quitar ${lote.loteProductor}`}
                onClick={() => eliminarLote(lote.loteProductor)}
                className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-600"
              >
                <X className="h-4 w-4" />
              </button>
            ),
          },
        ]
      : []),
  ];

  return (
    <CardShell>
      <CardHeader
        icon={<Package size={20} />}
        title="Materia Prima"
        description="Seleccione uno o varios Lotes del Productor disponibles para procesamiento"
      />

      {editable && lotesDisponiblesFiltrados.length > 0 && (
        <div className="mb-6 flex items-end gap-3">
          <div className="flex-1">
            <label className="mb-1.5 block text-sm font-medium text-[#111827]">
              Lote del Productor (LP)
            </label>
            <Select
              options={toOptions(lotesDisponiblesFiltrados.map((l) => l.loteProductor))}
              placeholder="Seleccione un LP para agregar"
              value={loteDisponible}
              onChange={(val) => setLoteDisponible(val)}
            />
          </div>
          <Button
            variant="secondary"
            size="sm"
            onClick={agregarLote}
            iconLeft={<Plus className="h-4 w-4" />}
            disabled={!loteDisponible}
          >
            Agregar LP
          </Button>
        </div>
      )}

      {lotesSeleccionados.length > 0 && (
        <>
          <div className="mb-4 rounded-xl border border-forest-100 bg-forest-50/40 p-4">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-forest-700">
              LP Seleccionados: {lotesSeleccionados.length}
            </p>
            <div className="flex flex-wrap gap-2">
              {lotesSeleccionados.map((lp) => (
                <span
                  key={lp.loteProductor}
                  className="inline-flex items-center gap-2 rounded-lg border border-forest-200 bg-white px-3 py-2 text-sm font-medium text-forest-700"
                >
                  <Package className="h-3.5 w-3.5" />
                  {lp.loteProductor} — {lp.productor}
                  {editable && (
                    <button
                      type="button"
                      onClick={() => eliminarLote(lp.loteProductor)}
                      className="ml-1 rounded p-0.5 text-gray-400 hover:text-red-600"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  )}
                </span>
              ))}
            </div>
          </div>

          <DataTable
            columns={columns}
            data={lotesSeleccionados}
            keyField="loteProductor"
          />
        </>
      )}

      {lotesSeleccionados.length === 0 && (
        <div className="rounded-xl border-2 border-dashed border-gray-200 bg-gray-50/50 p-10 text-center">
          <Package className="mx-auto mb-3 h-8 w-8 text-gray-300" />
          <p className="text-sm font-medium text-gray-500">No hay LP seleccionados</p>
          <p className="mt-1 text-xs text-gray-400">
            Seleccione uno o varios Lotes del Productor disponibles para procesamiento.
          </p>
        </div>
      )}
    </CardShell>
  );
}
