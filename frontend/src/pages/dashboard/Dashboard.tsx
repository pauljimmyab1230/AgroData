import type { LucideIcon } from "lucide-react";
import {
  Users,
  MapPin,
  Wheat,
  CalendarDays,
  ArrowUpRight,
  Sprout,
  ClipboardList,
  Plus,
} from "lucide-react";
import { Badge, Breadcrumb, Button, Card, SectionHeader } from "../../components/ui";

type Stat = {
  label: string;
  value: string;
  hint: string;
  icon: LucideIcon;
  iconClass: string;
};

const stats: Stat[] = [
  {
    label: "Productores",
    value: "144",
    hint: "+4 este mes",
    icon: Users,
    iconClass: "bg-forest-600/10 text-forest-600",
  },
  {
    label: "Parcelas",
    value: "186",
    hint: "188.13 ha totales",
    icon: MapPin,
    iconClass: "bg-sun-100 text-sun-600",
  },
  {
    label: "Cultivos",
    value: "12",
    hint: "especies registradas",
    icon: Wheat,
    iconClass: "bg-forest-600/10 text-forest-600",
  },
  {
    label: "Campañas",
    value: "3",
    hint: "1 activa",
    icon: CalendarDays,
    iconClass: "bg-sun-100 text-sun-600",
  },
];

const actividades = [
  { nombre: "Abonamiento orgánico", parcela: "Parcela P-014 · Collpaccasa", estado: "Pendiente" },
  { nombre: "Riego por aspersión", parcela: "Parcela P-023 · Pampa Cangallo", estado: "En curso" },
  { nombre: "Cosecha de papa nativa", parcela: "Parcela P-041 · Chaupimayo", estado: "Completada" },
];

const estadoBadge = (estado: string) => {
  switch (estado) {
    case "Pendiente":
      return <Badge variant="yellow">Pendiente</Badge>;
    case "En curso":
      return <Badge variant="forest">En curso</Badge>;
    case "Completada":
      return <Badge variant="gray">Completada</Badge>;
    default:
      return <Badge>{estado}</Badge>;
  }
};

export default function Dashboard() {
  return (
    <div>
      <Breadcrumb items={[{ label: "Dashboard" }]} />

      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <SectionHeader
          title="Dashboard"
          description="Resumen general de la cooperativa y sus actividades agrícolas."
        />
        <div className="flex items-center gap-2">
          <Button as="link" to="/campanias/nueva" iconLeft={<Plus className="h-4 w-4" />}>
            Nueva Campaña
          </Button>
        </div>
      </div>

      <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <div className="flex items-start justify-between">
              <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${stat.iconClass}`}>
                <stat.icon className="h-5 w-5" />
              </div>
              <ArrowUpRight className="h-4 w-4 text-gray-300" />
            </div>
            <p className="mt-4 text-xs font-medium uppercase tracking-wider text-gray-500">{stat.label}</p>
            <p className="mt-1.5 text-2xl font-bold text-[#111827]">{stat.value}</p>
            <p className="mt-1 text-xs text-gray-500">{stat.hint}</p>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <Card hover={false}>
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-forest-600/10 text-forest-600">
              <ClipboardList className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-[#111827]">Actividades recientes</h2>
              <p className="text-xs text-gray-500">Últimos registros del campo</p>
            </div>
          </div>

          <ul className="divide-y divide-gray-100">
            {actividades.map((act) => (
              <li key={act.nombre} className="flex items-center justify-between gap-4 py-3.5">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-[#111827]">{act.nombre}</p>
                  <p className="mt-0.5 truncate text-xs text-gray-500">{act.parcela}</p>
                </div>
                {estadoBadge(act.estado)}
              </li>
            ))}
          </ul>
        </Card>

        <div className="overflow-hidden rounded-2xl bg-forest-900 p-6 text-white shadow-card">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10">
              <Sprout className="h-5 w-5 text-forest-300" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">Campaña actual</h2>
              <p className="text-xs text-forest-300">Campaña 2025–2026</p>
            </div>
          </div>

          <dl className="mt-6 space-y-4">
            <div className="flex items-center justify-between">
              <dt className="text-sm text-forest-200">Parcelas cultivadas</dt>
              <dd className="text-lg font-semibold text-white">42</dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="text-sm text-forest-200">Superficie sembrada</dt>
              <dd className="text-lg font-semibold text-white">68.4 ha</dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="text-sm text-forest-200">Actividades planificadas</dt>
              <dd className="text-lg font-semibold text-white">127</dd>
            </div>
          </dl>

          <div className="mt-6 h-2 overflow-hidden rounded-full bg-white/10">
            <div className="h-full w-[68%] rounded-full bg-gradient-to-r from-forest-400 to-sun-400" />
          </div>
          <p className="mt-2 text-xs text-forest-300">68% de avance de la campaña</p>
        </div>
      </div>
    </div>
  );
}
