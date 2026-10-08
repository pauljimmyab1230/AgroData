import { useState } from "react";
import { Modal, Button, Input, Select } from "../ui";
import type { InventarioItem } from "../../services/kardex";
import { kardexCategoriaLabels } from "../../services/kardex";

interface BajaModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (motivo: string, cantidad?: number, responsable?: string) => void;
  item: InventarioItem | null;
  loading?: boolean;
}

const MOTIVOS_COMUNES = [
  "Merma de procesamiento",
  "Envase dañado",
  "Producto vencido",
  "Producto contaminado",
  "Ajuste de inventario",
  "Otro",
];

export function BajaModal({ open, onClose, onConfirm, item, loading }: BajaModalProps) {
  const [motivo, setMotivo] = useState("");
  const [motivoOtro, setMotivoOtro] = useState("");
  const [cantidad, setCantidad] = useState("");
  const [responsable, setResponsable] = useState("");

  const handleSubmit = () => {
    const motivoFinal = motivo === "Otro" ? motivoOtro : motivo;
    if (!motivoFinal.trim()) return;
    onConfirm(
      motivoFinal.trim(),
      cantidad ? Number(cantidad) : undefined,
      responsable.trim() || undefined,
    );
    setMotivo("");
    setMotivoOtro("");
    setCantidad("");
    setResponsable("");
  };

  if (!item) return null;

  return (
    <Modal open={open} onClose={onClose} title="Dar de baja">
      <div className="space-y-4">
        <div className="rounded-lg border border-gray-100 bg-gray-50 p-3">
          <p className="text-sm font-medium text-gray-900">{item.producto}</p>
          <p className="text-xs text-gray-500">
            {item.codigo} · {kardexCategoriaLabels[item.categoria] ?? item.categoria} · Stock actual:{" "}
            {Number(item.cantidad_actual).toLocaleString("es-PE")} {item.unidad}
          </p>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Motivo de la baja <span className="text-red-500">*</span>
          </label>
          <Select
            value={motivo}
            onChange={setMotivo}
            options={MOTIVOS_COMUNES.map((m) => ({ value: m, label: m }))}
            placeholder="Selecciona un motivo..."
          />
        </div>

        {motivo === "Otro" && (
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Especifica el motivo <span className="text-red-500">*</span>
            </label>
            <Input
              value={motivoOtro}
              onChange={(e) => setMotivoOtro(e.target.value)}
              placeholder="Describe el motivo de la baja"
            />
          </div>
        )}

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Cantidad a dar de baja ({item.unidad})
          </label>
          <Input
            type="number"
            min="0"
            max={String(item.cantidad_actual)}
            step="0.01"
            value={cantidad}
            onChange={(e) => setCantidad(e.target.value)}
            placeholder={`Vacío = todo (${Number(item.cantidad_actual).toLocaleString("es-PE")} ${item.unidad})`}
          />
          <p className="mt-1 text-xs text-gray-500">
            Si dejas vacío, se da de baja todo el stock disponible.
          </p>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Responsable</label>
          <Input
            value={responsable}
            onChange={(e) => setResponsable(e.target.value)}
            placeholder="Nombre de quien autoriza la baja"
          />
        </div>

        <div className="flex justify-end gap-2 border-t border-gray-100 pt-4">
          <Button variant="ghost" onClick={onClose}>
            Cancelar
          </Button>
          <Button
            variant="danger"
            onClick={handleSubmit}
            disabled={!motivo.trim() || (motivo === "Otro" && !motivoOtro.trim()) || loading}
          >
            {loading ? "Dando de baja..." : "Confirmar baja"}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
