import React, { useState, useCallback, useEffect } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Package, ChevronRight, Plus } from "lucide-react-native";
import { useDebounce } from "../hooks/useDebounce";
import { useTheme } from "../contexts/ThemeContext";
import { getStatusConfig } from "../utils/statusConfig";
import { ListScreenLayout } from "../components/layouts/ListScreenLayout";
import { LoadingSpinner } from "../components/ui";

export default function AcopiosScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { colors } = useTheme();
  const [search, setSearch] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const debouncedSearch = useDebounce(search, 300);

  const loadData = useCallback(async () => {
    try {
      const api = (await import("../services/api")).default;
      const res = await api.get("/acopios", { params: { search: debouncedSearch || undefined, limit: 50 } });
      setData(res.data.data ?? []);
    } catch {} finally { setLoading(false); setRefreshing(false); }
  }, [debouncedSearch]);

  useEffect(() => { loadData(); }, [loadData]);
  useEffect(() => { if (route.params?.refresh) { loadData(); navigation.setParams({ refresh: undefined }); } }, [route.params?.refresh]);

  const onRefresh = useCallback(async () => { setRefreshing(true); await loadData(); }, [loadData]);

  if (loading) {
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
      searchPlaceholder="Buscar por código..."
      searchValue={search}
      onSearchChange={setSearch}
      resultCount={data.length}
      resultLabel="acopios"
      data={data}
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
      emptyTitle="No hay acopios"
      emptyDescription="Registra un nuevo acopio de cosecha."
    />
  );
}