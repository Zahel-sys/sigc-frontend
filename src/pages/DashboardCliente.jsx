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
    const cargarDatos = async () => {
      try {
        const usuarioGuardado = JSON.parse(localStorage.getItem("usuario"));
        console.log("📦 Usuario del localStorage:", usuarioGuardado);
        
        const token = usuarioGuardado?.token;
        
        if (!token) {
          console.error("❌ No hay token, redirigiendo al login");
          navigate("/login");
          return;
        }

        // ✅ NUEVO: Usar endpoint /auth/me que no requiere ID
        console.log("🔍 Obteniendo datos del usuario autenticado desde /auth/me");
        
        const resUsuario = await api.get("/auth/me", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        console.log("✅ Datos recibidos del backend:", resUsuario.data);
        setUsuario(resUsuario.data);
        
        // Cargar citas del usuario
        try {
          const resCitas = await api.get(`/citas/usuario/${resUsuario.data.idUsuario}`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          setCitas(Array.isArray(resCitas.data) ? resCitas.data : []);
        } catch (err) {
          console.warn("⚠️ No se pudieron cargar las citas:", err.message);
          setCitas([]);
        }
        
      } catch (err) {
        console.error("❌ Error al cargar datos del dashboard:", err);
        console.error("Detalles del error:", err.response?.data || err.message);
        
        if (err.response?.status === 401) {
          console.error("Token inválido o expirado, limpiando sesión");
          localStorage.clear();
          navigate("/login");
        } else {
          // Si hay error, mostrar datos mínimos
          const usuarioGuardado = JSON.parse(localStorage.getItem("usuario"));
          if (usuarioGuardado) {
            console.log("🔄 Usando datos del localStorage como fallback");
            setUsuario({
              nombre: "Usuario",
              email: usuarioGuardado?.email || "Sin email",
              rol: usuarioGuardado?.rol || "PACIENTE",
              dni: "No disponible",
              telefono: "No disponible"
            });
          }
        }
      }
    };
    cargarDatos();
  }, [navigate]);

  // 🗓️ Filtrar próximas citas
  const citasActivas = Array.isArray(citas) ? citas.filter((c) => c.estado === "ACTIVA") : [];

  return (
    <ClienteLayout>
      <div className="container mt-4">
        <h2 className="fw-bold text-center mb-4">Bienvenido al Panel del Paciente</h2>

        {/* 🧍 Información del usuario */}
        {usuario && (
          <div className="card shadow-sm border-0 mb-4" style={{ 
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            width: '100%'
          }}>
            <div className="card-body">
              <div className="row align-items-center" style={{width: '100%'}}>
                <div className="col-auto">
                  <FaUserCircle size={80} color="white" style={{ opacity: 0.9 }} />
                </div>
                <div className="col">
                  <h4 className="mb-2 fw-bold">{usuario.nombre || "Usuario"}</h4>
                  <p className="mb-2" style={{ opacity: 0.95 }}>
                    <strong>📧 Email:</strong> {usuario.email || "Sin email"}
                  </p>
                  <div className="row">
                    <div className="col-md-6" style={{width: '150px'}}>
                      <div style={{ opacity: 0.95 }}>
                        <strong>DNI:</strong> {usuario.dni || "No registrado"}
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div style={{ opacity: 0.95 }}>
                        <strong>Teléfono:</strong> {usuario.telefono || "No registrado"}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 🔹 Tarjetas de acceso rápido */}
        <div className="row g-4 mb-4" style={{marginLeft: '70px'}}>
          <div className="col-md-4">
            <div
              className="card dashboard-card border-0 shadow-sm h-100"
              onClick={() => navigate("/cliente/citas")}
              style={{ cursor: 'pointer', transition: 'all 0.3s ease' }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-5px)';
                e.currentTarget.style.boxShadow = '0 8px 20px rgba(32, 201, 151, 0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
              }}
            >
              <div className="card-body text-center p-4">
                <div className="mb-3" style={{ 
                  width: '70px', 
                  height: '70px', 
                  margin: '0 auto',
                  background: 'linear-gradient(135deg, #20c997, #17a589)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <FaCalendarAlt size={35} color="white" />
                </div>
                <h5 className="fw-bold mb-2">Mis Citas</h5>
                <p className="text-muted small mb-0">Ver o cancelar tus citas</p>
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div
              className="card dashboard-card border-0 shadow-sm h-100"
              onClick={() => navigate("/especialidades")}
              style={{ cursor: 'pointer', transition: 'all 0.3s ease' }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-5px)';
                e.currentTarget.style.boxShadow = '0 8px 20px rgba(220, 53, 69, 0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
              }}
            >
              <div className="card-body text-center p-4">
                <div className="mb-3" style={{ 
                  width: '70px', 
                  height: '70px', 
                  margin: '0 auto',
                  background: 'linear-gradient(135deg, #dc3545, #c82333)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <FaHeartbeat size={35} color="white" />
                </div>
                <h5 className="fw-bold mb-2">Especialidades</h5>
                <p className="text-muted small mb-0">Reserva tu próxima cita médica</p>
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div
              className="card dashboard-card border-0 shadow-sm h-100"
              onClick={() => navigate("/cliente/perfil")}
              style={{ cursor: 'pointer', transition: 'all 0.3s ease' }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-5px)';
                e.currentTarget.style.boxShadow = '0 8px 20px rgba(13, 110, 253, 0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
              }}
            >
              <div className="card-body text-center p-4">
                <div className="mb-3" style={{ 
                  width: '70px', 
                  height: '70px', 
                  margin: '0 auto',
                  background: 'linear-gradient(135deg, #0d6efd, #0a58ca)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <FaClipboardList size={35} color="white" />
                </div>
                <h5 className="fw-bold mb-2">Mi Perfil</h5>
                <p className="text-muted small mb-0">Edita tus datos personales</p>
              </div>
            </div>
          </div>
        </div>

        {/* 📅 Próximas citas */}
        <div className="card shadow-sm border-0" style={{width: '100%'}}>
          <div className="card-header text-white fw-semibold" style={{
            background: 'linear-gradient(135deg, #20c997, #17a589)',
            padding: '1rem 1.5rem'
          }}>
            <FaCalendarAlt className="me-2" />
            Próximas Citas Activas
          </div>
          <div className="card-body p-4">
            {citasActivas.length === 0 ? (
              <div className="text-center py-5">
                <FaCalendarAlt size={50} color="#dee2e6" className="mb-3" />
                <p className="text-muted m-0">No tienes citas activas actualmente.</p>
                <button 
                  className="btn btn-success mt-3"
                  onClick={() => navigate("/especialidades")}
                >
                  Reservar una cita
                </button>
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table table-hover align-middle">
                  <thead style={{ backgroundColor: '#f8f9fa' }}>
                    <tr>
                      <th className="border-0">Doctor</th>
                      <th className="border-0">Especialidad</th>
                      <th className="border-0">Fecha</th>
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
