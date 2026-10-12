import React from "react";
import { Modal, View, Text, TouchableOpacity } from "react-native";

interface ConfirmDialogProps {
  visible: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
  destructive?: boolean;
}

export function ConfirmDialog({
  visible,
  title,
  message,
  confirmLabel = "Confirmar",
  cancelLabel = "Cancelar",
  onConfirm,
  onCancel,
  destructive = false,
}: ConfirmDialogProps) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancel}>
      <View style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.4)", justifyContent: "center", alignItems: "center", padding: 20 }}>
        <View style={{ width: "100%", maxWidth: 340, backgroundColor: "#FFF", borderRadius: 12, padding: 16 }}>
          <Text style={{ fontSize: 16, fontWeight: "600", color: "#111827" }}>{title}</Text>
          <Text style={{ marginTop: 6, fontSize: 13, color: "#4B5563" }}>{message}</Text>
          <View style={{ flexDirection: "row", justifyContent: "flex-end", marginTop: 16 }}>
            <TouchableOpacity onPress={onCancel} style={{ paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8, backgroundColor: "#F3F4F6", marginRight: 8 }}>
              <Text style={{ fontSize: 13, color: "#111827" }}>{cancelLabel}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={onConfirm} style={{ paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8, backgroundColor: destructive ? "#DC2626" : "#16A34A" }}>
              <Text style={{ fontSize: 13, color: "#FFF" }}>{confirmLabel}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}