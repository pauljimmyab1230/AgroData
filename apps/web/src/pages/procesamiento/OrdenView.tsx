import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Pencil, CheckCircle2 } from "lucide-react";
import { Badge, Button, ConfirmDialog, LoadingSpinner } from "../../components/ui";
import { BalanceCard } from "../../components/procesamiento/BalanceCard";
import { OperacionesPanel } from "../../components/procesamiento/OperacionesPanel";
import { SalidasPanel } from "../../components/procesamiento/SalidasPanel";
import { TrazabilidadCard } from "../../components/procesamiento/TrazabilidadCard";
import { EncadenarPanel } from "../../components/procesamiento/EncadenarPanel";
import {
  useOrden,
  useBalance,
  useTrazabilidad,
  useOperacionesActivas,
  useFinalizarOrden,
} from "../../hooks/queries";
import { toast } from "../../utils/toast";

const estadoLabels: Record<string, string> = {
  BORRADOR: "Borrador",
  EN_PROCESO: "En proceso",
  FINALIZADO: "Finalizado",
  PAUSADA: "Pausada",
  CANCELADA: "Cancelada",
};

const etapaLabels: Record<string, string> = {
  PRIMARIA: "Primaria",
  SECUNDARIA: "Secundaria",
  EMPAQUE: "Empaque",
};

const estadoBadge: Record<string, "forest" | "yellow" | "purple" | "red" | "gray"> = {
  BORRADOR: "gray",
  EN_PROCESO: "yellow",
  FINALIZADO: "forest",
  PAUSADA: "purple",
  CANCELADA: "red",
};

interface OrdenViewProps {
  inModal?: boolean;
  ordenId?: number;
  onEdit?: (ordenId: number) => void;
  onClose?: () => void;
}

export default function OrdenView({ inModal, ordenId: propId, onEdit, onClose }: OrdenViewProps) {
  const navigate = useNavigate();
  const { id: paramId } = useParams();
  const ordenId = propId ?? (paramId ? Number(paramId) : null);

  const [confirmarFinalizar, setConfirmarFinalizar] = useState(false);

  const { data: orden, isLoading, refetch } = useOrden(ordenId);
  const { data: balance, refetch: refetchBalance } = useBalance(ordenId);
  const { data: trazabilidad } = useTrazabilidad(ordenId);
  const { data: catalogoOperaciones = [] } = useOperacionesActivas();
  const finalizarMutation = useFinalizarOrden();

  const handleFinalizar = async () => {
    if (ordenId == null) return;
    try {
      await finalizarMutation.mutateAsync(ordenId);
      toast.success("Orden finalizada y balance validado");
      setConfirmarFinalizar(false);
      refetch();
      refetchBalance();
    } catch (err) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      toast.error(msg ?? "No se pudo finalizar la orden");
      setConfirmarFinalizar(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <LoadingSpinner />
      </div>
    );
  }

  if (!orden) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-20">
        <p className="text-sm text-gray-500">No se encontró la orden de procesamiento.</p>
        <Button onClick={() => (inModal ? onClose?.() : navigate("/procesamiento"))}>Volver</Button>
      </div>
    );
  }

  const trazabilidadData = trazabilidad as
    | {
        recepciones?: Array<Record<string, unknown>>;
        orden_origen?: { id: number; codigo: string; producto_salida: string; etapa: string } | null;
        ordenes_siguientes?: Array<{ id: number; codigo: string; producto_salida: string; etapa: string }>;
      }
    | undefined;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-4">
        {!inModal && (
          <Button variant="ghost" onClick={() => navigate("/procesamiento")} iconLeft={<ArrowLeft className="h-4 w-4" />}>
            Procesamiento
          </Button>
        )}
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-[#111827]">{orden.codigo}</h1>
            <Badge variant={estadoBadge[orden.estado] ?? "gray"}>
              {estadoLabels[orden.estado] ?? orden.estado}
            </Badge>
            <Badge variant="purple">{etapaLabels[orden.etapa] ?? orden.etapa}</Badge>
          </div>
          <p className="mt-0.5 text-sm text-gray-500">
            {orden.producto_salida} · {orden.formato_salida} · {orden.planta} · {orden.responsable}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {orden.estado !== "FINALIZADO" && (
            <>
              <Button
                variant="secondary"
                onClick={() => (inModal ? onEdit?.(orden.id) : navigate(`/procesamiento/${orden.id}/editar`))}
                iconLeft={<Pencil className="h-4 w-4" />}
              >
                Editar
              </Button>
              <Button
                onClick={() => setConfirmarFinalizar(true)}
                disabled={finalizarMutation.isPending}
                iconLeft={<CheckCircle2 className="h-4 w-4" />}
              >
                Finalizar orden
              </Button>
            </>
          )}
        </div>
      </div>

      {balance && <BalanceCard balance={balance} />}

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-6">
          <OperacionesPanel
            ordenId={orden.id}
            operaciones={orden.operaciones ?? []}
            catalogo={catalogoOperaciones}
            mode={orden.estado === "FINALIZADO" ? "view" : "edit"}
            onRefresh={() => refetch()}
          />

          <SalidasPanel
            ordenId={orden.id}
            salidas={orden.salidas ?? []}
            mode={orden.estado === "FINALIZADO" ? "view" : "edit"}
            onRefresh={() => {
              refetch();
              refetchBalance();
            }}
          />
        </div>

        <div className="space-y-6">
          {trazabilidadData && (
            <TrazabilidadCard
              recepciones={(trazabilidadData.recepciones ?? []) as never}
              ordenOrigen={trazabilidadData.orden_origen ?? null}
              ordenesSiguientes={trazabilidadData.ordenes_siguientes ?? []}
              productoSalida={orden.producto_salida}
            />
          )}

          <EncadenarPanel
            orden={orden}
            onEncadenar={() => {
              if (inModal) onClose?.();
              navigate(`/procesamiento/nueva?orden_origen_id=${orden.id}`);
            }}
          />
        </div>
      </div>

      <ConfirmDialog
        open={confirmarFinalizar}
        onClose={() => setConfirmarFinalizar(false)}
        onConfirm={handleFinalizar}
        title="Finalizar orden de procesamiento"
        message={
          balance
            ? `Entrada: ${balance.peso_entrada.toLocaleString("es-PE")} kg · Salidas: ${balance.suma_salidas.toLocaleString("es-PE")} kg · Diferencia: ${balance.diferencia.toFixed(2)} kg (${balance.diferencia_pct.toFixed(2)}%). Si el balance no cuadra dentro de la tolerancia del ${balance.tolerancia_pct}%, no se podrá finalizar.`
            : "Se validará el balance de masa antes de finalizar."
        }
        confirmText={finalizarMutation.isPending ? "Finalizando..." : "Finalizar"}
        variant="primary"
      />
    </div>
  );
}
