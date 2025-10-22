import { Link, useNavigate } from "react-router-dom";

export default function NavbarCliente() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light shadow-sm">
      <div className="container-fluid">
        {/* Logo o nombre del sistema */}
        <Link className="navbar-brand fw-bold text-primary" to="/cliente">
          SIGC Clínica
        </Link>

        {/* Menú de navegación */}
        <div className="collapse navbar-collapse">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link className="nav-link" to="/especialidades">
                Especialidades
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/cliente/citas">
                Mis Citas
              </Link>
            </li>
          </ul>
          <button className="btn btn-outline-danger" onClick={handleLogout}>
            Cerrar sesión
          </button>
        </div>
      </div>
    </nav>
  );
}
