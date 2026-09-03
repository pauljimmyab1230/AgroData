import { ArrowLeft } from "lucide-react";
import { Breadcrumb, Button, SectionHeader } from "../../components/ui";
import InspeccionForm from "../../components/inspecciones/InspeccionForm";

interface InspeccionCreateProps {
  inModal?: boolean;
  onSave?: () => void;
}

export default function InspeccionCreate({ inModal, onSave }: InspeccionCreateProps) {
  return (
    <div>
      {!inModal && (
        <>
          <Breadcrumb items={[{ label: "Inspecciones", to: "/inspecciones" }, { label: "Nueva Inspección" }]} />
          <div className="mb-8 flex items-center gap-4">
            <Button variant="ghost" as="link" to="/inspecciones" iconLeft={<ArrowLeft className="h-4 w-4" />}>
              Volver
            </Button>
            <SectionHeader
              title="Nueva Inspección"
              description="Registro de una nueva inspección de campo"
            />
          </div>
        </>
      )}

      <InspeccionForm mode="create" inModal={inModal} onSave={onSave} />
    </div>
  );
}
