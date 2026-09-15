import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, Modal } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Plus, Package, Users, Truck, Trash2 } from "lucide-react-native";
import { useQueryClient } from "@tanstack/react-query";
import {
  createActividad, updateActividad, tiposActividad,
  type Actividad, type ActividadInsumo, type ActividadManoObra, type ActividadMaquinaria,
} from "../services/actividades";
import { SelectField, DatePickerField } from "../components/ui";
import { FormScreenLayout, FormSection, FormField } from "../components/layouts/FormScreenLayout";
import { useTheme } from "../contexts/ThemeContext";
import api from "../services/api";

const STEPS = ["General", "Insumos", "Mano de Obra", "Maquinaria", "Resumen"];
interface SelectOption { value: string; label: string; }

const emptyInsumo: Omit<ActividadInsumo, "id"> = { producto: "", categoria: "", fabricante: "", cantidad: null, unidad: "", lote: "", costoUnitario: null, costoTotal: null, observaciones: "" };
const emptyManoObra: Omit<ActividadManoObra, "id"> = { trabajador: "", funcion: "", horas: null, jornales: null, costoJornal: null, costoTotal: null, observaciones: "" };
const emptyMaquinaria: Omit<ActividadMaquinaria, "id"> = { equipo: "", operador: "", horasUso: null, costoHora: null, costoTotal: null, combustible: null, observaciones: "" };

