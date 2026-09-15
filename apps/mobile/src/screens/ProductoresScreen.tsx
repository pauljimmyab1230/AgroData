import React, { useState, useCallback, useEffect } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Users, UserCheck, User, Plus } from "lucide-react-native";
import { useProductores, useProductorStats } from "../hooks/useProductores";
import { ListScreenLayout } from "../components/layouts/ListScreenLayout";
import { useLogout } from "../hooks/useLogout";
import { getStatusConfig, GENERO_COLORS } from "../utils/statusConfig";
import CustomHeader from "../components/ui/CustomHeader";
import { useTheme } from "../contexts/ThemeContext";
import type { Productor } from "../services/productores";

export default function ProductoresScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [refreshing, setRefreshing] = useState(false);
  const { isDarkMode, toggleTheme } = useTheme();
  const handleLogout = useLogout();

  const { data, isLoading, isSearching, refetch } = useProductores({ search, page, limit: 20 });
  const { data: stats } = useProductorStats();

  useEffect(() => {
    if (route.params?.refresh) { refetch(); navigation.setParams({ refresh: false }); }
  }, [route.params?.refresh]);

  const onRefresh = useCallback(async () => { setRefreshing(true); await refetch(); setRefreshing(false); }, [refetch]);

  const productores = data?.data ?? [];
  const totalPages = data?.totalPages ?? 1;

  const kpis = [
    { label: "Total", value: String(stats?.total ?? 0), hint: "socios", icon: Users, color: "#10B981", bg: "#ECFDF5" },
    { label: "Activos", value: String(stats?.activos ?? 0), hint: "registrados", icon: UserCheck, color: "#16A34A", bg: "#DCFCE7" },
    { label: "Mujeres", value: String(stats?.mujeres ?? 0), hint: "socias", icon: User, color: "#DB2777", bg: "#FCE7F3" },
    { label: "Varones", value: String(stats?.varones ?? 0), hint: "socios", icon: User, color: "#2563EB", bg: "#DBEAFE" },
  ];

  const renderItem = (item: Productor) => {
    const estado = getStatusConfig(item.estado);
    const genero = GENERO_COLORS[item.sexo] ?? GENERO_COLORS.MASCULINO;
    const initials = `${(item.nombres || "").charAt(0)}${(item.apellidoPaterno || "").charAt(0)}`.toUpperCase();

    return (
      <TouchableOpacity
        style={{ flexDirection: "row", alignItems: "center", backgroundColor: "#FFFFFF", borderRadius: 14, padding: 14, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 4, elevation: 2 }}
        onPress={() => navigation.navigate("ProductorDetail", { id: item.id })}
        activeOpacity={0.7}
      >
        <View style={{ width: 48, height: 48, borderRadius: 24, alignItems: "center", justifyContent: "center", backgroundColor: genero.color + "15" }}>
          <Text style={{ fontSize: 16, fontWeight: "700", color: genero.color }}>{initials}</Text>
        </View>
        <View style={{ flex: 1, marginLeft: 12 }}>
          <Text style={{ fontSize: 15, fontWeight: "600", color: "#111827" }} numberOfLines={1}>{item.nombres} {item.apellidoPaterno} {item.apellidoMaterno}</Text>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 4, marginTop: 3 }}>
            <Text style={{ fontSize: 12, color: "#6B7280" }}>{item.codigo}</Text>
            <Text style={{ fontSize: 12, color: "#D1D5DB" }}>·</Text>
            <Text style={{ fontSize: 12, color: "#6B7280" }}>{item.comunidad || "—"}</Text>
          </View>
        </View>
        <View style={{ paddingHorizontal: 10, paddingVertical: 5, borderRadius: 8, backgroundColor: estado.bg }}>
          <Text style={{ fontSize: 11, fontWeight: "600", color: estado.color }}>{estado.label}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <ListScreenLayout
      title="Socios"
      subtitle="Gestión de productores"
      header={<CustomHeader userName="Juan Péruz" userRole="Administrador" isDarkMode={isDarkMode} onToggleTheme={toggleTheme} onLogout={handleLogout} />}
      onAdd={() => navigation.navigate("ProductorCreate")}
      addButtonLabel="Nuevo"
      addIcon={Plus}
      kpis={kpis}
      searchPlaceholder="Buscar por nombre, DNI o código..."
      searchValue={search}
      onSearchChange={(text) => { setSearch(text); setPage(1); }}
      resultCount={data?.total ?? 0}
      resultLabel="socios encontrados"
      isSearching={isSearching}
      data={productores}
      renderItem={renderItem}
      keyExtractor={(item) => String(item.id)}
      onRefresh={onRefresh}
      refreshing={refreshing}
      emptyTitle="No hay socios"
      emptyDescription="No se encontraron productores con los filtros aplicados."
      onEndReached={() => { if (page < totalPages) setPage(page + 1); }}
      ListFooterComponent={page < totalPages ? undefined : null}
    />
  );
}
