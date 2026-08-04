import { Route } from "lucide-react";
import { Breadcrumb, EmptyState, SectionHeader } from "../../components/ui";

export default function TrazabilidadPage() {
  return (
    <div>
      <Breadcrumb items={[{ label: "Trazabilidad" }]} />

      <div className="mb-8">
        <SectionHeader
          title="Trazabilidad"
          description="Seguimiento del origen de cada lote desde el campo hasta el producto final."
        />
      </div>

      <EmptyState
        icon={<Route className="h-8 w-8" />}
        iconClassName="bg-forest-600/10 text-forest-600"
        title="Módulo en construcción"
        description="La trazabilidad estará disponible próximamente."
      />
    </div>
  );
}
