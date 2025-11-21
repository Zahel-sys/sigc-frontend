import React from "react";
import { Card } from "../atoms/Card";
import { Badge } from "../atoms/Badge";
import { Button } from "../atoms/Button";
import { THEME } from "../../config/theme";

/**
 * CitaCard - Componente molecule para mostrar tarjeta de cita médica
 * Combina: Card + Badge + Button + Info detallada
 * 
 * @param {Object} cita - Objeto cita
 * @param {string} cita.fecha - Fecha de la cita
 * @param {string} cita.hora - Hora de la cita
 * @param {string} cita.doctor - Nombre del doctor
 * @param {string} cita.especialidad - Especialidad médica
 * @param {string} cita.estado - Estado (PENDIENTE, CONFIRMADA, CANCELADA, COMPLETADA)
 * @param {string} cita.motivo - Motivo de la consulta (opcional)
 * @param {Function} onCancel - Callback para cancelar
 * @param {Function} onConfirm - Callback para confirmar
 * @param {Function} onClick - Callback al hacer click
 * @param {boolean} showActions - Mostrar botones de acción
 */
export function CitaCard({
  cita,
  onCancel,
  onConfirm,
  onClick,
  showActions = true,
}) {
  const { fecha, hora, doctor, especialidad, estado, motivo } = cita;

  // Colores según estado
  const getEstadoBadgeVariant = (status) => {
    switch (status?.toUpperCase()) {
      case "CONFIRMADA":
        return "success";
      case "PENDIENTE":
        return "warning";
      case "CANCELADA":
        return "danger";
      case "COMPLETADA":
        return "secondary";
      default:
        return "primary";
    }
  };

  const getEstadoDisplayName = (status) => {
    switch (status?.toUpperCase()) {
      case "CONFIRMADA":
        return "Confirmada";
      case "PENDIENTE":
        return "Pendiente";
      case "CANCELADA":
        return "Cancelada";
      case "COMPLETADA":
        return "Completada";
      default:
        return status;
    }
  };

  // Formatear fecha
  const formatFecha = (fechaStr) => {
    if (!fechaStr) return "";
    try {
      const fecha = new Date(fechaStr);
      return fecha.toLocaleDateString("es-ES", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return fechaStr;
    }
  };

  const isPendiente = estado?.toUpperCase() === "PENDIENTE";
  const isCancelada = estado?.toUpperCase() === "CANCELADA";

  return (
    <Card
      onClick={onClick}
      style={{
        cursor: onClick ? "pointer" : "default",
        opacity: isCancelada ? 0.7 : 1,
        borderLeft: `4px solid ${
          isCancelada
            ? THEME.danger.main
            : isPendiente
            ? THEME.warning.main
            : THEME.success.main
        }`,
      }}
      hover={!!onClick}
    >
      {/* Header: Fecha y Estado */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "1rem",
          gap: "0.5rem",
        }}
      >
        <div>
          <div
            style={{
              fontSize: "1.1rem",
              fontWeight: "600",
              color: THEME.text.primary,
              marginBottom: "0.25rem",
            }}
          >
            📅 {formatFecha(fecha)}
          </div>
          <div
            style={{
              fontSize: "1.3rem",
              fontWeight: "700",
              color: THEME.primary.main,
            }}
          >
            🕐 {hora}
          </div>
        </div>

        <Badge variant={getEstadoBadgeVariant(estado)}>
          {getEstadoDisplayName(estado)}
        </Badge>
      </div>

      {/* Divider */}
      <div
        style={{
          borderTop: `1px solid ${THEME.border.light}`,
          margin: "1rem 0",
        }}
      />

      {/* Doctor y Especialidad */}
      <div style={{ marginBottom: "0.75rem" }}>
        <div
          style={{
            fontSize: "1rem",
            fontWeight: "600",
            color: THEME.text.primary,
            marginBottom: "0.5rem",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
          }}
        >
          <span>👨‍⚕️</span>
          <span>{doctor}</span>
        </div>

        <div
          style={{
            fontSize: "0.9rem",
            color: THEME.text.secondary,
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
          }}
        >
          <span>🏥</span>
          <span>{especialidad}</span>
        </div>
      </div>

      {/* Motivo (si existe) */}
      {motivo && (
        <div
          style={{
            padding: "0.75rem",
            background: THEME.background.light,
            borderRadius: THEME.borderRadius.sm,
            marginBottom: "0.75rem",
          }}
        >
          <div
            style={{
              fontSize: "0.85rem",
              fontWeight: "600",
              color: THEME.text.secondary,
              marginBottom: "0.25rem",
            }}
          >
            Motivo de consulta:
          </div>
          <div
            style={{
              fontSize: "0.9rem",
              color: THEME.text.primary,
            }}
          >
            {motivo}
          </div>
        </div>
      )}

      {/* Actions */}
      {showActions && !isCancelada && (onConfirm || onCancel) && (
        <div
          style={{
            display: "flex",
            gap: "0.5rem",
            marginTop: "1rem",
          }}
        >
          {onConfirm && isPendiente && (
            <Button
              variant="success"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onConfirm(cita);
              }}
              style={{ flex: 1 }}
            >
              ✓ Confirmar
            </Button>
          )}

          {onCancel && !isCancelada && (
            <Button
              variant="danger"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onCancel(cita);
              }}
              style={{ flex: 1 }}
            >
              ✕ Cancelar
            </Button>
          )}
        </div>
      )}
    </Card>
  );
}
