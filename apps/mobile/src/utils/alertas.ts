import { Alert, Platform } from "react-native";

type BotonAlerta = {
  text?: string;
  style?: "default" | "cancel" | "destructive";
  onPress?: () => void;
};

type AlertFn = (titulo?: string, mensaje?: string, botones?: BotonAlerta[]) => void;

const alertOriginal = Alert.alert.bind(Alert) as AlertFn;

function mostrarEnWeb(titulo: string, mensaje?: string, botones?: BotonAlerta[]): void {
  if (typeof window === "undefined") return;
  const texto = mensaje ? `${titulo}\n\n${mensaje}` : titulo;
  const lista = botones ?? [];
  if (lista.length <= 1) {
    window.alert(texto);
    lista[0]?.onPress?.();
    return;
  }
  const aceptar = window.confirm(texto);
  const boton = aceptar
    ? (lista.find((b) => b.style !== "cancel") ?? lista[lista.length - 1])
    : (lista.find((b) => b.style === "cancel") ?? lista[0]);
  boton?.onPress?.();
}

/**
 * `Alert.alert` de react-native-web es un no-op: en web los diálogos y las
 * confirmaciones no se mostraban (imposible hacer logout, confirmar borrados o
 * navegar tras guardar). Este shim los resuelve con window.alert/confirm.
 * Debe instalarse antes de renderizar cualquier pantalla.
 */
export function instalarCompatAlertas(): void {
  if (Platform.OS !== "web") return;
  (Alert as unknown as { alert: AlertFn }).alert = (titulo?: string, mensaje?: string, botones?: BotonAlerta[]) => {
    mostrarEnWeb(titulo ?? "", mensaje, botones);
  };
}

/** Pide confirmación al usuario. Devuelve `true` si acepta (multiplataforma). */
export function confirmar(
  titulo: string,
  mensaje: string,
  textoAceptar = "Aceptar",
): Promise<boolean> {
  return new Promise((resolve) => {
    alertOriginal(titulo, mensaje, [
      { text: "Cancelar", style: "cancel", onPress: () => resolve(false) },
      { text: textoAceptar, style: "destructive", onPress: () => resolve(true) },
    ]);
  });
}
