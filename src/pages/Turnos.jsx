import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ClienteLayout from "../layouts/ClienteLayout";
import api from "../services/api";

export default function Turnos() {
  const { idEspecialidad } = useParams();
  const navigate = useNavigate();

  const [doctores, setDoctores] = useState([]);
  const [horarios, setHorarios] = useState([]);
  const [doctorSeleccionado, setDoctorSeleccionado] = useState(null);
  const [cargando, setCargando] = useState(false);

  // 🩺 Cargar doctores filtrados por especialidad
  useEffect(() => {
    setCargando(true);
    api.get("/doctores")
      .then((res) => {
        const filtrados = res.data.filter(
          (d) =>
            d.especialidad.toLowerCase().trim() ===
            idEspecialidad.toLowerCase().trim()
        );
        setDoctores(filtrados);
      })
      .finally(() => setCargando(false));
  }, [idEspecialidad]);

  // 🕓 Cargar horarios de un doctor
  const cargarHorarios = (idDoctor) => {
    setDoctorSeleccionado(idDoctor);
    setCargando(true);
    api
      .get(`/horarios`)
      .then((res) => {
        const horariosFiltrados = res.data.filter(
          (h) => h.doctor?.idDoctor === idDoctor && h.disponible
        );
        setHorarios(horariosFiltrados);
      })
      .finally(() => setCargando(false));
  };

  // 📅 Reservar cita
  const reservarCita = async (idHorario) => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
      alert("⚠️ Debes iniciar sesión para agendar una cita.");
      return;
    }

    const confirmar = confirm("¿Deseas confirmar esta cita?");
    if (!confirmar) return;

    const cita = {
      usuario: { idUsuario: user.id },
      horario: { idHorario },
    };

    try {
      await api.post("/citas", cita);
      alert("✅ Cita agendada correctamente.");
      navigate("/cliente/citas");
    } catch (err) {
      alert("❌ No se pudo agendar la cita: " + err.response?.data || err.message);
    }
  };

  return (
    <ClienteLayout>
      <div className="container mt-5">
        <h2 className="text-center mb-4 fw-bold">
          Turnos disponibles - {idEspecialidad}
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
                    height: "200px",
                    borderTopLeftRadius: "10px",
                    borderTopRightRadius: "10px",
                  }}
                  onError={(e) => (e.target.src = "/default.png")}
                />
                <div className="card-body text-center">
                  <h5 className="fw-bold">{doc.nombre}</h5>
                  <p className="text-muted small">{doc.especialidad}</p>
                  <p className="text-secondary small">
                    Cupo de pacientes: {doc.cupoPacientes}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 🕒 Mostrar horarios del doctor seleccionado */}
        {doctorSeleccionado && (
          <>
            <hr />
            <h4 className="text-center mb-3">Horarios Disponibles</h4>

            {horarios.length === 0 ? (
              <p className="text-center text-muted">
                No hay horarios disponibles para este doctor.
              </p>
            ) : (
              <div className="table-responsive">
                <table className="table table-striped align-middle text-center">
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
                            className="btn btn-success btn-sm"
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
          .card:hover {
            transform: translateY(-5px);
            transition: transform 0.2s ease, box-shadow 0.2s ease;
            box-shadow: 0 5px 15px rgba(0,0,0,0.1);
          }
        `}
      </style>
    </ClienteLayout>
  );
}
