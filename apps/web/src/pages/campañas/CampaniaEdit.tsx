import { useParams } from "react-router-dom";
import { LoadingSpinner } from "../../components/ui";
import { CampaniaHeader } from "../../components/campanias/CampaniaHeader";
import { CampaniaForm } from "../../components/campanias/CampaniaForm";
import { useCampania } from "../../hooks/queries";

interface CampaniaEditProps {
  inModal?: boolean;
  campaniaId?: number;
  onSave?: () => void;
}

export default function CampaniaEdit({ inModal, campaniaId: propId, onSave }: CampaniaEditProps) {
  const { id: paramId } = useParams();
  const numId = paramId ? Number(paramId) : null;
  const id = propId ?? (numId && !Number.isNaN(numId) ? numId : null);

  const { data: campania, isLoading: loading } = useCampania(id);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <LoadingSpinner />
      </div>
    );
  }

  if (!campania) {
    return (
      <div className="py-20 text-center text-gray-500">
        <p>No se encontró la campaña.</p>
      </div>
    );
  }

  return (
    <div>
      {!inModal && (
        <>
          <CampaniaHeader
            title="Editar Campaña"
            description={`Actualizando la información de ${campania.nombre} (${campania.codigo})`}
            backTo={`/campanias/${campania.id}`}
          />
        </>
      )}

      <CampaniaForm mode="edit" values={campania} inModal={inModal} onSave={onSave} />
    </div>
  );
}
