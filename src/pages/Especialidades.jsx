import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import PublicLayout from "../layouts/PublicLayout";
import ClienteLayout from "../layouts/ClienteLayout";
import "../styles/Especialidades.css";

export default function Especialidades() {
  const [especialidades, setEspecialidades] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Verificar si el usuario está autenticado
    const usuario = localStorage.getItem("usuario");
    setIsAuthenticated(!!usuario);

    const fetchEspecialidades = async () => {
      try {
        const res = await api.get("/especialidades");
        const datos = Array.isArray(res.data) ? res.data : [];
        setEspecialidades(datos);
      } catch (err) {
        console.error("Error al obtener las especialidades:", err);
        setEspecialidades([]);
      }
    };
    fetchEspecialidades();
  }, []);

  const handleVerDoctores = (nombreEspecialidad) => {
    navigate(`/turnos/${encodeURIComponent(nombreEspecialidad)}`);
  };

  // Usar el layout correcto según si está autenticado o no
  const Layout = isAuthenticated ? ClienteLayout : PublicLayout;

  return (
    <Layout>
      <div className="especialidades-container">
        <h1 className="titulo">Especialidades Médicas</h1>
        <p className="descripcion">
          Consulta las especialidades médicas disponibles y reserva tu cita.
        </p>

        <div className="especialidades-grid">
          {especialidades.map((esp) => (
            <div key={esp.idEspecialidad} className="card-especialidad">
              <div className="img-wrapper">
                {esp.imagen ? (
                  <img
                    src={`http://localhost:8080/images/especialidades/${esp.imagen}`}
                    alt={esp.nombre}
                    className="img-especialidad"
                  />
                ) : (
                  <img
                    src="https://via.placeholder.com/200x150?text=Sin+Foto"
                    alt="Sin imagen"
                    className="img-especialidad"
                  />
                )}
              </div>
              <h3>{esp.nombre}</h3>
              <p>{esp.descripcion}</p>
              <button
                onClick={() => handleVerDoctores(esp.nombre)}
                className="btn-ver"
              >
                Ver doctores disponibles
              </button>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}
