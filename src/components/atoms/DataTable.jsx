import React from "react";
import { THEME } from "../../config/theme";
import { Badge } from "./Badge";

/**
 * DataTable - Componente atómico para tablas
 * Responsabilidad: Mostrar datos tabulares reutilizable
 * Props: columns, data, actions, loading, emptyMessage
 */
export function DataTable({
  columns = [],
  data = [],
  actions = null,
  loading = false,
  emptyMessage = "No hay datos disponibles",
  striped = true
}) {
  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "2rem" }}>
        <div className="spinner-border" style={{ color: THEME.primary.main }} role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div
        style={{
          textAlign: "center",
          padding: "2rem",
          color: THEME.gray[600],
          borderRadius: THEME.borderRadius.lg,
          background: THEME.gray[50]
        }}
      >
        <i
          className="fas fa-inbox"
          style={{ fontSize: "2.5rem", marginBottom: "1rem", opacity: 0.3 }}
        ></i>
        <p>{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div
      style={{
        overflowX: "auto",
        borderRadius: THEME.borderRadius.lg,
        border: `1px solid ${THEME.gray[200]}`,
        boxShadow: `0 2px 8px ${THEME.gray[300]}`
      }}
    >
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          margin: 0
        }}
      >
        <thead>
          <tr
            style={{
              background: THEME.gray[50],
              borderBottom: `2px solid ${THEME.gray[200]}`
            }}
          >
            {columns.map((col) => (
              <th
                key={col.key}
                style={{
                  padding: "1rem",
                  textAlign: col.align || "left",
                  fontWeight: "700",
                  color: THEME.gray[900],
                  fontSize: "0.9rem",
                  width: col.width
                }}
              >
                {col.label}
              </th>
            ))}
            {actions && (
              <th
                style={{
                  padding: "1rem",
                  textAlign: "center",
                  fontWeight: "700",
                  color: THEME.gray[900],
                  fontSize: "0.9rem"
                }}
              >
                Acciones
              </th>
            )}
          </tr>
        </thead>
        <tbody>
          {data.map((row, idx) => (
            <tr
              key={idx}
              style={{
                background: striped && idx % 2 === 1 ? THEME.gray[50] : "white",
                borderBottom: `1px solid ${THEME.gray[200]}`,
                transition: "background 0.2s ease"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = THEME.gray[100];
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = striped && idx % 2 === 1 ? THEME.gray[50] : "white";
              }}
            >
              {columns.map((col) => (
                <td
                  key={col.key}
                  style={{
                    padding: "1rem",
                    textAlign: col.align || "left",
                    color: THEME.gray[700],
                    fontSize: "0.95rem"
                  }}
                >
                  {col.render ? col.render(row[col.key], row) : row[col.key]}
                </td>
              ))}
              {actions && (
                <td
                  style={{
                    padding: "1rem",
                    textAlign: "center",
                    display: "flex",
                    gap: "0.5rem",
                    justifyContent: "center"
                  }}
                >
                  {actions(row)}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
