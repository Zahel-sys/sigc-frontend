import { useState } from "react";
import AdminLayout from "../layouts/AdminLayout";
import { useDoctoresAdmin } from "../hooks/admin";
import { DoctorForm } from "../components/organisms/DoctorForm";
import { THEME } from "../config/theme";
import "../styles/AdminDoctores.css";

/**
 * Página Admin Gestión de Doctores
 * Responsabilidad: Orquestar formulario y tabla de doctores
 * MIGRADO: Usa organism DoctorForm + hook consolidado
 */
export default function AdminDoctores() {
  const { doctores, especialidades, loading, guardarDoctor, eliminarDoctor } = useDoctoresAdmin();

  // Estado del formulario
  const [modoEdicion, setModoEdicion] = useState(false);
  const [doctorEditando, setDoctorEditando] = useState(null);
  const [formData, setFormData] = useState({
    nombre: "",
    especialidad: "",
    cupoPacientes: "",
    imagen: null
  });

  // Handlers
  const handleSubmit = async (data) => {
    const success = await guardarDoctor(data, modoEdicion ? doctorEditando : null);

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

        {/* FORMULARIO - Usando organism DoctorForm */}
        <div style={{ backgroundColor: THEME.gray[50], borderRadius: THEME.borderRadius.lg, padding: '2rem' }}>
          <DoctorForm
            initialData={formData}
            especialidades={especialidades}
            onSubmit={handleSubmit}
            onCancel={handleCancelar}
            isEditing={modoEdicion}
            loading={loading}
          />
        </div>

        {/* NOTA IMPORTANTE */}
        <div style={{ 
          background: '#fff3cd', 
          border: '1px solid #ffc107', 
          borderRadius: '8px', 
          padding: '1rem', 
          marginTop: '1.5rem',
          marginBottom: '1.5rem'
        }}>
          <h4 style={{ color: '#856404', marginBottom: '0.5rem' }}>
            <i className="fas fa-info-circle me-2"></i>Nota Importante
          </h4>
          <p style={{ color: '#856404', marginBottom: '0.5rem' }}>
            Si al crear un doctor aparece un <strong>error 500</strong>, puede ser porque:
          </p>
          <ul style={{ color: '#856404', marginBottom: 0 }}>
            <li>La tabla <code>doctores</code> en MySQL tiene una estructura incorrecta</li>
            <li>Faltan columnas o hay problemas con las foreign keys</li>
            <li>El backend necesita recrear la tabla automáticamente</li>
          </ul>
          <p style={{ color: '#856404', marginTop: '0.5rem', marginBottom: 0 }}>
            <strong>Solución:</strong> Deja que Hibernate cree las tablas automáticamente eliminando las tablas manuales.
          </p>
        </div>

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
                      ? `http://localhost:8080${doc.imagen}`
                      : "https://via.placeholder.com/200x250?text=Sin+Foto"
                  }
                  alt={doc.nombre}
                  className="doctor-img"
                  onError={(e) => e.target.src = "https://via.placeholder.com/200x250?text=Sin+Foto"}
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
