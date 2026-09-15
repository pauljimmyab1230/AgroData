import React from "react";
import { View, Text, Alert, StyleSheet } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Trash2, Pencil } from "lucide-react-native";
import { useActividad } from "../hooks/useActividades";
import { deleteActividad, tiposActividad, estadoActividadLabels } from "../services/actividades";
import { useQueryClient } from "@tanstack/react-query";
import { DetailScreenLayout } from "../components/layouts/DetailScreenLayout";
import { InfoRow } from "../components/ui";
import { getStatusConfig, getBadgeVariant } from "../utils/statusConfig";

const formatCurrency = (amount: number): string => `S/ ${amount.toFixed(2)}`;

export default function ActividadDetailScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const id = Number(route.params?.id);
  const queryClient = useQueryClient();
  const { data: actividad, isLoading } = useActividad(id || null);

  const handleDelete = () => {
    Alert.alert("Eliminar Actividad", "¿Estás seguro de eliminar esta actividad?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Eliminar", style: "destructive",
        onPress: async () => {
          try {
            await deleteActividad(Number(id));
            queryClient.invalidateQueries({ queryKey: ["actividades"] });
            navigation.goBack();
          } catch { Alert.alert("Error", "No se pudo eliminar la actividad"); }
        },
      },
    ]);
  };

  const getTipoLabel = (value: string) => tiposActividad.find((t) => t.value === value)?.label ?? value;

  if (!actividad) {
    return (
      <DetailScreenLayout
        isLoading={isLoading}
        loadingText="Cargando actividad..."
        title="..."
        notFoundText="Actividad no encontrada"
      />
    );
  }

  const sections: { title: string; children: React.ReactElement }[] = [
    {
      title: "Información General",
      children: (
        <>
          <InfoRow label="Fecha" value={actividad.fecha} />
          <InfoRow label="Tipo" value={getTipoLabel(actividad.tipoActividad)} />
          <InfoRow label="Parcela" value={`${actividad.parcelaCodigo} - ${actividad.parcelaNombre}`} />
          <InfoRow label="Cultivo" value={`${actividad.cultivoCodigo} - ${actividad.cultivoNombre}`} />
          <InfoRow label="Responsable" value={actividad.responsableTecnico} />
          {actividad.descripcion ? <InfoRow label="Descripción" value={actividad.descripcion} /> : null}
        </>
      ),
    },
  ];

  if (actividad.insumos.length > 0) {
    sections.push({
      title: `Insumos (${actividad.insumos.length})`,
      children: (
        <>
          {actividad.insumos.map((i, idx) => (
            <View key={idx} style={styles.itemCard}>
              <Text style={styles.itemTitle}>{i.producto}</Text>
              <Text style={styles.itemSub}>{i.cantidad} {i.unidad} · {formatCurrency(i.costoTotal ?? 0)}</Text>
            </View>
          ))}
        </>
      ),
    });
  }

  if (actividad.manoObra.length > 0) {
    sections.push({
      title: `Mano de Obra (${actividad.manoObra.length})`,
      children: (
        <>
          {actividad.manoObra.map((m, idx) => (
            <View key={idx} style={styles.itemCard}>
              <Text style={styles.itemTitle}>{m.trabajador}</Text>
              <Text style={styles.itemSub}>{m.funcion} · Jornales: {m.jornales} · {formatCurrency(m.costoTotal ?? 0)}</Text>
            </View>
          ))}
        </>
      ),
    });
  }

  if (actividad.maquinaria.length > 0) {
    sections.push({
      title: `Maquinaria (${actividad.maquinaria.length})`,
      children: (
        <>
          {actividad.maquinaria.map((m, idx) => (
            <View key={idx} style={styles.itemCard}>
              <Text style={styles.itemTitle}>{m.equipo}</Text>
              <Text style={styles.itemSub}>{m.horasUso}h · {formatCurrency(m.costoTotal ?? 0)}</Text>
            </View>
          ))}
        </>
      ),
    });
  }

  sections.push({
    title: "Costos de Producción",
    children: (
      <>
        <View style={styles.costRow}><Text style={styles.costLabel}>Insumos</Text><Text style={styles.costValue}>{formatCurrency(actividad.costoTotalInsumos)}</Text></View>
        <View style={styles.costRow}><Text style={styles.costLabel}>Mano de Obra</Text><Text style={styles.costValue}>{formatCurrency(actividad.costoTotalManoObra)}</Text></View>
        <View style={styles.costRow}><Text style={styles.costLabel}>Maquinaria</Text><Text style={styles.costValue}>{formatCurrency(actividad.costoTotalMaquinaria)}</Text></View>
        <View style={[styles.costRow, styles.costTotal]}>
          <Text style={styles.costTotalLabel}>Total</Text>
          <Text style={styles.costTotalValue}>{formatCurrency(actividad.costoTotal)}</Text>
        </View>
      </>
      ),
  });

  if (actividad.observacionesTecnicas) {
    sections.push({ title: "Observaciones", children: <Text style={styles.textBlock}>{actividad.observacionesTecnicas}</Text> });
  }

  if (actividad.recomendaciones) {
    sections.push({ title: "Recomendaciones", children: <Text style={styles.textBlock}>{actividad.recomendaciones}</Text> });
  }

  return (
    <DetailScreenLayout
      isLoading={isLoading}
      loadingText="Cargando actividad..."
      icon={{ char: "A", bg: "#DBEAFE", color: "#2563EB" }}
      title={actividad.codigo}
      subtitle={`${getTipoLabel(actividad.tipoActividad)} · ${actividad.fecha}`}
      badge={{ label: getStatusConfig(actividad.estado).label, variant: getBadgeVariant(actividad.estado) }}
      actions={[
        { label: "Editar", onPress: () => navigation.navigate("ActividadForm", { id }), icon: Pencil },
        { label: "Eliminar", onPress: handleDelete, icon: Trash2, variant: "danger" },
      ]}
      sections={sections}
    />
  );
}

const styles = StyleSheet.create({
  itemCard: { paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: "#F3F4F6" },
  itemTitle: { fontSize: 14, fontWeight: "500", color: "#111827" },
  itemSub: { fontSize: 12, color: "#6B7280", marginTop: 2 },
  costRow: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 6 },
  costLabel: { fontSize: 14, color: "#6B7280" },
  costValue: { fontSize: 14, fontWeight: "500", color: "#111827" },
  costTotal: { borderTopWidth: 1, borderTopColor: "#E5E7EB", marginTop: 8, paddingTop: 12 },
  costTotalLabel: { fontSize: 16, fontWeight: "600", color: "#111827" },
  costTotalValue: { fontSize: 16, fontWeight: "700", color: "#059669" },
  textBlock: { fontSize: 14, color: "#374151", lineHeight: 20 },
});
