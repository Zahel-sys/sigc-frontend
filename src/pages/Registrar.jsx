import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import { showSuccess, showError, showWarning } from "../utils/alerts";

export default function Registrar() {
  const navigate = useNavigate();

  const [usuario, setUsuario] = useState({
    nombre: "",
    email: "",
    password: "",
    dni: "",
    telefono: "",
    rol: "PACIENTE",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUsuario({ ...usuario, [name]: value });
  };

  const validarCampos = () => {
    if (!usuario.nombre.trim() || !usuario.email.trim() || !usuario.password.trim() || !usuario.dni.trim() || !usuario.telefono.trim()) {
      showWarning("Por favor completa todos los campos.");
      return false;
    }

    // 🔹 Validar formato de correo
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(usuario.email)) {
      showError("El correo ingresado no es válido.");
      return false;
    }

    // 🔹 Validar DNI (exactamente 8 dígitos)
    if (!/^\d{8}$/.test(usuario.dni)) {
      showError("El DNI debe contener exactamente 8 dígitos numéricos.");
      return false;
    }

    // 🔹 Validar número de teléfono (9 dígitos)
    if (!/^\d{9}$/.test(usuario.telefono)) {
      showError("El número telefónico debe contener 9 dígitos.");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validarCampos()) return;

    try {
      const res = await api.post("/auth/register", usuario);

      if (res.data && res.data.idUsuario) {
        showSuccess("Registro exitoso", "Ahora puedes iniciar sesión.");
        navigate("/login");
      } else {
        showError("No se pudo registrar el usuario. Intenta nuevamente.");
      }
    } catch (err) {
      console.error("Error al registrar:", err);
      showError("Error al registrar el usuario.");
    }
  };

  return (
    <div className="min-vh-100 d-flex justify-content-center align-items-center bg-light">
      <div className="card shadow-lg p-4" style={{ maxWidth: "420px", width: "100%" }}>
        <h2 className="text-center mb-4 text-success fw-bold">Registro de Paciente</h2>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label fw-semibold">Nombre completo</label>
            <input
              type="text"
              className="form-control"
              name="nombre"
              value={usuario.nombre}
              onChange={handleChange}
              placeholder="Ej: Juan Pérez"
            />
          </div>

          <div className="mb-3">
            <label className="form-label fw-semibold">Correo electrónico</label>
            <input
              type="email"
              className="form-control"
              name="email"
              value={usuario.email}
              onChange={handleChange}
              placeholder="correo@ejemplo.com"
            />
          </div>

          <div className="mb-3">
            <label className="form-label fw-semibold">Contraseña</label>
            <input
              type="password"
              className="form-control"
              name="password"
              value={usuario.password}
              onChange={handleChange}
              placeholder="********"
            />
          </div>

          <div className="mb-3">
            <label className="form-label fw-semibold">DNI</label>
            <input
              type="text"
              maxLength="8"
              className="form-control"
              name="dni"
              value={usuario.dni}
              onChange={(e) => {
                if (/^\d{0,8}$/.test(e.target.value)) handleChange(e);
              }}
              placeholder="8 dígitos"
            />
          </div>

          <div className="mb-3">
            <label className="form-label fw-semibold">Teléfono</label>
            <input
              type="text"
              maxLength="9"
              className="form-control"
              name="telefono"
              value={usuario.telefono}
              onChange={(e) => {
                if (/^\d{0,9}$/.test(e.target.value)) handleChange(e);
              }}
              placeholder="9 dígitos"
            />
          </div>

          <button type="submit" className="btn btn-success w-100 fw-semibold mt-3">
            Registrarse
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
