import { useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button, LoadingSpinner } from "../../components/ui";
import ProcesamientoForm from "../../components/procesamiento/ProcesamientoForm";
import { useProcesamiento } from "../../hooks/queries";

interface ProcesamientoEditProps {
  inModal?: boolean;
  procesamientoId?: string;
  onSave?: () => void;
}

export default function ProcesamientoEdit({ inModal, procesamientoId: propId, onSave }: ProcesamientoEditProps) {
  const { id: paramId } = useParams();
  const id = propId ?? paramId;
  const { data: orden, isLoading: loading } = useProcesamiento(id);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <LoadingSpinner />
      </div>
    );
  }

  if (!orden) {
    return (
      <div className="py-20 text-center text-gray-500">
        <p>No se encontró la orden de procesamiento.</p>
      </div>
    );
  }

  return (
    <div>
      {!inModal && (
        <div className="mb-8 flex items-center gap-4">
          <Button variant="ghost" as="link" to="/procesamiento" iconLeft={<ArrowLeft className="h-4 w-4" />}>
            Procesamiento
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-[#111827]">Editar Procesamiento</h1>
            <p className="text-sm text-gray-500">Actualizando {orden.codigo}</p>
          </div>
        </div>
      )}

      <ProcesamientoForm mode="edit" values={orden} inModal={inModal} onSave={onSave} />
    </div>
  );
}
