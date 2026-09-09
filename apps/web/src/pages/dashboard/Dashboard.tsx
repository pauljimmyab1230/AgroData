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
import { Badge, Button, Card, SectionHeader, LoadingSpinner } from "../../components/ui";
import { useDashboard } from "../../hooks/queries";

type Stat = {
  label: string;
  value: string;
  hint: string;
  icon: LucideIcon;
  iconClass: string;
};

const estadoBadge = (estado: string) => {
  switch (estado) {
    case "PENDIENTE":
      return <Badge variant="yellow">Pendiente</Badge>;
    case "EN_PROCESO":
      return <Badge variant="forest">En curso</Badge>;
    case "COMPLETADA":
      return <Badge variant="gray">Completada</Badge>;
    default:
      return <Badge>{estado}</Badge>;
  }
};

export default function Dashboard() {
  const { data, isLoading } = useDashboard();

  const stats: Stat[] = [
    {
      label: "Productores",
      value: String(data?.productores ?? 0),
      hint: "registrados",
      icon: Users,
      iconClass: "bg-forest-600/10 text-forest-600",
    },
    {
      label: "Parcelas",
      value: String(data?.parcelas ?? 0),
      hint: "georeferenciadas",
      icon: MapPin,
      iconClass: "bg-sun-100 text-sun-600",
    },
    {
      label: "Cultivos",
      value: String(data?.cultivos ?? 0),
      hint: "registrados",
      icon: Wheat,
      iconClass: "bg-forest-600/10 text-forest-600",
    },
    {
      label: "Campañas",
      value: String(data?.campanias ?? 0),
      hint: data?.campaniaActiva ? "1 activa" : "ninguna activa",
      icon: CalendarDays,
      iconClass: "bg-sun-100 text-sun-600",
    },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <LoadingSpinner text="Cargando dashboard..." />
      </div>
    );
  }

  return (
    <div>
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
            <p className="mt-1.5 text-2xl font-bold text-gray-900">{stat.value}</p>
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
              <h2 className="text-lg font-semibold text-gray-900">Actividades recientes</h2>
              <p className="text-xs text-gray-500">Últimos registros del campo</p>
            </div>
          </div>

          {!data?.actividadesRecientes?.length ? (
            <p className="py-6 text-center text-sm text-gray-400">No hay actividades registradas.</p>
          ) : (
            <ul className="divide-y divide-gray-100">
              {data.actividadesRecientes.map((act) => (
                <li key={act.id} className="flex items-center justify-between gap-4 py-3.5">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-gray-900">{act.tipoActividad}</p>
                    <p className="mt-0.5 truncate text-xs text-gray-500">{act.codigo}</p>
                  </div>
                  {estadoBadge(act.estado)}
                </li>
              ))}
            </ul>
          )}
        </Card>

        <div className="overflow-hidden rounded-2xl bg-forest-900 p-6 text-white shadow-card">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10">
              <Sprout className="h-5 w-5 text-forest-300" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">Campa\u00f1a actual</h2>
              <p className="text-xs text-forest-300">
                {data?.campaniaActiva ? data.campaniaActiva.nombre : "Sin campaña activa"}
              </p>
            </div>
          </div>

          {data?.campaniaActiva ? (
            <>
              <dl className="mt-6 space-y-4">
                <div className="flex items-center justify-between">
                  <dt className="text-sm text-forest-200">Código</dt>
                  <dd className="text-sm font-semibold text-white">
                    {data.campaniaActiva.codigo}
                  </dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="text-sm text-forest-200">Año agrícola</dt>
                  <dd className="text-sm font-semibold text-white">
                    {data.campaniaActiva.anio_agricola}
                  </dd>
                </div>
              </dl>
            </>
          ) : (
            <p className="mt-6 text-sm text-forest-300">
              No hay campaña activa. Crea una nueva campaña para comenzar.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
