import { useEffect, useState } from "react";
import api from "../services/api";
import AdminLayout from "../layouts/AdminLayout";
import "../styles/AdminDoctores.css";

export default function AdminDoctores() {
  const [doctores, setDoctores] = useState([]);
  const [especialidades, setEspecialidades] = useState([]);
  const [nombre, setNombre] = useState("");
  const [especialidad, setEspecialidad] = useState("");
  const [cupoPacientes, setCupoPacientes] = useState("");
  const [imagen, setImagen] = useState(null);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [doctorEditando, setDoctorEditando] = useState(null);

  useEffect(() => {
    cargarDoctores();
    cargarEspecialidades();
  }, []);

  const cargarDoctores = async () => {
    const res = await api.get("/doctores");
    setDoctores(res.data);
  };

  const cargarEspecialidades = async () => {
    const res = await api.get("/especialidades");
    setEspecialidades(res.data);
  };

  const handleRegistrarOEditar = async (e) => {
    e.preventDefault();

    if (!nombre || !especialidad || !cupoPacientes) {
      alert("Por favor completa todos los campos");
      return;
    }

    const formData = new FormData();
    formData.append("nombre", nombre);
    formData.append("especialidad", especialidad);
    formData.append("cupoPacientes", cupoPacientes);
    if (imagen) formData.append("imagen", imagen);

    if (modoEdicion) {
      await api.put(`/doctores/${doctorEditando}`, formData);
      alert("✅ Doctor actualizado correctamente");
      setModoEdicion(false);
      setDoctorEditando(null);
    } else {
      await api.post("/doctores", formData);
      alert("✅ Doctor registrado correctamente");
    }

    setNombre("");
    setEspecialidad("");
    setCupoPacientes("");
    setImagen(null);
    cargarDoctores();
  };

  const handleEliminar = async (id) => {
    if (window.confirm("¿Eliminar este doctor?")) {
      await api.delete(`/doctores/${id}`);
      cargarDoctores();
    }
  };

  const handleEditar = (doctor) => {
    setModoEdicion(true);
    setDoctorEditando(doctor.idDoctor);
    setNombre(doctor.nombre);
    setEspecialidad(doctor.especialidad);
    setCupoPacientes(doctor.cupoPacientes);
    setImagen(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCancelar = () => {
    setModoEdicion(false);
    setDoctorEditando(null);
    setNombre("");
    setEspecialidad("");
    setCupoPacientes("");
    setImagen(null);
  };

  return (
    <AdminLayout>
      <div className="admin-doctores-container">
        <h1 className="titulo-admin"> Gestión de Doctores</h1>

        <form className="form-doctor" onSubmit={handleRegistrarOEditar}>
          <input
            type="text"
            placeholder="Nombre del doctor"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
          />
          <select
            value={especialidad}
            onChange={(e) => setEspecialidad(e.target.value)}
          >
            <option value="">Seleccionar especialidad</option>
            {especialidades.map((esp) => (
              <option key={esp.idEspecialidad} value={esp.nombre}>
                {esp.nombre}
              </option>
            ))}
          </select>
          <input
            type="number"
            placeholder="Cupo"
            value={cupoPacientes}
            onChange={(e) => setCupoPacientes(e.target.value)}
          />
          <input type="file" onChange={(e) => setImagen(e.target.files[0])} />
          <button type="submit" className={modoEdicion ? "btn-actualizar" : ""}>
            {modoEdicion ? "Actualizar" : "Registrar"}
          </button>

          {modoEdicion && (
            <button
              type="button"
              onClick={handleCancelar}
              className="btn-cancelar"
            >
              Cancelar
            </button>
          )}
        </form>

        <div className="cards-container">
          {doctores.map((doc) => (
            <div key={doc.idDoctor} className="card-doctor">
              <img
                src={`http://localhost:8080${doc.imagen}`}
                alt={doc.nombre}
                className="doctor-img"
              />
              <h3>{doc.nombre}</h3>
              <p>
                <strong>Especialidad:</strong> {doc.especialidad}
              </p>
              <p>
                <strong>Cupo:</strong> {doc.cupoPacientes} pacientes
              </p>

              <div className="acciones">
                <button
                  className="btn-editar"
                  onClick={() => handleEditar(doc)}
                >
                  Editar
                </button>
                <button
                  className="btn-eliminar"
                  onClick={() => handleEliminar(doc.idDoctor)}
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}
