import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Breadcrumb, Button, SectionHeader } from "../../components/ui";
import RecepcionForm from "../../components/recepcion/RecepcionForm";
import { type Recepcion, fetchRecepcion } from "../../services/recepciones";

export default function RecepcionEdit() {
  const { id } = useParams();
  const [recepcion, setRecepcion] = useState<Recepcion | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    fetchRecepcion(id)
      .then((r) => {
        if (!cancelled) setRecepcion(r);
      })
      .catch((err) => {
        console.error("Error fetching recepcion:", err);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-sm text-gray-500">Cargando recepción...</p>
      </div>
    );
  }

  if (!recepcion) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-20">
        <p className="text-sm text-gray-500">No se encontró la recepción.</p>
        <Button as="link" to="/recepcion" iconLeft={<ArrowLeft className="h-4 w-4" />}>
          Volver
        </Button>
      </div>
    );
  }

  return (
    <div>
      <Breadcrumb
        items={[
          { label: "Recepción", to: "/recepcion" },
          { label: recepcion.codigo, to: `/recepcion/${recepcion.id}` },
          { label: "Editar Recepción" },
        ]}
      />

      <div className="mb-8 flex items-center gap-4">
        <Button
          variant="ghost"
          as="link"
          to={`/recepcion/${recepcion.id}`}
          iconLeft={<ArrowLeft className="h-4 w-4" />}
        >
          Volver
        </Button>
        <SectionHeader
          title="Editar Recepción"
          description={`Actualizando la información de la recepción ${recepcion.codigo}`}
        />
      </div>

      <RecepcionForm mode="edit" values={recepcion} />
    </div>
  );
}
