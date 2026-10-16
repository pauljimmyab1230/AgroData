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
import { fechaHoyLocal } from "../utils/fechas";
import api from "../services/api";

const STEPS = ["General", "Insumos", "Mano de Obra", "Maquinaria", "Resumen"];
interface SelectOption { value: string; label: string; }

interface BorradorInsumo { producto: string; categoria: string; fabricante: string; cantidad: string; unidad: string; lote: string; costoUnitario: string; costoTotal: string; observaciones: string; }
interface BorradorManoObra { trabajador: string; funcion: string; horas: string; jornales: string; costoJornal: string; costoTotal: string; observaciones: string; }
interface BorradorMaquinaria { equipo: string; operador: string; horasUso: string; costoHora: string; costoTotal: string; combustible: string; observaciones: string; }

const emptyInsumo: BorradorInsumo = { producto: "", categoria: "", fabricante: "", cantidad: "", unidad: "", lote: "", costoUnitario: "", costoTotal: "", observaciones: "" };
const emptyManoObra: BorradorManoObra = { trabajador: "", funcion: "", horas: "", jornales: "", costoJornal: "", costoTotal: "", observaciones: "" };
const emptyMaquinaria: BorradorMaquinaria = { equipo: "", operador: "", horasUso: "", costoHora: "", costoTotal: "", combustible: "", observaciones: "" };

