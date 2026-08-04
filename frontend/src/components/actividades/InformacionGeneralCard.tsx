import { ClipboardList } from "lucide-react";
import { Input, Select } from "../ui";
import { CardHeader, CardShell, Field, type FormMode } from "../shared/formControls";
import {
  campaniasOpciones,
  cultivosOpciones,
  parcelasOpciones,
  productoresOpciones,
  tecnicosOpciones,
  formatearFecha,
  type ActividadFormData,
} from "../../pages/actividades/actividadMock";

type InformacionGeneralCardProps = {
  mode: FormMode;
  value: ActividadFormData;
  onChange?: (patch: Partial<ActividadFormData>) => void;
};

const toOptions = (items: string[]) => items.map((item) => ({ value: item, label: item }));

export function InformacionGeneralCard({ mode, value, onChange }: InformacionGeneralCardProps) {
  const editable = mode !== "view";

  const parcelasDisponibles = value.productor
    ? parcelasOpciones.filter((p) => p.productor === value.productor)
    : parcelasOpciones;

  const parcelasOptions = parcelasDisponibles.map((p) => ({
    value: p.nombre,
    label: `${p.codigo} - ${p.nombre}`,
  }));

  const handleProductorChange = (productor: string) => {
    onChange?.({ productor, parcela: "", cultivo: "" });
  };

  const handleParcelaChange = (parcela: string) => {
    const seleccionada = parcelasOpciones.find((p) => p.nombre === parcela);
    onChange?.({
      parcela,
      productor: value.productor || seleccionada?.productor || "",
      cultivo: seleccionada?.cultivoPrincipal || value.cultivo,
    });
  };

  return (
    <CardShell>
      <CardHeader
        icon={<ClipboardList size={20} />}
        title="Información General"
        description="Datos básicos de la actividad agrícola"
      />

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <Field label="Código" mode={mode} value={value.codigo}>
          <Input
            value={value.codigo}
            disabled
            placeholder={mode === "create" ? "Se genera automáticamente" : undefined}
          />
        </Field>

        <Field label="Fecha" mode={mode} value={formatearFecha(value.fecha)} required>
          <Input
            type="date"
            value={value.fecha}
            onChange={(e) => onChange?.({ fecha: e.target.value })}
          />
        </Field>

        <Field label="Campaña" mode={mode} value={value.campania} required>
          <Select
            options={toOptions(campaniasOpciones)}
            placeholder="Seleccione"
            value={value.campania}
            onChange={(v) => onChange?.({ campania: v })}
          />
        </Field>

        <Field label="Productor" mode={mode} value={value.productor} required>
          <Select
            options={toOptions(productoresOpciones)}
            placeholder="Seleccione"
            value={value.productor}
            onChange={handleProductorChange}
          />
        </Field>

        <Field label="Parcela" mode={mode} value={value.parcela} required>
          <Select
            options={parcelasOptions}
            placeholder={value.productor ? "Seleccione parcela del productor" : "Seleccione un productor primero"}
            value={value.parcela}
            onChange={handleParcelaChange}
          />
        </Field>

        <Field label="Cultivo" mode={mode} value={value.cultivo} required>
          <Select
            options={toOptions(cultivosOpciones)}
            placeholder="Seleccione"
            value={value.cultivo}
            onChange={(v) => onChange?.({ cultivo: v })}
          />
        </Field>

        <Field label="Responsable Técnico" mode={mode} value={value.responsableTecnico} required>
          <Select
            options={toOptions(tecnicosOpciones)}
            placeholder="Seleccione"
            value={value.responsableTecnico}
            onChange={(v) => onChange?.({ responsableTecnico: v })}
          />
        </Field>

        {editable && (
          <div className="flex items-end text-xs text-gray-400 sm:col-span-2 lg:col-span-2">
            <span>Al seleccionar un productor se muestran sus parcelas registradas.</span>
          </div>
        )}
      </div>
    </CardShell>
  );
}
