import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/auth/login", { email, password });
      const { token, rol } = res.data;

      // Guardamos token y rol en localStorage
      localStorage.setItem("token", token);
      localStorage.setItem("rol", rol);

      // Redirigir según rol
      if (rol === "ADMIN") {
        navigate("/admin");
      } else {
        navigate("/cliente");
      }
    } catch (error) {
      setMessage("❌ Credenciales inválidas");
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: "400px" }}>
      <h3 className="text-center mb-4">Iniciar Sesión</h3>
      <form onSubmit={handleLogin}>
        <input
          className="form-control mb-2"
          type="email"
          placeholder="Correo electrónico"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className="form-control mb-2"
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className="btn btn-primary w-100">Ingresar</button>
      </form>
      {message && <p className="text-center mt-3">{message}</p>}
    </div>
  );
}
