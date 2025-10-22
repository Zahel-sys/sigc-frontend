import { useEffect, useState } from "react";
import AdminLayout from "../layouts/AdminLayout";
import api from "../services/api";

export default function AdminDoctores() {
  const [doctores, setDoctores] = useState([]);
  const [especialidades, setEspecialidades] = useState([]);
  const [form, setForm] = useState({
    nombre: "",
    especialidad: "",
    cupoPacientes: "",
    imagen: "",
  });
  const [editando, setEditando] = useState(null);

  const cargarDatos = async () => {
    const resDoc = await api.get("/doctores");
    const resEsp = await api.get("/especialidades");
    setDoctores(resDoc.data);
    setEspecialidades(resEsp.data);
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editando) {
      await api.put(`/doctores/${editando}`, form);
    } else {
      await api.post("/doctores", form);
    }
    setForm({ nombre: "", especialidad: "", cupoPacientes: "", imagen: "" });
    setEditando(null);
    cargarDatos();
  };

  const eliminarDoctor = async (id) => {
    if (confirm("¿Eliminar este doctor?")) {
      await api.delete(`/doctores/${id}`);
      cargarDatos();
    }
  };

  const editarDoctor = (doc) => {
    setForm({
      nombre: doc.nombre,
      especialidad: doc.especialidad,
      cupoPacientes: doc.cupoPacientes,
      imagen: doc.imagen,
    });
    setEditando(doc.idDoctor);
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const data = new FormData();
    data.append("file", file);
    const res = await api.post("/uploads", data, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    setForm({ ...form, imagen: res.data });
  };

  return (
    <AdminLayout>
      <h3 className="mb-4">Gestión de Doctores</h3>

      {/* Formulario */}
      <form onSubmit={handleSubmit} className="mb-4">
        <div className="row g-2">
          <div className="col-md-3">
            <input
              type="text"
              className="form-control"
              placeholder="Nombre del doctor"
              value={form.nombre}
              onChange={(e) => setForm({ ...form, nombre: e.target.value })}
              required
            />
          </div>
          <div className="col-md-3">
            <select
              className="form-select"
              value={form.especialidad}
              onChange={(e) => setForm({ ...form, especialidad: e.target.value })}
              required
            >
              <option value="">Seleccionar especialidad</option>
              {especialidades.map((esp) => (
                <option key={esp.idEspecialidad} value={esp.nombre}>
                  {esp.nombre}
                </option>
              ))}
            </select>
          </div>
          <div className="col-md-2">
            <input
              type="number"
              className="form-control"
              placeholder="Cupo"
              value={form.cupoPacientes}
              onChange={(e) =>
                setForm({ ...form, cupoPacientes: e.target.value })
              }
              required
              min="1"
              max="20"
            />
          </div>
          <div className="col-md-3">
            <input
              type="file"
              className="form-control"
              accept="image/*"
              onChange={handleFileUpload}
            />
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
              <th>Foto</th>
              <th>Nombre</th>
              <th>Especialidad</th>
              <th>Cupo</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {doctores.map((doc, i) => (
              <tr key={doc.idDoctor}>
                <td>{i + 1}</td>
                <td>
                  {doc.imagen ? (
                    <img
                      src={
                        doc.imagen?.startsWith("http")
                          ? doc.imagen
                          : `http://localhost:8080${doc.imagen}`
                      }
                      alt={doc.nombre}
                      style={{
                        width: "70px",
                        height: "70px",
                        borderRadius: "50%",
                        objectFit: "cover",
                        border: "1px solid #ccc",
                      }}
                    />
                  ) : (
                    <span className="text-muted">Sin foto</span>
                  )}
                </td>
                <td>{doc.nombre}</td>
                <td>{doc.especialidad}</td>
                <td>{doc.cupoPacientes}</td>
                <td>
                  <button
                    className="btn btn-warning btn-sm me-2"
                    onClick={() => editarDoctor(doc)}
                  >
                    Editar
                  </button>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => eliminarDoctor(doc.idDoctor)}
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
