import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Breadcrumb, LoadingSpinner } from "../../components/ui";
import { CampaniaHeader } from "../../components/campanias/CampaniaHeader";
import { CampaniaForm } from "../../components/campanias/CampaniaForm";
import { fetchCampania, type Campania } from "../../services/campanias";

export default function CampaniaEdit() {
  const { id } = useParams();
  const [campania, setCampania] = useState<Campania | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    fetchCampania(id)
      .then(setCampania)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

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
      <Breadcrumb
        items={[
          { label: "Campañas", to: "/campanias" },
          { label: campania.codigo, to: `/campanias/${campania.id}` },
          { label: "Editar Campaña" },
        ]}
      />

      <CampaniaHeader
        title="Editar Campaña"
        description={`Actualizando la información de ${campania.nombre} (${campania.codigo})`}
        backTo={`/campanias/${campania.id}`}
      />

      <CampaniaForm mode="edit" values={campania} />
    </div>
  );
}
