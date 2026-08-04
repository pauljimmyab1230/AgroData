import { PackageCheck } from "lucide-react";
import { Breadcrumb, EmptyState, SectionHeader } from "../../components/ui";

export default function RecepcionList() {
  return (
    <div>
      <Breadcrumb items={[{ label: "Recepción" }]} />

      <div className="mb-8">
        <SectionHeader
          title="Recepción"
          description="Recepción y registro de la materia prima que ingresa a la planta."
        />
      </div>

      <EmptyState
        icon={<PackageCheck className="h-8 w-8" />}
        iconClassName="bg-forest-600/10 text-forest-600"
        title="Módulo en construcción"
        description="La recepción de materia prima estará disponible próximamente."
      />
    </div>
  );
}
