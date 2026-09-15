export type ColorToken = { light: string; dark: string };

export interface ThemeTokens {
  colors: {
    background: ColorToken;
    surface: ColorToken;
    surfaceElevated: ColorToken;
    primary: ColorToken;
    primaryLight: ColorToken;
    primarySurface: ColorToken;
    success: ColorToken;
    successLight: ColorToken;
    warning: ColorToken;
    warningLight: ColorToken;
    error: ColorToken;
    errorLight: ColorToken;
    info: ColorToken;
    infoLight: ColorToken;
    pink: ColorToken;
    pinkLight: ColorToken;
    purple: ColorToken;
    purpleLight: ColorToken;
    text: ColorToken;
    textSecondary: ColorToken;
    textMuted: ColorToken;
    textInverse: ColorToken;
    border: ColorToken;
    borderLight: ColorToken;
    divider: ColorToken;
    placeholder: ColorToken;
    disabled: ColorToken;
    accent: ColorToken;
    accentLight: ColorToken;
    danger: ColorToken;
    dangerLight: ColorToken;
    surfaceSecondary: ColorToken;
  };
  typography: {
    size: {
      xs: number;
      sm: number;
      base: number;
      md: number;
      lg: number;
      xl: number;
      xxl: number;
      title: number;
      hero: number;
      display: number;
    };
    weight: {
      regular: "400";
      medium: "500";
      semibold: "600";
      bold: "700";
    };
  };
  spacing: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
    xxl: number;
    xxxl: number;
  };
  borderRadius: {
    sm: number;
    md: number;
    lg: number;
    xl: number;
    xxl: number;
    full: number;
  };
  shadow: {
    sm: { shadowColor: string; shadowOffset: { width: number; height: number }; shadowOpacity: number; shadowRadius: number; elevation: number };
    md: { shadowColor: string; shadowOffset: { width: number; height: number }; shadowOpacity: number; shadowRadius: number; elevation: number };
    lg: { shadowColor: string; shadowOffset: { width: number; height: number }; shadowOpacity: number; shadowRadius: number; elevation: number };
  };
  bottomTabBarHeight: number;
}

export const tokens: ThemeTokens = {
  colors: {
    background: { light: "#F9FAFB", dark: "#111827" },
    surface: { light: "#FFFFFF", dark: "#1F2937" },
    surfaceElevated: { light: "#FFFFFF", dark: "#283548" },

    primary: { light: "#166534", dark: "#22C55E" },
    primaryLight: { light: "#DCFCE7", dark: "#064E3B" },
    primarySurface: { light: "#ECFDF5", dark: "#022C22" },

    success: { light: "#16A34A", dark: "#4ADE80" },
    successLight: { light: "#DCFCE7", dark: "#064E3B" },
    warning: { light: "#D97706", dark: "#FBBF24" },
    warningLight: { light: "#FEF3C7", dark: "#78350F" },
    error: { light: "#DC2626", dark: "#F87171" },
    errorLight: { light: "#FEE2E2", dark: "#7F1D1D" },
    info: { light: "#2563EB", dark: "#60A5FA" },
    infoLight: { light: "#DBEAFE", dark: "#1E3A5F" },
    pink: { light: "#DB2777", dark: "#F472B6" },
    pinkLight: { light: "#FCE7F3", dark: "#831843" },
    purple: { light: "#6366F1", dark: "#A78BFA" },
    purpleLight: { light: "#EEF2FF", dark: "#312E81" },

    text: { light: "#111827", dark: "#F9FAFB" },
    textSecondary: { light: "#6B7280", dark: "#9CA3AF" },
    textMuted: { light: "#9CA3AF", dark: "#6B7280" },
    textInverse: { light: "#FFFFFF", dark: "#111827" },

    border: { light: "#E5E7EB", dark: "#374151" },
    borderLight: { light: "#F3F4F6", dark: "#1F2937" },
    divider: { light: "#F3F4F6", dark: "#374151" },

    surfaceSecondary: { light: "#F9FAFB", dark: "#1F2937" },
    accent: { light: "#166534", dark: "#22C55E" },
    accentLight: { light: "#DCFCE7", dark: "#064E3B" },
    danger: { light: "#DC2626", dark: "#F87171" },
    dangerLight: { light: "#FEE2E2", dark: "#7F1D1D" },
    placeholder: { light: "#9CA3AF", dark: "#6B7280" },
    disabled: { light: "#D1D5DB", dark: "#4B5563" },
  },

  typography: {
    size: {
      xs: 10,
      sm: 11,
      base: 12,
      md: 13,
      lg: 14,
      xl: 15,
      xxl: 16,
      title: 20,
      hero: 24,
      display: 32,
    },
    weight: {
      regular: "400",
      medium: "500",
      semibold: "600",
      bold: "700",
    },
  },

  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    xxl: 24,
    xxxl: 32,
  },

  borderRadius: {
    sm: 8,
    md: 10,
    lg: 12,
    xl: 14,
    xxl: 16,
    full: 999,
  },

  shadow: {
    sm: {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.04,
      shadowRadius: 2,
      elevation: 1,
    },
    md: {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 4,
      elevation: 2,
    },
    lg: {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.08,
      shadowRadius: 8,
      elevation: 4,
    },
  },

  bottomTabBarHeight: 80,
};

export type ResolvedColors = { [K in keyof ThemeTokens["colors"]]: string };

export function resolveColors(mode: "light" | "dark"): ResolvedColors {
  const result = {} as ResolvedColors;
  for (const key of Object.keys(tokens.colors) as Array<keyof ThemeTokens["colors"]>) {
    result[key] = tokens.colors[key][mode];
  }
  return result;
}
