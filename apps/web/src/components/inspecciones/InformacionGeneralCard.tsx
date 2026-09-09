import { useEffect, useState } from "react";
import { ClipboardList } from "lucide-react";
import { DatePicker, Input, Select } from "../ui";
import { CardHeader, CardShell, Field, type FormMode } from "../shared/formControls";
import type { Inspeccion } from "../../services/inspecciones";
import { useUsuariosBasic } from "../../services/usuarios";
import api from "../../services/api";

type InformacionGeneralCardProps = {
  mode: FormMode;
  values?: Partial<Inspeccion>;
};

const parseDate = (s?: string) => (s ? new Date(s + "T00:00:00") : null);

interface SelectOption {
  value: string;
  label: string;
}

export function InformacionGeneralCard({ mode, values }: InformacionGeneralCardProps) {
  const editable = mode !== "view";
  const [fecha, setFecha] = useState<Date | null>(() => parseDate(values?.fecha));
  const { usuarios: inspectores } = useUsuariosBasic("INSPECTOR");
  const [campanias, setCampanias] = useState<SelectOption[]>([]);
  const [productores, setProductores] = useState<SelectOption[]>([]);
  const [parcelas, setParcelas] = useState<SelectOption[]>([]);
  const [cultivos, setCultivos] = useState<SelectOption[]>([]);
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
    if (!editable || !selectedProductorId) {
      setParcelas([]);
      setCultivos([]);
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

        <Field label="Fecha de Inspección" mode={mode} value={values?.fecha}>
          <DatePicker selected={fecha} onChange={(date) => setFecha(date)} disabled={!editable} />
        </Field>

        <Field label="Campaña" mode={mode} value={values?.campaniaNombre}>
          <Select
            options={campanias}
            placeholder="Seleccione"
            value={values?.campaniaId ? String(values.campaniaId) : undefined}
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
              setCultivos([]);
            }}
          />
        </Field>

        <Field label="Parcela" mode={mode} value={values?.parcelaNombre}>
          <Select
            options={parcelas}
            placeholder={selectedProductorId ? "Seleccione" : "Primero seleccione un productor"}
            value={values?.parcelaId ? String(values.parcelaId) : undefined}
            disabled={!selectedProductorId}
          />
        </Field>

        <Field label="Cultivo" mode={mode} value={values?.cultivoNombre}>
          <Select
            options={cultivos}
            placeholder={values?.parcelaId ? "Seleccione" : "Primero seleccione una parcela"}
            value={values?.cultivoId ? String(values.cultivoId) : undefined}
            disabled={!values?.parcelaId}
          />
        </Field>

        <Field label="Inspector" mode={mode} value={values?.inspector}>
          <Select
            options={inspectoresOptions}
            placeholder="Seleccione"
            value={editable ? values?.inspector : undefined}
          />
        </Field>
      </div>
    </CardShell>
  );
}
