import React, { useState, useEffect, useCallback } from "react";
import { View, Text, TouchableOpacity, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation, useRoute } from "@react-navigation/native";
import { ArrowLeft, Plus, Trash2, User } from "lucide-react-native";
import { fetchFamiliares, deleteFamiliar, type Familiar } from "../services/productores";
import { useTheme } from "../contexts/ThemeContext";
import { ListScreenLayout } from "../components/layouts/ListScreenLayout";
import { Badge, LoadingSpinner } from "../components/ui";

const parentescoLabels: Record<string, string> = {
  CONYUGE: "Cónyuge",
  HIJO: "Hijo/a",
  PADRE: "Padre",
  MADRE: "Madre",
  HERMANO: "Hermano/a",
  OTRO: "Otro",
};

export default function FamiliaresScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { productorId, productorNombre } = route.params;
  const { colors } = useTheme();

  const [familiares, setFamiliares] = useState<Familiar[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState("");

  const loadData = useCallback(async () => {
    try {
      const data = await fetchFamiliares(productorId);
      setFamiliares(data);
    } catch {
      // silently fail
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  }, [productorId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  useEffect(() => {
    if (route.params?.refresh) { loadData(); navigation.setParams({ refresh: false }); }
  }, [route.params?.refresh]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadData();
  }, [loadData]);

  const handleDelete = (familiar: Familiar) => {
    Alert.alert(
      "Eliminar Familiar",
      `¿Estás seguro de eliminar a ${familiar.nombres}?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteFamiliar(productorId, familiar.id);
              setFamiliares((prev) => prev.filter((f) => f.id !== familiar.id));
            } catch {
              Alert.alert("Error", "No se pudo eliminar el familiar");
            }
          },
        },
      ]
    );
  };

  const renderItem = (item: Familiar) => (
    <TouchableOpacity
      style={{
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: colors.surface,
        borderRadius: 12,
        padding: 14,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 2,
      }}
      onPress={() => navigation.navigate("FamiliarEdit", { productorId, familiar: item })}
    >
      <View style={{
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: colors.successLight,
        alignItems: "center",
        justifyContent: "center",
      }}>
        <User size={20} color={colors.success} />
      </View>
      <View style={{ flex: 1, marginLeft: 12 }}>
        <Text style={{ fontSize: 14, fontWeight: "500", color: colors.text }} numberOfLines={1}>{item.nombres}</Text>
        <Text style={{ marginTop: 2, fontSize: 12, color: colors.textSecondary }}>
          {parentescoLabels[item.parentesco] || item.parentesco}
          {item.dni ? ` · DNI: ${item.dni}` : ""}
        </Text>
        <View style={{ flexDirection: "row", gap: 6, marginTop: 4 }}>
          {item.dependiente && <Badge variant="yellow">Dependiente</Badge>}
          {item.viveConProductor && <Badge variant="green">Vive con productor</Badge>}
        </View>
      </View>
      <TouchableOpacity onPress={() => handleDelete(item)} style={{ padding: 8 }}>
        <Trash2 size={16} color={colors.danger} />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  if (isLoading) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
        <LoadingSpinner text="Cargando familiares..." />
      </SafeAreaView>
    );
  }

  return (
    <ListScreenLayout
      title="Familiares"
      subtitle={productorNombre}
      header={
        <View style={{
          flexDirection: "row",
          alignItems: "center",
          paddingHorizontal: 16,
          paddingVertical: 12,
          backgroundColor: colors.surface,
          borderBottomWidth: 1,
          borderBottomColor: colors.border,
        }}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={{ padding: 8 }}>
            <ArrowLeft size={20} color={colors.text} />
          </TouchableOpacity>
          <View style={{ flex: 1, marginLeft: 8 }}>
            <Text style={{ fontSize: 18, fontWeight: "600", color: colors.text }}>Familiares</Text>
            <Text style={{ fontSize: 12, color: colors.textSecondary }} numberOfLines={1}>{productorNombre}</Text>
          </View>
          <TouchableOpacity
            style={{
              width: 36,
              height: 36,
              borderRadius: 18,
              backgroundColor: colors.success,
              alignItems: "center",
              justifyContent: "center",
            }}
            onPress={() => navigation.navigate("FamiliarCreate", { productorId, productorNombre })}
          >
            <Plus size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      }
      onAdd={() => navigation.navigate("FamiliarCreate", { productorId, productorNombre })}
      addButtonLabel="Nuevo"
      addIcon={Plus}
      searchValue={search}
      onSearchChange={(t) => { setSearch(t); }}
      resultCount={familiares.length}
      data={familiares}
      renderItem={renderItem}
      keyExtractor={(item) => String(item.id)}
      onRefresh={onRefresh}
      refreshing={refreshing}
      emptyTitle="No hay familiares"
      emptyDescription="Agrega familiares del productor tocando el botón +"
    />
  );
}