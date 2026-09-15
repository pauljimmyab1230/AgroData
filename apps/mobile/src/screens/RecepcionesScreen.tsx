import React, { useState, useCallback, useEffect } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Truck, ChevronRight, Plus } from "lucide-react-native";
import { useRecepciones } from "../hooks/useRecepciones";
import { useDebounce } from "../hooks/useDebounce";
import { useTheme } from "../contexts/ThemeContext";
import { ListScreenLayout } from "../components/layouts/ListScreenLayout";
import { LoadingSpinner } from "../components/ui";
import type { Recepcion } from "../services/recepciones";

export default function RecepcionesScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { colors } = useTheme();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [refreshing, setRefreshing] = useState(false);
  const debouncedSearch = useDebounce(search, 300);

  const { data, isLoading, refetch } = useRecepciones({ search: debouncedSearch, page, limit: 20 });

  useEffect(() => {
    if (route.params?.refresh) { refetch(); navigation.setParams({ refresh: undefined }); }
  }, [route.params?.refresh, refetch, navigation]);

  const onRefresh = useCallback(async () => { setRefreshing(true); await refetch(); setRefreshing(false); }, [refetch]);

  const recepciones = data?.data ?? [];
  const totalPages = data?.totalPages ?? 1;

  const renderItem = useCallback((item: Recepcion) => (
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
      onPress={() => navigation.navigate("RecepcionDetail", { id: item.id })}
    >
      <View style={{
        width: 44,
        height: 44,
        borderRadius: 12,
        backgroundColor: colors.primaryLight,
        alignItems: "center",
        justifyContent: "center",
      }}>
        <Truck size={20} color={colors.primary} />
      </View>
      <View style={{ flex: 1, marginLeft: 12 }}>
        <Text style={{ fontSize: 14, fontWeight: "500", color: colors.text }} numberOfLines={1}>{item.codigo}</Text>
        <Text style={{ marginTop: 2, fontSize: 12, color: colors.textSecondary }}>{item.responsable} · {item.fecha}</Text>
        <Text style={{ marginTop: 2, fontSize: 11, color: colors.textMuted }}>{item.sacos} sacos · {item.pesoNeto != null ? `${item.pesoNeto.toFixed(2)} kg` : "—"}</Text>
      </View>
      <ChevronRight size={16} color={colors.textMuted} />
    </TouchableOpacity>
  ), [navigation, colors]);

  const keyExtractor = useCallback((item: Recepcion) => String(item.id), []);

  if (isLoading && page === 1) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
        <LoadingSpinner text="Cargando..." />
      </SafeAreaView>
    );
  }

  return (
    <ListScreenLayout
      title="Recepciones"
      subtitle="Ingreso a planta / bodega"
      onAdd={() => navigation.navigate("RecepcionForm")}
      addButtonLabel="Nueva"
      addIcon={Plus}
      searchPlaceholder="Buscar por código o responsable..."
      searchValue={search}
      onSearchChange={(t) => { setSearch(t); setPage(1); }}
      resultCount={recepciones.length}
      resultLabel="recepciones"
      data={recepciones}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      onRefresh={onRefresh}
      refreshing={refreshing}
      emptyTitle="No hay recepciones"
      emptyDescription="Registra un nuevo ingreso a planta."
      onEndReached={() => { if (page < totalPages) setPage(page + 1); }}
    />
  );
}