import { Link, useNavigate } from "react-router-dom";
import { FaUserMd, FaCalendarAlt, FaClock, FaHome, FaSignOutAlt } from "react-icons/fa";
import { showConfirm, showSuccess } from "../utils/alerts";
import "../styles/AdminLayout.css";

export default function AdminLayout({ children }) {
  const navigate = useNavigate();

  const logout = async () => {
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
    <div className="admin-layout">
      {/* Sidebar */}
      <aside className="sidebar-admin">
        <div className="sidebar-header">
          <h4>SIGC</h4>
          <small>Administrador</small>
        </div>

        <nav className="sidebar-menu">
          <Link to="/admin" className="sidebar-link"><FaHome /> Dashboard</Link>
          <Link to="/admin/especialidades" className="sidebar-link"><FaUserMd /> Especialidades</Link>
          <Link to="/admin/doctores" className="sidebar-link"><FaCalendarAlt /> Doctores</Link>
          <Link to="/admin/horarios" className="sidebar-link"><FaClock /> Horarios</Link>
        </nav>

        <button className="btn-logout" onClick={logout}>
          <FaSignOutAlt /> Cerrar sesión
        </button>
      </aside>

      {/* Main content */}
      <main className="main-admin">
        <header className="topbar-admin shadow-sm">
          <h5 className="m-0">Panel de Administración</h5>
        </header>
        <section className="content-admin p-4">{children}</section>
      </main>
    </div>
  );
}
