import { GraduationCap, MapPin, PieChart, Wheat } from "lucide-react";
import type { ReactNode } from "react";
import { CardHeader, CardShell } from "../shared/formControls";

function Seccion({ icon, titulo, children }: { icon: ReactNode; titulo: string; children: ReactNode }) {
  return (
    <div>
      <p className="mb-3 flex items-center gap-2 text-sm font-semibold text-[#111827]">
        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-forest-600/10 text-forest-600">
          {icon}
        </span>
        {titulo}
      </p>
      <div className="space-y-2">{children}</div>
    </div>
  );
}

export function ResumenProductivoCard() {
  return (
    <CardShell>
      <CardHeader
        icon={<PieChart size={20} />}
        title="Resumen Productivo"
        description="Distribución de cultivos y productores en la campaña"
      />

      <div className="space-y-6">
        <Seccion icon={<Wheat size={16} />} titulo="Cultivos Principales">
          <p className="text-xs text-gray-400">Sin datos registrados en esta campaña.</p>
        </Seccion>

        <Seccion icon={<MapPin size={16} />} titulo="Distribución por Comunidad">
          <p className="text-xs text-gray-400">Sin datos registrados en esta campaña.</p>
        </Seccion>

        <Seccion icon={<GraduationCap size={16} />} titulo="Nivel Educativo">
          <p className="text-xs text-gray-400">Sin datos registrados en esta campaña.</p>
        </Seccion>
      </div>
    </CardShell>
  );
}
