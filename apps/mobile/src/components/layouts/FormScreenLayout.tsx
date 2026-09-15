import React, { type ReactElement } from "react";
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ArrowLeft, ChevronLeft, ChevronRight, Save, Trash2 } from "lucide-react-native";
import { useTheme } from "../../contexts/ThemeContext";
import { tokens } from "../../theme/tokens";

interface FormScreenLayoutProps {
  title: string;
  isEdit?: boolean;
  steps?: string[];
  currentStep?: number;
  onStepChange?: (step: number) => void;
  onBack: () => void;
  onSave: () => void;
  onDelete?: () => void;
  saving?: boolean;
  children: React.ReactNode;
}

export function FormScreenLayout({
  title,
  isEdit,
  steps,
  currentStep = 0,
  onStepChange,
  onBack,
  onSave,
  onDelete,
  saving,
  children,
}: FormScreenLayoutProps) {
  const { colors } = useTheme();
  const hasSteps = steps && steps.length > 1;
  const isLastStep = hasSteps ? currentStep === steps.length - 1 : true;

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]} edges={["top"]}>
      <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.borderLight }]}>
        <TouchableOpacity
          onPress={onBack}
          style={[styles.backBtn, { backgroundColor: colors.borderLight }]}
          accessibilityLabel="Volver"
          accessibilityRole="button"
        >
          <ArrowLeft size={20} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>
          {isEdit ? "Editar" : "Nueva"} {title}
        </Text>
      </View>

      {hasSteps ? (
        <View style={[styles.stepper, { backgroundColor: colors.surface, borderBottomColor: colors.borderLight }]}>
          {steps.map((step, i) => {
            const isActive = i === currentStep;
            const isDone = i < currentStep;
            return (
              <TouchableOpacity
                key={i}
                style={[
                  styles.stepPill,
                  {
                    backgroundColor: isActive
                      ? colors.primary
                      : isDone
                      ? colors.primaryLight
                      : colors.borderLight,
                  },
                ]}
                onPress={() => onStepChange?.(i)}
                accessibilityLabel={`Paso ${i + 1}: ${step}`}
                accessibilityRole="button"
              >
                <View
                  style={[
                    styles.stepNumberCircle,
                    {
                      backgroundColor: isActive
                        ? "rgba(255,255,255,0.25)"
                        : isDone
                        ? colors.primary
                        : colors.disabled,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.stepNumber,
                      {
                        color: isActive
                          ? colors.textInverse
                          : isDone
                          ? colors.textInverse
                          : colors.textSecondary,
                      },
                    ]}
                  >
                    {isDone ? "✓" : i + 1}
                  </Text>
                </View>
                <Text
                  style={[
                    styles.stepLabel,
                    {
                      color: isActive
                        ? colors.textInverse
                        : isDone
                        ? colors.primary
                        : colors.textMuted,
                    },
                  ]}
                  numberOfLines={1}
                >
                  {step}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      ) : null}

      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={styles.keyboardView}>
        <ScrollView style={styles.scrollView} keyboardShouldPersistTaps="handled">
          {children}
          <View style={styles.bottomSpacer} />
        </ScrollView>
      </KeyboardAvoidingView>

      <View style={[styles.footer, { backgroundColor: colors.surface, borderTopColor: colors.borderLight }]}>
        {hasSteps && currentStep > 0 ? (
          <TouchableOpacity
            style={[styles.prevBtn, { borderColor: colors.disabled }]}
            onPress={() => onStepChange?.(currentStep - 1)}
            accessibilityLabel="Paso anterior"
            accessibilityRole="button"
          >
            <ChevronLeft size={18} color={colors.text} />
            <Text style={[styles.prevBtnText, { color: colors.text }]}>Anterior</Text>
          </TouchableOpacity>
        ) : null}
        <View style={styles.footerSpacer} />
        {isLastStep ? (
          <TouchableOpacity
            style={[styles.saveBtn, { backgroundColor: colors.primary }]}
            onPress={onSave}
            disabled={saving}
            accessibilityLabel="Guardar"
            accessibilityRole="button"
          >
            <Save size={18} color={colors.textInverse} />
            <Text style={[styles.saveBtnText, { color: colors.textInverse }]}>
              {saving ? "Guardando..." : "Guardar"}
            </Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={[styles.nextBtn, { backgroundColor: colors.primary }]}
            onPress={() => onStepChange?.(currentStep + 1)}
            accessibilityLabel="Siguiente paso"
            accessibilityRole="button"
          >
            <Text style={[styles.nextBtnText, { color: colors.textInverse }]}>Siguiente</Text>
            <ChevronRight size={18} color={colors.textInverse} />
          </TouchableOpacity>
        )}
      </View>

      {isEdit && onDelete ? (
        <View style={[styles.deleteContainer, { backgroundColor: colors.surface, borderTopColor: colors.borderLight }]}>
          <TouchableOpacity
            style={[styles.deleteBtn, { backgroundColor: colors.errorLight, borderColor: colors.error + "40" }]}
            onPress={onDelete}
            accessibilityLabel="Eliminar"
            accessibilityRole="button"
          >
            <Trash2 size={18} color={colors.error} />
            <Text style={[styles.deleteBtnText, { color: colors.error }]}>Eliminar</Text>
          </TouchableOpacity>
        </View>
      ) : null}
    </SafeAreaView>
  );
}

export function FormSection({
  title,
  subtitle,
  icon: Icon,
  iconBg,
  iconColor,
  children,
}: {
  title: string;
  subtitle?: string;
  icon?: React.ElementType;
  iconBg?: string;
  iconColor?: string;
  children: React.ReactNode;
}) {
  const { colors } = useTheme();
  const SectionIcon = Icon;

  return (
    <View style={[formSectionStyles.section, { backgroundColor: colors.surface }]}>
      <View style={formSectionStyles.sectionHeader}>
        {SectionIcon ? (
          <View style={[formSectionStyles.sectionIcon, { backgroundColor: iconBg ?? colors.primaryLight }]}>
            <SectionIcon size={20} color={iconColor ?? colors.primary} />
          </View>
        ) : null}
        <View>
          <Text style={[formSectionStyles.sectionTitle, { color: colors.text }]}>{title}</Text>
          {subtitle ? (
            <Text style={[formSectionStyles.sectionSubtitle, { color: colors.textSecondary }]}>{subtitle}</Text>
          ) : null}
        </View>
      </View>
      {children}
    </View>
  );
}

export function FormField({
  label,
  children,
  row,
}: {
  label?: string;
  children: React.ReactNode;
  row?: boolean;
}) {
  const { colors } = useTheme();

  return (
    <View style={[formFieldStyles.field, row ? formFieldStyles.row : undefined]}>
      {label ? <Text style={[formFieldStyles.label, { color: colors.text }]}>{label}</Text> : null}
      <View style={row ? { flex: 1 } : undefined}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    flex: 1,
    fontSize: 17,
    fontWeight: "600",
    marginLeft: 12,
  },
  stepper: {
    flexDirection: "row",
    paddingHorizontal: 12,
    paddingVertical: 12,
    gap: 8,
    borderBottomWidth: 1,
  },
  stepPill: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 10,
    gap: 8,
  },
  stepNumberCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  stepNumber: {
    fontSize: 12,
    fontWeight: "700",
  },
  stepLabel: {
    fontSize: 12,
    fontWeight: "600",
    flexShrink: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  bottomSpacer: {
    paddingBottom: 40,
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    position: "absolute",
    bottom: 80,
    left: 0,
    right: 0,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 4,
  },
  footerSpacer: {
    flex: 1,
  },
  prevBtn: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    gap: 4,
  },
  prevBtnText: {
    fontSize: 14,
    fontWeight: "500",
  },
  nextBtn: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
    gap: 4,
  },
  nextBtnText: {
    fontSize: 14,
    fontWeight: "600",
  },
  saveBtn: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
    gap: 6,
  },
  saveBtnText: {
    fontSize: 14,
    fontWeight: "600",
  },
  deleteContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  deleteBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    gap: 8,
  },
  deleteBtnText: {
    fontSize: 15,
    fontWeight: "600",
  },
});

const formSectionStyles = StyleSheet.create({
  section: {
    marginTop: 16,
    marginHorizontal: 16,
    borderRadius: 14,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 16,
  },
  sectionIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
  },
  sectionSubtitle: {
    fontSize: 12,
    marginTop: 2,
  },
});

const formFieldStyles = StyleSheet.create({
  field: {
    marginBottom: 14,
  },
  row: {
    flexDirection: "row",
    gap: 12,
  },
  label: {
    fontSize: 13,
    fontWeight: "500",
    marginBottom: 6,
  },
});
