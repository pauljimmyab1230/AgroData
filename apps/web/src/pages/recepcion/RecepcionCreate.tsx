import { ArrowLeft } from "lucide-react";
import { Breadcrumb, Button, SectionHeader } from "../../components/ui";
import RecepcionForm from "../../components/recepcion/RecepcionForm";

interface RecepcionCreateProps {
  inModal?: boolean;
  onSave?: () => void;
}

export default function RecepcionCreate({ inModal, onSave }: RecepcionCreateProps) {
  return (
    <div>
      {!inModal && (
        <>
          <Breadcrumb items={[{ label: "Recepción", to: "/recepcion" }, { label: "Nueva Recepción" }]} />
          <div className="mb-8 flex items-center gap-4">
            <Button variant="ghost" as="link" to="/recepcion" iconLeft={<ArrowLeft className="h-4 w-4" />}>
              Volver
            </Button>
            <SectionHeader
              title="Nueva Recepción"
              description="Registro del ingreso de materia prima a la planta"
            />
          </div>
        </>
      )}

      <RecepcionForm mode="create" inModal={inModal} onSave={onSave} />
    </div>
  );
}
