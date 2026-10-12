import React, { useState } from "react";
import { View, Text, Modal, TextInput, TouchableOpacity, Alert, ScrollView, StyleSheet } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Pencil, ArrowDownRight, MinusCircle, Package, TrendingUp, DollarSign, X } from "lucide-react-native";
import { DetailScreenLayout } from "../components/layouts/DetailScreenLayout";
import { InfoRow, SelectField } from "../components/ui";
import {
  useKardexItem,
  useDarDeBaja,
  useRegistrarSalida,
} from "../hooks/useKardex";
import { useDeleteKardexItem } from "../hooks/useKardex";
import { useTheme } from "../contexts/ThemeContext";
import {
  kardexCategoriaLabels,
  kardexOrigenLabels,
  kardexEtapaLabels,
  kardexTipoMovimientoLabels,
  formatearCantidad,
  type KardexMovimiento,
} from "../services/kardex";

const estadoVariant: Record<string, "green" | "yellow" | "red" | "gray"> = {
  DISPONIBLE: "green",
  CONSUMIDO: "red",
  VENCIDO: "gray",
};

const DESTINOS = ["Venta directa", "Cooperativa", "Mercado local", "Exportación", "Consumo interno", "Otro"];
const MOTIVOS_BAJA = ["Merma", "Producto dañado", "Vencido", "Pérdida", "Ajuste de inventario", "Otro"];