const aNumero = (texto: string): number | null => {
  const n = Number(texto.replace(",", "."));
  return texto.trim() === "" || !Number.isFinite(n) ? null : n;
};
const aTexto = (valor: number | null | undefined): string => (valor != null ? String(valor) : "");

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

  const [fecha, setFecha] = useState(fechaHoyLocal());
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
    Alert.alert("Eliminar actividad", "¿Eliminar esta actividad?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Eliminar", style: "destructive",
        onPress: async () => {
          try { await api.delete(`/actividades/${editId}`); queryClient.invalidateQueries({ queryKey: ["actividades"] }); navigation.goBack(); }
          catch { Alert.alert("Error", "No se pudo eliminar"); }
        },
      },
    ]);
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
    if (type === "insumo") {
      const it = insumos[index];
      setDraftInsumo({ producto: it.producto, categoria: it.categoria ?? "", fabricante: it.fabricante ?? "", cantidad: aTexto(it.cantidad), unidad: it.unidad ?? "", lote: it.lote ?? "", costoUnitario: aTexto(it.costoUnitario), costoTotal: aTexto(it.costoTotal), observaciones: it.observaciones ?? "" });
    }
    if (type === "manoObra") {
      const it = manoObra[index];
      setDraftManoObra({ trabajador: it.trabajador, funcion: it.funcion ?? "", horas: aTexto(it.horas), jornales: aTexto(it.jornales), costoJornal: aTexto(it.costoJornal), costoTotal: aTexto(it.costoTotal), observaciones: it.observaciones ?? "" });
    }
    if (type === "maquinaria") {
      const it = maquinaria[index];
      setDraftMaquinaria({ equipo: it.equipo, operador: it.operador ?? "", horasUso: aTexto(it.horasUso), costoHora: aTexto(it.costoHora), costoTotal: aTexto(it.costoTotal), combustible: aTexto(it.combustible), observaciones: it.observaciones ?? "" });
    }
    setModalType(type);
  };

  const handleSaveItem = () => {
    if (modalType === "insumo") {
      if (!draftInsumo.producto.trim()) { Alert.alert("Error", "Producto obligatorio"); return; }
      const cantidad = aNumero(draftInsumo.cantidad);
      const costoUnitario = aNumero(draftInsumo.costoUnitario);
      if (cantidad != null && cantidad <= 0) { Alert.alert("Error", "La cantidad debe ser mayor a 0"); return; }
      const costoTotal = aNumero(draftInsumo.costoTotal) ?? (cantidad != null && costoUnitario != null ? cantidad * costoUnitario : null);
      const item: ActividadInsumo = {
        id: editingIndex >= 0 ? insumos[editingIndex].id : `i-${Date.now()}`,
        producto: draftInsumo.producto.trim(), categoria: draftInsumo.categoria, fabricante: draftInsumo.fabricante,
        cantidad, unidad: draftInsumo.unidad, lote: draftInsumo.lote, costoUnitario, costoTotal,
        observaciones: draftInsumo.observaciones,
      };
      const copy = [...insumos]; if (editingIndex >= 0) copy[editingIndex] = item; else copy.push(item);
      setInsumos(copy);
    } else if (modalType === "manoObra") {
      if (!draftManoObra.trabajador.trim()) { Alert.alert("Error", "Trabajador obligatorio"); return; }
      const jornales = aNumero(draftManoObra.jornales);
      const costoJornal = aNumero(draftManoObra.costoJornal);
      if (jornales != null && jornales <= 0) { Alert.alert("Error", "Los jornales deben ser mayores a 0"); return; }
      const costoTotal = aNumero(draftManoObra.costoTotal) ?? (jornales != null && costoJornal != null ? jornales * costoJornal : null);
      const item: ActividadManoObra = {
        id: editingIndex >= 0 ? manoObra[editingIndex].id : `m-${Date.now()}`,
        trabajador: draftManoObra.trabajador.trim(), funcion: draftManoObra.funcion,
        horas: aNumero(draftManoObra.horas), jornales, costoJornal, costoTotal,
        observaciones: draftManoObra.observaciones,
      };
      const copy = [...manoObra]; if (editingIndex >= 0) copy[editingIndex] = item; else copy.push(item);
      setManoObra(copy);
    } else if (modalType === "maquinaria") {
      if (!draftMaquinaria.equipo.trim()) { Alert.alert("Error", "Equipo obligatorio"); return; }
      const horasUso = aNumero(draftMaquinaria.horasUso);
      const costoHora = aNumero(draftMaquinaria.costoHora);
      if (horasUso != null && horasUso <= 0) { Alert.alert("Error", "Las horas de uso deben ser mayores a 0"); return; }
      const costoTotal = aNumero(draftMaquinaria.costoTotal) ?? (horasUso != null && costoHora != null ? horasUso * costoHora : null);
      const item: ActividadMaquinaria = {
        id: editingIndex >= 0 ? maquinaria[editingIndex].id : `e-${Date.now()}`,
        equipo: draftMaquinaria.equipo.trim(), operador: draftMaquinaria.operador,
        horasUso, costoHora, costoTotal, combustible: aNumero(draftMaquinaria.combustible),
        observaciones: draftMaquinaria.observaciones,
      };
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
      title="Actividad"
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

      {/* MODAL INSUMO / MANO DE OBRA / MAQUINARIA */}
      <Modal visible={modalType !== null} animationType="slide" transparent onRequestClose={() => setModalType(null)}>
        <View style={st.modalOverlay}>
          <View style={[st.modalContent, { backgroundColor: colors.background }]}>
            <Text style={[st.modalTitle, { color: colors.text }]}>
              {editingIndex >= 0 ? "Editar" : "Agregar"}{" "}
              {modalType === "insumo" ? "Insumo" : modalType === "manoObra" ? "Mano de Obra" : "Maquinaria"}
            </Text>

            {modalType === "insumo" && (
              <>
                <FormField label="Producto *">
                  <TextInput style={st.input} value={draftInsumo.producto} onChangeText={(t) => setDraftInsumo({ ...draftInsumo, producto: t })} placeholder="Ej. Fertilizante" />
                </FormField>
                <FormField label="Categoría">
                  <TextInput style={st.input} value={draftInsumo.categoria} onChangeText={(t) => setDraftInsumo({ ...draftInsumo, categoria: t })} placeholder="Ej. Insumo agrícola" />
                </FormField>
                <FormField label="Fabricante">
                  <TextInput style={st.input} value={draftInsumo.fabricante} onChangeText={(t) => setDraftInsumo({ ...draftInsumo, fabricante: t })} placeholder="Marca" />
                </FormField>
                <View style={{ flexDirection: "row", gap: 8 }}>
                  <View style={{ flex: 1 }}>
                    <FormField label="Cantidad">
                      <TextInput style={st.input} keyboardType="numeric" value={draftInsumo.cantidad} onChangeText={(t) => setDraftInsumo({ ...draftInsumo, cantidad: t })} placeholder="0" />
                    </FormField>
                  </View>
                  <View style={{ flex: 1 }}>
                    <FormField label="Unidad">
                      <TextInput style={st.input} value={draftInsumo.unidad} onChangeText={(t) => setDraftInsumo({ ...draftInsumo, unidad: t })} placeholder="kg, L, und" />
                    </FormField>
                  </View>
                </View>
                <FormField label="Lote">
                  <TextInput style={st.input} value={draftInsumo.lote} onChangeText={(t) => setDraftInsumo({ ...draftInsumo, lote: t })} placeholder="N.° de lote" />
                </FormField>
                <View style={{ flexDirection: "row", gap: 8 }}>
                  <View style={{ flex: 1 }}>
                    <FormField label="Costo unitario">
                      <TextInput style={st.input} keyboardType="numeric" value={draftInsumo.costoUnitario} onChangeText={(t) => setDraftInsumo({ ...draftInsumo, costoUnitario: t })} placeholder="0.00" />
                    </FormField>
                  </View>
                  <View style={{ flex: 1 }}>
                    <FormField label="Costo total">
                      <TextInput style={st.input} keyboardType="numeric" value={draftInsumo.costoTotal} onChangeText={(t) => setDraftInsumo({ ...draftInsumo, costoTotal: t })} placeholder="0.00" />
                    </FormField>
                  </View>
                </View>
                <FormField label="Observaciones">
                  <TextInput style={[st.input, st.textarea]} value={draftInsumo.observaciones} onChangeText={(t) => setDraftInsumo({ ...draftInsumo, observaciones: t })} placeholder="Notas..." multiline />
                </FormField>
              </>
            )}

            {modalType === "manoObra" && (
              <>
                <FormField label="Trabajador *">
                  <TextInput style={st.input} value={draftManoObra.trabajador} onChangeText={(t) => setDraftManoObra({ ...draftManoObra, trabajador: t })} placeholder="Nombre completo" />
                </FormField>
                <FormField label="Función">
                  <TextInput style={st.input} value={draftManoObra.funcion} onChangeText={(t) => setDraftManoObra({ ...draftManoObra, funcion: t })} placeholder="Ej. Cosechador" />
                </FormField>
                <View style={{ flexDirection: "row", gap: 8 }}>
                  <View style={{ flex: 1 }}>
                    <FormField label="Horas">
                      <TextInput style={st.input} keyboardType="numeric" value={draftManoObra.horas} onChangeText={(t) => setDraftManoObra({ ...draftManoObra, horas: t })} placeholder="0" />
                    </FormField>
                  </View>
                  <View style={{ flex: 1 }}>
                    <FormField label="Jornales">
                      <TextInput style={st.input} keyboardType="numeric" value={draftManoObra.jornales} onChangeText={(t) => setDraftManoObra({ ...draftManoObra, jornales: t })} placeholder="0" />
                    </FormField>
                  </View>
                </View>
                <View style={{ flexDirection: "row", gap: 8 }}>
                  <View style={{ flex: 1 }}>
                    <FormField label="Costo por jornal">
                      <TextInput style={st.input} keyboardType="numeric" value={draftManoObra.costoJornal} onChangeText={(t) => setDraftManoObra({ ...draftManoObra, costoJornal: t })} placeholder="0.00" />
                    </FormField>
                  </View>
                  <View style={{ flex: 1 }}>
                    <FormField label="Costo total">
                      <TextInput style={st.input} keyboardType="numeric" value={draftManoObra.costoTotal} onChangeText={(t) => setDraftManoObra({ ...draftManoObra, costoTotal: t })} placeholder="0.00" />
                    </FormField>
                  </View>
                </View>
                <FormField label="Observaciones">
                  <TextInput style={[st.input, st.textarea]} value={draftManoObra.observaciones} onChangeText={(t) => setDraftManoObra({ ...draftManoObra, observaciones: t })} placeholder="Notas..." multiline />
                </FormField>
              </>
            )}

            {modalType === "maquinaria" && (
              <>
                <FormField label="Equipo *">
                  <TextInput style={st.input} value={draftMaquinaria.equipo} onChangeText={(t) => setDraftMaquinaria({ ...draftMaquinaria, equipo: t })} placeholder="Ej. Tractor" />
                </FormField>
                <FormField label="Operador">
                  <TextInput style={st.input} value={draftMaquinaria.operador} onChangeText={(t) => setDraftMaquinaria({ ...draftMaquinaria, operador: t })} placeholder="Nombre" />
                </FormField>
                <View style={{ flexDirection: "row", gap: 8 }}>
                  <View style={{ flex: 1 }}>
                    <FormField label="Horas de uso">
                      <TextInput style={st.input} keyboardType="numeric" value={draftMaquinaria.horasUso} onChangeText={(t) => setDraftMaquinaria({ ...draftMaquinaria, horasUso: t })} placeholder="0" />
                    </FormField>
                  </View>
                  <View style={{ flex: 1 }}>
                    <FormField label="Costo por hora">
                      <TextInput style={st.input} keyboardType="numeric" value={draftMaquinaria.costoHora} onChangeText={(t) => setDraftMaquinaria({ ...draftMaquinaria, costoHora: t })} placeholder="0.00" />
                    </FormField>
                  </View>
                </View>
                <View style={{ flexDirection: "row", gap: 8 }}>
                  <View style={{ flex: 1 }}>
                    <FormField label="Costo total">
                      <TextInput style={st.input} keyboardType="numeric" value={draftMaquinaria.costoTotal} onChangeText={(t) => setDraftMaquinaria({ ...draftMaquinaria, costoTotal: t })} placeholder="0.00" />
                    </FormField>
                  </View>
                  <View style={{ flex: 1 }}>
                    <FormField label="Combustible">
                      <TextInput style={st.input} keyboardType="numeric" value={draftMaquinaria.combustible} onChangeText={(t) => setDraftMaquinaria({ ...draftMaquinaria, combustible: t })} placeholder="0.00" />
                    </FormField>
                  </View>
                </View>
                <FormField label="Observaciones">
                  <TextInput style={[st.input, st.textarea]} value={draftMaquinaria.observaciones} onChangeText={(t) => setDraftMaquinaria({ ...draftMaquinaria, observaciones: t })} placeholder="Notas..." multiline />
                </FormField>
              </>
            )}

            <View style={st.modalActions}>
              <TouchableOpacity onPress={() => setModalType(null)} style={[st.cancelBtn, { backgroundColor: colors.surfaceSecondary }]}>
                <Text style={[st.cancelBtnText, { color: colors.textMuted }]}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleSaveItem} style={[st.confirmBtn, { backgroundColor: colors.primary }]}>
                <Text style={st.confirmBtnText}>Guardar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "flex-end" },
  modalContent: { borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 20, maxHeight: "85%" },
  modalTitle: { fontSize: 18, fontWeight: "600", marginBottom: 12 },
  modalActions: { flexDirection: "row", justifyContent: "flex-end", gap: 12, marginTop: 16 },
  cancelBtn: { paddingHorizontal: 20, paddingVertical: 10, borderRadius: 8 },
  cancelBtnText: { fontSize: 14, fontWeight: "500" },
  confirmBtn: { paddingHorizontal: 20, paddingVertical: 10, borderRadius: 8 },
  confirmBtnText: { fontSize: 14, color: "#FFF", fontWeight: "600" },
});
