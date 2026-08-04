import { ArrowLeft } from "lucide-react";
import { Breadcrumb, Button, SectionHeader } from "../../components/ui";
import ParcelaForm from "../../components/parcelas/ParcelaForm";

export default function ParcelaCreate() {
  return (
    <div>
      <Breadcrumb items={[{ label: "Parcelas", to: "/parcelas" }, { label: "Nueva Parcela" }]} />

      <div className="mb-8 flex items-center gap-4">
        <Button variant="ghost" as="link" to="/parcelas" iconLeft={<ArrowLeft className="h-4 w-4" />}>
          Volver
        </Button>
        <SectionHeader
          title="Nueva Parcela"
          description="Registra una nueva parcela mediante las pestañas del formulario"
        />
      </div>

      <ParcelaForm mode="create" />
    </div>
  );
}
