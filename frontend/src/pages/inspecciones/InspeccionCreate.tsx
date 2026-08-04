import { ArrowLeft } from "lucide-react";
import { Breadcrumb, Button, SectionHeader } from "../../components/ui";
import InspeccionForm from "../../components/inspecciones/InspeccionForm";

export default function InspeccionCreate() {
  return (
    <div>
      <Breadcrumb items={[{ label: "Inspecciones", to: "/inspecciones" }, { label: "Nueva Inspección" }]} />

      <div className="mb-8 flex items-center gap-4">
        <Button variant="ghost" as="link" to="/inspecciones" iconLeft={<ArrowLeft className="h-4 w-4" />}>
          Volver
        </Button>
        <SectionHeader
          title="Nueva Inspección"
          description="Registro de una nueva inspección de campo organizado por tarjetas"
        />
      </div>

      <InspeccionForm mode="create" />
    </div>
  );
}
