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
    primary: "#2563eb",
    primaryHover: "#1d4ed8",
    secondary: "#64748b",
    background: "#f8fafc",
    backgroundElevated: "#ffffff",
    surface: "#ffffff",
    surfaceHover: "#f1f5f9",
    text: "#0f172a",
    textSecondary: "#475569",
    textTertiary: "#94a3b8",
    border: "#e2e8f0",
    borderLight: "#f1f5f9",
    accent: "#8b5cf6",
    accentLight: "#a78bfa",
    success: "#10b981",
    error: "#ef4444",
    warning: "#f59e0b",
    gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  },
  shadows: {
    sm: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
    md: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
    lg: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
    xl: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
  },
  glassmorphism: css`
    background: rgba(255, 255, 255, 0.8);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border: 1px solid rgba(255, 255, 255, 0.3);
  `,
  card: css`
    background: #ffffff;
    border: 1px solid #e2e8f0;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 12px 24px -4px rgba(0, 0, 0, 0.12);
      border-color: #cbd5e1;
    }
  `,
};

export const darkTheme = {
  colors: {
    primary: "#3b82f6",
    primaryHover: "#2563eb",
    secondary: "#64748b",
    background: "#0f172a",
    backgroundElevated: "#1e293b",
    surface: "#1e293b",
    surfaceHover: "#334155",
    text: "#f1f5f9",
    textSecondary: "#cbd5e1",
    textTertiary: "#64748b",
    border: "#334155",
    borderLight: "#1e293b",
    accent: "#a78bfa",
    accentLight: "#c4b5fd",
    success: "#34d399",
    error: "#f87171",
    warning: "#fbbf24",
    gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  },
  shadows: {
    sm: "0 1px 2px 0 rgba(0, 0, 0, 0.5)",
    md: "0 4px 6px -1px rgba(0, 0, 0, 0.5), 0 2px 4px -1px rgba(0, 0, 0, 0.3)",
    lg: "0 10px 15px -3px rgba(0, 0, 0, 0.5), 0 4px 6px -2px rgba(0, 0, 0, 0.3)",
    xl: "0 20px 25px -5px rgba(0, 0, 0, 0.5), 0 10px 10px -5px rgba(0, 0, 0, 0.3)",
  },
  glassmorphism: css`
    background: rgba(30, 41, 59, 0.8);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border: 1px solid rgba(255, 255, 255, 0.1);
  `,
  card: css`
    background: #1e293b;
    border: 1px solid #334155;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 12px 24px -4px rgba(0, 0, 0, 0.8);
      border-color: #475569;
    }
  `,
};

export const theme = darkTheme;
