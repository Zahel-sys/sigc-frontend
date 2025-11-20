import { Link } from "react-router-dom";
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
