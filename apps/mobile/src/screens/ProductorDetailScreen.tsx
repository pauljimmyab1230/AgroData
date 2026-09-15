import React from "react";
import { Text, View, Alert } from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { Users, Pencil, Trash2 } from "lucide-react-native";
import { useProductor } from "../hooks/useProductores";
import { deleteProductor } from "../services/productores";
import { InfoRow } from "../components/ui";
import { DetailScreenLayout } from "../components/layouts/DetailScreenLayout";
import { getStatusConfig, getBadgeVariant } from "../utils/statusConfig";

export default function ProductorDetailScreen() {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const { id } = route.params;
  const { data: productor, isLoading } = useProductor(id);

  if (!productor) {
    return (
      <DetailScreenLayout
        isLoading={false}
        notFoundText="Productor no encontrado"
        title=""
      />
    );
  }

  const statusCfg = getStatusConfig(productor.estado);
  const initials = `${(productor.nombres || "").charAt(0)}${(productor.apellidoPaterno || "").charAt(0)}`;

  const handleDelete = () => {
    Alert.alert("Eliminar Productor", `¿Eliminar a ${productor.nombres}?`, [
      { text: "Cancelar", style: "cancel" },
      { text: "Eliminar", style: "destructive", onPress: async () => {
        try { await deleteProductor(id); navigation.goBack(); }
        catch { Alert.alert("Error", "No se pudo eliminar"); }
      }},
    ]);
  };

  return (
    <DetailScreenLayout
      isLoading={isLoading}
      loadingText="Cargando productor..."
      icon={{ char: initials, bg: "#DCFCE7", color: "#166534" }}
      title={`${productor.nombres} ${productor.apellidoPaterno} ${productor.apellidoMaterno}`}
      subtitle={`${productor.codigo} · ${productor.cargo}`}
      badge={{ label: statusCfg.label, variant: getBadgeVariant(productor.estado) }}
      actions={[
        { label: "Editar", onPress: () => navigation.navigate("ProductorEdit", { id }), icon: Pencil },
        { label: "Eliminar", onPress: handleDelete, icon: Trash2, variant: "danger" },
      ]}
      sections={[
        {
          title: "Datos Personales",
          children: (
            <>
              <InfoRow label="DNI" value={productor.dni} />
              <InfoRow label="Sexo" value={productor.sexo} />
              <InfoRow label="Fecha Nacimiento" value={productor.fechaNacimiento} />
              <InfoRow label="Estado Civil" value={productor.estadoCivil} />
              <InfoRow label="Teléfono" value={productor.telefono} />
              <InfoRow label="Correo" value={productor.correo} />
              <InfoRow label="Nivel Educativo" value={productor.nivelEducativo} />
            </>
          ),
        },
        {
          title: "Ubicación",
          children: (
            <>
              <InfoRow label="Departamento" value={productor.departamento} />
              <InfoRow label="Provincia" value={productor.provincia} />
              <InfoRow label="Distrito" value={productor.distrito} />
              <InfoRow label="Comunidad" value={productor.comunidad} />
              <InfoRow label="Dirección" value={productor.direccion} />
            </>
          ),
        },
        {
          title: "Info Adicional",
          children: (
            <>
              <InfoRow label="Organización" value={productor.organizacion} />
              <InfoRow label="Cargo" value={productor.cargo} />
              <InfoRow label="Idioma Principal" value={productor.idiomaPrincipal} />
              <InfoRow label="Fecha Ingreso" value={productor.fechaIngreso} />
            </>
          ),
        },
      ]}
    >
      <View style={{ marginTop: 16, paddingHorizontal: 16 }}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#DCFCE7",
            paddingVertical: 14,
            borderRadius: 10,
            gap: 8,
          }}
          accessibilityRole="button"
        >
          <Users size={20} color="#166534" />
          <Text
            style={{ fontSize: 15, fontWeight: "600", color: "#166534" }}
            onPress={() =>
              navigation.navigate("Familiares", {
                productorId: productor.id,
                productorNombre: `${productor.nombres} ${productor.apellidoPaterno}`,
              })
            }
          >
            Ver Familiares
          </Text>
        </View>
      </View>
    </DetailScreenLayout>
  );
}
