import React, { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, TextInput, Modal, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRoute, useNavigation } from "@react-navigation/native";
import { ArrowLeft, Pencil, CheckCircle2 } from "lucide-react-native";
import { LoadingSpinner, ConfirmDialog, Card } from "../components/ui";
import { useTheme } from "../contexts/ThemeContext";
import { toast } from "../utils/toast";
import {
  useOrden,
  useBalance,
  useTrazabilidad,
  useFinalizarOrden,
  useAddOperacion,
  useAddSalida,
  useOperacionesActivas,
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

const inputStyle = {
  marginTop: 4,
  borderWidth: 1,
  borderColor: "#D1D5DB",
  borderRadius: 10,
  paddingHorizontal: 10,
  paddingVertical: 8,
  color: "#111827",
  backgroundColor: "#FFF",
} as const;

export default function ProcesamientoDetailScreen() {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const { colors } = useTheme();
  const id = route.params?.id as number;
  const [showFinalizar, setShowFinalizar] = useState(false);
  const [showOpModal, setShowOpModal] = useState(false);
  const [showSalidaModal, setShowSalidaModal] = useState(false);
  const [opData, setOpData] = useState({
    operacion_id: 0,
    operario: "",
    peso_antes: "",
    peso_despues: "",
    humedad: "",
    resultado: "",
    observaciones: "",
    completada: false,
  });
  const [salData, setSalData] = useState({
    tipo_salida: "PRODUCTO_BUENO",
    descripcion: "",
    cantidad: "",
    unidad: "KG",
    humedad: "",
    destino: "KARDEX",
    cuenta_en_balance: true,
    observaciones: "",
  });

  const { data: orden, isLoading } = useOrden(id);
  const { data: balance } = useBalance(id);
  const { data: trazabilidad } = useTrazabilidad(id);
  const { data: catalogoOperaciones = [] } = useOperacionesActivas();
  const finalizarMutation = useFinalizarOrden();
  const addOp = useAddOperacion();
  const addSal = useAddSalida();

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
    if (!opData.operacion_id) {
      toast.error("Selecciona la operacion");
      return;
    }
    try {
      await addOp.mutateAsync({
        ordenId: id,
        data: {
          operacion_id: opData.operacion_id,
          operario: opData.operario || null,
          peso_antes: opData.peso_antes ? Number(opData.peso_antes) : null,
          peso_despues: opData.peso_despues ? Number(opData.peso_despues) : null,
          humedad: opData.humedad ? Number(opData.humedad) : null,
          resultado: opData.resultado || null,
          observaciones: opData.observaciones || null,
          completada: opData.completada,
        },
      });
      toast.success("Operacion registrada");
      setShowOpModal(false);
    } catch (e: any) {
      toast.error(e?.response?.data?.error || "Error");
    }
  };

  const handleAddSal = async () => {
    if (!salData.descripcion.trim()) {
      toast.error("Indica la descripcion de la salida");
      return;
    }
    if (!salData.cantidad || Number(salData.cantidad) <= 0) {
      toast.error("La cantidad debe ser mayor a 0");
      return;
    }
    try {
      await addSal.mutateAsync({
        ordenId: id,
        data: {
          tipo_salida: salData.tipo_salida,
          descripcion: salData.descripcion.trim(),
          cantidad: Number(salData.cantidad),
          unidad: salData.unidad,
          humedad: salData.humedad ? Number(salData.humedad) : null,
          destino: salData.destino,
          cuenta_en_balance: salData.cuenta_en_balance,
          observaciones: salData.observaciones || null,
        },
      });
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

  const traz = (trazabilidad ?? {}) as any;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 24 }}>
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={{ flexDirection: "row", alignItems: "center" }}>
            <ArrowLeft size={18} color={colors.text} />
            <Text style={{ marginLeft: 6, fontSize: 14, color: colors.text }}>Volver</Text>
          </TouchableOpacity>
          <View style={{ flexDirection: "row" }}>
            <TouchableOpacity
              onPress={() => navigation.navigate("ProcesamientoForm", { id: orden.id })}
              style={{ flexDirection: "row", alignItems: "center", marginRight: 8, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 10, backgroundColor: colors.surface }}
            >
              <Pencil size={14} color={colors.text} />
              <Text style={{ marginLeft: 4, fontSize: 12, color: colors.text }}>Editar</Text>
            </TouchableOpacity>
            {orden.estado !== "FINALIZADO" && orden.estado !== "CANCELADA" && (
              <TouchableOpacity
                onPress={() => setShowFinalizar(true)}
                style={{ flexDirection: "row", alignItems: "center", paddingHorizontal: 10, paddingVertical: 6, borderRadius: 10, backgroundColor: colors.primary }}
              >
                <CheckCircle2 size={14} color="#FFF" />
                <Text style={{ marginLeft: 4, fontSize: 12, color: "#FFF" }}>Finalizar</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        <Card style={{ padding: 16 }}>
          <Text style={{ fontSize: 16, fontWeight: "600", color: colors.text }}>{orden.codigo}</Text>
          <Text style={{ marginTop: 4, fontSize: 12, color: colors.textSecondary }}>
            {estadoLabels[orden.estado] ?? orden.estado} · {etapaLabels[orden.etapa] ?? orden.etapa}
          </Text>
          <Text style={{ marginTop: 8, fontSize: 12, color: colors.textSecondary }}>Producto: {orden.producto_salida}</Text>
          <Text style={{ fontSize: 12, color: colors.textSecondary }}>
            Peso entrada: {Number(orden.peso_entrada).toLocaleString("es-PE")} kg · Salida: {Number(orden.peso_salida_total).toLocaleString("es-PE")} kg · Merma:{" "}
            {Number(orden.merma_total).toLocaleString("es-PE")} kg · Rendimiento: {orden.rendimiento}%
          </Text>
        </Card>

        {balance && (
          <Card style={{ padding: 16, marginTop: 12 }}>
            <Text style={{ fontSize: 14, fontWeight: "600", color: colors.text }}>Balance</Text>
            <Text style={{ marginTop: 4, fontSize: 12, color: colors.textSecondary }}>
              Entrada {balance.peso_entrada.toLocaleString("es-PE")} kg · Salidas {balance.suma_salidas.toLocaleString("es-PE")} kg · Diferencia{" "}
              {balance.diferencia.toLocaleString("es-PE")} kg ({balance.diferencia_pct}%) · OK: {balance.balance_ok ? "Si" : "No"}
            </Text>
          </Card>
        )}

        <Card style={{ padding: 16, marginTop: 12 }}>
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
            <Text style={{ fontSize: 14, fontWeight: "600", color: colors.text }}>Operaciones</Text>
            {orden.estado !== "FINALIZADO" && (
              <TouchableOpacity
                onPress={() => setShowOpModal(true)}
                style={{ flexDirection: "row", alignItems: "center", paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8, backgroundColor: colors.primaryLight }}
              >
                <Text style={{ fontSize: 11, color: colors.primary }}>+ Agregar</Text>
              </TouchableOpacity>
            )}
          </View>
          {(orden.operaciones ?? []).length === 0 && <Text style={{ marginTop: 6, fontSize: 12, color: colors.textMuted }}>Sin operaciones</Text>}
          {(orden.operaciones ?? []).map((op: OrdenOperacion) => (
            <View key={op.id} style={{ marginTop: 8, padding: 10, borderRadius: 10, backgroundColor: colors.background }}>
              <Text style={{ fontSize: 12, fontWeight: "500", color: colors.text }}>{op.operacion.nombre}</Text>
              <Text style={{ fontSize: 11, color: colors.textSecondary }}>
                {op.fecha} · {op.completada ? "Completada" : "Pendiente"}
                {op.operario ? ` · ${op.operario}` : ""}
              </Text>
            </View>
          ))}
        </Card>

        <Card style={{ padding: 16, marginTop: 12 }}>
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
            <Text style={{ fontSize: 14, fontWeight: "600", color: colors.text }}>Salidas</Text>
            {orden.estado !== "FINALIZADO" && (
              <TouchableOpacity
                onPress={() => setShowSalidaModal(true)}
                style={{ flexDirection: "row", alignItems: "center", paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8, backgroundColor: colors.primaryLight }}
              >
                <Text style={{ fontSize: 11, color: colors.primary }}>+ Agregar</Text>
              </TouchableOpacity>
            )}
          </View>
          {(orden.salidas ?? []).length === 0 && <Text style={{ marginTop: 6, fontSize: 12, color: colors.textMuted }}>Sin salidas</Text>}
          {(orden.salidas ?? []).map((s: OrdenSalida) => (
            <View key={s.id} style={{ marginTop: 8, padding: 10, borderRadius: 10, backgroundColor: colors.background }}>
              <Text style={{ fontSize: 12, fontWeight: "500", color: colors.text }}>
                {s.descripcion} · {s.cantidad.toLocaleString("es-PE")} {s.unidad}
              </Text>
              <Text style={{ fontSize: 11, color: colors.textSecondary }}>
                {s.tipo_salida} · destino {s.destino} · balance {s.cuenta_en_balance ? "Si" : "No"}
              </Text>
            </View>
          ))}
        </Card>

        <Card style={{ padding: 16, marginTop: 12 }}>
          <Text style={{ fontSize: 14, fontWeight: "600", color: colors.text }}>Trazabilidad</Text>

          {traz.orden_origen && (
            <View style={{ marginTop: 8, padding: 10, borderRadius: 10, backgroundColor: colors.background }}>
              <Text style={{ fontSize: 11, fontWeight: "500", color: colors.primary }}>Proviene de</Text>
              <Text style={{ marginTop: 2, fontSize: 12, color: colors.text }}>
                {traz.orden_origen.codigo} · {traz.orden_origen.producto_salida}
              </Text>
              <Text style={{ fontSize: 11, color: colors.textSecondary }}>{etapaLabels[traz.orden_origen.etapa] ?? traz.orden_origen.etapa}</Text>
            </View>
          )}

          {(traz.recepciones ?? []).map((r: any) => {
            const productor = r?.recepcion?.acopio?.detalles?.[0]?.productor;
            return (
              <View key={r.id} style={{ marginTop: 8, padding: 10, borderRadius: 10, backgroundColor: colors.background }}>
                <Text style={{ fontSize: 11, fontWeight: "500", color: colors.textSecondary }}>Recepcion</Text>
                <Text style={{ marginTop: 2, fontSize: 12, color: colors.text }}>
                  {r.recepcion?.codigo}
                  {r.recepcion?.lote_productor ? " · lote " + r.recepcion.lote_productor : ""}
                </Text>
                {r.cantidad_asignada != null && (
                  <Text style={{ fontSize: 11, color: colors.textSecondary }}>Asignado: {Number(r.cantidad_asignada).toLocaleString("es-PE")} kg</Text>
                )}
                {r.recepcion?.acopio && <Text style={{ fontSize: 11, color: colors.textSecondary }}>Acopio {r.recepcion.acopio.codigo}</Text>}
                {productor && (
                  <Text style={{ fontSize: 11, color: colors.textSecondary }}>
                    Productor: {productor.nombres} {productor.apellido_paterno} {productor.apellido_materno} · DNI {productor.dni}
                  </Text>
                )}
              </View>
            );
          })}

          {!traz.orden_origen && (traz.recepciones ?? []).length === 0 && (
            <Text style={{ marginTop: 6, fontSize: 12, color: colors.textMuted }}>Sin datos de origen</Text>
          )}

          <View style={{ marginTop: 8, padding: 10, borderRadius: 10, backgroundColor: colors.background }}>
            <Text style={{ fontSize: 11, fontWeight: "500", color: colors.textSecondary }}>Producto de esta orden</Text>
            <Text style={{ marginTop: 2, fontSize: 12, color: colors.text }}>{orden.producto_salida}</Text>
          </View>

          {(traz.ordenes_siguientes ?? []).length > 0 && (
            <View style={{ marginTop: 8 }}>
              <Text style={{ fontSize: 11, fontWeight: "600", color: colors.textMuted }}>Siguiente etapa</Text>
              {(traz.ordenes_siguientes as any[]).map((o: any) => (
                <View key={o.id} style={{ marginTop: 6, padding: 10, borderRadius: 10, backgroundColor: colors.background }}>
                  <Text style={{ fontSize: 12, color: colors.text }}>
                    {o.codigo} · {o.producto_salida}
                  </Text>
                  <Text style={{ fontSize: 11, color: colors.textSecondary }}>{etapaLabels[o.etapa] ?? o.etapa}</Text>
                </View>
              ))}
            </View>
          )}

          {(traz.salidas ?? []).length > 0 && (
            <View style={{ marginTop: 8 }}>
              <Text style={{ fontSize: 11, fontWeight: "600", color: colors.textMuted }}>Salidas al kardex</Text>
              {(traz.salidas as any[]).map((sl: any, idx: number) => (
                <View key={idx} style={{ marginTop: 6, padding: 10, borderRadius: 10, backgroundColor: colors.background }}>
                  <Text style={{ fontSize: 12, color: colors.text }}>
                    {sl.descripcion} · {Number(sl.cantidad).toLocaleString("es-PE")} {sl.unidad} · {sl.destino}
                  </Text>
                </View>
              ))}
            </View>
          )}
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

      {/* Modal: registrar operacion */}
      <Modal visible={showOpModal} transparent animationType="slide" onRequestClose={() => setShowOpModal(false)}>
        <Pressable style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.4)", justifyContent: "flex-end" }} onPress={() => setShowOpModal(false)}>
          <Pressable style={{ backgroundColor: "#FFF", borderTopLeftRadius: 16, borderTopRightRadius: 16, padding: 16 }} onPress={(e) => e.stopPropagation()}>
            <Text style={{ fontSize: 15, fontWeight: "600", color: "#111827" }}>Registrar operacion</Text>
            <Text style={{ marginTop: 12, fontSize: 11, color: "#4B5563" }}>Operacion</Text>
            <View style={{ flexDirection: "row", flexWrap: "wrap", marginTop: 4 }}>
              {catalogoOperaciones.map((o: any) => (
                <TouchableOpacity
                  key={o.id}
                  onPress={() => setOpData({ ...opData, operacion_id: o.id })}
                  style={{
                    paddingHorizontal: 10,
                    paddingVertical: 6,
                    borderRadius: 8,
                    borderWidth: 1,
                    borderColor: opData.operacion_id === o.id ? "#4F46E5" : "#D1D5DB",
                    backgroundColor: opData.operacion_id === o.id ? "#EEF2FF" : "#FFF",
                    marginRight: 6,
                    marginBottom: 6,
                  }}
                >
                  <Text style={{ fontSize: 11, color: opData.operacion_id === o.id ? "#4F46E5" : "#111827" }}>{o.nombre}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <Text style={{ marginTop: 8, fontSize: 11, color: "#4B5563" }}>Operario</Text>
            <TextInput style={inputStyle} value={opData.operario} onChangeText={(t) => setOpData({ ...opData, operario: t })} />
            <View style={{ flexDirection: "row", marginTop: 8 }}>
              <View style={{ flex: 1, marginRight: 6 }}>
                <Text style={{ fontSize: 11, color: "#4B5563" }}>Peso antes (kg)</Text>
                <TextInput keyboardType="numeric" style={inputStyle} value={opData.peso_antes} onChangeText={(t) => setOpData({ ...opData, peso_antes: t })} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 11, color: "#4B5563" }}>Peso despues (kg)</Text>
                <TextInput keyboardType="numeric" style={inputStyle} value={opData.peso_despues} onChangeText={(t) => setOpData({ ...opData, peso_despues: t })} />
              </View>
            </View>
            <View style={{ flexDirection: "row", marginTop: 8 }}>
              <View style={{ flex: 1, marginRight: 6 }}>
                <Text style={{ fontSize: 11, color: "#4B5563" }}>Humedad (%)</Text>
                <TextInput keyboardType="numeric" style={inputStyle} value={opData.humedad} onChangeText={(t) => setOpData({ ...opData, humedad: t })} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 11, color: "#4B5563" }}>Resultado</Text>
                <TextInput style={inputStyle} value={opData.resultado} onChangeText={(t) => setOpData({ ...opData, resultado: t })} />
              </View>
            </View>
            <Text style={{ marginTop: 8, fontSize: 11, color: "#4B5563" }}>Observaciones</Text>
            <TextInput style={inputStyle} value={opData.observaciones} onChangeText={(t) => setOpData({ ...opData, observaciones: t })} />
            <TouchableOpacity onPress={() => setOpData({ ...opData, completada: !opData.completada })} style={{ flexDirection: "row", alignItems: "center", marginTop: 10 }}>
              <View
                style={{
                  width: 18,
                  height: 18,
                  borderRadius: 4,
                  borderWidth: 1,
                  borderColor: "#9CA3AF",
                  backgroundColor: opData.completada ? "#4F46E5" : "#FFF",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {opData.completada && <Text style={{ color: "#FFF", fontSize: 11 }}>OK</Text>}
              </View>
              <Text style={{ marginLeft: 8, fontSize: 12, color: "#111827" }}>Completada</Text>
            </TouchableOpacity>
            <View style={{ flexDirection: "row", justifyContent: "flex-end", marginTop: 16 }}>
              <TouchableOpacity onPress={() => setShowOpModal(false)} style={{ paddingHorizontal: 14, paddingVertical: 10, borderRadius: 8, backgroundColor: "#F3F4F6", marginRight: 8 }}>
                <Text style={{ fontSize: 13, color: "#111827" }}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleAddOp} style={{ paddingHorizontal: 14, paddingVertical: 10, borderRadius: 8, backgroundColor: "#4F46E5" }}>
                <Text style={{ fontSize: 13, color: "#FFF" }}>Guardar</Text>
              </TouchableOpacity>
            </View>
          </Pressable>
        </Pressable>
      </Modal>

      {/* Modal: registrar salida */}
      <Modal visible={showSalidaModal} transparent animationType="slide" onRequestClose={() => setShowSalidaModal(false)}>
        <Pressable style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.4)", justifyContent: "flex-end" }} onPress={() => setShowSalidaModal(false)}>
          <Pressable style={{ backgroundColor: "#FFF", borderTopLeftRadius: 16, borderTopRightRadius: 16, padding: 16 }} onPress={(e) => e.stopPropagation()}>
            <Text style={{ fontSize: 15, fontWeight: "600", color: "#111827" }}>Registrar salida</Text>
            <Text style={{ marginTop: 12, fontSize: 11, color: "#4B5563" }}>Tipo de salida</Text>
            <View style={{ flexDirection: "row", flexWrap: "wrap", marginTop: 4 }}>
              {["PRODUCTO_BUENO", "MERMA", "PIEDRAS", "SAPONINA", "ENVASE", "OTRO"].map((t) => (
                <TouchableOpacity
                  key={t}
                  onPress={() => setSalData({ ...salData, tipo_salida: t })}
                  style={{
                    paddingHorizontal: 10,
                    paddingVertical: 6,
                    borderRadius: 8,
                    borderWidth: 1,
                    borderColor: salData.tipo_salida === t ? "#4F46E5" : "#D1D5DB",
                    backgroundColor: salData.tipo_salida === t ? "#EEF2FF" : "#FFF",
                    marginRight: 6,
                    marginBottom: 6,
                  }}
                >
                  <Text style={{ fontSize: 11, color: salData.tipo_salida === t ? "#4F46E5" : "#111827" }}>{t.replace("_", " ")}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <Text style={{ marginTop: 8, fontSize: 11, color: "#4B5563" }}>Descripcion</Text>
            <TextInput style={inputStyle} value={salData.descripcion} onChangeText={(t) => setSalData({ ...salData, descripcion: t })} />
            <View style={{ flexDirection: "row", marginTop: 8 }}>
              <View style={{ flex: 1, marginRight: 6 }}>
                <Text style={{ fontSize: 11, color: "#4B5563" }}>Cantidad</Text>
                <TextInput keyboardType="numeric" style={inputStyle} value={salData.cantidad} onChangeText={(t) => setSalData({ ...salData, cantidad: t })} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 11, color: "#4B5563" }}>Unidad</Text>
                <View style={{ flexDirection: "row", marginTop: 4 }}>
                  {["KG", "UNIDAD", "LT"].map((u) => (
                    <TouchableOpacity
                      key={u}
                      onPress={() => setSalData({ ...salData, unidad: u })}
                      style={{
                        paddingHorizontal: 8,
                        paddingVertical: 6,
                        borderRadius: 8,
                        borderWidth: 1,
                        borderColor: salData.unidad === u ? "#4F46E5" : "#D1D5DB",
                        backgroundColor: salData.unidad === u ? "#EEF2FF" : "#FFF",
                        marginRight: 4,
                      }}
                    >
                      <Text style={{ fontSize: 10, color: salData.unidad === u ? "#4F46E5" : "#111827" }}>{u}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </View>
            <Text style={{ marginTop: 8, fontSize: 11, color: "#4B5563" }}>Destino</Text>
            <View style={{ flexDirection: "row", flexWrap: "wrap", marginTop: 4 }}>
              {["KARDEX", "DESCARTE", "REPROCESO", "SUBPRODUCTO", "VENTA_DIRECTA"].map((d) => (
                <TouchableOpacity
                  key={d}
                  onPress={() => setSalData({ ...salData, destino: d })}
                  style={{
                    paddingHorizontal: 8,
                    paddingVertical: 6,
                    borderRadius: 8,
                    borderWidth: 1,
                    borderColor: salData.destino === d ? "#4F46E5" : "#D1D5DB",
                    backgroundColor: salData.destino === d ? "#EEF2FF" : "#FFF",
                    marginRight: 4,
                    marginBottom: 4,
                  }}
                >
                  <Text style={{ fontSize: 10, color: salData.destino === d ? "#4F46E5" : "#111827" }}>{d.replace("_", " ")}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <Text style={{ marginTop: 8, fontSize: 11, color: "#4B5563" }}>Humedad (%)</Text>
            <TextInput keyboardType="numeric" style={inputStyle} value={salData.humedad} onChangeText={(t) => setSalData({ ...salData, humedad: t })} />
            <Text style={{ marginTop: 8, fontSize: 11, color: "#4B5563" }}>Observaciones</Text>
            <TextInput style={inputStyle} value={salData.observaciones} onChangeText={(t) => setSalData({ ...salData, observaciones: t })} />
            <TouchableOpacity onPress={() => setSalData({ ...salData, cuenta_en_balance: !salData.cuenta_en_balance })} style={{ flexDirection: "row", alignItems: "center", marginTop: 10 }}>
              <View
                style={{
                  width: 18,
                  height: 18,
                  borderRadius: 4,
                  borderWidth: 1,
                  borderColor: "#9CA3AF",
                  backgroundColor: salData.cuenta_en_balance ? "#4F46E5" : "#FFF",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {salData.cuenta_en_balance && <Text style={{ color: "#FFF", fontSize: 11 }}>OK</Text>}
              </View>
              <Text style={{ marginLeft: 8, fontSize: 12, color: "#111827" }}>Cuenta en balance de masa</Text>
            </TouchableOpacity>
            <View style={{ flexDirection: "row", justifyContent: "flex-end", marginTop: 16 }}>
              <TouchableOpacity onPress={() => setShowSalidaModal(false)} style={{ paddingHorizontal: 14, paddingVertical: 10, borderRadius: 8, backgroundColor: "#F3F4F6", marginRight: 8 }}>
                <Text style={{ fontSize: 13, color: "#111827" }}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleAddSal} style={{ paddingHorizontal: 14, paddingVertical: 10, borderRadius: 8, backgroundColor: "#4F46E5" }}>
                <Text style={{ fontSize: 13, color: "#FFF" }}>Guardar</Text>
              </TouchableOpacity>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
}