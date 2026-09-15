import React, { useState, useCallback } from "react";
import { View, Text, TouchableOpacity, Platform, StyleSheet } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Calendar } from "lucide-react-native";
import { useTheme } from "../../contexts/ThemeContext";

interface DatePickerFieldProps {
  label: string;
  value: string;
  onChange: (date: string) => void;
  placeholder?: string;
  maximumDate?: Date;
  minimumDate?: Date;
}

export function DatePickerField({ label, value, onChange, placeholder = "Seleccionar fecha", maximumDate, minimumDate }: DatePickerFieldProps) {
  const [show, setShow] = useState(false);
  const { colors } = useTheme();

  const dateValue = (() => {
    if (!value) return new Date();
    try {
      const d = new Date(value.includes("T") ? value : value + "T00:00:00");
      return isNaN(d.getTime()) ? new Date() : d;
    } catch {
      return new Date();
    }
  })();

  const handleChange = useCallback((event: unknown, selectedDate?: Date) => {
    if (Platform.OS === "android") {
      setShow(false);
    }
    if (selectedDate) {
      const year = selectedDate.getFullYear();
      const month = String(selectedDate.getMonth() + 1).padStart(2, "0");
      const day = String(selectedDate.getDate()).padStart(2, "0");
      onChange(`${year}-${month}-${day}`);
    }
  }, [onChange]);

  return (
    <View style={styles.field}>
      <Text style={[styles.label, { color: colors.text }]}>{label}</Text>
      <TouchableOpacity
        style={[styles.input, { borderColor: colors.disabled, backgroundColor: colors.surface }]}
        onPress={() => setShow(true)}
        accessibilityLabel={`${label}: ${value || placeholder}`}
        accessibilityRole="button"
      >
        <Text style={[styles.dateText, { color: colors.text }, !value && { color: colors.placeholder }]}>
          {value || placeholder}
        </Text>
        <Calendar size={18} color={colors.textSecondary} />
      </TouchableOpacity>

      {show && Platform.OS === "ios" && (
        <View>
          <DateTimePicker
            value={dateValue}
            mode="date"
            display="spinner"
            onValueChange={handleChange}
            maximumDate={maximumDate}
            minimumDate={minimumDate}
          />
          <TouchableOpacity style={[styles.doneBtn, { backgroundColor: colors.primary }]} onPress={() => setShow(false)} accessibilityLabel="Cerrar selector de fecha" accessibilityRole="button">
            <Text style={[styles.doneBtnText, { color: colors.textInverse }]}>Listo</Text>
          </TouchableOpacity>
        </View>
      )}

      {show && Platform.OS === "android" && (
        <DateTimePicker
          value={dateValue}
          mode="date"
          display="default"
          onChange={handleChange}
          maximumDate={maximumDate}
          minimumDate={minimumDate}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  field: { marginBottom: 12 },
  label: { fontSize: 13, fontWeight: "500", marginBottom: 4 },
  input: {
    flexDirection: "row", alignItems: "center", justifyContent: "space-between",
    borderWidth: 1, borderRadius: 8,
    paddingHorizontal: 12, paddingVertical: 10,
  },
  dateText: { fontSize: 14 },
  doneBtn: {
    borderRadius: 8, paddingVertical: 10,
    alignItems: "center", marginTop: 8,
  },
  doneBtnText: { fontSize: 14, fontWeight: "600" },
});
