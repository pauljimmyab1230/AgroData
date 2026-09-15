import React, { type ReactElement } from "react";
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ChevronRight } from "lucide-react-native";
import type { LucideIcon } from "lucide-react-native";
import { useTheme } from "../../contexts/ThemeContext";
import { tokens } from "../../theme/tokens";

interface MenuItem {
  id: string;
  title: string;
  description?: string;
  icon: LucideIcon;
  color: string;
  bg: string;
  screen: string;
}

interface MenuScreenLayoutProps {
  header?: ReactElement;
  quickActions?: MenuItem[];
  menuItems: MenuItem[];
  onNavigate: (screen: string) => void;
}

export function MenuScreenLayout({ header, quickActions, menuItems, onNavigate }: MenuScreenLayoutProps) {
  const { colors } = useTheme();

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]} edges={["top"]}>
      {header}

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {quickActions && quickActions.length > 0 ? (
          <View style={styles.section}>
            <Text style={[styles.sectionLabel, { color: colors.text }]}>Accesos Rápidos</Text>
            <View style={styles.quickGrid}>
              {quickActions.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  style={[styles.quickCard, { backgroundColor: colors.surface }]}
                  onPress={() => onNavigate(item.screen)}
                  activeOpacity={0.7}
                >
                  <View style={[styles.quickIcon, { backgroundColor: item.color + "15" }]}>
                    <item.icon size={22} color={item.color} />
                  </View>
                  <Text style={[styles.quickLabel, { color: colors.text }]}>{item.title}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ) : null}

        <View style={styles.section}>
          <Text style={[styles.sectionLabel, { color: colors.text }]}>Módulos</Text>
          <View style={styles.menuGrid}>
            {menuItems.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={[styles.menuCard, { backgroundColor: colors.surface }]}
                onPress={() => onNavigate(item.screen)}
                activeOpacity={0.7}
              >
                <View style={[styles.menuIcon, { backgroundColor: item.bg }]}>
                  <item.icon size={24} color={item.color} />
                </View>
                <View style={styles.menuInfo}>
                  <Text style={[styles.menuTitle, { color: colors.text }]}>{item.title}</Text>
                  {item.description ? (
                    <Text style={[styles.menuDescription, { color: colors.textSecondary }]} numberOfLines={2}>
                      {item.description}
                    </Text>
                  ) : null}
                </View>
                <View style={[styles.menuArrow, { backgroundColor: item.bg }]}>
                  <ChevronRight size={16} color={item.color} />
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  section: {
    marginTop: 20,
    paddingHorizontal: 16,
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 12,
  },
  quickGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  quickCard: {
    width: "22%",
    alignItems: "center",
    padding: 14,
    borderRadius: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  quickIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  quickLabel: {
    fontSize: 11,
    fontWeight: "600",
    textAlign: "center",
    lineHeight: 14,
  },
  menuGrid: {
    gap: 12,
  },
  menuCard: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 14,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  menuIcon: {
    width: 52,
    height: 52,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  menuInfo: {
    flex: 1,
    marginLeft: 14,
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: "600",
  },
  menuDescription: {
    fontSize: 13,
    marginTop: 3,
    lineHeight: 18,
  },
  menuArrow: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  bottomSpacer: {
    paddingBottom: 120,
  },
});
