import { useEffect, useState } from "react";
import AdminLayout from "../layouts/AdminLayout";
import api from "../services/api";

export default function AdminHorarios() {
  const [horarios, setHorarios] = useState([]);
  const [doctores, setDoctores] = useState([]);
  const [form, setForm] = useState({
    fecha: "",
    turno: "",
    horaInicio: "",
    horaFin: "",
    doctor: { idDoctor: "" },
  });
  const [editando, setEditando] = useState(null);

  const cargarDatos = async () => {
    try {
      const resHor = await api.get("/horarios");
      const resDoc = await api.get("/doctores");
      setHorarios(Array.isArray(resHor.data) ? resHor.data : []);
      setDoctores(Array.isArray(resDoc.data) ? resDoc.data : []);
    } catch (error) {
      console.error("Error al cargar datos:", error);
      setHorarios([]);
      setDoctores([]);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!form.doctor.idDoctor) {
        alert("Debes seleccionar un doctor");
        return;
      }

      // Enviar solo los campos necesarios, convertir idDoctor a número
      const payload = {
        fecha: form.fecha,
        turno: form.turno,
        horaInicio: form.horaInicio,
        horaFin: form.horaFin,
        idDoctor: parseInt(form.doctor.idDoctor, 10)
      };

      console.log("📤 Enviando payload:", payload);

      if (editando) {
        await api.put(`/horarios/${editando}`, payload);
        console.log("✅ Horario actualizado");
      } else {
        await api.post("/horarios", payload);
        console.log("✅ Horario agregado");
      }

      setForm({ fecha: "", turno: "", horaInicio: "", horaFin: "", doctor: { idDoctor: "" } });
      setEditando(null);
      await cargarDatos();
    } catch (error) {
      console.error("❌ Error al guardar horario:", error.response?.data || error.message);
      alert("Error: " + (error.response?.data?.message || error.message));
    }
  };

  const editarHorario = (h) => {
    setForm({
      fecha: h.fecha,
      turno: h.turno,
      horaInicio: h.horaInicio,
      horaFin: h.horaFin,
      doctor: { idDoctor: h.doctor.idDoctor },
    });
    setEditando(h.idHorario);
  };

  const eliminarHorario = async (id) => {
    if (confirm("¿Eliminar este horario?")) {
      try {
        await api.delete(`/horarios/${id}`);
        console.log("🗑️ Horario eliminado");
        await cargarDatos();
      } catch (error) {
        console.error("❌ Error al eliminar:", error.response?.data || error.message);
        alert("Error: " + (error.response?.data?.message || error.message));
      }
    }
  };

  return (
    <AdminLayout>
      <h3 className="mb-4">Gestión de Horarios</h3>

      {/* Formulario */}
      <form onSubmit={handleSubmit} className="mb-4">
        <div className="row g-2">
          <div className="col-md-2">
            <input
              type="date"
              className="form-control"
              value={form.fecha}
              onChange={(e) => setForm({ ...form, fecha: e.target.value })}
              required
            />
          </div>
          <div className="col-md-2">
            <select
              className="form-select"
              value={form.turno}
              onChange={(e) => setForm({ ...form, turno: e.target.value })}
              required
            >
              <option value="">Turno</option>
              <option value="Mañana">Mañana</option>
              <option value="Tarde">Tarde</option>
              <option value="Noche">Noche</option>
            </select>
          </div>
          <div className="col-md-2">
            <input
              type="time"
              className="form-control"
              value={form.horaInicio}
              onChange={(e) => setForm({ ...form, horaInicio: e.target.value })}
              required
            />
          </div>
          <div className="col-md-2">
            <input
              type="time"
              className="form-control"
              value={form.horaFin}
              onChange={(e) => setForm({ ...form, horaFin: e.target.value })}
              required
            />
          </div>
          <div className="col-md-3">
            <select
              className="form-select"
              value={form.doctor.idDoctor}
              onChange={(e) =>
                setForm({ ...form, doctor: { idDoctor: e.target.value } })
              }
              required
            >
              <option value="">Seleccionar doctor</option>
              {doctores.map((d) => (
                <option key={d.idDoctor} value={d.idDoctor}>
                  {d.nombre} ({d.especialidad})
                </option>
              ))}
            </select>
          </div>
          <div className="col-md-1 d-grid">
            <button className="btn btn-primary">
              {editando ? "Actualizar" : "Agregar"}
            </button>
          </div>
        </div>
      </form>

      {/* Tabla */}
      <div className="table-responsive">
        <table className="table table-striped table-hover align-middle">
          <thead className="table-primary">
            <tr>
              <th>#</th>
              <th>Fecha</th>
              <th>Turno</th>
              <th>Inicio</th>
              <th>Fin</th>
              <th>Doctor</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {horarios.map((h, i) => (
              <tr key={h.idHorario}>
                <td>{i + 1}</td>
                <td>{h.fecha}</td>
                <td>{h.turno}</td>
                <td>{h.horaInicio}</td>
                <td>{h.horaFin}</td>
                <td>{h.doctor?.nombre}</td>
                <td>
                  <button
                    className="btn btn-warning btn-sm me-2"
                    onClick={() => editarHorario(h)}
                  >
                    Editar
                  </button>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => eliminarHorario(h.idHorario)}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
}
