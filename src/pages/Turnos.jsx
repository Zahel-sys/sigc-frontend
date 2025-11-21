import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import PublicLayout from "../layouts/PublicLayout";
import { useEspecialidades } from "../hooks/useEspecialidades";
import { useHorariosDisponibles } from "../hooks/useHorariosDisponibles";
import { showSuccess } from "../utils/alerts";
import { THEME } from "../config/theme";
import ReservarCita from "../components/ReservarCita";
import "../styles/Turnos.css";

/**
 * Página de Turnos - Seleccionar doctor y reservar cita
 * Responsabilidad: Orquestar selección de doctor y horario
 */
export default function Turnos() {
  const { idEspecialidad } = useParams();
  const { doctores, loading: loadingDoctores } = useEspecialidades(idEspecialidad);
  const { horarios, loading: loadingHorarios, error: errorHorarios, cargarHorarios, recargarHorarios } = useHorariosDisponibles();

  const [doctorSeleccionado, setDoctorSeleccionado] = useState(null);
  const [horarioSeleccionado, setHorarioSeleccionado] = useState(null);

  // Verificar autenticación - usuario puede reservar cita
  useEffect(() => {
    localStorage.getItem("usuario");
  }, []);

  // Cargar horarios cuando se selecciona un doctor
  const handleSelectDoctor = (idDoctor) => {
    setDoctorSeleccionado(idDoctor);
    setHorarioSeleccionado(null);
    cargarHorarios(idDoctor);
  };

  // Manejar cuando se crea una cita
  const handleCitaCreada = () => {
    showSuccess("¡Cita reservada exitosamente!", "Tu cita ha sido confirmada");
    setHorarioSeleccionado(null);
    recargarHorarios(doctorSeleccionado);
  };

  // Formatear fecha a formato legible
  const formatearFecha = (fecha) => {
    const opciones = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(fecha).toLocaleDateString('es-ES', opciones);
  };

  // Formatear hora (HH:mm:ss a HH:mm)
  const formatearHora = (hora) => {
    return hora.substring(0, 5);
  };

  return (
    <PublicLayout>
      <div className="container mt-4">
        <h2 className="mb-4">Selecciona un Doctor</h2>

        {/* CARGANDO DOCTORES */}
        {loadingDoctores && (
          <div className="alert alert-info">
            <div className="spinner-border spinner-border-sm me-2" role="status">
              <span className="visually-hidden">Cargando...</span>
            </div>
            Cargando doctores...
          </div>
        )}

        {/* GRILLA DE DOCTORES */}
        {!loadingDoctores && (
          <div className="row justify-content-center">
            {doctores.map((doc) => (
              <div
                key={doc.idDoctor}
                className="col-md-4 mb-4"
                style={{ cursor: "pointer" }}
              >
                <div
                  className={`card h-100 shadow-sm border-0 ${
                    doctorSeleccionado === doc.idDoctor
                      ? "border-success shadow"
                      : ""
                  }`}
                  onClick={() => handleSelectDoctor(doc.idDoctor)}
                  style={{
                    borderWidth: doctorSeleccionado === doc.idDoctor ? "3px" : "0",
                    borderColor: doctorSeleccionado === doc.idDoctor ? THEME.success.main : "transparent",
                    transition: "all 0.3s ease",
                    cursor: "pointer"
                  }}
                >
                  <img
                    src={
                      doc.imagen
                        ? `http://localhost:8080${doc.imagen}`
                        : "https://via.placeholder.com/200x250?text=Sin+Foto"
                    }
                    alt={doc.nombre}
                    className="card-img-top"
                    style={{
                      objectFit: "cover",
                      height: "230px"
                    }}
                    onError={(e) => e.target.src = "https://via.placeholder.com/200x250?text=Sin+Foto"}
                  />
                  <div className="card-body text-center">
                    <h5 className="fw-bold" style={{ color: THEME.primary.main }}>
                      {doc.nombre}
                    </h5>
                    <p className="text-muted small">{doc.especialidad}</p>
                    <p className="text-secondary small">
                      Cupo disponible: {doc.cupoPacientes}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* HORARIOS DISPONIBLES */}
        {doctorSeleccionado && (
          <div className="mt-5">
            <h3 className="mb-3">Horarios Disponibles</h3>

            {/* CARGANDO */}
            {loadingHorarios && (
              <div className="alert alert-info" role="alert">
                <div className="spinner-border spinner-border-sm me-2" role="status">
                  <span className="visually-hidden">Cargando...</span>
                </div>
                Cargando horarios...
              </div>
            )}

            {/* ERROR */}
            {!loadingHorarios && errorHorarios && (
              <div className="alert alert-danger" role="alert">
                ⚠️ {errorHorarios}
              </div>
            )}

            {/* SIN HORARIOS */}
            {!loadingHorarios && !errorHorarios && horarios.length === 0 && (
              <div className="alert alert-warning" role="alert">
                📅 No hay horarios disponibles para este doctor
              </div>
            )}

            {/* TABLA DE HORARIOS */}
            {!loadingHorarios && !errorHorarios && horarios.length > 0 && (
              <div className="horarios-grid">
                {horarios.map((horario) => (
                  <div
                    key={horario.idHorario}
                    className="horario-card"
                    style={{
                      border: horarioSeleccionado?.idHorario === horario.idHorario
                        ? `2px solid ${THEME.primary.main}`
                        : "1px solid #e9ecef",
                      borderRadius: THEME.borderRadius.lg,
                      padding: "1rem",
                      transition: "all 0.3s ease"
                    }}
                  >
                    <div className="horario-header" style={{ marginBottom: "1rem" }}>
                      <h4 style={{ marginBottom: "0.5rem" }}>
                        {formatearFecha(horario.fecha)}
                      </h4>
                      <span
                        className="badge"
                        style={{
                          backgroundColor: horario.turno === "MAÑANA"
                            ? THEME.info.main
                            : horario.turno === "TARDE"
                            ? THEME.warning.main
                            : THEME.secondary.main
                        }}
                      >
                        {horario.turno}
                      </span>
                    </div>

                    <div className="horario-body" style={{ marginBottom: "1rem" }}>
                      <div style={{ marginBottom: "0.5rem" }}>
                        <p style={{ marginBottom: "0.25rem" }}>
                          <strong>Hora Inicio:</strong> {formatearHora(horario.horaInicio)}
                        </p>
                        <p style={{ marginBottom: "0" }}>
                          <strong>Hora Fin:</strong> {formatearHora(horario.horaFin)}
                        </p>
                      </div>

                      <div>
                        {horario.disponible ? (
                          <span
                            className="badge"
                            style={{ backgroundColor: THEME.success.main }}
                          >
                            ✓ Disponible
                          </span>
                        ) : (
                          <span
                            className="badge"
                            style={{ backgroundColor: THEME.danger.main }}
                          >
                            ✗ Ocupado
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Componente ReservarCita o botón Seleccionar */}
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
                        className="btn w-100"
                        style={{
                          background: THEME.primary.gradient,
                          color: "white",
                          border: "none",
                          borderRadius: THEME.borderRadius.md,
                          fontWeight: "600",
                          opacity: horario.disponible ? 1 : 0.5,
                          cursor: horario.disponible ? "pointer" : "not-allowed"
                        }}
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
