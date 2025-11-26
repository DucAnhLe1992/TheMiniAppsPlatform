import { css } from "styled-components";
import type { DefaultTheme as DT, RuleSet } from "styled-components";

declare module "styled-components" {
  export interface DefaultTheme extends DT {
    colors: {
      primary: string;
      primaryHover: string;
      secondary: string;
      background: string;
      backgroundElevated: string;
      surface: string;
      surfaceHover: string;
      text: string;
      textSecondary: string;
      textTertiary: string;
      border: string;
      borderLight: string;
      accent: string;
      accentLight: string;
      success: string;
      error: string;
      warning: string;
      gradient: string;
    };
    shadows: {
      sm: string;
      md: string;
      lg: string;
      xl: string;
    };
    glassmorphism: RuleSet<object>;
    card: RuleSet<object>;
  }
}

export const lightTheme = {
  colors: {
    primary: "#6366f1",
    primaryHover: "#4f46e5",
    secondary: "#64748b",
    background: "#d4d9df",
    backgroundElevated: "#edf1f6",
    surface: "#ffffff",
    surfaceHover: "#dae0e7",
    text: "#1a1d29",
    textSecondary: "#4a5160",
    textTertiary: "#7a8390",
    border: "#b0bac6",
    borderLight: "#c3ccd5",
    accent: "#8b5cf6",
    accentLight: "#a78bfa",
    success: "#10b981",
    error: "#ef4444",
    warning: "#f59e0b",
    gradient: "linear-gradient(135deg, #5f70ee 0%, #7f5fe0 100%)",
  },
  shadows: {
    sm: "0 1px 2px 0 rgba(15, 23, 42, 0.025)",
    md: "0 2px 8px -2px rgba(15, 23, 42, 0.07)",
    lg: "0 8px 24px -4px rgba(15, 23, 42, 0.11)",
    xl: "0 16px 40px -8px rgba(15, 23, 42, 0.14)",
  },
  glassmorphism: css`
    background: rgba(255, 255, 255, 0.9);
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
    border: 1px solid rgba(15, 23, 42, 0.08);
  `,
  card: css`
    background: #ffffff;
    border: 1px solid #b0bac6;
    border-radius: 20px;
    box-shadow:
      0 2px 8px rgba(15, 23, 42, 0.06),
      inset 0 1px 0 rgba(255, 255, 255, 0.7);
    transition: box-shadow 0.25s ease, transform 0.2s ease, border-color 0.25s ease;

    &:hover {
      transform: translateY(-3px);
      box-shadow:
        0 14px 30px -10px rgba(15, 23, 42, 0.16),
        inset 0 1px 0 rgba(255, 255, 255, 0.7);
      border-color: #a7b2c0;
    }
  `,
};

export const darkTheme = {
  colors: {
    primary: "#6366f1",
    primaryHover: "#4f46e5",
    secondary: "#64748b",
    background: "#0a0e1a",
    backgroundElevated: "#161b2e",
    surface: "#161b2e",
    surfaceHover: "#1e2437",
    text: "#f8fafc",
    textSecondary: "#cbd5e1",
    textTertiary: "#64748b",
    border: "#1e2437",
    borderLight: "#161b2e",
    accent: "#a78bfa",
    accentLight: "#c4b5fd",
    success: "#34d399",
    error: "#f87171",
    warning: "#fbbf24",
    gradient: "linear-gradient(135deg, #5b6dee 0%, #7a5ad8 100%)",
  },
  shadows: {
    sm: "0 1px 2px 0 rgba(0, 0, 0, 0.25)",
    md: "0 2px 8px -2px rgba(0, 0, 0, 0.35)",
    lg: "0 8px 24px -4px rgba(0, 0, 0, 0.45)",
    xl: "0 16px 40px -8px rgba(0, 0, 0, 0.5)",
  },
  glassmorphism: css`
    background: rgba(22, 27, 46, 0.9);
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
    border: 1px solid rgba(255, 255, 255, 0.08);
  `,
  card: css`
    background: #161b2e;
    border: 1px solid #22293f;
    border-radius: 20px;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.35);
    transition: box-shadow 0.25s ease, transform 0.2s ease, border-color 0.25s ease;

    &:hover {
      transform: translateY(-3px);
      box-shadow: 0 10px 24px -6px rgba(0, 0, 0, 0.6);
      border-color: #2a3350;
    }
  `,
};

// Note: Prefer ThemeContext for switching mode; keep this for legacy imports.
export const theme = darkTheme;
