import { ClipboardList } from "lucide-react";
import { Input, Select } from "../ui";
import { CardHeader, CardShell, Field, type FormMode } from "../shared/formControls";
import { formatearFecha, type ActividadFormData } from "../../services/actividades";
import { fetchCultivos } from "../../services/cultivos";
import { useEffect, useState } from "react";

type DropdownOption = { value: string; label: string };

type InformacionGeneralCardProps = {
  mode: FormMode;
  value: ActividadFormData;
  onChange?: (patch: Partial<ActividadFormData>) => void;
};

export function InformacionGeneralCard({ mode, value, onChange }: InformacionGeneralCardProps) {
  const editable = mode !== "view";

  const [cultivosOptions, setCultivosOptions] = useState<DropdownOption[]>([]);
  const [loadingCultivos, setLoadingCultivos] = useState(false);

  useEffect(() => {
    setLoadingCultivos(true);
    fetchCultivos({ limit: 200 })
      .then((res) => setCultivosOptions(res.data.map((c: any) => ({ value: String(c.id), label: `${c.codigo} - ${c.cultivo}` }))))
      .catch(() => {})
      .finally(() => setLoadingCultivos(false));
  }, []);

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
          <Input
            type="date"
            value={value.fecha}
            disabled={!editable}
            onChange={(e) => onChange?.({ fecha: e.target.value })}
          />
        </Field>

        <Field label="Cultivo" mode={mode} value={value.cultivo} required>
          <Select
            options={cultivosOptions}
            placeholder={loadingCultivos ? "Cargando..." : "Seleccione cultivo"}
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

        <Field label="Jornales" mode={mode} value={value.jornales}>
          <Input
            type="number"
            value={value.jornales}
            disabled={!editable}
            onChange={(e) => onChange?.({ jornales: e.target.value })}
            placeholder="0"
            min="0"
          />
        </Field>
      </div>
    </CardShell>
  );
}
