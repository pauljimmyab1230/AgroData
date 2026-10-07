import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft, Factory, Save } from "lucide-react";
import { Button, Input, Select } from "../../components/ui";
import { CardShell, CardHeader, Field } from "../../components/shared/formControls";
import {
  OperacionesChecklist,
  type OperacionSeleccionada,
} from "../../components/procesamiento/OperacionesChecklist";
import {
  useCreateOrden,
  useOperacionesActivas,
  useRecetasActivas,
  useReceta,
} from "../../hooks/queries";
import { useRecepciones } from "../../hooks/queries";
import type { EtapaProceso, FormatoSalida, CalidadProducto } from "../../services/ordenes";
import { toast } from "../../utils/toast";

const ETAPA_OPTIONS = [
  { value: "PRIMARIA", label: "Primaria" },
  { value: "SECUNDARIA", label: "Secundaria" },
  { value: "EMPAQUE", label: "Empaque" },
];

const FORMATO_OPTIONS = [
  { value: "GRANO", label: "Grano" },
  { value: "HARINA", label: "Harina" },
  { value: "HOJUELA", label: "Hojuelas" },
  { value: "POP", label: "Pop" },
  { value: "GRANEL", label: "Granel" },
  { value: "OTRO", label: "Otro" },
];

const CALIDAD_OPTIONS = [
  { value: "", label: "Sin definir" },
  { value: "PRIMERA", label: "Primera" },
  { value: "SEGUNDA", label: "Segunda" },
  { value: "TERCERA", label: "Tercera" },
  { value: "DESCARTE", label: "Descarte" },
];

interface OrdenCreateProps {
  inModal?: boolean;
  onSave?: () => void;
  onClose?: () => void;
  ordenOrigenId?: number;
}

