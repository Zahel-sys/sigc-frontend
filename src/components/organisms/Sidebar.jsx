import React, { useState } from "react";
import { THEME } from "../../config/theme";
import { ROLE_ROUTES } from "../../constants/roles";

/**
 * Sidebar - Componente organism para navegación lateral
 * Combina: Logo + Menú de navegación + User info + Logout
 * 
 * @param {Object} user - Objeto usuario actual
 * @param {string} currentPath - Ruta actual
 * @param {Function} onNavigate - Callback para navegar (recibe path)
 * @param {Function} onLogout - Callback para cerrar sesión
 * @param {Array} customMenuItems - Items de menú personalizados (opcional)
 */
export function Sidebar({
  user,
  currentPath,
  onNavigate,
  onLogout,
  customMenuItems = null,
}) {
  const [collapsed, setCollapsed] = useState(false);

  // Menú por defecto según rol
  const getDefaultMenu = () => {
    if (!user || !user.rol) return [];

    const baseMenuItems = {
      ADMIN: [
        { path: "/admin", label: "Dashboard", icon: "📊" },
        { path: "/admin/doctores", label: "Doctores", icon: "👨‍⚕️" },
        { path: "/admin/especialidades", label: "Especialidades", icon: "🏥" },
        { path: "/admin/horarios", label: "Horarios", icon: "🕐" },
      ],
      PACIENTE: [
        { path: "/cliente", label: "Dashboard", icon: "📊" },
        { path: "/cliente/citas", label: "Mis Citas", icon: "📅" },
        { path: "/especialidades", label: "Especialidades", icon: "🏥" },
        { path: "/cliente/perfil", label: "Mi Perfil", icon: "👤" },
      ],
    };

    return baseMenuItems[user.rol] || [];
  };

  const menuItems = customMenuItems || getDefaultMenu();

  // Generar iniciales
  const getInitials = (name) => {
    if (!name) return "?";
    const parts = name.split(" ");
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name[0].toUpperCase();
  };

  return (
    <aside
      style={{
        width: collapsed ? "80px" : "280px",
        height: "100vh",
        background: THEME.primary.gradient,
        color: "white",
        display: "flex",
        flexDirection: "column",
        position: "fixed",
        left: 0,
        top: 0,
        transition: "width 0.3s ease",
        zIndex: 1000,
        boxShadow: THEME.shadows.lg,
      }}
    >
      {/* Header con Logo */}
      <div
        style={{
          padding: collapsed ? "1.5rem 0.5rem" : "1.5rem 1.5rem",
          borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
          display: "flex",
          alignItems: "center",
          justifyContent: collapsed ? "center" : "space-between",
          gap: "1rem",
        }}
      >
        {!collapsed && (
          <div>
            <h1
              style={{
                margin: 0,
                fontSize: "1.5rem",
                fontWeight: "700",
              }}
            >
              🏥 SIGC
            </h1>
            <p
              style={{
                margin: "0.25rem 0 0 0",
                fontSize: "0.75rem",
                opacity: 0.8,
              }}
            >
              Sistema de Gestión de Citas
            </p>
          </div>
        )}

        {/* Botón toggle */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          style={{
            background: "rgba(255, 255, 255, 0.1)",
            border: "none",
            color: "white",
            padding: "0.5rem",
            borderRadius: THEME.borderRadius.sm,
            cursor: "pointer",
            fontSize: "1.2rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "background 0.2s",
          }}
          onMouseEnter={(e) =>
            (e.target.style.background = "rgba(255, 255, 255, 0.2)")
          }
          onMouseLeave={(e) =>
            (e.target.style.background = "rgba(255, 255, 255, 0.1)")
          }
          title={collapsed ? "Expandir" : "Colapsar"}
        >
          {collapsed ? "☰" : "✕"}
        </button>
      </div>

      {/* User Info */}
      <div
        style={{
          padding: collapsed ? "1rem 0.5rem" : "1rem 1.5rem",
          borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
          display: "flex",
          alignItems: "center",
          gap: "0.75rem",
          justifyContent: collapsed ? "center" : "flex-start",
        }}
      >
        {/* Avatar */}
        <div
          style={{
            width: collapsed ? "40px" : "50px",
            height: collapsed ? "40px" : "50px",
            borderRadius: "50%",
            background: "rgba(255, 255, 255, 0.2)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: collapsed ? "1rem" : "1.2rem",
            fontWeight: "bold",
            flexShrink: 0,
          }}
        >
          {getInitials(user?.nombre || "Usuario")}
        </div>

        {/* User Details */}
        {!collapsed && (
          <div style={{ flex: 1, minWidth: 0 }}>
            <div
              style={{
                fontWeight: "600",
                fontSize: "0.95rem",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {user?.nombre || "Usuario"}
            </div>
            <div
              style={{
                fontSize: "0.75rem",
                opacity: 0.8,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {user?.rol === "ADMIN" ? "Administrador" : "Paciente"}
            </div>
          </div>
        )}
      </div>

      {/* Navigation Menu */}
      <nav
        style={{
          flex: 1,
          overflowY: "auto",
          padding: collapsed ? "1rem 0.5rem" : "1rem 0",
        }}
      >
        {menuItems.map((item) => {
          const isActive = currentPath === item.path;

          return (
            <button
              key={item.path}
              onClick={() => onNavigate && onNavigate(item.path)}
              style={{
                width: "100%",
                padding: collapsed ? "1rem 0.5rem" : "1rem 1.5rem",
                background: isActive
                  ? "rgba(255, 255, 255, 0.2)"
                  : "transparent",
                border: "none",
                borderLeft: isActive ? "4px solid white" : "4px solid transparent",
                color: "white",
                textAlign: collapsed ? "center" : "left",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "0.75rem",
                fontSize: "0.95rem",
                fontWeight: isActive ? "600" : "400",
                transition: "all 0.2s",
                justifyContent: collapsed ? "center" : "flex-start",
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.target.style.background = "rgba(255, 255, 255, 0.1)";
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.target.style.background = "transparent";
                }
              }}
            >
              <span style={{ fontSize: "1.2rem" }}>{item.icon}</span>
              {!collapsed && <span>{item.label}</span>}
            </button>
          );
        })}
      </nav>

      {/* Footer con Logout */}
      <div
        style={{
          borderTop: "1px solid rgba(255, 255, 255, 0.1)",
          padding: collapsed ? "1rem 0.5rem" : "1rem 1.5rem",
        }}
      >
        <button
          onClick={onLogout}
          style={{
            width: "100%",
            padding: collapsed ? "1rem 0.5rem" : "1rem",
            background: "rgba(255, 255, 255, 0.1)",
            border: "none",
            borderRadius: THEME.borderRadius.md,
            color: "white",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "0.5rem",
            fontSize: "0.95rem",
            fontWeight: "600",
            transition: "background 0.2s",
          }}
          onMouseEnter={(e) =>
            (e.target.style.background = "rgba(255, 0, 0, 0.3)")
          }
          onMouseLeave={(e) =>
            (e.target.style.background = "rgba(255, 255, 255, 0.1)")
          }
        >
          <span style={{ fontSize: "1.2rem" }}>🚪</span>
          {!collapsed && <span>Cerrar Sesión</span>}
        </button>
      </div>
    </aside>
  );
}
