import { MessageSquareText, Sparkles } from "lucide-react";
import { Textarea } from "../ui";
import { CardHeader, CardShell, Field, type FormMode } from "../shared/formControls";
import type { ActividadFormData } from "../../pages/actividades/actividadMock";

type ObservacionesCardProps = {
  mode: FormMode;
  value: ActividadFormData;
  onChange?: (patch: Partial<ActividadFormData>) => void;
};

export function ObservacionesCard({ mode, value, onChange }: ObservacionesCardProps) {
  const editable = mode !== "view";

  return (
    <CardShell>
      <CardHeader
        icon={<MessageSquareText size={20} />}
        title="Observaciones"
        description="Observaciones técnicas y recomendaciones de la actividad"
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <div>
          <Field label="Observaciones Técnicas" mode={mode} value={value.observacionesTecnicas}>
            <Textarea
              rows={5}
              value={value.observacionesTecnicas}
              onChange={(e) => onChange?.({ observacionesTecnicas: e.target.value })}
              placeholder="Escribe aquí las observaciones técnicas de la actividad..."
            />
          </Field>
        </div>

        <div>
          <Field label="Recomendaciones" mode={mode} value={value.recomendaciones}>
            <Textarea
              rows={5}
              value={value.recomendaciones}
              onChange={(e) => onChange?.({ recomendaciones: e.target.value })}
              placeholder="Escribe aquí las recomendaciones para próximas labores..."
            />
          </Field>
        </div>
      </div>

      {!editable && (
        <div className="mt-4 flex items-start gap-2 rounded-xl border border-sun-100 bg-sun-50/60 px-4 py-3">
          <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-sun-600" />
          <p className="text-xs text-sun-700">
            Las recomendaciones registradas se considerarán al programar las próximas actividades de la parcela.
          </p>
        </div>
      )}
    </CardShell>
  );
}
