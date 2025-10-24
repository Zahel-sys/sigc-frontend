import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import ClienteLayout from "../layouts/ClienteLayout"; // 🟢 asegúrate de tenerlo
import "../styles/Especialidades.css";

export default function Especialidades() {
  const [especialidades, setEspecialidades] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEspecialidades = async () => {
      try {
        const res = await api.get("/especialidades");
        setEspecialidades(res.data);
      } catch (err) {
        console.error("Error al obtener las especialidades:", err);
      }
    };
    fetchEspecialidades();
  }, []);

  const handleVerDoctores = (nombreEspecialidad) => {
    navigate(`/turnos/${encodeURIComponent(nombreEspecialidad)}`);
  };

  return (
    <ClienteLayout>
      <div className="especialidades-container">
        <h1 className="titulo">Especialidades Médicas</h1>
        <p className="descripcion">
          Consulta las especialidades médicas disponibles y reserva tu cita.
        </p>

        <div className="especialidades-grid">
          {especialidades.map((esp) => (
            <div key={esp.idEspecialidad} className="card-especialidad">
              <div className="img-wrapper">
                <img
                  src={`http://localhost:8080${esp.imagen}`}
                  alt={esp.nombre}
                  className="img-especialidad"
                />
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
    </ClienteLayout>
  );
}
