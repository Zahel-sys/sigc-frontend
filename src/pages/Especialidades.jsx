import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import ClienteLayout from "../layouts/ClienteLayout";

export default function Especialidades() {
  const [especialidades, setEspecialidades] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    api.get("/especialidades").then((res) => setEspecialidades(res.data));
  }, []);

  const manejarClick = (nombre) => {
    navigate(`/turnos/${nombre}`);
  };

  return (
    <ClienteLayout>
      <div className="container mt-5">
        <h2 className="text-center mb-4 fw-bold">Especialidades Médicas</h2>

        <div className="row justify-content-center">
          {especialidades.length === 0 ? (
            <p className="text-center text-muted">No hay especialidades disponibles.</p>
          ) : (
            especialidades.map((esp) => (
              <div
                key={esp.idEspecialidad}
                className="col-sm-6 col-md-4 col-lg-3 mb-4"
                onClick={() => manejarClick(esp.nombre)}
                style={{ cursor: "pointer" }}
              >
                <div className="card shadow-sm border-0 h-100 especialidad-card">
                  <div className="ratio ratio-1x1">
                    <img
                      src={
                        esp.imagen?.startsWith("http")
                          ? esp.imagen
                          : `http://localhost:8080${esp.imagen}`
                      }
                      alt={esp.nombre}
                      className="card-img-top img-fluid"
                      style={{
                        objectFit: "cover",
                        width: "100%",
                        height: "100%",
                        borderTopLeftRadius: "10px",
                        borderTopRightRadius: "10px",
                      }}
                      onError={(e) => (e.target.src = "/default.png")}
                    />
                  </div>
                  <div className="card-body text-center">
                    <h5 className="card-title fw-semibold">{esp.nombre}</h5>
                    <p className="text-muted small">{esp.descripcion}</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Estilos propios */}
      <style>
        {`
          .especialidad-card {
            transition: transform 0.25s ease, box-shadow 0.25s ease;
          }
          .especialidad-card:hover {
            transform: translateY(-6px);
            box-shadow: 0 8px 20px rgba(0,0,0,0.15);
          }
        `}
      </style>
    </ClienteLayout>
  );
}
