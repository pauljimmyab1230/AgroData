import { useTheme } from "../contexts/ThemeContext";
import { tokens, resolveColors, type ResolvedColors, type ThemeTokens } from "./tokens";

export { tokens, resolveColors };
export type { ResolvedColors, ThemeTokens };

export function useColors(): ResolvedColors {
  const { isDarkMode } = useTheme();
  return resolveColors(isDarkMode ? "dark" : "light");
}
