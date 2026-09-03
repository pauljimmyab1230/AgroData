import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { LoadingSpinner } from "../../components/ui";
import CultivoHeader from "../../components/cultivos/CultivoHeader";
import CultivoForm from "../../components/cultivos/CultivoForm";
import { fetchCultivo, type Cultivo } from "../../services/cultivos";

interface CultivoEditProps {
  inModal?: boolean;
  cultivoId?: string;
  onSave?: () => void;
}

export default function CultivoEdit({ inModal, cultivoId: propId, onSave }: CultivoEditProps) {
  const { id: paramId } = useParams();
  const id = propId || paramId;
  const [cultivo, setCultivo] = useState<Cultivo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setCultivo(null);
    fetchCultivo(id)
      .then(setCultivo)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
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
          description={`Actualizando información de ${cultivo.cultivo} (${cultivo.codigo})`}
          crumbs={[{ label: "Cultivos", to: "/cultivos" }, { label: cultivo.codigo, to: `/cultivos/${cultivo.id}` }, { label: "Editar" }]}
          backTo={`/cultivos/${cultivo.id}`}
        />
      )}

      <CultivoForm key={id} mode="edit" values={cultivo} inModal={inModal} onSave={onSave} />
    </div>
  );
}
