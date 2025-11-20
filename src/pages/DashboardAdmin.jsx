import AdminLayout from "../layouts/AdminLayout";
import { useGestionAdminDashboard } from "../hooks/useGestionAdminDashboard";
import { THEME } from "../config/theme";
import { useNavigate } from "react-router-dom";

/**
 * Dashboard Admin - Resumen general
 * Responsabilidad: Mostrar métricas de la clínica
 */
export default function DashboardAdmin() {
  const { resumen, loading } = useGestionAdminDashboard();
  const navigate = useNavigate();

  const cards = [
    {
      title: "Doctores Registrados",
      icon: "fas fa-user-md",
      value: resumen.doctores,
      color: THEME.primary,
      action: () => navigate("/admin/doctores")
    },
    {
      title: "Especialidades",
      icon: "fas fa-stethoscope",
      value: resumen.especialidades,
      color: THEME.secondary,
      action: () => navigate("/admin/especialidades")
    },
    {
      title: "Citas Totales",
      icon: "fas fa-calendar-check",
      value: resumen.citas,
      color: THEME.warning,
      action: () => navigate("/admin/horarios")
    }
  ];

  return (
    <AdminLayout>
      <h3 className="mb-4" style={{ color: THEME.primary.main, fontWeight: "700" }}>
        📊 Resumen General
      </h3>

      {loading ? (
        <div style={{ textAlign: "center", padding: "3rem" }}>
          <div className="spinner-border" style={{ color: THEME.primary.main }} role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "1.5rem",
            width: "100%"
          }}
        >
          {cards.map((card, idx) => (
            <div
              key={idx}
              onClick={card.action}
              style={{
                background: "white",
                borderRadius: THEME.borderRadius.lg,
                padding: "2rem",
                boxShadow: `0 2px 8px ${THEME.gray[300]}`,
                cursor: "pointer",
                transition: "all 0.3s ease",
                borderLeft: `5px solid ${card.color.main}`
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-8px)";
                e.currentTarget.style.boxShadow = `0 8px 24px ${card.color.shadowColor}`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = `0 2px 8px ${THEME.gray[300]}`;
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                  <p style={{ color: THEME.gray[600], margin: "0 0 0.5rem 0", fontSize: "0.9rem", fontWeight: "600" }}>
                    {card.title}
                  </p>
                  <h2 style={{ color: card.color.main, margin: "0", fontSize: "2.5rem", fontWeight: "700" }}>
                    {card.value}
                  </h2>
                </div>
                <i
                  className={card.icon}
                  style={{ fontSize: "2.5rem", color: card.color.main, opacity: 0.3 }}
                ></i>
              </div>
              <div style={{ marginTop: "1rem", paddingTop: "1rem", borderTop: `1px solid ${THEME.gray[200]}` }}>
                <span style={{ color: card.color.main, fontSize: "0.85rem", fontWeight: "600" }}>
                  Ver detalles →
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </AdminLayout>
  );
}
