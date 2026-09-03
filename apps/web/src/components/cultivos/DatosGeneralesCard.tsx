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
  const [productores, setProductores] = useState<SelectOption[]>([]);
  const [parcelas, setParcelas] = useState<SelectOption[]>([]);

  useEffect(() => {
    Promise.all([
      api.get("/campanias", { params: { limit: 200 } }).catch(() => ({ data: { data: [] } })),
      api.get("/productores", { params: { limit: 200 } }).catch(() => ({ data: { data: [] } })),
    ]).then(([campaniasRes, productoresRes]) => {
      setCampanias(
        (campaniasRes.data.data ?? []).map((c: { id: string | number; nombre: string; codigo: string }) => ({
          value: String(c.id),
          label: `${c.codigo} - ${c.nombre}`,
        }))
      );
      setProductores(
        (productoresRes.data.data ?? []).map((p: { id: string | number; nombres: string; apellido_paterno: string; apellido_materno: string }) => ({
          value: String(p.id),
          label: `${p.nombres} ${p.apellido_paterno} ${p.apellido_materno}`.trim(),
        }))
      );
    });
  }, []);

  useEffect(() => {
    if (!values?.productorId) {
      setParcelas([]);
      return;
    }
    api.get("/parcelas", { params: { productor_id: values.productorId, limit: 200 } })
      .then((res) => {
        setParcelas(
          (res.data.data ?? []).map((p: { id: string | number; nombre: string; codigo: string }) => ({
            value: String(p.id),
            label: `${p.codigo} - ${p.nombre}`,
          }))
        );
      })
      .catch(() => setParcelas([]));
  }, [values?.productorId]);

  return (
    <CardShell>
      <CardHeader
        icon={<Tractor size={20} />}
        title="Información General"
        description="Identificación del cultivo, campaña, productor y parcela"
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

        <Field label="Productor" mode={mode} value={values?.productorNombre} required>
          <Select
            options={productores}
            placeholder="Seleccione el productor"
            value={values?.productorId}
            onChange={(val) => onChange?.({ productorId: val, parcelaId: "" })}
            disabled={!editable}
            required
          />
        </Field>

        <Field label="Parcela" mode={mode} value={values?.parcelaNombre} required>
          <Select
            options={parcelas}
            placeholder={values?.productorId ? "Seleccione la parcela" : "Primero seleccione un productor"}
            value={values?.parcelaId}
            onChange={(val) => onChange?.({ parcelaId: val })}
            disabled={!editable || !values?.productorId}
            required
          />
        </Field>
      </div>
    </CardShell>
  );
}