export default function KardexDetailScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const id = Number(route.params?.id);
  const { colors } = useTheme();
  const { data, isLoading } = useKardexItem(id || null);
  const bajaMutation = useDarDeBaja();
  const salidaMutation = useRegistrarSalida();
  const deleteMutation = useDeleteKardexItem();

  const [modal, setModal] = useState<"salida" | "baja" | null>(null);
  const [cantidad, setCantidad] = useState("");
  const [destino, setDestino] = useState("");
  const [cliente, setCliente] = useState("");
  const [responsable, setResponsable] = useState("");
  const [motivo, setMotivo] = useState("");
  const [observaciones, setObservaciones] = useState("");

  const openModal = (tipo: "salida" | "baja") => {
    setCantidad("");
    setDestino("");
    setCliente("");
    setResponsable("");
    setMotivo("");
    setObservaciones("");
    setModal(tipo);
  };

  const handleSalida = async () => {
    if (!data) return;
    const cant = Number(cantidad);
    if (!cant || cant <= 0) {
      Alert.alert("Error", "Ingresa una cantidad válida.");
      return;
    }
    if (cant > data.cantidad_actual) {
      Alert.alert("Error", "La cantidad excede el stock disponible.");
      return;
    }
    try {
      await salidaMutation.mutateAsync({
        kardex_id: data.id,
        cantidad: cant,
        destino: destino || null,
        cliente: cliente || null,
        responsable: responsable || null,
        observaciones: observaciones || null,
        fecha: new Date().toISOString(),
      });
      setModal(null);
      Alert.alert("Listo", "Salida registrada correctamente.");
    } catch (err: any) {
      Alert.alert("Error", err?.response?.data?.message || "No se pudo registrar la salida.");
    }
  };

  const handleBaja = async () => {
    if (!data) return;
    if (!motivo) {
      Alert.alert("Error", "Selecciona un motivo.");
      return;
    }
    try {
      await bajaMutation.mutateAsync({
        kardexId: data.id,
        motivo,
        cantidad: cantidad ? Number(cantidad) : undefined,
        responsable: responsable || undefined,
      });
      setModal(null);
      Alert.alert("Listo", "Baja registrada correctamente.");
    } catch (err: any) {
      Alert.alert("Error", err?.response?.data?.message || "No se pudo registrar la baja.");
    }
  };

  const handleDelete = () => {
    Alert.alert("Eliminar", "¿Estás seguro? Esta acción no se puede deshacer.", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Eliminar",
        style: "destructive",
        onPress: async () => {
          try {
            await deleteMutation.mutateAsync(id);
            navigation.goBack();
          } catch {
            Alert.alert("Error", "No se pudo eliminar.");
          }
        },
      },
    ]);
  };

  if (!data && !isLoading) {
    return (
      <DetailScreenLayout isLoading={false} title="..." notFoundText="Item no encontrado" />
    );
  }

  if (!data) {
    return <DetailScreenLayout isLoading title="..." />;
  }

  const valor = data.cantidad_actual * (data.costo_unitario ?? 0);
  const bajoMinimo = data.cantidad_minima != null && data.cantidad_actual <= data.cantidad_minima;

  const sections: { title: string; children: React.ReactElement }[] = [
    {
      title: "Información",
      children: (
        <>
          <InfoRow label="Código" value={data.codigo} />
          <InfoRow label="Categoría" value={kardexCategoriaLabels[data.categoria] ?? data.categoria} />
          <InfoRow label="Origen" value={kardexOrigenLabels[data.origen] ?? data.origen} />
          <InfoRow label="Etapa" value={data.etapa ? kardexEtapaLabels[data.etapa] ?? data.etapa : "—"} />
          <InfoRow label="Unidad" value={data.unidad} />
          <InfoRow label="Ubicación" value={data.ubicacion || "—"} />
          <InfoRow label="Stock mínimo" value={data.cantidad_minima != null ? `${formatearCantidad(data.cantidad_minima)} ${data.unidad}` : "—"} />
          <InfoRow label="Costo unitario" value={data.costo_unitario != null ? `S/ ${data.costo_unitario.toFixed(2)}` : "—"} />
          <InfoRow label="Fecha ingreso" value={data.fecha_ingreso || "—"} />
          <InfoRow label="Vencimiento" value={data.fecha_vencimiento || "—"} />
          {data.proveedor ? <InfoRow label="Proveedor" value={data.proveedor} /> : null}
        </>
      ),
    },
  ];

  return (
    <>
      <DetailScreenLayout
        isLoading={isLoading}
        loadingText="Cargando item..."
        icon={{ char: "K", bg: colors.primaryLight, color: colors.primary }}
        title={data.producto}
        subtitle={data.codigo}
        badge={{ label: data.estado, variant: estadoVariant[data.estado] ?? "gray" }}
        kpis={[
          { icon: Package, label: "Stock actual", value: `${formatearCantidad(data.cantidad_actual)} ${data.unidad}` },
          { icon: TrendingUp, label: "Mínimo", value: data.cantidad_minima != null ? formatearCantidad(data.cantidad_minima) : "—" },
          { icon: DollarSign, label: "Valor", value: `S/ ${valor.toFixed(2)}` },
        ]}
        actions={[
          { label: "Editar", onPress: () => navigation.navigate("KardexForm", { id }), icon: Pencil },
          { label: "Salida", onPress: () => openModal("salida"), icon: ArrowDownRight },
          { label: "Baja", onPress: () => openModal("baja"), icon: MinusCircle, variant: "danger" },
        ]}
        sections={sections}
      >
        <>
          <View style={st.section}>
            <View style={st.movHeader}>
              <Text style={[st.movTitle, { color: colors.text }]}>
                Movimientos ({data.movimientos.length})
              </Text>
              <TouchableOpacity onPress={handleDelete}>
                <Text style={{ color: colors.danger, fontSize: 13, fontWeight: "600" }}>Eliminar item</Text>
              </TouchableOpacity>
            </View>
            {bajoMinimo ? (
              <Text style={[st.alert, { color: colors.danger }]}>
                ⚠ Stock por debajo del mínimo
              </Text>
            ) : null}
            {data.movimientos.length === 0 ? (
              <Text style={{ color: colors.textMuted, fontSize: 13, paddingVertical: 8 }}>
                Sin movimientos registrados.
              </Text>
            ) : (
              data.movimientos.map((m) => <MovimientoRow key={m.id} mov={m} />)
            )}
          </View>
        </>
      </DetailScreenLayout>

      <Modal visible={modal !== null} transparent animationType="slide" onRequestClose={() => setModal(null)}>
        <View style={st.overlay}>
          <View style={[st.sheet, { backgroundColor: colors.surface }]}>
            <View style={st.sheetHeader}>
              <Text style={[st.sheetTitle, { color: colors.text }]}>
                {modal === "salida" ? "Registrar salida" : "Dar de baja"}
              </Text>
              <TouchableOpacity onPress={() => setModal(null)}>
                <X size={20} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>
            <ScrollView keyboardShouldPersistTaps="handled">
              <Text style={[st.stockInfo, { color: colors.textSecondary }]}>
                Stock disponible: {formatearCantidad(data.cantidad_actual)} {data.unidad}
              </Text>

              <Text style={[st.label, { color: colors.text }]}>Cantidad ({data.unidad})</Text>
              <TextInput
                style={[st.input, { borderColor: colors.disabled, color: colors.text, backgroundColor: colors.surface }]}
                value={cantidad}
                onChangeText={setCantidad}
                keyboardType="decimal-pad"
                placeholder="0.00"
                placeholderTextColor={colors.placeholder}
              />

              {modal === "salida" ? (
                <>
                  <SelectField label="Destino" value={destino} options={DESTINOS} onSelect={setDestino} placeholder="Selecciona destino" />
                  <Text style={[st.label, { color: colors.text }]}>Cliente / Destinatario</Text>
                  <TextInput
                    style={[st.input, { borderColor: colors.disabled, color: colors.text, backgroundColor: colors.surface }]}
                    value={cliente}
                    onChangeText={setCliente}
                    placeholder="Opcional"
                    placeholderTextColor={colors.placeholder}
                  />
                </>
              ) : (
                <SelectField label="Motivo" value={motivo} options={MOTIVOS_BAJA} onSelect={setMotivo} placeholder="Selecciona motivo" />
              )}

              <Text style={[st.label, { color: colors.text }]}>Responsable</Text>
              <TextInput
                style={[st.input, { borderColor: colors.disabled, color: colors.text, backgroundColor: colors.surface }]}
                value={responsable}
                onChangeText={setResponsable}
                placeholder="Opcional"
                placeholderTextColor={colors.placeholder}
              />

              <Text style={[st.label, { color: colors.text }]}>Observaciones</Text>
              <TextInput
                style={[st.input, st.textarea, { borderColor: colors.disabled, color: colors.text, backgroundColor: colors.surface }]}
                value={observaciones}
                onChangeText={setObservaciones}
                placeholder="Opcional"
                placeholderTextColor={colors.placeholder}
                multiline
              />

              <TouchableOpacity
                style={[
                  st.submit,
                  { backgroundColor: modal === "salida" ? colors.primary : colors.danger },
                ]}
                onPress={modal === "salida" ? handleSalida : handleBaja}
                disabled={modal === "salida" ? salidaMutation.isPending : bajaMutation.isPending}
              >
                <Text style={st.submitText}>
                  {modal === "salida"
                    ? salidaMutation.isPending
                      ? "Registrando..."
                      : "Registrar salida"
                    : bajaMutation.isPending
                      ? "Registrando..."
                      : "Dar de baja"}
                </Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </>
  );
}

