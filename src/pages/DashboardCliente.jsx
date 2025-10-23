import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaUserCircle, FaCalendarAlt, FaHeartbeat, FaClipboardList } from "react-icons/fa";
import ClienteLayout from "../layouts/ClienteLayout";
import api from "../services/api";

export default function DashboardCliente() {
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState(null);
  const [citas, setCitas] = useState([]);

  // 🧠 Obtener datos del usuario actual
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      api.get(`/usuarios/${user.id}`).then((res) => setUsuario(res.data));
      api.get(`/citas/usuario/${user.id}`).then((res) => setCitas(res.data));
    }
  }, []);

  // 🗓️ Filtrar próximas citas
  const citasActivas = citas.filter((c) => c.estado === "ACTIVA");

  return (
    <ClienteLayout>
      <div className="container mt-4">
        <h2 className="fw-bold text-center mb-4">Bienvenido al Panel del Paciente</h2>

        {/* 🧍 Información del usuario */}
        {usuario && (
          <div className="card shadow-sm border-0 mb-4">
            <div className="card-body d-flex align-items-center">
              <FaUserCircle size={70} color="#20c997" className="me-3" />
              <div>
                <h5 className="mb-1 fw-bold">{usuario.nombre}</h5>
                <p className="mb-1 text-muted">{usuario.email}</p>
                <p className="mb-1">
                  <strong>DNI:</strong> {usuario.dni} &nbsp; | &nbsp;
                  <strong>Teléfono:</strong> {usuario.telefono}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* 🔹 Tarjetas de acceso rápido */}
        <div className="row g-4 mb-4">
          <div className="col-md-4">
            <div
              className="card dashboard-card"
              onClick={() => navigate("/cliente/citas")}
            >
              <div className="card-body text-center">
                <FaCalendarAlt size={40} className="text-success mb-2" />
                <h5 className="fw-bold">Mis Citas</h5>
                <p className="text-muted small">Ver o cancelar tus citas</p>
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div
              className="card dashboard-card"
              onClick={() => navigate("/especialidades")}
            >
              <div className="card-body text-center">
                <FaHeartbeat size={40} className="text-danger mb-2" />
                <h5 className="fw-bold">Especialidades</h5>
                <p className="text-muted small">Reserva tu próxima cita médica</p>
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div
              className="card dashboard-card"
              onClick={() => navigate("/cliente/perfil")}
            >
              <div className="card-body text-center">
                <FaClipboardList size={40} className="text-primary mb-2" />
                <h5 className="fw-bold">Mi Perfil</h5>
                <p className="text-muted small">Edita tus datos personales</p>
              </div>
            </div>
          </div>
        </div>

        {/* 📅 Próximas citas */}
        <div className="card shadow-sm border-0">
          <div className="card-header bg-success text-white fw-semibold">
            Próximas Citas Activas
          </div>
          <div className="card-body">
            {citasActivas.length === 0 ? (
              <p className="text-muted text-center m-0">
                No tienes citas activas actualmente.
              </p>
            ) : (
              <div className="table-responsive">
                <table className="table table-striped align-middle text-center">
                  <thead className="table-light">
                    <tr>
                      <th>Doctor</th>
                      <th>Especialidad</th>
                      <th>Fecha</th>
                      <th>Hora</th>
                      <th>Estado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {citasActivas.map((c) => (
                      <tr key={c.idCita}>
                        <td>{c.doctor?.nombre}</td>
                        <td>{c.doctor?.especialidad}</td>
                        <td>{c.fechaCita}</td>
                        <td>{c.horaCita}</td>
                        <td>
                          <span className="badge bg-success">{c.estado}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 💅 Estilos inline */}
      <style>
        {`
          .dashboard-card {
            cursor: pointer;
            border: none;
            box-shadow: 0 0 12px rgba(0,0,0,0.08);
            transition: transform 0.25s ease, box-shadow 0.25s ease;
          }
          .dashboard-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 0 15px rgba(0,0,0,0.15);
          }
        `}
      </style>
    </ClienteLayout>
  );
}
