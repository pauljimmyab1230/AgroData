import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation, useRoute } from "@react-navigation/native";
import { ArrowLeft, Save } from "lucide-react-native";
import { Card, LoadingSpinner } from "../components/ui";
import { useTheme } from "../contexts/ThemeContext";
import { toast } from "../utils/toast";
import { useOrden, useCreateOrden, useUpdateOrden, useRecetasActivas } from "../hooks/useOrdenes";

export default function ProcesamientoFormScreen() {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const { colors } = useTheme();
  const id = route.params?.id as number | undefined;
  const isEdit = !!id;

  const [planta, setPlanta] = useState("Planta 1");
  const [responsable, setResponsable] = useState("");
  const [fechaInicio, setFechaInicio] = useState(new Date().toISOString().slice(0, 10));
  const [etapa, setEtapa] = useState<"PRIMARIA" | "SECUNDARIA" | "EMPAQUE">("PRIMARIA");
  const [recetaId, setRecetaId] = useState<number | undefined>(undefined);
  const [productoSalida, setProductoSalida] = useState("");
  const [pesoEntrada, setPesoEntrada] = useState("0");
  const [humedadFinal, setHumedadFinal] = useState("");
  const [calidad, setCalidad] = useState<"PRIMERA" | "SEGUNDA" | "TERCERA" | "DESCARTE">("PRIMERA");
  const [observaciones, setObservaciones] = useState("");

  const { data: orden, isLoading: loadingOrden } = useOrden(id || null);
  const { data: recetas } = useRecetasActivas(etapa);
  const createMutation = useCreateOrden();
  const updateMutation = useUpdateOrden();

  useEffect(() => {
    if (isEdit && orden) {
      setPlanta(orden.planta);
      setResponsable(orden.responsable);
      setFechaInicio(orden.fecha_inicio);
      setEtapa(orden.etapa);
      setRecetaId(orden.receta_id || undefined);
      setProductoSalida(orden.producto_salida);
      setPesoEntrada(String(orden.peso_entrada));
      setHumedadFinal(orden.humedad_final == null ? "" : String(orden.humedad_final));
      setCalidad(orden.calidad || "PRIMERA");
      setObservaciones(orden.observaciones || "");
    }
  }, [isEdit, orden]);

  const handleSubmit = async () => {
    const data: any = {
      planta,
      responsable,
      fecha_inicio: fechaInicio,
      etapa,
      receta_id: recetaId || null,
      producto_salida: productoSalida,
      peso_entrada: Number(pesoEntrada || 0),
      humedad_final: humedadFinal ? Number(humedadFinal) : null,
      calidad,
      observaciones: observaciones || null,
    };
    try {
      if (isEdit && id) {
        await updateMutation.mutateAsync({ id, data });
        toast.success("Orden actualizada");
      } else {
        await createMutation.mutateAsync(data);
        toast.success("Orden creada");
      }
      navigation.navigate("Procesamientos", { refresh: true });
    } catch (e: any) {
      toast.error(e?.response?.data?.error || "Error");
    }
  };

  if (isEdit && loadingOrden) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
        <LoadingSpinner text="Cargando orden..." />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 24 }}>
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={{ flexDirection: "row", alignItems: "center" }}>
            <ArrowLeft size={18} color={colors.text} />
            <Text style={{ marginLeft: 6, fontSize: 14, color: colors.text }}>Volver</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleSubmit} style={{ flexDirection: "row", alignItems: "center", paddingHorizontal: 12, paddingVertical: 8, borderRadius: 10, backgroundColor: colors.primary }}>
            <Save size={16} color="#FFF" />
            <Text style={{ marginLeft: 6, fontSize: 13, color: "#FFF" }}>{isEdit ? "Guardar" : "Crear"}</Text>
          </TouchableOpacity>
        </View>

        <Card style={{ padding: 16 }}>
          <Text style={{ fontSize: 14, fontWeight: "600", color: colors.text, marginBottom: 8 }}>Datos generales</Text>
          <Text style={{ fontSize: 11, color: colors.textSecondary }}>Planta</Text>
          <TextInput style={{ marginTop: 4, borderWidth: 1, borderColor: colors.border, borderRadius: 10, paddingHorizontal: 10, paddingVertical: 8, color: colors.text }} value={planta} onChangeText={setPlanta} />
          <Text style={{ fontSize: 11, color: colors.textSecondary, marginTop: 8 }}>Responsable</Text>
          <TextInput style={{ marginTop: 4, borderWidth: 1, borderColor: colors.border, borderRadius: 10, paddingHorizontal: 10, paddingVertical: 8, color: colors.text }} value={responsable} onChangeText={setResponsable} />
          <Text style={{ fontSize: 11, color: colors.textSecondary, marginTop: 8 }}>Fecha inicio (YYYY-MM-DD)</Text>
          <TextInput style={{ marginTop: 4, borderWidth: 1, borderColor: colors.border, borderRadius: 10, paddingHorizontal: 10, paddingVertical: 8, color: colors.text }} value={fechaInicio} onChangeText={setFechaInicio} />
          <Text style={{ fontSize: 11, color: colors.textSecondary, marginTop: 8 }}>Producto salida</Text>
          <TextInput style={{ marginTop: 4, borderWidth: 1, borderColor: colors.border, borderRadius: 10, paddingHorizontal: 10, paddingVertical: 8, color: colors.text }} value={productoSalida} onChangeText={setProductoSalida} />
          <Text style={{ fontSize: 11, color: colors.textSecondary, marginTop: 8 }}>Peso entrada (kg)</Text>
          <TextInput keyboardType="numeric" style={{ marginTop: 4, borderWidth: 1, borderColor: colors.border, borderRadius: 10, paddingHorizontal: 10, paddingVertical: 8, color: colors.text }} value={pesoEntrada} onChangeText={setPesoEntrada} />
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}