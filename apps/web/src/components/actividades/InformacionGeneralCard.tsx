import { ClipboardList } from "lucide-react";
import { Input, Select, Textarea } from "../ui";
import { CardHeader, CardShell, Field, type FormMode } from "../shared/formControls";
import { formatearFecha, tiposActividad, type ActividadFormData } from "../../services/actividades";
import { fetchCultivos, type Cultivo } from "../../services/cultivos";
import api from "../../services/api";
import { useEffect, useState } from "react";

type DropdownOption = { value: string; label: string };

const tipoOptions = tiposActividad.map((t) => ({ value: t.value, label: t.label }));

type InformacionGeneralCardProps = {
  mode: FormMode;
  value: ActividadFormData;
  onChange?: (patch: Partial<ActividadFormData>) => void;
  errors?: Record<string, string>;
};

export function InformacionGeneralCard({ mode, value, onChange, errors }: InformacionGeneralCardProps) {
  const editable = mode !== "view";

  const [parcelasOptions, setParcelasOptions] = useState<DropdownOption[]>([]);
  const [cultivosOptions, setCultivosOptions] = useState<DropdownOption[]>([]);
  const [loadingParcelas, setLoadingParcelas] = useState(false);
  const [loadingCultivos, setLoadingCultivos] = useState(false);
  const [allCultivos, setAllCultivos] = useState<Cultivo[]>([]);

  useEffect(() => {
    setLoadingParcelas(true);
    api.get("/parcelas", { params: { limit: 200 } })
      .then((res) => {
        setParcelasOptions(
          (res.data.data ?? []).map((p: { id: string | number; nombre: string; codigo: string }) => ({
            value: String(p.id),
            label: `${p.codigo} - ${p.nombre}`,
          }))
        );
      })
      .catch(() => setParcelasOptions([]))
      .finally(() => setLoadingParcelas(false));
  }, []);

  useEffect(() => {
    setLoadingCultivos(true);
    fetchCultivos({ limit: 500 })
      .then((res) => {
        setAllCultivos(res.data);
      })
      .catch(() => {})
      .finally(() => setLoadingCultivos(false));
  }, []);

  useEffect(() => {
    if (allCultivos.length > 0 && value.parcelaId) {
      const filtered = allCultivos.filter((c) => String(c.parcelaId) === value.parcelaId);
      setCultivosOptions(filtered.map((c) => ({ value: String(c.id), label: `${c.codigo} - ${c.cultivo}` })));
    } else {
      setCultivosOptions([]);
    }
  }, [allCultivos, value.parcelaId]);

  const handleParcelaChange = (parcelaId: string) => {
    const parcela = parcelasOptions.find((o) => o.value === parcelaId);
    onChange?.({ parcelaId, parcelaNombre: parcela?.label ?? "", cultivoId: "", cultivo: "" });
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

        <Field label="Fecha" mode={mode} value={formatearFecha(value.fecha)} required error={errors?.fecha}>
          <Input
            type="date"
            value={value.fecha}
            disabled={!editable}
            onChange={(e) => onChange?.({ fecha: e.target.value })}
          />
        </Field>

        <Field label="Parcela" mode={mode} value={value.parcelaNombre} required error={errors?.parcelaId}>
          <Select
            options={parcelasOptions}
            placeholder={loadingParcelas ? "Cargando..." : "Seleccione la parcela"}
            value={value.parcelaId}
            onChange={handleParcelaChange}
          />
        </Field>

        <Field label="Cultivo" mode={mode} value={value.cultivo} required error={errors?.cultivoId}>
          <Select
            options={cultivosOptions}
            placeholder={!value.parcelaId ? "Primero seleccione una parcela" : loadingCultivos ? "Cargando..." : "Seleccione el cultivo"}
            value={value.cultivoId}
            onChange={(v) => {
              const cultivo = cultivosOptions.find((o) => o.value === v);
              onChange?.({ cultivoId: v, cultivo: cultivo?.label ?? "" });
            }}
            disabled={!value.parcelaId}
          />
        </Field>

        <Field label="Tipo de Actividad" mode={mode} value={value.tipoActividad} required error={errors?.tipoActividad}>
          <Select
            options={tipoOptions}
            placeholder="Seleccione el tipo"
            value={value.tipoActividad}
            onChange={(v) => onChange?.({ tipoActividad: v })}
          />
        </Field>

        <Field label="Responsable Técnico" mode={mode} value={value.responsableTecnico} required error={errors?.responsableTecnico}>
          <Input
            value={value.responsableTecnico}
            disabled={!editable}
            onChange={(e) => onChange?.({ responsableTecnico: e.target.value })}
            placeholder="Nombre del responsable"
          />
        </Field>

        <div className="sm:col-span-2 lg:col-span-3">
          <Field label="Descripción" mode={mode} value={value.descripcion}>
            <Textarea
              rows={3}
              value={value.descripcion}
              disabled={!editable}
              onChange={(e) => onChange?.({ descripcion: e.target.value })}
              placeholder="Detalla la labor realizada..."
            />
          </Field>
        </div>
      </div>
    </CardShell>
  );
}
