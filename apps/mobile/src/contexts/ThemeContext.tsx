import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { resolveColors, type ResolvedColors } from "../theme/tokens";

interface ThemeContextType {
  isDarkMode: boolean;
  toggleTheme: () => void;
  colors: ResolvedColors;
}

const lightColors = resolveColors("light");
const darkColors = resolveColors("dark");

const ThemeContext = createContext<ThemeContextType>({
  isDarkMode: false,
  toggleTheme: () => {},
  colors: lightColors,
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem("theme").then((theme) => {
      if (theme === "dark") setIsDarkMode(true);
    });
  }, []);

  const toggleTheme = () => {
    const newValue = !isDarkMode;
    setIsDarkMode(newValue);
    AsyncStorage.setItem("theme", newValue ? "dark" : "light");
  };

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme, colors: isDarkMode ? darkColors : lightColors }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
