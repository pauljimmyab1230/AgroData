import { Factory } from "lucide-react";
import { Breadcrumb, EmptyState, SectionHeader } from "../../components/ui";

export default function ProcesamientoPage() {
  return (
    <div>
      <Breadcrumb items={[{ label: "Procesamiento" }]} />

      <div className="mb-8">
        <SectionHeader
          title="Procesamiento"
          description="Procesos de transformación de la materia prima en productos finales."
        />
      </div>

      <EmptyState
        icon={<Factory className="h-8 w-8" />}
        iconClassName="bg-forest-600/10 text-forest-600"
        title="Módulo en construcción"
        description="La gestión del procesamiento estará disponible próximamente."
      />
    </div>
  );
}
