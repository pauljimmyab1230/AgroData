import { Crosshair, Locate, MapPin } from "lucide-react";
import { Button, Input } from "../ui";
import { CardHeader, CardShell, Field, type FormMode } from "../shared/formControls";
import type { Inspeccion } from "../../services/inspecciones";

type MapaCardProps = {
  mode: FormMode;
  values?: Partial<Inspeccion>;
};

function MapaSimulado({
  latitud,
  longitud,
  altitud,
}: {
  latitud?: string;
  longitud?: string;
  altitud?: string;
}) {
  return (
    <div className="relative h-[26rem] overflow-hidden rounded-xl border border-gray-200 bg-slate-50">
      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 800 400"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden
      >
        <defs>
          <pattern id="inspeccion-grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#e2e8f0" strokeWidth="1" />
          </pattern>
        </defs>

        <rect width="800" height="400" fill="url(#inspeccion-grid)" />

        <path
          d="M 70 50 L 240 40 L 290 150 L 120 170 Z"
          fill="#dcfce7"
          stroke="#16a34a"
          strokeOpacity="0.5"
        />
        <path
          d="M 400 90 L 590 60 L 640 190 L 430 210 Z"
          fill="#e9f7d9"
          stroke="#65a30d"
          strokeOpacity="0.4"
        />
        <path
          d="M 360 240 L 510 220 L 540 300 L 380 310 Z"
          fill="#fef9c3"
          stroke="#f59e0b"
          strokeOpacity="0.4"
        />

        <path
          d="M -10 300 C 150 260 300 340 470 300 S 700 260 810 300"
          fill="none"
          stroke="#93c5fd"
          strokeWidth="8"
          strokeLinecap="round"
          opacity="0.6"
        />
        <path
          d="M 100 -10 C 180 120 160 240 230 410"
          fill="none"
          stroke="#fbbf24"
          strokeWidth="10"
          strokeLinecap="round"
          opacity="0.7"
        />
      </svg>

      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <div className="relative flex flex-col items-center">
          <MapPin className="h-8 w-8 text-forest-700 drop-shadow-md" />
          <div className="mt-0.5 flex items-center gap-1 rounded-full bg-white/90 px-2.5 py-0.5 text-xs font-semibold text-[#111827] shadow-sm ring-1 ring-gray-200">
            <Crosshair className="h-3 w-3 text-forest-600" />
            {latitud && longitud
              ? `${latitud}, ${longitud}${altitud ? ` · ${altitud} m s.n.m.` : ""}`
              : "Ubicación"}
          </div>
        </div>
      </div>

      <div className="absolute bottom-2 left-2 rounded-md bg-white/80 px-2 py-1 text-[10px] font-medium text-gray-500 ring-1 ring-gray-200">
        Vista previa del mapa (mock)
      </div>
    </div>
  );
}

export function MapaCard({ mode, values }: MapaCardProps) {
  const editable = mode !== "view";

  return (
    <CardShell>
      <CardHeader
        icon={<MapPin size={20} />}
        title="Georreferencia"
        description="Coordenadas de la ubicación donde se realizó la inspección"
      />

      <div className="grid gap-6 sm:grid-cols-2">
        <Field label="Latitud" mode={mode} value={values?.latitud}>
          <div className="relative">
            <Input
              type="text"
              placeholder="Ej. -13.6532"
              defaultValue={editable ? values?.latitud : undefined}
              className="pr-14"
            />
            <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-gray-400">
              S
            </span>
          </div>
        </Field>

        <Field label="Longitud" mode={mode} value={values?.longitud}>
          <div className="relative">
            <Input
              type="text"
              placeholder="Ej. -73.8741"
              defaultValue={editable ? values?.longitud : undefined}
              className="pr-14"
            />
            <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-gray-400">
              W
            </span>
          </div>
        </Field>

        <Field label="Altitud" mode={mode} value={values?.altitud}>
          <div className="relative">
            <Input
              type="text"
              placeholder="Ej. 3850"
              defaultValue={editable ? values?.altitud : undefined}
              className="pr-12"
            />
            <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-gray-400">
              m s.n.m.
            </span>
          </div>
        </Field>

        <Field label="Precisión GPS" mode={mode} value={values?.precisionGps}>
          <div className="relative">
            <Input
              type="text"
              placeholder="Ej. ±5 m"
              defaultValue={editable ? values?.precisionGps : undefined}
              className="pr-12"
            />
            <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-gray-400">
              GPS
            </span>
          </div>
        </Field>
      </div>

      <div className="mt-8">
        <MapaSimulado latitud={values?.latitud} longitud={values?.longitud} altitud={values?.altitud} />
        {editable && (
          <Button variant="secondary" className="mt-4" iconLeft={<Locate className="h-4 w-4" />}>
            Obtener Ubicación
          </Button>
        )}
      </div>
    </CardShell>
  );
}
