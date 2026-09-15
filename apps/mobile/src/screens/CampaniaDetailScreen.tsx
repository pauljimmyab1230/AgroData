import React from "react";
import { Text, Alert } from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { Pencil, Trash2 } from "lucide-react-native";
import { useCampania } from "../hooks/useCampo";
import { deleteCampania } from "../services/campo";
import { InfoRow } from "../components/ui";
import { DetailScreenLayout } from "../components/layouts/DetailScreenLayout";
import { getStatusConfig, getBadgeVariant } from "../utils/statusConfig";

export default function CampaniaDetailScreen() {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const { id } = route.params;
  const { data: c, isLoading } = useCampania(id);

  if (!c) {
    return <DetailScreenLayout isLoading={false} notFoundText="Campaña no encontrada" title="" />;
  }

  const statusCfg = getStatusConfig(c.estado);
  const char = (c.nombre || "").charAt(0);

  const handleDelete = () => {
    Alert.alert("Eliminar Campaña", `¿Eliminar ${c.nombre}?`, [
      { text: "Cancelar", style: "cancel" },
      { text: "Eliminar", style: "destructive", onPress: async () => {
        try { await deleteCampania(id); navigation.goBack(); }
        catch { Alert.alert("Error", "No se pudo eliminar"); }
      }},
    ]);
  };

  return (
    <DetailScreenLayout
      isLoading={isLoading}
      loadingText="Cargando campaña..."
      icon={{ char, bg: "#DCFCE7", color: "#166534" }}
      title={c.nombre}
      subtitle={c.codigo}
      badge={{ label: statusCfg.label, variant: getBadgeVariant(c.estado) }}
      actions={[
        { label: "Editar", onPress: () => navigation.navigate("CampaniaForm", { id }), icon: Pencil },
        { label: "Eliminar", onPress: handleDelete, icon: Trash2, variant: "danger" },
      ]}
      sections={[
        {
          title: "Información General",
          children: (
            <>
              <InfoRow label="Código" value={c.codigo} />
              <InfoRow label="Año Agrícola" value={c.anio_agricola} />
              <InfoRow label="Fecha Inicio" value={c.fechaInicio} />
              <InfoRow label="Fecha Fin" value={c.fechaFin} />
              <InfoRow label="Estado" value={c.estado?.replace("_", " ")} />
            </>
          ),
        },
        {
          title: "Responsables",
          children: (
            <>
              <InfoRow label="Responsable" value={c.responsable} />
              <InfoRow label="Técnico Coordinador" value={c.tecnicoCoordinador} />
            </>
          ),
        },
        ...(c.objetivo
          ? [
              {
                title: "Objetivo",
                children: <Text style={{ fontSize: 14, color: "#374151", lineHeight: 20 }}>{c.objetivo}</Text>,
              },
            ]
          : []),
        ...(c.descripcion
          ? [
              {
                title: "Descripción",
                children: <Text style={{ fontSize: 14, color: "#374151", lineHeight: 20 }}>{c.descripcion}</Text>,
              },
            ]
          : []),
        ...(c.observaciones
          ? [
              {
                title: "Observaciones",
                children: <Text style={{ fontSize: 14, color: "#374151", lineHeight: 20 }}>{c.observaciones}</Text>,
              },
            ]
          : []),
      ]}
    />
  );
}
