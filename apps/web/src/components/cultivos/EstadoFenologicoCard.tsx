import { useState } from "react";
import { Sprout } from "lucide-react";
import { Select } from "../ui";
import { CardHeader, CardShell, Field, type FormMode } from "../shared/formControls";
import { fenologicoOpciones, type Cultivo } from "../../services/cultivos";

type EstadoFenologicoCardProps = {
  mode: FormMode;
  values?: Partial<Cultivo>;
};

const toOptions = (items: string[]) => items.map((item) => ({ value: item, label: item }));

function FenologiaTimeline({ etapas, indiceActual }: { etapas: string[]; indiceActual: number }) {
  return (
    <div>
      <div className="flex">
        {etapas.map((etapa, index) => {
          const alcanzada = indiceActual !== -1 && index <= indiceActual;
          const actual = index === indiceActual;

          return (
            <div key={etapa} className="flex flex-1 flex-col items-center gap-2">
              <div className="relative flex w-full items-center justify-center">
                {index > 0 && (
                  <span
                    className="absolute top-1/2 h-0.5 -translate-y-1/2 bg-gray-200"
                    style={{ left: "calc(-50% + 8px)", right: "calc(50% + 8px)" }}
                  />
                )}
                <span
                  className={`relative z-10 h-4 w-4 rounded-full border-2 transition-colors ${
                    actual
                      ? "border-forest-600 bg-forest-600 ring-4 ring-forest-600/20"
                      : alcanzada
                        ? "border-forest-600 bg-white"
                        : "border-gray-300 bg-white"
                  }`}
                />
              </div>
              <span
                className={`text-center text-[11px] leading-tight ${
                  actual
                    ? "font-semibold text-forest-700"
                    : alcanzada
                      ? "text-gray-600"
                      : "text-gray-400"
                }`}
              >
                {etapa}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function EstadoFenologicoCard({ mode, values }: EstadoFenologicoCardProps) {
  const [etapa, setEtapa] = useState(values?.estadoFenologico ?? "");
  const indiceActual = fenologicoOpciones.indexOf(etapa);

  return (
    <CardShell>
      <CardHeader
        icon={<Sprout size={20} />}
        title="Estado Fenológico"
        description="Etapa actual del desarrollo del cultivo"
      />

      <div className="mb-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <Field label="Etapa Actual" mode={mode} value={etapa} required>
          <Select
            options={toOptions(fenologicoOpciones)}
            placeholder="Seleccione la etapa"
            value={etapa}
            onChange={setEtapa}
            required
          />
        </Field>
      </div>

      <FenologiaTimeline etapas={fenologicoOpciones} indiceActual={indiceActual} />
    </CardShell>
  );
}
