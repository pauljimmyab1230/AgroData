import { Leaf, Tractor, BadgeCheck, Sprout, Package, LayoutGrid } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Card } from "../ui";
import { CardHeader, CardShell } from "../shared/formControls";
import type { Cultivo } from "../../pages/cultivos/cultivoMock";

interface ResumenCultivoProps {
  cultivo: Cultivo;
}

export default function ResumenCultivo({ cultivo }: ResumenCultivoProps) {
  const items: { label: string; value: string; icon: LucideIcon }[] = [
    { label: "Sistema Productivo", value: cultivo.sistemaProductivo, icon: Leaf },
    { label: "Tipo de Agricultura", value: cultivo.tipoAgricultura, icon: Tractor },
    { label: "Certificación", value: cultivo.certificacion, icon: BadgeCheck },
    { label: "Método de Siembra", value: cultivo.metodoSiembra, icon: Sprout },
    { label: "Procedencia de Semilla", value: cultivo.procedenciaSemilla, icon: Package },
  ];

  return (
    <CardShell>
      <CardHeader
        icon={<LayoutGrid size={20} />}
        title="Resumen del Cultivo"
        description="Características principales del cultivo en una vista rápida"
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {items.map((item) => (
          <Card key={item.label}>
            <div className="flex flex-col gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-forest-600/10 text-forest-600">
                <item.icon className="h-4 w-4" />
              </span>
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-gray-500">{item.label}</p>
                <p className="mt-1 text-sm font-semibold text-[#111827]">{item.value}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </CardShell>
  );
}
