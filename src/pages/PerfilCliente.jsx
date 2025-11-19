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
      <div className="container-fluid py-4">
        <div className="row">
          <div className="col-12 col-md-10 col-lg-8">
            <div className="card border-0 shadow-lg" style={{ borderRadius: '15px', overflow: 'hidden' }}>
              <div className="card-header text-white text-center py-4" 
                   style={{ 
                     background: 'linear-gradient(135deg, #20c997, #16a085)',
                     border: 'none'
                   }}>
                <div style={{ marginBottom: '10px' }}>
                  <div style={{ 
                    width: '80px', 
                    height: '80px', 
                    backgroundColor: 'rgba(255,255,255,0.2)', 
                    borderRadius: '50%', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    margin: '0 auto 15px'
                  }}>
                    <i className="fas fa-user" style={{ fontSize: '2.5rem', color: 'white' }}></i>
                  </div>
                </div>
                <h3 className="mb-0" style={{ fontWeight: '600' }}>Mi Perfil</h3>
                <p className="mb-0 mt-2" style={{ opacity: 0.9, fontSize: '0.95rem' }}>Actualiza tu información personal</p>
              </div>
              
              <div className="card-body p-4" style={{ backgroundColor: '#fafbfc' }}>
                <form onSubmit={handleSave}>
                  <div className="mb-4">
                    <label className="form-label fw-bold text-dark mb-2" style={{ fontSize: '0.95rem' }}>
                      <i className="fas fa-user me-2 text-success"></i>
                      Nombre Completo
                    </label>
                    <input
                      type="text"
                      className="form-control form-control-lg"
                      style={{ 
                        border: '2px solid #e9ecef', 
                        borderRadius: '10px',
                        backgroundColor: 'white',
                        transition: 'all 0.3s ease'
                      }}
                      placeholder="Ingresa tu nombre completo"
                      value={usuario.nombre || ""}
                      onChange={(e) => setUsuario({ ...usuario, nombre: e.target.value })}
                      onFocus={(e) => e.target.style.borderColor = '#20c997'}
                      onBlur={(e) => e.target.style.borderColor = '#e9ecef'}
                      required
                    />
                  </div>

                  <div className="mb-4">
                    <label className="form-label fw-bold text-dark mb-2" style={{ fontSize: '0.95rem' }}>
                      <i className="fas fa-envelope me-2 text-success"></i>
                      Correo Electrónico
                    </label>
                    <input
                      type="email"
                      className="form-control form-control-lg"
                      style={{ 
                        border: '2px solid #e9ecef', 
                        borderRadius: '10px',
                        backgroundColor: 'white',
                        transition: 'all 0.3s ease'
                      }}
                      placeholder="ejemplo@correo.com"
                      value={usuario.email || ""}
                      onChange={(e) => setUsuario({ ...usuario, email: e.target.value })}
                      onFocus={(e) => e.target.style.borderColor = '#20c997'}
                      onBlur={(e) => e.target.style.borderColor = '#e9ecef'}
                      required
                    />
                  </div>

                  <div className="mb-4">
                    <label className="form-label fw-bold text-dark mb-2" style={{ fontSize: '0.95rem' }}>
                      <i className="fas fa-id-card me-2 text-success"></i>
                      DNI
                    </label>
                    <input
                      type="text"
                      className="form-control form-control-lg mb-3"
                      style={{ 
                        border: '2px solid #e9ecef', 
                        borderRadius: '10px',
                        backgroundColor: 'white',
                        transition: 'all 0.3s ease',
                        width: '100%',
                        fontSize: '1rem'
                      }}
                      placeholder="12345678"
                      value={usuario.dni || ""}
                      onChange={(e) => setUsuario({ ...usuario, dni: e.target.value })}
                      onFocus={(e) => e.target.style.borderColor = '#20c997'}
                      onBlur={(e) => e.target.style.borderColor = '#e9ecef'}
                      pattern="\d{8}"
                      maxLength="8"
                      required
                    />
                  </div>

                  <div className="mb-4">
                    <label className="form-label fw-bold text-dark mb-2" style={{ fontSize: '0.95rem' }}>
                      <i className="fas fa-phone me-2 text-success"></i>
                      Teléfono
                    </label>
                    <input
                      type="text"
                      className="form-control form-control-lg"
                      style={{ 
                        border: '2px solid #e9ecef', 
                        borderRadius: '10px',
                        backgroundColor: 'white',
                        transition: 'all 0.3s ease',
                        width: '100%',
                        fontSize: '1rem'
                      }}
                      placeholder="987654321"
                      value={usuario.telefono || ""}
                      onChange={(e) => setUsuario({ ...usuario, telefono: e.target.value })}
                      onFocus={(e) => e.target.style.borderColor = '#20c997'}
                      onBlur={(e) => e.target.style.borderColor = '#e9ecef'}
                      pattern="\d{9}"
                      maxLength="9"
                      required
                    />
                  </div>

                  <div className="d-grid mt-4">
                    <button 
                      type="submit" 
                      className="btn btn-lg py-3"
                      style={{
                        background: 'linear-gradient(135deg, #20c997, #16a085)',
                        border: 'none',
                        borderRadius: '12px',
                        color: 'white',
                        fontWeight: '600',
                        fontSize: '1.1rem',
                        boxShadow: '0 4px 15px rgba(32, 201, 151, 0.3)',
                        transition: 'all 0.3s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.transform = 'translateY(-2px)';
                        e.target.style.boxShadow = '0 6px 20px rgba(32, 201, 151, 0.4)';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.transform = 'translateY(0px)';
                        e.target.style.boxShadow = '0 4px 15px rgba(32, 201, 151, 0.3)';
                      }}
                    >
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
