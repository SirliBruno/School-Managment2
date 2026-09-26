/**
 * Administrative Absence Platform Design Tokens
 * Standard tokens for Spacing, Radius, Typography, Shadows, and Color references
 */

export const tokens = {
  colors: {
    primary: {
      light: "#f0fdfa",
      main: "#0d9488",
      dark: "#0f766e",
      contrast: "#ffffff",
    },
    success: {
      light: "#ecfdf5",
      main: "#059669",
      dark: "#065f46",
      contrast: "#ffffff",
    },
    warning: {
      light: "#fffbeb",
      main: "#d97706",
      dark: "#92400e",
      contrast: "#ffffff",
    },
    danger: {
      light: "#fff1f2",
      main: "#e11d48",
      dark: "#9f1239",
      contrast: "#ffffff",
    },
    neutral: {
      background: "#f8fafc",
      card: "#ffffff",
      border: "#e2e8f0",
      borderSubtle: "#f1f5f9",
      textPrimary: "#0f172a",
      textSecondary: "#475569",
      textMuted: "#94a3b8",
    },
  },

  spacing: {
    xs: "4px",    // 1
    sm: "8px",    // 2
    md: "12px",   // 3
    lg: "16px",   // 4
    xl: "24px",   // 6
    "2xl": "32px",// 8
    "3xl": "48px",// 12
  },

  radius: {
    sm: "8px",    // rounded-lg
    md: "12px",   // rounded-xl
    lg: "16px",   // rounded-2xl
    xl: "24px",   // rounded-3xl
    full: "9999px",
  },

  shadows: {
    card: "0 1px 3px 0 rgb(0 0 0 / 0.05), 0 1px 2px -1px rgb(0 0 0 / 0.05)",
    cardHover: "0 4px 6px -1px rgb(0 0 0 / 0.07), 0 2px 4px -2px rgb(0 0 0 / 0.05)",
    modal: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
    floating: "0 10px 15px -3px rgb(0 0 0 / 0.08), 0 4px 6px -4px rgb(0 0 0 / 0.05)",
  },

  typography: {
    pageTitle: "text-xl md:text-2xl font-black text-slate-900 tracking-tight leading-tight",
    sectionTitle: "text-base md:text-lg font-bold text-slate-900 leading-snug",
    cardTitle: "text-sm md:text-base font-bold text-slate-900 leading-normal",
    body: "text-xs md:text-sm text-slate-700 leading-relaxed",
    caption: "text-[11px] text-slate-500 font-medium leading-normal",
    helperText: "text-xs text-slate-500 leading-normal",
    errorText: "text-xs text-rose-600 font-medium leading-normal",
  },
} as const;

export type DesignTokens = typeof tokens;
