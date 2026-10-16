import React, { useState, useCallback, useEffect } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { CalendarDays, Plus } from "lucide-react-native";
import { useCampanias, useCampaniasStatsFromAPI } from "../hooks/useCampo";
import { ListScreenLayout } from "../components/layouts/ListScreenLayout";
import { useLogout } from "../hooks/useLogout";
import { useDebounce } from "../hooks/useDebounce";
import { getStatusConfig } from "../utils/statusConfig";
import { LoadingSpinner } from "../components/ui";
import HeaderUsuario from "../components/ui/HeaderUsuario";
import { useTheme } from "../contexts/ThemeContext";
import type { Campania } from "../services/campo";

export default function CampaniasScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [refreshing, setRefreshing] = useState(false);
  const debouncedSearch = useDebounce(search, 300);
  const { isDarkMode, toggleTheme } = useTheme();
  const handleLogout = useLogout();

  const { data, isLoading, refetch } = useCampanias({ search: debouncedSearch, page, limit: 20 });
  const { data: stats } = useCampaniasStatsFromAPI({ search: debouncedSearch });

  useEffect(() => {
    if (route.params?.refresh) { setPage(1); refetch(); navigation.setParams({ refresh: undefined }); }
  }, [route.params?.refresh, refetch, navigation]);

  const onRefresh = useCallback(async () => { setRefreshing(true); setPage(1); await refetch(); setRefreshing(false); }, [refetch]);

  const campanias = data?.data ?? [];
  const totalPages = data?.totalPages ?? 1;

  const kpis = [
    { label: "Total", value: String(stats?.total ?? 0), hint: "campañas", icon: CalendarDays, color: "#6366F1", bg: "#EEF2FF" },
    { label: "Activas", value: String(stats?.estados?.ACTIVA ?? 0), hint: "en curso", icon: CalendarDays, color: "#16A34A", bg: "#DCFCE7" },
    { label: "Planificadas", value: String(stats?.estados?.PLANIFICADA ?? 0), hint: "pendientes", icon: CalendarDays, color: "#D97706", bg: "#FEF3C7" },
    { label: "Finalizadas", value: String(stats?.estados?.FINALIZADA ?? 0), hint: "completadas", icon: CalendarDays, color: "#6B7280", bg: "#F3F4F6" },
  ];

  const renderItem = (item: Campania) => {
    const estado = getStatusConfig(item.estado);

    return (
      <TouchableOpacity
        style={{ flexDirection: "row", alignItems: "center", backgroundColor: "#FFFFFF", borderRadius: 14, padding: 14, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 4, elevation: 2 }}
        onPress={() => navigation.navigate("CampaniaDetail", { id: item.id })}
        activeOpacity={0.7}
      >
        <View style={{ width: 48, height: 48, borderRadius: 24, alignItems: "center", justifyContent: "center", backgroundColor: estado.color + "15" }}>
          <CalendarDays size={22} color={estado.color} />
        </View>
        <View style={{ flex: 1, marginLeft: 12 }}>
          <Text style={{ fontSize: 15, fontWeight: "600", color: "#111827" }} numberOfLines={1}>{item.nombre}</Text>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 4, marginTop: 3 }}>
            <Text style={{ fontSize: 12, color: "#6B7280" }}>{item.codigo}</Text>
            <Text style={{ fontSize: 12, color: "#D1D5DB" }}>·</Text>
            <Text style={{ fontSize: 12, color: "#6B7280" }}>{item.anio_agricola}</Text>
          </View>
          {item.fechaInicio && (
            <Text style={{ fontSize: 12, color: "#9CA3AF", marginTop: 3 }}>{item.fechaInicio.split("T")[0]} - {item.fechaFin?.split("T")[0] || "—"}</Text>
          )}
        </View>
        <View style={{ paddingHorizontal: 10, paddingVertical: 5, borderRadius: 8, backgroundColor: estado.bg }}>
          <Text style={{ fontSize: 11, fontWeight: "600", color: estado.color }}>{estado.label}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <ListScreenLayout
      title="Campañas"
      subtitle="Ciclos agrícolas y planificación"
      header={<HeaderUsuario isDarkMode={isDarkMode} onToggleTheme={toggleTheme} onLogout={handleLogout} />}
      onAdd={() => navigation.navigate("CampaniaForm")}
      addButtonLabel="Nueva"
      addIcon={Plus}
      kpis={kpis}
      searchPlaceholder="Buscar por nombre o código..."
      searchValue={search}
      onSearchChange={(text) => { setSearch(text); setPage(1); }}
      resultCount={data?.total ?? 0}
      resultLabel="campañas encontradas"
      data={campanias}
      renderItem={renderItem}
      keyExtractor={(item) => String(item.id)}
      onRefresh={onRefresh}
      refreshing={refreshing}
      isLoading={isLoading}
      emptyTitle="No hay campañas"
      emptyDescription="No se encontraron campañas con los filtros aplicados."
      onEndReached={() => { if (page < totalPages) setPage(page + 1); }}
      ListFooterComponent={page < totalPages && isLoading ? <View style={{ paddingVertical: 16 }}><LoadingSpinner text="Cargando m�s..." size="small" /></View> : null}
    />
  );
}
