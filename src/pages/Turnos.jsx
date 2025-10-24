import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import PublicLayout from "../layouts/PublicLayout";
import ClienteLayout from "../layouts/ClienteLayout";
import api from "../services/api";
import { showSuccess, showWarning, showError, showConfirm } from "../utils/alerts";

export default function Turnos() {
  const { idEspecialidad } = useParams();
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const [doctores, setDoctores] = useState([]);
  const [horarios, setHorarios] = useState([]);
  const [doctorSeleccionado, setDoctorSeleccionado] = useState(null);
  const [cargando, setCargando] = useState(false);

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
    api
      .get("/horarios")
      .then((res) => {
        const datos = Array.isArray(res.data) ? res.data : [];
        const horariosFiltrados = datos.filter(
          (h) => h.doctor?.idDoctor === idDoctor && h.disponible
        );
        setHorarios(horariosFiltrados);
      })
      .catch((error) => {
        console.error("Error al cargar horarios:", error);
        setHorarios([]);
      })
      .finally(() => setCargando(false));
  };

  // 📅 Reservar cita
  const reservarCita = async (idHorario) => {
    try {
      // ✅ Obtener usuario desde localStorage
      const usuarioGuardado = JSON.parse(localStorage.getItem("usuario"));
      
      if (!usuarioGuardado || !usuarioGuardado.token) {
        showWarning("Debes iniciar sesión para agendar una cita.", "Sesión requerida");
        navigate("/login");
        return;
      }

      // ✅ Obtener datos completos del usuario desde /auth/me
      const resUsuario = await api.get("/auth/me", {
        headers: {
          Authorization: `Bearer ${usuarioGuardado.token}`
        }
      });

      const usuario = resUsuario.data;

      if (!usuario || !usuario.idUsuario) {
        showWarning("No se pudo obtener tu información. Por favor, inicia sesión nuevamente.", "Error de sesión");
        navigate("/login");
        return;
      }

      const confirmar = await showConfirm("¿Deseas confirmar esta cita?", "Confirmar reserva");
      if (!confirmar) return;

      const cita = {
        paciente: { idUsuario: usuario.idUsuario },
        horario: { idHorario },
      };

      await api.post("/citas", cita, {
        headers: {
          Authorization: `Bearer ${usuarioGuardado.token}`
        }
      });
      
      showSuccess("Cita agendada correctamente.", "Reserva exitosa");
      navigate("/cliente/citas");
      
    } catch (err) {
      console.error("Error al agendar cita:", err);
      console.error("Detalles del error:", err.response?.data || err.message);
      showError(err.response?.data?.message || "No se pudo agendar la cita. Verifica tu conexión.");
    }
  };

  // Usar el layout correcto según si está autenticado o no
  const Layout = isAuthenticated ? ClienteLayout : PublicLayout;

  return (
    <Layout>
      <div className="container mt-5">
        <h2 className="text-center mb-4 fw-bold text-green-700">
          🗓️ Turnos disponibles - {idEspecialidad}
        </h2>

        {cargando && (
          <div className="text-center text-muted">
            <div className="spinner-border text-success" role="status"></div>
            <p className="mt-2">Cargando información...</p>
          </div>
        )}

        {!cargando && doctores.length === 0 && (
          <p className="text-center text-muted">
            No hay doctores registrados en esta especialidad.
          </p>
        )}

        {/* 🔹 Listado de doctores */}
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
                    doc.imagen?.startsWith("http")
                      ? doc.imagen
                      : `http://localhost:8080${doc.imagen}`
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
                    Cupo de pacientes: {doc.cupoPacientes}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 🕒 Horarios disponibles */}
        {doctorSeleccionado && (
          <>
            <hr />
            <h4 className="text-center mb-3 fw-semibold text-green-700">
              Horarios Disponibles
            </h4>

            {horarios.length === 0 ? (
              <p className="text-center text-muted">
                No hay horarios disponibles para este doctor.
              </p>
            ) : (
              <div className="table-responsive">
                <table className="table table-striped align-middle text-center shadow-sm">
                  <thead className="table-success">
                    <tr>
                      <th>Fecha</th>
                      <th>Turno</th>
                      <th>Inicio</th>
                      <th>Fin</th>
                      <th>Acción</th>
                    </tr>
                  </thead>
                  <tbody>
                    {horarios.map((h) => (
                      <tr key={h.idHorario}>
                        <td>{h.fecha}</td>
                        <td>{h.turno}</td>
                        <td>{h.horaInicio}</td>
                        <td>{h.horaFin}</td>
                        <td>
                          <button
                            className="btn btn-success btn-sm rounded-pill px-3"
                            onClick={() => reservarCita(h.idHorario)}
                          >
                            Reservar
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </div>

      <style>
        {`
          .card {
            transition: transform 0.25s ease, box-shadow 0.25s ease;
          }
          .card:hover {
            transform: translateY(-6px);
            box-shadow: 0 8px 18px rgba(0,0,0,0.1);
          }
          th {
            color: #065f46;
          }
        `}
      </style>
    </Layout>
  );
}
