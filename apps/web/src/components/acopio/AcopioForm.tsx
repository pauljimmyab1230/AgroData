import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Trash2, Save, ChevronLeft } from "lucide-react";
import { Button, Input, Select, Textarea, FormField } from "../ui";
import { CardHeader, CardShell, Field, type FormMode } from "../shared/formControls";
import type { Acopio, AcopioDetalleFormData, Saco } from "../../services/acopios";
import { ESTADO_ACOPIO_OPTIONS } from "../../services/acopios";
import { fetchProductores } from "../../services/productores";
import { fetchCultivos } from "../../services/cultivos";
import { fetchParcelas } from "../../services/parcelas";
import api from "../../services/api";
import { toast } from "../../utils/toast";

interface AcopioFormProps {
  mode: FormMode;
  values?: Acopio;
  inModal?: boolean;
  onSave?: () => void;
}

const emptyDetalle: AcopioDetalleFormData = {
  productor_id: 0,
  productorNombre: "",
  cultivo_id: 0,
  cultivoNombre: "",
  parcela_id: null,
  parcelaNombre: "",
  observaciones: "",
  sacos: [],
};

export default function AcopioForm({ mode, values, inModal, onSave }: AcopioFormProps) {
  const navigate = useNavigate();
  const editable = mode !== "view";

  const [fecha, setFecha] = useState(values?.fecha || new Date().toISOString().split("T")[0]);
  const [acopiador, setAcopiador] = useState(values?.acopiador || "");
  const [vehiculo, setVehiculo] = useState(values?.vehiculo || "");
  const [rutaAcopio, setRutaAcopio] = useState(values?.ruta_acopio || "");
  const [pesoBruto, setPesoBruto] = useState(values?.peso_bruto ?? 0);
  const [tara, setTara] = useState(values?.tara ?? 0);
  const [estado, setEstado] = useState(values?.estado || "EN_CAMPO");
  const [observaciones, setObservaciones] = useState(values?.observaciones || "");
  const [detalles, setDetalles] = useState<AcopioDetalleFormData[]>(
    values?.detalles?.map((d) => ({
      productor_id: d.productor_id,
      productorNombre: d.productorNombre,
      cultivo_id: d.cultivo_id,
      cultivoNombre: d.cultivoNombre,
      parcela_id: d.parcela_id,
      parcelaNombre: d.parcelaNombre,
      observaciones: d.observaciones,
      sacos: d.sacos.map((s) => ({
        codigo: s.codigo,
        peso: s.peso,
        observaciones: s.observaciones,
      })),
    })) || []
  );

  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [productoresOpts, setProductoresOpts] = useState<{ value: string; label: string }[]>([]);
  const [cultivosOpts, setCultivosOpts] = useState<{ value: string; label: string }[]>([]);
  const [parcelasOpts, setParcelasOpts] = useState<Map<number, { value: string; label: string }[]>>(new Map());

  useEffect(() => {
    fetchProductores({ limit: 200 })
      .then((res) => {
        setProductoresOpts(
          res.data.map((p) => ({
            value: String(p.id),
            label: `${p.codigo} - ${p.nombres} ${p.apellidoPaterno} ${p.apellidoMaterno}`,
          }))
        );
      })
      .catch(() => {});
  }, []);

  const loadCultivos = async (productorId?: number) => {
    try {
      const res = await fetchCultivos({ limit: 200 });
      const cultivos = productorId
        ? res.data.filter((c) => c.productorId === productorId)
        : res.data;
      setCultivosOpts(
        cultivos.map((c) => ({
          value: String(c.id),
          label: `${c.codigo} - ${c.cultivo} (${c.variedad || ""})`,
        }))
      );
    } catch {
      // Ignore errors
    }
  };

  const loadParcelas = async (productorId: number) => {
    try {
      const res = await fetchParcelas({ productorId: String(productorId), limit: 200 });
      const opts = res.data.map((p) => ({
        value: String(p.id),
        label: `${p.codigo} - ${p.nombre} (${p.area} ${p.areaUnidad})`,
      }));
      setParcelasOpts((prev) => new Map(prev).set(productorId, opts));
    } catch {
      // Ignore errors
    }
  };

  useEffect(() => {
    loadCultivos();
  }, []);

  useEffect(() => {
    for (const d of detalles) {
      if (d.productor_id > 0 && !parcelasOpts.has(d.productor_id)) {
        loadParcelas(d.productor_id);
      }
    }
  }, [detalles]);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!fecha) newErrors.fecha = "La fecha es obligatoria";
    if (!acopiador.trim()) newErrors.acopiador = "El acopiador es obligatorio";
    if (pesoBruto > 0 && tara > pesoBruto) newErrors.tara = "La tara no puede ser mayor al peso bruto";
    if (detalles.length === 0) newErrors.detalles = "Debe agregar al menos un productor";

    const sacoCodes = new Set<string>();
    detalles.forEach((d, i) => {
      if (!d.productor_id) newErrors[`detalle_${i}_productor`] = "Seleccione un productor";
      if (!d.cultivo_id) newErrors[`detalle_${i}_cultivo`] = "Seleccione un cultivo";
      if (d.sacos.length === 0) {
        newErrors[`detalle_${i}_sacos`] = "Agregue al menos un saco";
      } else {
        for (const s of d.sacos) {
          if (sacoCodes.has(s.codigo)) {
            newErrors[`detalle_${i}_sacos`] = `Código de saco duplicado: ${s.codigo}`;
          }
          sacoCodes.add(s.codigo);
        }
      }
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
    setDetalles(detalles.map((d, i) => (i === index ? { ...d, ...patch } : d)));
  };

  const handleRemoveSaco = (detalleIndex: number, sacoIndex: number) => {
    handleDetalleChange(detalleIndex, {
      sacos: detalles[detalleIndex].sacos.filter((_, i) => i !== sacoIndex),
    });
  };

  const handleQuickAddSaco = (detalleIndex: number) => {
    const peso = parseFloat(detalles[detalleIndex].pesoInput || "0");
    if (peso <= 0) return;

    const sacoNum = detalles[detalleIndex].sacos.length + 1;
    const newSaco: Saco = {
      codigo: `SAC-${String(sacoNum).padStart(3, "0")}`,
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
        peso_bruto: pesoBruto,
        tara,
        estado,
        observaciones: observaciones || null,
        detalles: detalles
          .map((d) => ({
            productor_id: d.productor_id,
            cultivo_id: d.cultivo_id,
            parcela_id: d.parcela_id || null,
            observaciones: d.observaciones || null,
            sacos: d.sacos.map((s) => ({
              codigo: s.codigo,
              peso: s.peso,
              observaciones: s.observaciones || null,
            })),
          }))
          .filter((d) => d.productor_id > 0 && d.cultivo_id > 0),
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
  const pesoNeto = Math.round((pesoBruto - tara) * 100) / 100;

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
              options={ESTADO_ACOPIO_OPTIONS}
              value={estado}
              onChange={(val) => setEstado(val)}
              disabled={!editable}
            />
          </Field>
        </div>

        {/* Pesaje */}
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          <Field label="Peso Bruto (kg)" mode={mode} value={pesoBruto}>
            <Input
              type="number"
              step="0.01"
              min="0"
              value={pesoBruto || ""}
              onChange={(e) => setPesoBruto(parseFloat(e.target.value) || 0)}
              placeholder="0.00"
              disabled={!editable}
            />
          </Field>
          <Field label="Tara (kg)" mode={mode} value={tara} error={errors.tara}>
            <Input
              type="number"
              step="0.01"
              min="0"
              value={tara || ""}
              onChange={(e) => setTara(parseFloat(e.target.value) || 0)}
              placeholder="0.00"
              disabled={!editable}
            />
          </Field>
          <div className="flex flex-col justify-end">
            <p className="text-xs text-gray-500">Peso Neto</p>
            <p className={`text-xl font-bold ${pesoNeto >= 0 ? "text-[#111827]" : "text-red-600"}`}>
              {pesoNeto.toFixed(2)} kg
            </p>
          </div>
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
          actions={
            editable ? (
              <Button variant="secondary" size="sm" onClick={handleAddDetalle} iconLeft={<Plus className="h-4 w-4" />}>
                Agregar Productor
              </Button>
            ) : undefined
          }
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
            {[...detalles]
              .reverse()
              .map((detalle, ri) => {
                const di = detalles.length - 1 - ri;
                const pesoDetalle = detalle.sacos.reduce((s, saco) => s + saco.peso, 0);
                const productorParcelas = detalle.productor_id > 0 ? parcelasOpts.get(detalle.productor_id) ?? [] : [];
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

                    <div className="grid gap-3 sm:grid-cols-3">
                      <FormField label="Productor" required error={errors[`detalle_${di}_productor`]}>
                        <Select
                          options={productoresOpts}
                          placeholder="Seleccione productor"
                          value={String(detalle.productor_id || "")}
                          onChange={(val) => {
                            const prod = productoresOpts.find((o) => o.value === val);
                            handleDetalleChange(di, {
                              productor_id: Number(val),
                              productorNombre: prod?.label || "",
                              parcela_id: null,
                              parcelaNombre: "",
                            });
                            loadParcelas(Number(val));
                            loadCultivos(Number(val));
                          }}
                          disabled={!editable}
                        />
                      </FormField>
                      <FormField label="Cultivo" required error={errors[`detalle_${di}_cultivo`]}>
                        <Select
                          options={cultivosOpts}
                          placeholder="Seleccione cultivo"
                          value={String(detalle.cultivo_id || "")}
                          onChange={(val) => {
                            const cult = cultivosOpts.find((o) => o.value === val);
                            handleDetalleChange(di, { cultivo_id: Number(val), cultivoNombre: cult?.label || "" });
                          }}
                          disabled={!editable}
                        />
                      </FormField>
                      <FormField label="Parcela">
                        <Select
                          options={productorParcelas}
                          placeholder="Seleccione parcela"
                          value={String(detalle.parcela_id || "")}
                          onChange={(val) => {
                            const parc = productorParcelas.find((o) => o.value === val);
                            handleDetalleChange(di, { parcela_id: Number(val) || null, parcelaNombre: parc?.label || "" });
                          }}
                          disabled={!editable || !detalle.productor_id}
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
        <CardHeader icon={<span className="text-lg">📊</span>} title="Resumen del Acopio" />
        <div className="grid gap-4 sm:grid-cols-4">
          <div>
            <p className="text-xs text-gray-500">Total Productores</p>
            <p className="text-xl font-bold text-[#111827]">{detalles.length}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Total Sacos</p>
            <p className="text-xl font-bold text-[#111827]">{totalSacos}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Peso Campo (sacos)</p>
            <p className="text-xl font-bold text-[#111827]">{pesoTotal.toFixed(2)} kg</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Peso Neto (bruto - tara)</p>
            <p className={`text-xl font-bold ${pesoNeto >= 0 ? "text-[#111827]" : "text-red-600"}`}>
              {pesoNeto.toFixed(2)} kg
            </p>
          </div>
        </div>
      </CardShell>

      {/* Action Buttons */}
      {editable && (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-gray-200 bg-white px-5 py-4 shadow-sm">
          <Button variant="secondary" onClick={() => (inModal ? onSave?.() : navigate(cancelTo))} iconLeft={<ChevronLeft className="h-4 w-4" />}>
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
