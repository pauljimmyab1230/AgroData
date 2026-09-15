import React from "react";
import { View, Text, StyleSheet } from "react-native";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "forest" | "yellow" | "red" | "gray" | "green";
}

const variantStyles: Record<string, { bg: string; text: string }> = {
  default: { bg: "#F3F4F6", text: "#374151" },
  forest: { bg: "#DCFCE7", text: "#166534" },
  yellow: { bg: "#FEF9C3", text: "#A16207" },
  red: { bg: "#FEE2E2", text: "#DC2626" },
  gray: { bg: "#F3F4F6", text: "#4B5563" },
  green: { bg: "#DCFCE7", text: "#16A34A" },
};

export function Badge({ children, variant = "default" }: BadgeProps) {
  const colors = variantStyles[variant] || variantStyles.default;
  return (
    <View style={[styles.badge, { backgroundColor: colors.bg }]}>
      <Text style={[styles.text, { color: colors.text }]}>{children}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 2,
    borderRadius: 999,
  },
  text: {
    fontSize: 11,
    fontWeight: "600",
  },
});
