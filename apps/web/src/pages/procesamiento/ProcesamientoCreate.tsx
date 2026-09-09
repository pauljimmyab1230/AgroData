import { ArrowLeft } from "lucide-react";
import { Button } from "../../components/ui";
import ProcesamientoForm from "../../components/procesamiento/ProcesamientoForm";

interface ProcesamientoCreateProps {
  inModal?: boolean;
  onSave?: () => void;
}

export default function ProcesamientoCreate({ inModal, onSave }: ProcesamientoCreateProps) {
  return (
    <div>
      {!inModal && (
        <div className="mb-8 flex items-center gap-4">
          <Button variant="ghost" as="link" to="/procesamiento" iconLeft={<ArrowLeft className="h-4 w-4" />}>
            Procesamiento
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-[#111827]">Nuevo Procesamiento</h1>
            <p className="text-sm text-gray-500">Registra una nueva orden de procesamiento</p>
          </div>
        </div>
      )}

      <ProcesamientoForm mode="create" inModal={inModal} onSave={onSave} />
    </div>
  );
}
