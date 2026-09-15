import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Package, Trash2 } from "lucide-react-native";
import { useQueryClient } from "@tanstack/react-query";
import { SelectField, DatePickerField } from "../components/ui";
import { FormScreenLayout, FormSection, FormField } from "../components/layouts/FormScreenLayout";
import { useTheme } from "../contexts/ThemeContext";
import { fetchRecepcion, deleteRecepcion, type Recepcion, type RecepcionSaco } from "../services/recepciones";
import api from "../services/api";

const STEPS = ["General", "Sacos", "Pesaje", "Calidad", "Resumen"];

export default function RecepcionFormScreen() {
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
  const [responsable, setResponsable] = useState("");
  const [planta, setPlanta] = useState("");
  const [loteProductor, setLoteProductor] = useState("");
  const [acopioId, setAcopioId] = useState("");
  const [observaciones, setObservaciones] = useState("");

  const [pesoCampo, setPesoCampo] = useState("");
  const [pesoBruto, setPesoBruto] = useState("");
  const [tara, setTara] = useState("");

  const [humedad, setHumedad] = useState("");
  const [impurezas, setImpurezas] = useState("");
  const [materiaExtrana, setMateriaExtrana] = useState("");
  const [color, setColor] = useState("");
  const [olor, setOlor] = useState("");
  const [presenciaInsectos, setPresenciaInsectos] = useState("");
  const [estadoProducto, setEstadoProducto] = useState("");
  const [categoria, setCategoria] = useState("");
  const [destino, setDestino] = useState("");

  const [sacos, setSacos] = useState<RecepcionSaco[]>([]);
  const [quickPeso, setQuickPeso] = useState("");

  const [acopios, setAcopios] = useState<{ value: string; label: string }[]>([]);

  useEffect(() => {
    api.get("/acopios", { params: { limit: 200 } })
      .then((res) => setAcopios((res.data.data ?? []).map((a: any) => ({ value: String(a.id), label: `${a.codigo} - ${a.acopiador}` }))))
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (isEdit && editId) {
      fetchRecepcion(editId).then((d) => {
        setFecha(d.fecha);
        setResponsable(d.responsable);
        setPlanta(d.planta);
        setLoteProductor(d.loteProductor ?? "");
        setAcopioId(d.acopioId ? String(d.acopioId) : "");
        setObservaciones(d.observaciones ?? "");
        setPesoCampo(d.pesoCampo != null ? String(d.pesoCampo) : "");
        setPesoBruto(d.pesoBruto != null ? String(d.pesoBruto) : "");
        setTara(d.tara != null ? String(d.tara) : "");
        setHumedad(d.humedad != null ? String(d.humedad) : "");
        setImpurezas(d.impurezas != null ? String(d.impurezas) : "");
        setMateriaExtrana(d.materiaExtrana != null ? String(d.materiaExtrana) : "");
        setColor(d.color ?? "");
        setOlor(d.olor ?? "");
        setPresenciaInsectos(d.presenciaInsectos ?? "");
        setEstadoProducto(d.estadoProducto ?? "");
        setCategoria(d.categoria ?? "");
        setDestino(d.destino ?? "");
        setSacos(d.sacosDetalle);
      }).catch(() => Alert.alert("Error", "No se pudo cargar"))
        .finally(() => setLoadingData(false));
    }
  }, [editId, isEdit]);

  const pesoNetoCalc = (Number(pesoBruto) || 0) - (Number(tara) || 0);
  const diferenciaCalc = (Number(pesoCampo) || 0) - pesoNetoCalc;
  const mermaCalc = Number(pesoCampo) > 0 ? (diferenciaCalc / Number(pesoCampo)) * 100 : 0;

  const quickAddSaco = () => {
    if (!quickPeso || Number(quickPeso) <= 0) return;
    const peso = Number(quickPeso);
    const numSaco = sacos.length + 1;
    setSacos([...sacos, { codigo: `SACO-${numSaco}`, peso, observaciones: "" }]);
    setQuickPeso("");
  };

  const deleteSaco = (index: number) => setSacos(sacos.filter((_, i) => i !== index));

  const handleSave = async () => {
    if (!fecha || !responsable.trim()) { Alert.alert("Campos obligatorios", "Fecha y responsable son obligatorios."); return; }
    if (!planta.trim()) { Alert.alert("Error", "La planta es obligatoria."); return; }
    if (sacos.length === 0) { Alert.alert("Error", "Debe agregar al menos un saco."); return; }
    setSaving(true);
    try {
      const payload: Record<string, unknown> = {
        fecha: fecha.includes("T") ? fecha : `${fecha}T00:00:00.000Z`,
        responsable, planta,
        lote_productor: loteProductor || null,
        acopio_id: acopioId ? Number(acopioId) : null,
        peso_campo: pesoCampo ? Number(pesoCampo) : null,
        peso_bruto: pesoBruto ? Number(pesoBruto) : null,
        tara: tara ? Number(tara) : null,
        peso_neto: pesoNetoCalc,
        diferencia: diferenciaCalc,
        merma: mermaCalc,
        humedad: humedad ? Number(humedad) : null,
        impurezas: impurezas ? Number(impurezas) : null,
        materia_extrana: materiaExtrana ? Number(materiaExtrana) : null,
        color: color || null, olor: olor || null,
        presencia_insectos: presenciaInsectos || null,
        estado_producto: estadoProducto || null,
        categoria: categoria || null, destino: destino || null,
        observaciones: observaciones || null,
        sacos: sacos.length,
        sacos_detalle: sacos.map(s => ({ codigo: s.codigo, peso: s.peso, observaciones: s.observaciones || null })),
      };
      if (isEdit && editId) await api.put(`/recepcion/${editId}`, payload);
      else await api.post("/recepcion", payload);
      queryClient.invalidateQueries({ queryKey: ["recepciones"] });
      navigation.goBack();
    } catch (err: any) {
      Alert.alert("Error", err?.response?.data?.message || "Error al guardar.");
    } finally { setSaving(false); }
  };

  const handleDelete = async () => {
    if (!isEdit || !editId) return;
    try { await deleteRecepcion(editId); queryClient.invalidateQueries({ queryKey: ["recepciones"] }); navigation.goBack(); }
    catch { Alert.alert("Error", "No se pudo eliminar"); }
  };

  const renderStep0 = () => (
    <FormSection title="Información General">
      <>
      <DatePickerField label="Fecha *" value={fecha} onChange={setFecha} />
      <FormField label="Responsable *">
        <TextInput style={st.input} value={responsable} onChangeText={setResponsable} placeholder="Nombre del responsable" />
      </FormField>
      <FormField label="Planta / Bodega *">
        <TextInput style={st.input} value={planta} onChangeText={setPlanta} placeholder="Ej. Planta Principal" />
      </FormField>
      <FormField label="Lote Productor">
        <TextInput style={st.input} value={loteProductor} onChangeText={setLoteProductor} placeholder="Código del lote" />
      </FormField>
      <SelectField label="Acopio (opcional)" options={acopios} value={acopioId} onSelect={setAcopioId} placeholder="Vincular a acopio de campo" />
      <FormField label="Observaciones">
        <TextInput style={[st.input, st.textarea]} value={observaciones} onChangeText={setObservaciones} placeholder="Notas..." multiline />
      </FormField>
      </>
    </FormSection>
  );

  const renderStep1 = () => (
    <FormSection title={`Pesaje de Sacos (${sacos.length})`} icon={Package} iconBg={colors.primaryLight} iconColor={colors.primary}>
      <>
      <View style={[st.totalCard, { backgroundColor: colors.primaryLight }]}>
        <Text style={[st.totalLabel, { color: colors.primary }]}>TOTAL</Text>
        <Text style={[st.totalValue, { color: colors.primary }]}>{sacos.length} sacos · {sacos.reduce((s, x) => s + x.peso, 0).toFixed(2)} kg</Text>
      </View>
      {sacos.length > 0 && <View style={st.sacosList}>
        {sacos.map((saco, idx) => (
          <View key={idx} style={[st.sacoItem, { backgroundColor: colors.surface }]}>
            <Text style={[st.sacoCode, { color: colors.text }]}>{saco.codigo}</Text>
            <Text style={[st.sacoPeso, { color: colors.textMuted }]}>{saco.peso.toFixed(2)} kg</Text>
            <TouchableOpacity onPress={() => deleteSaco(idx)}><Trash2 size={14} color={colors.danger} /></TouchableOpacity>
          </View>
        ))}
      </View>}
      <View style={st.quickAddRow}>
        <TextInput style={[st.quickInput, { borderColor: colors.border }]} value={quickPeso} onChangeText={setQuickPeso} placeholder="Peso kg" keyboardType="decimal-pad" />
        <TouchableOpacity style={[st.quickAddBtn, { backgroundColor: colors.primary }]} onPress={quickAddSaco}>
          <Text style={st.quickAddBtnText}>Agregar</Text>
        </TouchableOpacity>
      </View>
      </>
    </FormSection>
  );

  const renderStep2 = () => (
    <FormSection title="Pesaje General">
      <>
      <FormField label="Peso en Campo (kg)">
        <TextInput style={st.input} value={pesoCampo} onChangeText={setPesoCampo} placeholder="Peso registrado en campo" keyboardType="decimal-pad" />
      </FormField>
      <FormField label="Peso Bruto (kg) *">
        <TextInput style={st.input} value={pesoBruto} onChangeText={setPesoBruto} placeholder="Peso al ingreso" keyboardType="decimal-pad" />
      </FormField>
      <FormField label="Tara (kg)">
        <TextInput style={st.input} value={tara} onChangeText={setTara} placeholder="Peso del vehículo vacío" keyboardType="decimal-pad" />
      </FormField>
      <View style={[st.calcCard, { backgroundColor: colors.primaryLight }]}>
        <View style={st.calcRow}><Text style={[st.calcLabel, { color: colors.primary }]}>Peso Neto</Text><Text style={[st.calcValue, { color: colors.primary }]}>{pesoNetoCalc.toFixed(2)} kg</Text></View>
        {pesoCampo ? <>
          <View style={st.calcRow}><Text style={[st.calcLabel, { color: colors.primary }]}>Diferencia</Text><Text style={[st.calcValue, { color: diferenciaCalc < 0 ? colors.danger : colors.primary }]}>{diferenciaCalc.toFixed(2)} kg</Text></View>
          <View style={st.calcRow}><Text style={[st.calcLabel, { color: colors.primary }]}>Merma</Text><Text style={[st.calcValue, { color: mermaCalc > 2 ? colors.danger : colors.primary }]}>{mermaCalc.toFixed(2)}%</Text></View>
        </> : null}
      </View>
      </>
    </FormSection>
  );

  const renderStep3 = () => (
    <FormSection title="Análisis de Calidad">
      <>
      <FormField row>
        <View style={{ flex: 1 }}>
          <FormField label="Humedad (%)">
            <TextInput style={st.input} value={humedad} onChangeText={setHumedad} keyboardType="decimal-pad" />
          </FormField>
        </View>
        <View style={{ flex: 1 }}>
          <FormField label="Impurezas (%)">
            <TextInput style={st.input} value={impurezas} onChangeText={setImpurezas} keyboardType="decimal-pad" />
          </FormField>
        </View>
      </FormField>
      <FormField row>
        <View style={{ flex: 1 }}>
          <FormField label="Materia Extraña (%)">
            <TextInput style={st.input} value={materiaExtrana} onChangeText={setMateriaExtrana} keyboardType="decimal-pad" />
          </FormField>
        </View>
        <View style={{ flex: 1 }}>
          <FormField label="Color">
            <TextInput style={st.input} value={color} onChangeText={setColor} placeholder="Ej. Amarillo" />
          </FormField>
        </View>
      </FormField>
      <FormField row>
        <View style={{ flex: 1 }}>
          <FormField label="Olor">
            <TextInput style={st.input} value={olor} onChangeText={setOlor} placeholder="Ej. Normal" />
          </FormField>
        </View>
        <View style={{ flex: 1 }}>
          <FormField label="Insectos">
            <TextInput style={st.input} value={presenciaInsectos} onChangeText={setPresenciaInsectos} placeholder="Ej. No" />
          </FormField>
        </View>
      </FormField>
      <SelectField label="Estado Producto" value={estadoProducto} options={["EXCELENTE", "BUENO", "REGULAR", "RECHAZADO"]} onSelect={setEstadoProducto} placeholder="Seleccione" />
      <SelectField label="Categoría" value={categoria} options={["PRIMERA", "SEGUNDA", "INDUSTRIAL", "DESCARTE"]} onSelect={setCategoria} placeholder="Seleccione" />
      <SelectField label="Destino" value={destino} options={["PROCESAMIENTO", "ALMACEN_TEMPORAL", "RECHAZADO"]} onSelect={setDestino} placeholder="Seleccione" />
      </>
    </FormSection>
  );

  const renderStep4 = () => (
    <FormSection title="Resumen">
      <>
      <Text style={[st.summaryItem, { color: colors.text, borderBottomColor: colors.border }]}>Fecha: {fecha}</Text>
      <Text style={[st.summaryItem, { color: colors.text, borderBottomColor: colors.border }]}>Responsable: {responsable}</Text>
      <Text style={[st.summaryItem, { color: colors.text, borderBottomColor: colors.border }]}>Planta: {planta}</Text>
      <Text style={[st.summaryItem, { color: colors.text, borderBottomColor: colors.border }]}>Lote: {loteProductor || "—"}</Text>
      <View style={[st.summaryHighlight, { backgroundColor: colors.primaryLight }]}>
        <Text style={[st.summaryHL, { color: colors.primary }]}>Pesaje</Text>
        <Text style={[st.summaryHV, { color: colors.primary }]}>{sacos.length} sacos · Bruto: {pesoBruto || "0"} kg · Neto: {pesoNetoCalc.toFixed(2)} kg</Text>
      </View>
      </>
    </FormSection>
  );

  const steps = [renderStep0, renderStep1, renderStep2, renderStep3, renderStep4];

  return (
    <FormScreenLayout
      title={`${isEdit ? "Editar" : "Nueva"} Recepción`}
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
  input: { backgroundColor: "#FFF", borderWidth: 1, borderColor: "#D1D5DB", borderRadius: 10, paddingHorizontal: 14, paddingVertical: 12, fontSize: 14, color: "#111827" },
  textarea: { height: 80, textAlignVertical: "top" },
  calcCard: { borderRadius: 10, padding: 16, marginTop: 12 },
  calcRow: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 4 },
  calcLabel: { fontSize: 14 }, calcValue: { fontSize: 14, fontWeight: "600" },
  totalCard: { borderRadius: 10, padding: 16, marginTop: 8, alignItems: "center" },
  totalLabel: { fontSize: 12, fontWeight: "600" }, totalValue: { fontSize: 18, fontWeight: "700", marginTop: 4 },
  sacosList: { marginTop: 12 }, sacoItem: { flexDirection: "row", alignItems: "center", borderRadius: 8, padding: 12, marginBottom: 6 },
  sacoCode: { fontSize: 14, fontWeight: "500", flex: 1 }, sacoPeso: { fontSize: 14, marginRight: 12 },
  quickAddRow: { flexDirection: "row", gap: 8, marginTop: 12 },
  quickInput: { flex: 1, backgroundColor: "#FFF", borderWidth: 1, borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10, fontSize: 14 },
  quickAddBtn: { paddingHorizontal: 20, paddingVertical: 10, borderRadius: 8, justifyContent: "center" },
  quickAddBtnText: { color: "#FFF", fontSize: 14, fontWeight: "600" },
  summaryItem: { fontSize: 14, paddingVertical: 6, borderBottomWidth: 1 },
  summaryHighlight: { borderRadius: 10, padding: 16, marginTop: 12, alignItems: "center" },
  summaryHL: { fontSize: 12, fontWeight: "600" }, summaryHV: { fontSize: 16, fontWeight: "700", marginTop: 4 },
});
