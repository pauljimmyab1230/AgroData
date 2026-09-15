import React from "react";
import { View, Text, Alert } from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { Pencil, Trash2, CheckCircle, AlertTriangle, Clock } from "lucide-react-native";
import { useInspeccion } from "../hooks/useInspecciones";
import { deleteInspeccion } from "../services/inspecciones";
import { DetailScreenLayout } from "../components/layouts/DetailScreenLayout";
import { Badge, InfoRow } from "../components/ui";
import { getStatusConfig, getBadgeVariant } from "../utils/statusConfig";

const resultadoLabels: Record<string, string> = {
  CONFORME: "Conforme", CONFORME_CON_OBSERVACIONES: "Conforme con Observaciones", NO_CONFORME: "No Conforme",
};

const cumplimientoLabels: Record<string, string> = {
  CUMPLE: "Cumple", NO_CUMPLE: "No Cumple", NO_APLICA: "No Aplica",
};

const riesgoColors: Record<string, "green" | "yellow" | "red" | "default"> = {
  BAJO: "green", MEDIO: "yellow", ALTO: "red",
};

export default function InspeccionDetailScreen() {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const { id } = route.params;
  const { data: inspeccion, isLoading } = useInspeccion(id);

  if (!inspeccion) {
    return (
      <DetailScreenLayout
        isLoading={isLoading}
        loadingText="Cargando inspección..."
        title="..."
        notFoundText="Inspección no encontrada"
      />
    );
  }

  const checkCount = inspeccion.checklist?.length ?? 0;
  const cumpleCount = inspeccion.checklist?.filter((c) => c.cumplimiento === "CUMPLE").length ?? 0;
  const noCumpleCount = inspeccion.checklist?.filter((c) => c.cumplimiento === "NO_CUMPLE").length ?? 0;
  const porcentajeCumplimiento = checkCount > 0 ? Math.round((cumpleCount / checkCount) * 100) : 0;

  const sections: { title: string; children: React.ReactElement }[] = [
    {
      title: "Información General",
      children: (
        <>
          <InfoRow label="Código" value={inspeccion.codigo} />
          <InfoRow label="Fecha" value={inspeccion.fecha} />
          <InfoRow label="Inspector" value={inspeccion.inspector} />
          <InfoRow label="Estado" value={getStatusConfig(inspeccion.estado).label} />
          <InfoRow label="Resultado" value={inspeccion.resultado ? resultadoLabels[inspeccion.resultado] : null} />
          <InfoRow label="Riesgo General" value={inspeccion.riesgoGeneral} />
          <InfoRow label="Nivel Cumplimiento" value={inspeccion.nivelCumplimiento ? `${inspeccion.nivelCumplimiento}%` : null} />
        </>
      ),
    },
  ];

  if (inspeccion.cultivo) {
    sections.push({
      title: "Cultivo",
      children: (
        <>
          <InfoRow label="Cultivo" value={inspeccion.cultivo.cultivo} />
          <InfoRow label="Código" value={inspeccion.cultivo.codigo} />
          {inspeccion.cultivo.parcela && (
            <>
              <InfoRow label="Parcela" value={inspeccion.cultivo.parcela.nombre} />
              <InfoRow label="Productor" value={`${inspeccion.cultivo.parcela.productor.nombres} ${inspeccion.cultivo.parcela.productor.apellidoPaterno}`} />
            </>
          )}
          {inspeccion.cultivo.campania && <InfoRow label="Campaña" value={inspeccion.cultivo.campania.nombre} />}
        </>
      ),
    });
  }

  if (inspeccion.checklist && inspeccion.checklist.length > 0) {
    sections.push({
      title: `Checklist (${cumpleCount}/${checkCount} cumplidos)`,
      children: (
        <>
          {inspeccion.checklist.map((criterio, index) => (
            <View key={index} style={{ paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: "#F3F4F6" }}>
              <Text style={{ fontSize: 13, color: "#374151", marginBottom: 4 }} numberOfLines={2}>{criterio.criterio}</Text>
              <View style={{ flexDirection: "row", gap: 8 }}>
                <Badge variant={criterio.cumplimiento === "CUMPLE" ? "green" : criterio.cumplimiento === "NO_CUMPLE" ? "red" : "default"}>
                  {criterio.cumplimiento ? cumplimientoLabels[criterio.cumplimiento] ?? "Pendiente" : "Pendiente"}
                </Badge>
                {criterio.riesgo !== "BAJO" && (
                  <Badge variant={riesgoColors[criterio.riesgo] ?? "default"}>
                    Riesgo: {criterio.riesgo}
                  </Badge>
                )}
              </View>
              {criterio.observacion ? <Text style={{ fontSize: 12, color: "#6B7280", marginTop: 4, fontStyle: "italic" }}>{criterio.observacion}</Text> : null}
            </View>
          ))}
        </>
      ),
    });
  }

  if (inspeccion.noConformidades && inspeccion.noConformidades.length > 0) {
    sections.push({
      title: `No Conformidades (${inspeccion.noConformidades.length})`,
      children: (
        <>
          {inspeccion.noConformidades.map((nc, index) => (
            <View key={index} style={{ paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: "#F3F4F6" }}>
              <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                <Text style={{ fontSize: 14, fontWeight: "500", color: "#111827" }}>{nc.tipo}</Text>
                <Badge variant={nc.severidad === "CRITICA" ? "red" : nc.severidad === "MODERADA" ? "yellow" : "default"}>
                  {nc.severidad}
                </Badge>
              </View>
              <Text style={{ fontSize: 13, color: "#6B7280", marginTop: 4 }} numberOfLines={2}>{nc.descripcion}</Text>
              <Text style={{ fontSize: 12, color: "#9CA3AF", marginTop: 4 }}>Responsable: {nc.responsable}</Text>
            </View>
          ))}
        </>
      ),
    });
  }

  if (inspeccion.observaciones || inspeccion.recomendaciones || inspeccion.resumenEjecutivo) {
    sections.push({
      title: "Observaciones y Recomendaciones",
      children: (
        <>
          {inspeccion.resumenEjecutivo ? <InfoRow label="Resumen Ejecutivo" value={inspeccion.resumenEjecutivo} /> : null}
          {inspeccion.observaciones ? <InfoRow label="Observaciones" value={inspeccion.observaciones} /> : null}
          {inspeccion.comentariosProductor ? <InfoRow label="Comentarios Productor" value={inspeccion.comentariosProductor} /> : null}
          {inspeccion.recomendaciones ? <InfoRow label="Recomendaciones" value={inspeccion.recomendaciones} /> : null}
          {inspeccion.fechaProximaInspeccion ? <InfoRow label="Próxima Inspección" value={inspeccion.fechaProximaInspeccion} /> : null}
        </>
      ),
    });
  }

  const handleDelete = () => {
    Alert.alert("Eliminar Inspección", `¿Eliminar inspección ${inspeccion.codigo}?`, [
      { text: "Cancelar", style: "cancel" },
      { text: "Eliminar", style: "destructive", onPress: async () => {
        try { await deleteInspeccion(id); navigation.goBack(); }
        catch { Alert.alert("Error", "No se pudo eliminar"); }
      }},
    ]);
  };

  return (
    <DetailScreenLayout
      isLoading={isLoading}
      loadingText="Cargando inspección..."
      icon={{ char: "I", bg: "#DBEAFE", color: "#2563EB" }}
      title={inspeccion.codigo}
      subtitle={`${inspeccion.inspector} · ${inspeccion.fecha}`}
      badge={{ label: getStatusConfig(inspeccion.estado).label, variant: getBadgeVariant(inspeccion.estado) }}
      kpis={[
        { icon: CheckCircle, label: "Cumplimiento", value: `${porcentajeCumplimiento}%` },
        { icon: AlertTriangle, label: "No Conformidades", value: String(inspeccion.noConformidades?.length ?? 0) },
        { icon: Clock, label: "Criterios", value: String(checkCount) },
      ]}
      actions={[
        { label: "Editar", onPress: () => navigation.navigate("InspeccionForm", { id }), icon: Pencil },
        { label: "Eliminar", onPress: handleDelete, icon: Trash2, variant: "danger" },
      ]}
      sections={sections}
    />
  );
}
