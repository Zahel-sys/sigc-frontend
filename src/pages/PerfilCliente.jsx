import { useState, useEffect } from "react";
import ClienteLayout from "../layouts/ClienteLayout";
import api from "../services/api";

export default function PerfilCliente() {
  const [usuario, setUsuario] = useState({ nombre: "", email: "", dni: "", telefono: "" });

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) api.get(`/usuarios/${user.id}`).then((res) => setUsuario(res.data));
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    await api.put(`/usuarios/${usuario.idUsuario}`, usuario);
    alert("✅ Datos actualizados correctamente");
  };

  return (
    <ClienteLayout>
      <h3>Mi Perfil</h3>
      <form onSubmit={handleSave} className="col-md-6 mt-3">
        <input
          type="text"
          className="form-control mb-2"
          placeholder="Nombre"
          value={usuario.nombre}
          onChange={(e) => setUsuario({ ...usuario, nombre: e.target.value })}
          required
        />
        <input
          type="email"
          className="form-control mb-2"
          placeholder="Correo"
          value={usuario.email}
          onChange={(e) => setUsuario({ ...usuario, email: e.target.value })}
          required
        />
        <input
          type="text"
          className="form-control mb-2"
          placeholder="DNI"
          value={usuario.dni}
          onChange={(e) => setUsuario({ ...usuario, dni: e.target.value })}
          pattern="\d{8}"
          required
        />
        <input
          type="text"
          className="form-control mb-2"
          placeholder="Teléfono"
          value={usuario.telefono}
          onChange={(e) => setUsuario({ ...usuario, telefono: e.target.value })}
          pattern="\d{9}"
          required
        />
        <button className="btn btn-success">Guardar cambios</button>
      </form>
    </ClienteLayout>
  );
}
