import React, { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, TextInput } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRoute, useNavigation } from "@react-navigation/native";
import { ArrowLeft, Pencil, CheckCircle2, Settings, Package, Route, Warehouse, User, Plus } from "lucide-react-native";
import { LoadingSpinner, ConfirmDialog, Card } from "../components/ui";
import { useTheme } from "../contexts/ThemeContext";
import { toast } from "../utils/toast";
import {
  useOrden,
  useBalance,
  useTrazabilidad,
  useFinalizarOrden,
  useAddOperacion,
  useRemoveOperacion,
  useAddSalida,
  useRemoveSalida,
} from "../hooks/useOrdenes";
import type { OrdenOperacion, OrdenSalida } from "../services/ordenes";

const estadoLabels: Record<string, string> = {
  BORRADOR: "Borrador",
  EN_PROCESO: "En proceso",
  FINALIZADO: "Finalizado",
  PAUSADA: "Pausada",
  CANCELADA: "Cancelada",
};

const etapaLabels: Record<string, string> = {
  PRIMARIA: "Primaria",
  SECUNDARIA: "Secundaria",
  EMPAQUE: "Empaque",
};

export default function ProcesamientoDetailScreen() {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const { colors } = useTheme();
  const id = route.params?.id as number;
  const [showFinalizar, setShowFinalizar] = useState(false);
  const [showOpModal, setShowOpModal] = useState(false);
  const [showSalidaModal, setShowSalidaModal] = useState(false);
  const [opData, setOpData] = useState({ operario: "", peso_antes: "", peso_despues: "", humedad: "", resultado: "", observaciones: "", completada: false });
  const [salData, setSalData] = useState({ tipo_salida: "PRODUCTO_BUENO", descripcion: "", cantidad: "", unidad: "KG", humedad: "", destino: "KARDEX", cuenta_en_balance: true, observaciones: "" });

  const { data: orden, isLoading } = useOrden(id);
  const { data: balance } = useBalance(id);
  const { data: trazabilidad } = useTrazabilidad(id);
  const finalizarMutation = useFinalizarOrden();
  const addOp = useAddOperacion();
  const removeOp = useRemoveOperacion();
  const addSal = useAddSalida();
  const removeSal = useRemoveSalida();

  const handleFinalizar = async () => {
    try {
      await finalizarMutation.mutateAsync(id);
      toast.success("Orden finalizada");
      setShowFinalizar(false);
      navigation.navigate("Procesamientos", { refresh: true });
    } catch (e: any) {
      toast.error(e?.response?.data?.error || "No se pudo finalizar");
    }
  };

  const handleAddOp = async () => {
    try {
      await addOp.mutateAsync({ ordenId: id, data: { operario: opData.operario || null, peso_antes: opData.peso_antes ? Number(opData.peso_antes) : null, peso_despues: opData.peso_despues ? Number(opData.peso_despues) : null, humedad: opData.humedad ? Number(opData.humedad) : null, resultado: opData.resultado || null, observaciones: opData.observaciones || null, completada: opData.completada } });
      toast.success("Operación registrada");
      setShowOpModal(false);
    } catch (e: any) {
      toast.error(e?.response?.data?.error || "Error");
    }
  };

  const handleAddSal = async () => {
    try {
      await addSal.mutateAsync({ ordenId: id, data: { tipo_salida: salData.tipo_salida, descripcion: salData.descripcion, cantidad: Number(salData.cantidad || 0), unidad: salData.unidad, humedad: salData.humedad ? Number(salData.humedad) : null, destino: salData.destino, cuenta_en_balance: salData.cuenta_en_balance, observaciones: salData.observaciones || null } });
      toast.success("Salida registrada");
      setShowSalidaModal(false);
    } catch (e: any) {
      toast.error(e?.response?.data?.error || "Error");
    }
  };

  if (isLoading || !orden) {
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
          <View style={{ flexDirection: "row" }}>
            <TouchableOpacity onPress={() => navigation.navigate("ProcesamientoForm", { id: orden.id })} style={{ flexDirection: "row", alignItems: "center", marginRight: 8, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 10, backgroundColor: colors.surface }}>
              <Pencil size={14} color={colors.text} />
              <Text style={{ marginLeft: 4, fontSize: 12, color: colors.text }}>Editar</Text>
            </TouchableOpacity>
            {orden.estado !== "FINALIZADO" && orden.estado !== "CANCELADA" && (
              <TouchableOpacity onPress={() => setShowFinalizar(true)} style={{ flexDirection: "row", alignItems: "center", paddingHorizontal: 10, paddingVertical: 6, borderRadius: 10, backgroundColor: colors.primary }}>
                <CheckCircle2 size={14} color="#FFF" />
                <Text style={{ marginLeft: 4, fontSize: 12, color: "#FFF" }}>Finalizar</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        <Card style={{ padding: 16 }}>
          <Text style={{ fontSize: 16, fontWeight: "600", color: colors.text }}>{orden.codigo}</Text>
          <Text style={{ marginTop: 4, fontSize: 12, color: colors.textSecondary }}>{estadoLabels[orden.estado]} · {etapaLabels[orden.etapa]}</Text>
          <Text style={{ marginTop: 8, fontSize: 12, color: colors.textSecondary }}>Producto: {orden.producto_salida}</Text>
          <Text style={{ fontSize: 12, color: colors.textSecondary }}>Peso entrada: {Number(orden.peso_entrada).toLocaleString("es-PE")} kg · Salida: {Number(orden.peso_salida_total).toLocaleString("es-PE")} kg · Merma: {Number(orden.merma_total).toLocaleString("es-PE")} kg · Rendimiento: {orden.rendimiento}%</Text>
        </Card>

        {balance && (
          <Card style={{ padding: 16, marginTop: 12 }}>
            <Text style={{ fontSize: 14, fontWeight: "600", color: colors.text }}>Balance</Text>
            <Text style={{ marginTop: 4, fontSize: 12, color: colors.textSecondary }}>Entrada {balance.peso_entrada.toLocaleString("es-PE")} kg · Salidas {balance.suma_salidas.toLocaleString("es-PE")} kg · Diferencia {balance.diferencia.toLocaleString("es-PE")} kg ({balance.diferencia_pct}%) · OK: {balance.balance_ok ? "Sí" : "No"}</Text>
          </Card>
        )}

        <Card style={{ padding: 16, marginTop: 12 }}>
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
            <Text style={{ fontSize: 14, fontWeight: "600", color: colors.text }}>Operaciones</Text>
            {orden.estado !== "FINALIZADO" && (
              <TouchableOpacity onPress={() => setShowOpModal(true)} style={{ flexDirection: "row", alignItems: "center", paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8, backgroundColor: colors.primaryLight }}>
                <Plus size={14} color={colors.primary} />
                <Text style={{ marginLeft: 4, fontSize: 11, color: colors.primary }}>Agregar</Text>
              </TouchableOpacity>
            )}
          </View>
          {(orden.operaciones ?? []).length === 0 && <Text style={{ marginTop: 6, fontSize: 12, color: colors.textMuted }}>Sin operaciones</Text>}
          {(orden.operaciones ?? []).map((op: OrdenOperacion) => (
            <View key={op.id} style={{ marginTop: 8, padding: 10, borderRadius: 10, backgroundColor: colors.background }}>
              <Text style={{ fontSize: 12, fontWeight: "500", color: colors.text }}>{op.operacion.nombre}</Text>
              <Text style={{ fontSize: 11, color: colors.textSecondary }}>{op.fecha} · {op.completada ? "Completada" : "Pendiente"}</Text>
            </View>
          ))}
        </Card>

        <Card style={{ padding: 16, marginTop: 12 }}>
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
            <Text style={{ fontSize: 14, fontWeight: "600", color: colors.text }}>Salidas</Text>
            {orden.estado !== "FINALIZADO" && (
              <TouchableOpacity onPress={() => setShowSalidaModal(true)} style={{ flexDirection: "row", alignItems: "center", paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8, backgroundColor: colors.primaryLight }}>
                <Plus size={14} color={colors.primary} />
                <Text style={{ marginLeft: 4, fontSize: 11, color: colors.primary }}>Agregar</Text>
              </TouchableOpacity>
            )}
          </View>
          {(orden.salidas ?? []).length === 0 && <Text style={{ marginTop: 6, fontSize: 12, color: colors.textMuted }}>Sin salidas</Text>}
          {(orden.salidas ?? []).map((s: OrdenSalida) => (
            <View key={s.id} style={{ marginTop: 8, padding: 10, borderRadius: 10, backgroundColor: colors.background }}>
              <Text style={{ fontSize: 12, fontWeight: "500", color: colors.text }}>{s.descripcion} · {s.cantidad.toLocaleString("es-PE")} {s.unidad}</Text>
              <Text style={{ fontSize: 11, color: colors.textSecondary }}>{s.tipo_salida} · destino {s.destino} · balance {s.cuenta_en_balance ? "Sí" : "No"}</Text>
            </View>
          ))}
        </Card>

        <Card style={{ padding: 16, marginTop: 12 }}>
          <Text style={{ fontSize: 14, fontWeight: "600", color: colors.text }}>Trazabilidad</Text>
          {(trazabilidad as any)?.recepciones?.length === 0 && !(trazabilidad as any)?.orden_origen && <Text style={{ marginTop: 6, fontSize: 12, color: colors.textMuted }}>Sin datos</Text>}
        </Card>
      </ScrollView>

      <ConfirmDialog
        visible={showFinalizar}
        title="Finalizar orden"
        message="¿Confirmas finalizar esta orden de procesamiento?"
        confirmLabel="Finalizar"
        cancelLabel="Cancelar"
        onConfirm={handleFinalizar}
        onCancel={() => setShowFinalizar(false)}
      />
    </SafeAreaView>
  );
}