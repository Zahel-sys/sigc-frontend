import { useNavigate } from "react-router-dom";

export default function EspecialidadCard({ especialidad }) {
  const navigate = useNavigate();

  return (
    <div
      className="card shadow-sm h-100"
      onClick={() => navigate(`/turnos/${especialidad.idEspecialidad}`)}
      style={{ cursor: "pointer" }}
    >
      <img
        src={especialidad.imagen || "https://via.placeholder.com/400x250"}
        className="card-img-top"
        alt={especialidad.nombre}
      />
      <div className="card-body text-center">
        <h5 className="card-title">{especialidad.nombre}</h5>
        <p className="card-text">{especialidad.descripcion}</p>
      </div>
    </div>
  );
}
