import React, { useState, useCallback, useEffect } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Wrench, Plus, Clock, Play, CheckCircle } from "lucide-react-native";
import { useActividades } from "../hooks/useActividades";
import { useDebounce } from "../hooks/useDebounce";
import { useLogout } from "../hooks/useLogout";
import { useTheme } from "../contexts/ThemeContext";
import { getStatusConfig, getBadgeVariant } from "../utils/statusConfig";
import { tiposActividad, type Actividad } from "../services/actividades";
import { ListScreenLayout } from "../components/layouts/ListScreenLayout";
import { Badge, LoadingSpinner } from "../components/ui";
import CustomHeader from "../components/ui/CustomHeader";

export default function ActividadesScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { isDarkMode, toggleTheme } = useTheme();
  const handleLogout = useLogout();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [refreshing, setRefreshing] = useState(false);
  const debouncedSearch = useDebounce(search, 300);

  const { data, refetch } = useActividades({ search: debouncedSearch, page, limit: 20 });

  useEffect(() => {
    if (route.params?.refresh) { refetch(); navigation.setParams({ refresh: undefined }); }
  }, [route.params?.refresh, refetch, navigation]);

  const onRefresh = useCallback(async () => { setRefreshing(true); await refetch(); setRefreshing(false); }, [refetch]);

  const actividades = data?.data ?? [];
  const totalPages = data?.totalPages ?? 1;

  const totalProgramadas = actividades.filter((a) => a.estado === "PROGRAMADA").length;
  const totalEnProceso = actividades.filter((a) => a.estado === "EN_PROCESO").length;
  const totalCompletadas = actividades.filter((a) => a.estado === "COMPLETADA").length;

  const kpis = [
    { label: "Total", value: String(data?.total ?? 0), hint: "actividades", icon: Wrench, color: "#059669", bg: "#ECFDF5" },
    { label: "Programadas", value: String(totalProgramadas), hint: "pendientes", icon: Clock, color: "#D97706", bg: "#FEF3C7" },
    { label: "En Proceso", value: String(totalEnProceso), hint: "ejecutando", icon: Play, color: "#2563EB", bg: "#DBEAFE" },
    { label: "Completadas", value: String(totalCompletadas), hint: "finalizadas", icon: CheckCircle, color: "#16A34A", bg: "#DCFCE7" },
  ];

  const getTipoLabel = (value: string) => tiposActividad.find((t) => t.value === value)?.label ?? value;

  const renderItem = (item: Actividad) => {
    const statusCfg = getStatusConfig(item.estado);
    return (
      <TouchableOpacity
        style={{ flexDirection: "row", alignItems: "center", backgroundColor: "#FFFFFF", borderRadius: 14, padding: 14, elevation: 2, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 4 }}
        onPress={() => navigation.navigate("ActividadDetail", { id: item.id })}
        activeOpacity={0.7}
      >
        <View style={{ width: 48, height: 48, borderRadius: 24, backgroundColor: statusCfg.bg, alignItems: "center", justifyContent: "center" }}>
          <Wrench size={22} color={statusCfg.color} />
        </View>
        <View style={{ flex: 1, marginLeft: 12 }}>
          <Text style={{ fontSize: 15, fontWeight: "600", color: "#111827" }} numberOfLines={1}>{item.codigo}</Text>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 4, marginTop: 3 }}>
            <Text style={{ fontSize: 12, color: "#6B7280" }}>{getTipoLabel(item.tipoActividad)}</Text>
            <Text style={{ fontSize: 12, color: "#D1D5DB" }}>·</Text>
            <Text style={{ fontSize: 12, color: "#6B7280" }}>{item.fecha}</Text>
          </View>
          {item.parcelaNombre && <Text style={{ fontSize: 12, color: "#9CA3AF", marginTop: 3 }}>{item.parcelaNombre} · {item.cultivoNombre}</Text>}
        </View>
        <Badge variant={getBadgeVariant(item.estado)}>{statusCfg.label}</Badge>
      </TouchableOpacity>
    );
  };

  return (
    <ListScreenLayout
      title="Bitácora"
      subtitle="Registro de actividades del campo"
      header={<CustomHeader userName="Juan Péruz" userRole="Administrador" isDarkMode={isDarkMode} onToggleTheme={toggleTheme} onLogout={handleLogout} />}
      onAdd={() => navigation.navigate("ActividadForm")}
      addButtonLabel="Nueva"
      addIcon={Plus}
      kpis={kpis}
      searchPlaceholder="Buscar por código o tipo..."
      searchValue={search}
      onSearchChange={(text) => { setSearch(text); setPage(1); }}
      resultCount={data?.total ?? 0}
      resultLabel="actividades encontradas"
      data={actividades}
      renderItem={renderItem}
      keyExtractor={(item) => String(item.id)}
      onRefresh={onRefresh}
      refreshing={refreshing}
      emptyTitle="No hay actividades"
      emptyDescription="Registra una nueva actividad en la bitácora."
      onEndReached={() => { if (page < totalPages) setPage(page + 1); }}
      ListFooterComponent={page < totalPages ? <View style={{ paddingVertical: 16 }}><LoadingSpinner text="Cargando más..." size="small" /></View> : null}
    />
  );
}
