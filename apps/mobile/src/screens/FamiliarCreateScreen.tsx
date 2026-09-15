import React, { useState } from "react";
import { View, Text, TextInput, Switch, Alert, StyleSheet } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { createFamiliar } from "../services/productores";
import { FormScreenLayout, FormSection, FormField } from "../components/layouts/FormScreenLayout";
import { SelectField } from "../components/ui/SelectField";
import { DatePickerField } from "../components/ui/DatePickerField";
import { useTheme } from "../contexts/ThemeContext";

const SEXO_OPTIONS = ["MASCULINO", "FEMENINO"];
const PARENTESCO_OPTIONS = ["CONYUGE", "HIJO", "PADRE", "MADRE", "HERMANO", "OTRO"];
const NIVEL_EDUCATIVO_OPTIONS = ["SIN_ESTUDIOS", "PRIMARIA", "SECUNDARIA", "TECNICO", "UNIVERSITARIO"];

interface FormData {
  nombres: string;
  parentesco: string;
  dni: string;
  sexo: string;
  fechaNacimiento: string;
  ocupacion: string;
  nivelEducativo: string;
  telefono: string;
  dependiente: boolean;
  viveConProductor: boolean;
}

export default function FamiliarCreateScreen() {
  const { colors } = useTheme();
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { productorId, productorNombre } = route.params;
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<FormData>({
    nombres: "",
    parentesco: "",
    dni: "",
    sexo: "",
    fechaNacimiento: "",
    ocupacion: "",
    nivelEducativo: "",
    telefono: "",
    dependiente: false,
    viveConProductor: true,
  });

  const updateField = (key: keyof FormData, value: any) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    if (!form.nombres.trim() || !form.parentesco) {
      Alert.alert("Error", "Nombre y parentesco son obligatorios");
      return;
    }

    setSaving(true);
    try {
      await createFamiliar(productorId, form);
      Alert.alert("Éxito", "Familiar agregado correctamente", [
        { text: "OK", onPress: () => navigation.navigate("Familiares", { refresh: true, productorId, productorNombre }) },
      ]);
    } catch (err: any) {
      const msg = err?.response?.data?.message || "Error al guardar el familiar";
      Alert.alert("Error", msg);
    } finally {
      setSaving(false);
    }
  };

  return (
    <FormScreenLayout
      title={`Familiar de ${productorNombre}`}
      onBack={() => navigation.goBack()}
      onSave={handleSave}
      saving={saving}
    >
      <FormSection title="Datos del Familiar">
        <FormField label="Nombres *">
          <TextInput
            style={[styles.input, { borderColor: colors.disabled, color: colors.text, backgroundColor: colors.surface }]}
            value={form.nombres}
            onChangeText={(v) => updateField("nombres", v)}
            placeholder="Nombres completos"
            placeholderTextColor={colors.placeholder}
          />
        </FormField>

        <SelectField
          label="Parentesco *"
          value={form.parentesco}
          options={PARENTESCO_OPTIONS}
          onSelect={(v) => updateField("parentesco", v)}
        />

        <FormField label="DNI">
          <TextInput
            style={[styles.input, { borderColor: colors.disabled, color: colors.text, backgroundColor: colors.surface }]}
            value={form.dni}
            onChangeText={(v) => updateField("dni", v)}
            placeholder="Número de DNI"
            placeholderTextColor={colors.placeholder}
            keyboardType="numeric"
            maxLength={8}
          />
        </FormField>

        <SelectField
          label="Sexo"
          value={form.sexo}
          options={SEXO_OPTIONS}
          onSelect={(v) => updateField("sexo", v)}
        />

        <DatePickerField
          label="Fecha de Nacimiento"
          value={form.fechaNacimiento}
          onChange={(v) => updateField("fechaNacimiento", v)}
          maximumDate={new Date()}
        />

        <FormField label="Ocupación">
          <TextInput
            style={[styles.input, { borderColor: colors.disabled, color: colors.text, backgroundColor: colors.surface }]}
            value={form.ocupacion}
            onChangeText={(v) => updateField("ocupacion", v)}
            placeholder="Ocupación"
            placeholderTextColor={colors.placeholder}
          />
        </FormField>

        <SelectField
          label="Nivel Educativo"
          value={form.nivelEducativo}
          options={NIVEL_EDUCATIVO_OPTIONS}
          onSelect={(v) => updateField("nivelEducativo", v)}
        />

        <FormField label="Teléfono">
          <TextInput
            style={[styles.input, { borderColor: colors.disabled, color: colors.text, backgroundColor: colors.surface }]}
            value={form.telefono}
            onChangeText={(v) => updateField("telefono", v)}
            placeholder="Número de teléfono"
            placeholderTextColor={colors.placeholder}
            keyboardType="phone-pad"
          />
        </FormField>
      </FormSection>

      <FormSection title="Condición">
        <View style={[styles.switchRow, { borderBottomColor: colors.divider }]}>
          <View style={styles.switchInfo}>
            <Text style={[styles.switchLabel, { color: colors.text }]}>Es dependiente</Text>
            <Text style={[styles.switchHint, { color: colors.textSecondary }]}>El familiar depende económicamente del productor</Text>
          </View>
          <Switch
            value={form.dependiente}
            onValueChange={(v) => updateField("dependiente", v)}
            trackColor={{ false: colors.disabled, true: colors.primaryLight }}
            thumbColor={form.dependiente ? colors.primary : colors.borderLight}
          />
        </View>

        <View style={[styles.switchRow, { borderBottomColor: colors.divider }]}>
          <View style={styles.switchInfo}>
            <Text style={[styles.switchLabel, { color: colors.text }]}>Vive con el productor</Text>
            <Text style={[styles.switchHint, { color: colors.textSecondary }]}>El familiar vive en la misma vivienda</Text>
          </View>
          <Switch
            value={form.viveConProductor}
            onValueChange={(v) => updateField("viveConProductor", v)}
            trackColor={{ false: colors.disabled, true: colors.primaryLight }}
            thumbColor={form.viveConProductor ? colors.primary : colors.borderLight}
          />
        </View>
      </FormSection>
    </FormScreenLayout>
  );
}

const styles = StyleSheet.create({
  input: { borderWidth: 1, borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10, fontSize: 14 },
  switchRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  switchInfo: { flex: 1, marginRight: 12 },
  switchLabel: { fontSize: 14, fontWeight: "500" },
  switchHint: { fontSize: 12, marginTop: 2 },
});
