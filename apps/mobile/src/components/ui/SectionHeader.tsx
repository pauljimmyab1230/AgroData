import React from "react";
import { View, Text, StyleSheet } from "react-native";
import type { LucideIcon } from "lucide-react-native";
import { useTheme } from "../../contexts/ThemeContext";

interface SectionHeaderProps {
  icon?: LucideIcon;
  iconBg?: string;
  iconColor?: string;
  title: string;
  subtitle?: string;
}

export function SectionHeader({ icon: Icon, iconBg, iconColor, title, subtitle }: SectionHeaderProps) {
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      {Icon ? (
        <View style={[styles.iconContainer, { backgroundColor: iconBg ?? colors.primaryLight }]}>
          <Icon size={20} color={iconColor ?? colors.primary} />
        </View>
      ) : null}
      <View style={styles.textGroup}>
        <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
        {subtitle ? <Text style={[styles.subtitle, { color: colors.textSecondary }]}>{subtitle}</Text> : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 16,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  textGroup: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
  },
  subtitle: {
    fontSize: 12,
    marginTop: 2,
  },
});
