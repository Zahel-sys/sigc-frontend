import { useState } from "react";
import AdminLayout from "../layouts/AdminLayout";
import { useEspecialidadesAdmin } from "../hooks/admin";
import { THEME } from "../config/theme";

/**
 * Página Admin Gestión de Especialidades
 * Responsabilidad: Orquestar formulario y tabla de especialidades
 * MIGRADO: Usa hook consolidado useEspecialidadesAdmin
 */
export default function AdminEspecialidades() {
  const { especialidades, loading, guardarEspecialidad, eliminarEspecialidad } = useEspecialidadesAdmin();

  const [editando, setEditando] = useState(null);
  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    imagen: null  // Puede ser File (nuevo) o string (existente)
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validar tipo de archivo
    const tiposPermitidos = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!tiposPermitidos.includes(file.type)) {
      alert('Solo se permiten imágenes (JPG, PNG, WEBP)');
      e.target.value = ''; // Limpiar input
      return;
    }

    // Validar tamaño (5MB máximo)
    const maxSize = 5 * 1024 * 1024; // 5MB en bytes
    if (file.size > maxSize) {
      alert('La imagen no debe superar los 5MB');
      e.target.value = ''; // Limpiar input
      return;
    }

    console.log('📁 Archivo válido seleccionado:', { 
      name: file.name, 
      size: `${(file.size / 1024).toFixed(2)}KB`,
      type: file.type 
    });

    // Guardar el archivo directamente, se enviará con FormData en guardarEspecialidad
    setFormData(prev => ({ ...prev, imagen: file }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.nombre || !formData.descripcion) {
      alert("Por favor completa todos los campos");
      return;
    }

    const success = await guardarEspecialidad(formData, editando);

    if (success) {
      setFormData({ nombre: "", descripcion: "", imagen: null });
      setEditando(null);
    }
  };

  const handleEditar = (esp) => {
    setFormData({
      nombre: esp.nombre,
      descripcion: esp.descripcion,
      imagen: esp.imagen  // string con nombre de archivo existente
    });
    setEditando(esp.idEspecialidad);
  };

  const handleCancelar = () => {
    setFormData({ nombre: "", descripcion: "", imagen: null });
    setEditando(null);
  };

  return (
    <AdminLayout>
      <div className="container-fluid py-4">
        <h3 className="mb-4" style={{ color: THEME.primary.main, fontWeight: "600" }}>
          <i className="fas fa-hospital me-2"></i>Gestión de Especialidades
        </h3>

        {/* FORMULARIO */}
        <form onSubmit={handleSubmit} className="mb-4" encType="multipart/form-data" style={{
          backgroundColor: THEME.gray[50],
          padding: "1.5rem",
          borderRadius: THEME.borderRadius.lg,
          border: `1px solid ${THEME.gray[200]}`
        }}>
          <div className="row g-3">
            <div className="col-md-3">
              <label className="form-label fw-bold">Nombre</label>
              <input
                type="text"
                name="nombre"
                className="form-control"
                placeholder="Ej: Cardiología"
                value={formData.nombre}
                onChange={handleChange}
                style={{
                  border: `2px solid ${THEME.gray[300]}`,
                  borderRadius: THEME.borderRadius.md
                }}
                required
              />
            </div>

            <div className="col-md-4">
              <label className="form-label fw-bold">Descripción</label>
              <input
                type="text"
                name="descripcion"
                className="form-control"
                placeholder="Descripción breve"
                value={formData.descripcion}
                onChange={handleChange}
                style={{
                  border: `2px solid ${THEME.gray[300]}`,
                  borderRadius: THEME.borderRadius.md
                }}
                required
              />
            </div>

            <div className="col-md-3">
              <label className="form-label fw-bold">Imagen</label>
              <input
                type="file"
                accept="image/*"
                className="form-control"
                onChange={handleFileUpload}
                style={{
                  border: `2px solid ${THEME.gray[300]}`,
                  borderRadius: THEME.borderRadius.md
                }}
              />
            </div>

            <div className="col-md-2 d-flex gap-2">
              <button
                type="submit"
                className="btn w-100"
                style={{
                  background: THEME.primary.gradient,
                  color: "white",
                  border: "none",
                  borderRadius: THEME.borderRadius.md,
                  fontWeight: "600",
                  marginTop: "auto"
                }}
              >
                {editando ? "Actualizar" : "Agregar"}
              </button>

              {editando && (
                <button
                  type="button"
                  onClick={handleCancelar}
                  className="btn w-100"
                  style={{
                    background: THEME.gray[400],
                    color: "white",
                    border: "none",
                    borderRadius: THEME.borderRadius.md,
                    fontWeight: "600",
                    marginTop: "auto"
                  }}
                >
                  Cancelar
                </button>
              )}
            </div>
          </div>
        </form>

        {/* CARGANDO */}
        {loading && (
          <div className="alert alert-info">
            <div className="spinner-border spinner-border-sm me-2" role="status">
              <span className="visually-hidden">Cargando...</span>
            </div>
            Cargando especialidades...
          </div>
        )}

        {/* TABLA */}
        {!loading && (
          <div className="table-responsive">
            <table className="table table-striped table-hover align-middle">
              <thead style={{ background: THEME.primary.gradient, color: "white" }}>
                <tr>
                  <th>#</th>
                  <th>Imagen</th>
                  <th>Nombre</th>
                  <th>Descripción</th>
                  <th style={{ width: "150px" }}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {especialidades.map((esp, index) => (
                  <tr key={esp.idEspecialidad} style={{ borderBottom: `1px solid ${THEME.gray[200]}` }}>
                    <td style={{ fontWeight: "600" }}>{index + 1}</td>
                    <td>
                      {esp.imagen ? (
                        <img
                          src={`http://localhost:8080${esp.imagen}`}
                          alt={esp.nombre}
                          style={{
                            width: "70px",
                            height: "70px",
                            borderRadius: THEME.borderRadius.md,
                            objectFit: "cover",
                            border: `2px solid ${THEME.primary.light}`
                          }}
                          onError={(e) => {
                            e.target.src = "https://via.placeholder.com/70?text=Sin+Foto";
                          }}
                        />
                      ) : (
                        <span className="text-muted">Sin imagen</span>
                      )}
                    </td>
                    <td style={{ fontWeight: "600", color: THEME.primary.main }}>{esp.nombre}</td>
                    <td>{esp.descripcion}</td>
                    <td>
                      <div className="d-flex gap-2">
                        <button
                          className="btn btn-sm"
                          style={{
                            background: THEME.info.main,
                            color: "white",
                            border: "none",
                            borderRadius: THEME.borderRadius.md,
                            flex: 1
                          }}
                          onClick={() => handleEditar(esp)}
                        >
                          <i className="fas fa-edit me-1"></i>Editar
                        </button>
                        <button
                          className="btn btn-sm"
                          style={{
                            background: THEME.danger.main,
                            color: "white",
                            border: "none",
                            borderRadius: THEME.borderRadius.md,
                            flex: 1
                          }}
                          onClick={() => eliminarEspecialidad(esp.idEspecialidad)}
                        >
                          <i className="fas fa-trash me-1"></i>Eliminar
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
