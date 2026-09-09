import { ArrowLeft } from "lucide-react";
import { Button } from "../../components/ui";
import AcopioForm from "../../components/acopio/AcopioForm";

interface AcopioCreateProps {
  inModal?: boolean;
  onSave?: () => void;
}

export default function AcopioCreate({ inModal, onSave }: AcopioCreateProps) {
  return (
    <div>
      {!inModal && (
        <div className="mb-8 flex items-center gap-4">
          <Button variant="ghost" as="link" to="/acopio" iconLeft={<ArrowLeft className="h-4 w-4" />}>
            Acopio
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-[#111827]">Nuevo Acopio</h1>
            <p className="text-sm text-gray-500">Registra un nuevo acopio de producción</p>
          </div>
        </div>
      )}

      <AcopioForm mode="create" inModal={inModal} onSave={onSave} />
    </div>
  );
}
