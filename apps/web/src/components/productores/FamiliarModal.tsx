import { useState } from "react";
import { Save, X } from "lucide-react";
import { Button, DatePicker, FormField, Input, Modal, Select } from "../ui";
import type { Familiar } from "../../services/productores";

type FamiliarFormData = {
  nombres: string;
  parentesco: string;
  dni: string;
  sexo: string;
  fechaNacimiento: string;
  ocupacion: string;
  nivelEducativo: string;
  telefono: string;
  dependiente: boolean;
  viveConProductor: boolean;
};

const emptyForm: FamiliarFormData = {
  nombres: "",
  parentesco: "",
  dni: "",
  sexo: "",
  fechaNacimiento: "",
  ocupacion: "",
  nivelEducativo: "",
  telefono: "",
  dependiente: false,
  viveConProductor: true,
};

const sexoOptions = [
  { value: "MASCULINO", label: "Masculino" },
  { value: "FEMENINO", label: "Femenino" },
];

const parentescoOptions = [
  { value: "ESPOSA", label: "Esposa" },
  { value: "ESPOSO", label: "Esposo" },
  { value: "HIJO", label: "Hijo" },
  { value: "HIJA", label: "Hija" },
  { value: "PADRE", label: "Padre" },
  { value: "MADRE", label: "Madre" },
  { value: "HERMANO", label: "Hermano" },
  { value: "HERMANA", label: "Hermana" },
  { value: "ABUELO", label: "Abuelo" },
  { value: "ABUELA", label: "Abuela" },
  { value: "YERNO", label: "Yerno" },
  { value: "NUERA", label: "Nuera" },
  { value: "NIETO", label: "Nieto" },
  { value: "NIETA", label: "Nieta" },
  { value: "OTRO", label: "Otro" },
];

const nivelEducativoOptions = [
  { value: "", label: "—" },
  { value: "SIN_ESTUDIOS", label: "Sin Estudios" },
  { value: "PRIMARIA", label: "Primaria" },
  { value: "SECUNDARIA", label: "Secundaria" },
  { value: "TECNICO", label: "Técnico" },
  { value: "UNIVERSITARIO", label: "Universitario" },
];

function fromFamiliar(f: Familiar): FamiliarFormData {
  return {
    nombres: f.nombres,
    parentesco: f.parentesco,
    dni: f.dni ?? "",
    sexo: f.sexo,
    fechaNacimiento: f.fechaNacimiento ?? "",
    ocupacion: f.ocupacion ?? "",
    nivelEducativo: f.nivelEducativo ?? "",
    telefono: f.telefono ?? "",
    dependiente: f.dependiente,
    viveConProductor: f.viveConProductor,
  };
}

type FamiliarModalProps = {
  open: boolean;
  onClose: () => void;
  onSave: (data: FamiliarFormData) => void | Promise<void>;
  familiar?: Familiar | null;
  saving?: boolean;
};

export function FamiliarModal({ open, onClose, onSave, familiar, saving }: FamiliarModalProps) {
  const [form, setForm] = useState<FamiliarFormData>(familiar ? fromFamiliar(familiar) : emptyForm);
  const [errors, setErrors] = useState<Partial<Record<keyof FamiliarFormData, string>>>({});

  const setField = (patch: Partial<FamiliarFormData>) => {
    setForm((prev) => ({ ...prev, ...patch }));
    for (const key of Object.keys(patch) as Array<keyof FamiliarFormData>) {
      setErrors((prev) => {
        if (!(key in prev)) return prev;
        const next = { ...prev };
        delete next[key];
        return next;
      });
    }
  };

  const validate = (): boolean => {
    const next: Partial<Record<keyof FamiliarFormData, string>> = {};
    if (!form.nombres.trim()) next.nombres = "Los nombres son obligatorios";
    if (!form.parentesco) next.parentesco = "El parentesco es obligatorio";
    if (!form.sexo) next.sexo = "El sexo es obligatorio";
    if (!form.fechaNacimiento) next.fechaNacimiento = "La fecha de nacimiento es obligatoria";
    if (form.dni && form.dni.length !== 8) next.dni = "El DNI debe tener 8 dígitos";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    onSave(form);
  };

  return (
    <Modal open={open} onClose={onClose} title={familiar ? "Editar Familiar" : "Agregar Familiar"} maxWidth="xl">
      <div className="space-y-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField label="Nombres completos" required error={errors.nombres}>
            <Input
              type="text"
              placeholder="Ej. Julia Condori Quispe"
              value={form.nombres}
              onChange={(e) => setField({ nombres: e.target.value })}
            />
          </FormField>

          <FormField label="Parentesco" required error={errors.parentesco}>
            <Select
              options={parentescoOptions}
              placeholder="Seleccione"
              value={form.parentesco}
              onChange={(val) => setField({ parentesco: val })}
            />
          </FormField>

          <FormField label="DNI" error={errors.dni}>
            <Input
              type="text"
              placeholder="Ej. 44876321"
              maxLength={8}
              value={form.dni}
              onChange={(e) => setField({ dni: e.target.value })}
            />
          </FormField>

          <FormField label="Sexo" required error={errors.sexo}>
            <Select
              options={sexoOptions}
              placeholder="Seleccione"
              value={form.sexo}
              onChange={(val) => setField({ sexo: val })}
            />
          </FormField>

          <FormField label="Fecha de Nacimiento" required error={errors.fechaNacimiento}>
            <DatePicker
              selected={form.fechaNacimiento ? new Date(form.fechaNacimiento + "T00:00:00") : null}
              onChange={(date) => setField({ fechaNacimiento: date ? date.toISOString().split("T")[0] : "" })}
            />
          </FormField>

          <FormField label="Ocupación">
            <Input
              type="text"
              placeholder="Ej. Agricultora"
              value={form.ocupacion}
              onChange={(e) => setField({ ocupacion: e.target.value })}
            />
          </FormField>

          <FormField label="Nivel Educativo">
            <Select
              options={nivelEducativoOptions}
              placeholder="—"
              value={form.nivelEducativo}
              onChange={(val) => setField({ nivelEducativo: val })}
            />
          </FormField>

          <FormField label="Teléfono">
            <Input
              type="tel"
              placeholder="Ej. 987 654 322"
              value={form.telefono}
              onChange={(e) => setField({ telefono: e.target.value })}
            />
          </FormField>
        </div>

        <div className="flex flex-wrap gap-4">
          <label className="flex cursor-pointer items-center gap-2.5 rounded-xl border border-gray-200 px-4 py-3">
            <input
              type="checkbox"
              checked={form.dependiente}
              onChange={(e) => setField({ dependiente: e.target.checked })}
              className="h-4 w-4 accent-forest-600"
            />
            <span className="text-sm font-medium text-[#111827]">Dependiente</span>
          </label>

          <label className="flex cursor-pointer items-center gap-2.5 rounded-xl border border-gray-200 px-4 py-3">
            <input
              type="checkbox"
              checked={form.viveConProductor}
              onChange={(e) => setField({ viveConProductor: e.target.checked })}
              className="h-4 w-4 accent-forest-600"
            />
            <span className="text-sm font-medium text-[#111827]">Vive con el productor</span>
          </label>
        </div>

        <div className="flex justify-end gap-2 border-t border-gray-100 pt-4">
          <Button variant="secondary" onClick={onClose} iconLeft={<X className="h-4 w-4" />}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit} disabled={saving} iconLeft={<Save className="h-4 w-4" />}>
            {saving ? "Guardando..." : familiar ? "Guardar Cambios" : "Agregar"}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
