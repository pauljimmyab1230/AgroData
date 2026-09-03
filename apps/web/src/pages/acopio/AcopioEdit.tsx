import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Breadcrumb, Button, LoadingSpinner, SectionHeader } from "../../components/ui";
import AcopioForm from "../../components/acopio/AcopioForm";
import { fetchAcopio, toAcopioView, type AcopioView } from "../../services/acopios";

interface AcopioEditProps {
  inModal?: boolean;
  acopioId?: string;
  onSave?: () => void;
}

export default function AcopioEdit({ inModal, acopioId: propId, onSave }: AcopioEditProps) {
  const { id: paramId } = useParams();
  const id = propId || paramId;
  const [acopio, setAcopio] = useState<AcopioView | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    fetchAcopio(id)
      .then((data) => setAcopio(toAcopioView(data)))
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
      <div className="flex items-center justify-center py-20">
        <p className="text-sm text-gray-400">Acopio no encontrado.</p>
      </div>
    );
  }

  return (
    <div>
      {!inModal && (
        <>
          <Breadcrumb
            items={[
              { label: "Acopio", to: "/acopio" },
              { label: acopio.codigo, to: `/acopio/${acopio.id}` },
              { label: "Editar Acopio" },
            ]}
          />

          <div className="mb-8 flex items-center gap-4">
            <Button
              variant="ghost"
              as="link"
              to={`/acopio/${acopio.id}`}
              iconLeft={<ArrowLeft className="h-4 w-4" />}
            >
              Volver
            </Button>
            <SectionHeader
              title="Editar Acopio"
              description={`Actualizando la información del acopio ${acopio.codigo}`}
            />
          </div>
        </>
      )}

      <AcopioForm mode="edit" values={acopio} inModal={inModal} onSave={onSave} />
    </div>
  );
}
