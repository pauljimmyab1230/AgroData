import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Pencil, Ruler, Sprout, Wheat } from "lucide-react";
import { Badge, Button, Card, LoadingSpinner } from "../../components/ui";
import CultivoHeader from "../../components/cultivos/CultivoHeader";
import { cultivoEstadoBadge } from "../../components/cultivos/cultivoEstadoBadge";
import CultivoPerfilKPI from "../../components/cultivos/CultivoPerfilKPI";
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
import { fetchCultivo, type Cultivo } from "../../services/cultivos";

export default function CultivoView() {
  const { id } = useParams();
  const [cultivo, setCultivo] = useState<Cultivo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    fetchCultivo(id)
      .then(setCultivo)
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

  if (!cultivo) {
    return (
      <div className="py-20 text-center text-gray-500">
        <p>No se encontró el cultivo.</p>
      </div>
    );
  }

  const certificacionBadge =
    cultivo.certificacion === "ORGANICA" ? (
      <Badge variant="green">Orgánica</Badge>
    ) : cultivo.certificacion === "EN_TRANSICION" ? (
      <Badge variant="yellow">En Transición</Badge>
    ) : (
      <Badge variant="gray">Sin certificar</Badge>
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
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-forest-600 to-forest-400 text-white shadow-md shadow-forest-600/30">
            <Wheat className="h-7 w-7" />
          </div>

          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-2xl font-bold text-[#111827]">{cultivo.cultivo}</h1>
              {cultivoEstadoBadge(cultivo.estado)}
              {certificacionBadge}
            </div>
            <p className="mt-1 text-sm text-gray-500">
              Código: <span className="font-medium text-[#111827]">{cultivo.codigo}</span>
              {" · "}Variedad: <span className="font-medium text-[#111827]">{cultivo.variedad || "—"}</span>
              {" · "}Campaña: <span className="font-medium text-[#111827]">{cultivo.campaniaCodigo}</span>
            </p>
          </div>

          <div className="flex flex-col gap-2 sm:items-end">
            {cultivo.areaSembrada && (
              <div className="flex items-center gap-2 rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-medium text-[#111827]">
                <Ruler className="h-5 w-5 text-forest-600" />
                {cultivo.areaSembrada} ha
              </div>
            )}
            <div className="flex items-center gap-2 rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-medium text-[#111827]">
              <Sprout className="h-5 w-5 text-forest-600" />
              {cultivo.productorNombre}
            </div>
          </div>
        </div>
      </Card>

      <CultivoPerfilKPI cultivo={cultivo} />

      <div className="grid gap-6">
        <DatosGeneralesCard mode="view" values={cultivo} />
        <InformacionCultivoCard mode="view" values={cultivo} />
        <InformacionTecnicaCard mode="view" values={cultivo} />
        <EstimacionProduccionCard mode="view" values={cultivo} />
        <EstadoFenologicoCard mode="view" values={cultivo} />
        <CronogramaCard mode="view" values={cultivo} />
        <FotografiasCard mode="view" />
        <ObservacionesCard mode="view" value={cultivo.observaciones} />
        <CultivoDocuments mode="view" />
        <CultivoHistorial />
      </div>
    </div>
  );
}
