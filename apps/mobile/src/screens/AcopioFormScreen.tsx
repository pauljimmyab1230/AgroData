import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, Modal } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Users, Package, Trash2 } from "lucide-react-native";
import { useQueryClient } from "@tanstack/react-query";
import { SelectField, DatePickerField } from "../components/ui";
import { FormScreenLayout, FormSection, FormField } from "../components/layouts/FormScreenLayout";
import { useTheme } from "../contexts/ThemeContext";
import api from "../services/api";

const STEPS = ["General", "Productores", "Resumen"];

interface DetalleAcopio {
  id?: string;
  productorId: string;
  productorNombre: string;
  cultivoId: string;
  cultivoNombre: string;
  parcelaId: string;
  parcelaNombre: string;
  totalSacos: number;
  pesoTotal: number;
  observaciones: string;
  sacos: { id?: string; codigo: string; peso: number; observaciones: string }[];
}

export default function AcopioFormScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const editId = Number(route.params?.id);
  const isEdit = Boolean(editId);
  const queryClient = useQueryClient();
  const { colors } = useTheme();

  const [step, setStep] = useState(0);
  const [saving, setSaving] = useState(false);
  const [loadingData, setLoadingData] = useState(isEdit);

  const [fecha, setFecha] = useState(new Date().toISOString().split("T")[0]);
  const [acopiador, setAcopiador] = useState("");
  const [vehiculo, setVehiculo] = useState("");
  const [rutaAcopio, setRutaAcopio] = useState("");
  const [estado, setEstado] = useState("EN_CAMPO");
  const [observaciones, setObservaciones] = useState("");

  const [detalles, setDetalles] = useState<DetalleAcopio[]>([]);

  const [modalType, setModalType] = useState<"productor" | null>(null);
  const [editingDetalleIndex, setEditingDetalleIndex] = useState(-1);

  const [productores, setProductores] = useState<{ value: string; label: string }[]>([]);
  const [cultivosOptions, setCultivosOptions] = useState<{ value: string; label: string }[]>([]);
  const [parcelasOptions, setParcelasOptions] = useState<{ value: string; label: string }[]>([]);

  const [draftProductorId, setDraftProductorId] = useState("");
  const [draftCultivoId, setDraftCultivoId] = useState("");
  const [draftParcelaId, setDraftParcelaId] = useState("");
  const [draftObsDetalle, setDraftObsDetalle] = useState("");

  const [quickPeso, setQuickPeso] = useState<Record<number, string>>({});

  useEffect(() => {
    Promise.all([
      api.get("/productores", { params: { limit: 500 } }),
      api.get("/cultivos", { params: { limit: 500 } }),
      api.get("/parcelas", { params: { limit: 500 } }),
    ]).then(([pRes, cRes, paRes]) => {
      setProductores((pRes.data.data ?? []).map((p: any) => ({ value: String(p.id), label: `${p.codigo} - ${p.nombres} ${p.apellido_paterno}` })));
      setCultivosOptions((cRes.data.data ?? []).map((c: any) => ({ value: String(c.id), label: `${c.codigo} - ${c.cultivo}` })));
      setParcelasOptions((paRes.data.data ?? []).map((p: any) => ({ value: String(p.id), label: `${p.codigo} - ${p.nombre}` })));
    }).catch(() => {});
  }, []);

  useEffect(() => {
    if (isEdit && editId) {
      api.get(`/acopios/${editId}`).then((res) => {
        const d = res.data.data;
        setFecha(d.fecha?.split("T")[0] ?? "");
        setAcopiador(d.acopiador ?? "");
        setVehiculo(d.vehiculo ?? "");
        setRutaAcopio(d.ruta_acopio ?? "");
        setEstado(d.estado ?? "PENDIENTE");
        setObservaciones(d.observaciones ?? "");
        setDetalles((d.detalles ?? []).map((det: any) => ({
          id: det.id,
          productorId: String(det.productor_id ?? ""),
          productorNombre: det.productor ? `${det.productor.nombres} ${det.productor.apellido_paterno}` : "",
          cultivoId: String(det.cultivo_id ?? ""),
          cultivoNombre: det.cultivo?.cultivo ?? "",
          parcelaId: String(det.parcela_id ?? ""),
          parcelaNombre: det.parcela?.nombre ?? "",
          totalSacos: det.total_sacos ?? 0,
          pesoTotal: Number(det.peso_total ?? 0),
          observaciones: det.observaciones ?? "",
          sacos: (det.sacos ?? []).map((s: any) => ({ id: s.id, codigo: s.codigo, peso: Number(s.peso ?? 0), observaciones: s.observaciones ?? "" })),
        })));
      }).catch(() => Alert.alert("Error", "No se pudo cargar"))
        .finally(() => setLoadingData(false));
    }
  }, [editId, isEdit]);

  const openProductorModal = (index: number = -1) => {
    setEditingDetalleIndex(index);
    if (index >= 0 && detalles[index]) {
      const d = detalles[index];
      setDraftProductorId(d.productorId); setDraftCultivoId(d.cultivoId); setDraftParcelaId(d.parcelaId); setDraftObsDetalle(d.observaciones);
    } else {
      setDraftProductorId(""); setDraftCultivoId(""); setDraftParcelaId(""); setDraftObsDetalle("");
    }
    setModalType("productor");
  };

  const saveDetalle = () => {
    if (!draftProductorId) { Alert.alert("Error", "Seleccione un productor"); return; }
    if (!draftCultivoId) { Alert.alert("Error", "Seleccione un cultivo"); return; }
    const prod = productores.find(p => p.value === draftProductorId);
    const cult = cultivosOptions.find(c => c.value === draftCultivoId);
    const parc = parcelasOptions.find(p => p.value === draftParcelaId);
    const item: DetalleAcopio = {
      id: editingDetalleIndex >= 0 ? detalles[editingDetalleIndex].id : `d-${Date.now()}`,
      productorId: draftProductorId, productorNombre: prod?.label ?? "",
      cultivoId: draftCultivoId, cultivoNombre: cult?.label ?? "",
      parcelaId: draftParcelaId, parcelaNombre: parc?.label ?? "",
      totalSacos: editingDetalleIndex >= 0 ? detalles[editingDetalleIndex].totalSacos : 0,
      pesoTotal: editingDetalleIndex >= 0 ? detalles[editingDetalleIndex].pesoTotal : 0,
      observaciones: draftObsDetalle,
      sacos: editingDetalleIndex >= 0 ? detalles[editingDetalleIndex].sacos : [],
    };
    const copy = [...detalles]; if (editingDetalleIndex >= 0) copy[editingDetalleIndex] = item; else copy.push(item);
    setDetalles(copy); setModalType(null);
  };

  const deleteDetalle = (index: number) => {
    Alert.alert("Eliminar", "¿Eliminar este productor?", [
      { text: "Cancelar", style: "cancel" },
      { text: "Eliminar", style: "destructive", onPress: () => setDetalles(detalles.filter((_, i) => i !== index)) },
    ]);
  };

  const quickAddSaco = (detalleIdx: number) => {
    const pesoStr = quickPeso[detalleIdx] || "";
    if (!pesoStr || Number(pesoStr) <= 0) return;
    const peso = Number(pesoStr);
    const copy = [...detalles];
    const numSaco = copy[detalleIdx].sacos.length + 1;
    const sacos = [...copy[detalleIdx].sacos, { codigo: `SACO-${numSaco}`, peso, observaciones: "" }];
    copy[detalleIdx] = { ...copy[detalleIdx], sacos, totalSacos: sacos.length, pesoTotal: sacos.reduce((s, x) => s + x.peso, 0) };
    setDetalles(copy);
    setQuickPeso({ ...quickPeso, [detalleIdx]: "" });
  };

  const deleteSaco = (detalleIdx: number, sacoIdx: number) => {
    Alert.alert("Eliminar", "¿Eliminar este saco?", [
      { text: "Cancelar", style: "cancel" },
      { text: "Eliminar", style: "destructive", onPress: () => {
        const copy = [...detalles];
        const sacos = copy[detalleIdx].sacos.filter((_, i) => i !== sacoIdx);
        copy[detalleIdx] = { ...copy[detalleIdx], sacos, totalSacos: sacos.length, pesoTotal: sacos.reduce((s, x) => s + x.peso, 0) };
        setDetalles(copy);
      }},
    ]);
  };

  const totalSacos = detalles.reduce((s, d) => s + d.totalSacos, 0);
  const pesoTotal = detalles.reduce((s, d) => s + d.pesoTotal, 0);

  const handleSave = async () => {
    if (!fecha || !acopiador.trim()) { Alert.alert("Campos obligatorios", "Fecha y acopiador son obligatorios."); return; }
    if (detalles.length === 0) { Alert.alert("Error", "Debe agregar al menos un productor."); return; }
    for (const det of detalles) {
      if (!det.cultivoId) { Alert.alert("Error", `El productor ${det.productorNombre} necesita un cultivo.`); return; }
      if (det.sacos.length === 0) { Alert.alert("Error", `El productor ${det.productorNombre} necesita al menos un saco.`); return; }
    }
    setSaving(true);
    try {
      const payload: Record<string, unknown> = {
        fecha: fecha.includes("T") ? fecha : `${fecha}T00:00:00.000Z`,
        acopiador, vehiculo, ruta_acopio: rutaAcopio, estado, observaciones,
        total_sacos: totalSacos, peso_total: pesoTotal,
        detalles: detalles.map(d => ({
          productor_id: Number(d.productorId), cultivo_id: Number(d.cultivoId) || null, parcela_id: Number(d.parcelaId) || null,
          total_sacos: d.totalSacos, peso_total: d.pesoTotal, observaciones: d.observaciones,
          sacos: d.sacos.map(sc => ({ codigo: sc.codigo, peso: sc.peso, observaciones: sc.observaciones })),
        })),
      };
      if (isEdit && editId) await api.put(`/acopios/${editId}`, payload);
      else await api.post("/acopios", payload);
      queryClient.invalidateQueries({ queryKey: ["acopios"] });
      navigation.goBack();
    } catch (err: any) {
      Alert.alert("Error", err?.response?.data?.message || "Error al guardar.");
    } finally { setSaving(false); }
  };

  const handleDelete = async () => {
    if (!isEdit || !editId) return;
    try { await api.delete(`/acopios/${editId}`); queryClient.invalidateQueries({ queryKey: ["acopios"] }); navigation.goBack(); }
    catch { Alert.alert("Error", "No se pudo eliminar"); }
  };

  const renderStep0 = () => (
    <FormSection title="Información del Acopio">
      <DatePickerField label="Fecha *" value={fecha} onChange={setFecha} />
      <FormField label="Acopiador *">
        <TextInput style={st.input} value={acopiador} onChangeText={setAcopiador} placeholder="Nombre del acopiador" />
      </FormField>
      <FormField label="Vehículo">
        <TextInput style={st.input} value={vehiculo} onChangeText={setVehiculo} placeholder="Placa o descripción" />
      </FormField>
      <FormField label="Ruta de Acopio">
        <TextInput style={st.input} value={rutaAcopio} onChangeText={setRutaAcopio} placeholder="Ej. Ruta Norte" />
      </FormField>
      <SelectField label="Estado" value={estado} options={["EN_CAMPO", "EN_TRANSITO", "RECIBIDO"]} onSelect={setEstado} />
      <FormField label="Observaciones">
        <TextInput style={[st.input, st.textarea]} value={observaciones} onChangeText={setObservaciones} placeholder="Notas..." multiline />
      </FormField>
    </FormSection>
  );

  const renderStep1 = () => (
    <FormSection title={`Productores (${detalles.length})`} icon={Users} iconBg={colors.warningLight} iconColor={colors.warning}>
      <TouchableOpacity onPress={() => openProductorModal()} style={[st.addBtn, { backgroundColor: colors.warning }]}>
        <Text style={st.addBtnText}>+</Text>
      </TouchableOpacity>
      {detalles.length === 0 ? <Text style={[st.emptyText, { color: colors.textMuted }]}>Sin productores registrados</Text> : detalles.map((det, idx) => (
        <View key={idx} style={[st.detalleCard, { backgroundColor: colors.surfaceSecondary, borderColor: colors.border }]}>
          <View style={st.detalleHeader}>
            <View style={{ flex: 1 }}><Text style={[st.detalleTitle, { color: colors.text }]}>{det.productorNombre}</Text><Text style={[st.detalleSub, { color: colors.textMuted }]}>{det.cultivoNombre} · {det.parcelaNombre}</Text></View>
            <TouchableOpacity onPress={() => openProductorModal(idx)}><Text style={[st.editText, { color: colors.primary }]}>Editar</Text></TouchableOpacity>
            <TouchableOpacity onPress={() => deleteDetalle(idx)}><Trash2 size={16} color={colors.danger} /></TouchableOpacity>
          </View>
          <View style={[st.sacosHeader, { borderTopColor: colors.border }]}>
            <Text style={[st.sacosTitle, { color: colors.textMuted }]}>Sacos ({det.totalSacos}) - {det.pesoTotal.toFixed(2)} kg</Text>
          </View>
          {det.sacos.map((saco, si) => (
            <View key={si} style={[st.sacoItem, { backgroundColor: colors.surface }]}>
              <Text style={[st.sacoCode, { color: colors.text }]}>{saco.codigo}</Text>
              <Text style={[st.sacoPeso, { color: colors.textMuted }]}>{saco.peso} kg</Text>
              <TouchableOpacity onPress={() => deleteSaco(idx, si)}><Trash2 size={14} color={colors.danger} /></TouchableOpacity>
            </View>
          ))}
          <View style={st.quickAddRow}>
            <TextInput style={[st.quickInput, { borderColor: colors.border }]} value={quickPeso[idx] || ""} onChangeText={(v) => setQuickPeso({ ...quickPeso, [idx]: v })} placeholder="Peso kg" keyboardType="numeric" />
            <TouchableOpacity style={[st.quickAddBtn, { backgroundColor: colors.warning }]} onPress={() => quickAddSaco(idx)}>
              <Text style={st.quickAddBtnText}>Agregar</Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}
      <View style={[st.totalCard, { backgroundColor: colors.warningLight }]}>
        <Text style={[st.totalLabel, { color: colors.warning }]}>TOTAL ACOPIO</Text>
        <Text style={[st.totalValue, { color: colors.warning }]}>{totalSacos} sacos · {pesoTotal.toFixed(2)} kg</Text>
      </View>
    </FormSection>
  );

  const renderStep2 = () => (
    <FormSection title="Resumen del Acopio">
      <Text style={[st.summaryItem, { color: colors.text, borderBottomColor: colors.border }]}>Fecha: {fecha}</Text>
      <Text style={[st.summaryItem, { color: colors.text, borderBottomColor: colors.border }]}>Acopiador: {acopiador}</Text>
      <Text style={[st.summaryItem, { color: colors.text, borderBottomColor: colors.border }]}>Vehículo: {vehiculo || "—"}</Text>
      <Text style={[st.summaryItem, { color: colors.text, borderBottomColor: colors.border }]}>Ruta: {rutaAcopio || "—"}</Text>
      <Text style={[st.summaryItem, { color: colors.text, borderBottomColor: colors.border }]}>Estado: {estado}</Text>
      <Text style={[st.summaryItem, { color: colors.text, borderBottomColor: colors.border }]}>Total Sacos: {totalSacos}</Text>
      <Text style={[st.summaryItem, { color: colors.text, borderBottomColor: colors.border }]}>Peso Total: {pesoTotal.toFixed(2)} kg</Text>
      <Text style={[st.summaryItem, { color: colors.text, borderBottomColor: colors.border }]}>Productores: {detalles.length}</Text>
    </FormSection>
  );

  const steps = [renderStep0, renderStep1, renderStep2];

  return (
    <FormScreenLayout
      title={`${isEdit ? "Editar" : "Nuevo"} Acopio`}
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

      {/* MODAL PRODUCTOR */}
      <Modal visible={modalType === "productor"} animationType="slide" transparent>
        <View style={st.modalOverlay}><View style={[st.modalContent, { backgroundColor: colors.background }]}>
          <Text style={[st.modalTitle, { color: colors.text }]}>{editingDetalleIndex >= 0 ? "Editar" : "Agregar"} Productor</Text>
          <SelectField label="Productor *" options={productores} value={draftProductorId} onSelect={setDraftProductorId} placeholder="Seleccione" />
          <SelectField label="Cultivo" options={cultivosOptions} value={draftCultivoId} onSelect={setDraftCultivoId} placeholder="Seleccione" />
          <SelectField label="Parcela" options={parcelasOptions} value={draftParcelaId} onSelect={setDraftParcelaId} placeholder="Seleccione" />
          <FormField label="Observaciones">
            <TextInput style={st.input} value={draftObsDetalle} onChangeText={setDraftObsDetalle} placeholder="Notas..." />
          </FormField>
          <View style={st.modalActions}>
            <TouchableOpacity onPress={() => setModalType(null)} style={[st.cancelBtn, { backgroundColor: colors.surfaceSecondary }]}>
              <Text style={[st.cancelBtnText, { color: colors.textMuted }]}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={saveDetalle} style={[st.confirmBtn, { backgroundColor: colors.warning }]}>
              <Text style={st.confirmBtnText}>Guardar</Text>
            </TouchableOpacity>
          </View>
        </View></View>
      </Modal>
    </FormScreenLayout>
  );
}

const st = StyleSheet.create({
  input: { backgroundColor: "#FFF", borderWidth: 1, borderColor: "#D1D5DB", borderRadius: 10, paddingHorizontal: 14, paddingVertical: 12, fontSize: 14, color: "#111827" },
  textarea: { height: 80, textAlignVertical: "top" },
  addBtn: { width: 28, height: 28, borderRadius: 14, alignItems: "center", justifyContent: "center", alignSelf: "flex-end", marginBottom: 8 },
  addBtnText: { color: "#FFF", fontSize: 16, fontWeight: "600" },
  emptyText: { fontSize: 14, textAlign: "center", paddingVertical: 16 },
  detalleCard: { borderRadius: 10, padding: 12, marginBottom: 10, borderWidth: 1 },
  detalleHeader: { flexDirection: "row", alignItems: "center", gap: 8 },
  detalleTitle: { fontSize: 14, fontWeight: "600" }, detalleSub: { fontSize: 12, marginTop: 2 },
  editText: { fontSize: 12, fontWeight: "500", paddingHorizontal: 6 },
  sacosHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: 10, paddingTop: 8, borderTopWidth: 1 },
  sacosTitle: { fontSize: 12, fontWeight: "600" },
  sacoItem: { flexDirection: "row", alignItems: "center", gap: 8, paddingVertical: 4, borderRadius: 8, paddingHorizontal: 8 },
  sacoCode: { fontSize: 12, fontWeight: "500", flex: 1 }, sacoPeso: { fontSize: 12 },
  quickAddRow: { flexDirection: "row", gap: 8, marginTop: 8 },
  quickInput: { flex: 1, backgroundColor: "#FFF", borderWidth: 1, borderRadius: 8, paddingHorizontal: 12, paddingVertical: 8, fontSize: 14 },
  quickAddBtn: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 8, justifyContent: "center" },
  quickAddBtnText: { color: "#FFF", fontSize: 14, fontWeight: "600" },
  totalCard: { borderRadius: 10, padding: 12, marginTop: 10, alignItems: "center" },
  totalLabel: { fontSize: 12, fontWeight: "600" }, totalValue: { fontSize: 16, fontWeight: "700", marginTop: 4 },
  summaryItem: { fontSize: 14, paddingVertical: 6, borderBottomWidth: 1 },
  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "flex-end" },
  modalContent: { borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 20, maxHeight: "80%" },
  modalTitle: { fontSize: 18, fontWeight: "600", marginBottom: 12 },
  modalActions: { flexDirection: "row", justifyContent: "flex-end", gap: 12, marginTop: 16 },
  cancelBtn: { paddingHorizontal: 20, paddingVertical: 10, borderRadius: 8 },
  cancelBtnText: { fontSize: 14, fontWeight: "500" },
  confirmBtn: { paddingHorizontal: 20, paddingVertical: 10, borderRadius: 8 },
  confirmBtnText: { fontSize: 14, color: "#FFF", fontWeight: "600" },
});
