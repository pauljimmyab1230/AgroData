import { History } from "lucide-react";
import { CardHeader, CardShell } from "../shared/formControls";

export function CampaniaTimeline() {
  return (
    <CardShell>
      <CardHeader
        icon={<History size={20} />}
        title="Historial de la Campaña"
        description="Eventos y hitos registrados de la campaña"
      />

      <div className="flex flex-col items-center justify-center gap-2 py-8 text-center">
        <History size={28} className="text-gray-300" />
        <p className="text-sm text-gray-400">Sin eventos registrados</p>
        <p className="text-xs text-gray-400">Los eventos aparecerán aquí cuando se registren actividades en la campaña.</p>
      </div>
    </CardShell>
  );
}
