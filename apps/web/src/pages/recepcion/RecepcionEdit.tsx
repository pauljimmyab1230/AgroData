import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button, LoadingSpinner } from "../../components/ui";
import RecepcionForm from "../../components/recepcion/RecepcionForm";
import { fetchRecepcion, type Recepcion } from "../../services/recepciones";

interface RecepcionEditProps {
  inModal?: boolean;
  recepcionId?: string;
  onSave?: () => void;
}

export default function RecepcionEdit({ inModal, recepcionId: propId, onSave }: RecepcionEditProps) {
  const { id: paramId } = useParams();
  const id = propId ?? paramId;
  const [recepcion, setRecepcion] = useState<Recepcion | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) { setLoading(false); return; }
    fetchRecepcion(id)
      .then(setRecepcion)
      .catch(() => setRecepcion(null))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <LoadingSpinner />
      </div>
    );
  }

  if (!recepcion) {
    return (
      <div className="py-20 text-center text-gray-500">
        <p>No se encontró la recepción.</p>
      </div>
    );
  }

  return (
    <div>
      {!inModal && (
        <div className="mb-8 flex items-center gap-4">
          <Button variant="ghost" as="link" to="/recepcion" iconLeft={<ArrowLeft className="h-4 w-4" />}>
            Recepción
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-[#111827]">Editar Recepción</h1>
            <p className="text-sm text-gray-500">Actualizando {recepcion.codigo}</p>
          </div>
        </div>
      )}

      <RecepcionForm mode="edit" values={recepcion} inModal={inModal} onSave={onSave} />
    </div>
  );
}
