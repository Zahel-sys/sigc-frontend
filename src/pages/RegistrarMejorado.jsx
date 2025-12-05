import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { validationSchemas } from "../utils/validators/schemas";
import api from "../services/api";
import { showSuccess, showError, showWarning } from "../utils/alerts";

export default function RegistrarMejorado() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    watch,
    setValue,
  } = useForm({
    resolver: yupResolver(validationSchemas.registro),
    mode: "onChange", // Validación en tiempo real
    defaultValues: {
      nombre: "",
      email: "",
      password: "",
      confirmPassword: "",
      dni: "",
      telefono: "",
      rol: "PACIENTE",
    },
  });

  // Observar cambios para feedback visual
  const watchedFields = watch();

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const { confirmPassword, ...userData } = data;
      const res = await api.post("/auth/register", userData);

      if (res.data && res.data.idUsuario) {
        showSuccess(
          "¡Registro exitoso! Ya puedes iniciar sesión.",
          "Bienvenido a SIGC"
        );
        navigate("/login");
      } else {
        showError("No se pudo completar el registro. Intenta nuevamente.");
      }
    } catch (err) {
      console.error("Error al registrar:", err);
      const mensaje =
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Error al registrar el usuario. Verifica tu conexión.";
      showError(mensaje);
    } finally {
      setLoading(false);
    }
  };

  // Helper para formatear inputs específicos
  const handleDNIChange = (e) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 8);
    setValue("dni", value, { shouldValidate: true });
  };

  const handleTelefonoChange = (e) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 9);
    setValue("telefono", value, { shouldValidate: true });
  };

  const handleNombreChange = (e) => {
    const value = e.target.value.replace(/[^a-zA-ZñÑáéíóúÁÉÍÓÚ\s]/g, "");
    setValue("nombre", value, { shouldValidate: true });
  };

  return (
    <div className="min-vh-100 d-flex justify-content-center align-items-center bg-light py-4">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-6 col-md-8">
            <div className="card shadow-lg border-0 rounded-lg">
              {/* Header */}
              <div className="card-header bg-success text-white text-center py-3">
                <h3 className="fw-bold mb-0">
                  <i className="fas fa-user-plus me-2"></i>
                  Registro de Usuario
                </h3>
                <small className="opacity-75">
                  Completa todos los campos para crear tu cuenta
                </small>
              </div>

              <div className="card-body p-4">
                <form onSubmit={handleSubmit(onSubmit)} noValidate>
                  {/* Nombre Completo */}
                  <div className="mb-3">
                    <label className="form-label fw-semibold text-dark">
                      <i className="fas fa-user me-2 text-success"></i>
                      Nombre Completo *
                    </label>
                    <input
                      type="text"
                      className={`form-control ${
                        errors.nombre
                          ? "is-invalid"
                          : watchedFields.nombre && !errors.nombre
                          ? "is-valid"
                          : ""
                      }`}
                      placeholder="Ej: Juan Carlos Pérez López"
                      {...register("nombre")}
                      onChange={handleNombreChange}
                    />
                    {errors.nombre && (
                      <div className="invalid-feedback">
                        <i className="fas fa-exclamation-triangle me-1"></i>
                        {errors.nombre.message}
                      </div>
                    )}
                    {watchedFields.nombre && !errors.nombre && (
                      <div className="valid-feedback">
                        <i className="fas fa-check me-1"></i>
                        Nombre válido
                      </div>
                    )}
                  </div>

                  {/* Email */}
                  <div className="mb-3">
                    <label className="form-label fw-semibold text-dark">
                      <i className="fas fa-envelope me-2 text-success"></i>
                      Correo Electrónico *
                    </label>
                    <input
                      type="email"
                      className={`form-control ${
                        errors.email
                          ? "is-invalid"
                          : watchedFields.email && !errors.email
                          ? "is-valid"
                          : ""
                      }`}
                      placeholder="correo@ejemplo.com"
                      {...register("email")}
                    />
                    {errors.email && (
                      <div className="invalid-feedback">
                        <i className="fas fa-exclamation-triangle me-1"></i>
                        {errors.email.message}
                      </div>
                    )}
                  </div>

                  {/* Row: DNI y Teléfono */}
                  <div className="row">
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="form-label fw-semibold text-dark">
                          <i className="fas fa-id-card me-2 text-success"></i>
                          DNI *
                        </label>
                        <input
                          type="text"
                          maxLength="8"
                          className={`form-control ${
                            errors.dni
                              ? "is-invalid"
                              : watchedFields.dni && !errors.dni
                              ? "is-valid"
                              : ""
                          }`}
                          placeholder="12345678"
                          {...register("dni")}
                          onChange={handleDNIChange}
                        />
                        {errors.dni && (
                          <div className="invalid-feedback">
                            <i className="fas fa-exclamation-triangle me-1"></i>
                            {errors.dni.message}
                          </div>
                        )}
                        <small className="form-text text-muted">
                          8 dígitos numéricos
                        </small>
                      </div>
                    </div>

                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="form-label fw-semibold text-dark">
                          <i className="fas fa-phone me-2 text-success"></i>
                          Teléfono *
                        </label>
                        <input
                          type="text"
                          maxLength="9"
                          className={`form-control ${
                            errors.telefono
                              ? "is-invalid"
                              : watchedFields.telefono && !errors.telefono
                              ? "is-valid"
                              : ""
                          }`}
                          placeholder="987654321"
                          {...register("telefono")}
                          onChange={handleTelefonoChange}
                        />
                        {errors.telefono && (
                          <div className="invalid-feedback">
                            <i className="fas fa-exclamation-triangle me-1"></i>
                            {errors.telefono.message}
                          </div>
                        )}
                        <small className="form-text text-muted">
                          Debe empezar con 9
                        </small>
                      </div>
                    </div>
                  </div>

                  {/* Contraseña */}
                  <div className="mb-3">
                    <label className="form-label fw-semibold text-dark">
                      <i className="fas fa-lock me-2 text-success"></i>
                      Contraseña *
                    </label>
                    <div className="input-group">
                      <input
                        type={showPassword ? "text" : "password"}
                        className={`form-control ${
                          errors.password
                            ? "is-invalid"
                            : watchedFields.password && !errors.password
                            ? "is-valid"
                            : ""
                        }`}
                        placeholder="Mínimo 6 caracteres"
                        {...register("password")}
                      />
                      <button
                        type="button"
                        className="btn btn-outline-secondary"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        <i
                          className={`fas ${
                            showPassword ? "fa-eye-slash" : "fa-eye"
                          }`}
                        ></i>
                      </button>
                      {errors.password && (
                        <div className="invalid-feedback">
                          <i className="fas fa-exclamation-triangle me-1"></i>
                          {errors.password.message}
                        </div>
                      )}
                    </div>
                    <small className="form-text text-muted">
                      Debe contener al menos 1 mayúscula, 1 minúscula y 1 número
                    </small>
                  </div>

                  {/* Confirmar Contraseña */}
                  <div className="mb-3">
                    <label className="form-label fw-semibold text-dark">
                      <i className="fas fa-lock me-2 text-success"></i>
                      Confirmar Contraseña *
                    </label>
                    <div className="input-group">
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        className={`form-control ${
                          errors.confirmPassword
                            ? "is-invalid"
                            : watchedFields.confirmPassword &&
                              !errors.confirmPassword
                            ? "is-valid"
                            : ""
                        }`}
                        placeholder="Repite tu contraseña"
                        {...register("confirmPassword")}
                      />
                      <button
                        type="button"
                        className="btn btn-outline-secondary"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                      >
                        <i
                          className={`fas ${
                            showConfirmPassword ? "fa-eye-slash" : "fa-eye"
                          }`}
                        ></i>
                      </button>
                      {errors.confirmPassword && (
                        <div className="invalid-feedback">
                          <i className="fas fa-exclamation-triangle me-1"></i>
                          {errors.confirmPassword.message}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Rol (oculto para usuarios normales) */}
                  <input type="hidden" {...register("rol")} value="PACIENTE" />

                  {/* Submit Button */}
                  <div className="d-grid mb-3">
                    <button
                      type="submit"
                      disabled={loading || !isValid}
                      className={`btn btn-success btn-lg fw-semibold py-3 ${
                        loading ? "opacity-75" : ""
                      }`}
                    >
                      {loading ? (
                        <>
                          <span
                            className="spinner-border spinner-border-sm me-2"
                            role="status"
                            aria-hidden="true"
                          ></span>
                          Registrando...
                        </>
                      ) : (
                        <>
                          <i className="fas fa-user-plus me-2"></i>
                          Crear Cuenta
                        </>
                      )}
                    </button>
                  </div>

                  {/* Validación General */}
                  {!isValid && Object.keys(errors).length > 0 && (
                    <div className="alert alert-warning d-flex align-items-center">
                      <i className="fas fa-info-circle me-2"></i>
                      <small>
                        Por favor corrige los errores antes de continuar
                      </small>
                    </div>
                  )}
                </form>

                {/* Footer */}
                <div className="text-center mt-4">
                  <p className="text-muted mb-0">
                    ¿Ya tienes una cuenta?{" "}
                    <Link to="/login" className="text-success fw-semibold">
                      Inicia sesión aquí
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}