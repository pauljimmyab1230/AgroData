import React, { useState, useCallback, useEffect } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Archive, ChevronRight, Plus, Package } from "lucide-react-native";
import { useInventario, useKardexStats } from "../hooks/useKardex";
import { useDebounce } from "../hooks/useDebounce";
import { useTheme } from "../contexts/ThemeContext";
import { ListScreenLayout } from "../components/layouts/ListScreenLayout";
import { LoadingSpinner } from "../components/ui";
import {
  kardexCategoriaLabels,
  kardexOrigenLabels,
  formatearCantidad,
  type InventarioItem,
} from "../services/kardex";
import type { KpiItem } from "../components/ui/KpiGrid";

const categoriaColors: Record<string, string> = {
  PRODUCTO_CAMPO: "#2563EB",
  PRODUCTO_PROCESADO: "#16A34A",
  SUBPRODUCTO: "#D97706",
  ENVASE: "#7C3AED",
};

export default function KardexScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { colors } = useTheme();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [refreshing, setRefreshing] = useState(false);
  const debouncedSearch = useDebounce(search, 300);

  const { data, isLoading, refetch } = useInventario({ search: debouncedSearch, page, limit: 20 });
  const { data: stats } = useKardexStats();

  useEffect(() => {
    if (route.params?.refresh) {
      setPage(1);
      refetch();
      navigation.setParams({ refresh: undefined });
    }
  }, [route.params?.refresh, refetch, navigation]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    setPage(1);
    await refetch();
    setRefreshing(false);
  }, [refetch]);

  const items = data?.data ?? [];
  const totalPages = data?.totalPages ?? 1;

  const kpis: KpiItem[] | undefined = stats
    ? [
        { icon: Package, label: "Items", value: String(stats.total_items), color: colors.info, bg: colors.infoLight },
        { icon: Archive, label: "Kg totales", value: formatearCantidad(stats.kg_totales), color: colors.primary, bg: colors.primaryLight },
        { icon: Archive, label: "Valor S/", value: formatearCantidad(stats.valor_total), color: colors.warning, bg: colors.warningLight },
      ]
    : undefined;

  const renderItem = useCallback(
    (item: InventarioItem) => {
      const bajoMinimo =
        item.cantidad_minima != null && item.cantidad_actual <= item.cantidad_minima;
      const color = categoriaColors[item.categoria] ?? colors.primary;

      return (
        <TouchableOpacity
          style={{
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: colors.surface,
            borderRadius: 16,
            padding: 16,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.05,
            shadowRadius: 2,
            elevation: 2,
          }}
          onPress={() => navigation.navigate("KardexDetail", { id: item.id })}
        >
          <View
            style={{
              width: 44,
              height: 44,
              borderRadius: 12,
              backgroundColor: color + "18",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Archive size={20} color={color} />
          </View>
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={{ fontSize: 14, fontWeight: "500", color: colors.text }} numberOfLines={1}>
              {item.producto}
            </Text>
            <Text style={{ marginTop: 2, fontSize: 12, color: colors.textSecondary }}>
              {item.codigo} · {kardexCategoriaLabels[item.categoria] ?? item.categoria}
            </Text>
            <Text style={{ marginTop: 2, fontSize: 11, color: colors.textMuted }}>
              {kardexOrigenLabels[item.origen] ?? item.origen}
              {item.ubicacion ? ` · ${item.ubicacion}` : ""}
            </Text>
          </View>
          <View style={{ alignItems: "flex-end" }}>
            <Text
              style={{
                fontSize: 15,
                fontWeight: "700",
                color: bajoMinimo ? colors.danger : colors.text,
              }}
            >
              {formatearCantidad(item.cantidad_actual)}
            </Text>
            <Text style={{ fontSize: 11, color: colors.textMuted }}>{item.unidad}</Text>
          </View>
          <ChevronRight size={16} color={colors.textMuted} style={{ marginLeft: 8 }} />
        </TouchableOpacity>
      );
    },
    [navigation, colors],
  );

  const keyExtractor = useCallback((item: InventarioItem) => String(item.id), []);

  if (isLoading && page === 1) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
        <LoadingSpinner text="Cargando inventario..." />
      </SafeAreaView>
    );
  }

  return (
    <ListScreenLayout
      title="Kardex"
      subtitle="Inventario de planta / almacén"
      kpis={kpis}
      onAdd={() => navigation.navigate("KardexForm")}
      addButtonLabel="Nuevo"
      addIcon={Plus}
      searchPlaceholder="Buscar por producto, código o ubicación..."
      searchValue={search}
      onSearchChange={(t) => {
        setSearch(t);
        setPage(1);
      }}
      resultCount={data?.total ?? 0}
      resultLabel="items"
      data={items}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      onRefresh={onRefresh}
      refreshing={refreshing}
      isLoading={isLoading}
      emptyTitle="No hay items en el inventario"
      emptyDescription="Los productos ingresan automáticamente desde recepción y procesamiento."
      onEndReached={() => {
        if (page < totalPages) setPage(page + 1);
      }}
    />
  );
}