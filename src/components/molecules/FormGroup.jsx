import React from "react";
import { FormField } from "../atoms/FormField";
import { THEME } from "../../config/theme";

/**
 * FormGroup - Componente molecule para grupos de formulario
 * Combina: FormField + Label + Error message + Helper text
 * 
 * @param {string} label - Etiqueta del campo
 * @param {string} name - Nombre del campo
 * @param {string} type - Tipo de input (text, email, password, etc.)
 * @param {string} value - Valor del campo
 * @param {Function} onChange - Handler de cambio
 * @param {string} error - Mensaje de error
 * @param {string} helperText - Texto de ayuda
 * @param {boolean} required - Campo obligatorio
 * @param {string} placeholder - Placeholder del input
 * @param {boolean} disabled - Campo deshabilitado
 */
export function FormGroup({
  label,
  name,
  type = "text",
  value,
  onChange,
  error = "",
  helperText = "",
  required = false,
  placeholder = "",
  disabled = false,
  icon = null,
  ...props
}) {
  const hasError = error && error.length > 0;

  return (
    <div style={{ marginBottom: "1.5rem" }}>
      {/* Label */}
      {label && (
        <label
          htmlFor={name}
          style={{
            display: "block",
            marginBottom: "0.5rem",
            fontWeight: "600",
            color: hasError ? THEME.danger.main : THEME.text.primary,
            fontSize: "0.95rem",
          }}
        >
          {label}
          {required && (
            <span style={{ color: THEME.danger.main, marginLeft: "0.25rem" }}>
              *
            </span>
          )}
        </label>
      )}

      {/* Input Field */}
      <div style={{ position: "relative" }}>
        {icon && (
          <div
            style={{
              position: "absolute",
              left: "1rem",
              top: "50%",
              transform: "translateY(-50%)",
              color: THEME.text.secondary,
              pointerEvents: "none",
            }}
          >
            {icon}
          </div>
        )}
        
        <FormField
          id={name}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          style={{
            paddingLeft: icon ? "3rem" : "1rem",
            borderColor: hasError ? THEME.danger.main : THEME.border.light,
            borderWidth: "2px",
            borderStyle: "solid",
          }}
          {...props}
        />
      </div>

      {/* Error Message */}
      {hasError && (
        <div
          style={{
            marginTop: "0.5rem",
            color: THEME.danger.main,
            fontSize: "0.875rem",
            display: "flex",
            alignItems: "center",
            gap: "0.25rem",
          }}
        >
          <span>⚠️</span>
          <span>{error}</span>
        </div>
      )}

      {/* Helper Text */}
      {!hasError && helperText && (
        <div
          style={{
            marginTop: "0.5rem",
            color: THEME.text.secondary,
            fontSize: "0.875rem",
          }}
        >
          {helperText}
        </div>
      )}
    </div>
  );
}
