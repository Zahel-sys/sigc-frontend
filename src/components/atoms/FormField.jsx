import React from "react";
import { THEME } from "../../config/theme";

/**
 * FormField - Componente atómico para campos de formulario
 * Responsabilidad: Renderizar input reutilizable con validación
 * Props: label, type, name, value, onChange, error, placeholder, disabled, required
 */
export function FormField({
  label,
  type = "text",
  name,
  value,
  onChange,
  error,
  placeholder,
  disabled = false,
  required = false,
  icon = null
}) {
  return (
    <div style={{ marginBottom: "1.5rem" }}>
      {label && (
        <label
          htmlFor={name}
          style={{
            display: "block",
            marginBottom: "0.5rem",
            fontWeight: "600",
            color: THEME.gray[700],
            fontSize: "0.95rem"
          }}
        >
          {label}
          {required && <span style={{ color: THEME.danger.main }}>*</span>}
        </label>
      )}
      <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
        {icon && (
          <i
            className={icon}
            style={{
              position: "absolute",
              left: "1rem",
              color: THEME.gray[500],
              pointerEvents: "none"
            }}
          ></i>
        )}
        <input
          id={name}
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          style={{
            width: "100%",
            padding: icon ? "0.75rem 1rem 0.75rem 2.5rem" : "0.75rem 1rem",
            borderRadius: THEME.borderRadius.md,
            border: `1px solid ${error ? THEME.danger.main : THEME.gray[300]}`,
            fontSize: "1rem",
            transition: "all 0.3s ease",
            backgroundColor: disabled ? THEME.gray[100] : "white",
            color: THEME.gray[900]
          }}
          onFocus={(e) => {
            e.target.style.borderColor = error ? THEME.danger.main : THEME.primary.main;
            e.target.style.boxShadow = `0 0 0 3px ${error ? THEME.danger.shadowColor : THEME.primary.shadowColor}`;
          }}
          onBlur={(e) => {
            e.target.style.borderColor = error ? THEME.danger.main : THEME.gray[300];
            e.target.style.boxShadow = "none";
          }}
        />
      </div>
      {error && (
        <p
          style={{
            marginTop: "0.5rem",
            color: THEME.danger.main,
            fontSize: "0.85rem",
            fontWeight: "500"
          }}
        >
          <i className="fas fa-exclamation-circle me-1"></i>
          {error}
        </p>
      )}
    </div>
  );
}
