import React from "react";
import { THEME } from "../../config/theme";

/**
 * Modal - Componente atómico para modales
 * Responsabilidad: Diálogo reutilizable
 * Props: isOpen, onClose, title, children, actions, size
 */
export function Modal({
  isOpen = false,
  onClose,
  title,
  children,
  actions = null,
  size = "md"
}) {
  if (!isOpen) return null;

  const sizes = {
    sm: { maxWidth: "400px" },
    md: { maxWidth: "600px" },
    lg: { maxWidth: "900px" }
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
        padding: "1rem"
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: "white",
          borderRadius: THEME.borderRadius.lg,
          boxShadow: `0 10px 40px rgba(0, 0, 0, 0.3)`,
          width: "100%",
          ...sizes[size],
          maxHeight: "90vh",
          overflow: "auto"
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            padding: "1.5rem",
            borderBottom: `1px solid ${THEME.gray[200]}`,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            background: THEME.gray[50]
          }}
        >
          <h5
            style={{
              margin: 0,
              fontWeight: "700",
              color: THEME.gray[900],
              fontSize: "1.2rem"
            }}
          >
            {title}
          </h5>
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              fontSize: "1.5rem",
              cursor: "pointer",
              color: THEME.gray[600],
              padding: "0",
              width: "2rem",
              height: "2rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = THEME.gray[900];
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = THEME.gray[600];
            }}
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: "1.5rem" }}>
          {children}
        </div>

        {/* Footer */}
        {actions && (
          <div
            style={{
              padding: "1.5rem",
              borderTop: `1px solid ${THEME.gray[200]}`,
              background: THEME.gray[50],
              display: "flex",
              gap: "1rem",
              justifyContent: "flex-end"
            }}
          >
            {actions}
          </div>
        )}
      </div>
    </div>
  );
}
