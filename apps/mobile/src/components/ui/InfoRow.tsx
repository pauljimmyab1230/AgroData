import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useTheme } from "../../contexts/ThemeContext";

interface InfoRowProps {
  label: string;
  value: string | null | undefined;
}

export const InfoRow = React.memo(function InfoRow({ label, value }: InfoRowProps) {
  const { colors } = useTheme();

  return (
    <View style={[styles.row, { borderBottomColor: colors.divider }]} accessibilityLabel={`${label}: ${value ?? "sin dato"}`} accessibilityRole="text">
      <Text style={[styles.label, { color: colors.textSecondary }]}>{label}</Text>
      <Text style={[styles.value, { color: colors.text }]}>{value ?? "—"}</Text>
    </View>
  );
});

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderBottomWidth: 1,
  },
  label: {
    fontSize: 14,
  },
  value: {
    fontSize: 14,
    fontWeight: "500",
    flex: 1,
    textAlign: "right",
    marginLeft: 8,
  },
});