function MovimientoRow({ mov }: { mov: KardexMovimiento }) {
  const { colors } = useTheme();
  const esEntrada = mov.tipo === "ENTRADA" || mov.tipo === "INGRESO";
  const color = esEntrada ? colors.success : mov.tipo === "BAJA" ? colors.warning : colors.danger;
  const detalle = mov.destino || mov.referencia || mov.observaciones || "—";

  return (
    <View style={[st.movRow, { borderBottomColor: colors.divider }]}>
      <View style={{ flex: 1 }}>
        <Text style={[st.movTipo, { color }]}>
          {kardexTipoMovimientoLabels[mov.tipo] ?? mov.tipo}
        </Text>
        <Text style={{ fontSize: 12, color: colors.textSecondary }} numberOfLines={1}>
          {String(mov.fecha).split("T")[0]} · {detalle}
        </Text>
      </View>
      <View style={{ alignItems: "flex-end" }}>
        <Text style={[st.movCant, { color }]}>
          {esEntrada ? "+" : "-"}
          {formatearCantidad(mov.cantidad)}
        </Text>
        <Text style={{ fontSize: 11, color: colors.textMuted }}>
          saldo {formatearCantidad(mov.saldo_posterior)}
        </Text>
      </View>
    </View>
  );
}

const st = StyleSheet.create({
  section: { marginTop: 16, paddingHorizontal: 16 },
  movHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 8 },
  movTitle: { fontSize: 16, fontWeight: "600" },
  alert: { fontSize: 13, fontWeight: "600", marginBottom: 8 },
  movRow: { flexDirection: "row", alignItems: "center", paddingVertical: 10, borderBottomWidth: 1 },
  movTipo: { fontSize: 14, fontWeight: "600" },
  movCant: { fontSize: 14, fontWeight: "700" },
  overlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "flex-end" },
  sheet: { borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 20, maxHeight: "85%" },
  sheetHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12 },
  sheetTitle: { fontSize: 18, fontWeight: "700" },
  stockInfo: { fontSize: 13, marginBottom: 12 },
  label: { fontSize: 13, fontWeight: "500", marginBottom: 4, marginTop: 8 },
  input: { borderWidth: 1, borderRadius: 10, paddingHorizontal: 14, paddingVertical: 12, fontSize: 14 },
  textarea: { height: 70, textAlignVertical: "top" },
  submit: { borderRadius: 12, paddingVertical: 14, alignItems: "center", marginTop: 16, marginBottom: 8 },
  submitText: { color: "#FFF", fontSize: 15, fontWeight: "700" },
});