export default function ActividadFormScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const editId = Number(route.params?.id);
  const isEdit = Boolean(editId);
  const queryClient = useQueryClient();
  const { colors } = useTheme();

  const [step, setStep] = useState(0);
  const [saving, setSaving] = useState(false);
  const [loadingData, setLoadingData] = useState(isEdit);

  const [parcelas, setParcelas] = useState<SelectOption[]>([]);
  const [cultivos, setCultivos] = useState<SelectOption[]>([]);
  const [allCultivos, setAllCultivos] = useState<any[]>([]);

  const [fecha, setFecha] = useState(new Date().toISOString().split("T")[0]);
  const [parcelaId, setParcelaId] = useState("");
  const [cultivoId, setCultivoId] = useState("");
  const [tipoActividad, setTipoActividad] = useState("");
  const [responsableTecnico, setResponsableTecnico] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [observacionesTecnicas, setObservacionesTecnicas] = useState("");

  const [insumos, setInsumos] = useState<ActividadInsumo[]>([]);
  const [manoObra, setManoObra] = useState<ActividadManoObra[]>([]);
  const [maquinaria, setMaquinaria] = useState<ActividadMaquinaria[]>([]);

  const [modalType, setModalType] = useState<"insumo" | "manoObra" | "maquinaria" | null>(null);
  const [editingIndex, setEditingIndex] = useState(-1);
  const [draftInsumo, setDraftInsumo] = useState(emptyInsumo);
  const [draftManoObra, setDraftManoObra] = useState(emptyManoObra);
  const [draftMaquinaria, setDraftMaquinaria] = useState(emptyMaquinaria);

  useEffect(() => {
    Promise.all([
      api.get("/parcelas", { params: { limit: 500 } }),
      api.get("/cultivos", { params: { limit: 500 } }),
    ]).then(([pRes, cRes]) => {
      setParcelas((pRes.data.data ?? []).map((p: any) => ({ value: String(p.id), label: `${p.codigo} - ${p.nombre}` })));
      setAllCultivos(cRes.data.data ?? []);
    }).catch(() => {});
  }, []);

  useEffect(() => {
    if (parcelaId && allCultivos.length > 0) {
      setCultivos(allCultivos.filter((c: any) => String(c.parcela_id) === parcelaId).map((c: any) => ({ value: String(c.id), label: `${c.codigo} - ${c.cultivo}` })));
    } else { setCultivos([]); }
  }, [parcelaId, allCultivos]);

  useEffect(() => {
    if (isEdit && editId) {
      api.get(`/actividades/${editId}`).then((res) => {
        const a = res.data.data;
        setFecha(a.fecha?.split("T")[0] ?? "");
        setCultivoId(String(a.cultivo_id ?? ""));
        setTipoActividad(a.tipo_actividad ?? "");
        setResponsableTecnico(a.responsable_tecnico ?? "");
        setDescripcion(a.descripcion ?? "");
        setObservacionesTecnicas(a.observaciones_tecnicas ?? "");
        setInsumos(a.insumos ?? []);
        setManoObra(a.mano_obra ?? []);
        setMaquinaria(a.maquinaria ?? []);
        if (a.cultivo?.parcela?.id) setParcelaId(String(a.cultivo.parcela.id));
      }).catch(() => Alert.alert("Error", "No se pudo cargar"))
        .finally(() => setLoadingData(false));
    }
  }, [editId, isEdit]);

  const handleSave = async () => {
    if (!fecha || !cultivoId || !responsableTecnico.trim()) {
      Alert.alert("Campos obligatorios", "Fecha, cultivo y responsable son obligatorios.");
      return;
    }
    setSaving(true);
    try {
      const data: Partial<Actividad> = {
        fecha, cultivoId: Number(cultivoId), tipoActividad: tipoActividad || "OTRA",
        responsableTecnico, descripcion, observacionesTecnicas,
        insumos, manoObra, maquinaria,
      };
      if (isEdit && editId) await updateActividad(editId, data);
      else await createActividad(data);
      queryClient.invalidateQueries({ queryKey: ["actividades"] });
      navigation.goBack();
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.response?.data?.error || err?.message || "Error al guardar.";
      Alert.alert("Error", typeof msg === "string" ? msg : JSON.stringify(msg));
    } finally { setSaving(false); }
  };

  const handleDelete = async () => {
    if (!isEdit || !editId) return;
    try { await api.delete(`/actividades/${editId}`); queryClient.invalidateQueries({ queryKey: ["actividades"] }); navigation.goBack(); }
    catch { Alert.alert("Error", "No se pudo eliminar"); }
  };

  const openCreateModal = (type: "insumo" | "manoObra" | "maquinaria") => {
    setEditingIndex(-1);
    if (type === "insumo") setDraftInsumo({ ...emptyInsumo });
    if (type === "manoObra") setDraftManoObra({ ...emptyManoObra });
    if (type === "maquinaria") setDraftMaquinaria({ ...emptyMaquinaria });
    setModalType(type);
  };

  const openEditModal = (type: "insumo" | "manoObra" | "maquinaria", index: number) => {
    setEditingIndex(index);
    if (type === "insumo") setDraftInsumo({ ...insumos[index] });
    if (type === "manoObra") setDraftManoObra({ ...manoObra[index] });
    if (type === "maquinaria") setDraftMaquinaria({ ...maquinaria[index] });
    setModalType(type);
  };

  const handleSaveItem = () => {
    if (modalType === "insumo") {
      if (!draftInsumo.producto) { Alert.alert("Error", "Producto obligatorio"); return; }
      const item: ActividadInsumo = { ...draftInsumo, id: editingIndex >= 0 ? insumos[editingIndex].id : `i-${Date.now()}` };
      const copy = [...insumos]; if (editingIndex >= 0) copy[editingIndex] = item; else copy.push(item);
      setInsumos(copy);
    } else if (modalType === "manoObra") {
      if (!draftManoObra.trabajador) { Alert.alert("Error", "Trabajador obligatorio"); return; }
      const item: ActividadManoObra = { ...draftManoObra, id: editingIndex >= 0 ? manoObra[editingIndex].id : `m-${Date.now()}` };
      const copy = [...manoObra]; if (editingIndex >= 0) copy[editingIndex] = item; else copy.push(item);
      setManoObra(copy);
    } else if (modalType === "maquinaria") {
      if (!draftMaquinaria.equipo) { Alert.alert("Error", "Equipo obligatorio"); return; }
      const item: ActividadMaquinaria = { ...draftMaquinaria, id: editingIndex >= 0 ? maquinaria[editingIndex].id : `e-${Date.now()}` };
      const copy = [...maquinaria]; if (editingIndex >= 0) copy[editingIndex] = item; else copy.push(item);
      setMaquinaria(copy);
    }
    setModalType(null);
  };

  const handleDeleteItem = (type: string, index: number) => {
    Alert.alert("Eliminar", "¿Estás seguro?", [
      { text: "Cancelar", style: "cancel" },
      { text: "Eliminar", style: "destructive", onPress: () => {
        if (type === "insumo") setInsumos(insumos.filter((_, i) => i !== index));
        if (type === "manoObra") setManoObra(manoObra.filter((_, i) => i !== index));
        if (type === "maquinaria") setMaquinaria(maquinaria.filter((_, i) => i !== index));
      }},
    ]);
  };

  const fc = (v: number | null | undefined) => v != null ? `S/ ${v.toFixed(2)}` : "S/ 0.00";
  const totalCost = insumos.reduce((s, i) => s + (i.costoTotal ?? 0), 0) + manoObra.reduce((s, m) => s + (m.costoTotal ?? 0), 0) + maquinaria.reduce((s, m) => s + (m.costoTotal ?? 0), 0);

  const renderStep0 = () => (
    <FormSection title="Información General">
      <DatePickerField label="Fecha *" value={fecha} onChange={setFecha} />
      <SelectField label="Parcela *" options={parcelas} value={parcelaId} onSelect={(v) => { setParcelaId(v); setCultivoId(""); }} placeholder="Seleccione" />
      <SelectField label="Cultivo *" options={cultivos} value={cultivoId} onSelect={setCultivoId} placeholder={!parcelaId ? "Primero parcela" : "Seleccione"} />
      <SelectField label="Tipo de Actividad" options={tiposActividad.map((t) => ({ value: t.value, label: t.label }))} value={tipoActividad} onSelect={setTipoActividad} placeholder="Seleccione" />
      <FormField label="Responsable Técnico *">
        <TextInput style={st.input} value={responsableTecnico} onChangeText={setResponsableTecnico} placeholder="Nombre" />
      </FormField>
      <FormField label="Descripción">
        <TextInput style={[st.input, st.textarea]} value={descripcion} onChangeText={setDescripcion} placeholder="Detalle..." multiline />
      </FormField>
      <FormField label="Observaciones">
        <TextInput style={[st.input, st.textarea]} value={observacionesTecnicas} onChangeText={setObservacionesTecnicas} placeholder="Observaciones..." multiline />
      </FormField>
    </FormSection>
  );

  const renderStep1 = () => (
    <FormSection title={`Insumos (${insumos.length})`} icon={Package} iconBg={colors.primaryLight} iconColor={colors.primary}>
      <TouchableOpacity onPress={() => openCreateModal("insumo")} style={[st.addBtn, { backgroundColor: colors.primary }]}>
        <Plus size={16} color="#FFF" />
      </TouchableOpacity>
      {insumos.length === 0 ? <Text style={[st.emptyText, { color: colors.textMuted }]}>Sin insumos registrados</Text> : insumos.map((item, idx) => (
        <View key={idx} style={[st.itemCard, { backgroundColor: colors.surfaceSecondary, borderColor: colors.border }]}>
          <View style={{ flex: 1 }}><Text style={[st.itemTitle, { color: colors.text }]}>{item.producto}</Text><Text style={[st.itemSub, { color: colors.textMuted }]}>{item.cantidad} {item.unidad} · {fc(item.costoTotal)}</Text></View>
          <TouchableOpacity onPress={() => openEditModal("insumo", idx)}><Text style={[st.editText, { color: colors.primary }]}>Editar</Text></TouchableOpacity>
          <TouchableOpacity onPress={() => handleDeleteItem("insumo", idx)}><Trash2 size={16} color={colors.danger} /></TouchableOpacity>
        </View>
      ))}
    </FormSection>
  );

  const renderStep2 = () => (
    <FormSection title={`Mano de Obra (${manoObra.length})`} icon={Users} iconBg={colors.successLight} iconColor={colors.success}>
      <TouchableOpacity onPress={() => openCreateModal("manoObra")} style={[st.addBtn, { backgroundColor: colors.success }]}>
        <Plus size={16} color="#FFF" />
      </TouchableOpacity>
      {manoObra.length === 0 ? <Text style={[st.emptyText, { color: colors.textMuted }]}>Sin mano de obra registrada</Text> : manoObra.map((item, idx) => (
        <View key={idx} style={[st.itemCard, { backgroundColor: colors.surfaceSecondary, borderColor: colors.border }]}>
          <View style={{ flex: 1 }}><Text style={[st.itemTitle, { color: colors.text }]}>{item.trabajador}</Text><Text style={[st.itemSub, { color: colors.textMuted }]}>{item.funcion} · {item.jornales} jornales · {fc(item.costoTotal)}</Text></View>
          <TouchableOpacity onPress={() => openEditModal("manoObra", idx)}><Text style={[st.editText, { color: colors.primary }]}>Editar</Text></TouchableOpacity>
          <TouchableOpacity onPress={() => handleDeleteItem("manoObra", idx)}><Trash2 size={16} color={colors.danger} /></TouchableOpacity>
        </View>
      ))}
    </FormSection>
  );

  const renderStep3 = () => (
    <FormSection title={`Maquinaria (${maquinaria.length})`} icon={Truck} iconBg={colors.warningLight} iconColor={colors.warning}>
      <TouchableOpacity onPress={() => openCreateModal("maquinaria")} style={[st.addBtn, { backgroundColor: colors.warning }]}>
        <Plus size={16} color="#FFF" />
      </TouchableOpacity>
      {maquinaria.length === 0 ? <Text style={[st.emptyText, { color: colors.textMuted }]}>Sin maquinaria registrada</Text> : maquinaria.map((item, idx) => (
        <View key={idx} style={[st.itemCard, { backgroundColor: colors.surfaceSecondary, borderColor: colors.border }]}>
          <View style={{ flex: 1 }}><Text style={[st.itemTitle, { color: colors.text }]}>{item.equipo}</Text><Text style={[st.itemSub, { color: colors.textMuted }]}>{item.horasUso}h · {fc(item.costoTotal)}</Text></View>
          <TouchableOpacity onPress={() => openEditModal("maquinaria", idx)}><Text style={[st.editText, { color: colors.primary }]}>Editar</Text></TouchableOpacity>
          <TouchableOpacity onPress={() => handleDeleteItem("maquinaria", idx)}><Trash2 size={16} color={colors.danger} /></TouchableOpacity>
        </View>
      ))}
    </FormSection>
  );

  const renderStep4 = () => (
    <FormSection title="Resumen de Costos">
      <View style={st.costRow}><Text style={[st.costLabel, { color: colors.textMuted }]}>Insumos</Text><Text style={[st.costVal, { color: colors.text }]}>{fc(insumos.reduce((s, i) => s + (i.costoTotal ?? 0), 0))}</Text></View>
      <View style={st.costRow}><Text style={[st.costLabel, { color: colors.textMuted }]}>Mano de Obra</Text><Text style={[st.costVal, { color: colors.text }]}>{fc(manoObra.reduce((s, m) => s + (m.costoTotal ?? 0), 0))}</Text></View>
      <View style={st.costRow}><Text style={[st.costLabel, { color: colors.textMuted }]}>Maquinaria</Text><Text style={[st.costVal, { color: colors.text }]}>{fc(maquinaria.reduce((s, m) => s + (m.costoTotal ?? 0), 0))}</Text></View>
      <View style={[st.costRow, { borderTopWidth: 1, borderTopColor: colors.border, marginTop: 8, paddingTop: 10 }]}>
        <Text style={[st.costTotalLabel, { color: colors.text }]}>Total</Text>
        <Text style={[st.costTotalVal, { color: colors.success }]}>{fc(totalCost)}</Text>
      </View>
    </FormSection>
  );

  const steps = [renderStep0, renderStep1, renderStep2, renderStep3, renderStep4];

  return (
    <FormScreenLayout
      title={`${isEdit ? "Editar" : "Nueva"} Actividad`}
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

const st = StyleSheet.create({
  input: { backgroundColor: "#FFF", borderWidth: 1, borderColor: "#D1D5DB", borderRadius: 10, paddingHorizontal: 14, paddingVertical: 11, fontSize: 14, color: "#111827" },
  textarea: { height: 80, textAlignVertical: "top" },
  addBtn: { width: 32, height: 32, borderRadius: 16, alignItems: "center", justifyContent: "center", alignSelf: "flex-end", marginBottom: 8 },
  emptyText: { fontSize: 14, textAlign: "center", paddingVertical: 20 },
  itemCard: { flexDirection: "row", alignItems: "center", borderRadius: 12, padding: 14, marginBottom: 8, gap: 8, borderWidth: 1 },
  itemTitle: { fontSize: 14, fontWeight: "500" }, itemSub: { fontSize: 12, marginTop: 3 },
  editText: { fontSize: 12, fontWeight: "600", paddingHorizontal: 8 },
  costRow: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 8 },
  costLabel: { fontSize: 14 }, costVal: { fontSize: 14, fontWeight: "500" },
  costTotalLabel: { fontSize: 16, fontWeight: "600" }, costTotalVal: { fontSize: 16, fontWeight: "700" },
});
