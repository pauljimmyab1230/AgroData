import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Sun, Moon, LogOut, ArrowLeft } from "lucide-react-native";
import { useTheme } from "../../contexts/ThemeContext";

interface CustomHeaderProps {
  userName: string;
  userRole: string;
  title?: string;
  showBack?: boolean;
  isDarkMode?: boolean;
  onToggleTheme?: () => void;
  onLogout?: () => void;
  onBack?: () => void;
}

export default function CustomHeader({ userName, userRole, title, showBack = false, isDarkMode = false, onToggleTheme, onLogout, onBack }: CustomHeaderProps) {
  const { colors } = useTheme();
  const initials = userName.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);

  return (
    <View style={[styles.container, { backgroundColor: colors.surface, borderBottomColor: colors.borderLight }]}>
      {showBack ? (
        <TouchableOpacity style={[styles.backBtn, { backgroundColor: colors.borderLight }]} onPress={onBack}>
          <ArrowLeft size={20} color={colors.text} />
        </TouchableOpacity>
      ) : (
        <View style={styles.userInfo}>
          <View style={[styles.avatar, { backgroundColor: colors.primary }]}>
            <Text style={[styles.avatarText, { color: colors.textInverse }]}>{initials}</Text>
          </View>
          <View style={styles.userDetails}>
            <Text style={[styles.userName, { color: colors.text }]}>{userName}</Text>
            <Text style={[styles.userRole, { color: colors.textSecondary }]}>{userRole}</Text>
          </View>
        </View>
      )}

      {title ? (
        <Text style={[styles.title, { color: colors.text }]} numberOfLines={1}>{title}</Text>
      ) : null}

      <View style={styles.actions}>
        <TouchableOpacity style={[styles.iconBtn, { backgroundColor: colors.borderLight }]} onPress={onToggleTheme}>
          {isDarkMode ? <Sun size={20} color="#FCD34D" /> : <Moon size={20} color={colors.textSecondary} />}
        </TouchableOpacity>
        <TouchableOpacity style={[styles.iconBtn, { backgroundColor: colors.borderLight }]} onPress={onLogout}>
          <LogOut size={20} color={colors.textSecondary} />
        </TouchableOpacity>
      </View>
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
    paddingBottom: 16,
    borderBottomWidth: 1,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    fontSize: 16,
    fontWeight: "700",
  },
  userDetails: {
    gap: 2,
  },
  userName: {
    fontSize: 16,
    fontWeight: "600",
  },
  userRole: {
    fontSize: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    flex: 1,
    textAlign: "center",
    marginHorizontal: 8,
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
});
