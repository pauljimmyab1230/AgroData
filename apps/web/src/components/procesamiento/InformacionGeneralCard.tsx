import { ClipboardList } from "lucide-react";
import { Input, Select } from "../ui";
import { CardHeader, CardShell, Field, type FormMode } from "../shared/formControls";

type InformacionGeneralCardProps = {
  mode: FormMode;
  fechaInicio: string;
  fechaFin: string;
  producto: string;
  responsable: string;
  planta: string;
  lineaProcesamiento: string;
  estado: string;
  errors: Record<string, string>;
  onChange: {
    fechaInicio: (v: string) => void;
    fechaFin: (v: string) => void;
    producto: (v: string) => void;
    responsable: (v: string) => void;
    planta: (v: string) => void;
    lineaProcesamiento: (v: string) => void;
    estado: (v: string) => void;
  };
};

const lineaOptions = [
  { value: "GRANOS", label: "Granos" },
  { value: "TUBERCULOS", label: "Tubérculos" },
  { value: "LEGUMBRES", label: "Legumbres" },
  { value: "SEMILLAS", label: "Semillas" },
];

const estadoOptions = [
  { value: "REGISTRADA", label: "Registrada" },
  { value: "EN_PROCESO", label: "En Proceso" },
  { value: "COMPLETADA", label: "Completada" },
  { value: "PAUSADA", label: "Pausada" },
  { value: "CANCELADA", label: "Cancelada" },
];

export function InformacionGeneralCard({
  mode,
  fechaInicio,
  fechaFin,
  producto,
  responsable,
  planta,
  lineaProcesamiento,
  estado,
  errors,
  onChange,
}: InformacionGeneralCardProps) {
  const editable = mode !== "view";

  return (
    <CardShell>
      <CardHeader
        icon={<ClipboardList size={20} />}
        title="Información General"
        description="Datos básicos de la orden de procesamiento"
      />

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <Field label="Fecha Inicio" mode={mode} value={fechaInicio} required error={errors.fechaInicio}>
          <Input
            type="date"
            value={fechaInicio}
            onChange={(e) => onChange.fechaInicio(e.target.value)}
            disabled={!editable}
          />
        </Field>

        <Field label="Fecha Fin" mode={mode} value={fechaFin}>
          <Input
            type="date"
            value={fechaFin}
            onChange={(e) => onChange.fechaFin(e.target.value)}
            disabled={!editable}
          />
        </Field>

        <Field label="Producto" mode={mode} value={producto} required error={errors.producto}>
          <Input
            type="text"
            value={producto}
            onChange={(e) => onChange.producto(e.target.value)}
            placeholder="Ej. Quinua procesada"
            disabled={!editable}
          />
        </Field>

        <Field label="Responsable" mode={mode} value={responsable} required error={errors.responsable}>
          <Input
            type="text"
            value={responsable}
            onChange={(e) => onChange.responsable(e.target.value)}
            placeholder="Nombre del responsable"
            disabled={!editable}
          />
        </Field>

        <Field label="Planta" mode={mode} value={planta} required error={errors.planta}>
          <Input
            type="text"
            value={planta}
            onChange={(e) => onChange.planta(e.target.value)}
            placeholder="Ej. Planta Procesadora Central"
            disabled={!editable}
          />
        </Field>

        <Field label="Línea de Procesamiento" mode={mode} value={lineaProcesamiento}>
          <Select
            options={lineaOptions}
            value={lineaProcesamiento}
            onChange={(val) => onChange.lineaProcesamiento(val)}
            disabled={!editable}
          />
        </Field>

        <Field label="Estado" mode={mode} value={estado}>
          <Select
            options={estadoOptions}
            value={estado}
            onChange={(val) => onChange.estado(val)}
            disabled={!editable}
          />
        </Field>
      </div>
    </CardShell>
  );
}