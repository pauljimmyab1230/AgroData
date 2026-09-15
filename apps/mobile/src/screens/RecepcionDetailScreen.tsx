import React from "react";
import { View, Text, Alert, StyleSheet } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Pencil, Trash2 } from "lucide-react-native";
import { useQueryClient } from "@tanstack/react-query";
import { DetailScreenLayout } from "../components/layouts/DetailScreenLayout";
import { InfoRow } from "../components/ui";
import { useRecepcion } from "../hooks/useRecepciones";
import { deleteRecepcion } from "../services/recepciones";
import { getStatusConfig, getBadgeVariant } from "../utils/statusConfig";

export default function RecepcionDetailScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const id = Number(route.params?.id);
  const queryClient = useQueryClient();
  const { data, isLoading } = useRecepcion(id || null);

  const handleDelete = () => {
    Alert.alert("Eliminar", "¿Estás seguro?", [
      { text: "Cancelar", style: "cancel" },
      { text: "Eliminar", style: "destructive", onPress: async () => {
        try { await deleteRecepcion(id); queryClient.invalidateQueries({ queryKey: ["recepciones"] }); navigation.goBack(); }
        catch { Alert.alert("Error", "No se pudo eliminar"); }
      }},
    ]);
  };

  if (!data) {
    return (
      <DetailScreenLayout isLoading={isLoading} loadingText="Cargando..." title="..." notFoundText="Recepción no encontrada" />
    );
  }

  const sections: { title: string; children: React.ReactElement }[] = [
    {
      title: "Información General",
      children: (
        <>
          <InfoRow label="Código" value={data.codigo} />
          <InfoRow label="Fecha" value={data.fecha} />
          <InfoRow label="Responsable" value={data.responsable} />
          <InfoRow label="Planta" value={data.planta} />
          <InfoRow label="Lote Productor" value={data.loteProductor || "—"} />
          {data.acopioCodigo && <InfoRow label="Acopio" value={data.acopioCodigo} />}
        </>
      ),
    },
    {
      title: "Pesaje",
      children: (
        <>
          <InfoRow label="Sacos" value={String(data.sacos)} />
          <InfoRow label="Peso Campo" value={data.pesoCampo != null ? `${data.pesoCampo.toFixed(2)} kg` : "—"} />
          <InfoRow label="Peso Bruto" value={data.pesoBruto != null ? `${data.pesoBruto.toFixed(2)} kg` : "—"} />
          <InfoRow label="Tara" value={data.tara != null ? `${data.tara.toFixed(2)} kg` : "—"} />
          <InfoRow label="Peso Neto" value={data.pesoNeto != null ? `${data.pesoNeto.toFixed(2)} kg` : "—"} />
          <InfoRow label="Diferencia" value={data.diferencia != null ? `${data.diferencia.toFixed(2)} kg` : "—"} />
          <InfoRow label="Merma" value={data.merma != null ? `${data.merma.toFixed(2)}%` : "—"} />
        </>
      ),
    },
    {
      title: "Calidad",
      children: (
        <>
          <InfoRow label="Humedad" value={data.humedad != null ? `${data.humedad}%` : "—"} />
          <InfoRow label="Impurezas" value={data.impurezas != null ? `${data.impurezas}%` : "—"} />
          <InfoRow label="Materia Extraña" value={data.materiaExtrana != null ? `${data.materiaExtrana}%` : "—"} />
          <InfoRow label="Color" value={data.color || "—"} />
          <InfoRow label="Olor" value={data.olor || "—"} />
          <InfoRow label="Insectos" value={data.presenciaInsectos || "—"} />
          <InfoRow label="Estado" value={data.estado || "—"} />
          <InfoRow label="Categoría" value={data.categoria || "—"} />
          <InfoRow label="Destino" value={data.destino || "—"} />
        </>
      ),
    },
  ];

  if (data.sacosDetalle.length > 0) {
    sections.push({
      title: `Sacos (${data.sacosDetalle.length})`,
      children: (
        <>
          {data.sacosDetalle.map((saco) => (
            <View key={saco.id} style={styles.sacoRow}>
              <Text style={styles.sacoCode}>{saco.codigo}</Text>
              <Text style={styles.sacoPeso}>{saco.peso.toFixed(2)} kg</Text>
            </View>
          ))}
        </>
      ),
    });
  }

  if (data.observaciones) {
    sections.push({ title: "Observaciones", children: <InfoRow label="Observaciones" value={data.observaciones} /> });
  }

  return (
    <DetailScreenLayout
      isLoading={isLoading}
      loadingText="Cargando..."
      icon={{ char: "R", bg: "#DBEAFE", color: "#2563EB" }}
      title={data.codigo}
      subtitle={`${data.planta} · ${data.fecha}`}
      badge={data.estado ? { label: getStatusConfig(data.estado).label, variant: getBadgeVariant(data.estado) } : undefined}
      actions={[
        { label: "Editar", onPress: () => navigation.navigate("RecepcionForm", { id }), icon: Pencil },
        { label: "Eliminar", onPress: handleDelete, icon: Trash2, variant: "danger" },
      ]}
      sections={sections}
    />
  );
}

const styles = StyleSheet.create({
  sacoRow: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 6, borderBottomWidth: 1, borderBottomColor: "#F3F4F6" },
  sacoCode: { fontSize: 14, fontWeight: "500", color: "#111827" },
  sacoPeso: { fontSize: 14, color: "#6B7280" },
});
