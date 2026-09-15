import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LayoutDashboard, Users, MapPin, Package } from "lucide-react-native";
import type { BottomTabBarProps } from "@react-navigation/bottom-tabs";

const icons = {
  Dashboard: LayoutDashboard,
  Socios: Users,
  Campo: MapPin,
  Operaciones: Package,
};

const labels: Record<string, string> = {
  Dashboard: "Inicio",
  Socios: "Socios",
  Campo: "Campo",
  Operaciones: "Ops",
};

const activeColor = "#166534";
const inactiveColor = "#9CA3AF";

export default function CustomTabBar({ state, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom + 8 }]}>
      <View style={styles.tabBar}>
        {state.routes.map((route, index) => {
          const isFocused = state.index === index;
          const Icon = icons[route.name as keyof typeof icons] || LayoutDashboard;
          const label = labels[route.name] || route.name;

          const onPress = () => {
            navigation.navigate(route.name);
          };

          return (
            <TouchableOpacity
              key={route.key}
              onPress={onPress}
              style={styles.tabItem}
              activeOpacity={0.7}
            >
              {isFocused ? (
                <View style={styles.activeIconWrapper}>
                  <Icon size={24} color="#FFFFFF" />
                </View>
              ) : (
                <View style={styles.inactiveIconWrapper}>
                  <Icon size={22} color={inactiveColor} />
                </View>
              )}
              <Text style={[styles.label, isFocused && styles.labelActive]}>
                {label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
  },
  tabBar: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 28,
    paddingHorizontal: 8,
    paddingTop: 12,
    paddingBottom: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 10,
  },
  tabItem: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    paddingVertical: 4,
  },
  activeIconWrapper: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: activeColor,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: activeColor,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 8,
    marginBottom: 4,
  },
  inactiveIconWrapper: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "transparent",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },
  label: {
    fontSize: 11,
    fontWeight: "500",
    color: inactiveColor,
    marginTop: 2,
  },
  labelActive: {
    fontWeight: "700",
    color: activeColor,
  },
});
