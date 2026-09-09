import { useEffect, useState } from "react";
import { Tractor } from "lucide-react";
import { Input, Select } from "../ui";
import { CardHeader, CardShell, Field, type FormMode } from "../shared/formControls";
import type { Cultivo } from "../../services/cultivos";
import api from "../../services/api";

type DatosGeneralesCardProps = {
  mode: FormMode;
  values?: Partial<Cultivo>;
  onChange?: (patch: Partial<Cultivo>) => void;
};

interface SelectOption {
  value: string;
  label: string;
}

export function DatosGeneralesCard({ mode, values, onChange }: DatosGeneralesCardProps) {
  const editable = mode !== "view";
  const [campanias, setCampanias] = useState<SelectOption[]>([]);
  const [parcelas, setParcelas] = useState<SelectOption[]>([]);

  useEffect(() => {
    api.get("/campanias", { params: { limit: 200 } })
      .then((res) => {
        setCampanias(
          (res.data.data ?? []).map((c: { id: string | number; nombre: string; codigo: string }) => ({
            value: String(c.id),
            label: `${c.codigo} - ${c.nombre}`,
          }))
        );
      })
      .catch(() => setCampanias([]));
  }, []);

  useEffect(() => {
    api.get("/parcelas", { params: { limit: 200 } })
      .then((res) => {
        setParcelas(
          (res.data.data ?? []).map((p: { id: string | number; nombre: string; codigo: string; productor?: { nombres: string; apellido_paterno: string; apellido_materno: string } }) => ({
            value: String(p.id),
            label: `${p.codigo} - ${p.nombre}${p.productor ? ` (${p.productor.nombres} ${p.productor.apellido_paterno})` : ""}`,
          }))
        );
      })
      .catch(() => setParcelas([]));
  }, []);

  return (
    <CardShell>
      <CardHeader
        icon={<Tractor size={20} />}
        title="Información General"
        description="Identificación del cultivo, campaña y parcela"
      />

      <div className="grid gap-6 sm:grid-cols-2">
        <Field label="Código" mode={mode} value={values?.codigo} required>
          <Input type="text" placeholder="Ej. CUL-001" value={values?.codigo} disabled />
        </Field>

        <Field label="Campaña" mode={mode} value={values?.campaniaNombre} required>
          <Select
            options={campanias}
            placeholder="Seleccione la campaña"
            value={values?.campaniaId}
            onChange={(val) => onChange?.({ campaniaId: val })}
            disabled={!editable}
            required
          />
        </Field>

        <Field label="Parcela" mode={mode} value={values?.parcelaNombre} required>
          <Select
            options={parcelas}
            placeholder="Seleccione la parcela"
            value={values?.parcelaId}
            onChange={(val) => onChange?.({ parcelaId: val })}
            disabled={!editable}
            required
          />
        </Field>

        <Field label="Productor" mode={mode} value={values?.productorNombre}>
          <Input type="text" value={values?.productorNombre || "—"} disabled />
        </Field>
      </div>
    </CardShell>
  );
}
