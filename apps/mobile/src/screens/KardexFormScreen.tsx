import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useQueryClient } from "@tanstack/react-query";
import { SelectField, DatePickerField } from "../components/ui";
import { FormScreenLayout, FormSection, FormField } from "../components/layouts/FormScreenLayout";
import { useTheme } from "../contexts/ThemeContext";
import { fetchKardexItem, deleteKardexItem, type KardexItem } from "../services/kardex";
import api from "../services/api";

const CATEGORIAS = ["PRODUCTO_CAMPO", "PRODUCTO_PROCESADO", "SUBPRODUCTO", "ENVASE"];
const ESTADOS = ["DISPONIBLE", "CONSUMIDO", "VENCIDO"];
const UNIDADES = ["KG", "LT", "UN", "GL", "LB"];

export default function KardexFormScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const editId = Number(route.params?.id);
  const isEdit = Boolean(editId);
  const queryClient = useQueryClient();
  const { colors } = useTheme();

  const [saving, setSaving] = useState(false);
  const [loadingData, setLoadingData] = useState(isEdit);

  const [codigo, setCodigo] = useState("");
  const [producto, setProducto] = useState("");
  const [categoria, setCategoria] = useState("PRODUCTO_CAMPO");
  const [unidad, setUnidad] = useState("KG");
  const [cantidadActual, setCantidadActual] = useState("0");
  const [cantidadMinima, setCantidadMinima] = useState("0");
  const [cantidadMaxima, setCantidadMaxima] = useState("");
  const [ubicacion, setUbicacion] = useState("");
  const [estado, setEstado] = useState("DISPONIBLE");
  const [fechaIngreso, setFechaIngreso] = useState(new Date().toISOString().split("T")[0]);
  const [fechaVencimiento, setFechaVencimiento] = useState("");
  const [proveedor, setProveedor] = useState("");
  const [costoUnitario, setCostoUnitario] = useState("");
  const [observaciones, setObservaciones] = useState("");

  useEffect(() => {
    if (isEdit && editId) {
      fetchKardexItem(editId)
        .then((d: KardexItem) => {
          setCodigo(d.codigo);
          setProducto(d.producto);
          setCategoria(d.categoria);
          setUnidad(d.unidad);
          setCantidadActual(String(d.cantidad_actual));
          setCantidadMinima(d.cantidad_minima != null ? String(d.cantidad_minima) : "");
          setCantidadMaxima(d.cantidad_maxima != null ? String(d.cantidad_maxima) : "");
          setUbicacion(d.ubicacion ?? "");
          setEstado(d.estado);
          setFechaIngreso(d.fecha_ingreso.split("T")[0] || d.fecha_ingreso);
          setFechaVencimiento(d.fecha_vencimiento ? d.fecha_vencimiento.split("T")[0] : "");
          setProveedor(d.proveedor ?? "");
          setCostoUnitario(d.costo_unitario != null ? String(d.costo_unitario) : "");
          setObservaciones(d.observaciones ?? "");
        })
        .catch(() => Alert.alert("Error", "No se pudo cargar el item."))
        .finally(() => setLoadingData(false));
    }
  }, [editId, isEdit]);

  const handleSave = async () => {
    if (!producto.trim()) {
      Alert.alert("Campos obligatorios", "El producto es obligatorio.");
      return;
    }
    if (!categoria) {
      Alert.alert("Error", "La categoría es obligatoria.");
      return;
    }
    if (!fechaIngreso) {
      Alert.alert("Error", "La fecha de ingreso es obligatoria.");
      return;
    }
    setSaving(true);
    try {
      const payload: Record<string, unknown> = {
        codigo: codigo.trim() || undefined,
        producto: producto.trim(),
        categoria,
        unidad,
        cantidad_actual: cantidadActual ? Number(cantidadActual) : 0,
        cantidad_minima: cantidadMinima ? Number(cantidadMinima) : null,
        cantidad_maxima: cantidadMaxima ? Number(cantidadMaxima) : null,
        ubicacion: ubicacion.trim() || null,
        estado,
        fecha_ingreso: fechaIngreso.includes("T") ? fechaIngreso : `${fechaIngreso}T00:00:00.000Z`,
        fecha_vencimiento: fechaVencimiento
          ? (fechaVencimiento.includes("T") ? fechaVencimiento : `${fechaVencimiento}T00:00:00.000Z`)
          : null,
        proveedor: proveedor.trim() || null,
        costo_unitario: costoUnitario ? Number(costoUnitario) : null,
        observaciones: observaciones.trim() || null,
      };
      if (isEdit && editId) await api.put(`/kardex/${editId}`, payload);
      else await api.post("/kardex", payload);
      queryClient.invalidateQueries({ queryKey: ["kardex"] });
      navigation.goBack();
    } catch (err: any) {
      Alert.alert("Error", err?.response?.data?.message || "Error al guardar.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!isEdit || !editId) return;
    try {
      await deleteKardexItem(editId);
      queryClient.invalidateQueries({ queryKey: ["kardex"] });
      navigation.goBack();
    } catch {
      Alert.alert("Error", "No se pudo eliminar");
    }
  };

  return (
    <FormScreenLayout
      title="Item de Kardex"
      isEdit={isEdit}
      onBack={() => navigation.goBack()}
      onSave={handleSave}
      onDelete={isEdit ? handleDelete : undefined}
      saving={saving}
    >
      {loadingData ? (
        <Text style={{ color: colors.textMuted, textAlign: "center", marginTop: 40 }}>Cargando...</Text>
      ) : (
        <FormSection title="Información del Producto">
          <>
            <FormField label="Producto *">
              <TextInput style={st.input} value={producto} onChangeText={setProducto} placeholder="Ej. Quinua trillada" placeholderTextColor={colors.placeholder} />
            </FormField>
            <FormField label="Código">
              <TextInput style={st.input} value={codigo} onChangeText={setCodigo} placeholder="Autogenerado si se deja vacío" placeholderTextColor={colors.placeholder} />
            </FormField>
            <FormField>
              <View style={st.row}>
                <View style={{ flex: 1 }}>
                  <SelectField label="Categoría *" value={categoria} options={CATEGORIAS} onSelect={setCategoria} />
                </View>
                <View style={{ flex: 1 }}>
                  <SelectField label="Unidad" value={unidad} options={UNIDADES} onSelect={setUnidad} />
                </View>
              </View>
            </FormField>
            <SelectField label="Estado" value={estado} options={ESTADOS} onSelect={setEstado} />
          </>
        </FormSection>
      )}

      {!loadingData ? (
        <FormSection title="Stock y Ubicación">
          <>
            <FormField>
              <View style={st.row}>
                <View style={{ flex: 1 }}>
                  <FormField label="Stock actual">
                    <TextInput style={st.input} value={cantidadActual} onChangeText={setCantidadActual} keyboardType="decimal-pad" placeholder="0" placeholderTextColor={colors.placeholder} />
                  </FormField>
                </View>
                <View style={{ flex: 1 }}>
                  <FormField label="Stock mínimo">
                    <TextInput style={st.input} value={cantidadMinima} onChangeText={setCantidadMinima} keyboardType="decimal-pad" placeholder="0" placeholderTextColor={colors.placeholder} />
                  </FormField>
                </View>
              </View>
            </FormField>
            <FormField label="Stock máximo">
              <TextInput style={st.input} value={cantidadMaxima} onChangeText={setCantidadMaxima} keyboardType="decimal-pad" placeholder="Opcional" placeholderTextColor={colors.placeholder} />
            </FormField>
            <FormField label="Ubicación">
              <TextInput style={st.input} value={ubicacion} onChangeText={setUbicacion} placeholder="Ej. Almacén A - Anaquel 2" placeholderTextColor={colors.placeholder} />
            </FormField>
            <FormField label="Costo unitario (S/)">
              <TextInput style={st.input} value={costoUnitario} onChangeText={setCostoUnitario} keyboardType="decimal-pad" placeholder="0.00" placeholderTextColor={colors.placeholder} />
            </FormField>
          </>
        </FormSection>
      ) : null}

      {!loadingData ? (
        <FormSection title="Fechas y Proveedor">
          <>
            <DatePickerField label="Fecha de ingreso *" value={fechaIngreso} onChange={setFechaIngreso} />
            <DatePickerField label="Fecha de vencimiento" value={fechaVencimiento} onChange={setFechaVencimiento} />
            <FormField label="Proveedor">
              <TextInput style={st.input} value={proveedor} onChangeText={setProveedor} placeholder="Opcional" placeholderTextColor={colors.placeholder} />
            </FormField>
            <FormField label="Observaciones">
              <TextInput style={[st.input, st.textarea]} value={observaciones} onChangeText={setObservaciones} placeholder="Notas..." placeholderTextColor={colors.placeholder} multiline />
            </FormField>
          </>
        </FormSection>
      ) : null}

      <View style={{ height: 20 }} />
    </FormScreenLayout>
  );
}

const st = StyleSheet.create({
  input: { backgroundColor: "#FFF", borderWidth: 1, borderColor: "#D1D5DB", borderRadius: 10, paddingHorizontal: 14, paddingVertical: 12, fontSize: 14, color: "#111827" },
  textarea: { height: 80, textAlignVertical: "top" },
  row: { flexDirection: "row", gap: 12 },
});