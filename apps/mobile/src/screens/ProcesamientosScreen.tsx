import React, { useState, useCallback, useEffect } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Settings, ChevronRight, Plus, Package, Clock } from "lucide-react-native";
import { useOrdenes, useOrdenStats } from "../hooks/useOrdenes";
import { useDebounce } from "../hooks/useDebounce";
import { useTheme } from "../contexts/ThemeContext";
import { ListScreenLayout } from "../components/layouts/ListScreenLayout";
import { LoadingSpinner } from "../components/ui";
import type { KpiItem } from "../components/ui/KpiGrid";
import type { OrdenProcesamiento, EstadoOrden, EtapaProceso } from "../services/ordenes";

const estadoColors: Record<string, string> = {
  BORRADOR: "#6B7280",
  EN_PROCESO: "#D97706",
  FINALIZADO: "#16A34A",
  PAUSADA: "#6366F1",
  CANCELADA: "#DC2626",
};

const estadoLabels: Record<string, string> = {
  BORRADOR: "Borrador",
  EN_PROCESO: "En proceso",
  FINALIZADO: "Finalizado",
  PAUSADA: "Pausada",
  CANCELADA: "Cancelada",
};

const etapaLabels: Record<string, string> = {
  PRIMARIA: "Primaria",
  SECUNDARIA: "Secundaria",
  EMPAQUE: "Empaque",
};

const ESTADO_FILTROS: Array<EstadoOrden | ""> = ["", "BORRADOR", "EN_PROCESO", "FINALIZADO", "PAUSADA", "CANCELADA"];
const ETAPA_FILTROS: Array<EtapaProceso | ""> = ["", "PRIMARIA", "SECUNDARIA", "EMPAQUE"];

function Chip({ label, active, onPress }: { label: string; active: boolean; onPress: () => void }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: active ? "#4F46E5" : "#D1D5DB",
        backgroundColor: active ? "#EEF2FF" : "#FFF",
        marginRight: 6,
        marginBottom: 6,
      }}
    >
      <Text style={{ fontSize: 11, color: active ? "#4F46E5" : "#111827" }}>{label}</Text>
    </TouchableOpacity>
  );
}

export default function ProcesamientosScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { colors } = useTheme();
  const [search, setSearch] = useState("");
  const [estado, setEstado] = useState<EstadoOrden | "">("");
  const [etapa, setEtapa] = useState<EtapaProceso | "">("");
  const [page, setPage] = useState(1);
  const [refreshing, setRefreshing] = useState(false);
  const debouncedSearch = useDebounce(search, 300);

  const { data, isLoading, refetch } = useOrdenes({
    search: debouncedSearch,
    estado: estado || undefined,
    etapa: etapa || undefined,
    page,
    limit: 20,
  });
  const { data: stats } = useOrdenStats();

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
        { icon: Settings, label: "Ordenes", value: String(stats.total_ordenes), color: colors.info, bg: colors.infoLight },
        { icon: Package, label: "Kg procesados", value: String(stats.kg_procesados), color: colors.primary, bg: colors.primaryLight },
        { icon: Package, label: "Kg a kardex", value: String(stats.kg_a_kardex), color: colors.warning, bg: colors.warningLight },
        { icon: Clock, label: "En proceso", value: String(stats.por_estado?.EN_PROCESO ?? 0), color: "#D97706", bg: colors.warningLight },
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
            <Text style={{ marginTop: 2, fontSize: 12, color: colors.textSecondary }}>
              {item.producto_salida} · {etapaLabels[item.etapa] ?? item.etapa} · {item.formato_salida}
            </Text>
            <Text style={{ marginTop: 2, fontSize: 11, color: colors.textMuted }}>
              Entrada {Number(item.peso_entrada).toLocaleString("es-PE")} kg · Salida {Number(item.peso_salida_total).toLocaleString("es-PE")} kg · Rend. {item.rendimiento}%
            </Text>
            <Text style={{ marginTop: 2, fontSize: 11, color }}>{estadoLabels[item.estado] ?? item.estado}</Text>
          </View>
          <ChevronRight size={16} color={colors.textMuted} />
        </TouchableOpacity>
      );
    },
    [navigation, colors],
  );

  const keyExtractor = useCallback((item: OrdenProcesamiento) => String(item.id), []);

  const filtros = (
    <View style={{ marginBottom: 4 }}>
      <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
        {ESTADO_FILTROS.map((e) => (
          <Chip key={e || "todos"} label={e ? estadoLabels[e] : "Todos"} active={estado === e} onPress={() => { setEstado(e); setPage(1); }} />
        ))}
      </View>
      <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
        {ETAPA_FILTROS.map((e) => (
          <Chip key={e || "todas"} label={e ? etapaLabels[e] : "Toda etapa"} active={etapa === e} onPress={() => { setEtapa(e); setPage(1); }} />
        ))}
      </View>
    </View>
  );

  if (isLoading && page === 1) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
        <LoadingSpinner text="Cargando ordenes..." />
      </SafeAreaView>
    );
  }

  return (
    <ListScreenLayout
      title="Procesamiento"
      subtitle="Ordenes de procesamiento"
      kpis={kpis}
      onAdd={() => navigation.navigate("ProcesamientoForm")}
      addButtonLabel="Nuevo"
      addIcon={Plus}
      searchPlaceholder="Buscar por codigo o producto..."
      searchValue={search}
      onSearchChange={(t) => { setSearch(t); setPage(1); }}
      filters={filtros}
      resultCount={data?.total ?? 0}
      resultLabel="Ordenes"
      data={items}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      onRefresh={onRefresh}
      refreshing={refreshing}
      isLoading={isLoading}
      emptyTitle="No hay ordenes"
      emptyDescription="Crea una nueva orden de procesamiento."
      onEndReached={() => { if (page < totalPages) setPage(page + 1); }}
    />
  );
}
