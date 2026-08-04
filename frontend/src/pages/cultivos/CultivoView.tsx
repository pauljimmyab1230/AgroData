import { useParams } from "react-router-dom";
import { FolderOpen, Pencil, Ruler, Sprout, Wheat } from "lucide-react";
import { Badge, Button, Card } from "../../components/ui";
import CultivoHeader from "../../components/cultivos/CultivoHeader";
import { cultivoEstadoBadge } from "../../components/cultivos/cultivoEstadoBadge";
import CultivoPerfilKPI from "../../components/cultivos/CultivoPerfilKPI";
import ResumenCultivo from "../../components/cultivos/ResumenCultivo";
import { DatosGeneralesCard } from "../../components/cultivos/DatosGeneralesCard";
import { InformacionCultivoCard } from "../../components/cultivos/InformacionCultivoCard";
import { InformacionTecnicaCard } from "../../components/cultivos/InformacionTecnicaCard";
import { EstimacionProduccionCard } from "../../components/cultivos/EstimacionProduccionCard";
import { EstadoFenologicoCard } from "../../components/cultivos/EstadoFenologicoCard";
import { CronogramaCard } from "../../components/cultivos/CronogramaCard";
import { FotografiasCard } from "../../components/cultivos/FotografiasCard";
import { ObservacionesCard } from "../../components/cultivos/ObservacionesCard";
import { CultivoDocuments } from "../../components/cultivos/CultivoDocuments";
import CultivoHistorial from "../../components/cultivos/CultivoHistorial";
import { CardHeader, CardShell } from "../../components/shared/formControls";
import { buildCultivoHistorial, cultivosMock } from "./cultivoMock";

export default function CultivoView() {
  const { id } = useParams();
  const cultivo = cultivosMock.find((c) => c.id === Number(id)) ?? cultivosMock[0];

  const certificacionBadge =
    cultivo.certificacion === "Orgánica" ? (
      <Badge variant="green">{cultivo.certificacion}</Badge>
    ) : cultivo.certificacion === "En Transición" ? (
      <Badge variant="yellow">{cultivo.certificacion}</Badge>
    ) : (
      <Badge variant="gray">{cultivo.certificacion}</Badge>
    );

  return (
    <div>
      <CultivoHeader
        title="Perfil del Cultivo"
        description="Información completa y seguimiento del cultivo registrado"
        crumbs={[{ label: "Cultivos", to: "/cultivos" }, { label: cultivo.codigo }]}
        backTo="/cultivos"
        actions={
          <Button
            variant="secondary"
            as="link"
            to={`/cultivos/${cultivo.id}/editar`}
            iconLeft={<Pencil className="h-4 w-4" />}
          >
            Editar
          </Button>
        }
      />

      <Card padding="lg" hover={false} className="mb-6 shadow-sm">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-forest-600/10 text-forest-600">
            <Wheat className="h-7 w-7" />
          </div>

          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-2xl font-bold text-[#111827]">
                {cultivo.cultivo} - {cultivo.variedad}
              </h1>
              {cultivoEstadoBadge(cultivo.estado)}
              {certificacionBadge}
            </div>
            <p className="mt-1 text-sm text-gray-500">
              Código: <span className="font-medium text-[#111827]">{cultivo.codigo}</span>
              {" · "}Campaña: <span className="font-medium text-[#111827]">{cultivo.campania}</span>
              {" · "}Productor: <span className="font-medium text-[#111827]">{cultivo.productor}</span>
            </p>
          </div>

          <div className="flex items-center gap-2 rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-medium text-[#111827]">
            <Ruler className="h-5 w-5 text-forest-600" />
            {cultivo.areaSembrada.toFixed(2)} ha
          </div>
          <div className="flex items-center gap-2 rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-medium text-[#111827]">
            <Sprout className="h-5 w-5 text-forest-600" />
            {cultivo.parcela}
          </div>
        </div>
      </Card>

      <CultivoPerfilKPI cultivo={cultivo} />
      <ResumenCultivo cultivo={cultivo} />

      <div className="mt-6 grid gap-6">
        <DatosGeneralesCard mode="view" values={cultivo} />
        <InformacionCultivoCard mode="view" values={cultivo} />
        <InformacionTecnicaCard mode="view" values={cultivo} />
        <EstimacionProduccionCard mode="view" values={cultivo} />
        <EstadoFenologicoCard mode="view" values={cultivo} />
        <CronogramaCard mode="view" values={cultivo} />
        <FotografiasCard mode="view" />
        <CardShell>
          <CardHeader
            icon={<FolderOpen size={20} />}
            title="Documentos"
            description="Documentación asociada al cultivo"
          />
          <CultivoDocuments mode="view" />
        </CardShell>
        <ObservacionesCard mode="view" value={cultivo.observaciones} />
        <CultivoHistorial eventos={buildCultivoHistorial(cultivo)} />
      </div>
    </div>
  );
}
