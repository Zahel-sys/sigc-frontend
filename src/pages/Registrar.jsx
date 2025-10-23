import { useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
import "../styles/Login.css";

export default function Registrar() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    nombre: "",
    email: "",
    password: "",
    dni: "",
    telefono: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/usuarios", { ...form, rol: "CLIENTE" });
      alert("✅ Registro exitoso. Ahora puedes iniciar sesión.");
      navigate("/");
    } catch (err) {
      alert("❌ Error al registrar: " + err.response?.data?.message);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h3>Registro de Paciente</h3>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Nombre completo"
            value={form.nombre}
            onChange={(e) => setForm({ ...form, nombre: e.target.value })}
            required
          />
          <input
            type="email"
            placeholder="Correo electrónico"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
          />
          <input
            type="text"
            placeholder="DNI (8 dígitos)"
            value={form.dni}
            onChange={(e) => setForm({ ...form, dni: e.target.value })}
            pattern="\d{8}"
            required
          />
          <input
            type="text"
            placeholder="Teléfono (9 dígitos)"
            value={form.telefono}
            onChange={(e) => setForm({ ...form, telefono: e.target.value })}
            pattern="\d{9}"
            required
          />
          <button type="submit">Registrarse</button>
        </form>
        <p>
          ¿Ya tienes cuenta?{" "}
          <span className="link" onClick={() => navigate("/")}>
            Inicia sesión
          </span>
        </p>
      </div>
    </div>
  );
}
