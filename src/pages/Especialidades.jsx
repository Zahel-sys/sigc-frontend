import { useEffect, useState } from "react";
import api from "../services/api";
import ClienteLayout from "../layouts/ClienteLayout";

export default function Especialidades() {
  const [especialidades, setEspecialidades] = useState([]);

  useEffect(() => {
    api.get("/especialidades").then((res) => setEspecialidades(res.data));
  }, []);

  return (
    <ClienteLayout>
      <h3 className="mb-4 text-center">Especialidades Médicas</h3>
      <div className="row">
        {especialidades.map((esp) => (
          <div className="col-md-4 mb-4" key={esp.idEspecialidad}>
            <div className="card shadow-sm h-100">
              {esp.imagen ? (
                <img
                  src={
                    esp.imagen.startsWith("http")
                      ? esp.imagen
                      : `http://localhost:8080${esp.imagen}`
                  }
                  className="card-img-top"
                  alt={esp.nombre}
                  style={{ height: "180px", objectFit: "cover" }}
                />
              ) : (
                <div
                  className="card-img-top bg-light d-flex align-items-center justify-content-center"
                  style={{ height: "180px" }}
                >
                  <span className="text-muted">Sin imagen</span>
                </div>
              )}
              <div className="card-body text-center">
                <h5 className="card-title">{esp.nombre}</h5>
                <p className="card-text">{esp.descripcion}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </ClienteLayout>
  );
}
