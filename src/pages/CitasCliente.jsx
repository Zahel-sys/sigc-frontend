import { useEffect, useState } from "react";
import ClienteLayout from "../layouts/ClienteLayout";
import api from "../services/api";

export default function CitasCliente() {
  const [citas, setCitas] = useState([]);

  const cargarCitas = async () => {
    const res = await api.get("/citas");
    setCitas(res.data);
  };

  const eliminarCita = async (id) => {
    if (confirm("¿Deseas cancelar esta cita?")) {
      await api.delete(`/citas/${id}`);
      cargarCitas();
    }
  };

  const puedeCancelar = (fechaCita) => {
    const hoy = new Date();
    const fecha = new Date(fechaCita);
    const diff = (fecha - hoy) / (1000 * 60 * 60 * 24);
    return diff >= 2; // Solo si faltan 2 días o más
  };

  useEffect(() => {
    cargarCitas();
  }, []);

  return (
    <ClienteLayout>
      <h3 className="mb-4">Mis Citas</h3>
      <div className="table-responsive">
        <table className="table table-striped table-hover align-middle">
          <thead className="table-success">
            <tr>
              <th>#</th>
              <th>Especialidad</th>
              <th>Doctor</th>
              <th>Fecha</th>
              <th>Hora</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {citas.map((c, i) => (
              <tr key={c.idCita}>
                <td>{i + 1}</td>
                <td>{c.especialidad?.nombre}</td>
                <td>{c.doctor?.nombre}</td>
                <td>{c.fechaCita}</td>
                <td>{c.horaCita}</td>
                <td>
                  {puedeCancelar(c.fechaCita) ? (
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => eliminarCita(c.idCita)}
                    >
                      Cancelar
                    </button>
                  ) : (
                    <span className="text-muted">No cancelable</span>
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
