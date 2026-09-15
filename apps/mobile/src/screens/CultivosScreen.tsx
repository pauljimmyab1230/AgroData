import React, { useState, useCallback, useEffect } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Wheat, ChevronRight, Sprout, TreeDeciduous, AlertTriangle, Plus } from "lucide-react-native";
import { useCultivos, useCultivoStats } from "../hooks/useCampo";
import { useDebounce } from "../hooks/useDebounce";
import { useLogout } from "../hooks/useLogout";
import { useTheme } from "../contexts/ThemeContext";
import { getStatusConfig, getBadgeVariant } from "../utils/statusConfig";
import { ListScreenLayout } from "../components/layouts/ListScreenLayout";
import { Badge, LoadingSpinner } from "../components/ui";
import CustomHeader from "../components/ui/CustomHeader";
import type { Cultivo } from "../services/campo";

export default function CultivosScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { isDarkMode, toggleTheme } = useTheme();
  const handleLogout = useLogout();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [refreshing, setRefreshing] = useState(false);
  const debouncedSearch = useDebounce(search, 300);

  const { data, refetch } = useCultivos({ search: debouncedSearch, page, limit: 20 });
  const { data: stats } = useCultivoStats();

  useEffect(() => {
    if (route.params?.refresh) { refetch(); navigation.setParams({ refresh: undefined }); }
  }, [route.params?.refresh, refetch, navigation]);

  const onRefresh = useCallback(async () => { setRefreshing(true); await refetch(); setRefreshing(false); }, [refetch]);

  const cultivos = data?.data ?? [];
  const totalPages = data?.totalPages ?? 1;

  const kpis = [
    { label: "Total", value: String(stats?.total ?? 0), hint: "cultivos", icon: Wheat, color: "#CA8A04", bg: "#FEF9C3" },
    { label: "En Crecimiento", value: String(stats?.estados?.EN_CRECIMIENTO ?? 0), hint: "activos", icon: Sprout, color: "#16A34A", bg: "#DCFCE7" },
    { label: "Cosechados", value: String(stats?.estados?.COSECHADO ?? 0), hint: "finalizados", icon: TreeDeciduous, color: "#2563EB", bg: "#DBEAFE" },
    { label: "Perdidos", value: String(stats?.estados?.PERDIDO ?? 0), hint: "alerta", icon: AlertTriangle, color: "#DC2626", bg: "#FEE2E2" },
  ];

  const renderItem = (item: Cultivo) => {
    const statusCfg = getStatusConfig(item.estado);
    return (
      <TouchableOpacity
        style={{ flexDirection: "row", alignItems: "center", backgroundColor: "#FFFFFF", borderRadius: 16, padding: 16, elevation: 2, shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2 }}
        onPress={() => navigation.navigate("CultivoDetail", { id: item.id })}
        accessibilityLabel={`Cultivo ${item.cultivo}, ${item.codigo}`}
        accessibilityRole="button"
      >
        <View style={{ width: 44, height: 44, borderRadius: 12, backgroundColor: "#DCFCE7", alignItems: "center", justifyContent: "center" }}>
          <Wheat size={20} color="#166534" />
        </View>
        <View style={{ flex: 1, marginLeft: 12 }}>
          <Text style={{ fontSize: 14, fontWeight: "500", color: "#111827" }} numberOfLines={1}>{item.cultivo}</Text>
          <Text style={{ marginTop: 2, fontSize: 12, color: "#6B7280" }}>{item.codigo} · {item.variedad ?? "Sin variedad"}</Text>
          {item.parcela && <Text style={{ marginTop: 2, fontSize: 11, color: "#9CA3AF" }}>Parcela: {item.parcela.nombre}</Text>}
          {item.campania && <Text style={{ marginTop: 2, fontSize: 11, color: "#9CA3AF" }}>Campaña: {item.campania.nombre}</Text>}
        </View>
        <Badge variant={getBadgeVariant(item.estado)}>{statusCfg.label}</Badge>
        <ChevronRight size={16} color="#9CA3AF" style={{ marginLeft: 8 }} />
      </TouchableOpacity>
    );
  };

  return (
    <ListScreenLayout
      title="Cultivos"
      subtitle="Gestión de cultivos agrícolas"
      header={<CustomHeader userName="Juan Péruz" userRole="Administrador" isDarkMode={isDarkMode} onToggleTheme={toggleTheme} onLogout={handleLogout} />}
      onAdd={() => navigation.navigate("CultivoForm")}
      addButtonLabel="Nuevo"
      addIcon={Plus}
      kpis={kpis}
      searchPlaceholder="Buscar por código o nombre..."
      searchValue={search}
      onSearchChange={(text) => { setSearch(text); setPage(1); }}
      resultCount={data?.total ?? 0}
      resultLabel="cultivos encontrados"
      data={cultivos}
      renderItem={renderItem}
      keyExtractor={(item) => String(item.id)}
      onRefresh={onRefresh}
      refreshing={refreshing}
      emptyTitle="No hay cultivos"
      emptyDescription="No se encontraron cultivos con los filtros aplicados."
      onEndReached={() => { if (page < totalPages) setPage(page + 1); }}
      ListFooterComponent={page < totalPages ? <View style={{ paddingVertical: 16 }}><LoadingSpinner text="Cargando más..." size="small" /></View> : null}
    />
  );
}
