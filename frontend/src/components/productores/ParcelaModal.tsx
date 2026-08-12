import { useState } from "react";
import { Save, X } from "lucide-react";
import { Button, FormField, Input, Modal, Select } from "../ui";
import type { Parcela } from "../../services/productores";

export type ParcelaFormData = {
  codigo: string;
  nombre: string;
  cultivo: string;
  area: string;
  areaUnidad: string;
  ubicacion: string;
  certificacion: string;
  estado: string;
};

const emptyForm: ParcelaFormData = {
  codigo: "",
  nombre: "",
  cultivo: "",
  area: "",
  areaUnidad: "ha",
  ubicacion: "",
  certificacion: "CONVENCIONAL",
  estado: "ACTIVA",
};

const areaUnidadOptions = [
  { value: "ha", label: "Hectáreas (ha)" },
  { value: "m2", label: "Metros cuadrados (m²)" },
];

const certificacionOptions = [
  { value: "ORGANICA", label: "Orgánica" },
  { value: "EN_TRANSICION", label: "En Transición" },
  { value: "CONVENCIONAL", label: "Convencional" },
];

const estadoOptions = [
  { value: "ACTIVA", label: "Activa" },
  { value: "INACTIVA", label: "Inactiva" },
];

function fromParcela(p: Parcela): ParcelaFormData {
  return {
    codigo: p.codigo,
    nombre: p.nombre,
    cultivo: p.cultivo,
    area: p.area,
    areaUnidad: p.areaUnidad,
    ubicacion: p.ubicacion,
    certificacion: p.certificacion,
    estado: p.estado,
  };
}

type ParcelaModalProps = {
  open: boolean;
  onClose: () => void;
  onSave: (data: ParcelaFormData) => void | Promise<void>;
  parcela?: Parcela | null;
  saving?: boolean;
};

export function ParcelaModal({ open, onClose, onSave, parcela, saving }: ParcelaModalProps) {
  const [form, setForm] = useState<ParcelaFormData>(parcela ? fromParcela(parcela) : emptyForm);
  const [errors, setErrors] = useState<Partial<Record<keyof ParcelaFormData, string>>>({});

  const setField = (patch: Partial<ParcelaFormData>) => {
    setForm((prev) => ({ ...prev, ...patch }));
    for (const key of Object.keys(patch) as Array<keyof ParcelaFormData>) {
      setErrors((prev) => {
        if (!(key in prev)) return prev;
        const next = { ...prev };
        delete next[key];
        return next;
      });
    }
  };

  const validate = (): boolean => {
    const next: Partial<Record<keyof ParcelaFormData, string>> = {};
    if (!form.codigo.trim()) next.codigo = "El código es obligatorio";
    if (!form.nombre.trim()) next.nombre = "El nombre es obligatorio";
    if (!form.cultivo.trim()) next.cultivo = "El cultivo es obligatorio";
    if (!form.area || isNaN(parseFloat(form.area)) || parseFloat(form.area) <= 0) {
      next.area = "El área debe ser un número mayor a 0";
    }
    if (!form.ubicacion.trim()) next.ubicacion = "La ubicación es obligatoria";
    if (!form.certificacion) next.certificacion = "La certificación es obligatoria";
    if (!form.estado) next.estado = "El estado es obligatorio";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    onSave(form);
  };

  return (
    <Modal open={open} onClose={onClose} title={parcela ? "Editar Parcela" : "Agregar Parcela"} maxWidth="xl">
      <div className="space-y-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField label="Código" required error={errors.codigo}>
            <Input
              type="text"
              placeholder="Ej. PAR-001"
              value={form.codigo}
              onChange={(e) => setField({ codigo: e.target.value })}
            />
          </FormField>

          <FormField label="Nombre de la parcela" required error={errors.nombre}>
            <Input
              type="text"
              placeholder="Ej. Parcela A - Ñawpa Rumi"
              value={form.nombre}
              onChange={(e) => setField({ nombre: e.target.value })}
            />
          </FormField>

          <FormField label="Cultivo" required error={errors.cultivo}>
            <Input
              type="text"
              placeholder="Ej. Quinua"
              value={form.cultivo}
              onChange={(e) => setField({ cultivo: e.target.value })}
            />
          </FormField>

          <FormField label="Área" required error={errors.area}>
            <Input
              type="number"
              step="0.01"
              min="0"
              placeholder="Ej. 2.40"
              value={form.area}
              onChange={(e) => setField({ area: e.target.value })}
            />
          </FormField>

          <FormField label="Unidad de área" required>
            <Select
              options={areaUnidadOptions}
              value={form.areaUnidad}
              onChange={(val) => setField({ areaUnidad: val })}
            />
          </FormField>

          <FormField label="Ubicación" required error={errors.ubicacion}>
            <Input
              type="text"
              placeholder="Ej. Collpaccasa"
              value={form.ubicacion}
              onChange={(e) => setField({ ubicacion: e.target.value })}
            />
          </FormField>

          <FormField label="Certificación" required error={errors.certificacion}>
            <Select
              options={certificacionOptions}
              value={form.certificacion}
              onChange={(val) => setField({ certificacion: val })}
            />
          </FormField>

          <FormField label="Estado" required error={errors.estado}>
            <Select
              options={estadoOptions}
              value={form.estado}
              onChange={(val) => setField({ estado: val })}
            />
          </FormField>
        </div>

        <div className="flex justify-end gap-2 border-t border-gray-100 pt-4">
          <Button variant="secondary" onClick={onClose} iconLeft={<X className="h-4 w-4" />}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit} disabled={saving} iconLeft={<Save className="h-4 w-4" />}>
            {saving ? "Guardando..." : parcela ? "Guardar Cambios" : "Agregar"}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
