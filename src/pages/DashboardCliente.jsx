import { useNavigate } from "react-router-dom";
import { useClienteDashboard } from "../hooks/useClienteDashboard";
import ClienteLayout from "../layouts/ClienteLayout";
import { THEME } from "../config/theme";
import "bootstrap/dist/css/bootstrap.min.css";

/**
 * Dashboard Cliente - Panel del paciente
 * Responsabilidad: Mostrar información del usuario y acceso rápido
 */
export default function DashboardCliente() {
  const navigate = useNavigate();
  const { usuario, citasActivas, loading } = useClienteDashboard();

  const quickActions = [
    {
      title: "Mis Citas",
      description: "Ver o cancelar tus citas",
      icon: "fas fa-calendar-alt",
      color: THEME.primary,
      action: () => navigate("/cliente/citas")
    },
    {
      title: "Especialidades",
      description: "Reserva tu próxima cita médica",
      icon: "fas fa-stethoscope",
      color: THEME.danger,
      action: () => navigate("/especialidades")
    },
    {
      title: "Mi Perfil",
      description: "Ver o editar tu información",
      icon: "fas fa-user",
      color: THEME.secondary,
      action: () => navigate("/cliente/perfil")
    }
  ];

  return (
    <ClienteLayout>
      <div className="container mt-4">
        <h2 className="fw-bold mb-4" style={{ color: THEME.primary.main }}>
          👋 Bienvenido al Panel del Paciente
        </h2>

        {loading ? (
          <div style={{ textAlign: "center", padding: "3rem" }}>
            <div className="spinner-border" style={{ color: THEME.primary.main }} role="status">
              <span className="visually-hidden">Cargando...</span>
            </div>
          </div>
        ) : (
          <>
            {/* Información del usuario */}
            {usuario && (
              <div
                className="card border-0 mb-4"
                style={{
                  background: THEME.primary.gradient,
                  color: "white",
                  width: "100%",
                  borderRadius: THEME.borderRadius.lg,
                  boxShadow: `0 4px 16px ${THEME.primary.shadowColor}`,
                  padding: "2rem"
                }}
              >
                <div style={{ display: "flex", gap: "2rem", alignItems: "center" }}>
                  <div
                    style={{
                      width: "80px",
                      height: "80px",
                      background: "rgba(255,255,255,0.2)",
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "2.5rem"
                    }}
                  >
                    <i className="fas fa-user-circle"></i>
                  </div>
                  <div>
                    <h4 style={{ fontWeight: "700", marginBottom: "0.5rem" }}>
                      {usuario.nombre || "Usuario"}
                    </h4>
                    <p style={{ opacity: 0.95, margin: "0.25rem 0" }}>
                      📧 {usuario.email || "Sin email"}
                    </p>
                    <p style={{ opacity: 0.95, margin: "0.25rem 0" }}>
                      🆔 {usuario.dni || "No registrado"}
                    </p>
                    <p style={{ opacity: 0.95, margin: "0.25rem 0" }}>
                      📱 {usuario.telefono || "No registrado"}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Acceso rápido */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                gap: "1.5rem",
                marginBottom: "2rem"
              }}
            >
              {quickActions.map((action, idx) => (
                <div
                  key={idx}
                  onClick={action.action}
                  style={{
                    background: "white",
                    borderRadius: THEME.borderRadius.lg,
                    padding: "2rem",
                    boxShadow: `0 2px 8px ${THEME.gray[300]}`,
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                    borderTop: `4px solid ${action.color.main}`
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-8px)";
                    e.currentTarget.style.boxShadow = `0 8px 24px ${action.color.shadowColor}`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = `0 2px 8px ${THEME.gray[300]}`;
                  }}
                >
                  <div style={{ textAlign: "center" }}>
                    <i
                      className={action.icon}
                      style={{
                        fontSize: "2.5rem",
                        color: action.color.main,
                        marginBottom: "1rem",
                        display: "block"
                      }}
                    ></i>
                    <h5 style={{ color: THEME.primary.main, fontWeight: "700", marginBottom: "0.5rem" }}>
                      {action.title}
                    </h5>
                    <p style={{ color: THEME.gray[600], fontSize: "0.9rem", margin: "0" }}>
                      {action.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Citas activas resumen */}
            {citasActivas.length > 0 && (
              <div
                style={{
                  background: "white",
                  borderRadius: THEME.borderRadius.lg,
                  padding: "2rem",
                  boxShadow: `0 2px 8px ${THEME.gray[300]}`
                }}
              >
                <h5 style={{ color: THEME.primary.main, fontWeight: "700", marginBottom: "1rem" }}>
                  ✓ Citas Activas ({citasActivas.length})
                </h5>
                <div style={{ maxHeight: "300px", overflowY: "auto" }}>
                  {citasActivas.map((cita, idx) => (
                    <div
                      key={idx}
                      style={{
                        padding: "1rem",
                        borderLeft: `4px solid ${THEME.primary.main}`,
                        marginBottom: "0.5rem",
                        background: `${THEME.primary.main}15`,
                        borderRadius: THEME.borderRadius.md
                      }}
                    >
                      <p style={{ margin: "0.25rem 0", fontWeight: "600", color: THEME.primary.main }}>
                        📅 {cita.fecha}
                      </p>
                      <p style={{ margin: "0.25rem 0", color: THEME.gray[700] }}>
                        🕐 {cita.hora || "Hora no especificada"}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </ClienteLayout>
  );
}
