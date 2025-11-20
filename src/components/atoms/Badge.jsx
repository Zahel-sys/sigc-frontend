import React from "react";
import { THEME } from "../../config/theme";

/**
 * Badge - Componente atómico para insignias
 * Responsabilidad: Mostrar estados y etiquetas
 * Props: variant, children, icon
 */
export function Badge({ variant = "default", children, icon = null }) {
  const variants = {
    default: { bg: THEME.gray[300], color: THEME.gray[900] },
    primary: { bg: THEME.primary.main, color: "white" },
    secondary: { bg: THEME.secondary.main, color: "white" },
    success: { bg: THEME.success.main, color: "white" },
    danger: { bg: THEME.danger.main, color: "white" },
    warning: { bg: THEME.warning.main, color: "white" },
    info: { bg: "#0dcaf0", color: "white" }
  };

  const style = variants[variant] || variants.default;

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "0.4rem",
        padding: "0.4rem 0.8rem",
        backgroundColor: style.bg,
        color: style.color,
        borderRadius: THEME.borderRadius.full,
        fontSize: "0.8rem",
        fontWeight: "600",
        whiteSpace: "nowrap"
      }}
    >
      {icon && <i className={icon}></i>}
      {children}
    </span>
  );
}
