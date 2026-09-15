import { useEffect, useState } from "react";
import { ClipboardList } from "lucide-react";
import { DatePicker, Input, Select } from "../ui";
import { CardHeader, CardShell, Field, type FormMode } from "../shared/formControls";
import type { Inspeccion } from "../../services/inspecciones";
import { useUsuariosBasic } from "../../services/usuarios";
import { fetchCultivos, type Cultivo } from "../../services/cultivos";
import api from "../../services/api";

type InformacionGeneralCardProps = {
  mode: FormMode;
  values?: Partial<Inspeccion>;
  onChange?: (patch: Partial<Inspeccion>) => void;
  errors?: Record<string, string>;
};

const parseDate = (s?: string) => (s ? new Date(s + "T00:00:00") : null);

interface SelectOption {
  value: string;
  label: string;
}

export function InformacionGeneralCard({ mode, values, onChange, errors }: InformacionGeneralCardProps) {
  const editable = mode !== "view";
  const [fecha, setFecha] = useState<Date | null>(() => parseDate(values?.fecha));
  const { usuarios: inspectores } = useUsuariosBasic("INSPECTOR");
  const [campanias, setCampanias] = useState<SelectOption[]>([]);
  const [productores, setProductores] = useState<SelectOption[]>([]);
  const [parcelas, setParcelas] = useState<SelectOption[]>([]);
  const [allCultivos, setAllCultivos] = useState<Cultivo[]>([]);
  const [selectedProductorId, setSelectedProductorId] = useState<string>(values?.productorId ? String(values.productorId) : "");

  const inspectoresOptions = inspectores.map((u) => ({ value: u.nombre, label: u.nombre }));

  useEffect(() => {
    if (!editable) return;
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
  }, [editable]);

  useEffect(() => {
    if (!editable) return;
    fetchCultivos({ limit: 500 })
      .then((res) => setAllCultivos(res.data))
      .catch(() => {});
  }, [editable]);

  useEffect(() => {
    if (!editable || !selectedProductorId) {
      setParcelas([]);
      return;
    }
    api.get("/parcelas", { params: { productor_id: selectedProductorId, limit: 200 } })
      .then((res) => {
        setParcelas(
          (res.data.data ?? []).map((p: { id: string | number; nombre: string; codigo: string }) => ({
            value: String(p.id),
            label: `${p.codigo} - ${p.nombre}`,
          }))
        );
      })
      .catch(() => setParcelas([]));
  }, [editable, selectedProductorId]);

  const handleParcelaChange = (parcelaId: string) => {
    onChange?.({ parcelaId: Number(parcelaId), cultivoId: 0 });
  };

  const cultivosOptions = values?.parcelaId
    ? allCultivos
        .filter((c) => String(c.parcelaId) === String(values.parcelaId))
        .map((c) => ({ value: String(c.id), label: `${c.codigo} - ${c.cultivo}` }))
    : [];

  return (
    <CardShell>
      <CardHeader
        icon={<ClipboardList size={20} />}
        title="Información General"
        description="Datos básicos de la inspección de campo"
      />

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <Field label="Código" mode={mode} value={values?.codigo}>
          <Input placeholder="Se genera automáticamente" disabled value={editable ? values?.codigo : undefined} />
        </Field>

        <Field label="Fecha de Inspección" mode={mode} value={values?.fecha} required error={errors?.fecha}>
          <DatePicker selected={fecha} onChange={(date) => setFecha(date)} disabled={!editable} />
        </Field>

        <Field label="Campaña" mode={mode} value={values?.campaniaNombre}>
          <Select
            options={campanias}
            placeholder="Seleccione"
            value={values?.campaniaId ? String(values.campaniaId) : undefined}
            onChange={(val) => onChange?.({ campaniaId: Number(val) })}
          />
        </Field>

        <Field label="Productor" mode={mode} value={values?.productorNombre}>
          <Select
            options={productores}
            placeholder="Seleccione"
            value={selectedProductorId}
            onChange={(val) => {
              setSelectedProductorId(val);
              setParcelas([]);
              onChange?.({ productorId: Number(val), parcelaId: 0, cultivoId: 0 });
            }}
          />
        </Field>

        <Field label="Parcela" mode={mode} value={values?.parcelaNombre} required error={errors?.parcelaId}>
          <Select
            options={parcelas}
            placeholder={selectedProductorId ? "Seleccione" : "Primero seleccione un productor"}
            value={values?.parcelaId ? String(values.parcelaId) : undefined}
            disabled={!selectedProductorId}
            onChange={handleParcelaChange}
          />
        </Field>

        <Field label="Cultivo" mode={mode} value={values?.cultivoNombre}>
          <Select
            options={cultivosOptions}
            placeholder={!values?.parcelaId ? "Primero seleccione una parcela" : "Seleccione"}
            value={values?.cultivoId ? String(values.cultivoId) : undefined}
            disabled={!values?.parcelaId}
            onChange={(val) => onChange?.({ cultivoId: Number(val) })}
          />
        </Field>

        <Field label="Inspector" mode={mode} value={values?.inspector} required error={errors?.inspector}>
          <Select
            options={inspectoresOptions}
            placeholder="Seleccione"
            value={editable ? values?.inspector : undefined}
            onChange={(val) => onChange?.({ inspector: val })}
          />
        </Field>
      </div>
    </CardShell>
  );
}
