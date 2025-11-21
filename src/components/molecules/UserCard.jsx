import React from "react";
import { Card } from "../atoms/Card";
import { Badge } from "../atoms/Badge";
import { Button } from "../atoms/Button";
import { THEME } from "../../config/theme";

/**
 * UserCard - Componente molecule para mostrar tarjeta de usuario
 * Combina: Card + Badge + Button + Avatar
 * 
 * @param {Object} user - Objeto usuario
 * @param {string} user.nombre - Nombre del usuario
 * @param {string} user.email - Email del usuario
 * @param {string} user.rol - Rol del usuario (ADMIN, PACIENTE)
 * @param {string} user.telefono - Teléfono (opcional)
 * @param {string} user.avatar - URL del avatar (opcional)
 * @param {Function} onEdit - Callback para editar
 * @param {Function} onDelete - Callback para eliminar
 * @param {Function} onClick - Callback al hacer click en la card
 * @param {boolean} showActions - Mostrar botones de acción
 */
export function UserCard({
  user,
  onEdit,
  onDelete,
  onClick,
  showActions = true,
}) {
  const { nombre, email, rol, telefono, avatar } = user;

  // Generar iniciales para avatar
  const getInitials = (name) => {
    if (!name) return "?";
    const parts = name.split(" ");
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name[0].toUpperCase();
  };

  // Colores según rol
  const getRoleBadgeVariant = (role) => {
    switch (role) {
      case "ADMIN":
        return "danger";
      case "PACIENTE":
        return "primary";
      default:
        return "secondary";
    }
  };

  const getRoleDisplayName = (role) => {
    switch (role) {
      case "ADMIN":
        return "Administrador";
      case "PACIENTE":
        return "Paciente";
      default:
        return role;
    }
  };

  return (
    <Card
      onClick={onClick}
      style={{
        cursor: onClick ? "pointer" : "default",
        transition: "all 0.2s",
      }}
      hover={!!onClick}
    >
      <div
        style={{
          display: "flex",
          gap: "1rem",
          alignItems: "flex-start",
        }}
      >
        {/* Avatar */}
        <div
          style={{
            width: "60px",
            height: "60px",
            borderRadius: "50%",
            background: avatar
              ? `url(${avatar}) center/cover`
              : THEME.primary.gradient,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
            fontSize: "1.5rem",
            fontWeight: "bold",
            flexShrink: 0,
            boxShadow: THEME.shadows.sm,
          }}
        >
          {!avatar && getInitials(nombre)}
        </div>

        {/* Content */}
        <div style={{ flex: 1, minWidth: 0 }}>
          {/* Header con nombre y badge */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "0.5rem",
              gap: "0.5rem",
            }}
          >
            <h3
              style={{
                margin: 0,
                fontSize: "1.1rem",
                fontWeight: "600",
                color: THEME.text.primary,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {nombre}
            </h3>

            <Badge variant={getRoleBadgeVariant(rol)}>
              {getRoleDisplayName(rol)}
            </Badge>
          </div>

          {/* Info */}
          <div style={{ marginBottom: "0.75rem" }}>
            <div
              style={{
                fontSize: "0.9rem",
                color: THEME.text.secondary,
                marginBottom: "0.25rem",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
              }}
            >
              <span>📧</span>
              <span
                style={{
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {email}
              </span>
            </div>

            {telefono && (
              <div
                style={{
                  fontSize: "0.9rem",
                  color: THEME.text.secondary,
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                }}
              >
                <span>📱</span>
                <span>{telefono}</span>
              </div>
            )}
          </div>

          {/* Actions */}
          {showActions && (onEdit || onDelete) && (
            <div
              style={{
                display: "flex",
                gap: "0.5rem",
                marginTop: "0.75rem",
              }}
            >
              {onEdit && (
                <Button
                  variant="primary"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit(user);
                  }}
                  style={{ flex: 1 }}
                >
                  ✏️ Editar
                </Button>
              )}

              {onDelete && (
                <Button
                  variant="danger"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(user);
                  }}
                  style={{ flex: 1 }}
                >
                  🗑️ Eliminar
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
