import { GraduationCap, MapPin, PieChart, Ruler, Wheat } from "lucide-react";
import type { ReactNode } from "react";
import { CardHeader, CardShell } from "../shared/formControls";
import { campaniaResumenProductivoMock } from "../../pages/campañas/campaniaMock";

const iniciales = (nombre: string) =>
  nombre
    .split(" ")
    .map((parte) => parte[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

function Seccion({ icon, titulo, children }: { icon: ReactNode; titulo: string; children: ReactNode }) {
  return (
    <div>
      <p className="mb-3 flex items-center gap-2 text-sm font-semibold text-[#111827]">
        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-forest-600/10 text-forest-600">
          {icon}
        </span>
        {titulo}
      </p>
      {children}
    </div>
  );
}

export function ResumenProductivoCard() {
  const { cultivosPrincipales, comunidades, tecnicos, areaPromedioProductor } =
    campaniaResumenProductivoMock;

  return (
    <CardShell>
      <CardHeader
        icon={<PieChart size={20} />}
        title="Resumen Productivo"
        description="Panorama general de la actividad productiva de la campaña"
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <Seccion icon={<Wheat className="h-4 w-4" />} titulo="Cultivos Principales">
          <div className="flex flex-wrap gap-2">
            {cultivosPrincipales.map((cultivo) => (
              <span
                key={cultivo}
                className="inline-flex items-center rounded-full bg-forest-600/10 px-3 py-1 text-xs font-medium text-forest-700"
              >
                {cultivo}
              </span>
            ))}
          </div>
        </Seccion>

        <Seccion icon={<MapPin className="h-4 w-4" />} titulo="Comunidades Participantes">
          <div className="flex flex-wrap gap-2">
            {comunidades.map((comunidad) => (
              <span
                key={comunidad}
                className="inline-flex items-center rounded-full bg-sun-100 px-3 py-1 text-xs font-medium text-sun-700"
              >
                {comunidad}
              </span>
            ))}
          </div>
        </Seccion>

        <Seccion icon={<GraduationCap className="h-4 w-4" />} titulo="Técnicos Responsables">
          <div className="flex flex-wrap gap-2">
            {tecnicos.map((tecnico) => (
              <div
                key={tecnico}
                className="flex items-center gap-2.5 rounded-xl border border-gray-200 bg-gray-50/60 px-3 py-2"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-forest-600 text-xs font-semibold text-white">
                  {iniciales(tecnico)}
                </span>
                <span className="text-sm font-medium text-[#111827]">{tecnico}</span>
              </div>
            ))}
          </div>
        </Seccion>

        <Seccion icon={<Ruler className="h-4 w-4" />} titulo="Área Promedio por Productor">
          <div className="flex items-center gap-4 rounded-2xl border border-forest-100 bg-forest-50/70 p-5">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-forest-600 to-forest-400 text-white">
              <Ruler className="h-6 w-6" />
            </div>
            <div>
              <p className="text-2xl font-bold text-[#111827]">{areaPromedioProductor}</p>
              <p className="text-xs text-gray-500">por productor inscrito</p>
            </div>
          </div>
        </Seccion>
      </div>
    </CardShell>
  );
}
