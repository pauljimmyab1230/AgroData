import { useState } from "react";
import { Modal, Button, Input, Select } from "../ui";
import type { InventarioItem } from "../../services/kardex";
import { kardexCategoriaLabels } from "../../services/kardex";

interface SalidaModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (input: {
    kardex_id: number;
    cantidad: number;
    destino?: string | null;
    cliente?: string | null;
    referencia?: string | null;
    responsable?: string | null;
    observaciones?: string | null;
    fecha?: string;
  }) => void;
  item: InventarioItem | null;
  loading?: boolean;
}

const DESTINOS_COMUNES = [
  "Venta directa",
  "Cooperativa",
  "Mercado local",
  "Exportación",
  "Consumo interno",
  "Otro",
];

export function SalidaModal({ open, onClose, onConfirm, item, loading }: SalidaModalProps) {
  const [cantidad, setCantidad] = useState("");
  const [destino, setDestino] = useState("");
  const [cliente, setCliente] = useState("");
  const [referencia, setReferencia] = useState("");
  const [responsable, setResponsable] = useState("");
  const [observaciones, setObservaciones] = useState("");

  const handleSubmit = () => {
    if (!item || !cantidad) return;
    onConfirm({
      kardex_id: item.id,
      cantidad: Number(cantidad),
      destino: destino || null,
      cliente: cliente.trim() || null,
      referencia: referencia.trim() || null,
      responsable: responsable.trim() || null,
      observaciones: observaciones.trim() || null,
      fecha: new Date().toISOString(),
    });
    setCantidad("");
    setDestino("");
    setCliente("");
    setReferencia("");
    setResponsable("");
    setObservaciones("");
  };

  if (!item) return null;

  const cantidadNum = Number(cantidad) || 0;
  const stockDisponible = Number(item.cantidad_actual);
  const excedeStock = cantidadNum > stockDisponible;

  return (
    <Modal open={open} onClose={onClose} title="Registrar salida de producto">
      <div className="space-y-4">
        <div className="rounded-lg border border-gray-100 bg-gray-50 p-3">
          <p className="text-sm font-medium text-gray-900">{item.producto}</p>
          <p className="text-xs text-gray-500">
            {item.codigo} · {kardexCategoriaLabels[item.categoria] ?? item.categoria} · Stock disponible:{" "}
            <span className="font-semibold">{Number(item.cantidad_actual).toLocaleString("es-PE")} {item.unidad}</span>
          </p>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Cantidad a sacar ({item.unidad}) <span className="text-red-500">*</span>
          </label>
          <Input
            type="number"
            min="0"
            step="0.01"
            value={cantidad}
            onChange={(e) => setCantidad(e.target.value)}
            placeholder="0.00"
          />
          {excedeStock && (
            <p className="mt-1 text-xs text-red-600">
              La cantidad excede el stock disponible ({stockDisponible.toLocaleString("es-PE")} {item.unidad}).
            </p>
          )}
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Destino</label>
          <Select
            value={destino}
            onChange={setDestino}
            options={DESTINOS_COMUNES.map((d) => ({ value: d, label: d }))}
            placeholder="Selecciona un destino..."
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Cliente / Destinatario</label>
          <Input
            value={cliente}
            onChange={(e) => setCliente(e.target.value)}
            placeholder="Nombre del cliente o destinatario"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Referencia (guía, factura, OC...)</label>
          <Input
            value={referencia}
            onChange={(e) => setReferencia(e.target.value)}
            placeholder="Número de documento de referencia"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Responsable</label>
          <Input
            value={responsable}
            onChange={(e) => setResponsable(e.target.value)}
            placeholder="Quien autoriza la salida"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Observaciones</label>
          <Input
            value={observaciones}
            onChange={(e) => setObservaciones(e.target.value)}
            placeholder="Notas adicionales (opcional)"
          />
        </div>

        <div className="flex justify-end gap-2 border-t border-gray-100 pt-4">
          <Button variant="ghost" onClick={onClose}>
            Cancelar
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!cantidad || cantidadNum <= 0 || excedeStock || loading}
          >
            {loading ? "Registrando..." : "Registrar salida"}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
