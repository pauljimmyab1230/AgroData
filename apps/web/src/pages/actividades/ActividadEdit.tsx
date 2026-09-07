import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Breadcrumb, LoadingSpinner } from "../../components/ui";
import { ActividadHeader } from "../../components/actividades/ActividadHeader";
import { ActividadForm } from "../../components/actividades/ActividadForm";
import { fetchActividad, tipoActividadLabels, type Actividad } from "../../services/actividades";

interface ActividadEditProps {
  inModal?: boolean;
  actividadId?: number;
  onSave?: () => void;
}

export default function ActividadEdit({ inModal, actividadId: propId, onSave }: ActividadEditProps) {
  const { id: paramId } = useParams();
  const id = propId || paramId;
  const [actividad, setActividad] = useState<Actividad | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    fetchActividad(id)
      .then(setActividad)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

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
          <Breadcrumb
            items={[
              { label: "Actividades Agrícolas", to: "/actividades" },
              { label: actividad.codigo, to: `/actividades/${actividad.id}` },
              { label: "Editar Actividad" },
            ]}
          />

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
