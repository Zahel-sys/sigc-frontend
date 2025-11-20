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
import { THEME } from "../config/theme";
import { Card, FormField, Button } from "../components/atoms";

/**
 * Página de Registro - SOLID Refactorizado con Componentes Atómicos
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
        title="📝 Registro de Paciente"
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
            label="Nombre completo"
            type="text"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            placeholder="Juan Pérez"
            required
            icon="fas fa-user"
          />

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
            label="DNI"
            type="text"
            name="dni"
            value={formData.dni}
            onChange={handleChange}
            placeholder="12345678"
            required
            icon="fas fa-id-card"
          />

          <FormField
            label="Teléfono"
            type="tel"
            name="telefono"
            value={formData.telefono}
            onChange={handleChange}
            placeholder="+34 600 000 000"
            required
            icon="fas fa-phone"
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
            icon="fas fa-check"
          >
            Registrarse
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
          ¿Ya tienes una cuenta?{" "}
          <Link
            to="/login"
            style={{
              color: THEME.primary.main,
              fontWeight: "600",
              textDecoration: "none"
            }}
          >
            Inicia sesión
          </Link>
        </p>
      </Card>
    </div>
  );
}
