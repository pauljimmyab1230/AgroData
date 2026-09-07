import { GraduationCap, MapPin, PieChart, Wheat } from "lucide-react";
import type { ReactNode } from "react";
import { CardHeader, CardShell } from "../shared/formControls";
import type { CampaniaStats } from "../../services/campanias";

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

interface ResumenProductivoCardProps {
  stats?: CampaniaStats | null;
}

export function ResumenProductivoCard({ stats }: ResumenProductivoCardProps) {
  const cultivosPorTipo = stats?.cultivosPorTipo ?? {};
  const cultivosEntries = Object.entries(cultivosPorTipo).sort((a, b) => b[1] - a[1]);

  return (
    <CardShell>
      <CardHeader
        icon={<PieChart size={20} />}
        title="Resumen Productivo"
        description="Distribución de cultivos y productores en la campaña"
      />

      <div className="space-y-6">
        <Seccion icon={<Wheat size={16} />} titulo="Cultivos Principales">
          {cultivosEntries.length > 0 ? (
            <div className="space-y-2">
              {cultivosEntries.map(([nombre, count]) => (
                <div key={nombre} className="flex items-center justify-between text-sm">
                  <span className="text-gray-700">{nombre}</span>
                  <span className="font-medium text-[#111827]">{count}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-gray-400">Sin datos registrados en esta campaña.</p>
          )}
        </Seccion>

        <Seccion icon={<MapPin size={16} />} titulo="Distribución por Comunidad">
          {stats && stats.parcelas > 0 ? (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-700">Parcelas</span>
                <span className="font-medium text-[#111827]">{stats.parcelas} parcelas</span>
              </div>
            </div>
          ) : (
            <p className="text-xs text-gray-400">Sin datos registrados en esta campaña.</p>
          )}
        </Seccion>

        <Seccion icon={<GraduationCap size={16} />} titulo="Resumen General">
          {stats ? (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-700">Área total cultivada</span>
                <span className="font-medium text-[#111827]">{stats.areaSembrada} ha</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-700">Total cultivos</span>
                <span className="font-medium text-[#111827]">{stats.cultivos}</span>
              </div>
            </div>
          ) : (
            <p className="text-xs text-gray-400">Sin datos registrados en esta campaña.</p>
          )}
        </Seccion>
      </div>
    </CardShell>
  );
}
