import React, { useState, useEffect, useCallback } from "react";
import { View, Text, TextInput, Alert, StyleSheet } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { FormScreenLayout, FormSection, FormField } from "../components/layouts/FormScreenLayout";
import { SelectField } from "../components/ui/SelectField";
import { DatePickerField } from "../components/ui/DatePickerField";
import { LoadingSpinner } from "../components/ui";
import { useTheme } from "../contexts/ThemeContext";
import { createCultivo, updateCultivo, deleteCultivo, fetchCultivo } from "../services/campo";
import { fetchParcelasOpciones, fetchCampaniasOpciones } from "../services/catalogos";

const ESTADO_OPTIONS = ["EN_CRECIMIENTO", "COSECHADO", "PERDIDO"];
const METODO_SIEMBRA_OPTIONS = ["DIRECTA", "TRASPLANTE", "ALMACIGO", "OTRO"];
const SISTEMA_PRODUCTIVO_OPTIONS = ["AGROECOLOGICO", "ORGANICO", "CONVENCIONAL", "EN_TRANSICION"];
const TIPO_AGRICULTURA_OPTIONS = ["TRADICIONAL", "TECNIFICADA", "MIXTA"];
const CERTIFICACION_OPTIONS = ["ORGANICA", "EN_TRANSICION", "SIN_CERTIFICAR"];
const PROCEDENCIA_SEMILLA_OPTIONS = ["CERTIFICADA", "COMUN", "PRODUCIDA_EN_CAMPO", "CONSERVADA_POR_AGRICULTOR"];
const UNIDAD_SEMILLA_OPTIONS = ["kg", "lb", "qq", "t"];
const DESTINO_PRODUCCION_OPTIONS = ["VENTA_COOPERATIVA", "COMERCIALIZACION_LOCAL", "AUTOCONSUMO", "SEMILLA"];

const STEPS = ["Datos Generales", "Siembra", "Semilla", "Producción"];

interface FormData {
  cultivo: string;
  codigo: string;
  variedad: string;
  parcelaId: string;
  campaniaId: string;
  areaSembrada: string;
  fechaSiembra: string;
  metodoSiembra: string;
  sistemaProductivo: string;
  tipoAgricultura: string;
  certificacion: string;
  procedenciaSemilla: string;
  cantidadSemilla: string;
  unidadSemilla: string;
  fechaCosecha: string;
  estado: string;
  observaciones: string;
  rendimientoEsperado: string;
  produccionEstimada: string;
  destinoProduccion: string;
  distanciamientoSurcos: string;
  distanciamientoPlantas: string;
  densidadSiembra: string;
  tipoSemilla: string;
  loteSemilla: string;
  proveedorSemilla: string;
}

const initialForm: FormData = {
  cultivo: "", codigo: "", variedad: "", parcelaId: "", campaniaId: "",
  areaSembrada: "", fechaSiembra: "", metodoSiembra: "", sistemaProductivo: "",
  tipoAgricultura: "", certificacion: "SIN_CERTIFICAR", procedenciaSemilla: "",
  cantidadSemilla: "", unidadSemilla: "", fechaCosecha: "", estado: "EN_CRECIMIENTO",
  observaciones: "", rendimientoEsperado: "", produccionEstimada: "", destinoProduccion: "",
  distanciamientoSurcos: "", distanciamientoPlantas: "", densidadSiembra: "",
  tipoSemilla: "", loteSemilla: "", proveedorSemilla: "",
};

