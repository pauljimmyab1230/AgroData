import { Package, Plus, X } from "lucide-react";
import { Badge, Button, Select } from "../ui";
import { CardHeader, CardShell, type FormMode } from "../shared/formControls";
import { formatKg, lotesProductorDisponibles, type OrdenProcesamiento } from "../../services/procesamientos";

type MateriaPrimaCardProps = {
  mode: FormMode;
  values?: Partial<OrdenProcesamiento>;
};

const toOptions = (items: string[]) => items.map((item) => ({ value: item, label: item }));

export function MateriaPrimaCard({ mode, values }: MateriaPrimaCardProps) {
  const editable = mode !== "view";
  const [loteDisponible, setLoteDisponible] = useState("");

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
