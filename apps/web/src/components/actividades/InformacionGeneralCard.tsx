import { useEffect, useState } from "react";
import { ClipboardList } from "lucide-react";
import { DatePicker, Input, Select } from "../ui";
import { CardHeader, CardShell, Field, type FormMode } from "../shared/formControls";
import { formatearFecha, type ActividadFormData } from "../../services/actividades";
import { fetchCampanias } from "../../services/campanias";
import { fetchProductores } from "../../services/productores";
import { fetchParcelas } from "../../services/parcelas";
import { fetchCultivos } from "../../services/cultivos";

type DropdownOption = { value: string; label: string };

type InformacionGeneralCardProps = {
  mode: FormMode;
  value: ActividadFormData;
  onChange?: (patch: Partial<ActividadFormData>) => void;
};

export function InformacionGeneralCard({ mode, value, onChange }: InformacionGeneralCardProps) {
  const editable = mode !== "view";

  const [campaniasOptions, setCampaniasOptions] = useState<DropdownOption[]>([]);
  const [productoresOptions, setProductoresOptions] = useState<DropdownOption[]>([]);
  const [parcelasOptions, setParcelasOptions] = useState<DropdownOption[]>([]);
  const [cultivosOptions, setCultivosOptions] = useState<DropdownOption[]>([]);
  const [loadingParcelas, setLoadingParcelas] = useState(false);
  const [loadingCultivos, setLoadingCultivos] = useState(false);

  useEffect(() => {
    fetchCampanias({ limit: 100 })
      .then((res) => setCampaniasOptions(res.data.map((c) => ({ value: c.id, label: `${c.nombre} (${c.codigo})` }))))
      .catch(() => {});
    fetchProductores({ limit: 100 })
      .then((res) => setProductoresOptions(res.data.map((p) => ({ value: String(p.id), label: `${p.nombres} ${p.apellidoPaterno} ${p.apellidoMaterno}`.trim() }))))
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!value.productorId) {
      setParcelasOptions([]);
      setCultivosOptions([]);
      return;
    }
    setLoadingParcelas(true);
    fetchParcelas({ productorId: value.productorId, limit: 100 })
      .then((res) => setParcelasOptions(res.data.map((p) => ({ value: String(p.id), label: `${p.codigo} - ${p.nombre}` }))))
      .catch(() => {})
      .finally(() => setLoadingParcelas(false));
  }, [value.productorId]);

  useEffect(() => {
    if (!value.parcelaId) {
      setCultivosOptions([]);
      return;
    }
    setLoadingCultivos(true);
    fetchCultivos({ parcela_id: value.parcelaId, limit: 100 })
      .then((res) => setCultivosOptions(res.data.map((c) => ({ value: c.id, label: c.cultivo }))))
      .catch(() => {})
      .finally(() => setLoadingCultivos(false));
  }, [value.parcelaId]);

  const handleProductorChange = (productorId: string) => {
    const productor = productoresOptions.find((o) => o.value === productorId);
    onChange?.({ productorId, productor: productor?.label ?? "", parcelaId: "", parcela: "", cultivoId: "", cultivo: "" });
  };

  const handleParcelaChange = (parcelaId: string) => {
    const parcela = parcelasOptions.find((o) => o.value === parcelaId);
    onChange?.({ parcelaId, parcela: parcela?.label ?? "", cultivoId: "", cultivo: "" });
  };

  return (
    <CardShell>
      <CardHeader
        icon={<ClipboardList size={20} />}
        title="Información General"
        description="Datos básicos de la actividad agrícola"
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Field label="Código" mode={mode} value={value.codigo}>
          <Input
            value={value.codigo}
            disabled
            placeholder={mode === "create" ? "Se genera automáticamente" : undefined}
          />
        </Field>

        <Field label="Fecha" mode={mode} value={formatearFecha(value.fecha)} required>
          <DatePicker
            selected={value.fecha ? new Date(value.fecha + "T00:00:00") : null}
            onChange={(date) => onChange?.({ fecha: date?.toISOString().split("T")[0] ?? "" })}
          />
        </Field>

        <Field label="Campaña" mode={mode} value={value.campania} required>
          <Select
            options={campaniasOptions}
            placeholder="Seleccione"
            value={value.campaniaId}
            onChange={(v) => {
              const campania = campaniasOptions.find((o) => o.value === v);
              onChange?.({ campaniaId: v, campania: campania?.label ?? "" });
            }}
          />
        </Field>

        <Field label="Productor" mode={mode} value={value.productor} required>
          <Select
            options={productoresOptions}
            placeholder="Seleccione"
            value={value.productorId}
            onChange={handleProductorChange}
          />
        </Field>

        <Field label="Parcela" mode={mode} value={value.parcela} required>
          <Select
            options={parcelasOptions}
            placeholder={loadingParcelas ? "Cargando..." : value.productorId ? "Seleccione parcela" : "Seleccione un productor primero"}
            value={value.parcelaId}
            onChange={handleParcelaChange}
          />
        </Field>

        <Field label="Cultivo" mode={mode} value={value.cultivo}>
          <Select
            options={cultivosOptions}
            placeholder={
              loadingCultivos
                ? "Cargando..."
                : value.parcelaId
                  ? cultivosOptions.length === 0
                    ? "Sin cultivos registrados"
                    : "Seleccione cultivo"
                  : "Seleccione una parcela primero"
            }
            value={value.cultivoId}
            onChange={(v) => {
              const cultivo = cultivosOptions.find((o) => o.value === v);
              onChange?.({ cultivoId: v, cultivo: cultivo?.label ?? "" });
            }}
          />
        </Field>

        <Field label="Responsable Técnico" mode={mode} value={value.responsableTecnico} required>
          <Input
            value={value.responsableTecnico}
            disabled={!editable}
            onChange={(e) => onChange?.({ responsableTecnico: e.target.value })}
            placeholder="Nombre del responsable"
          />
        </Field>

        {editable && (
          <div className="flex items-end text-xs text-gray-400 sm:col-span-2 lg:col-span-2">
            <span>Cascada: Productor → Parcela → Cultivo</span>
          </div>
        )}
      </div>
    </CardShell>
  );
}
