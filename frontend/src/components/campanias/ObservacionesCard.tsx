import { MessageSquareText } from "lucide-react";
import { Textarea } from "../ui";
import { CardHeader, CardShell, Field, type FormMode } from "../shared/formControls";
import type { CampaniaFormData } from "../../pages/campañas/campaniaMock";

type ObservacionesCardProps = {
  mode: FormMode;
  value: CampaniaFormData;
  onChange?: (patch: Partial<CampaniaFormData>) => void;
};

export function ObservacionesCard({ mode, value, onChange }: ObservacionesCardProps) {
  const editable = mode !== "view";

  return (
    <CardShell>
      <CardHeader
        icon={<MessageSquareText size={20} />}
        title="Observaciones"
        description="Notas y consideraciones generales de la campaña"
      />

      {editable ? (
        <Textarea
          rows={4}
          value={value.observaciones}
          onChange={(e) => onChange?.({ observaciones: e.target.value })}
          placeholder="Escribe aquí las observaciones generales de la campaña..."
        />
      ) : (
        <Field label="Observaciones Generales" mode="view" value={value.observaciones} />
      )}
    </CardShell>
  );
}
