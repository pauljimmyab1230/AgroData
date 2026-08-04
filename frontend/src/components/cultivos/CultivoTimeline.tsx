import type { LucideIcon } from "lucide-react";

export interface CultivoStage {
  label: string;
  date?: string;
  icon: LucideIcon;
}

const formatFecha = (fecha?: string) => {
  if (!fecha) return undefined;
  const date = new Date(`${fecha}T00:00:00`);
  if (Number.isNaN(date.getTime())) return undefined;
  return new Intl.DateTimeFormat("es-PE", { day: "numeric", month: "short", year: "numeric" }).format(date);
};

export default function CultivoTimeline({ stages }: { stages: CultivoStage[] }) {
  return (
    <div className="relative">
      <div className="absolute inset-x-0 top-5 hidden h-0.5 bg-gray-200 sm:block" />
      <ol className="grid gap-6 sm:grid-cols-4 sm:gap-4">
        {stages.map((stage) => {
          const Icon = stage.icon;
          const fecha = formatFecha(stage.date);
          const pendiente = !fecha;

          return (
            <li
              key={stage.label}
              className="flex items-start gap-4 sm:flex-col sm:items-center sm:gap-3 sm:text-center"
            >
              <span
                className={`relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
                  pendiente
                    ? "border-2 border-dashed border-gray-300 bg-white text-gray-400"
                    : "bg-white text-forest-700 ring-2 ring-forest-600"
                }`}
              >
                <Icon className="h-5 w-5" />
              </span>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-[#111827]">{stage.label}</p>
                <p className={`mt-0.5 text-xs ${pendiente ? "text-gray-400" : "text-gray-500"}`}>
                  {fecha || "Por definir"}
                </p>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
