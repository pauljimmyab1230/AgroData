import React, { useState, useEffect, useCallback } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Plus, Trash } from "lucide-react-native";
import { FormScreenLayout, FormSection, FormField } from "../components/layouts/FormScreenLayout";
import { SelectField } from "../components/ui/SelectField";
import { DatePickerField } from "../components/ui/DatePickerField";
import { LoadingSpinner } from "../components/ui";
import { useTheme } from "../contexts/ThemeContext";
import {
  createInspeccion, updateInspeccion, deleteInspeccion, fetchInspeccion,
  crearChecklistPorDefecto,
  type CriterioChecklist, type NoConformidad, type Inspeccion,
  estadosInspeccionOptions, resultadosInspeccionOptions, riesgosOptions, cumplimientoOptions,
  severidadesOptions, estadosNoConformidadOptions, tiposNoConformidadOptions, categoriasNoConformidadOptions,
} from "../services/inspecciones";
import { fetchCultivosOpciones } from "../services/catalogos";

const STEPS = ["General", "Checklist", "No Conformidades"];

interface FormData {
  cultivoId: string;
  fecha: string;
  inspector: string;
  estado: string;
  resultado: string;
  riesgoGeneral: string;
  observaciones: string;
  recomendaciones: string;
  resumenEjecutivo: string;
  nivelCumplimiento: string;
  fechaProximaInspeccion: string;
  latitud: string;
  longitud: string;
}

const initialForm: FormData = {
  cultivoId: "", fecha: "", inspector: "", estado: "PENDIENTE", resultado: "",
  riesgoGeneral: "BAJO", observaciones: "", recomendaciones: "", resumenEjecutivo: "",
  nivelCumplimiento: "", fechaProximaInspeccion: "", latitud: "", longitud: "",
};

