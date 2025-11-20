import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useFormData } from "../hooks/useFormData";
import { MESSAGES } from "../constants/messages";
import {
  validarEmail,
  validarDNI,
  validarTelefono,
  validarContraseña,
} from "../utils/validators";

/**
 * Página de Registro - SOLID Refactorizado
 * Responsabilidad: Orquestar el flujo de registro
 */
export default function Registrar() {
  const navigate = useNavigate();
  const { register, loading, error } = useAuth();
  const { formData, handleChange, reset } = useFormData({
    nombre: "",
    email: "",
    password: "",
    dni: "",
    telefono: "",
    rol: "PACIENTE",
  });

  const validarCampos = () => {
    // Campos requeridos
    if (
      !formData.nombre.trim() ||
      !formData.email.trim() ||
      !formData.password.trim() ||
      !formData.dni.trim() ||
      !formData.telefono.trim()
    ) {
      alert(MESSAGES.VALIDATION.REQUIRED_FIELDS);
      return false;
    }

    // Validaciones específicas
    if (!validarEmail(formData.email)) {
      alert(MESSAGES.VALIDATION.EMAIL_INVALID);
      return false;
    }

    if (!validarDNI(formData.dni)) {
      alert(MESSAGES.VALIDATION.DNI_INVALID);
      return false;
    }

    if (!validarTelefono(formData.telefono)) {
      alert(MESSAGES.VALIDATION.PHONE_INVALID);
      return false;
    }

    if (!validarContraseña(formData.password)) {
      alert(MESSAGES.VALIDATION.PASSWORD_WEAK);
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validarCampos()) return;

    const success = await register(
      formData.email,
      formData.password,
      formData.nombre,
      formData.dni,
      formData.telefono
    );

    if (success) {
      reset();
      navigate("/login");
    }
  };

  return (
    <div className="min-vh-100 d-flex justify-content-center align-items-center bg-light">
      <div className="card shadow-lg p-4" style={{ maxWidth: "420px", width: "100%" }}>
        <h2 className="text-center mb-4 text-success fw-bold">Registro de Paciente</h2>

        {error && (
          <div className="alert alert-danger alert-dismissible fade show" role="alert">
            {error}
            <button type="button" className="btn-close" data-bs-dismiss="alert"></button>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label fw-semibold">Nombre completo</label>
            <input
              type="text"
              className="form-control"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              placeholder="Ej: Juan Pérez"
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label fw-semibold">Correo electrónico</label>
            <input
              type="email"
              className="form-control"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="correo@ejemplo.com"
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label fw-semibold">Contraseña</label>
            <input
              type="password"
              className="form-control"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Mínimo 6 caracteres"
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label fw-semibold">DNI</label>
            <input
              type="text"
              maxLength="8"
              className="form-control"
              name="dni"
              value={formData.dni}
              onChange={(e) => {
                if (/^\d{0,8}$/.test(e.target.value)) handleChange(e);
              }}
              placeholder="8 dígitos"
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label fw-semibold">Teléfono</label>
            <input
              type="text"
              maxLength="9"
              className="form-control"
              name="telefono"
              value={formData.telefono}
              onChange={(e) => {
                if (/^\d{0,9}$/.test(e.target.value)) handleChange(e);
              }}
              placeholder="9 dígitos"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-success w-100 fw-semibold mt-3"
          >
            {loading ? "Registrando..." : "Registrarse"}
          </button>
        </form>

        <p className="text-center mt-3 text-muted">
          ¿Ya tienes cuenta?{" "}
          <Link to="/login" className="text-success fw-semibold">
            Inicia sesión
          </Link>
        </p>
      </div>
    </div>
  );
}
