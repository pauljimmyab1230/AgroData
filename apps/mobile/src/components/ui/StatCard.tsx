import React from "react";
import { View, Text, StyleSheet } from "react-native";
import type { LucideIcon } from "lucide-react-native";

interface StatCardProps {
  label: string;
  value: string;
  hint: string;
  icon: LucideIcon;
  iconBg: string;
  iconColor: string;
}

export function StatCard({ label, value, hint, icon: Icon, iconBg, iconColor }: StatCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={[styles.iconContainer, { backgroundColor: iconBg }]}>
          <Icon size={20} color={iconColor} />
        </View>
      </View>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
      <Text style={styles.hint}>{hint}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  header: {
    flexDirection: "row",
    justifyContent: "flex-start",
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  label: {
    marginTop: 16,
    fontSize: 11,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    color: "#6B7280",
  },
  value: {
    marginTop: 6,
    fontSize: 24,
    fontWeight: "bold",
    color: "#111827",
  },
  hint: {
    marginTop: 4,
    fontSize: 11,
    color: "#6B7280",
  },
});
