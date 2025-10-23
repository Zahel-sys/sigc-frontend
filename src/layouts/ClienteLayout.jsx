import { Link, useNavigate } from "react-router-dom";
import { FaUserMd, FaCalendarAlt, FaSignOutAlt, FaUser } from "react-icons/fa";
import "../styles/ClienteLayout.css";

export default function ClienteLayout({ children }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <div className="cliente-layout">
      {/* Sidebar */}
      <aside className="sidebar-cliente">
        <div className="sidebar-header">
          <h4>SIGC</h4>
          <small>Paciente</small>
        </div>

        <nav className="sidebar-menu">
          <Link to="/cliente" className="sidebar-link"><FaUser /> Mi Perfil</Link>
          <Link to="/cliente/citas" className="sidebar-link"><FaCalendarAlt /> Mis Citas</Link>
          <Link to="/especialidades" className="sidebar-link"><FaUserMd /> Especialidades</Link>
        </nav>

        <button className="btn-logout" onClick={handleLogout}>
          <FaSignOutAlt /> Cerrar sesión
        </button>
      </aside>

      {/* Contenido principal */}
      <main className="main-cliente">
        <header className="topbar-cliente">
          <h5>Panel del Paciente</h5>
        </header>
        <div className="content-cliente">{children}</div>
      </main>
    </div>
  );
}
