import React, { useState, useCallback, useEffect } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Settings, ChevronRight, Plus, Package } from "lucide-react-native";
import { useOrdenes, useOrdenStats } from "../hooks/useOrdenes";
import { useDebounce } from "../hooks/useDebounce";
import { useTheme } from "../contexts/ThemeContext";
import { ListScreenLayout } from "../components/layouts/ListScreenLayout";
import { LoadingSpinner } from "../components/ui";
import type { KpiItem } from "../components/ui/KpiGrid";
import type { OrdenProcesamiento } from "../services/ordenes";

const estadoColors: Record<string, string> = {
  BORRADOR: "#6B7280",
  EN_PROCESO: "#D97706",
  FINALIZADO: "#16A34A",
  PAUSADA: "#6366F1",
  CANCELADA: "#DC2626",
};

export default function ProcesamientosScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { colors } = useTheme();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [refreshing, setRefreshing] = useState(false);
  const debouncedSearch = useDebounce(search, 300);

  const { data, isLoading, refetch } = useOrdenes({ search: debouncedSearch, page, limit: 20 });
  const { data: stats } = useOrdenStats();

  useEffect(() => {
    if (route.params?.refresh) {
      refetch();
      navigation.setParams({ refresh: undefined });
    }
  }, [route.params?.refresh, refetch, navigation]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  }, [refetch]);

  const items = data?.data ?? [];
  const totalPages = data?.totalPages ?? 1;

  const kpis: KpiItem[] | undefined = stats
    ? [
        { icon: Settings, label: "Órdenes", value: String(stats.total_ordenes), color: colors.info, bg: colors.infoLight },
        { icon: Package, label: "Kg procesados", value: String(stats.kg_procesados), color: colors.primary, bg: colors.primaryLight },
        { icon: Package, label: "Kg a kardex", value: String(stats.kg_a_kardex), color: colors.warning, bg: colors.warningLight },
      ]
    : undefined;

  const renderItem = useCallback(
    (item: OrdenProcesamiento) => {
      const color = estadoColors[item.estado] ?? colors.primary;
      return (
        <TouchableOpacity
          style={{
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: colors.surface,
            borderRadius: 16,
            padding: 16,
          }}
          onPress={() => navigation.navigate("ProcesamientoDetail", { id: item.id })}
        >
          <View style={{ width: 44, height: 44, borderRadius: 12, backgroundColor: color + "18", alignItems: "center", justifyContent: "center" }}>
            <Settings size={20} color={color} />
          </View>
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={{ fontSize: 14, fontWeight: "500", color: colors.text }}>{item.codigo}</Text>
            <Text style={{ marginTop: 2, fontSize: 12, color: colors.textSecondary }}>{item.producto_salida} · {item.etapa}</Text>
            <Text style={{ marginTop: 2, fontSize: 11, color: colors.textMuted }}>{item.estado}</Text>
          </View>
          <ChevronRight size={16} color={colors.textMuted} />
        </TouchableOpacity>
      );
    },
    [navigation, colors],
  );

  const keyExtractor = useCallback((item: OrdenProcesamiento) => String(item.id), []);

  if (isLoading && page === 1) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
        <LoadingSpinner text="Cargando órdenes..." />
      </SafeAreaView>
    );
  }

  return (
    <ListScreenLayout
      title="Procesamiento"
      subtitle="Órdenes de procesamiento"
      kpis={kpis}
      onAdd={() => navigation.navigate("ProcesamientoForm")}
      addButtonLabel="Nuevo"
      addIcon={Plus}
      searchPlaceholder="Buscar por código o producto..."
      searchValue={search}
      onSearchChange={(t) => { setSearch(t); setPage(1); }}
      resultCount={items.length}
      resultLabel="órdenes"
      data={items}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      onRefresh={onRefresh}
      refreshing={refreshing}
      emptyTitle="No hay órdenes"
      emptyDescription="Crea una nueva orden de procesamiento."
      onEndReached={() => { if (page < totalPages) setPage(page + 1); }}
    />
  );
}