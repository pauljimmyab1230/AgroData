import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Plus } from "lucide-react-native";
import type { LucideIcon } from "lucide-react-native";
import { useTheme } from "../../contexts/ThemeContext";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  action?: {
    label: string;
    onPress: () => void;
    icon?: LucideIcon;
  };
}

export function PageHeader({ title, subtitle, action }: PageHeaderProps) {
  const { colors } = useTheme();
  const Icon = action?.icon ?? Plus;

  return (
    <View style={styles.container}>
      <View style={styles.textGroup}>
        <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
        {subtitle ? <Text style={[styles.subtitle, { color: colors.textSecondary }]}>{subtitle}</Text> : null}
      </View>
      {action ? (
        <TouchableOpacity
          style={[styles.actionBtn, { backgroundColor: colors.primary }]}
          onPress={action.onPress}
          activeOpacity={0.7}
        >
          <Icon size={18} color={colors.textInverse} />
          <Text style={[styles.actionText, { color: colors.textInverse }]}>{action.label}</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  textGroup: {
    flex: 1,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
  },
  subtitle: {
    marginTop: 2,
    fontSize: 13,
  },
  actionBtn: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
    gap: 6,
  },
  actionText: {
    fontSize: 14,
    fontWeight: "600",
  },
});
