import React from "react";
import { THEME } from "../../config/theme";

/**
 * Card - Componente atómico para tarjetas
 * Responsabilidad: Contenedor reutilizable con estilos consistentes
 * Props: title, children, variant, onClick, hoverable
 */
export function Card({
  title,
  children,
  variant = "default",
  onClick = null,
  hoverable = false,
  icon = null,
  footer = null
}) {
  const variants = {
    default: {
      bg: "white",
      border: THEME.gray[200],
      shadow: `0 2px 8px ${THEME.gray[300]}`
    },
    primary: {
      bg: THEME.primary.gradient,
      border: THEME.primary.main,
      shadow: `0 4px 12px ${THEME.primary.shadowColor}`,
      color: "white"
    },
    secondary: {
      bg: THEME.secondary.gradient,
      border: THEME.secondary.main,
      shadow: `0 4px 12px ${THEME.secondary.shadowColor}`,
      color: "white"
    }
  };

  const style = variants[variant] || variants.default;

  return (
    <div
      onClick={onClick}
      style={{
        background: style.bg,
        border: `1px solid ${style.border}`,
        borderRadius: THEME.borderRadius.lg,
        boxShadow: style.shadow,
        overflow: "hidden",
        transition: "all 0.3s ease",
        cursor: hoverable || onClick ? "pointer" : "default"
      }}
      onMouseEnter={(e) => {
        if (hoverable) {
          e.currentTarget.style.transform = "translateY(-8px)";
          e.currentTarget.style.boxShadow = `0 8px 20px ${style.shadow}`;
        }
      }}
      onMouseLeave={(e) => {
        if (hoverable) {
          e.currentTarget.style.transform = "translateY(0)";
          e.currentTarget.style.boxShadow = style.shadow;
        }
      }}
    >
      {title && (
        <div
          style={{
            padding: "1.5rem",
            borderBottom: `1px solid ${style.border}`,
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
            color: style.color || THEME.gray[900],
            fontWeight: "700",
            fontSize: "1.1rem"
          }}
        >
          {icon && <i className={icon}></i>}
          {title}
        </div>
      )}
      <div style={{ padding: "1.5rem", color: style.color }}>
        {children}
      </div>
      {footer && (
        <div
          style={{
            padding: "1rem 1.5rem",
            borderTop: `1px solid ${style.border}`,
            backgroundColor: style.bg === "white" ? THEME.gray[50] : "rgba(255,255,255,0.1)",
            fontSize: "0.9rem"
          }}
        >
          {footer}
        </div>
      )}
    </div>
  );
}
