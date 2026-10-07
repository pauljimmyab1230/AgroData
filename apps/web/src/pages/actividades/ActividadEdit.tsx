import { useParams } from "react-router-dom";
import { LoadingSpinner } from "../../components/ui";
import { ActividadHeader } from "../../components/actividades/ActividadHeader";
import { ActividadForm } from "../../components/actividades/ActividadForm";
import { useActividad } from "../../hooks/queries";
import { tipoActividadLabels } from "../../services/actividades";

interface ActividadEditProps {
  inModal?: boolean;
  actividadId?: number;
  onSave?: () => void;
}

export default function ActividadEdit({ inModal, actividadId: propId, onSave }: ActividadEditProps) {
  const { id: paramId } = useParams();
  const id = propId || paramId;
  const { data: actividad, isLoading: loading } = useActividad(id);

  if (loading || !actividad) {
    return (
      <div className="flex items-center justify-center py-20">
        <LoadingSpinner />
      </div>
    );
  }

  const tipoLabel = tipoActividadLabels[actividad.tipoActividad] ?? actividad.tipoActividad;

  return (
    <div>
      {!inModal && (
        <>
          <ActividadHeader
            title="Editar Actividad"
            description={`Actualizando la información de ${actividad.codigo} (${tipoLabel})`}
            backTo={`/actividades/${actividad.id}`}
          />
        </>
      )}

      <ActividadForm mode="edit" values={actividad} inModal={inModal} onSave={onSave} />
    </div>
  );
}
