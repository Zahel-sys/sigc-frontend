import React, { useState, useEffect } from "react";
import ClienteLayout from "../layouts/ClienteLayout";
import { useUpdateProfile } from "../hooks/useUpdateProfile";
import { useChangePassword } from "../hooks/useChangePassword";
import { THEME } from "../config/theme";
import { validarEmail, validarDNI, validarTelefono } from "../utils/validators";
import { showWarning } from "../utils/alerts";

export default function PerfilCliente() {
  const { usuario, loading, actualizar } = useUpdateProfile();
  const { changePassword, loading: loadingPassword } = useChangePassword();

  // Perfil
  const [formPerfil, setFormPerfil] = useState({
    nombre: "",
    email: "",
    dni: "",
    telefono: ""
  });

  // Contraseña
  const [formPassword, setFormPassword] = useState({
    passwordActual: "",
    passwordNueva: "",
    passwordConfirmar: ""
  });

  useEffect(() => {
    if (usuario) {
      setFormPerfil({
        nombre: usuario.nombre || "",
        email: usuario.email || "",
        dni: usuario.dni || "",
        telefono: usuario.telefono || ""
      });
    }
  }, [usuario]);

  const handleChangePerfil = (e) => {
    const { name, value } = e.target;
    setFormPerfil(prev => ({ ...prev, [name]: value }));
  };

  const handleChangePassword = (e) => {
    const { name, value } = e.target;
    setFormPassword(prev => ({ ...prev, [name]: value }));
  };

  const handleSavePerfil = async (e) => {
    e.preventDefault();

    if (!validarEmail(formPerfil.email)) {
      showWarning("Email inválido");
      return;
    }

    if (!validarDNI(formPerfil.dni)) {
      showWarning("DNI debe tener 8 dígitos");
      return;
    }

    if (!validarTelefono(formPerfil.telefono)) {
      showWarning("Teléfono debe tener 9 dígitos");
      return;
    }

    await actualizar(formPerfil);
  };

  const handleChangePasswordSubmit = async (e) => {
    e.preventDefault();
    await changePassword(
      formPassword.passwordActual,
      formPassword.passwordNueva,
      formPassword.passwordConfirmar
    );
    // Limpiar formulario si fue exitoso
    setFormPassword({
      passwordActual: "",
      passwordNueva: "",
      passwordConfirmar: ""
    });
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
          {/* TARJETA: PERFIL */}
          <div className="col-12 col-lg-6 mb-4 mb-lg-0">
            <div
              className="card border-0 shadow-lg"
              style={{
                borderRadius: THEME.borderRadius.xl,
                overflow: "hidden",
                height: "100%"
              }}
            >
              <div
                className="card-header text-white text-center py-4"
                style={{
                  background: THEME.primary.gradient,
                  border: "none"
                }}
              >
                <div
                  style={{
                    width: "80px",
                    height: "80px",
                    backgroundColor: "rgba(255,255,255,0.2)",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 15px"
                  }}
                >
                  <i
                    className="fas fa-user"
                    style={{ fontSize: "2.5rem", color: "white" }}
                  ></i>
                </div>
                <h3 className="mb-0" style={{ fontWeight: "600" }}>
                  Mi Perfil
                </h3>
                <p className="mb-0 mt-2" style={{ opacity: 0.9, fontSize: "0.95rem" }}>
                  Actualiza tu información personal
                </p>
              </div>

              <div className="card-body p-4" style={{ backgroundColor: "#fafbfc" }}>
                <form onSubmit={handleSavePerfil}>
                  {/* Nombre */}
                  <div className="mb-4">
                    <label className="form-label fw-bold text-dark mb-2" style={{ fontSize: "0.95rem" }}>
                      <i className="fas fa-user me-2" style={{ color: THEME.primary.main }}></i>
                      Nombre Completo
                    </label>
                    <input
                      type="text"
                      className="form-control form-control-lg"
                      name="nombre"
                      value={formPerfil.nombre}
                      onChange={handleChangePerfil}
                      placeholder="Ingresa tu nombre completo"
                      style={{
                        border: "2px solid #e9ecef",
                        borderRadius: THEME.borderRadius.lg,
                        backgroundColor: "white",
                        transition: "all 0.3s ease"
                      }}
                      onFocus={(e) => e.target.style.borderColor = THEME.primary.main}
                      onBlur={(e) => e.target.style.borderColor = "#e9ecef"}
                      required
                    />
                  </div>

                  {/* Email */}
                  <div className="mb-4">
                    <label className="form-label fw-bold text-dark mb-2" style={{ fontSize: "0.95rem" }}>
                      <i className="fas fa-envelope me-2" style={{ color: THEME.primary.main }}></i>
                      Correo Electrónico
                    </label>
                    <input
                      type="email"
                      className="form-control form-control-lg"
                      name="email"
                      value={formPerfil.email}
                      onChange={handleChangePerfil}
                      placeholder="ejemplo@correo.com"
                      style={{
                        border: "2px solid #e9ecef",
                        borderRadius: THEME.borderRadius.lg,
                        backgroundColor: "white",
                        transition: "all 0.3s ease"
                      }}
                      onFocus={(e) => e.target.style.borderColor = THEME.primary.main}
                      onBlur={(e) => e.target.style.borderColor = "#e9ecef"}
                      required
                    />
                  </div>

                  {/* DNI */}
                  <div className="mb-4">
                    <label className="form-label fw-bold text-dark mb-2" style={{ fontSize: "0.95rem" }}>
                      <i className="fas fa-id-card me-2" style={{ color: THEME.primary.main }}></i>
                      DNI
                    </label>
                    <input
                      type="text"
                      className="form-control form-control-lg"
                      name="dni"
                      value={formPerfil.dni}
                      onChange={handleChangePerfil}
                      placeholder="12345678"
                      pattern="\d{8}"
                      maxLength="8"
                      style={{
                        border: "2px solid #e9ecef",
                        borderRadius: THEME.borderRadius.lg,
                        backgroundColor: "white",
                        transition: "all 0.3s ease"
                      }}
                      onFocus={(e) => e.target.style.borderColor = THEME.primary.main}
                      onBlur={(e) => e.target.style.borderColor = "#e9ecef"}
                      required
                    />
                  </div>

                  {/* Teléfono */}
                  <div className="mb-4">
                    <label className="form-label fw-bold text-dark mb-2" style={{ fontSize: "0.95rem" }}>
                      <i className="fas fa-phone me-2" style={{ color: THEME.primary.main }}></i>
                      Teléfono
                    </label>
                    <input
                      type="text"
                      className="form-control form-control-lg"
                      name="telefono"
                      value={formPerfil.telefono}
                      onChange={handleChangePerfil}
                      placeholder="987654321"
                      pattern="\d{9}"
                      maxLength="9"
                      style={{
                        border: "2px solid #e9ecef",
                        borderRadius: THEME.borderRadius.lg,
                        backgroundColor: "white",
                        transition: "all 0.3s ease"
                      }}
                      onFocus={(e) => e.target.style.borderColor = THEME.primary.main}
                      onBlur={(e) => e.target.style.borderColor = "#e9ecef"}
                      required
                    />
                  </div>

                  {/* Botón Guardar */}
                  <div className="d-grid mt-4">
                    <button
                      type="submit"
                      className="btn btn-lg py-3"
                      style={{
                        background: THEME.primary.gradient,
                        border: "none",
                        borderRadius: THEME.borderRadius.lg,
                        color: "white",
                        fontWeight: "600",
                        fontSize: "1.1rem",
                        boxShadow: `0 4px 15px ${THEME.primary.shadowColor}`,
                        transition: "all 0.3s ease"
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.transform = "translateY(-2px)";
                        e.target.style.boxShadow = `0 6px 20px ${THEME.primary.shadowColor}`;
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.transform = "translateY(0px)";
                        e.target.style.boxShadow = `0 4px 15px ${THEME.primary.shadowColor}`;
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

          {/* TARJETA: CAMBIO DE CONTRASEÑA */}
          <div className="col-12 col-lg-6">
            <div
              className="card border-0 shadow-lg"
              style={{
                borderRadius: THEME.borderRadius.xl,
                overflow: "hidden",
                height: "100%"
              }}
            >
              <div
                className="card-header text-white text-center py-4"
                style={{
                  background: THEME.warning.gradient,
                  border: "none"
                }}
              >
                <div
                  style={{
                    width: "80px",
                    height: "80px",
                    backgroundColor: "rgba(255,255,255,0.2)",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 15px"
                  }}
                >
                  <i
                    className="fas fa-lock"
                    style={{ fontSize: "2.5rem", color: "white" }}
                  ></i>
                </div>
                <h3 className="mb-0" style={{ fontWeight: "600" }}>
                  Cambiar Contraseña
                </h3>
                <p className="mb-0 mt-2" style={{ opacity: 0.9, fontSize: "0.95rem" }}>
                  Actualiza tu contraseña de forma segura
                </p>
              </div>

              <div className="card-body p-4" style={{ backgroundColor: "#fafbfc" }}>
                <form onSubmit={handleChangePasswordSubmit}>
                  {/* Contraseña Actual */}
                  <div className="mb-4">
                    <label className="form-label fw-bold text-dark mb-2" style={{ fontSize: "0.95rem" }}>
                      <i className="fas fa-key me-2" style={{ color: THEME.warning.main }}></i>
                      Contraseña Actual
                    </label>
                    <input
                      type="password"
                      className="form-control form-control-lg"
                      name="passwordActual"
                      value={formPassword.passwordActual}
                      onChange={handleChangePassword}
                      placeholder="Ingresa tu contraseña actual"
                      style={{
                        border: "2px solid #e9ecef",
                        borderRadius: THEME.borderRadius.lg,
                        backgroundColor: "white",
                        transition: "all 0.3s ease"
                      }}
                      onFocus={(e) => e.target.style.borderColor = THEME.warning.main}
                      onBlur={(e) => e.target.style.borderColor = "#e9ecef"}
                      required
                    />
                  </div>

                  {/* Nueva Contraseña */}
                  <div className="mb-4">
                    <label className="form-label fw-bold text-dark mb-2" style={{ fontSize: "0.95rem" }}>
                      <i className="fas fa-lock me-2" style={{ color: THEME.warning.main }}></i>
                      Nueva Contraseña
                    </label>
                    <input
                      type="password"
                      className="form-control form-control-lg"
                      name="passwordNueva"
                      value={formPassword.passwordNueva}
                      onChange={handleChangePassword}
                      placeholder="Ingresa tu nueva contraseña"
                      style={{
                        border: "2px solid #e9ecef",
                        borderRadius: THEME.borderRadius.lg,
                        backgroundColor: "white",
                        transition: "all 0.3s ease"
                      }}
                      onFocus={(e) => e.target.style.borderColor = THEME.warning.main}
                      onBlur={(e) => e.target.style.borderColor = "#e9ecef"}
                      required
                    />
                    <small className="text-muted d-block mt-2">
                      La contraseña debe tener al menos 6 caracteres
                    </small>
                  </div>

                  {/* Confirmar Contraseña */}
                  <div className="mb-4">
                    <label className="form-label fw-bold text-dark mb-2" style={{ fontSize: "0.95rem" }}>
                      <i className="fas fa-check-circle me-2" style={{ color: THEME.warning.main }}></i>
                      Confirmar Nueva Contraseña
                    </label>
                    <input
                      type="password"
                      className="form-control form-control-lg"
                      name="passwordConfirmar"
                      value={formPassword.passwordConfirmar}
                      onChange={handleChangePassword}
                      placeholder="Confirma tu nueva contraseña"
                      style={{
                        border: "2px solid #e9ecef",
                        borderRadius: THEME.borderRadius.lg,
                        backgroundColor: "white",
                        transition: "all 0.3s ease"
                      }}
                      onFocus={(e) => e.target.style.borderColor = THEME.warning.main}
                      onBlur={(e) => e.target.style.borderColor = "#e9ecef"}
                      required
                    />
                  </div>

                  {/* Alert */}
                  <div className="alert alert-info mb-4" role="alert" style={{ borderRadius: THEME.borderRadius.md }}>
                    <i className="fas fa-info-circle me-2"></i>
                    <strong>Nota:</strong> Por seguridad, tendrás que iniciar sesión nuevamente después de cambiar tu contraseña.
                  </div>

                  {/* Botón Cambiar */}
                  <div className="d-grid mt-4">
                    <button
                      type="submit"
                      disabled={loadingPassword}
                      className="btn btn-lg py-3"
                      style={{
                        background: THEME.warning.gradient,
                        border: "none",
                        borderRadius: THEME.borderRadius.lg,
                        color: "white",
                        fontWeight: "600",
                        fontSize: "1.1rem",
                        boxShadow: `0 4px 15px ${THEME.warning.shadowColor}`,
                        transition: "all 0.3s ease",
                        opacity: loadingPassword ? 0.7 : 1
                      }}
                      onMouseEnter={(e) => {
                        if (!loadingPassword) {
                          e.target.style.transform = "translateY(-2px)";
                          e.target.style.boxShadow = `0 6px 20px ${THEME.warning.shadowColor}`;
                        }
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.transform = "translateY(0px)";
                        e.target.style.boxShadow = `0 4px 15px ${THEME.warning.shadowColor}`;
                      }}
                    >
                      {loadingPassword ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                          Cambiando...
                        </>
                      ) : (
                        <>
                          <i className="fas fa-shield-alt me-2"></i>
                          Cambiar Contraseña
                        </>
                      )}
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
