import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Trash2, Save, ChevronLeft } from "lucide-react";
import { Button, Input, Select, Textarea, FormField } from "../ui";
import { CardHeader, CardShell, Field, type FormMode } from "../shared/formControls";
import type { Acopio, AcopioDetalleFormData, Saco } from "../../services/acopios";
import { fetchProductores } from "../../services/productores";
import { fetchCultivos } from "../../services/cultivos";
import api from "../../services/api";
import { toast } from "../../utils/toast";

interface AcopioFormProps {
  mode: FormMode;
  values?: Acopio;
  inModal?: boolean;
  onSave?: () => void;
}

const emptyDetalle: AcopioDetalleFormData = {
  productorId: 0,
  productorNombre: "",
  cultivoId: 0,
  cultivoNombre: "",
  observaciones: "",
  sacos: [],
};

export default function AcopioForm({ mode, values, inModal, onSave }: AcopioFormProps) {
  const navigate = useNavigate();
  const editable = mode !== "view";

  const [fecha, setFecha] = useState(values?.fecha || new Date().toISOString().split("T")[0]);
  const [acopiador, setAcopiador] = useState(values?.acopiador || "");
  const [vehiculo, setVehiculo] = useState(values?.vehiculo || "");
  const [rutaAcopio, setRutaAcopio] = useState(values?.rutaAcopio || "");
  const [estado, setEstado] = useState(values?.estado || "EN_PROCESO");
  const [observaciones, setObservaciones] = useState(values?.observaciones || "");
  const [detalles, setDetalles] = useState<AcopioDetalleFormData[]>(
    values?.detalles?.map(d => ({
      productorId: d.productorId,
      productorNombre: d.productorNombre,
      cultivoId: d.cultivoId,
      cultivoNombre: d.cultivoNombre,
      observaciones: d.observaciones,
      sacos: d.sacos.map(s => ({
        codigo: s.codigo,
        peso: s.peso,
        observaciones: s.observaciones,
      })),
    })) || []
  );

  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Productor/Cultivo options
  const [productoresOpts, setProductoresOpts] = useState<{ value: string; label: string }[]>([]);
  const [cultivosOpts, setCultivosOpts] = useState<{ value: string; label: string }[]>([]);

  // Load productores and cultivos on mount
  useEffect(() => {
    fetchProductores({ limit: 200 }).then(res => {
      setProductoresOpts(res.data.map(p => ({ value: String(p.id), label: `${p.codigo} - ${p.nombres} ${p.apellidoPaterno} ${p.apellidoMaterno}` })));
    }).catch(() => {});
    loadCultivos();
  }, []);

  const loadCultivos = async () => {
    const res = await fetchCultivos({ limit: 200 });
    setCultivosOpts(res.data.map(c => ({ value: String(c.id), label: `${c.codigo} - ${c.cultivo} (${c.variedad || ''})` })));
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!fecha) newErrors.fecha = "La fecha es obligatoria";
    if (!acopiador.trim()) newErrors.acopiador = "El acopiador es obligatorio";
    if (detalles.length === 0) newErrors.detalles = "Debe agregar al menos un productor";
    detalles.forEach((d, i) => {
      if (!d.productorId) newErrors[`detalle_${i}_productor`] = "Seleccione un productor";
      if (!d.cultivoId) newErrors[`detalle_${i}_cultivo`] = "Seleccione un cultivo";
      if (d.sacos.length === 0) newErrors[`detalle_${i}_sacos`] = "Agregue al menos un saco";
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddDetalle = () => {
    setDetalles([{ ...emptyDetalle }, ...detalles]);
  };

  const handleRemoveDetalle = (index: number) => {
    setDetalles(detalles.filter((_, i) => i !== index));
  };

  const handleDetalleChange = (index: number, patch: Partial<AcopioDetalleFormData>) => {
    setDetalles(detalles.map((d, i) => i === index ? { ...d, ...patch } : d));
  };

  const handleAddSaco = (detalleIndex: number) => {
    const newSaco: Saco = {
      codigo: `SAC-${String(detalles[detalleIndex].sacos.length + 1).padStart(3, '0')}`,
      peso: 0,
      observaciones: "",
    };
    handleDetalleChange(detalleIndex, {
      sacos: [...detalles[detalleIndex].sacos, newSaco],
    });
  };

  const handleRemoveSaco = (detalleIndex: number, sacoIndex: number) => {
    handleDetalleChange(detalleIndex, {
      sacos: detalles[detalleIndex].sacos.filter((_, i) => i !== sacoIndex),
    });
  };

  const handleSacoChange = (detalleIndex: number, sacoIndex: number, patch: Partial<Saco>) => {
    const newSacos = detalles[detalleIndex].sacos.map((s, i) => i === sacoIndex ? { ...s, ...patch } : s);
    handleDetalleChange(detalleIndex, { sacos: newSacos });
  };

  const handleQuickAddSaco = (detalleIndex: number) => {
    const peso = parseFloat(detalles[detalleIndex].pesoInput || "0");
    if (peso <= 0) return;

    const sacoNum = detalles[detalleIndex].sacos.length + 1;
    const newSaco: Saco = {
      codigo: `SAC-${String(sacoNum).padStart(3, '0')}`,
      peso,
      observaciones: "",
    };

    handleDetalleChange(detalleIndex, {
      sacos: [...detalles[detalleIndex].sacos, newSaco],
      pesoInput: "",
    });
  };

  const handleSave = async () => {
    if (!validate()) {
      toast.error("Complete los campos obligatorios");
      return;
    }

    setSaving(true);
    try {
      const acopioData: Record<string, unknown> = {
        fecha,
        acopiador,
        vehiculo: vehiculo || null,
        ruta_acopio: rutaAcopio || null,
        estado,
        observaciones: observaciones || null,
        detalles: detalles.map(d => ({
          productor_id: d.productorId,
          cultivo_id: d.cultivoId,
          observaciones: d.observaciones || null,
          sacos: d.sacos.map(s => ({
            codigo: s.codigo,
            peso: s.peso,
            observaciones: s.observaciones || null,
          })),
        })).filter(d => d.productor_id > 0 && d.cultivo_id > 0),
      };

      if (mode === "create") {
        await api.post("/acopios", acopioData);
        toast.success("Acopio creado exitosamente");
      } else if (values?.id) {
        await api.put(`/acopios/${values.id}`, acopioData);
        toast.success("Acopio actualizado exitosamente");
      }

      if (!inModal) {
        navigate("/acopio");
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

  const cancelTo = mode === "create" ? "/acopio" : `/acopio/${values?.id ?? ""}`;

  const totalSacos = detalles.reduce((sum, d) => sum + d.sacos.length, 0);
  const pesoTotal = detalles.reduce((sum, d) => sum + d.sacos.reduce((s, saco) => s + saco.peso, 0), 0);

  return (
    <div className="space-y-6">
      {/* Datos Generales */}
      <CardShell>
        <CardHeader
          icon={<span className="text-lg">📋</span>}
          title="Datos Generales"
          description="Información básica del acopio"
        />
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Fecha" mode={mode} value={fecha} required error={errors.fecha}>
            <Input type="date" value={fecha} onChange={(e) => setFecha(e.target.value)} disabled={!editable} />
          </Field>
          <Field label="Acopiador" mode={mode} value={acopiador} required error={errors.acopiador}>
            <Input type="text" value={acopiador} onChange={(e) => setAcopiador(e.target.value)} placeholder="Nombre del acopiador" disabled={!editable} />
          </Field>
          <Field label="Vehículo" mode={mode} value={vehiculo}>
            <Input type="text" value={vehiculo} onChange={(e) => setVehiculo(e.target.value)} placeholder="Ej. Toyota Hilux ABC-123" disabled={!editable} />
          </Field>
          <Field label="Ruta de Acopio" mode={mode} value={rutaAcopio}>
            <Input type="text" value={rutaAcopio} onChange={(e) => setRutaAcopio(e.target.value)} placeholder="Ej. Origen - Destino" disabled={!editable} />
          </Field>
          <Field label="Estado" mode={mode} value={estado}>
            <Select
              options={[
                { value: "EN_PROCESO", label: "En Proceso" },
                { value: "COMPLETADO", label: "Completado" },
                { value: "EN_PLANTA", label: "En Planta" },
              ]}
              value={estado}
              onChange={(val) => setEstado(val)}
              disabled={!editable}
            />
          </Field>
        </div>
        <div className="mt-4">
          <Field label="Observaciones" mode={mode} value={observaciones}>
            <Textarea rows={3} value={observaciones} onChange={(e) => setObservaciones(e.target.value)} placeholder="Observaciones generales del acopio" disabled={!editable} />
          </Field>
        </div>
      </CardShell>

      {/* Detalles por Productor */}
      <CardShell>
        <CardHeader
          icon={<span className="text-lg">👨‍🌾</span>}
          title="Productores y Sacos"
          description="Registra los productores y sus sacos entregados"
          actions={editable ? (
            <Button variant="secondary" size="sm" onClick={handleAddDetalle} iconLeft={<Plus className="h-4 w-4" />}>
              Agregar Productor
            </Button>
          ) : undefined}
        />

        {errors.detalles && <p className="text-sm text-red-500">{errors.detalles}</p>}

        {detalles.length === 0 ? (
          <div className="py-8 text-center text-gray-400">
            <p>No hay productores registrados</p>
            {editable && (
              <Button variant="secondary" size="sm" onClick={handleAddDetalle} className="mt-2">
                Agregar Primer Productor
              </Button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {[...detalles].reverse().map((detalle, ri) => {
              const di = detalles.length - 1 - ri;
              const pesoDetalle = detalle.sacos.reduce((s, saco) => s + saco.peso, 0);
              return (
                <div key={di} className="rounded-xl border border-gray-200 p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <h4 className="font-medium text-[#111827]">Productor #{di + 1}</h4>
                    {editable && (
                      <button type="button" onClick={() => handleRemoveDetalle(di)} className="text-red-500 hover:text-red-700">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <FormField label="Productor" required error={errors[`detalle_${di}_productor`]}>
                      <Select
                        options={productoresOpts}
                        placeholder="Seleccione productor"
                        value={String(detalle.productorId || "")}
                        onChange={(val) => {
                          const prod = productoresOpts.find(o => o.value === val);
                          handleDetalleChange(di, { productorId: Number(val), productorNombre: prod?.label || "" });
                          loadCultivos(Number(val));
                        }}
                        disabled={!editable}
                      />
                    </FormField>
                    <FormField label="Cultivo" required error={errors[`detalle_${di}_cultivo`]}>
                      <Select
                        options={cultivosOpts}
                        placeholder="Seleccione cultivo"
                        value={String(detalle.cultivoId || "")}
                        onChange={(val) => {
                          const cult = cultivosOpts.find(o => o.value === val);
                          handleDetalleChange(di, { cultivoId: Number(val), cultivoNombre: cult?.label || "" });
                        }}
                        disabled={!editable}
                      />
                    </FormField>
                  </div>

                  {/* Sacos */}
                  <div className="mt-3">
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-600">
                        Sacos ({detalle.sacos.length} - {pesoDetalle.toFixed(2)} kg)
                      </span>
                    </div>

                    {errors[`detalle_${di}_sacos`] && <p className="text-xs text-red-500">{errors[`detalle_${di}_sacos`]}</p>}

                    {/* Input para agregar saco rápido */}
                    {editable && (
                      <div className="mb-3 flex items-center gap-2">
                        <Input
                          type="number"
                          step="0.01"
                          min="0"
                          placeholder="Peso del saco (kg)"
                          value={detalle.pesoInput || ""}
                          onChange={(e) => handleDetalleChange(di, { pesoInput: e.target.value })}
                          className="h-9 w-40"
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              handleQuickAddSaco(di);
                            }
                          }}
                        />
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => handleQuickAddSaco(di)}
                          disabled={!detalle.pesoInput || parseFloat(detalle.pesoInput) <= 0}
                          iconLeft={<Plus className="h-3 w-3" />}
                        >
                          Agregar Saco
                        </Button>
                      </div>
                    )}

                    {/* Lista de sacos */}
                    {detalle.sacos.length > 0 && (
                      <div className="rounded-lg bg-gray-50 p-3">
                        <div className="grid gap-2">
                          {detalle.sacos.map((saco, si) => (
                            <div key={si} className="flex items-center justify-between rounded-lg bg-white px-3 py-2 shadow-sm">
                              <div className="flex items-center gap-3">
                                <span className="text-xs font-medium text-gray-500">{saco.codigo}</span>
                                <span className="font-semibold text-[#111827]">{saco.peso.toFixed(2)} kg</span>
                              </div>
                              {editable && (
                                <button type="button" onClick={() => handleRemoveSaco(di, si)} className="text-red-400 hover:text-red-600">
                                  <Trash2 className="h-3.5 w-3.5" />
                                </button>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardShell>

      {/* Resumen */}
      <CardShell>
        <CardHeader
          icon={<span className="text-lg">📊</span>}
          title="Resumen del Acopio"
        />
        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <p className="text-xs text-gray-500">Total Productores</p>
            <p className="text-xl font-bold text-[#111827]">{detalles.length}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Total Sacos</p>
            <p className="text-xl font-bold text-[#111827]">{totalSacos}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Peso Total</p>
            <p className="text-xl font-bold text-[#111827]">{pesoTotal.toFixed(2)} kg</p>
          </div>
        </div>
      </CardShell>

      {/* Action Buttons */}
      {editable && (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-gray-200 bg-white px-5 py-4 shadow-sm">
          <Button
            variant="secondary"
            onClick={() => inModal ? onSave?.() : navigate(cancelTo)}
            iconLeft={<ChevronLeft className="h-4 w-4" />}
          >
            Cancelar
          </Button>
          <Button onClick={handleSave} disabled={saving} iconLeft={<Save className="h-4 w-4" />}>
            {saving ? "Guardando..." : mode === "create" ? "Crear Acopio" : "Guardar Cambios"}
          </Button>
        </div>
      )}
    </div>
  );
}
