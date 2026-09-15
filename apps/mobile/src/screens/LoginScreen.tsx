import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, KeyboardAvoidingView, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Sprout, Eye, EyeOff } from "lucide-react-native";
import { login } from "../services/auth";

interface LoginScreenProps {
  onLoginSuccess: () => void;
}

export default function LoginScreen({ onLoginSuccess }: LoginScreenProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert("Error", "Ingresa tu correo y contraseña");
      return;
    }
    setLoading(true);
    try {
      await login(email.trim(), password);
      onLoginSuccess();
    } catch (err: any) {
      const msg = err?.response?.data?.message || "Credenciales incorrectas";
      Alert.alert("Error de acceso", msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={styles.container}>
        <View style={styles.header}>
          <View style={styles.logo}>
            <Sprout size={40} color="#166534" />
          </View>
          <Text style={styles.title}>AgroData</Text>
          <Text style={styles.subtitle}>Gestión cooperativa agrícola</Text>
        </View>

        <View style={styles.form}>
          <View>
            <Text style={styles.label}>Correo electrónico</Text>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholder="tu@correo.com"
              placeholderTextColor="#9CA3AF"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          <View>
            <Text style={styles.label}>Contraseña</Text>
            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.passwordInput}
                value={password}
                onChangeText={setPassword}
                placeholder="Tu contraseña"
                placeholderTextColor="#9CA3AF"
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeBtn}>
                {showPassword ? <EyeOff size={20} color="#6B7280" /> : <Eye size={20} color="#6B7280" />}
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity
            style={[styles.loginBtn, loading && styles.loginBtnDisabled]}
            onPress={handleLogin}
            disabled={loading}
          >
            <Text style={styles.loginBtnText}>{loading ? "Ingresando..." : "Iniciar Sesión"}</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.footer}>Sistema de gestión para cooperativas agrícolas</Text>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#001D39" },
  container: { flex: 1, justifyContent: "center", paddingHorizontal: 32 },
  header: { alignItems: "center", marginBottom: 48 },
  logo: {
    width: 80, height: 80, borderRadius: 24, backgroundColor: "#FFFFFF",
    alignItems: "center", justifyContent: "center", marginBottom: 16,
  },
  title: { fontSize: 32, fontWeight: "bold", color: "#FFFFFF" },
  subtitle: { marginTop: 4, fontSize: 14, color: "#9CA3AF" },
  form: { gap: 16 },
  label: { fontSize: 13, fontWeight: "500", color: "#D1D5DB", marginBottom: 6 },
  input: {
    backgroundColor: "#FFFFFF", borderRadius: 10,
    paddingHorizontal: 16, paddingVertical: 14, fontSize: 15, color: "#111827",
  },
  passwordContainer: {
    backgroundColor: "#FFFFFF", borderRadius: 10, flexDirection: "row", alignItems: "center",
  },
  passwordInput: { flex: 1, paddingHorizontal: 16, paddingVertical: 14, fontSize: 15, color: "#111827" },
  eyeBtn: { paddingHorizontal: 14, paddingVertical: 14 },
  loginBtn: {
    backgroundColor: "#166534", borderRadius: 10, paddingVertical: 16,
    alignItems: "center", marginTop: 8,
  },
  loginBtnDisabled: { opacity: 0.6 },
  loginBtnText: { color: "#FFFFFF", fontSize: 16, fontWeight: "600" },
  footer: { textAlign: "center", color: "#6B7280", fontSize: 12, marginTop: 40 },
});
