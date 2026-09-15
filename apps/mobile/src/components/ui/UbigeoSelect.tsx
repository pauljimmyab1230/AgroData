import React from "react";
import { View, Text, ActivityIndicator, StyleSheet } from "react-native";
import { SelectField } from "./SelectField";

interface UbigeoSelectProps {
  departamento: string;
  provincia: string;
  distrito: string;
  departamentos: string[];
  provincias: string[];
  distritos: { distrito: string; ubigeo: string }[];
  loadingDeptos: boolean;
  loadingProvs: boolean;
  loadingDists: boolean;
  onDepartamentoChange: (value: string) => void;
  onProvinciaChange: (value: string) => void;
  onDistritoChange: (value: string) => void;
}

export function UbigeoSelect({
  departamento, provincia, distrito,
  departamentos, provincias, distritos,
  loadingDeptos, loadingProvs, loadingDists,
  onDepartamentoChange, onProvinciaChange, onDistritoChange,
}: UbigeoSelectProps) {
  return (
    <View>
      <View style={styles.field}>
        <View style={styles.row}>
          <Text style={styles.label}>Departamento</Text>
          {loadingDeptos && <ActivityIndicator size="small" color="#166534" />}
        </View>
        <SelectField label="" value={departamento} options={departamentos} onSelect={onDepartamentoChange} />
      </View>

      <View style={styles.field}>
        <View style={styles.row}>
          <Text style={styles.label}>Provincia</Text>
          {loadingProvs && <ActivityIndicator size="small" color="#166534" />}
        </View>
        <SelectField label="" value={provincia} options={provincias} onSelect={onProvinciaChange} />
      </View>

      <View style={styles.field}>
        <View style={styles.row}>
          <Text style={styles.label}>Distrito</Text>
          {loadingDists && <ActivityIndicator size="small" color="#166534" />}
        </View>
        <SelectField label="" value={distrito} options={distritos.map((d) => d.distrito)} onSelect={onDistritoChange} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  field: { marginBottom: 12 },
  row: { flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 4 },
  label: { fontSize: 13, fontWeight: "500", color: "#374151" },
});
