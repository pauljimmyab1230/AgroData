import { MapPin, Plus, Pencil, Trash2, Ruler, ShieldCheck, Sprout, Layers } from "lucide-react";
import { Badge, Button, Card, DataTable } from "../ui";
import { parcelasMock, type Parcela } from "../../pages/productores/productorMock";
import { CardHeader, CardShell, type FormMode } from "../shared/formControls";

type ParcelaTableProps = {
  mode: FormMode;
};

export function ParcelaTable({ mode }: ParcelaTableProps) {
  const readOnly = mode === "view";
  const data = mode === "create" ? [] : parcelasMock;

  const totalParcelas = data.length;
  const areaTotal = data.reduce((sum, p) => sum + parseFloat(p.area), 0);
  const areaCertificada = data
    .filter((p) => p.certificacion === "Orgánica")
    .reduce((sum, p) => sum + parseFloat(p.area), 0);
  const cultivosActivos = new Set(
    data.filter((p) => p.estado === "Activa").map((p) => p.cultivo),
  ).size;

  const kpis = [
    {
      label: "Parcelas Registradas",
      value: String(totalParcelas),
      icon: Layers,
      iconClass: "bg-forest-600/10 text-forest-600",
    },
    {
      label: "Área Total",
      value: `${areaTotal.toFixed(2)} ha`,
      icon: Ruler,
      iconClass: "bg-sun-100 text-sun-700",
    },
    {
      label: "Área Certificada",
      value: `${areaCertificada.toFixed(2)} ha`,
      icon: ShieldCheck,
      iconClass: "bg-emerald-100 text-emerald-700",
    },
    {
      label: "Cultivos Activos",
      value: String(cultivosActivos),
      icon: Sprout,
      iconClass: "bg-forest-600/10 text-forest-600",
    },
  ];

  const columns = [
    { key: "codigo", label: "Código", className: "font-medium text-forest-700" },
    { key: "nombre", label: "Nombre Parcela" },
    { key: "cultivo", label: "Cultivo" },
    { key: "area", label: "Área" },
    { key: "ubicacion", label: "Ubicación" },
    {
      key: "certificacion",
      label: "Certificación",
      render: (parcela: Parcela) =>
        parcela.certificacion === "Orgánica" ? (
          <Badge variant="green">{parcela.certificacion}</Badge>
        ) : (
          <Badge variant="yellow">{parcela.certificacion}</Badge>
        ),
    },
    {
      key: "estado",
      label: "Estado",
      render: (parcela: Parcela) =>
        parcela.estado === "Activa" ? (
          <Badge variant="forest">Activa</Badge>
        ) : (
          <Badge variant="gray">Inactiva</Badge>
        ),
    },
    ...(!readOnly
      ? [
          {
            key: "acciones",
            label: "",
            className: "text-right",
            render: (parcela: Parcela) => (
              <div className="flex justify-end gap-1">
                <button
                  type="button"
                  aria-label={`Editar ${parcela.nombre}`}
                  className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-forest-600/10 hover:text-forest-700"
                >
                  <Pencil className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  aria-label={`Eliminar ${parcela.nombre}`}
                  className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-600"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ),
          },
        ]
      : []),
  ];

  return (
    <CardShell>
      <CardHeader
        icon={<MapPin size={20} />}
        title="Parcelas"
        description="Parcelas asociadas al productor con datos de cultivo y certificación"
        actions={
          !readOnly ? (
            <Button variant="secondary" size="sm" iconLeft={<Plus className="h-4 w-4" />}>
              Agregar Parcela
            </Button>
          ) : undefined
        }
      />

      <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {kpis.map((kpi) => (
          <Card key={kpi.label} padding="md" hover={false} className="shadow-sm">
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="truncate text-xs font-medium uppercase tracking-wider text-gray-500">
                  {kpi.label}
                </p>
                <p className="mt-1.5 text-xl font-bold text-[#111827]">{kpi.value}</p>
              </div>
              <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${kpi.iconClass}`}>
                <kpi.icon className="h-5 w-5" />
              </div>
            </div>
          </Card>
        ))}
      </div>

      <DataTable
        columns={columns}
        data={data}
        keyField="id"
        emptyTitle="Sin parcelas registradas"
        emptyDescription="Agrega las parcelas del productor para el proceso de certificación."
      />
    </CardShell>
  );
}
