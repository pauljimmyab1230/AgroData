import React from "react";
import { View, Text, Alert, StyleSheet } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Pencil, Trash2, Users } from "lucide-react-native";
import { useQueryClient, useQuery } from "@tanstack/react-query";
import { DetailScreenLayout } from "../components/layouts/DetailScreenLayout";
import { InfoRow } from "../components/ui";
import { getStatusConfig, getBadgeVariant } from "../utils/statusConfig";
import api from "../services/api";

const formatCurrency = (v: number) => `S/ ${v.toFixed(2)}`;

export default function AcopioDetailScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const id = Number(route.params?.id);
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["acopio", id],
    queryFn: async () => { const res = await api.get(`/acopios/${id}`); return res.data.data; },
    enabled: !!id,
  });

  const handleDelete = () => {
    Alert.alert("Eliminar", "¿Estás seguro?", [
      { text: "Cancelar", style: "cancel" },
      { text: "Eliminar", style: "destructive", onPress: async () => {
        try { await api.delete(`/acopios/${id}`); queryClient.invalidateQueries({ queryKey: ["acopios"] }); navigation.goBack(); }
        catch { Alert.alert("Error", "No se pudo eliminar"); }
      }},
    ]);
  };

  if (!data) {
    return (
      <DetailScreenLayout isLoading={isLoading} loadingText="Cargando..." title="..." notFoundText="Acopio no encontrado" />
    );
  }

  const detalles = data.detalles ?? [];

  const sections: { title: string; children: React.ReactElement }[] = [
    {
      title: "Información General",
      children: (
        <>
          <InfoRow label="Código" value={data.codigo} />
          <InfoRow label="Fecha" value={data.fecha?.split("T")[0]} />
          <InfoRow label="Acopiador" value={data.acopiador} />
          <InfoRow label="Vehículo" value={data.vehiculo || "—"} />
          <InfoRow label="Ruta" value={data.ruta_acopio || "—"} />
          <InfoRow label="Estado" value={getStatusConfig(data.estado).label} />
          <InfoRow label="Total Sacos" value={String(data.total_sacos ?? 0)} />
          <InfoRow label="Peso Total" value={`${Number(data.peso_total ?? 0).toFixed(2)} kg`} />
          <InfoRow label="Peso Neto" value={`${Number(data.peso_neto ?? 0).toFixed(2)} kg`} />
          {data.observaciones ? <InfoRow label="Observaciones" value={data.observaciones} /> : null}
        </>
      ),
    },
  ];

  if (detalles.length > 0) {
    sections.push({
      title: `Productores (${detalles.length})`,
      children: (
        <>
          {detalles.map((det: any, idx: number) => (
            <View key={idx} style={styles.detalleCard}>
              <Text style={styles.detalleTitle}>{det.productor?.nombres} {det.productor?.apellido_paterno}</Text>
              <Text style={styles.detalleSub}>Cultivo: {det.cultivo?.cultivo ?? "—"} · Parcela: {det.parcela?.nombre ?? "—"}</Text>
              <Text style={styles.detalleSub}>Sacos: {det.total_sacos} · Peso: {Number(det.peso_total ?? 0).toFixed(2)} kg</Text>
              {det.sacos?.length > 0 && (
                <View style={styles.sacosList}>
                  {det.sacos.map((saco: any, si: number) => (
                    <View key={si} style={styles.sacoRow}>
                      <Text style={styles.sacoCode}>{saco.codigo}</Text>
                      <Text style={styles.sacoPeso}>{Number(saco.peso ?? 0).toFixed(2)} kg</Text>
                    </View>
                  ))}
                </View>
              )}
            </View>
          ))}
        </>
      ),
    });
  }

  return (
    <DetailScreenLayout
      isLoading={isLoading}
      loadingText="Cargando..."
      icon={{ char: "A", bg: "#FEF3C7", color: "#D97706" }}
      title={data.codigo}
      subtitle={`${data.acopiador} · ${data.fecha?.split("T")[0] ?? ""}`}
      badge={data.estado ? { label: getStatusConfig(data.estado).label, variant: getBadgeVariant(data.estado) } : undefined}
      actions={[
        { label: "Editar", onPress: () => navigation.navigate("AcopioForm", { id }), icon: Pencil },
        { label: "Eliminar", onPress: handleDelete, icon: Trash2, variant: "danger" },
      ]}
      sections={sections}
    />
  );
}

const styles = StyleSheet.create({
  detalleCard: { backgroundColor: "#F9FAFB", borderRadius: 10, padding: 12, marginTop: 8 },
  detalleTitle: { fontSize: 14, fontWeight: "600", color: "#111827" },
  detalleSub: { fontSize: 12, color: "#6B7280", marginTop: 4 },
  sacosList: { marginTop: 8, paddingTop: 8, borderTopWidth: 1, borderTopColor: "#E5E7EB" },
  sacoRow: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 2 },
  sacoCode: { fontSize: 12, fontWeight: "500", color: "#111827" },
  sacoPeso: { fontSize: 12, color: "#6B7280" },
});
