import React from "react";
import { Alert } from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { Wheat, MapPin, Calendar, Pencil, Trash2 } from "lucide-react-native";
import { useCultivo } from "../hooks/useCampo";
import { deleteCultivo } from "../services/campo";
import { InfoRow } from "../components/ui";
import { DetailScreenLayout } from "../components/layouts/DetailScreenLayout";
import { getStatusConfig, getBadgeVariant } from "../utils/statusConfig";

export default function CultivoDetailScreen() {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const { id } = route.params;
  const { data: cultivo, isLoading } = useCultivo(id);

  if (!cultivo) {
    return <DetailScreenLayout isLoading={false} notFoundText="Cultivo no encontrado" title="" />;
  }

  const statusCfg = getStatusConfig(cultivo.estado);

  const handleDelete = () => {
    Alert.alert("Eliminar Cultivo", `¿Eliminar ${cultivo.cultivo}?`, [
      { text: "Cancelar", style: "cancel" },
      { text: "Eliminar", style: "destructive", onPress: async () => {
        try { await deleteCultivo(id); navigation.goBack(); }
        catch { Alert.alert("Error", "No se pudo eliminar"); }
      }},
    ]);
  };

  return (
    <DetailScreenLayout
      isLoading={isLoading}
      loadingText="Cargando cultivo..."
      icon={{ char: "W", bg: "#DCFCE7", color: "#166534" }}
      title={cultivo.cultivo}
      subtitle={cultivo.codigo}
      badge={{ label: statusCfg.label, variant: getBadgeVariant(cultivo.estado) }}
      kpis={[
        { icon: Wheat, label: "Área Sembrada", value: `${cultivo.areaSembrada ?? "—"} ha` },
        { icon: Calendar, label: "Fecha Siembra", value: cultivo.fechaSiembra ?? "—" },
        { icon: MapPin, label: "Parcela", value: cultivo.parcela?.nombre ?? "—" },
      ]}
      actions={[
        { label: "Editar", onPress: () => navigation.navigate("CultivoForm", { id }), icon: Pencil },
        { label: "Eliminar", onPress: handleDelete, icon: Trash2, variant: "danger" },
      ]}
      sections={[
        {
          title: "Información General",
          children: (
            <>
              <InfoRow label="Cultivo" value={cultivo.cultivo} />
              <InfoRow label="Variedad" value={cultivo.variedad} />
              <InfoRow label="Área Sembrada" value={cultivo.areaSembrada ? `${cultivo.areaSembrada} ha` : null} />
              <InfoRow label="Estado" value={statusCfg.label} />
              <InfoRow label="Certificación" value={cultivo.certificacion?.replace("_", " ")} />
              <InfoRow label="Observaciones" value={cultivo.observaciones} />
            </>
          ),
        },
        {
          title: "Siembra",
          children: (
            <>
              <InfoRow label="Fecha Siembra" value={cultivo.fechaSiembra} />
              <InfoRow label="Método Siembra" value={cultivo.metodoSiembra?.replace("_", " ")} />
              <InfoRow label="Sistema Productivo" value={cultivo.sistemaProductivo?.replace("_", " ")} />
              <InfoRow label="Tipo Agricultura" value={cultivo.tipoAgricultura?.replace("_", " ")} />
              <InfoRow label="Distanciamiento Surcos" value={cultivo.distanciamientoSurcos} />
              <InfoRow label="Distanciamiento Plantas" value={cultivo.distanciamientoPlantas} />
              <InfoRow label="Densidad Siembra" value={cultivo.densidadSiembra} />
            </>
          ),
        },
        {
          title: "Semilla",
          children: (
            <>
              <InfoRow label="Procedencia Semilla" value={cultivo.procedenciaSemilla?.replace("_", " ")} />
              <InfoRow
                label="Cantidad Semilla"
                value={cultivo.cantidadSemilla ? `${cultivo.cantidadSemilla} ${cultivo.unidadSemilla ?? ""}` : null}
              />
              <InfoRow label="Tipo Semilla" value={cultivo.tipoSemilla} />
              <InfoRow label="Lote Semilla" value={cultivo.loteSemilla} />
              <InfoRow label="Proveedor Semilla" value={cultivo.proveedorSemilla} />
            </>
          ),
        },
        {
          title: "Producción",
          children: (
            <>
              <InfoRow label="Fecha Cosecha" value={cultivo.fechaCosecha} />
              <InfoRow
                label="Rendimiento Esperado"
                value={cultivo.rendimientoEsperado ? `${cultivo.rendimientoEsperado} kg/ha` : null}
              />
              <InfoRow
                label="Producción Estimada"
                value={cultivo.produccionEstimada ? `${cultivo.produccionEstimada} kg` : null}
              />
              <InfoRow label="Destino Producción" value={cultivo.destinoProduccion?.replace("_", " ")} />
            </>
          ),
        },
        ...(cultivo.parcela
          ? [
              {
                title: "Parcela",
                children: (
                  <>
                    <InfoRow label="Nombre" value={cultivo.parcela.nombre} />
                    <InfoRow label="Código" value={cultivo.parcela.codigo} />
                    <InfoRow label="Área" value={cultivo.parcela.area ? `${cultivo.parcela.area} ha` : null} />
                    {cultivo.parcela.productor && (
                      <>
                        <InfoRow
                          label="Productor"
                          value={`${cultivo.parcela.productor.nombres} ${cultivo.parcela.productor.apellidoPaterno} ${cultivo.parcela.productor.apellidoMaterno}`}
                        />
                        <InfoRow label="Código Productor" value={cultivo.parcela.productor.codigo} />
                      </>
                    )}
                  </>
                ),
              },
            ]
          : []),
        ...(cultivo.campania
          ? [
              {
                title: "Campaña",
                children: (
                  <>
                    <InfoRow label="Nombre" value={cultivo.campania.nombre} />
                    <InfoRow label="Código" value={cultivo.campania.codigo} />
                  </>
                ),
              },
            ]
          : []),
      ]}
    />
  );
}
