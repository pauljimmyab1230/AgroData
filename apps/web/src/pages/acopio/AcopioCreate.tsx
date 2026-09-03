import { ArrowLeft } from "lucide-react";
import { Breadcrumb, Button, SectionHeader } from "../../components/ui";
import AcopioForm from "../../components/acopio/AcopioForm";

interface AcopioCreateProps {
  inModal?: boolean;
  onSave?: () => void;
}

export default function AcopioCreate({ inModal, onSave }: AcopioCreateProps) {
  return (
    <div>
      {!inModal && (
        <>
          <Breadcrumb items={[{ label: "Acopio", to: "/acopio" }, { label: "Nuevo Acopio" }]} />
          <div className="mb-8 flex items-center gap-4">
            <Button variant="ghost" as="link" to="/acopio" iconLeft={<ArrowLeft className="h-4 w-4" />}>
              Volver
            </Button>
            <SectionHeader
              title="Nuevo Acopio"
              description="Registro de un nuevo acopio de producción"
            />
          </div>
        </>
      )}

      <AcopioForm mode="create" inModal={inModal} onSave={onSave} />
    </div>
  );
}
