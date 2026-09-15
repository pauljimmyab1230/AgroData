import React, { useState, useCallback, useEffect } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { MapPin, Plus, Ruler, Sprout } from "lucide-react-native";
import { useParcelas, useParcelasStatsLocal } from "../hooks/useCampo";
import { ListScreenLayout } from "../components/layouts/ListScreenLayout";
import { useLogout } from "../hooks/useLogout";
import { useDebounce } from "../hooks/useDebounce";
import { getStatusConfig } from "../utils/statusConfig";
import CustomHeader from "../components/ui/CustomHeader";
import { useTheme } from "../contexts/ThemeContext";
import type { Parcela } from "../services/campo";

export default function ParcelasScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [refreshing, setRefreshing] = useState(false);
  const debouncedSearch = useDebounce(search, 300);
  const { isDarkMode, toggleTheme } = useTheme();
  const handleLogout = useLogout();

  const { data, isLoading, refetch } = useParcelas({ search: debouncedSearch, page, limit: 20 });
  const stats = useParcelasStatsLocal(data?.data);

  useEffect(() => {
    if (route.params?.refresh) { refetch(); navigation.setParams({ refresh: undefined }); }
  }, [route.params?.refresh, refetch, navigation]);

  const onRefresh = useCallback(async () => { setRefreshing(true); await refetch(); setRefreshing(false); }, [refetch]);

  const parcelas = data?.data ?? [];
  const totalPages = data?.totalPages ?? 1;

  const kpis = [
    { label: "Total", value: String(stats.total), hint: "parcelas", icon: MapPin, color: "#F59E0B", bg: "#FFFBEB" },
    { label: "Hectáreas", value: stats.hectareas.toFixed(1), hint: "ha totales", icon: Ruler, color: "#10B981", bg: "#ECFDF5" },
    { label: "Activas", value: String(stats.activas), hint: "en uso", icon: MapPin, color: "#16A34A", bg: "#DCFCE7" },
    { label: "Con Polígono", value: String(stats.conPoligono), hint: "georeferenciadas", icon: Sprout, color: "#6366F1", bg: "#EEF2FF" },
  ];

  const renderItem = (item: Parcela) => {
    const estado = getStatusConfig(item.estado);

    return (
      <TouchableOpacity
        style={{ flexDirection: "row", alignItems: "center", backgroundColor: "#FFFFFF", borderRadius: 14, padding: 14, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 4, elevation: 2 }}
        onPress={() => navigation.navigate("ParcelaDetail", { id: item.id })}
        activeOpacity={0.7}
      >
        <View style={{ width: 48, height: 48, borderRadius: 24, alignItems: "center", justifyContent: "center", backgroundColor: estado.color + "15" }}>
          <MapPin size={22} color={estado.color} />
        </View>
        <View style={{ flex: 1, marginLeft: 12 }}>
          <Text style={{ fontSize: 15, fontWeight: "600", color: "#111827" }} numberOfLines={1}>{item.nombre}</Text>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 4, marginTop: 3 }}>
            <Text style={{ fontSize: 12, color: "#6B7280" }}>{item.codigo}</Text>
            <Text style={{ fontSize: 12, color: "#D1D5DB" }}>·</Text>
            <Text style={{ fontSize: 12, color: "#6B7280" }}>{item.area} ha</Text>
          </View>
          {item.productor && (
            <Text style={{ fontSize: 12, color: "#9CA3AF", marginTop: 3 }}>{item.productor.nombres} {item.productor.apellidoPaterno}</Text>
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
      title="Parcelas"
      subtitle="Gestión de parcelas agrícolas"
      header={<CustomHeader userName="Juan Péruz" userRole="Administrador" isDarkMode={isDarkMode} onToggleTheme={toggleTheme} onLogout={handleLogout} />}
      onAdd={() => navigation.navigate("ParcelaForm")}
      addButtonLabel="Nueva"
      addIcon={Plus}
      kpis={kpis}
      searchPlaceholder="Buscar por nombre, código o productor..."
      searchValue={search}
      onSearchChange={(text) => { setSearch(text); setPage(1); }}
      resultCount={data?.total ?? 0}
      resultLabel="parcelas encontradas"
      data={parcelas}
      renderItem={renderItem}
      keyExtractor={(item) => String(item.id)}
      onRefresh={onRefresh}
      refreshing={refreshing}
      emptyTitle="No hay parcelas"
      emptyDescription="No se encontraron parcelas con los filtros aplicados."
      onEndReached={() => { if (page < totalPages) setPage(page + 1); }}
      ListFooterComponent={page < totalPages ? undefined : null}
    />
  );
}
