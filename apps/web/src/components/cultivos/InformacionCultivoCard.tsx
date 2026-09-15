import { useState, useEffect } from "react";
import { Sprout } from "lucide-react";
import { DatePicker, Input, Select } from "../ui";
import { CardHeader, CardShell, Field, type FormMode } from "../shared/formControls";
import {
  metodosSiembraValues,
  variedadesOpciones,
  estadosCultivoValues,
  type Cultivo,
} from "../../services/cultivos";
import { fetchCatalogoActivos } from "../../services/catalogos";

const parseDate = (s?: string) => (s ? new Date(s + "T00:00:00") : null);

type InformacionCultivoCardProps = {
  mode: FormMode;
  values?: Partial<Cultivo>;
  onChange?: (patch: Partial<Cultivo>) => void;
  errors?: Record<string, string>;
};

export function InformacionCultivoCard({ mode, values, onChange, errors }: InformacionCultivoCardProps) {
  const [fechaSiembra, setFechaSiembra] = useState<Date | null>(parseDate(values?.fechaSiembra));
  const [cultivosOptions, setCultivosOptions] = useState<{ value: string; label: string }[]>([]);

  useEffect(() => {
    fetchCatalogoActivos("tipos-cultivo")
      .then((items) => setCultivosOptions([{ value: "", label: "Seleccione..." }, ...items.map((i) => ({ value: i.nombre, label: i.nombre }))]))
      .catch(() => {});
  }, []);

  return (
    <CardShell>
      <CardHeader
        icon={<Sprout size={20} />}
        title="Información del Cultivo"
        description="Especie, variedad y características de la siembra"
      />

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <Field label="Cultivo" mode={mode} value={values?.cultivo} required error={errors?.cultivo}>
          <Select
            options={cultivosOptions}
            placeholder="Seleccione el cultivo"
            value={values?.cultivo}
            onChange={(val) => onChange?.({ cultivo: val })}
            required
          />
        </Field>

        <Field label="Variedad" mode={mode} value={values?.variedad} required error={errors?.variedad}>
          <Select
            options={variedadesOpciones.map((v) => ({ value: v, label: v }))}
            placeholder="Seleccione la variedad"
            value={values?.variedad}
            onChange={(val) => onChange?.({ variedad: val })}
            required
          />
        </Field>

        <Field label="Área Sembrada (ha)" mode={mode} value={values?.areaSembrada?.toFixed(2)} required error={errors?.areaSembrada}>
          <Input
            type="number"
            min="0"
            step="0.01"
            placeholder="Ej. 2.40"
            value={values?.areaSembrada ?? undefined}
            onChange={(e) => onChange?.({ areaSembrada: Number(e.target.value) || 0 })}
            required
          />
        </Field>

        <Field label="Fecha de Siembra" mode={mode} value={values?.fechaSiembra} required error={errors?.fechaSiembra}>
          <DatePicker
            selected={fechaSiembra}
            onChange={(d) => {
              setFechaSiembra(d);
              onChange?.({ fechaSiembra: d?.toISOString().split("T")[0] ?? "" });
            }}
          />
        </Field>

        <Field label="Método de Siembra" mode={mode} value={values?.metodoSiembra} required error={errors?.metodoSiembra}>
          <Select
            options={metodosSiembraValues.map((v) => ({ value: v, label: v }))}
            placeholder="Seleccione el método"
            value={values?.metodoSiembra}
            onChange={(val) => onChange?.({ metodoSiembra: val })}
            required
          />
        </Field>

        <Field label="Estado" mode={mode} value={values?.estado}>
          <Select
            options={estadosCultivoValues.map((v) => ({ value: v, label: v }))}
            placeholder="Seleccione el estado"
            value={values?.estado}
            onChange={(val) => onChange?.({ estado: val })}
          />
        </Field>
      </div>
    </CardShell>
  );
}
