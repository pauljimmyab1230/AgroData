import React from "react";
import { View, Text, ScrollView, RefreshControl, TouchableOpacity, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { Users, MapPin, Wheat, CalendarDays, Sprout, ClipboardList, Package, Truck, TrendingUp, ArrowRight } from "lucide-react-native";
import { useDashboard } from "../hooks/useDashboard";
import { LoadingSpinner } from "../components/ui";
import { KpiGrid } from "../components/ui/KpiGrid";
import HeaderUsuario from "../components/ui/HeaderUsuario";
import { useTheme } from "../contexts/ThemeContext";
import { useLogout } from "../hooks/useLogout";
import { getStatusConfig } from "../utils/statusConfig";

export default function DashboardScreen() {
  const navigation = useNavigation<any>();
  const { data, isLoading, error, refetch } = useDashboard();
  const [refreshing, setRefreshing] = React.useState(false);
  const { isDarkMode, toggleTheme, colors } = useTheme();
  const handleLogout = useLogout();

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  }, [refetch]);

  if (isLoading) {
    return (
      <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
        <LoadingSpinner text="Cargando dashboard..." />
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
        <View style={styles.errorContainer}>
          <Text style={[styles.errorTitle, { color: colors.text }]}>Error al cargar</Text>
          <Text style={[styles.errorText, { color: colors.textSecondary }]}>{error}</Text>
          <TouchableOpacity style={[styles.retryBtn, { backgroundColor: colors.primary }]} onPress={refetch}>
            <Text style={[styles.retryBtnText, { color: colors.textInverse }]}>Reintentar</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const stats = [
    { label: "Productores", value: String(data?.productores ?? 0), hint: "registrados", icon: Users, color: "#10B981", bg: "#ECFDF5" },
    { label: "Parcelas", value: String(data?.parcelas ?? 0), hint: "georeferenciadas", icon: MapPin, color: "#F59E0B", bg: "#FFFBEB" },
    { label: "Cultivos", value: String(data?.cultivos ?? 0), hint: "registrados", icon: Wheat, color: "#10B981", bg: "#ECFDF5" },
    { label: "Campañas", value: String(data?.campanias ?? 0), hint: data?.campaniaActiva ? "1 activa" : "ninguna", icon: CalendarDays, color: "#6366F1", bg: "#EEF2FF" },
  ];

  const shortcuts = [
    { label: "Bitácora", icon: ClipboardList, color: "#10B981", screen: "Campo", sub: "Actividades" },
    { label: "Acopio", icon: Package, color: "#F59E0B", screen: "Campo", sub: "Recolección" },
    { label: "Recepción", icon: Truck, color: "#6366F1", screen: "Operaciones", sub: "Ingreso" },
    { label: "Reportes", icon: TrendingUp, color: "#EC4899", screen: "Dashboard", sub: "Estadísticas" },
  ];

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]} edges={["top"]}>
      <HeaderUsuario isDarkMode={isDarkMode} onToggleTheme={toggleTheme} onLogout={handleLogout} />

      <ScrollView
        style={[styles.scrollView, { backgroundColor: colors.background }]}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.statsContainer}>
          <Text style={[styles.sectionLabel, { color: colors.text }]}>Resumen</Text>
          <KpiGrid items={stats} />
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionLabel, { color: colors.text }]}>Accesos Rápidos</Text>
          <View style={styles.shortcutsGrid}>
            {shortcuts.map((item) => (
              <TouchableOpacity key={item.label} style={[styles.shortcutCard, { backgroundColor: colors.surface }]} onPress={() => navigation.navigate(item.screen)} activeOpacity={0.7}>
                <View style={[styles.shortcutIcon, { backgroundColor: item.color + "15" }]}>
                  <item.icon size={24} color={item.color} />
                </View>
                <Text style={[styles.shortcutLabel, { color: colors.text }]}>{item.label}</Text>
                <Text style={[styles.shortcutSub, { color: colors.textSecondary }]}>{item.sub}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {data?.campaniaActiva && (
          <View style={styles.section}>
            <Text style={[styles.sectionLabel, { color: colors.text }]}>Campaña Activa</Text>
            <TouchableOpacity style={styles.campaignCard} activeOpacity={0.7}>
              <View style={styles.campaignHeader}>
                <View style={styles.campaignIcon}><Sprout size={20} color="#FFFFFF" /></View>
                <View style={styles.campaignInfo}>
                  <Text style={styles.campaignName}>{data.campaniaActiva.nombre}</Text>
                  <Text style={styles.campaignCode}>{data.campaniaActiva.codigo}</Text>
                </View>
                <ArrowRight size={20} color="#FFFFFF" />
              </View>
              <View style={styles.campaignDetails}>
                <View style={styles.campaignDetailItem}>
                  <Text style={styles.campaignDetailLabel}>Año agrícola</Text>
                  <Text style={styles.campaignDetailValue}>{data.campaniaActiva.anio_agricola}</Text>
                </View>
                <View style={styles.campaignDetailItem}>
                  <Text style={styles.campaignDetailLabel}>Estado</Text>
                  <View style={styles.activeBadge}><Text style={styles.activeBadgeText}>ACTIVA</Text></View>
                </View>
              </View>
            </TouchableOpacity>
          </View>
        )}

        <View style={[styles.section, styles.lastSection]}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionLabel, { color: colors.text }]}>Actividades Recientes</Text>
            <TouchableOpacity onPress={() => navigation.navigate("Campo")}><Text style={[styles.seeAll, { color: colors.primary }]}>Ver todo</Text></TouchableOpacity>
          </View>
          <View style={[styles.activitiesCard, { backgroundColor: colors.surface }]}>
            {!data?.actividadesRecientes?.length ? (
              <View style={styles.emptyActivities}>
                <ClipboardList size={32} color={colors.disabled} />
                <Text style={[styles.emptyText, { color: colors.placeholder }]}>No hay actividades registradas</Text>
              </View>
            ) : (
              data.actividadesRecientes.slice(0, 3).map((act, index) => {
                const status = getStatusConfig(act.estado);
                return (
                  <View key={act.id} style={[styles.activityItem, index < 2 && { borderBottomWidth: 1, borderBottomColor: colors.divider }]}>
                    <View style={[styles.activityIcon, { backgroundColor: colors.primarySurface }]}>
                      <ClipboardList size={16} color={colors.primary} />
                    </View>
                    <View style={styles.activityInfo}>
                      <Text style={[styles.activityName, { color: colors.text }]} numberOfLines={1}>{act.tipoActividad}</Text>
                      <Text style={[styles.activityCode, { color: colors.textSecondary }]}>{act.codigo}</Text>
                    </View>
                    <View style={[styles.activityBadge, { backgroundColor: status.bg }]}>
                      <Text style={[styles.activityBadgeText, { color: status.color }]}>{act.estado}</Text>
                    </View>
                  </View>
                );
              })
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  scrollView: { flex: 1 },
  errorContainer: { flex: 1, alignItems: "center", justifyContent: "center", padding: 32 },
  errorTitle: { fontSize: 18, fontWeight: "600", marginTop: 16 },
  errorText: { fontSize: 14, textAlign: "center", marginTop: 8 },
  retryBtn: { marginTop: 16, paddingHorizontal: 24, paddingVertical: 10, borderRadius: 8 },
  retryBtnText: { fontSize: 14, fontWeight: "600" },
  section: { marginTop: 20, paddingHorizontal: 16 },
  sectionLabel: { fontSize: 14, fontWeight: "600", marginBottom: 12 },
  sectionHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12 },
  seeAll: { fontSize: 14, fontWeight: "500" },
  statsContainer: { marginTop: 16, paddingHorizontal: 16 },
  shortcutsGrid: { flexDirection: "row", flexWrap: "wrap", gap: 12 },
  shortcutCard: {
    width: "22%", alignItems: "center", padding: 12, borderRadius: 14,
    shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 2,
  },
  shortcutIcon: { width: 44, height: 44, borderRadius: 12, alignItems: "center", justifyContent: "center", marginBottom: 8 },
  shortcutLabel: { fontSize: 11, fontWeight: "600" },
  shortcutSub: { fontSize: 10, marginTop: 2 },
  campaignCard: {
    backgroundColor: "#166534", borderRadius: 16, padding: 20,
    shadowColor: "#166534", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 4,
  },
  campaignHeader: { flexDirection: "row", alignItems: "center", gap: 12 },
  campaignIcon: { width: 44, height: 44, borderRadius: 12, backgroundColor: "rgba(255,255,255,0.15)", alignItems: "center", justifyContent: "center" },
  campaignInfo: { flex: 1 },
  campaignName: { fontSize: 16, fontWeight: "600", color: "#FFFFFF" },
  campaignCode: { fontSize: 12, color: "#86EFAC", marginTop: 2 },
  campaignDetails: { flexDirection: "row", justifyContent: "space-between", marginTop: 20, paddingTop: 16, borderTopWidth: 1, borderTopColor: "rgba(255,255,255,0.1)" },
  campaignDetailItem: { gap: 4 },
  campaignDetailLabel: { fontSize: 12, color: "#86EFAC" },
  campaignDetailValue: { fontSize: 14, fontWeight: "600", color: "#FFFFFF" },
  activeBadge: { backgroundColor: "#86EFAC", paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6, alignSelf: "flex-start" },
  activeBadgeText: { fontSize: 11, fontWeight: "700", color: "#166534" },
  lastSection: { paddingBottom: 120 },
  activitiesCard: { borderRadius: 16, padding: 4, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 },
  emptyActivities: { alignItems: "center", paddingVertical: 32 },
  emptyText: { fontSize: 14, marginTop: 8 },
  activityItem: { flexDirection: "row", alignItems: "center", padding: 12, gap: 12 },
  activityIcon: { width: 36, height: 36, borderRadius: 10, alignItems: "center", justifyContent: "center" },
  activityInfo: { flex: 1 },
  activityName: { fontSize: 14, fontWeight: "500" },
  activityCode: { fontSize: 12, marginTop: 2 },
  activityBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6 },
  activityBadgeText: { fontSize: 11, fontWeight: "600" },
});
