import { useState } from "react";
import { CheckCircle2, ClipboardCheck, MinusCircle, XCircle, type LucideIcon } from "lucide-react";
import { Input, Select } from "../ui";
import { CardHeader, CardShell, Field, type FormMode } from "../shared/formControls";
import { CumplimientoBadge, RiesgoBadge } from "./badges";
import {
  crearChecklist,
  riesgosOpciones,
  type CriterioChecklist,
  type Cumplimiento,
  type Inspeccion,
  type Riesgo,
} from "../../services/inspecciones";

type ChecklistCardProps = {
  mode: FormMode;
  values?: Partial<Inspeccion>;
};

const opciones: { value: Cumplimiento; label: string; active: string; icon: LucideIcon }[] = [
  {
    value: "CUMPLE",
    label: "Cumple",
    active: "border-forest-600 bg-forest-600 text-white",
    icon: CheckCircle2,
  },
  {
    value: "NO_CUMPLE",
    label: "No Cumple",
    active: "border-red-600 bg-red-600 text-white",
    icon: XCircle,
  },
  {
    value: "NO_APLICA",
    label: "No Aplica",
    active: "border-gray-700 bg-gray-700 text-white",
    icon: MinusCircle,
  },
];

const toOptions = (items: string[]) => items.map((item) => ({ value: item, label: item }));

function contarCumplimiento(criterios: CriterioChecklist[]) {
  return {
    cumple: criterios.filter((c) => c.cumplimiento === "CUMPLE").length,
    noCumple: criterios.filter((c) => c.cumplimiento === "NO_CUMPLE").length,
    noAplica: criterios.filter((c) => c.cumplimiento === "NO_APLICA").length,
    sinEvaluar: criterios.filter((c) => c.cumplimiento === null).length,
  };
}

function ResumenChecklist({ criterios }: { criterios: CriterioChecklist[] }) {
  const conteo = contarCumplimiento(criterios);

  const chips = [
    { label: "Cumple", value: conteo.cumple, className: "bg-forest-50 text-forest-700" },
    { label: "No Cumple", value: conteo.noCumple, className: "bg-red-50 text-red-700" },
    { label: "No Aplica", value: conteo.noAplica, className: "bg-gray-100 text-gray-600" },
    { label: "Sin evaluar", value: conteo.sinEvaluar, className: "bg-amber-50 text-amber-700" },
  ];

  return (
    <div className="mb-6 flex flex-wrap gap-2">
      {chips.map((chip) => (
        <span
          key={chip.label}
          className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${chip.className}`}
        >
          {chip.value} {chip.label}
        </span>
      ))}
    </div>
  );
}

function DetalleCriterio({ criterio }: { criterio: CriterioChecklist }) {
  return (
    <div className="mt-3 flex flex-wrap items-center gap-x-6 gap-y-2 rounded-xl bg-gray-50/50 px-4 py-3">
      <div className="flex items-center gap-2">
        <span className="text-xs font-medium text-gray-500">Nivel de riesgo</span>
        <RiesgoBadge riesgo={criterio.riesgo} />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-xs font-medium text-gray-500">Observación</p>
        <p className="text-sm text-[#111827]">{criterio.observacion || "Sin observaciones."}</p>
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-xs font-medium text-gray-500">Evidencia asociada</p>
        <p className="text-sm text-[#111827]">{criterio.evidencia || "Sin evidencia registrada."}</p>
      </div>
    </div>
  );
}

export function ChecklistCard({ mode, values }: ChecklistCardProps) {
  const editable = mode !== "view";
  const [criterios, setCriterios] = useState<CriterioChecklist[]>(() =>
    editable ? values?.checklist ?? crearChecklist() : [],
  );

  const list = editable ? criterios : (values?.checklist ?? []);

  const setCumplimiento = (index: number, cumplimiento: Cumplimiento) => {
    setCriterios((prev) => prev.map((c, i) => (i === index ? { ...c, cumplimiento } : c)));
  };

  const setCampo = (index: number, campo: "riesgo" | "observacion" | "evidencia", valor: string) => {
    setCriterios((prev) =>
      prev.map((c, i) => (i === index ? ({ ...c, [campo]: valor } as CriterioChecklist) : c)),
    );
  };

  return (
    <CardShell>
      <CardHeader
        icon={<ClipboardCheck size={20} />}
        title="Lista de Verificación"
        description="Criterios evaluados durante la inspección de campo"
      />

      {editable && <ResumenChecklist criterios={criterios} />}

      <div className="space-y-3">
        {list.map((criterio, index) => (
          <div key={index} className="rounded-xl border border-gray-200 bg-white p-4">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-3">
                <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-forest-600/10 text-forest-600">
                  <ClipboardCheck size={16} />
                </span>
                <div>
                  <p className="text-sm font-medium text-[#111827]">{criterio.criterio}</p>
                  <p className="text-xs text-gray-500">
                    Criterio {index + 1} de {list.length}
                  </p>
                </div>
              </div>

              {editable ? (
                <div className="flex shrink-0 flex-wrap gap-2">
                  {opciones.map((op) => (
                    <button
                      key={op.value}
                      type="button"
                      onClick={() => setCumplimiento(index, op.value)}
                      className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-semibold transition-all ${
                        criterio.cumplimiento === op.value
                          ? op.active
                          : "border-gray-200 bg-gray-50 text-gray-500 hover:border-forest-300 hover:text-forest-700"
                      }`}
                    >
                      <op.icon size={13} />
                      {op.label}
                    </button>
                  ))}
                </div>
              ) : (
                <div className="flex shrink-0 flex-wrap items-center gap-2">
                  <CumplimientoBadge cumplimiento={criterio.cumplimiento} />
                  <RiesgoBadge riesgo={criterio.riesgo} />
                </div>
              )}
            </div>

            {editable ? (
              <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <Field label="Observación" mode={mode} value={criterio.observacion} className="sm:col-span-2 lg:col-span-1">
                  <Input
                    placeholder="Observación del criterio..."
                    value={criterio.observacion}
                    onChange={(e) => setCampo(index, "observacion", e.target.value)}
                  />
                </Field>
                <Field label="Evidencia asociada" mode={mode} value={criterio.evidencia} className="sm:col-span-2 lg:col-span-1">
                  <Input
                    placeholder="Ej. Fotografía 1 - Vista general"
                    value={criterio.evidencia}
                    onChange={(e) => setCampo(index, "evidencia", e.target.value)}
                  />
                </Field>
                <Field label="Nivel de riesgo" mode={mode} value={criterio.riesgo}>
                  <Select
                    options={toOptions(riesgosOpciones)}
                    placeholder="Seleccione"
                    value={criterio.riesgo}
                    onChange={(val) => setCampo(index, "riesgo", val as Riesgo)}
                  />
                </Field>
              </div>
            ) : (
              <DetalleCriterio criterio={criterio} />
            )}
          </div>
        ))}
      </div>
    </CardShell>
  );
}
