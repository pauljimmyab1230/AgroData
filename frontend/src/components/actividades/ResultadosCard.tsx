import { Flag, ListTodo, TrendingUp } from "lucide-react";
import { Select, Textarea } from "../ui";
import { CardHeader, CardShell, Field, type FormMode } from "../shared/formControls";
import { tiposActividad, type ActividadFormData } from "../../pages/actividades/actividadMock";

type ResultadosCardProps = {
  mode: FormMode;
  value: ActividadFormData;
  onChange?: (patch: Partial<ActividadFormData>) => void;
};

const proximaOptions = tiposActividad.map((tipo) => ({ value: tipo, label: tipo }));

export function ResultadosCard({ mode, value, onChange }: ResultadosCardProps) {
  const editable = mode !== "view";

  return (
    <CardShell>
      <CardHeader
        icon={<TrendingUp size={20} />}
        title="Resultados de la Actividad"
        description="Objetivo, resultado obtenido y próxima actividad recomendada"
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <Field label="Objetivo de la Actividad" mode={mode} value={value.objetivo}>
            <Textarea
              rows={4}
              value={value.objetivo}
              onChange={(e) => onChange?.({ objetivo: e.target.value })}
              placeholder="¿Cuál era el objetivo de esta actividad?"
            />
          </Field>
        </div>

        <div className="lg:col-span-1">
          <Field label="Resultado Obtenido" mode={mode} value={value.resultado}>
            <Textarea
              rows={4}
              value={value.resultado}
              onChange={(e) => onChange?.({ resultado: e.target.value })}
              placeholder="Describe el resultado obtenido..."
            />
          </Field>
        </div>

        <div className="lg:col-span-1">
          <Field label="Próxima Actividad Recomendada" mode={mode} value={value.proximaActividad}>
            {editable ? (
              <div className="space-y-4">
                <Select
                  options={proximaOptions}
                  placeholder="Seleccione la próxima actividad"
                  value={value.proximaActividad}
                  onChange={(v) => onChange?.({ proximaActividad: v })}
                />
                <div className="flex items-start gap-2 rounded-xl border border-forest-100 bg-forest-50/60 px-4 py-3">
                  <Flag className="mt-0.5 h-4 w-4 shrink-0 text-forest-600" />
                  <p className="text-xs text-forest-700">
                    Esta recomendación se usará al generar el historial de actividades de la parcela.
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center gap-2 rounded-xl border border-forest-100 bg-forest-50/60 px-4 py-3">
                  <ListTodo className="h-4 w-4 shrink-0 text-forest-600" />
                  <p className="text-sm font-medium text-forest-700">{value.proximaActividad || "—"}</p>
                </div>
              </div>
            )}
          </Field>
        </div>
      </div>
    </CardShell>
  );
}
