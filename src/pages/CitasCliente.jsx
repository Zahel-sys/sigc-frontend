import { useEffect, useState } from "react";
import ClienteLayout from "../layouts/ClienteLayout";
import api from "../services/api";

export default function CitasCliente() {
  const [citas, setCitas] = useState([]);

  const cargarCitas = async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    const res = await api.get(`/citas/usuario/${user.id}`);
    setCitas(res.data);
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
