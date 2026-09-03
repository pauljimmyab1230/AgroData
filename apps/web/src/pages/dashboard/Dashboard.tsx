import { useEffect, useState } from "react";
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
import { Badge, Breadcrumb, Button, Card, SectionHeader, LoadingSpinner } from "../../components/ui";
import api from "../../services/api";

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
    case "COMPLETADO":
      return <Badge variant="gray">Completada</Badge>;
    default:
      return <Badge>{estado}</Badge>;
  }
};

interface DashboardData {
  productores: number;
  parcelas: number;
  cultivos: number;
  campanias: number;
  campaniaActiva: {
    nombre: string;
    parcelasCultivadas: number;
    actividades: number;
  } | null;
  actividadesRecientes: Array<{
    nombre: string;
    parcela: string;
    estado: string;
  }>;
}

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<DashboardData>({
    productores: 0,
    parcelas: 0,
    cultivos: 0,
    campanias: 0,
    campaniaActiva: null,
    actividadesRecientes: [],
  });

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const [productoresRes, parcelasRes, cultivosRes, campaniasRes, actividadesRes] =
          await Promise.all([
            api.get("/productores?limit=1").catch(() => ({ data: { total: 0 } })),
            api.get("/parcelas?limit=1").catch(() => ({ data: { total: 0 } })),
            api.get("/cultivos?limit=1").catch(() => ({ data: { total: 0 } })),
            api.get("/campanias?limit=1").catch(() => ({ data: { total: 0, data: [] } })),
            api.get("/actividades?limit=5").catch(() => ({ data: { data: [] } })),
          ]);

        const campaniaActiva = campaniasRes.data.data?.find(
          (c: { estado: string }) => c.estado === "ACTIVA"
        );

        setData({
          productores: productoresRes.data.total ?? 0,
          parcelas: parcelasRes.data.total ?? 0,
          cultivos: cultivosRes.data.total ?? 0,
          campanias: campaniasRes.data.total ?? 0,
          campaniaActiva: campaniaActiva
            ? {
                nombre: campaniaActiva.nombre,
                parcelasCultivadas: 0,
                actividades: 0,
              }
            : null,
          actividadesRecientes: (actividadesRes.data.data ?? []).map(
            (a: { nombre: string; parcela_nombre: string; estado: string }) => ({
              nombre: a.nombre,
              parcela: a.parcela_nombre ?? "",
              estado: a.estado,
            })
          ),
        });
      } catch {
        // keep defaults
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  const stats: Stat[] = [
    {
      label: "Productores",
      value: String(data.productores),
      hint: "registrados",
      icon: Users,
      iconClass: "bg-forest-600/10 text-forest-600",
    },
    {
      label: "Parcelas",
      value: String(data.parcelas),
      hint: "georeferenciadas",
      icon: MapPin,
      iconClass: "bg-sun-100 text-sun-600",
    },
    {
      label: "Cultivos",
      value: String(data.cultivos),
      hint: "registrados",
      icon: Wheat,
      iconClass: "bg-forest-600/10 text-forest-600",
    },
    {
      label: "Campañas",
      value: String(data.campanias),
      hint: data.campaniaActiva ? "1 activa" : "ninguna activa",
      icon: CalendarDays,
      iconClass: "bg-sun-100 text-sun-600",
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <LoadingSpinner text="Cargando dashboard..." />
      </div>
    );
  }

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

          {data.actividadesRecientes.length === 0 ? (
            <p className="py-6 text-center text-sm text-gray-400">No hay actividades registradas.</p>
          ) : (
            <ul className="divide-y divide-gray-100">
              {data.actividadesRecientes.map((act, i) => (
                <li key={i} className="flex items-center justify-between gap-4 py-3.5">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-[#111827]">{act.nombre}</p>
                    <p className="mt-0.5 truncate text-xs text-gray-500">{act.parcela || "Sin parcela"}</p>
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
              <h2 className="text-lg font-semibold text-white">Campaña actual</h2>
              <p className="text-xs text-forest-300">
                {data.campaniaActiva ? data.campaniaActiva.nombre : "Sin campaña activa"}
              </p>
            </div>
          </div>

          {data.campaniaActiva ? (
            <>
              <dl className="mt-6 space-y-4">
                <div className="flex items-center justify-between">
                  <dt className="text-sm text-forest-200">Parcelas cultivadas</dt>
                  <dd className="text-lg font-semibold text-white">
                    {data.campaniaActiva.parcelasCultivadas}
                  </dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="text-sm text-forest-200">Actividades planificadas</dt>
                  <dd className="text-lg font-semibold text-white">
                    {data.campaniaActiva.actividades}
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
