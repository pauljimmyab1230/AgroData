import { useParams } from "react-router-dom";
import { LoadingSpinner } from "../../components/ui";
import CultivoHeader from "../../components/cultivos/CultivoHeader";
import CultivoForm from "../../components/cultivos/CultivoForm";
import { useCultivo } from "../../hooks/queries";

interface CultivoEditProps {
  inModal?: boolean;
  cultivoId?: string;
  onSave?: () => void;
}

export default function CultivoEdit({ inModal, cultivoId: propId, onSave }: CultivoEditProps) {
  const { id: paramId } = useParams();
  const id = propId ?? paramId;

  const { data: cultivo, isLoading } = useCultivo(id || null);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <LoadingSpinner />
      </div>
    );
  }

  if (!cultivo) {
    return (
      <div className="py-20 text-center text-gray-500">
        <p>No se encontró el cultivo.</p>
      </div>
    );
  }

  return (
    <div>
      {!inModal && (
        <CultivoHeader
          title="Editar Cultivo"
          description={`Actualizando la información de ${cultivo.cultivo} (${cultivo.codigo})`}
          backTo={`/cultivos/${cultivo.id}`}
        />
      )}

      <CultivoForm mode="edit" values={cultivo} inModal={inModal} onSave={onSave} />
    </div>
  );
}
