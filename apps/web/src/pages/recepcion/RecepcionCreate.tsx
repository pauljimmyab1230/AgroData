import { ArrowLeft } from "lucide-react";
import { Button } from "../../components/ui";
import RecepcionForm from "../../components/recepcion/RecepcionForm";

interface RecepcionCreateProps {
  inModal?: boolean;
  onSave?: () => void;
}

export default function RecepcionCreate({ inModal, onSave }: RecepcionCreateProps) {
  return (
    <div>
      {!inModal && (
        <div className="mb-8 flex items-center gap-4">
          <Button variant="ghost" as="link" to="/recepcion" iconLeft={<ArrowLeft className="h-4 w-4" />}>
            Recepción
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-[#111827]">Nueva Recepción</h1>
            <p className="text-sm text-gray-500">Registra una nueva recepción de materia prima</p>
          </div>
        </div>
      )}

      <RecepcionForm mode="create" inModal={inModal} onSave={onSave} />
    </div>
  );
}
