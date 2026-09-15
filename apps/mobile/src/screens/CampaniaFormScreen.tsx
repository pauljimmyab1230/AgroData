import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Alert, StyleSheet } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { CalendarDays, Users, FileText } from "lucide-react-native";
import { FormScreenLayout, FormSection, FormField } from "../components/layouts/FormScreenLayout";
import { SelectField } from "../components/ui/SelectField";
import { DatePickerField } from "../components/ui/DatePickerField";
import { LoadingSpinner } from "../components/ui";
import { useTheme } from "../contexts/ThemeContext";
import { createCampania, updateCampania, deleteCampania, fetchCampania } from "../services/campo";
import { ESTADO_CAMPANIA_OPTIONS } from "../constants/options";

const STEPS = ["Información General", "Detalles", "Resumen"];

interface FormData {
  codigo: string; nombre: string; descripcion: string;
  anio_agricola: string; fechaInicio: string; fechaFin: string;
  estado: string; responsable: string; tecnicoCoordinador: string;
  objetivo: string; observaciones: string;
}

const initialForm: FormData = {
  codigo: "", nombre: "", descripcion: "",
  anio_agricola: "", fechaInicio: "", fechaFin: "",
  estado: "PLANIFICADA", responsable: "", tecnicoCoordinador: "",
  objetivo: "", observaciones: "",
};

