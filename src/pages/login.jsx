import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useFormData } from "../hooks/useFormData";
import { MESSAGES } from "../constants/messages";
import { validarEmail } from "../utils/validators";

/**
 * Página de Login - SOLID Refactorizado
 * Responsabilidad: Orquestar el flujo de autenticación
 */
export default function Login() {
  const navigate = useNavigate();
  const { login, loading, error } = useAuth();
  const { formData, handleChange, reset } = useFormData({
    email: "",
    password: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validar campos
    if (!formData.email.trim() || !formData.password.trim()) {
      alert(MESSAGES.VALIDATION.REQUIRED_FIELDS);
      return;
    }

    // Validar email
    if (!validarEmail(formData.email)) {
      alert(MESSAGES.VALIDATION.EMAIL_INVALID);
      return;
    }

    // Intentar login
    const success = await login(formData.email, formData.password);
    if (success) {
      reset();
      // Navegar según rol (manejado en useAuth)
      const usuario = JSON.parse(localStorage.getItem("usuario") || "{}");
      const ruta = usuario.rol === "ADMIN" ? "/admin" : "/cliente";
      navigate(ruta);
    }
  };

  return (
    <div className="min-vh-100 d-flex justify-content-center align-items-center bg-light">
      <div className="card shadow-lg p-4" style={{ maxWidth: "420px", width: "100%" }}>
        <h2 className="text-center mb-4 text-success fw-bold">Iniciar Sesión</h2>

        {error && (
          <div className="alert alert-danger alert-dismissible fade show" role="alert">
            {error}
            <button type="button" className="btn-close" data-bs-dismiss="alert"></button>
          </div>
        )}

        <form onSubmit={handleSubmit}>
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
              placeholder="********"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`btn btn-success w-100 fw-semibold ${loading ? "opacity-75" : ""}`}
          >
            {loading ? "Ingresando..." : "Iniciar sesión"}
          </button>
        </form>

        <p className="text-center mt-4 text-muted">
          ¿No tienes una cuenta?{" "}
          <Link to="/registrar" className="text-success fw-semibold">
            Regístrate aquí
          </Link>
        </p>
      </div>
    </div>
  );
}