export default function CultivoFormScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { colors } = useTheme();
  const editId = route.params?.id;
  const isEdit = !!editId;
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<FormData>(initialForm);
  const [parcelas, setParcelas] = useState<{ id: number; label: string }[]>([]);
  const [campanias, setCampanias] = useState<{ id: number; label: string }[]>([]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [prods, camps] = await Promise.all([
          fetchParcelasOpciones(),
          fetchCampaniasOpciones(),
        ]);
        if (!cancelled) {
          setParcelas(prods);
          setCampanias(camps);
        }
      } catch {}
    })();
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    if (!isEdit) return;
    let cancelled = false;
    (async () => {
      try {
        const c = await fetchCultivo(editId);
        if (cancelled) return;
        setForm({
          cultivo: c.cultivo || "",
          codigo: c.codigo || "",
          variedad: c.variedad || "",
          parcelaId: String(c.parcelaId || ""),
          campaniaId: String(c.campaniaId || ""),
          areaSembrada: String(c.areaSembrada || ""),
          fechaSiembra: c.fechaSiembra || "",
          metodoSiembra: c.metodoSiembra || "",
          sistemaProductivo: c.sistemaProductivo || "",
          tipoAgricultura: c.tipoAgricultura || "",
          certificacion: c.certificacion || "SIN_CERTIFICAR",
          procedenciaSemilla: c.procedenciaSemilla || "",
          cantidadSemilla: String(c.cantidadSemilla || ""),
          unidadSemilla: c.unidadSemilla || "",
          fechaCosecha: c.fechaCosecha || "",
          estado: c.estado || "EN_CRECIMIENTO",
          observaciones: c.observaciones || "",
          rendimientoEsperado: String(c.rendimientoEsperado || ""),
          produccionEstimada: String(c.produccionEstimada || ""),
          destinoProduccion: c.destinoProduccion || "",
          distanciamientoSurcos: c.distanciamientoSurcos || "",
          distanciamientoPlantas: c.distanciamientoPlantas || "",
          densidadSiembra: c.densidadSiembra || "",
          tipoSemilla: c.tipoSemilla || "",
          loteSemilla: c.loteSemilla || "",
          proveedorSemilla: c.proveedorSemilla || "",
        });
      } catch {
        if (!cancelled) Alert.alert("Error", "No se pudo cargar el cultivo");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [editId]);

  const update = useCallback(<K extends keyof FormData>(key: K, value: FormData[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  }, []);

  const handleSave = useCallback(async () => {
    if (!form.cultivo?.trim()) { Alert.alert("Error", "El nombre del cultivo es obligatorio"); return; }
    if (!form.parcelaId) { Alert.alert("Error", "La parcela es obligatoria"); return; }
    if (!form.campaniaId) { Alert.alert("Error", "La campaña es obligatoria"); return; }
    if (form.areaSembrada) {
      const supNum = Number(form.areaSembrada);
      if (!Number.isFinite(supNum) || supNum <= 0) {
        Alert.alert("Error", "El área sembrada debe ser un número mayor a 0");
        return;
      }
    }

    setSaving(true);
    try {
      const data = {
        ...form,
        areaSembrada: form.areaSembrada ? Number(form.areaSembrada) : null,
        parcelaId: Number(form.parcelaId),
        campaniaId: Number(form.campaniaId),
        cantidadSemilla: form.cantidadSemilla ? Number(form.cantidadSemilla) : null,
        rendimientoEsperado: form.rendimientoEsperado ? Number(form.rendimientoEsperado) : null,
        produccionEstimada: form.produccionEstimada ? Number(form.produccionEstimada) : null,
      };
      if (isEdit) { await updateCultivo(editId, data); }
      else { await createCultivo(data); }
      Alert.alert("Éxito", isEdit ? "Cultivo actualizado" : "Cultivo creado", [
        { text: "OK", onPress: () => navigation.navigate("Cultivos", { refresh: true }) },
      ]);
    } catch (err: any) {
      const errors = err?.response?.data?.errors;
      let message = err?.response?.data?.message || "Error al guardar el cultivo";
      if (errors && Array.isArray(errors) && errors.length > 0) {
        message = errors.map((e: any) => e.message).join('\n');
      }
      Alert.alert("Error", message);
    } finally {
      setSaving(false);
    }
  }, [form, isEdit, editId, navigation]);

  const handleDelete = useCallback(() => {
    Alert.alert("Eliminar Cultivo", `¿Eliminar ${form.cultivo}?`, [
      { text: "Cancelar", style: "cancel" },
      { text: "Eliminar", style: "destructive", onPress: async () => {
        try { await deleteCultivo(editId); navigation.navigate("Cultivos", { refresh: true }); }
        catch { Alert.alert("Error", "No se pudo eliminar"); }
      }},
    ]);
  }, [form.cultivo, editId, navigation]);

  if (loading) return <LoadingSpinner text="Cargando..." />;

  const inputStyle = [s.input, { borderColor: colors.disabled, color: colors.text, backgroundColor: colors.surface }];

  const renderStep0 = () => (
    <View>
      <FormSection title="Datos Generales">
        <FormField label="Nombre del Cultivo *">
          <TextInput style={inputStyle} value={form.cultivo} onChangeText={(v) => update("cultivo", v)} placeholder="Ej: Quinua" placeholderTextColor={colors.placeholder} />
        </FormField>
        <FormField label="Código">
          <TextInput style={inputStyle} value={form.codigo} onChangeText={(v) => update("codigo", v)} placeholder="Auto-generado si está vacío" placeholderTextColor={colors.placeholder} />
        </FormField>
        <FormField label="Variedad">
          <TextInput style={inputStyle} value={form.variedad} onChangeText={(v) => update("variedad", v)} placeholderTextColor={colors.placeholder} />
        </FormField>
        <SelectField label="Parcela *" value={parcelas.find(p => String(p.id) === form.parcelaId)?.label || ""} options={parcelas.map(p => p.label)} onSelect={(v) => { const p = parcelas.find(x => x.label === v); if (p) update("parcelaId", String(p.id)); }} />
        <SelectField label="Campaña *" value={campanias.find(c => String(c.id) === form.campaniaId)?.label || ""} options={campanias.map(c => c.label)} onSelect={(v) => { const c = campanias.find(x => x.label === v); if (c) update("campaniaId", String(c.id)); }} />
        <FormField label="Área Sembrada (ha)">
          <TextInput style={inputStyle} value={form.areaSembrada} onChangeText={(v) => update("areaSembrada", v)} keyboardType="numeric" placeholderTextColor={colors.placeholder} />
        </FormField>
        <SelectField label="Estado" value={form.estado} options={ESTADO_OPTIONS} onSelect={(v) => update("estado", v)} />
        <SelectField label="Certificación" value={form.certificacion} options={CERTIFICACION_OPTIONS} onSelect={(v) => update("certificacion", v)} />
        <FormField label="Observaciones">
          <TextInput style={[s.input, { height: 80, borderColor: colors.disabled, color: colors.text, backgroundColor: colors.surface }]} value={form.observaciones} onChangeText={(v) => update("observaciones", v)} multiline textAlignVertical="top" placeholderTextColor={colors.placeholder} />
        </FormField>
      </FormSection>
    </View>
  );

  const renderStep1 = () => (
    <View>
      <FormSection title="Información de Siembra">
        <DatePickerField label="Fecha Siembra" value={form.fechaSiembra} onChange={(v) => update("fechaSiembra", v)} />
        <SelectField label="Método Siembra" value={form.metodoSiembra} options={METODO_SIEMBRA_OPTIONS} onSelect={(v) => update("metodoSiembra", v)} />
        <SelectField label="Sistema Productivo" value={form.sistemaProductivo} options={SISTEMA_PRODUCTIVO_OPTIONS} onSelect={(v) => update("sistemaProductivo", v)} />
        <SelectField label="Tipo Agricultura" value={form.tipoAgricultura} options={TIPO_AGRICULTURA_OPTIONS} onSelect={(v) => update("tipoAgricultura", v)} />
        <FormField label="Distanciamiento Surcos">
          <TextInput style={inputStyle} value={form.distanciamientoSurcos} onChangeText={(v) => update("distanciamientoSurcos", v)} placeholder="Ej: 0.70 m" placeholderTextColor={colors.placeholder} />
        </FormField>
        <FormField label="Distanciamiento Plantas">
          <TextInput style={inputStyle} value={form.distanciamientoPlantas} onChangeText={(v) => update("distanciamientoPlantas", v)} placeholder="Ej: 0.30 m" placeholderTextColor={colors.placeholder} />
        </FormField>
        <FormField label="Densidad Siembra">
          <TextInput style={inputStyle} value={form.densidadSiembra} onChangeText={(v) => update("densidadSiembra", v)} placeholder="Ej: 25 plantas/m²" placeholderTextColor={colors.placeholder} />
        </FormField>
      </FormSection>
    </View>
  );

  const renderStep2 = () => (
    <View>
      <FormSection title="Información de Semilla">
        <SelectField label="Procedencia Semilla" value={form.procedenciaSemilla} options={PROCEDENCIA_SEMILLA_OPTIONS} onSelect={(v) => update("procedenciaSemilla", v)} />
        <FormField label="Cantidad Semilla">
          <TextInput style={inputStyle} value={form.cantidadSemilla} onChangeText={(v) => update("cantidadSemilla", v)} keyboardType="numeric" placeholderTextColor={colors.placeholder} />
        </FormField>
        <SelectField label="Unidad Semilla" value={form.unidadSemilla} options={UNIDAD_SEMILLA_OPTIONS} onSelect={(v) => update("unidadSemilla", v)} />
        <FormField label="Tipo Semilla">
          <TextInput style={inputStyle} value={form.tipoSemilla} onChangeText={(v) => update("tipoSemilla", v)} placeholderTextColor={colors.placeholder} />
        </FormField>
        <FormField label="Lote Semilla">
          <TextInput style={inputStyle} value={form.loteSemilla} onChangeText={(v) => update("loteSemilla", v)} placeholderTextColor={colors.placeholder} />
        </FormField>
        <FormField label="Proveedor Semilla">
          <TextInput style={inputStyle} value={form.proveedorSemilla} onChangeText={(v) => update("proveedorSemilla", v)} placeholderTextColor={colors.placeholder} />
        </FormField>
      </FormSection>
    </View>
  );

  const renderStep3 = () => (
    <View>
      <FormSection title="Producción">
        <DatePickerField label="Fecha Cosecha" value={form.fechaCosecha} onChange={(v) => update("fechaCosecha", v)} />
        <FormField label="Rendimiento Esperado (kg/ha)">
          <TextInput style={inputStyle} value={form.rendimientoEsperado} onChangeText={(v) => update("rendimientoEsperado", v)} keyboardType="numeric" placeholderTextColor={colors.placeholder} />
        </FormField>
        <FormField label="Producción Estimada (kg)">
          <TextInput style={inputStyle} value={form.produccionEstimada} onChangeText={(v) => update("produccionEstimada", v)} keyboardType="numeric" placeholderTextColor={colors.placeholder} />
        </FormField>
        <SelectField label="Destino Producción" value={form.destinoProduccion} options={DESTINO_PRODUCCION_OPTIONS} onSelect={(v) => update("destinoProduccion", v)} />
      </FormSection>
    </View>
  );

  const steps = [renderStep0, renderStep1, renderStep2, renderStep3];

  return (
    <FormScreenLayout
      title="Cultivo"
      isEdit={isEdit}
      steps={STEPS}
      currentStep={step}
      onStepChange={setStep}
      onBack={() => navigation.goBack()}
      onSave={handleSave}
      onDelete={isEdit ? handleDelete : undefined}
      saving={saving}
    >
      {steps[step]()}
    </FormScreenLayout>
  );
}

const s = StyleSheet.create({
  input: { borderWidth: 1, borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10, fontSize: 14 },
});