export default function CampaniaFormScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { colors } = useTheme();
  const editId = route.params?.id;
  const isEdit = !!editId;
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<FormData>(initialForm);

  const update = (key: keyof FormData, value: string) => setForm((prev) => ({ ...prev, [key]: value }));

  useEffect(() => {
    if (!isEdit) return;
    const controller = new AbortController();
    (async () => {
      try {
        const c = await fetchCampania(editId);
        if (!controller.signal.aborted) {
          setForm({
            codigo: c.codigo, nombre: c.nombre, descripcion: c.descripcion || "",
            anio_agricola: c.anio_agricola, fechaInicio: c.fechaInicio, fechaFin: c.fechaFin || "",
            estado: c.estado, responsable: c.responsable, tecnicoCoordinador: c.tecnicoCoordinador,
            objetivo: c.objetivo, observaciones: c.observaciones || "",
          });
        }
      } catch { Alert.alert("Error", "No se pudo cargar"); }
      finally { if (!controller.signal.aborted) setLoading(false); }
    })();
    return () => controller.abort();
  }, [editId]);

  const handleSave = async () => {
    if (!form.nombre?.trim()) { Alert.alert("Error", "El nombre es obligatorio"); return; }
    if (!form.anio_agricola?.trim()) { Alert.alert("Error", "El año agrícola es obligatorio"); return; }
    if (!/^\d{4}-\d{4}$/.test(form.anio_agricola)) { Alert.alert("Error", "Formato: YYYY-YYYY (ej: 2024-2025)"); return; }
    if (!form.fechaInicio) { Alert.alert("Error", "La fecha de inicio es obligatoria"); return; }
    if (!form.responsable?.trim()) { Alert.alert("Error", "El responsable es obligatorio"); return; }
    if (!form.tecnicoCoordinador?.trim()) { Alert.alert("Error", "El técnico coordinador es obligatorio"); return; }
    setSaving(true);
    try {
      if (isEdit) await updateCampania(editId, form);
      else await createCampania(form);
      Alert.alert("Éxito", isEdit ? "Campaña actualizada" : "Campaña creada", [{ text: "OK", onPress: () => navigation.navigate("Campanias", { refresh: true }) }]);
    } catch (err: any) { Alert.alert("Error", err?.response?.data?.message || "Error al guardar"); }
    finally { setSaving(false); }
  };

  const handleDelete = () => {
    Alert.alert("Eliminar Campaña", `¿Eliminar ${form.nombre}?`, [
      { text: "Cancelar", style: "cancel" },
      { text: "Eliminar", style: "destructive", onPress: async () => {
        try { await deleteCampania(editId); navigation.navigate("Campanias", { refresh: true }); }
        catch { Alert.alert("Error", "No se pudo eliminar"); }
      }},
    ]);
  };

  if (loading) return <LoadingSpinner text="Cargando..." />;

  const renderStep0 = () => (
    <View>
      <FormSection title="Información General" subtitle="Datos básicos de la campaña" icon={CalendarDays} iconBg={colors.primaryLight} iconColor={colors.primary}>
        <FormField label="Nombre *">
          <TextInput style={[s.input, { borderColor: colors.disabled, color: colors.text, backgroundColor: colors.surface }]} value={form.nombre} onChangeText={(v) => update("nombre", v)} placeholder="Nombre de la campaña" placeholderTextColor={colors.placeholder} />
        </FormField>
        <FormField row>
          <View style={{ flex: 1 }}>
            <Text style={[s.label, { color: colors.text }]}>Código</Text>
            <TextInput style={[s.input, { borderColor: colors.disabled, color: colors.text, backgroundColor: colors.surface }]} value={form.codigo} onChangeText={(v) => update("codigo", v)} placeholder="Auto-generado" placeholderTextColor={colors.placeholder} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[s.label, { color: colors.text }]}>Año Agrícola *</Text>
            <TextInput style={[s.input, { borderColor: colors.disabled, color: colors.text, backgroundColor: colors.surface }]} value={form.anio_agricola} onChangeText={(v) => update("anio_agricola", v)} placeholder="2024-2025" placeholderTextColor={colors.placeholder} />
          </View>
        </FormField>
        <SelectField label="Estado" value={form.estado} options={ESTADO_CAMPANIA_OPTIONS} onSelect={(v) => update("estado", v)} />
      </FormSection>
    </View>
  );

  const renderStep1 = () => (
    <View>
      <FormSection title="Fechas" subtitle="Período de la campaña" icon={CalendarDays} iconBg={colors.successLight} iconColor={colors.success}>
        <View style={{ flexDirection: "row", gap: 12 }}>
          <View style={{ flex: 1 }}>
            <DatePickerField label="Fecha Inicio *" value={form.fechaInicio} onChange={(v) => update("fechaInicio", v)} />
          </View>
          <View style={{ flex: 1 }}>
            <DatePickerField label="Fecha Fin" value={form.fechaFin} onChange={(v) => update("fechaFin", v)} />
          </View>
        </View>
      </FormSection>

      <FormSection title="Responsables" subtitle="Personal a cargo de la campaña" icon={Users} iconBg={colors.warningLight} iconColor={colors.warning}>
        <FormField row>
          <View style={{ flex: 1 }}>
            <Text style={[s.label, { color: colors.text }]}>Responsable *</Text>
            <TextInput style={[s.input, { borderColor: colors.disabled, color: colors.text, backgroundColor: colors.surface }]} value={form.responsable} onChangeText={(v) => update("responsable", v)} placeholder="Nombre del responsable" placeholderTextColor={colors.placeholder} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[s.label, { color: colors.text }]}>Técnico Coordinador *</Text>
            <TextInput style={[s.input, { borderColor: colors.disabled, color: colors.text, backgroundColor: colors.surface }]} value={form.tecnicoCoordinador} onChangeText={(v) => update("tecnicoCoordinador", v)} placeholder="Nombre del técnico" placeholderTextColor={colors.placeholder} />
          </View>
        </FormField>
      </FormSection>

      <FormSection title="Descripción y Objetivo" subtitle="Detalles de la campaña" icon={FileText} iconBg={colors.infoLight} iconColor={colors.info}>
        <FormField label="Descripción">
          <TextInput style={[s.input, { height: 80, borderColor: colors.disabled, color: colors.text, backgroundColor: colors.surface }]} value={form.descripcion} onChangeText={(v) => update("descripcion", v)} multiline textAlignVertical="top" placeholder="Describe la campaña..." placeholderTextColor={colors.placeholder} />
        </FormField>
        <FormField label="Objetivo">
          <TextInput style={[s.input, { height: 80, borderColor: colors.disabled, color: colors.text, backgroundColor: colors.surface }]} value={form.objetivo} onChangeText={(v) => update("objetivo", v)} multiline textAlignVertical="top" placeholder="¿Qué se espera lograr?" placeholderTextColor={colors.placeholder} />
        </FormField>
        <FormField label="Observaciones">
          <TextInput style={[s.input, { height: 80, borderColor: colors.disabled, color: colors.text, backgroundColor: colors.surface }]} value={form.observaciones} onChangeText={(v) => update("observaciones", v)} multiline textAlignVertical="top" placeholder="Notas adicionales..." placeholderTextColor={colors.placeholder} />
        </FormField>
      </FormSection>
    </View>
  );

  const renderStep2 = () => (
    <View>
      <FormSection title="Resumen" subtitle="Verifica la información antes de guardar" icon={CalendarDays} iconBg={colors.primaryLight} iconColor={colors.primary}>
        {[
          { label: "Nombre", value: form.nombre || "—" },
          { label: "Código", value: form.codigo || "Auto" },
          { label: "Año Agrícola", value: form.anio_agricola || "—" },
          { label: "Estado", value: form.estado?.replace("_", " ") },
          { label: "Inicio", value: form.fechaInicio || "—" },
          { label: "Fin", value: form.fechaFin || "—" },
          { label: "Responsable", value: form.responsable || "—" },
          { label: "Técnico", value: form.tecnicoCoordinador || "—" },
        ].map((item, i) => (
          <View key={i} style={[s.row, { borderBottomColor: colors.divider }]}>
            <Text style={[s.rowLabel, { color: colors.textSecondary }]}>{item.label}</Text>
            <Text style={[s.rowValue, { color: colors.text }]}>{item.value}</Text>
          </View>
        ))}
        {form.objetivo ? (
          <View style={s.row}>
            <Text style={[s.rowLabel, { color: colors.textSecondary }]}>Objetivo</Text>
            <Text style={[s.rowValue, { color: colors.text }]} numberOfLines={2}>{form.objetivo}</Text>
          </View>
        ) : null}
      </FormSection>
    </View>
  );

  const steps = [renderStep0, renderStep1, renderStep2];

  return (
    <FormScreenLayout
      title="Campaña"
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
  input: { borderWidth: 1, borderRadius: 10, paddingHorizontal: 14, paddingVertical: 11, fontSize: 14 },
  label: { fontSize: 13, fontWeight: "500", marginBottom: 6 },
  row: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 10, borderBottomWidth: 1 },
  rowLabel: { fontSize: 14 },
  rowValue: { fontSize: 14, fontWeight: "500", flex: 1, textAlign: "right", marginLeft: 8 },
});
