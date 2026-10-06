import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Plus, Trash2, Save, Package } from "lucide-react";
import { Button, Input, Textarea } from "../ui";
import { CardHeader, CardShell, Field, type FormMode } from "../shared/formControls";
import type { Acopio } from "../../services/acopios";
import type { Recepcion } from "../../services/recepciones";
import { fetchAcopioByCodigo } from "../../services/acopios";
import api from "../../services/api";
import { toast } from "../../utils/toast";

interface RecepcionFormData {
  id?: string;
  acopioId?: number;
  acopioCodigo?: string;
  loteProductor?: string;
  fecha?: string;
  responsable?: string;
  planta?: string;
  sacosDetalle?: Array<{ codigo: string; peso: number }>;
  pesoBruto?: number;
  tara?: number;
  pesoNeto?: number;
  humedad?: number;
  impurezas?: number;
  observaciones?: string;
  estado?: string;
}

interface RecepcionFormProps {
  mode: FormMode;
  values?: RecepcionFormData | Recepcion;
  inModal?: boolean;
  onSave?: () => void;
}

export default function RecepcionForm({ mode, values, inModal, onSave }: RecepcionFormProps) {
  const navigate = useNavigate();
  const editable = mode !== "view";

  // Datos generales
  const [acopioCodigo, setAcopioCodigo] = useState(values?.acopioCodigo || "");
  const [acopioData, setAcopioData] = useState<Acopio | null>(null);
  const [loadingAcopio, setLoadingAcopio] = useState(false);
  const [errorAcopio, setErrorAcopio] = useState("");

  const [fecha, setFecha] = useState(values?.fecha || new Date().toISOString().split("T")[0]);
  const [responsable, setResponsable] = useState(values?.responsable || "");
  const [planta, setPlanta] = useState(values?.planta || "");
  const [loteProductor, setLoteProductor] = useState(values?.loteProductor || "");

  // Sacos (para pesaje) - se cargan desde la recepción
  const [sacos, setSacos] = useState<Array<{ codigo: string; peso: number }>>(
    (values?.sacosDetalle as Array<{ codigo: string; peso: number }>) || []
  );
  const [pesoInput, setPesoInput] = useState("");

  // Pesaje
  const [pesoBruto, setPesoBruto] = useState(values?.pesoBruto?.toString() || "");
  const [tara, setTara] = useState(values?.tara?.toString() || "");

  // Calidad
  const [humedad, setHumedad] = useState(values?.humedad?.toString() || "");
  const [impurezas, setImpurezas] = useState(values?.impurezas?.toString() || "");

  // Observaciones
  const [observaciones, setObservaciones] = useState(values?.observaciones || "");

  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Buscar acopio por código
  const handleBuscarAcopio = async () => {
    if (!acopioCodigo.trim()) {
      setErrorAcopio("Ingrese un código de acopio");
      return;
    }

    setLoadingAcopio(true);
    setErrorAcopio("");
    try {
      const acopio = await fetchAcopioByCodigo(acopioCodigo.trim());
      setAcopioData(acopio);

      // Auto-fill LP desde el acopio
      if (acopio.detalles?.length > 0) {
        const primerDetalle = acopio.detalles[0];
        setLoteProductor(primerDetalle.productorCodigo || "");
      }

      toast.success(`Acopio ${acopio.codigo} encontrado`);
    } catch {
      setErrorAcopio("Acopio no encontrado");
      setAcopioData(null);
    } finally {
      setLoadingAcopio(false);
    }
  };

  // Agregar saco por peso
  const handleAgregarSaco = () => {
    const peso = parseFloat(pesoInput);
    if (isNaN(peso) || peso <= 0) {
      toast.error("Ingrese un peso válido");
      return;
    }

    const sacoNum = sacos.length + 1;
    setSacos([...sacos, { codigo: `SAC-RCP-${String(sacoNum).padStart(3, '0')}`, peso }]);
    setPesoInput("");
  };

  // Eliminar saco
  const handleEliminarSaco = (index: number) => {
    setSacos(sacos.filter((_, i) => i !== index));
  };

  // Calcular totales
  const totalSacos = sacos.length;
  const pesoTotal = sacos.reduce((sum, s) => sum + s.peso, 0);
  const pesoBrutoNum = parseFloat(pesoBruto) || 0;
  const taraNum = parseFloat(tara) || 0;
  const pesoNeto = pesoBrutoNum - taraNum;
  const diferencia = pesoTotal - pesoNeto;

  // Validar
  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!fecha) newErrors.fecha = "La fecha es obligatoria";
    if (!responsable.trim()) newErrors.responsable = "El responsable es obligatorio";
    if (!planta.trim()) newErrors.planta = "La planta es obligatoria";
    if (sacos.length === 0) newErrors.sacos = "Debe agregar al menos un saco";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Guardar
  const handleSave = async () => {
    if (!validate()) {
      toast.error("Complete los campos obligatorios");
      return;
    }

    setSaving(true);
    try {
      const data: Record<string, unknown> = {
        acopio_id: acopioData?.id ? Number(acopioData.id) : (values?.acopioId ? Number(values.acopioId) : null),
        lote_productor: loteProductor || null,
        fecha,
        responsable,
        planta,
        sacos: totalSacos,
        peso_campo: pesoTotal,
        peso_bruto: pesoBrutoNum || null,
        tara: taraNum || null,
        peso_neto: pesoNeto || null,
        diferencia: diferencia || null,
        humedad: humedad ? Number(humedad) : null,
        impurezas: impurezas ? Number(impurezas) : null,
        observaciones: observaciones || null,
        estado: values?.estado || "PENDIENTE_PESAJE",
        sacos_detalle: sacos.map(s => ({ codigo: s.codigo, peso: s.peso })),
      };

      if (mode === "create") {
        await api.post("/recepciones", data);
        toast.success("Recepción creada exitosamente");
      } else if (values?.id) {
        await api.put(`/recepciones/${values.id}`, data);
        toast.success("Recepción actualizada exitosamente");
      }

      if (!inModal) {
        navigate("/recepcion");
      } else {
        onSave?.();
      }
    } catch (err: unknown) {
      console.error(err);
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || "Error al guardar.";
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  const cancelTo = mode === "create" ? "/recepcion" : `/recepcion/${values?.id ?? ""}`;

  return (
    <div className="space-y-6">
      {/* Datos Generales */}
      <CardShell>
        <CardHeader
          icon={<span className="text-lg">📋</span>}
          title="Datos Generales"
          description="Información básica de la recepción"
        />
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Fecha" mode={mode} value={fecha} required error={errors.fecha}>
            <Input type="date" value={fecha} onChange={(e) => setFecha(e.target.value)} disabled={!editable} />
          </Field>
          <Field label="Responsable" mode={mode} value={responsable} required error={errors.responsable}>
            <Input type="text" value={responsable} onChange={(e) => setResponsable(e.target.value)} placeholder="Nombre del responsable" disabled={!editable} />
          </Field>
          <Field label="Planta" mode={mode} value={planta} required error={errors.planta}>
            <Input type="text" value={planta} onChange={(e) => setPlanta(e.target.value)} placeholder="Ej. Planta Procesadora" disabled={!editable} />
          </Field>
        </div>
      </CardShell>

      {/* Búsqueda de Acopio */}
      <CardShell>
        <CardHeader
          icon={<span className="text-lg">🔍</span>}
          title="Acopio"
          description="Busca el acopio por código o ingresa manualmente"
        />
        <div className="flex items-end gap-3">
          <div className="flex-1">
            <Field label="Código del Acopio" mode={mode} value={acopioCodigo}>
              <Input
                type="text"
                value={acopioCodigo}
                onChange={(e) => setAcopioCodigo(e.target.value)}
                placeholder="Ej. ACO-2025-01"
                disabled={!editable || loadingAcopio}
                onKeyDown={(e) => { if (e.key === "Enter") handleBuscarAcopio(); }}
              />
            </Field>
          </div>
          {editable && (
            <Button
              variant="secondary"
              onClick={handleBuscarAcopio}
              disabled={loadingAcopio || !acopioCodigo.trim()}
              iconLeft={loadingAcopio ? undefined : <Search className="h-4 w-4" />}
            >
              {loadingAcopio ? "Buscando..." : "Buscar"}
            </Button>
          )}
        </div>

        {errorAcopio && <p className="mt-2 text-sm text-red-500">{errorAcopio}</p>}

        {acopioData && (
          <div className="mt-4 rounded-xl border border-green-200 bg-green-50 p-4">
            <p className="text-sm font-medium text-green-800">✓ Acopio encontrado: {acopioData.codigo}</p>
            <p className="text-xs text-green-600">
              {acopioData.acopiador} · {acopioData.detalles?.length || 0} productor(es) · {acopioData.total_sacos} sacos
            </p>
          </div>
        )}

        <div className="mt-4">
          <Field label="Lote del Productor (LP)" mode={mode} value={loteProductor}>
            <Input
              type="text"
              value={loteProductor}
              onChange={(e) => setLoteProductor(e.target.value)}
              placeholder="Código del lote"
              disabled={!editable}
            />
          </Field>
        </div>
      </CardShell>

      {/* Pesaje de Sacos */}
      <CardShell>
        <CardHeader
          icon={<Package size={20} />}
          title="Pesaje de Sacos"
          description="Registra el peso de cada saco recibido"
          actions={
            editable ? (
              <div className="flex items-end gap-2">
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="Peso (kg)"
                  value={pesoInput}
                  onChange={(e) => setPesoInput(e.target.value)}
                  className="h-9 w-32"
                  onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); handleAgregarSaco(); } }}
                />
                <Button variant="secondary" size="sm" onClick={handleAgregarSaco} disabled={!pesoInput || parseFloat(pesoInput) <= 0} iconLeft={<Plus className="h-3 w-3" />}>
                  Agregar
                </Button>
              </div>
            ) : undefined
          }
        />

        {errors.sacos && <p className="text-sm text-red-500">{errors.sacos}</p>}

        <div className="mb-3 flex items-center gap-4 text-sm">
          <span className="font-medium text-gray-600">Total: {totalSacos} sacos</span>
          <span className="font-semibold text-[#111827]">{pesoTotal.toFixed(2)} kg</span>
        </div>

        {sacos.length > 0 ? (
          <div className="rounded-lg bg-gray-50 p-3">
            <div className="grid gap-2">
              {sacos.map((saco, i) => (
                <div key={i} className="flex items-center justify-between rounded-lg bg-white px-3 py-2 shadow-sm">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-medium text-gray-500">{saco.codigo}</span>
                    <span className="font-semibold text-[#111827]">{saco.peso.toFixed(2)} kg</span>
                  </div>
                  {editable && (
                    <button type="button" onClick={() => handleEliminarSaco(i)} className="text-red-400 hover:text-red-600">
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        ) : (
          <p className="text-sm text-gray-400">No hay sacos registrados</p>
        )}
      </CardShell>

      {/* Resumen de Pesaje */}
      <CardShell>
        <CardHeader
          icon={<span className="text-lg">📊</span>}
          title="Resumen de Pesaje"
        />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Field label="Peso Bruto (kg)" mode={mode} value={pesoBruto}>
            <Input type="number" step="0.01" min="0" value={pesoBruto} onChange={(e) => setPesoBruto(e.target.value)} placeholder="0.00" disabled={!editable} />
          </Field>
          <Field label="Tara (kg)" mode={mode} value={tara}>
            <Input type="number" step="0.01" min="0" value={tara} onChange={(e) => setTara(e.target.value)} placeholder="0.00" disabled={!editable} />
          </Field>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">Peso Neto</p>
            <p className="mt-1 text-xl font-bold text-[#111827]">{pesoNeto.toFixed(2)} kg</p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">Diferencia</p>
            <p className={`mt-1 text-xl font-bold ${diferencia >= 0 ? "text-green-600" : "text-red-600"}`}>
              {diferencia >= 0 ? "+" : ""}{diferencia.toFixed(2)} kg
            </p>
          </div>
        </div>
      </CardShell>

      {/* Calidad */}
      <CardShell>
        <CardHeader
          icon={<span className="text-lg">🔍</span>}
          title="Control de Calidad"
          description="Evaluación de la calidad del producto recibido"
        />
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Humedad (%)" mode={mode} value={humedad}>
            <Input type="number" step="0.1" min="0" max="100" value={humedad} onChange={(e) => setHumedad(e.target.value)} placeholder="0.0" disabled={!editable} />
          </Field>
          <Field label="Impurezas (%)" mode={mode} value={impurezas}>
            <Input type="number" step="0.1" min="0" max="100" value={impurezas} onChange={(e) => setImpurezas(e.target.value)} placeholder="0.0" disabled={!editable} />
          </Field>
        </div>
      </CardShell>

      {/* Observaciones */}
      <CardShell>
        <CardHeader
          icon={<span className="text-lg">📝</span>}
          title="Observaciones"
        />
        <Textarea
          rows={4}
          value={observaciones}
          onChange={(e) => setObservaciones(e.target.value)}
          placeholder="Observaciones generales de la recepción..."
          disabled={!editable}
        />
      </CardShell>

      {/* Action Buttons */}
      {editable && (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-gray-200 bg-white px-5 py-4 shadow-sm">
          <Button variant="secondary" onClick={() => inModal ? onSave?.() : navigate(cancelTo)}>
            Cancelar
          </Button>
          <Button onClick={handleSave} disabled={saving} iconLeft={<Save className="h-4 w-4" />}>
            {saving ? "Guardando..." : mode === "create" ? "Crear Recepción" : "Guardar Cambios"}
          </Button>
        </div>
      )}
    </div>
  );
}
