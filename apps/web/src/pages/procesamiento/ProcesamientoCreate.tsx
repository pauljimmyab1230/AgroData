import { ArrowLeft } from "lucide-react";
import { Breadcrumb, Button, SectionHeader } from "../../components/ui";
import ProcesamientoForm from "../../components/procesamiento/ProcesamientoForm";

export default function ProcesamientoCreate() {
  return (
    <div>
      <Breadcrumb items={[{ label: "Procesamiento", to: "/procesamiento" }, { label: "Nueva Orden" }]} />

      <div className="mb-8 flex items-center gap-4">
        <Button variant="ghost" as="link" to="/procesamiento" iconLeft={<ArrowLeft className="h-4 w-4" />}>
          Volver
        </Button>
        <SectionHeader
          title="Nueva Orden de Procesamiento"
          description="Registro de una orden de procesamiento primario, organizado por tarjetas"
        />
      </div>

      <ProcesamientoForm mode="create" />
    </div>
  );
}
