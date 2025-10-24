import { useEffect, useState } from "react";
import ClienteLayout from "../layouts/ClienteLayout";
import api from "../services/api";

export default function CitasCliente() {
  const [citas, setCitas] = useState([]);

  const cargarCitas = async () => {
    try {
      const usuario = JSON.parse(localStorage.getItem("usuario"));
      const token = usuario?.token;
      
      if (!token) {
        console.error("No hay token, no se pueden cargar las citas");
        return;
      }
      
      // ✅ Obtener datos del usuario desde /auth/me
      const resUsuario = await api.get("/auth/me", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      const idUsuario = resUsuario.data.idUsuario;
      
      if (!idUsuario) {
        console.error("No se pudo obtener el ID del usuario");
        return;
      }
      
      const res = await api.get(`/citas/usuario/${idUsuario}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setCitas(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Error al cargar citas:", err);
      setCitas([]);
    }
  };

  const cancelarCita = async (idCita) => {
    if (confirm("¿Deseas cancelar esta cita?")) {
      try {
        await api.put(`/citas/${idCita}/cancelar`);
        alert("✅ Cita cancelada correctamente");
        cargarCitas();
      } catch (err) {
        alert("❌ " + err.response?.data);
      }
    }
  };

  useEffect(() => {
    cargarCitas();
  }, []);

  return (
    <ClienteLayout>
      <h3 className="mb-4">Mis Citas</h3>
      <div className="table-responsive">
        <table className="table table-striped align-middle text-center">
          <thead className="table-success">
            <tr>
              <th>#</th>
              <th>Doctor</th>
              <th>Especialidad</th>
              <th>Fecha</th>
              <th>Hora</th>
              <th>Estado</th>
              <th>Acción</th>
            </tr>
          </thead>
          <tbody>
            {citas.map((c, i) => (
              <tr key={c.idCita}>
                <td>{i + 1}</td>
                <td>{c.doctor?.nombre}</td>
                <td>{c.doctor?.especialidad}</td>
                <td>{c.fechaCita}</td>
                <td>{c.horaCita}</td>
                <td>{c.estado}</td>
                <td>
                  {c.estado === "ACTIVA" ? (
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => cancelarCita(c.idCita)}
                    >
                      Cancelar
                    </button>
                  ) : (
                    <span className="text-muted">No disponible</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </ClienteLayout>
  );
}
