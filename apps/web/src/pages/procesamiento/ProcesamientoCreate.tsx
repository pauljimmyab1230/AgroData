import { ArrowLeft } from "lucide-react";
import { Breadcrumb, Button, SectionHeader } from "../../components/ui";
import ProcesamientoForm from "../../components/procesamiento/ProcesamientoForm";

interface ProcesamientoCreateProps {
  inModal?: boolean;
  onSave?: () => void;
}

export default function ProcesamientoCreate({ inModal, onSave }: ProcesamientoCreateProps) {
  return (
    <div>
      {!inModal && (
        <>
          <Breadcrumb items={[{ label: "Procesamiento", to: "/procesamiento" }, { label: "Nueva Orden" }]} />
          <div className="mb-8 flex items-center gap-4">
            <Button variant="ghost" as="link" to="/procesamiento" iconLeft={<ArrowLeft className="h-4 w-4" />}>
              Volver
            </Button>
            <SectionHeader
              title="Nueva Orden de Procesamiento"
              description="Registro de una orden de procesamiento primario"
            />
          </div>
        </>
      )}

      <ProcesamientoForm mode="create" inModal={inModal} onSave={onSave} />
    </div>
  );
}
