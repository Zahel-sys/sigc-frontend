import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PublicLayout from "../layouts/PublicLayout";
import ClienteLayout from "../layouts/ClienteLayout";
import { useEspecialidades } from "../hooks/useEspecialidades";
import { THEME } from "../config/theme";
import "../styles/Especialidades.css";

/**
 * Página Especialidades - Listar especialidades disponibles
 * Responsabilidad: Mostrar especialidades y navegar a doctores
 */
export default function Especialidades() {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { especialidades, loading } = useEspecialidades();

  useEffect(() => {
    const usuario = localStorage.getItem("usuario");
    setIsAuthenticated(!!usuario);
  }, []);

  const handleVerDoctores = (nombreEspecialidad) => {
    navigate(`/turnos/${encodeURIComponent(nombreEspecialidad)}`);
  };

  const Layout = isAuthenticated ? ClienteLayout : PublicLayout;

  return (
    <Layout>
      <div className="especialidades-container" style={{ padding: "2rem" }}>
        <h1 className="titulo" style={{ color: THEME.primary.main, marginBottom: "1rem" }}>
          <i className="fas fa-hospital me-2"></i>Especialidades Médicas
        </h1>
        <p className="descripcion" style={{ color: THEME.gray[600], marginBottom: "2rem" }}>
          Consulta las especialidades médicas disponibles y reserva tu cita.
        </p>

        {/* CARGANDO */}
        {loading && (
          <div className="alert alert-info">
            <div className="spinner-border spinner-border-sm me-2" role="status">
              <span className="visually-hidden">Cargando...</span>
            </div>
            Cargando especialidades...
          </div>
        )}

        {/* GRILLA DE ESPECIALIDADES */}
        {!loading && (
          <div className="especialidades-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "2rem" }}>
            {especialidades.map((esp) => (
              <div
                key={esp.idEspecialidad}
                className="card-especialidad"
                style={{
                  borderRadius: THEME.borderRadius.xl,
                  overflow: "hidden",
                  boxShadow: `0 4px 12px ${THEME.gray[300]}`,
                  transition: "all 0.3s ease",
                  cursor: "pointer"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-8px)";
                  e.currentTarget.style.boxShadow = `0 8px 20px ${THEME.primary.shadowColor}`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = `0 4px 12px ${THEME.gray[300]}`;
                }}
              >
                <div className="img-wrapper" style={{ height: "200px", overflow: "hidden" }}>
                  <img
                    src={
                      esp.imagen
                        ? `http://localhost:8080/images/especialidades/${esp.imagen}`
                        : "https://via.placeholder.com/280x200?text=Sin+Foto"
                    }
                    alt={esp.nombre}
                    className="img-especialidad"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover"
                    }}
                    onError={(e) => {
                      e.target.src = "https://via.placeholder.com/280x200?text=Sin+Foto";
                    }}
                  />
                </div>

                <div style={{ padding: "1.5rem" }}>
                  <h3 style={{ color: THEME.primary.main, marginBottom: "0.5rem", fontWeight: "600" }}>
                    {esp.nombre}
                  </h3>
                  <p style={{ color: THEME.gray[600], marginBottom: "1.5rem", fontSize: "0.95rem" }}>
                    {esp.descripcion}
                  </p>

                  <button
                    onClick={() => handleVerDoctores(esp.nombre)}
                    className="btn-ver"
                    style={{
                      width: "100%",
                      background: THEME.primary.gradient,
                      color: "white",
                      border: "none",
                      padding: "0.75rem 1rem",
                      borderRadius: THEME.borderRadius.md,
                      fontWeight: "600",
                      cursor: "pointer",
                      transition: "all 0.3s ease"
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.transform = "scale(1.05)";
                      e.target.style.boxShadow = `0 4px 12px ${THEME.primary.shadowColor}`;
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.transform = "scale(1)";
                      e.target.style.boxShadow = "none";
                    }}
                  >
                    <i className="fas fa-stethoscope me-2"></i>Ver doctores disponibles
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* SIN ESPECIALIDADES */}
        {!loading && especialidades.length === 0 && (
          <div className="alert alert-warning">
            <i className="fas fa-info-circle me-2"></i>
            No hay especialidades disponibles en este momento.
          </div>
        )}
      </div>
    </Layout>
  );
}
