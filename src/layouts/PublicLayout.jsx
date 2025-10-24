import { Link } from "react-router-dom";
import { FaHome, FaUserMd, FaSignInAlt } from "react-icons/fa";
import "../styles/PublicLayout.css";

export default function PublicLayout({ children }) {
  return (
    <div className="public-layout">
      {/* Navbar superior */}
      <nav className="public-navbar">
        <div className="navbar-brand">
          <h3>SIGC</h3>
          <small>Sistema Integral de Gestión de Citas</small>
        </div>

        <div className="navbar-links">
          <Link to="/" className="nav-link">
            <FaHome /> Inicio
          </Link>
          <Link to="/especialidades" className="nav-link">
            <FaUserMd /> Especialidades
          </Link>
          <Link to="/login" className="nav-link btn-login">
            <FaSignInAlt /> Iniciar Sesión
          </Link>
        </div>
      </nav>

      {/* Contenido principal */}
      <main className="public-main">
        {children}
      </main>

      {/* Footer opcional */}
      <footer className="public-footer">
        <p>&copy; 2025 SIGC - Sistema Integral de Gestión de Citas</p>
      </footer>
    </div>
  );
}