export default function InspeccionFormScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { colors } = useTheme();
  const editId = route.params?.id;
  const isEdit = !!editId;
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<FormData>(initialForm);
  const [cultivos, setCultivos] = useState<{ id: number; label: string }[]>([]);
  const [checklist, setChecklist] = useState<CriterioChecklist[]>([]);
  const [noConformidades, setNoConformidades] = useState<NoConformidad[]>([]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const prods = await fetchCultivosOpciones();
        if (!cancelled) setCultivos(prods);
      } catch {}
    })();
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    if (!isEdit) {
      setChecklist(crearChecklistPorDefecto());
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        const insp = await fetchInspeccion(editId);
        if (cancelled) return;
        setForm({
          cultivoId: String(insp.cultivoId || ""),
          fecha: insp.fecha || "",
          inspector: insp.inspector || "",
          estado: insp.estado || "PENDIENTE",
          resultado: insp.resultado || "",
          riesgoGeneral: insp.riesgoGeneral || "BAJO",
          observaciones: insp.observaciones || "",
          recomendaciones: insp.recomendaciones || "",
          resumenEjecutivo: insp.resumenEjecutivo || "",
          nivelCumplimiento: insp.nivelCumplimiento || "",
          fechaProximaInspeccion: insp.fechaProximaInspeccion || "",
          latitud: insp.latitud || "",
          longitud: insp.longitud || "",
        });
        setChecklist(insp.checklist?.length ? insp.checklist : crearChecklistPorDefecto());
        setNoConformidades(insp.noConformidades || []);
      } catch {
        if (!cancelled) Alert.alert("Error", "No se pudo cargar la inspección");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [editId]);

  const update = useCallback(<K extends keyof FormData>(key: K, value: FormData[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  }, []);

  const updateChecklistItem = (index: number, field: keyof CriterioChecklist, value: any) => {
    setChecklist((prev) => prev.map((item, i) => i === index ? { ...item, [field]: value } : item));
  };

  const addNoConformidad = () => {
    setNoConformidades((prev) => [...prev, {
      codigo: "", tipo: "", categoria: "", descripcion: "", severidad: "LEVE",
      responsable: "", fechaCompromiso: "", estado: "PENDIENTE", accionCorrectiva: "", acciones: [],
    }]);
  };

  const updateNoConformidad = (index: number, field: keyof NoConformidad, value: any) => {
    setNoConformidades((prev) => prev.map((item, i) => i === index ? { ...item, [field]: value } : item));
  };

  const removeNoConformidad = (index: number) => {
    setNoConformidades((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSave = useCallback(async () => {
    if (!form.cultivoId) { Alert.alert("Error", "El cultivo es obligatorio"); return; }
    if (!form.fecha) { Alert.alert("Error", "La fecha es obligatoria"); return; }
    if (!form.inspector?.trim()) { Alert.alert("Error", "El inspector es obligatorio"); return; }

    setSaving(true);
    try {
      const data = {
        ...form,
        cultivoId: Number(form.cultivoId),
        estado: form.estado as import("../services/inspecciones").EstadoInspeccion,
        checklist,
        noConformidades,
      } as Partial<Inspeccion>;
      if (isEdit) { await updateInspeccion(editId, data); }
      else { await createInspeccion(data); }
      Alert.alert("Éxito", isEdit ? "Inspección actualizada" : "Inspección creada", [
        { text: "OK", onPress: () => navigation.navigate("Inspecciones", { refresh: true }) },
      ]);
    } catch (err: any) {
      const errors = err?.response?.data?.errors;
      let message = err?.response?.data?.message || "Error al guardar la inspección";
      if (errors && Array.isArray(errors) && errors.length > 0) {
        message = errors.map((e: any) => e.message).join('\n');
      }
      Alert.alert("Error", message);
    } finally {
      setSaving(false);
    }
  }, [form, checklist, noConformidades, isEdit, editId, navigation]);

  const handleDelete = useCallback(() => {
    Alert.alert("Eliminar Inspección", `¿Eliminar inspección ${form.inspector}?`, [
      { text: "Cancelar", style: "cancel" },
      { text: "Eliminar", style: "destructive", onPress: async () => {
        try { await deleteInspeccion(editId); navigation.navigate("Inspecciones", { refresh: true }); }
        catch { Alert.alert("Error", "No se pudo eliminar"); }
      }},
    ]);
  }, [form.inspector, editId, navigation]);

  if (loading) return <LoadingSpinner text="Cargando..." />;

  const inputStyle = [s.input, { borderColor: colors.disabled, color: colors.text, backgroundColor: colors.surface }];

  const renderStep0 = () => (
    <View>
      <FormSection title="Información General">
        <>
        <FormField label="Cultivo *">
          <SelectField label="" value={cultivos.find(c => String(c.id) === form.cultivoId)?.label || ""} options={cultivos.map(c => c.label)} onSelect={(v) => { const c = cultivos.find(x => x.label === v); if (c) update("cultivoId", String(c.id)); }} />
        </FormField>
        <DatePickerField label="Fecha *" value={form.fecha} onChange={(v) => update("fecha", v)} />
        <FormField label="Inspector *">
          <TextInput style={inputStyle} value={form.inspector} onChangeText={(v) => update("inspector", v)} placeholderTextColor={colors.placeholder} />
        </FormField>
        <SelectField label="Estado" value={form.estado} options={estadosInspeccionOptions} onSelect={(v) => update("estado", v)} />
        <SelectField label="Resultado" value={form.resultado} options={resultadosInspeccionOptions} onSelect={(v) => update("resultado", v)} />
        <SelectField label="Riesgo General" value={form.riesgoGeneral} options={riesgosOptions} onSelect={(v) => update("riesgoGeneral", v)} />
        <FormField label="Nivel Cumplimiento (%)">
          <TextInput style={inputStyle} value={form.nivelCumplimiento} onChangeText={(v) => update("nivelCumplimiento", v)} keyboardType="numeric" placeholderTextColor={colors.placeholder} />
        </FormField>
        <DatePickerField label="Próxima Inspección" value={form.fechaProximaInspeccion} onChange={(v) => update("fechaProximaInspeccion", v)} />
        </>
      </FormSection>

      <FormSection title="Observaciones">
        <>
        <FormField label="Resumen Ejecutivo">
          <TextInput style={[s.input, { height: 80, borderColor: colors.disabled, color: colors.text, backgroundColor: colors.surface }]} value={form.resumenEjecutivo} onChangeText={(v) => update("resumenEjecutivo", v)} multiline textAlignVertical="top" placeholderTextColor={colors.placeholder} />
        </FormField>
        <FormField label="Observaciones">
          <TextInput style={[s.input, { height: 80, borderColor: colors.disabled, color: colors.text, backgroundColor: colors.surface }]} value={form.observaciones} onChangeText={(v) => update("observaciones", v)} multiline textAlignVertical="top" placeholderTextColor={colors.placeholder} />
        </FormField>
        <FormField label="Recomendaciones">
          <TextInput style={[s.input, { height: 80, borderColor: colors.disabled, color: colors.text, backgroundColor: colors.surface }]} value={form.recomendaciones} onChangeText={(v) => update("recomendaciones", v)} multiline textAlignVertical="top" placeholderTextColor={colors.placeholder} />
        </FormField>
        </>
      </FormSection>
    </View>
  );

  const renderStep1 = () => (
    <View>
      <FormSection title={`Checklist (${checklist.filter(c => c.cumplimiento === "CUMPLE").length}/${checklist.length} cumplidos)`}>
        <>
        {checklist.map((item, index) => (
          <View key={index} style={[s.checklistItem, { borderBottomColor: colors.divider }]}>
            <Text style={[s.checklistCriterio, { color: colors.text }]}>{index + 1}. {item.criterio}</Text>
            <View style={s.checklistRow}>
              <SelectField label="" value={item.cumplimiento || ""} options={cumplimientoOptions} onSelect={(v) => updateChecklistItem(index, "cumplimiento", v)} />
              <SelectField label="" value={item.riesgo} options={riesgosOptions} onSelect={(v) => updateChecklistItem(index, "riesgo", v)} />
            </View>
            <TextInput style={inputStyle} value={item.observacion} onChangeText={(v) => updateChecklistItem(index, "observacion", v)} placeholder="Observación..." placeholderTextColor={colors.placeholder} />
          </View>
        ))}
        </>
      </FormSection>
    </View>
  );

  const renderStep2 = () => (
    <View>
      <FormSection title={`No Conformidades (${noConformidades.length})`}>
        <>
        <View style={s.sectionHeader}>
          <TouchableOpacity style={[s.addSmallBtn, { backgroundColor: colors.primary }]} onPress={addNoConformidad}>
            <Plus size={16} color={colors.textInverse} /><Text style={[s.addSmallBtnText, { color: colors.textInverse }]}>Agregar</Text>
          </TouchableOpacity>
        </View>
        {noConformidades.length === 0 ? (
          <Text style={[s.emptyText, { color: colors.placeholder }]}>No hay no conformidades registradas.</Text>
        ) : (
          noConformidades.map((nc, index) => (
            <View key={index} style={[s.ncItem, { backgroundColor: colors.background }]}>
              <View style={s.ncHeader}>
                <Text style={[s.ncLabel, { color: colors.text }]}>No Conformidad #{index + 1}</Text>
                <TouchableOpacity onPress={() => removeNoConformidad(index)}>
                  <Trash size={16} color={colors.error} />
                </TouchableOpacity>
              </View>
              <SelectField label="Tipo" value={nc.tipo} options={tiposNoConformidadOptions} onSelect={(v) => updateNoConformidad(index, "tipo", v)} />
              <SelectField label="Categoría" value={nc.categoria} options={categoriasNoConformidadOptions} onSelect={(v) => updateNoConformidad(index, "categoria", v)} />
              <TextInput style={inputStyle} value={nc.descripcion} onChangeText={(v) => updateNoConformidad(index, "descripcion", v)} placeholder="Descripción..." placeholderTextColor={colors.placeholder} />
              <SelectField label="Severidad" value={nc.severidad} options={severidadesOptions} onSelect={(v) => updateNoConformidad(index, "severidad", v)} />
              <TextInput style={inputStyle} value={nc.responsable} onChangeText={(v) => updateNoConformidad(index, "responsable", v)} placeholder="Responsable..." placeholderTextColor={colors.placeholder} />
              <SelectField label="Estado" value={nc.estado} options={estadosNoConformidadOptions} onSelect={(v) => updateNoConformidad(index, "estado", v)} />
              <TextInput style={[s.input, { height: 60, borderColor: colors.disabled, color: colors.text, backgroundColor: colors.surface }]} value={nc.accionCorrectiva} onChangeText={(v) => updateNoConformidad(index, "accionCorrectiva", v)} placeholder="Acción correctiva..." placeholderTextColor={colors.placeholder} multiline textAlignVertical="top" />
            </View>
          ))
        )}
        </>
      </FormSection>
    </View>
  );

  const steps = [renderStep0, renderStep1, renderStep2];

  return (
    <FormScreenLayout
      title="Inspección"
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
  sectionHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12 },
  addSmallBtn: { flexDirection: "row", alignItems: "center", paddingHorizontal: 12, paddingVertical: 6, borderRadius: 6, gap: 4 },
  addSmallBtnText: { fontSize: 12, fontWeight: "600" },
  emptyText: { textAlign: "center", fontSize: 13, paddingVertical: 16 },
  checklistItem: { paddingVertical: 8, borderBottomWidth: 1 },
  checklistCriterio: { fontSize: 13, marginBottom: 8 },
  checklistRow: { flexDirection: "row", gap: 8, marginBottom: 8 },
  ncItem: { borderRadius: 8, padding: 12, marginBottom: 12 },
  ncHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 8 },
  ncLabel: { fontSize: 14, fontWeight: "600" },
});
