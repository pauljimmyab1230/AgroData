import { Layers } from "lucide-react";
import { Breadcrumb, EmptyState, SectionHeader } from "../../components/ui";

export default function LoteList() {
  return (
    <div>
      <Breadcrumb items={[{ label: "Lotes" }]} />

      <div className="mb-8">
        <SectionHeader
          title="Lotes"
          description="Gestión de lotes de producción y transformación."
        />
      </div>

      <EmptyState
        icon={<Layers className="h-8 w-8" />}
        iconClassName="bg-forest-600/10 text-forest-600"
        title="Módulo en construcción"
        description="La gestión de lotes estará disponible próximamente."
      />
    </div>
  );
}
