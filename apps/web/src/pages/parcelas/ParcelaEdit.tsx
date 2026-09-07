import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Breadcrumb, Button, LoadingSpinner } from "../../components/ui";
import ParcelaForm from "../../components/parcelas/ParcelaForm";
import { useParcela } from "../../hooks/queries";

interface ParcelaEditProps {
  inModal?: boolean;
  parcelaId?: string;
  onSave?: () => void;
}

export default function ParcelaEdit({ inModal, parcelaId: propId, onSave }: ParcelaEditProps) {
  const { id: paramId } = useParams();
  const id = propId || paramId;
  const navigate = useNavigate();
  const { data: parcela, isLoading } = useParcela(id || null);

  if (isLoading) {
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
      {!inModal && (
        <>
          <Breadcrumb
            items={[
              { label: "Parcelas", to: "/parcelas" },
              { label: parcela.codigo, to: `/parcelas/${parcela.id}` },
              { label: "Editar" },
            ]}
          />

          <div className="mb-8 flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={() => navigate(`/parcelas/${parcela.id}`)}
              iconLeft={<ArrowLeft className="h-4 w-4" />}
            >
              Volver
            </Button>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-[#111827]">Editar Parcela</h1>
              <p className="text-sm text-gray-500">
                Actualizando información de {parcela.nombre} ({parcela.codigo})
              </p>
            </div>
          </div>
        </>
      )}

      <ParcelaForm mode="edit" parcelaId={id} inModal={inModal} onSave={onSave} />
    </div>
  );
}
