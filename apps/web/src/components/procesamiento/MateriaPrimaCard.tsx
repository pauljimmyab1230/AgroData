import { Package } from "lucide-react";
import { Badge } from "../ui";
import { CardHeader, CardShell, Field, type FormMode } from "../shared/formControls";
import type { OrdenProcesamiento } from "../../services/procesamientos";

type MateriaPrimaCardProps = {
  mode: FormMode;
  values?: Partial<OrdenProcesamiento>;
};

export function MateriaPrimaCard({ mode, values }: MateriaPrimaCardProps) {
  const lotesActuales = values?.lotes ?? [];

  return (
    <CardShell>
      <CardHeader
        icon={<Package size={20} />}
        title="Materia Prima"
        description="Lotes del productor utilizados en el procesamiento"
      />

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <Field label="LP Seleccionados" mode={mode} value={lotesActuales.length > 0 ? `${lotesActuales.length} LP` : undefined}>
          <div className="flex flex-wrap gap-2">
            {lotesActuales.length > 0 ? (
              lotesActuales.map((lp) => (
                <Badge key={lp} variant="purple">{lp}</Badge>
              ))
            ) : (
              <p className="text-sm text-gray-400">Sin LP seleccionados</p>
            )}
          </div>
        </Field>
      </div>
    </CardShell>
  );
}
