import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ClienteLayout from "../layouts/ClienteLayout";
import api from "../services/api";
import { showSuccess, showError, showWarning } from "../utils/alerts";

export default function PerfilCliente() {
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState({ 
    nombre: "", 
    email: "", 
    dni: "", 
    telefono: "" 
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsuario = async () => {
      try {
        const storedUser = JSON.parse(localStorage.getItem("usuario"));
        console.log("📦 Usuario guardado en localStorage:", storedUser);
        
        const token = storedUser?.token;
        
        if (!token) {
          showWarning("No hay sesión activa. Redirigiendo al login...");
          navigate("/login");
          return;
        }
        
        // ✅ USAR /auth/me en lugar de /usuarios/{id}
        console.log("🔍 Obteniendo perfil desde /auth/me");
        const res = await api.get("/auth/me", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        console.log("✅ Datos del usuario recibidos:", res.data);
        setUsuario(res.data);
        
      } catch (err) {
        console.error("❌ Error al cargar el perfil:", err);
        console.error("Detalles del error:", err.response?.data || err.message);
        
        if (err.response?.status === 401) {
          showError("Sesión expirada. Por favor, inicia sesión nuevamente.");
          localStorage.clear();
          navigate("/login");
        } else {
          showError("No se pudo cargar tu perfil. Verifica tu conexión o contacta al administrador.");
        }
      } finally {
        setLoading(false);
      }
    };
    
    fetchUsuario();
  }, [navigate]);

  const handleSave = async (e) => {
    e.preventDefault();
    
    try {
      await api.put(`/usuarios/${usuario.idUsuario}`, usuario);
      showSuccess("Perfil actualizado", "Tus datos se guardaron correctamente");
      
      // Actualizar localStorage con los nuevos datos
      const storedUser = JSON.parse(localStorage.getItem("usuario"));
      localStorage.setItem("usuario", JSON.stringify({ ...storedUser, ...usuario }));
    } catch (err) {
      console.error("Error al actualizar perfil:", err);
      showError("No se pudo actualizar tu perfil. Intenta nuevamente.");
    }
  };

  if (loading) {
    return (
      <ClienteLayout>
        <div className="text-center mt-5">
          <div className="spinner-border text-success" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
        </div>
      </ClienteLayout>
    );
  }

  return (
    <ClienteLayout>
      <div className="container mt-4">
        <div className="row justify-content-center">
          <div className="col-md-8">
            <div className="card shadow">
              <div className="card-header bg-success text-white">
                <h4 className="mb-0">
                  <i className="fas fa-user-circle me-2"></i>
                  Mi Perfil
                </h4>
              </div>
              
              <div className="card-body">
                <form onSubmit={handleSave}>
                  <div className="mb-3">
                    <label className="form-label fw-bold">Nombre Completo</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Ingresa tu nombre completo"
                      value={usuario.nombre || ""}
                      onChange={(e) => setUsuario({ ...usuario, nombre: e.target.value })}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-bold">Correo Electrónico</label>
                    <input
                      type="email"
                      className="form-control"
                      placeholder="ejemplo@correo.com"
                      value={usuario.email || ""}
                      onChange={(e) => setUsuario({ ...usuario, email: e.target.value })}
                      required
                    />
                  </div>

                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label fw-bold">DNI</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="12345678"
                        value={usuario.dni || ""}
                        onChange={(e) => setUsuario({ ...usuario, dni: e.target.value })}
                        pattern="\d{8}"
                        maxLength="8"
                        required
                      />
                      <small className="text-muted">8 dígitos</small>
                    </div>

                    <div className="col-md-6 mb-3">
                      <label className="form-label fw-bold">Teléfono</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="987654321"
                        value={usuario.telefono || ""}
                        onChange={(e) => setUsuario({ ...usuario, telefono: e.target.value })}
                        pattern="\d{9}"
                        maxLength="9"
                        required
                      />
                      <small className="text-muted">9 dígitos</small>
                    </div>
                  </div>

                  <div className="d-grid">
                    <button type="submit" className="btn btn-success btn-lg">
                      <i className="fas fa-save me-2"></i>
                      Guardar Cambios
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ClienteLayout>
  );
}
