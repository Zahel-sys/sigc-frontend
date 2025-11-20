import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useFormData } from "../hooks/useFormData";
import { MESSAGES } from "../constants/messages";
import { validarEmail } from "../utils/validators";
import { THEME } from "../config/theme";
import { Card, FormField, Button } from "../components/atoms";

/**
 * Página de Login - SOLID Refactorizado con Componentes Atómicos
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
      const usuario = JSON.parse(localStorage.getItem("usuario") || "{}");
      const ruta = usuario.rol === "ADMIN" ? "/admin" : "/cliente";
      navigate(ruta);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: THEME.gray[50],
        padding: "1rem"
      }}
    >
      <Card
        title="🔐 Iniciar Sesión"
        variant="default"
        style={{ maxWidth: "420px", width: "100%" }}
      >
        {error && (
          <div
            style={{
              background: `${THEME.danger.main}15`,
              border: `1px solid ${THEME.danger.main}`,
              color: THEME.danger.main,
              padding: "1rem",
              borderRadius: THEME.borderRadius.md,
              marginBottom: "1rem",
              fontSize: "0.9rem",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem"
            }}
          >
            <i className="fas fa-exclamation-triangle"></i>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <FormField
            label="Correo electrónico"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="correo@ejemplo.com"
            required
            icon="fas fa-envelope"
          />

          <FormField
            label="Contraseña"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="••••••••"
            required
            icon="fas fa-lock"
          />

          <Button
            type="submit"
            variant="primary"
            fullWidth
            loading={loading}
            icon="fas fa-sign-in-alt"
          >
            Iniciar sesión
          </Button>
        </form>

        <p
          style={{
            textAlign: "center",
            marginTop: "1.5rem",
            color: THEME.gray[600],
            fontSize: "0.95rem"
          }}
        >
          ¿No tienes una cuenta?{" "}
          <Link
            to="/registrar"
            style={{
              color: THEME.primary.main,
              fontWeight: "600",
              textDecoration: "none"
            }}
          >
            Regístrate aquí
          </Link>
        </p>
      </Card>
    </div>
  );
}