export default function OrdenCreate({ inModal, onSave, onClose, ordenOrigenId: propOrigenId }: OrdenCreateProps) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const ordenOrigenId = propOrigenId ?? (searchParams.get("orden_origen_id") ? Number(searchParams.get("orden_origen_id")) : undefined);

  const [planta, setPlanta] = useState("Planta San Juan");
  const [responsable, setResponsable] = useState("");
  const [fechaInicio, setFechaInicio] = useState(new Date().toISOString().split("T")[0]);
  const [fechaFin, setFechaFin] = useState("");
  const [etapa, setEtapa] = useState<EtapaProceso>("PRIMARIA");
  const [formatoSalida, setFormatoSalida] = useState<FormatoSalida>("GRANO");
  const [recetaId, setRecetaId] = useState<string>("");
  const [productoSalida, setProductoSalida] = useState("");
  const [pesoEntrada, setPesoEntrada] = useState("");
  const [humedadFinal, setHumedadFinal] = useState("");
  const [calidad, setCalidad] = useState<string>("");
  const [observaciones, setObservaciones] = useState("");
  const [operaciones, setOperaciones] = useState<OperacionSeleccionada[]>([]);
  const [recepcionesSeleccionadas, setRecepcionesSeleccionadas] = useState<
    { recepcion_id: number; cantidad_asignada: number }[]
  >([]);

  const { data: catalogoOperaciones = [] } = useOperacionesActivas();
  const { data: recetas = [] } = useRecetasActivas();
  const { data: recetaDetalle } = useReceta(recetaId ? Number(recetaId) : null);
  const { data: recepcionesResult } = useRecepciones({ limit: 50 });
  const createMutation = useCreateOrden();

  // Precargar operaciones de la receta al seleccionarla
  useEffect(() => {
    if (recetaDetalle?.operaciones && recetaDetalle.operaciones.length > 0) {
      setOperaciones(
        recetaDetalle.operaciones.map((ro) => ({
          operacion_id: ro.operacion.id,
          orden: ro.orden,
          nombre: ro.operacion.nombre,
          codigo: ro.operacion.codigo,
        })),
      );
    }
  }, [recetaDetalle]);

  // Precargar formato de salida de la receta
  useEffect(() => {
    if (recetaDetalle?.formato_salida) {
      setFormatoSalida(recetaDetalle.formato_salida);
    }
    if (recetaDetalle?.nombre && !productoSalida) {
      setProductoSalida(recetaDetalle.nombre);
    }
  }, [recetaDetalle]);

  const handleSubmit = async () => {
    if (!planta.trim() || !responsable.trim() || !productoSalida.trim()) {
      toast.error("Completa los campos obligatorios: planta, responsable y producto de salida");
      return;
    }

    const payload = {
      planta: planta.trim(),
      responsable: responsable.trim(),
      fecha_inicio: fechaInicio,
      fecha_fin: fechaFin || null,
      etapa,
      formato_salida: formatoSalida,
      receta_id: recetaId ? Number(recetaId) : null,
      orden_origen_id: ordenOrigenId ? Number(ordenOrigenId) : null,
      producto_salida: productoSalida.trim(),
      peso_entrada: pesoEntrada ? Number(pesoEntrada) : 0,
      humedad_final: humedadFinal ? Number(humedadFinal) : null,
      calidad: calidad ? (calidad as CalidadProducto) : null,
      observaciones: observaciones.trim() || null,
      operaciones: operaciones.map((o, i) => ({ operacion_id: o.operacion_id, orden: i + 1 })),
      recepciones: recepcionesSeleccionadas.filter((r) => r.cantidad_asignada > 0),
    };

    try {
      await createMutation.mutateAsync(payload);
      toast.success("Orden de procesamiento creada exitosamente");
      if (inModal) {
        onSave?.();
      } else {
        navigate("/procesamiento");
      }
    } catch (err) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      toast.error(msg ?? "Error al crear la orden");
    }
  };

  const recepciones = recepcionesResult?.data ?? [];

  return (
    <div>
      {!inModal && (
        <div className="mb-8 flex items-center gap-4">
          <Button variant="ghost" onClick={() => navigate("/procesamiento")} iconLeft={<ArrowLeft className="h-4 w-4" />}>
            Procesamiento
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-[#111827]">Nueva orden de procesamiento</h1>
            <p className="text-sm text-gray-500">
              Selecciona los procesos a aplicar y registra las salidas pesadas
            </p>
          </div>
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        <CardShell>
          <CardHeader icon={<Factory size={20} />} title="Datos de la orden" />
          <div className="space-y-4">
            <Field label="Planta" mode="edit" required>
              <Input value={planta} onChange={(e) => setPlanta(e.target.value)} />
            </Field>

            <Field label="Responsable" mode="edit" required>
              <Input value={responsable} onChange={(e) => setResponsable(e.target.value)} placeholder="Nombre del responsable" />
            </Field>

            <div className="grid grid-cols-2 gap-3">
              <Field label="Fecha inicio" mode="edit" required>
                <Input type="date" value={fechaInicio} onChange={(e) => setFechaInicio(e.target.value)} />
              </Field>
              <Field label="Fecha fin" mode="edit">
                <Input type="date" value={fechaFin} onChange={(e) => setFechaFin(e.target.value)} />
              </Field>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Field label="Etapa" mode="edit" required>
                <Select options={ETAPA_OPTIONS} value={etapa} onChange={(v) => setEtapa(v as EtapaProceso)} />
              </Field>
              <Field label="Formato de salida" mode="edit">
                <Select
                  options={FORMATO_OPTIONS}
                  value={formatoSalida}
                  onChange={(v) => setFormatoSalida(v as FormatoSalida)}
                />
              </Field>
            </div>

            <Field label="Producto de salida" mode="edit" required>
              <Input
                value={productoSalida}
                onChange={(e) => setProductoSalida(e.target.value)}
                placeholder="Ej. Quinua beneficiada"
              />
            </Field>

            <div className="grid grid-cols-3 gap-3">
              <Field label="Peso entrada (kg)" mode="edit">
                <Input
                  type="number"
                  min="0"
                  step="0.01"
                  value={pesoEntrada}
                  onChange={(e) => setPesoEntrada(e.target.value)}
                />
              </Field>
              <Field label="Humedad final (%)" mode="edit">
                <Input
                  type="number"
                  min="0"
                  max="100"
                  step="0.1"
                  value={humedadFinal}
                  onChange={(e) => setHumedadFinal(e.target.value)}
                />
              </Field>
              <Field label="Calidad" mode="edit">
                <Select options={CALIDAD_OPTIONS} value={calidad} onChange={setCalidad} />
              </Field>
            </div>

            <Field label="Observaciones" mode="edit">
              <Input
                value={observaciones}
                onChange={(e) => setObservaciones(e.target.value)}
                placeholder="Opcional"
              />
            </Field>
          </div>
        </CardShell>

        <div className="space-y-6">
          <CardShell>
            <CardHeader
              icon={<Factory size={20} />}
              title="Receta (opcional)"
              description="Selecciona una receta para precargar los procesos"
            />
            <div className="space-y-3">
              <Field label="Receta" mode="edit">
                <Select
                  options={recetas.map((r) => ({
                    value: String(r.id),
                    label: `${r.nombre} · ${r.producto_base} (${r.etapa})`,
                  }))}
                  placeholder="Sin receta (selecciona manualmente)"
                  value={recetaId}
                  onChange={setRecetaId}
                />
              </Field>
              {recetaDetalle && (
                <p className="text-xs text-gray-500">{recetaDetalle.descripcion}</p>
              )}
            </div>
          </CardShell>

          <OperacionesChecklist
            mode="edit"
            seleccionadas={operaciones}
            catalogo={catalogoOperaciones}
            onChange={setOperaciones}
          />

          <CardShell>
            <CardHeader
              icon={<Factory size={20} />}
              title="Recepciones de origen (opcional)"
              description="Asigna lotes de recepción que alimentan esta orden"
            />
            {recepciones.length === 0 ? (
              <p className="text-sm text-gray-500">No hay recepciones disponibles.</p>
            ) : (
              <div className="max-h-72 space-y-2 overflow-y-auto">
                {recepciones.slice(0, 10).map((r) => {
                  const asignada = recepcionesSeleccionadas.find((s) => s.recepcion_id === r.id);
                  return (
                    <div key={r.id} className="flex items-center gap-3 rounded-lg border border-gray-100 p-2">
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-[#111827]">{r.codigo}</p>
                        <p className="text-xs text-gray-500">
                          {r.loteProductor ?? "Sin lote"} · {Number(r.pesoNeto ?? 0).toLocaleString("es-PE")} kg
                        </p>
                      </div>
                      <div className="w-32 shrink-0">
                        <Input
                          type="number"
                          min="0"
                          step="0.01"
                          placeholder="Kg a asignar"
                          value={asignada ? String(asignada.cantidad_asignada) : ""}
                          onChange={(e) => {
                            const cantidad = Number(e.target.value) || 0;
                            setRecepcionesSeleccionadas((prev) => {
                              const otros = prev.filter((s) => s.recepcion_id !== r.id);
                              return cantidad > 0
                                ? [...otros, { recepcion_id: r.id, cantidad_asignada: cantidad }]
                                : otros;
                            });
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardShell>
        </div>
      </div>

      <div className="mt-6 flex justify-end gap-3">
        <Button variant="ghost" onClick={() => (inModal ? onClose?.() : navigate("/procesamiento"))}>
          Cancelar
        </Button>
        <Button onClick={handleSubmit} disabled={createMutation.isPending} iconLeft={<Save className="h-4 w-4" />}>
          {createMutation.isPending ? "Creando..." : "Crear orden"}
        </Button>
      </div>
    </div>
  );
}
