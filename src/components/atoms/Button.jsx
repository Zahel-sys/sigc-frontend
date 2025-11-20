import React from "react";
import { THEME } from "../config/theme";

/**
 * Button - Componente atómico para botones
 * Responsabilidad: Botón reutilizable con variantes
 * Props: variant, size, children, onClick, disabled, icon, loading, fullWidth
 */
export function Button({
  variant = "primary",
  size = "md",
  children,
  onClick,
  disabled = false,
  icon = null,
  loading = false,
  fullWidth = false,
  type = "button",
  ...props
}) {
  const variants = {
    primary: THEME.primary,
    secondary: THEME.secondary,
    danger: THEME.danger,
    success: THEME.success,
    warning: THEME.warning
  };

  const sizes = {
    sm: { padding: "0.5rem 1rem", fontSize: "0.85rem" },
    md: { padding: "0.75rem 1.5rem", fontSize: "1rem" },
    lg: { padding: "1rem 2rem", fontSize: "1.1rem" }
  };

  const color = variants[variant] || variants.primary;

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      style={{
        ...sizes[size],
        width: fullWidth ? "100%" : "auto",
        background: color.gradient,
        color: "white",
        border: "none",
        borderRadius: THEME.borderRadius.md,
        fontWeight: "600",
        cursor: disabled || loading ? "not-allowed" : "pointer",
        transition: "all 0.3s ease",
        opacity: disabled || loading ? 0.6 : 1,
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "0.5rem",
        boxShadow: `0 2px 8px ${color.shadowColor}`
      }}
      onMouseEnter={(e) => {
        if (!disabled && !loading) {
          e.target.style.transform = "translateY(-2px)";
          e.target.style.boxShadow = `0 4px 12px ${color.shadowColor}`;
        }
      }}
      onMouseLeave={(e) => {
        if (!disabled && !loading) {
          e.target.style.transform = "translateY(0)";
          e.target.style.boxShadow = `0 2px 8px ${color.shadowColor}`;
        }
      }}
      {...props}
    >
      {loading ? (
        <>
          <div
            className="spinner-border spinner-border-sm"
            role="status"
            style={{ width: "1rem", height: "1rem" }}
          >
            <span className="visually-hidden">Cargando...</span>
          </div>
          Cargando...
        </>
      ) : (
        <>
          {icon && <i className={icon}></i>}
          {children}
        </>
      )}
    </button>
  );
}
