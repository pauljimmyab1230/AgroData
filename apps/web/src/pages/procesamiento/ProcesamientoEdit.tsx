import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Breadcrumb, Button, SectionHeader } from "../../components/ui";
import ProcesamientoForm from "../../components/procesamiento/ProcesamientoForm";
import {
  type OrdenProcesamiento,
  fetchProcesamiento,
} from "../../services/procesamientos";

export default function ProcesamientoEdit() {
  const { id } = useParams();
  const [orden, setOrden] = useState<OrdenProcesamiento | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    fetchProcesamiento(id)
      .then(setOrden)
      .catch((err) => console.error("Error loading procesamiento:", err))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading || !orden) {
    return (
      <div className="flex items-center justify-center py-20 text-gray-400">
        Cargando orden de procesamiento...
      </div>
    );
  }

  return (
    <div>
      <Breadcrumb
        items={[
          { label: "Procesamiento", to: "/procesamiento" },
          { label: orden.codigo, to: `/procesamiento/${orden.id}` },
          { label: "Editar Orden" },
        ]}
      />

      <div className="mb-8 flex items-center gap-4">
        <Button
          variant="ghost"
          as="link"
          to={`/procesamiento/${orden.id}`}
          iconLeft={<ArrowLeft className="h-4 w-4" />}
        >
          Volver
        </Button>
        <SectionHeader
          title="Editar Orden de Procesamiento"
          description={`Actualizando la información de la orden ${orden.codigo}`}
        />
      </div>

      <ProcesamientoForm mode="edit" values={orden} />
    </div>
  );
}
