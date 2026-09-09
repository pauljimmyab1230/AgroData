import { ClipboardList } from "lucide-react";
import { DatePicker, Input, Select, Textarea } from "../ui";
import { CardHeader, CardShell, Field, type FormMode } from "../shared/formControls";
import type { CampaniaFormData } from "../../services/campanias";
import { formatFechaCorta } from "../../utils/formatters";
import { aniosAgricolas } from "../../constants/campanias";

type DatosGeneralesCardProps = {
  mode: FormMode;
  value: CampaniaFormData;
  onChange?: (patch: Partial<CampaniaFormData>) => void;
  errors?: Record<string, string>;
};

const toOptions = (items: string[]) => items.map((item) => ({ value: item, label: item }));

export function DatosGeneralesCard({ mode, value, onChange, errors }: DatosGeneralesCardProps) {
  const editable = mode !== "view";

  return (
    <CardShell>
      <CardHeader
        icon={<ClipboardList size={20} />}
        title="Información General"
        description="Datos básicos y responsables de la campaña agrícola"
      />

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <Field label="Código" mode={mode} value={value.codigo}>
          <Input
            value={value.codigo}
            disabled
            placeholder={mode === "create" ? "Se genera automáticamente" : undefined}
          />
        </Field>

        <Field label="Nombre de la Campaña" mode={mode} value={value.nombre} required>
          <Input
            type="text"
            value={value.nombre}
            onChange={(e) => onChange?.({ nombre: e.target.value })}
            placeholder="Ej. Campaña 2025-2026 Quinua Orgánica"
          />
          {editable && errors?.nombre && <p className="mt-1 text-xs text-red-500">{errors.nombre}</p>}
        </Field>

        <Field label="Año Agrícola" mode={mode} value={value.anioAgricola} required>
          <Select
            options={toOptions(aniosAgricolas)}
            placeholder="Seleccione"
            value={value.anioAgricola}
            onChange={(v) => onChange?.({ anioAgricola: v })}
          />
          {editable && errors?.anioAgricola && <p className="mt-1 text-xs text-red-500">{errors.anioAgricola}</p>}
        </Field>

        <Field label="Fecha de Inicio" mode={mode} value={formatFechaCorta(value.fechaInicio)} required>
          <DatePicker
            selected={value.fechaInicio ? new Date(value.fechaInicio + "T00:00:00") : null}
            onChange={(date) => onChange?.({ fechaInicio: date?.toISOString().split("T")[0] ?? "" })}
          />
          {editable && errors?.fechaInicio && <p className="mt-1 text-xs text-red-500">{errors.fechaInicio}</p>}
        </Field>

        <Field label="Fecha de Fin" mode={mode} value={formatFechaCorta(value.fechaFin)} required>
          <DatePicker
            selected={value.fechaFin ? new Date(value.fechaFin + "T00:00:00") : null}
            onChange={(date) => onChange?.({ fechaFin: date?.toISOString().split("T")[0] ?? "" })}
          />
          {editable && errors?.fechaFin && <p className="mt-1 text-xs text-red-500">{errors.fechaFin}</p>}
        </Field>

        <Field label="Responsable de la Campaña" mode={mode} value={value.responsable} required>
          <Input
            type="text"
            value={value.responsable}
            onChange={(e) => onChange?.({ responsable: e.target.value })}
            placeholder="Nombre del responsable"
          />
          {editable && errors?.responsable && <p className="mt-1 text-xs text-red-500">{errors.responsable}</p>}
        </Field>

        <div className="sm:col-span-2">
          <Field label="Técnico Coordinador" mode={mode} value={value.tecnicoCoordinador} required>
            <Input
              type="text"
              value={value.tecnicoCoordinador}
              onChange={(e) => onChange?.({ tecnicoCoordinador: e.target.value })}
              placeholder="Nombre del técnico coordinador"
            />
            {editable && errors?.tecnicoCoordinador && <p className="mt-1 text-xs text-red-500">{errors.tecnicoCoordinador}</p>}
          </Field>
        </div>

        <div className="sm:col-span-2 lg:col-span-3">
          <Field label="Descripción" mode={mode} value={value.descripcion}>
            <Textarea
              rows={3}
              value={value.descripcion}
              onChange={(e) => onChange?.({ descripcion: e.target.value })}
              placeholder="Objetivos, cultivos y alcance general de la campaña..."
            />
          </Field>
        </div>

        <div className="sm:col-span-2 lg:col-span-3">
          <Field label="Objetivo de la Campaña" mode={mode} value={value.objetivo} required>
            <Textarea
              rows={3}
              value={value.objetivo}
              onChange={(e) => onChange?.({ objetivo: e.target.value })}
              placeholder="Describe el objetivo principal de la campaña..."
            />
            {editable && errors?.objetivo && <p className="mt-1 text-xs text-red-500">{errors.objetivo}</p>}
          </Field>
        </div>
      </div>
    </CardShell>
  );
}
