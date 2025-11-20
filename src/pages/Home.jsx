import React from "react";
import { Link } from "react-router-dom";
import { THEME } from "../config/theme";
import "../styles/Home.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

/**
 * Página Home - Landing page principal
 * Responsabilidad: Mostrar opciones de login/registro
 */
export default function Home() {
  return (
    <div className="dashboard-container">
      <aside className="sidebar" style={{ backgroundColor: THEME.primary.gradient }}>
        <h2 className="logo" style={{ color: "white", fontWeight: "700", fontSize: "1.8rem" }}>
          <i className="fas fa-hospital me-2"></i>SIGC
        </h2>
        <p className="role" style={{ color: "rgba(255,255,255,0.8)" }}>Bienvenido</p>
        <nav className="nav-menu">
          <Link
            to="/registrar"
            style={{
              color: "white",
              textDecoration: "none",
              display: "block",
              padding: "0.75rem",
              borderRadius: THEME.borderRadius.md,
              transition: "all 0.3s ease"
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = "rgba(255,255,255,0.2)";
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = "transparent";
            }}
          >
            <i className="fas fa-user-plus me-2"></i>Registrarse
          </Link>
        </nav>
      </aside>

      <main className="content" style={{ flex: 1, padding: "3rem", backgroundColor: THEME.gray[50] }}>
        <h1 className="title" style={{ color: THEME.primary.main, fontSize: "2.5rem", marginBottom: "1rem", fontWeight: "700" }}>
          🏥 Bienvenido a SIGC Clínica
        </h1>
        <p className="subtitle" style={{ color: THEME.gray[600], fontSize: "1.1rem", marginBottom: "3rem" }}>
          Agenda tus citas médicas fácilmente con nuestros especialistas.
        </p>

        <div className="cards" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "2rem" }}>
          <div
            className="card"
            style={{
              borderRadius: THEME.borderRadius.xl,
              padding: "2rem",
              boxShadow: `0 4px 12px ${THEME.gray[300]}`,
              backgroundColor: "white",
              transition: "all 0.3s ease"
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
            <h3 style={{ color: THEME.primary.main, marginBottom: "1rem", fontWeight: "600" }}>
              <i className="fas fa-sign-in-alt me-2"></i>Accede a tu cuenta
            </h3>
            <p style={{ color: THEME.gray[600], marginBottom: "1.5rem" }}>
              Gestiona tus citas y tu perfil como paciente.
            </p>
            <Link
              to="/login"
              className="btn"
              style={{
                display: "inline-block",
                background: THEME.primary.gradient,
                color: "white",
                padding: "0.75rem 1.5rem",
                borderRadius: THEME.borderRadius.md,
                textDecoration: "none",
                fontWeight: "600",
                transition: "all 0.3s ease"
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = "scale(1.05)";
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = "scale(1)";
              }}
            >
              Iniciar sesión
            </Link>
          </div>

          <div
            className="card"
            style={{
              borderRadius: THEME.borderRadius.xl,
              padding: "2rem",
              boxShadow: `0 4px 12px ${THEME.gray[300]}`,
              backgroundColor: "white",
              transition: "all 0.3s ease"
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
            <h3 style={{ color: THEME.primary.main, marginBottom: "1rem", fontWeight: "600" }}>
              <i className="fas fa-user-check me-2"></i>¿Nuevo usuario?
            </h3>
            <p style={{ color: THEME.gray[600], marginBottom: "1.5rem" }}>
              Regístrate y accede a los servicios de la clínica.
            </p>
            <Link
              to="/registrar"
              className="btn"
              style={{
                display: "inline-block",
                background: THEME.secondary.gradient,
                color: "white",
                padding: "0.75rem 1.5rem",
                borderRadius: THEME.borderRadius.md,
                textDecoration: "none",
                fontWeight: "600",
                transition: "all 0.3s ease"
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = "scale(1.05)";
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = "scale(1)";
              }}
            >
              Registrarse
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
