import React from "react";
import { View, Alert } from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import type { RouteProp } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Ruler, Sprout, MapPin, Pencil, Trash2 } from "lucide-react-native";
import { useParcela } from "../hooks/useCampo";
import { deleteParcela } from "../services/campo";
import { InfoRow } from "../components/ui";
import { DetailScreenLayout } from "../components/layouts/DetailScreenLayout";
import { getStatusConfig, getBadgeVariant } from "../utils/statusConfig";
import { MapaInteractivo } from "../components/map/Mapas";
import type { CampoStackParamList } from "../navigation/types";

type DetailRouteProp = RouteProp<CampoStackParamList, "ParcelaDetail">;
type DetailNavigationProp = NativeStackNavigationProp<CampoStackParamList, "ParcelaDetail">;

export default function ParcelaDetailScreen() {
  const route = useRoute<DetailRouteProp>();
  const navigation = useNavigation<DetailNavigationProp>();
  const { id } = route.params;
  const { data: p, isLoading } = useParcela(id);

  if (!p) {
    return <DetailScreenLayout isLoading={false} notFoundText="Parcela no encontrada" title="" />;
  }

  const statusCfg = getStatusConfig(p.estado);
  const char = (p.nombre || p.codigo || "?").charAt(0);

  const mapEl = (
    <MapaInteractivo
      latitud={p.latitud ? Number(p.latitud) : null}
      longitud={p.longitud ? Number(p.longitud) : null}
      height={200}
      showLayers
    />
  );

  const handleDelete = () => {
    Alert.alert("Eliminar Parcela", `¿Eliminar ${p.nombre}?`, [
      { text: "Cancelar", style: "cancel" },
      { text: "Eliminar", style: "destructive", onPress: async () => {
        try { await deleteParcela(id); navigation.goBack(); }
        catch { Alert.alert("Error", "No se pudo eliminar"); }
      }},
    ]);
  };

  return (
    <DetailScreenLayout
      isLoading={isLoading}
      loadingText="Cargando parcela..."
      icon={{ char, bg: "#FEF9C3", color: "#CA8A04" }}
      title={p.nombre}
      subtitle={p.codigo}
      badge={{ label: statusCfg.label, variant: getBadgeVariant(p.estado) }}
      kpis={[
        { icon: Ruler, label: "Área Total", value: `${p.area} ha` },
        { icon: Sprout, label: "Cultivo", value: p.cultivo || "—" },
        { icon: MapPin, label: "Comunidad", value: p.comunidad || "—" },
      ]}
      actions={[
        { label: "Editar", onPress: () => navigation.navigate("ParcelaForm", { id }), icon: Pencil },
        { label: "Eliminar", onPress: handleDelete, icon: Trash2, variant: "danger" },
      ]}
      map={mapEl}
      sections={[
        {
          title: "Datos Generales",
          children: (
            <>
              <InfoRow label="Área" value={`${p.area} ha`} />
              <InfoRow label="Área Certificada" value={p.areaCertificada ? `${p.areaCertificada} ha` : null} />
              <InfoRow label="Cultivo Principal" value={p.cultivo} />
              <InfoRow label="Acreditación" value={p.acreditacion?.replaceAll("_", " ")} />
              <InfoRow label="Estado" value={p.estado} />
              <InfoRow label="Certificación" value={p.certificacion?.replaceAll("_", " ")} />
            </>
          ),
        },
        {
          title: "Info Agroecológica",
          children: (
            <>
              <InfoRow label="Tipo de Suelo" value={p.tipoSuelo?.replaceAll("_", " ")} />
              <InfoRow label="Textura" value={p.textura?.replaceAll("_", " ")} />
              <InfoRow label="Pendiente" value={p.pendiente?.replaceAll("_", " ")} />
              <InfoRow label="Fuente de Agua" value={p.fuenteAgua?.replaceAll("_", " ")} />
              <InfoRow label="Sistema de Riego" value={p.sistemaRiego?.replaceAll("_", " ")} />
              <InfoRow label="Zona Agroecológica" value={p.zonaAgroecologica?.replaceAll("_", " ")} />
              <InfoRow label="Disponibilidad Agua" value={p.disponibilidadAgua?.replaceAll("_", " ")} />
              {p.observaciones && <InfoRow label="Observaciones" value={p.observaciones} />}
            </>
          ),
        },
        {
          title: "Ubicación",
          children: (
            <>
              <InfoRow label="Departamento" value={p.departamento} />
              <InfoRow label="Provincia" value={p.provincia} />
              <InfoRow label="Distrito" value={p.distrito} />
              <InfoRow label="Comunidad" value={p.comunidad} />
              <InfoRow label="Centro Poblado" value={p.centroPoblado} />
              <InfoRow label="Sector" value={p.sector} />
              <InfoRow label="Coordenadas" value={p.latitud && p.longitud ? `${p.latitud}, ${p.longitud}` : null} />
              <InfoRow label="Altitud" value={p.altitud ? `${p.altitud} m` : null} />
              <InfoRow label="Precisión GPS" value={p.precisionGps} />
              {p.utmEste && <InfoRow label="UTM Este (X)" value={p.utmEste} />}
              {p.utmNorte && <InfoRow label="UTM Norte (Y)" value={p.utmNorte} />}
              {p.utmZona && <InfoRow label="Zona UTM" value={p.utmZona} />}
            </>
          ),
        },
        ...(p.areaCalculada
          ? [
              {
                title: "Métricas del Polígono",
                children: (
                  <>
                    <InfoRow label="Área Calculada" value={p.areaCalculada} />
                    <InfoRow label="Perímetro" value={p.perimetro} />
                    <InfoRow label="Vértices" value={p.vertices ? String(p.vertices) : null} />
                  </>
                ),
              },
            ]
          : []),
        ...(p.productor
          ? [
              {
                title: "Productor",
                children: (
                  <>
                    <InfoRow label="Código" value={p.productor.codigo} />
                    <InfoRow
                      label="Nombre"
                      value={`${p.productor.nombres} ${p.productor.apellidoPaterno} ${p.productor.apellidoMaterno}`}
                    />
                  </>
                ),
              },
            ]
          : []),
        ...(p.fechaLevantamiento || p.responsable
          ? [
              {
                title: "Levantamiento",
                children: (
                  <>
                    <InfoRow label="Fecha" value={p.fechaLevantamiento} />
                    <InfoRow label="Responsable" value={p.responsable} />
                  </>
                ),
              },
            ]
          : []),
      ]}
    />
  );
}
