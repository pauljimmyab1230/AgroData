import React, { useState, useCallback, useEffect } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { ClipboardCheck, ChevronRight, Plus } from "lucide-react-native";
import { useInspecciones, useInspeccionStats } from "../hooks/useInspecciones";
import { useDebounce } from "../hooks/useDebounce";
import { useLogout } from "../hooks/useLogout";
import { useTheme } from "../contexts/ThemeContext";
import { getStatusConfig, getBadgeVariant } from "../utils/statusConfig";
import { ListScreenLayout } from "../components/layouts/ListScreenLayout";
import { Badge, LoadingSpinner } from "../components/ui";
import CustomHeader from "../components/ui/CustomHeader";
import type { Inspeccion } from "../services/inspecciones";

export default function InspeccionesScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { isDarkMode, toggleTheme } = useTheme();
  const handleLogout = useLogout();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [refreshing, setRefreshing] = useState(false);
  const debouncedSearch = useDebounce(search, 300);

  const { data, refetch } = useInspecciones({ search: debouncedSearch, page, limit: 20 });
  const { data: stats } = useInspeccionStats();

  useEffect(() => {
    if (route.params?.refresh) { refetch(); navigation.setParams({ refresh: undefined }); }
  }, [route.params?.refresh, refetch, navigation]);

  const onRefresh = useCallback(async () => { setRefreshing(true); await refetch(); setRefreshing(false); }, [refetch]);

  const inspecciones = data?.data ?? [];
  const totalPages = data?.totalPages ?? 1;

  const kpis = [
    { label: "Total", value: String(stats?.total ?? 0), hint: "inspecciones", icon: ClipboardCheck, color: "#2563EB", bg: "#DBEAFE" },
    { label: "Pendientes", value: String(stats?.pendientes ?? 0), hint: "por revisar", icon: ClipboardCheck, color: "#CA8A04", bg: "#FEF9C3" },
    { label: "Aprobadas", value: String(stats?.aprobadas ?? 0), hint: "conformes", icon: ClipboardCheck, color: "#16A34A", bg: "#DCFCE7" },
    { label: "No Conformes", value: String(stats?.noConformes ?? 0), hint: "alertas", icon: ClipboardCheck, color: "#DC2626", bg: "#FEE2E2" },
  ];

  const renderItem = (item: Inspeccion) => {
    const statusCfg = getStatusConfig(item.estado);
    return (
      <TouchableOpacity
        style={{ flexDirection: "row", alignItems: "center", backgroundColor: "#FFFFFF", borderRadius: 16, padding: 16, elevation: 2, shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2 }}
        onPress={() => navigation.navigate("InspeccionDetail", { id: item.id })}
        accessibilityLabel={`Inspección ${item.codigo}, ${item.inspector}`}
        accessibilityRole="button"
      >
        <View style={{ width: 44, height: 44, borderRadius: 12, backgroundColor: "#DBEAFE", alignItems: "center", justifyContent: "center" }}>
          <ClipboardCheck size={20} color="#2563EB" />
        </View>
        <View style={{ flex: 1, marginLeft: 12 }}>
          <Text style={{ fontSize: 14, fontWeight: "500", color: "#111827" }} numberOfLines={1}>{item.codigo}</Text>
          <Text style={{ marginTop: 2, fontSize: 12, color: "#6B7280" }}>{item.inspector} · {item.fecha}</Text>
          {item.cultivo && <Text style={{ marginTop: 2, fontSize: 11, color: "#9CA3AF" }}>Cultivo: {item.cultivo.cultivo}</Text>}
        </View>
        <Badge variant={getBadgeVariant(item.estado)}>{statusCfg.label}</Badge>
        <ChevronRight size={16} color="#9CA3AF" style={{ marginLeft: 8 }} />
      </TouchableOpacity>
    );
  };

  return (
    <ListScreenLayout
      title="Inspecciones"
      subtitle="Control de calidad orgánica"
      header={<CustomHeader userName="Juan Péruz" userRole="Administrador" isDarkMode={isDarkMode} onToggleTheme={toggleTheme} onLogout={handleLogout} />}
      onAdd={() => navigation.navigate("InspeccionForm")}
      addButtonLabel="Nueva"
      addIcon={Plus}
      kpis={kpis}
      searchPlaceholder="Buscar por código o inspector..."
      searchValue={search}
      onSearchChange={(text) => { setSearch(text); setPage(1); }}
      resultCount={data?.total ?? 0}
      resultLabel="inspecciones encontradas"
      data={inspecciones}
      renderItem={renderItem}
      keyExtractor={(item) => String(item.id)}
      onRefresh={onRefresh}
      refreshing={refreshing}
      emptyTitle="No hay inspecciones"
      emptyDescription="No se encontraron inspecciones."
      onEndReached={() => { if (page < totalPages) setPage(page + 1); }}
      ListFooterComponent={page < totalPages ? <View style={{ paddingVertical: 16 }}><LoadingSpinner text="Cargando más..." size="small" /></View> : null}
    />
  );
}
