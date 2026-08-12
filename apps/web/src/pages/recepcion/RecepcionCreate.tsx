import { ArrowLeft } from "lucide-react";
import { Breadcrumb, Button, SectionHeader } from "../../components/ui";
import RecepcionForm from "../../components/recepcion/RecepcionForm";

export default function RecepcionCreate() {
  return (
    <div>
      <Breadcrumb items={[{ label: "Recepción", to: "/recepcion" }, { label: "Nueva Recepción" }]} />

      <div className="mb-8 flex items-center gap-4">
        <Button variant="ghost" as="link" to="/recepcion" iconLeft={<ArrowLeft className="h-4 w-4" />}>
          Volver
        </Button>
        <SectionHeader
          title="Nueva Recepción"
          description="Registro del ingreso de la materia prima desde el Acopio hacia la planta, organizado por tarjetas"
        />
      </div>

      <RecepcionForm mode="create" />
    </div>
  );
}
