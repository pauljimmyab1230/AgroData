import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import type { LucideIcon } from "lucide-react-native";
import { useTheme } from "../../contexts/ThemeContext";

export interface KpiItem {
  label: string;
  value: string;
  hint?: string;
  icon: LucideIcon;
  color: string;
  bg: string;
}

interface KpiGridProps {
  items: KpiItem[];
  columns?: 2 | 3;
  onPress?: (item: KpiItem) => void;
}

export function KpiGrid({ items, columns = 2, onPress }: KpiGridProps) {
  const { colors } = useTheme();
  const widthPercent = columns === 3 ? "31%" : "48%";

  return (
    <View style={styles.grid}>
      {items.map((item) => (
        <TouchableOpacity
          key={item.label}
          style={[styles.card, { backgroundColor: item.bg, width: widthPercent }]}
          activeOpacity={onPress ? 0.7 : 1}
          onPress={onPress ? () => onPress(item) : undefined}
          disabled={!onPress}
        >
          <View style={[styles.iconContainer, { backgroundColor: item.color + "20" }]}>
            <item.icon size={18} color={item.color} />
          </View>
          <Text style={[styles.value, { color: colors.text }]}>{item.value}</Text>
          <Text style={[styles.label, { color: colors.textSecondary }]}>{item.label}</Text>
          {item.hint ? <Text style={[styles.hint, { color: colors.textMuted }]}>{item.hint}</Text> : null}
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginTop: 12,
  },
  card: {
    padding: 14,
    borderRadius: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  value: {
    fontSize: 20,
    fontWeight: "700",
  },
  label: {
    fontSize: 12,
    marginTop: 2,
  },
  hint: {
    fontSize: 11,
    marginTop: 1,
  },
});
