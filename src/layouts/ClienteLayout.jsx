import { Link, useNavigate } from "react-router-dom";
import { FaUserMd, FaCalendarAlt, FaSignOutAlt, FaUser, FaHome } from "react-icons/fa";
import { showConfirm, showSuccess } from "../utils/alerts";
import "../styles/ClienteLayout.css";

export default function ClienteLayout({ children }) {
  const navigate = useNavigate();

  const handleLogout = async () => {
    const confirmar = await showConfirm(
      "¿Estás seguro de cerrar sesión?",
      "Salir del sistema"
    );
    
    if (confirmar) {
      localStorage.clear();
      showSuccess("Sesión cerrada", "Has cerrado sesión exitosamente");
      navigate("/login");
    }
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
          <Link to="/cliente" className="sidebar-link"><FaHome /> Panel Principal</Link>
          <Link to="/cliente/citas" className="sidebar-link"><FaCalendarAlt /> Mis Citas</Link>
          <Link to="/cliente/perfil" className="sidebar-link"><FaUser /> Mi Perfil</Link>
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
