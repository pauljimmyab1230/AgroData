import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Breadcrumb, Button, LoadingSpinner, SectionHeader } from "../../components/ui";
import ParcelaForm from "../../components/parcelas/ParcelaForm";
import { ParcelaFormProvider } from "../../contexts/ParcelaFormContext";
import { fetchParcela, type Parcela } from "../../services/parcelas";

export default function ParcelaEdit() {
  const { id } = useParams();
  const [parcela, setParcela] = useState<Parcela | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    fetchParcela(id)
      .then(setParcela)
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

  if (!parcela) {
    return (
      <div className="py-20 text-center text-gray-500">
        <p>No se encontró la parcela.</p>
      </div>
    );
  }

  return (
    <div>
      <Breadcrumb
        items={[
          { label: "Parcelas", to: "/parcelas" },
          { label: parcela.codigo, to: `/parcelas/${parcela.id}` },
          { label: "Editar Parcela" },
        ]}
      />

      <div className="mb-8 flex items-center gap-4">
        <Button
          variant="ghost"
          as="link"
          to={`/parcelas/${parcela.id}`}
          iconLeft={<ArrowLeft className="h-4 w-4" />}
        >
          Volver
        </Button>
        <SectionHeader
          title="Editar Parcela"
          description={`Actualizando la información de ${parcela.nombre} (${parcela.codigo})`}
        />
      </div>

      <ParcelaFormProvider initial={parcela}>
        <ParcelaForm mode="edit" />
      </ParcelaFormProvider>
    </div>
  );
}
