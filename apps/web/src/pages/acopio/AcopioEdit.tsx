import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button, LoadingSpinner } from "../../components/ui";
import AcopioForm from "../../components/acopio/AcopioForm";
import { fetchAcopio, type Acopio } from "../../services/acopios";

interface AcopioEditProps {
  inModal?: boolean;
  acopioId?: string;
  onSave?: () => void;
}

export default function AcopioEdit({ inModal, acopioId: propId, onSave }: AcopioEditProps) {
  const { id: paramId } = useParams();
  const id = propId ?? paramId;
  const [acopio, setAcopio] = useState<Acopio | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) { setLoading(false); return; }
    fetchAcopio(id)
      .then(setAcopio)
      .catch(() => setAcopio(null))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <LoadingSpinner />
      </div>
    );
  }

  if (!acopio) {
    return (
      <div className="py-20 text-center text-gray-500">
        <p>No se encontró el acopio.</p>
      </div>
    );
  }

  return (
    <div>
      {!inModal && (
        <div className="mb-8 flex items-center gap-4">
          <Button variant="ghost" as="link" to="/acopio" iconLeft={<ArrowLeft className="h-4 w-4" />}>
            Acopio
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-[#111827]">Editar Acopio</h1>
            <p className="text-sm text-gray-500">Actualizando la información de {acopio.codigo}</p>
          </div>
        </div>
      )}

      <AcopioForm mode="edit" values={acopio} inModal={inModal} onSave={onSave} />
    </div>
  );
}
