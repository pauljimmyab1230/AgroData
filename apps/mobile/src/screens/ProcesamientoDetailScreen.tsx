import React, { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, TextInput, Modal, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRoute, useNavigation } from "@react-navigation/native";
import { ArrowLeft, Pencil, CheckCircle2, Trash2, Link2 } from "lucide-react-native";
import { LoadingSpinner, ConfirmDialog, Card } from "../components/ui";
import { useTheme } from "../contexts/ThemeContext";
import { toast } from "../utils/toast";
import { confirmar } from "../utils/alertas";
import {
  useOrden,
  useBalance,
  useTrazabilidad,
  useFinalizarOrden,
  useAddOperacion,
  useAddSalida,
  useUpdateOperacion,
  useRemoveOperacion,
  useUpdateSalida,
  useRemoveSalida,
  useDeleteOrden,
  useOperacionesActivas,
} from "../hooks/useOrdenes";
import type { OrdenOperacion, OrdenSalida, TipoSalida, UnidadMedida, DestinoSalida } from "../services/ordenes";

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
  const [showEliminar, setShowEliminar] = useState(false);
  const [showOpModal, setShowOpModal] = useState(false);
  const [showSalidaModal, setShowSalidaModal] = useState(false);
  const [editandoSalidaId, setEditandoSalidaId] = useState<number | null>(null);
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
  const [salData, setSalData] = useState<{
    tipo_salida: TipoSalida;
    descripcion: string;
    cantidad: string;
    unidad: UnidadMedida;
    humedad: string;
    destino: DestinoSalida;
    cuenta_en_balance: boolean;
    observaciones: string;
  }>({
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
  const updateOp = useUpdateOperacion();
  const removeOp = useRemoveOperacion();
  const updateSal = useUpdateSalida();
  const removeSal = useRemoveSalida();
  const deleteOrden = useDeleteOrden();

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
    const datos = {
      tipo_salida: salData.tipo_salida,
      descripcion: salData.descripcion.trim(),
      cantidad: Number(salData.cantidad),
      unidad: salData.unidad,
      humedad: salData.humedad ? Number(salData.humedad) : null,
      destino: salData.destino,
      cuenta_en_balance: salData.cuenta_en_balance,
      observaciones: salData.observaciones || null,
    };
    try {
      if (editandoSalidaId != null) {
        await updateSal.mutateAsync({ ordenId: id, salidaId: editandoSalidaId, data: datos });
        toast.success("Salida actualizada");
      } else {
        await addSal.mutateAsync({ ordenId: id, data: datos });
        toast.success("Salida registrada");
      }
      setShowSalidaModal(false);
      setEditandoSalidaId(null);
    } catch (e: any) {
      toast.error(e?.response?.data?.error || "Error");
    }
  };

  const handleEliminarOrden = async () => {
    try {
      await deleteOrden.mutateAsync(id);
      toast.success("Orden eliminada");
      setShowEliminar(false);
      navigation.navigate("Procesamientos", { refresh: true });
    } catch (e: any) {
      toast.error(e?.response?.data?.error || "No se pudo eliminar la orden");
    }
  };

  const handleToggleOp = async (op: OrdenOperacion) => {
    try {
      await updateOp.mutateAsync({ ordenId: id, operacionOrdenId: op.id, data: { completada: !op.completada } });
    } catch (e: any) {
      toast.error(e?.response?.data?.error || "No se pudo actualizar la operacion");
    }
  };

  const handleRemoveOp = async (op: OrdenOperacion) => {
    if (!(await confirmar("Eliminar operacion", "¿Eliminar esta operacion del proceso?", "Eliminar"))) return;
    try {
      await removeOp.mutateAsync({ ordenId: id, operacionOrdenId: op.id });
      toast.success("Operacion eliminada");
    } catch (e: any) {
      toast.error(e?.response?.data?.error || "No se pudo eliminar");
    }
  };

  const handleRemoveSal = async (s: OrdenSalida) => {
    if (!(await confirmar("Eliminar salida", "¿Eliminar esta salida? Se recalculara el balance.", "Eliminar"))) return;
    try {
      await removeSal.mutateAsync({ ordenId: id, salidaId: s.id });
      toast.success("Salida eliminada");
    } catch (e: any) {
      toast.error(e?.response?.data?.error || "No se pudo eliminar");
    }
  };

  const abrirEditarSalida = (s: OrdenSalida) => {
    setEditandoSalidaId(s.id);
    setSalData({
      tipo_salida: s.tipo_salida,
      descripcion: s.descripcion,
      cantidad: String(s.cantidad),
      unidad: s.unidad,
      humedad: s.humedad != null ? String(s.humedad) : "",
      destino: s.destino,
      cuenta_en_balance: s.cuenta_en_balance,
      observaciones: s.observaciones ?? "",
    });
    setShowSalidaModal(true);
  };

  if (isLoading) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
        <LoadingSpinner text="Cargando orden..." />
      </SafeAreaView>
    );
  }

  if (!orden) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
        <View style={{ flexDirection: "row", alignItems: "center", padding: 16 }}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginRight: 12 }}>
            <ArrowLeft size={22} color={colors.text} />
          </TouchableOpacity>
          <Text style={{ fontSize: 16, fontWeight: "600", color: colors.text }}>Orden no encontrada</Text>
        </View>
      </SafeAreaView>
    );
  }

  const traz = (trazabilidad ?? {}) as any;
  const esFinalizada = orden.estado === "FINALIZADO";
  const ops = (orden.operaciones ?? []) as OrdenOperacion[];
  const opsCompletadas = ops.filter((o) => o.completada).length;
  const puedeEncadenar =
    esFinalizada &&
    orden.etapa === "PRIMARIA" &&
    (orden.salidas ?? []).some((s) => s.tipo_salida === "PRODUCTO_BUENO" && s.cuenta_en_balance);
  const mensajeFinalizar = balance
    ? `Resumen del balance de masa:\n` +
      `Entrada: ${balance.peso_entrada.toLocaleString("es-PE")} kg\n` +
      `Salidas: ${balance.suma_salidas.toLocaleString("es-PE")} kg\n` +
      `Diferencia: ${balance.diferencia.toLocaleString("es-PE")} kg (${balance.diferencia_pct}%)\n` +
      `Tolerancia permitida: ${balance.tolerancia_pct}%\n\n` +
      `¿Confirmas finalizar esta orden?`
    : "¿Confirmas finalizar esta orden de procesamiento?";

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 24 }}>
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={{ flexDirection: "row", alignItems: "center" }}>
            <ArrowLeft size={18} color={colors.text} />
            <Text style={{ marginLeft: 6, fontSize: 14, color: colors.text }}>Volver</Text>
          </TouchableOpacity>
          <View style={{ flexDirection: "row" }}>
            {puedeEncadenar && (
              <TouchableOpacity
                onPress={() => navigation.navigate("ProcesamientoForm", { orden_origen_id: orden.id })}
                style={{ flexDirection: "row", alignItems: "center", marginRight: 8, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 10, backgroundColor: colors.primaryLight }}
              >
                <Link2 size={14} color={colors.primary} />
                <Text style={{ marginLeft: 4, fontSize: 12, color: colors.primary }}>Siguiente etapa</Text>
              </TouchableOpacity>
            )}
            {!esFinalizada && (
              <>
                <TouchableOpacity
                  onPress={() => navigation.navigate("ProcesamientoForm", { id: orden.id })}
                  style={{ flexDirection: "row", alignItems: "center", marginRight: 8, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 10, backgroundColor: colors.surface }}
                >
                  <Pencil size={14} color={colors.text} />
                  <Text style={{ marginLeft: 4, fontSize: 12, color: colors.text }}>Editar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setShowEliminar(true)}
                  style={{ flexDirection: "row", alignItems: "center", marginRight: 8, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 10, backgroundColor: colors.surface }}
                >
                  <Trash2 size={14} color="#DC2626" />
                  <Text style={{ marginLeft: 4, fontSize: 12, color: "#DC2626" }}>Eliminar</Text>
                </TouchableOpacity>
                {orden.estado !== "CANCELADA" && (
                  <TouchableOpacity
                    onPress={() => setShowFinalizar(true)}
                    style={{ flexDirection: "row", alignItems: "center", paddingHorizontal: 10, paddingVertical: 6, borderRadius: 10, backgroundColor: colors.primary }}
                  >
                    <CheckCircle2 size={14} color="#FFF" />
                    <Text style={{ marginLeft: 4, fontSize: 12, color: "#FFF" }}>Finalizar</Text>
                  </TouchableOpacity>
                )}
              </>
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
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
              <Text style={{ fontSize: 14, fontWeight: "600", color: colors.text }}>Balance de masa</Text>
              <View style={{ paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8, backgroundColor: balance.balance_ok ? "#DCFCE7" : "#FEE2E2" }}>
                <Text style={{ fontSize: 11, fontWeight: "600", color: balance.balance_ok ? "#16A34A" : "#DC2626" }}>
                  {balance.balance_ok ? "OK" : "Revisar"}
                </Text>
              </View>
            </View>
            <Text style={{ marginTop: 4, fontSize: 12, color: colors.textSecondary }}>
              Entrada {balance.peso_entrada.toLocaleString("es-PE")} kg · Salidas {balance.suma_salidas.toLocaleString("es-PE")} kg · Diferencia{" "}
              {balance.diferencia.toLocaleString("es-PE")} kg ({balance.diferencia_pct}%) · Tolerancia {balance.tolerancia_pct}%
            </Text>
            {Object.keys(balance.por_tipo ?? {}).length > 0 && (
              <View style={{ marginTop: 8 }}>
                <Text style={{ fontSize: 11, fontWeight: "600", color: colors.textMuted }}>Por tipo de salida</Text>
                {Object.entries(balance.por_tipo).map(([tipo, kg]) => (
                  <Text key={tipo} style={{ marginTop: 2, fontSize: 11, color: colors.textSecondary }}>
                    {tipo.replace(/_/g, " ")}: {Number(kg).toLocaleString("es-PE")} kg
                  </Text>
                ))}
              </View>
            )}
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
                    {ops.length === 0 && <Text style={{ marginTop: 6, fontSize: 12, color: colors.textMuted }}>Sin operaciones</Text>}
          {ops.length > 0 && (
            <Text style={{ marginTop: 6, fontSize: 11, color: colors.textMuted }}>
              {opsCompletadas} de {ops.length} completados
            </Text>
          )}
          {ops.map((op: OrdenOperacion) => (
            <View key={op.id} style={{ marginTop: 8, padding: 10, borderRadius: 10, backgroundColor: colors.background, flexDirection: "row", alignItems: "center" }}>
              <TouchableOpacity disabled={esFinalizada} onPress={() => handleToggleOp(op)} style={{ marginRight: 8 }} accessibilityRole="checkbox">
                <View style={{ width: 18, height: 18, borderRadius: 4, borderWidth: 1, borderColor: op.completada ? "#16A34A" : "#9CA3AF", backgroundColor: op.completada ? "#16A34A" : "#FFF", alignItems: "center", justifyContent: "center" }}>
                  {op.completada && <Text style={{ color: "#FFF", fontSize: 10 }}>OK</Text>}
                </View>
              </TouchableOpacity>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 12, fontWeight: "500", color: colors.text }}>{op.operacion.nombre}</Text>
                <Text style={{ fontSize: 11, color: colors.textSecondary }}>
                  {op.fecha} | {op.completada ? "Completada" : "Pendiente"}
                  {op.operario ? ` | ${op.operario}` : ""}
                </Text>
              </View>
              {!esFinalizada && (
                <TouchableOpacity onPress={() => handleRemoveOp(op)} style={{ padding: 6 }}>
                  <Text style={{ fontSize: 11, color: "#DC2626" }}>Eliminar</Text>
                </TouchableOpacity>
              )}
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
            <View key={s.id} style={{ marginTop: 8, padding: 10, borderRadius: 10, backgroundColor: colors.background, flexDirection: "row", alignItems: "center" }}>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 12, fontWeight: "500", color: colors.text }}>
                  {s.descripcion} | {s.cantidad.toLocaleString("es-PE")} {s.unidad}
                </Text>
                <Text style={{ fontSize: 11, color: colors.textSecondary }}>
                  {s.tipo_salida} | destino {s.destino} | balance {s.cuenta_en_balance ? "Si" : "No"}
                </Text>
              </View>
              {!esFinalizada && (
                <>
                  <TouchableOpacity onPress={() => abrirEditarSalida(s)} style={{ padding: 6 }}>
                    <Text style={{ fontSize: 11, color: colors.primary }}>Editar</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => handleRemoveSal(s)} style={{ padding: 6 }}>
                    <Text style={{ fontSize: 11, color: "#DC2626" }}>Eliminar</Text>
                  </TouchableOpacity>
                </>
              )}
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
            const productores: any[] = [];
            const vistos = new Set<string>();
            for (const d of r?.recepcion?.acopio?.detalles ?? []) {
              const p = d?.productor;
              const claveProd = String(p?.id ?? p?.dni ?? "");
              if (p && !vistos.has(claveProd)) {
                vistos.add(claveProd);
                productores.push(p);
              }
            }
            return (
              <View key={r.id} style={{ marginTop: 8, padding: 10, borderRadius: 10, backgroundColor: colors.background }}>
                <Text style={{ fontSize: 11, fontWeight: "500", color: colors.textSecondary }}>Recepcion</Text>
                <Text style={{ marginTop: 2, fontSize: 12, color: colors.text }}>
                  {r.recepcion?.codigo}
                  {r.recepcion?.lote_productor ? " �� lote " + r.recepcion.lote_productor : ""}
                </Text>
                {r.cantidad_asignada != null && (
                  <Text style={{ fontSize: 11, color: colors.textSecondary }}>Asignado: {Number(r.cantidad_asignada).toLocaleString("es-PE")} kg</Text>
                )}
                {r.recepcion?.acopio && <Text style={{ fontSize: 11, color: colors.textSecondary }}>Acopio {r.recepcion.acopio.codigo}</Text>}
                {productores.map((p) => (
                  <Text key={String(p.id ?? p.dni)} style={{ fontSize: 11, color: colors.textSecondary }}>
                    Productor: {p.nombres} {p.apellido_paterno} {p.apellido_materno} �� DNI {p.dni}
                  </Text>
                ))}
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
        message={mensajeFinalizar}
        confirmLabel="Finalizar"
        cancelLabel="Cancelar"
        onConfirm={handleFinalizar}
        onCancel={() => setShowFinalizar(false)}
      />

      <ConfirmDialog
        visible={showEliminar}
        title="Eliminar orden"
        message="¿Eliminar esta orden de procesamiento? Esta accion no se puede deshacer."
        confirmLabel="Eliminar"
        cancelLabel="Cancelar"
        onConfirm={handleEliminarOrden}
        onCancel={() => setShowEliminar(false)}
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
      <Modal visible={showSalidaModal} transparent animationType="slide" onRequestClose={() => { setShowSalidaModal(false); setEditandoSalidaId(null); }}>
        <Pressable style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.4)", justifyContent: "flex-end" }} onPress={() => { setShowSalidaModal(false); setEditandoSalidaId(null); }}>
          <Pressable style={{ backgroundColor: "#FFF", borderTopLeftRadius: 16, borderTopRightRadius: 16, padding: 16 }} onPress={(e) => e.stopPropagation()}>
            <Text style={{ fontSize: 15, fontWeight: "600", color: "#111827" }}>{editandoSalidaId ? "Editar salida" : "Registrar salida"}</Text>
            <Text style={{ marginTop: 12, fontSize: 11, color: "#4B5563" }}>Tipo de salida</Text>
            <View style={{ flexDirection: "row", flexWrap: "wrap", marginTop: 4 }}>
              {(["PRODUCTO_BUENO", "MERMA", "PIEDRAS", "SAPONINA", "ENVASE", "OTRO"] as TipoSalida[]).map((t) => (
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
                  {(["KG", "UNIDAD", "LT"] as UnidadMedida[]).map((u) => (
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
              {(["KARDEX", "DESCARTE", "REPROCESO", "SUBPRODUCTO", "VENTA_DIRECTA"] as DestinoSalida[]).map((d) => (
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
              <TouchableOpacity onPress={() => { setShowSalidaModal(false); setEditandoSalidaId(null); }} style={{ paddingHorizontal: 14, paddingVertical: 10, borderRadius: 8, backgroundColor: "#F3F4F6", marginRight: 8 }}>
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