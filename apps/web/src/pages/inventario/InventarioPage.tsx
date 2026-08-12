import { Package } from "lucide-react";
import { Breadcrumb, EmptyState, SectionHeader } from "../../components/ui";

export default function InventarioPage() {
  return (
    <div>
      <Breadcrumb items={[{ label: "Inventario" }]} />

      <div className="mb-8">
        <SectionHeader
          title="Inventario"
          description="Control de existencias de materias primas y productos terminados."
        />
      </div>

      <EmptyState
        icon={<Package className="h-8 w-8" />}
        iconClassName="bg-forest-600/10 text-forest-600"
        title="Módulo en construcción"
        description="La gestión de inventario estará disponible próximamente."
      />
    </div>
  );
}
