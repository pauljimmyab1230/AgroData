import React, { type ReactElement } from "react";
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../../contexts/ThemeContext";
import { Card, Badge, LoadingSpinner } from "../ui";
import type { LucideIcon } from "lucide-react-native";
import { tokens } from "../../theme/tokens";

interface DetailSection {
  title: string;
  children: ReactElement;
}

interface DetailAction {
  label: string;
  onPress: () => void;
  icon?: LucideIcon;
  variant?: "primary" | "danger";
}

interface DetailKpi {
  icon: LucideIcon;
  label: string;
  value: string;
}

interface DetailScreenLayoutProps {
  isLoading?: boolean;
  loadingText?: string;
  notFoundText?: string;
  icon?: { char: string; bg: string; color: string };
  title: string;
  subtitle?: string;
  badge?: { label: string; variant?: "green" | "yellow" | "red" | "gray" | "forest" | "default" };
  kpis?: DetailKpi[];
  sections?: DetailSection[];
  actions?: DetailAction[];
  map?: ReactElement;
  children?: ReactElement;
}

export function DetailScreenLayout({
  isLoading,
  loadingText = "Cargando...",
  notFoundText = "No encontrado",
  icon,
  title,
  subtitle,
  badge,
  kpis,
  sections,
  actions,
  map,
  children,
}: DetailScreenLayoutProps) {
  const { colors } = useTheme();

  if (isLoading) {
    return (
      <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
        <LoadingSpinner text={loadingText} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]} edges={["top"]}>
      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          {icon ? (
            <View style={[styles.iconContainer, { backgroundColor: icon.bg }]}>
              <Text style={[styles.iconText, { color: icon.color }]}>{icon.char}</Text>
            </View>
          ) : null}
          <View style={styles.headerInfo}>
            <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
            {subtitle ? <Text style={[styles.subtitle, { color: colors.textSecondary }]}>{subtitle}</Text> : null}
          </View>
          {badge ? <Badge variant={badge.variant}>{badge.label}</Badge> : null}
        </View>

        {kpis && kpis.length > 0 ? (
          <View style={styles.kpiRow}>
            {kpis.map((kpi, i) => (
              <View key={i} style={styles.kpi}>
                <kpi.icon size={16} color={colors.primary} />
                <Text style={[styles.kpiValue, { color: colors.text }]}>{kpi.value}</Text>
                <Text style={[styles.kpiLabel, { color: colors.textSecondary }]}>{kpi.label}</Text>
              </View>
            ))}
          </View>
        ) : null}

        {actions && actions.length > 0 ? (
          <View style={styles.actionsRow}>
            {actions.map((action, i) => {
              const isDanger = action.variant === "danger";
              const ActionIcon = action.icon;
              return (
                <TouchableOpacity
                  key={i}
                  style={[
                    styles.actionBtn,
                    {
                      backgroundColor: isDanger ? colors.errorLight : colors.primaryLight,
                    },
                  ]}
                  onPress={action.onPress}
                  activeOpacity={0.7}
                >
                  {ActionIcon ? <ActionIcon size={16} color={isDanger ? colors.error : colors.primary} /> : null}
                  <Text style={[styles.actionText, { color: isDanger ? colors.error : colors.primary }]}>
                    {action.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        ) : null}

        {sections?.map((section, i) => (
          <View key={i} style={styles.section}>
            <Card>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>{section.title}</Text>
              {section.children}
            </Card>
          </View>
        ))}

        {map ? <View style={styles.mapContainer}>{map}</View> : null}

        {children}

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  scroll: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  iconText: {
    fontSize: 20,
    fontWeight: "bold",
  },
  headerInfo: {
    flex: 1,
    marginLeft: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  subtitle: {
    marginTop: 2,
    fontSize: 14,
  },
  kpiRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  kpi: {
    alignItems: "center",
    flex: 1,
  },
  kpiValue: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 4,
  },
  kpiLabel: {
    fontSize: 11,
    marginTop: 2,
  },
  actionsRow: {
    flexDirection: "row",
    paddingHorizontal: 16,
    gap: 12,
    marginBottom: 8,
  },
  actionBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderRadius: 10,
    gap: 8,
  },
  actionText: {
    fontSize: 14,
    fontWeight: "600",
  },
  section: {
    marginTop: 16,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
  },
  mapContainer: {
    marginTop: 16,
    marginHorizontal: 16,
  },
  bottomSpacer: {
    height: 32,
  },
});
