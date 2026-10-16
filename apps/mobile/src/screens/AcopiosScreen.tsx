import React, { useState, useCallback } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { useQuery } from "@tanstack/react-query";
import { Package, ChevronRight, Plus } from "lucide-react-native";
import { useDebounce } from "../hooks/useDebounce";
import { useTheme } from "../contexts/ThemeContext";
import { getStatusConfig } from "../utils/statusConfig";
import { ListScreenLayout } from "../components/layouts/ListScreenLayout";
import { LoadingSpinner } from "../components/ui";
import api from "../services/api";

export default function AcopiosScreen() {
  const navigation = useNavigation<any>();
  const { colors } = useTheme();
  const [search, setSearch] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const debouncedSearch = useDebounce(search, 300);

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["acopios", "lista", { search: debouncedSearch }],
    queryFn: async ({ signal }) => {
      const res = await api.get("/acopios", { params: { search: debouncedSearch || undefined, limit: 50 }, signal });
      return (res.data.data ?? []) as any[];
    },
    placeholderData: (prev) => prev,
  });

  const acopios = data ?? [];

  const onRefresh = useCallback(async () => { setRefreshing(true); await refetch(); setRefreshing(false); }, [refetch]);

  if (isLoading && !data) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
        <LoadingSpinner text="Cargando acopios..." />
      </SafeAreaView>
    );
  }

  return (
    <ListScreenLayout
      title="Acopios"
      subtitle="Registro de acopio de cosechas"
      onAdd={() => navigation.navigate("AcopioForm")}
      addButtonLabel="Nuevo"
      addIcon={Plus}
      searchPlaceholder="Buscar por c��digo..."
      searchValue={search}
      onSearchChange={setSearch}
      resultCount={acopios.length}
      resultLabel="acopios"
      data={acopios}
      renderItem={(item) => {
        const statusConfig = getStatusConfig(item.estado);
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
            onPress={() => navigation.navigate("AcopioDetail", { id: item.id })}
          >
            <View style={{
              width: 44,
              height: 44,
              borderRadius: 12,
              backgroundColor: colors.primaryLight,
              alignItems: "center",
              justifyContent: "center",
            }}>
              <Package size={20} color={colors.primary} />
            </View>
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={{ fontSize: 14, fontWeight: "500", color: colors.text }}>{item.codigo}</Text>
              <Text style={{ marginTop: 2, fontSize: 12, color: colors.textSecondary }}>{item.acopiador} · {item.fecha?.split("T")[0] ?? ""}</Text>
              <Text style={{ marginTop: 2, fontSize: 11, color: colors.textMuted }}>{item.total_sacos ?? 0} sacos · {Number(item.peso_total ?? 0).toFixed(2)} kg</Text>
            </View>
            <View style={{ backgroundColor: statusConfig.bg, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 }}>
              <Text style={{ fontSize: 11, fontWeight: "600", color: statusConfig.color }}>{item.estado}</Text>
            </View>
            <ChevronRight size={16} color={colors.textMuted} style={{ marginLeft: 8 }} />
          </TouchableOpacity>
        );
      }}
      keyExtractor={(item) => String(item.id)}
      onRefresh={onRefresh}
      refreshing={refreshing}
      emptyTitle={isError ? "Error al cargar acopios" : "No hay acopios"}
      emptyDescription={isError ? "Intenta de nuevo deslizando hacia abajo." : "Registra un nuevo acopio de cosecha."}
    />
  );
}