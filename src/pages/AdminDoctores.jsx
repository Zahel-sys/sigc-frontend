import { useState } from "react";
import AdminLayout from "../layouts/AdminLayout";
import { useDoctoresAdmin } from "../hooks/useGestionDoctores";
import { THEME } from "../config/theme";
import "../styles/AdminDoctores.css";

/**
 * Página Admin Gestión de Doctores
 * Responsabilidad: Orquestar formulario y tabla de doctores
 */
export default function AdminDoctores() {
  const { doctores, especialidades, loading, guardarDoctor, eliminarDoctor } = useDoctoresAdmin();

  // Formulario
  const [modoEdicion, setModoEdicion] = useState(false);
  const [doctorEditando, setDoctorEditando] = useState(null);
  const [formData, setFormData] = useState({
    nombre: "",
    especialidad: "",
    cupoPacientes: "",
    imagen: null
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleChangeImagen = (e) => {
    setFormData(prev => ({ ...prev, imagen: e.target.files[0] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.nombre || !formData.especialidad || !formData.cupoPacientes) {
      alert("Por favor completa todos los campos");
      return;
    }

    const success = await guardarDoctor(formData, modoEdicion ? doctorEditando : null);

    if (success) {
      setFormData({ nombre: "", especialidad: "", cupoPacientes: "", imagen: null });
      setModoEdicion(false);
      setDoctorEditando(null);
    }
  };

  const handleEditar = (doctor) => {
    setModoEdicion(true);
    setDoctorEditando(doctor.idDoctor);
    setFormData({
      nombre: doctor.nombre,
      especialidad: doctor.especialidad,
      cupoPacientes: doctor.cupoPacientes,
      imagen: null
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCancelar = () => {
    setModoEdicion(false);
    setDoctorEditando(null);
    setFormData({ nombre: "", especialidad: "", cupoPacientes: "", imagen: null });
  };

  return (
    <AdminLayout>
      <div className="admin-doctores-container">
        <h1 className="titulo-admin" style={{ color: THEME.primary.main }}>
          <i className="fas fa-stethoscope me-2"></i>Gestión de Doctores
        </h1>

        {/* FORMULARIO */}
        <form className="form-doctor" onSubmit={handleSubmit} style={{ backgroundColor: THEME.gray[50], borderRadius: THEME.borderRadius.lg }}>
          <div className="form-field">
            <label>Nombre del Doctor</label>
            <input
              type="text"
              name="nombre"
              placeholder="Ej: Dr. Juan Pérez"
              value={formData.nombre}
              onChange={handleChange}
              style={{
                border: `2px solid ${THEME.gray[300]}`,
                borderRadius: THEME.borderRadius.md,
                padding: "0.75rem"
              }}
              required
            />
          </div>

          <div className="form-field">
            <label>Especialidad</label>
            <select
              name="especialidad"
              value={formData.especialidad}
              onChange={handleChange}
              style={{
                border: `2px solid ${THEME.gray[300]}`,
                borderRadius: THEME.borderRadius.md,
                padding: "0.75rem"
              }}
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

          <div className="form-field">
            <label>Cantidad de Pacientes</label>
            <input
              type="number"
              name="cupoPacientes"
              placeholder="Ej: 10"
              value={formData.cupoPacientes}
              onChange={handleChange}
              style={{
                border: `2px solid ${THEME.gray[300]}`,
                borderRadius: THEME.borderRadius.md,
                padding: "0.75rem"
              }}
              required
            />
          </div>

          <div className="form-field">
            <label>Imagen</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleChangeImagen}
              style={{
                border: `2px solid ${THEME.gray[300]}`,
                borderRadius: THEME.borderRadius.md,
                padding: "0.75rem",
                height: "auto"
              }}
            />
          </div>

          <div style={{ display: "flex", gap: "1rem", marginTop: "1.5rem" }}>
            <button
              type="submit"
              style={{
                background: THEME.primary.gradient,
                color: "white",
                border: "none",
                padding: "0.75rem 1.5rem",
                borderRadius: THEME.borderRadius.md,
                fontWeight: "600",
                cursor: "pointer",
                flex: 1
              }}
            >
              {modoEdicion ? "Actualizar Doctor" : "Registrar Doctor"}
            </button>

            {modoEdicion && (
              <button
                type="button"
                onClick={handleCancelar}
                style={{
                  background: THEME.gray[400],
                  color: "white",
                  border: "none",
                  padding: "0.75rem 1.5rem",
                  borderRadius: THEME.borderRadius.md,
                  fontWeight: "600",
                  cursor: "pointer"
                }}
              >
                Cancelar
              </button>
            )}
          </div>
        </form>

        {/* CARGANDO */}
        {loading && (
          <div className="alert alert-info mt-4">
            <div className="spinner-border spinner-border-sm me-2" role="status">
              <span className="visually-hidden">Cargando...</span>
            </div>
            Cargando doctores...
          </div>
        )}

        {/* GRILLA DE DOCTORES */}
        {!loading && (
          <div className="cards-container" style={{ marginTop: "2rem" }}>
            {doctores.map((doc) => (
              <div
                key={doc.idDoctor}
                className="card-doctor"
                style={{
                  borderRadius: THEME.borderRadius.lg,
                  boxShadow: `0 4px 12px ${THEME.gray[300]}`,
                  overflow: "hidden",
                  transition: "all 0.3s ease"
                }}
              >
                <img
                  src={
                    doc.imagen
                      ? `http://localhost:8080/doctores/imagen/${doc.imagen}`
                      : "https://via.placeholder.com/200x250?text=Sin+Foto"
                  }
                  alt={doc.nombre}
                  className="doctor-img"
                  style={{ height: "250px", objectFit: "cover" }}
                />

                <div style={{ padding: "1.5rem" }}>
                  <h3 style={{ color: THEME.primary.main, marginBottom: "0.5rem" }}>
                    {doc.nombre}
                  </h3>

                  <p style={{ marginBottom: "0.5rem", color: THEME.gray[600] }}>
                    <strong>Especialidad:</strong> {doc.especialidad}
                  </p>

                  <p style={{ marginBottom: "1.5rem", color: THEME.gray[600] }}>
                    <strong>Cupo disponible:</strong> {doc.cupoPacientes} pacientes
                  </p>

                  <div className="acciones" style={{ display: "flex", gap: "0.75rem" }}>
                    <button
                      onClick={() => handleEditar(doc)}
                      style={{
                        background: THEME.info.main,
                        color: "white",
                        border: "none",
                        padding: "0.5rem 1rem",
                        borderRadius: THEME.borderRadius.md,
                        cursor: "pointer",
                        fontWeight: "600",
                        flex: 1,
                        transition: "all 0.3s ease"
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.background = THEME.info.dark;
                        e.target.style.transform = "scale(1.05)";
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.background = THEME.info.main;
                        e.target.style.transform = "scale(1)";
                      }}
                    >
                      <i className="fas fa-edit me-1"></i>Editar
                    </button>

                    <button
                      onClick={() => eliminarDoctor(doc.idDoctor)}
                      style={{
                        background: THEME.danger.main,
                        color: "white",
                        border: "none",
                        padding: "0.5rem 1rem",
                        borderRadius: THEME.borderRadius.md,
                        cursor: "pointer",
                        fontWeight: "600",
                        flex: 1,
                        transition: "all 0.3s ease"
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.background = THEME.danger.dark;
                        e.target.style.transform = "scale(1.05)";
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.background = THEME.danger.main;
                        e.target.style.transform = "scale(1)";
                      }}
                    >
                      <i className="fas fa-trash me-1"></i>Eliminar
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
