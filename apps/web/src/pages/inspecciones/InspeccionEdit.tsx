import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Breadcrumb, Button, SectionHeader } from "../../components/ui";
import InspeccionForm from "../../components/inspecciones/InspeccionForm";
import { fetchInspeccion, type Inspeccion } from "../../services/inspecciones";

export default function InspeccionEdit() {
  const { id } = useParams();
  const [inspeccion, setInspeccion] = useState<Inspeccion | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    fetchInspeccion(id)
      .then(setInspeccion)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return <div className="py-12 text-center text-gray-500">Cargando inspección...</div>;
  }

  if (!inspeccion) {
    return <div className="py-12 text-center text-gray-500">Inspección no encontrada</div>;
  }

  return (
    <div>
      <Breadcrumb
        items={[
          { label: "Inspecciones", to: "/inspecciones" },
          { label: inspeccion.codigo, to: `/inspecciones/${inspeccion.id}` },
          { label: "Editar Inspección" },
        ]}
      />

      <div className="mb-8 flex items-center gap-4">
        <Button
          variant="ghost"
          as="link"
          to={`/inspecciones/${inspeccion.id}`}
          iconLeft={<ArrowLeft className="h-4 w-4" />}
        >
          Volver
        </Button>
        <SectionHeader
          title="Editar Inspección"
          description={`Actualizando la información de la inspección ${inspeccion.codigo}`}
        />
      </div>

      <InspeccionForm mode="edit" values={inspeccion} />
    </div>
  );
}
