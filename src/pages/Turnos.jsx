import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import PublicLayout from "../layouts/PublicLayout";
import ClienteLayout from "../layouts/ClienteLayout";
import api from "../services/api";
import { showSuccess, showWarning, showError, showConfirm } from "../utils/alerts";
import ReservarCita from "../components/ReservarCita";
import "../styles/Turnos.css";

export default function Turnos() {
  const { idEspecialidad } = useParams();
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const [doctores, setDoctores] = useState([]);
  const [horarios, setHorarios] = useState([]);
  const [doctorSeleccionado, setDoctorSeleccionado] = useState(null);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);
  const [horarioSeleccionado, setHorarioSeleccionado] = useState(null);

  // 🩺 Cargar doctores filtrados por especialidad
  useEffect(() => {
    // Verificar si el usuario está autenticado
    const usuario = localStorage.getItem("usuario");
    setIsAuthenticated(!!usuario);

    setCargando(true);
    api
      .get("/doctores")
      .then((res) => {
        const datos = Array.isArray(res.data) ? res.data : [];
        const filtrados = datos.filter(
          (d) =>
            d.especialidad.toLowerCase().trim() ===
            idEspecialidad.toLowerCase().trim()
        );
        setDoctores(filtrados);
      })
      .catch((error) => {
        console.error("Error al cargar doctores:", error);
        setDoctores([]);
      })
      .finally(() => setCargando(false));
  }, [idEspecialidad]);

  // 🕓 Cargar horarios de un doctor
  const cargarHorarios = (idDoctor) => {
    setDoctorSeleccionado(idDoctor);
    setCargando(true);
    setError(null);
    fetch(`http://localhost:8080/horarios/doctor/${idDoctor}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Error al obtener horarios: ${res.status}`);
        }
        return res.json();
      })
      .then((datos) => {
        const horariosFiltrados = Array.isArray(datos) ? datos : [];
        setHorarios(horariosFiltrados);
      })
      .catch((error) => {
        console.error("Error al cargar horarios:", error);
        setError(error.message || "No se pudieron cargar los horarios disponibles.");
        setHorarios([]);
      })
      .finally(() => setCargando(false));
  };

  // 📅 Manejar cuando se crea una cita
  const handleCitaCreada = (cita) => {
    console.log('✅ Cita creada:', cita);
    showSuccess("¡Cita reservada exitosamente!", `Tu cita ha sido confirmada`);
    setHorarioSeleccionado(null);
    // Recargar los horarios
    cargarHorarios(doctorSeleccionado);
  };

  // 📅 Formatear fecha a formato legible
  const formatearFecha = (fecha) => {
    const opciones = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(fecha).toLocaleDateString('es-ES', opciones);
  };

  // ⏰ Formatear hora (convertir HH:mm:ss a HH:mm)
  const formatearHora = (hora) => {
    return hora.substring(0, 5);
  };

  return (
    <PublicLayout>
      <div className="container mt-4">
        <h2 className="mb-4">Selecciona un Doctor</h2>

        <div className="row justify-content-center">
          {doctores.map((doc) => (
            <div
              key={doc.idDoctor}
              className="col-md-4 mb-4"
              onClick={() => cargarHorarios(doc.idDoctor)}
              style={{ cursor: "pointer" }}
            >
              <div
                className={`card h-100 shadow-sm border-0 ${
                  doctorSeleccionado === doc.idDoctor
                    ? "border-success shadow"
                    : ""
                }`}
              >
                <img
                  src={
                    doc.imagen
                      ? `http://localhost:8080/doctores/imagen/${doc.imagen}`
                      : "https://via.placeholder.com/200x250?text=Sin+Foto"
                  }
                  alt={doc.nombre}
                  className="card-img-top"
                  style={{
                    objectFit: "cover",
                    height: "230px",
                    borderTopLeftRadius: "10px",
                    borderTopRightRadius: "10px",
                  }}
                  onError={(e) => (e.target.src = "/default.png")}
                />
                <div className="card-body text-center">
                  <h5 className="fw-bold text-green-700">{doc.nombre}</h5>
                  <p className="text-muted small">{doc.especialidad}</p>
                  <p className="text-secondary small">
                    Cantidad disponible: {doc.cupoPacientes}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* TABLA DE HORARIOS */}
        {doctorSeleccionado && (
          <div className="mt-5">
            <h3 className="mb-3">
              Horarios Disponibles
            </h3>

            {/* CARGANDO */}
            {cargando && (
              <div className="alert alert-info" role="alert">
                <div className="spinner-border spinner-border-sm me-2" role="status">
                  <span className="visually-hidden">Cargando...</span>
                </div>
                Cargando horarios...
              </div>
            )}

            {/* ERROR */}
            {!cargando && error && (
              <div className="alert alert-danger" role="alert">
                ⚠️ {error}
              </div>
            )}

            {/* SIN HORARIOS */}
            {!cargando && !error && horarios.length === 0 && (
              <div className="alert alert-warning" role="alert">
                📅 No hay horarios disponibles para este doctor
              </div>
            )}

            {/* TABLA DE HORARIOS */}
            {!cargando && !error && horarios.length > 0 && (
              <div className="horarios-grid">
                {horarios.map((horario) => (
                  <div key={horario.idHorario} className="horario-card">
                    <div className="horario-header">
                      <h4>{formatearFecha(horario.fecha)}</h4>
                      <span className={`badge-turno ${horario.turno.toLowerCase()}`}>
                        {horario.turno}
                      </span>
                    </div>

                    <div className="horario-body">
                      <div className="horario-time">
                        <p><strong>Hora Inicio:</strong> {formatearHora(horario.horaInicio)}</p>
                        <p><strong>Hora Fin:</strong> {formatearHora(horario.horaFin)}</p>
                      </div>

                      <div className="horario-status">
                        {horario.disponible ? (
                          <span className="badge bg-success">✓ Disponible</span>
                        ) : (
                          <span className="badge bg-danger">✗ Ocupado</span>
                        )}
                      </div>
                    </div>

                    {/* Mostrar componente ReservarCita si está seleccionado */}
                    {horarioSeleccionado?.idHorario === horario.idHorario ? (
                      <ReservarCita
                        horarioId={horario.idHorario}
                        horario={horario}
                        onCitaCreada={handleCitaCreada}
                      />
                    ) : (
                      <button
                        onClick={() => setHorarioSeleccionado(horario)}
                        disabled={!horario.disponible}
                        className="btn btn-primary btn-reservar-main"
                      >
                        {horario.disponible ? "Seleccionar" : "Ocupado"}
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </PublicLayout>
  );
}
