import { useEffect, useState } from "react";
import AdminLayout from "../layouts/AdminLayout";
import api from "../services/api";

export default function AdminEspecialidades() {
  const [especialidades, setEspecialidades] = useState([]);
  const [form, setForm] = useState({ nombre: "", descripcion: "", imagen: "" });
  const [editando, setEditando] = useState(null);

  // 🧠 Cargar todas las especialidades desde el backend
  const cargarEspecialidades = async () => {
    try {
      const res = await api.get("/especialidades");
      // Asegurarse de que sea un array
      const datos = Array.isArray(res.data) ? res.data : [];
      setEspecialidades(datos);
    } catch (error) {
      console.error("Error al cargar especialidades:", error);
      setEspecialidades([]);
    }
  };

  useEffect(() => {
    cargarEspecialidades();
  }, []);

  // 🧾 Crear o actualizar una especialidad
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editando) {
        await api.put(`/especialidades/${editando}`, form);
      } else {
        await api.post("/especialidades", form);
      }

      setForm({ nombre: "", descripcion: "", imagen: "" });
      setEditando(null);
      cargarEspecialidades();
    } catch (error) {
      console.error("Error al guardar especialidad:", error);
    }
  };

  // 🗑️ Eliminar especialidad
  const eliminarEspecialidad = async (id) => {
    if (confirm("¿Eliminar esta especialidad?")) {
      try {
        await api.delete(`/especialidades/${id}`);
        cargarEspecialidades();
      } catch (error) {
        console.error("Error al eliminar especialidad:", error);
      }
    }
  };

  // ✏️ Editar especialidad (cargar al formulario)
  const editarEspecialidad = (esp) => {
    setForm({
      nombre: esp.nombre,
      descripcion: esp.descripcion,
      imagen: esp.imagen,
    });
    setEditando(esp.idEspecialidad);
  };

  // 📁 Subir imagen al backend
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validar tipo de archivo
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      alert("Solo se permiten archivos de imagen (JPG, PNG, GIF, WEBP)");
      e.target.value = ''; // Limpiar input
      return;
    }

    // Validar tamaño (máx 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert("La imagen no puede superar los 5MB");
      e.target.value = '';
      return;
    }

    const data = new FormData();
    data.append("file", file);

    try {
      const res = await api.post("/uploads", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      
      // El backend puede retornar solo la URL como string o un objeto
      const imageUrl = typeof res.data === 'string' ? res.data : res.data.url || res.data.path;
      
      setForm({ ...form, imagen: imageUrl });
      console.log("Imagen subida exitosamente:", imageUrl);
    } catch (error) {
      console.error("Error al subir imagen:", error);
      const errorMsg = error.response?.data?.message || error.response?.data || "No se pudo subir la imagen. Verifica que el backend tenga el endpoint /uploads configurado.";
      alert(`Error al subir imagen: ${errorMsg}`);
    }
  };

  return (
    <AdminLayout>
      <h3 className="mb-4">Gestión de Especialidades</h3>

      {/* Formulario */}
      <form onSubmit={handleSubmit} className="mb-4" encType="multipart/form-data">
        <div className="row g-2">
          <div className="col-md-3">
            <input
              type="text"
              className="form-control"
              placeholder="Nombre"
              value={form.nombre}
              onChange={(e) => setForm({ ...form, nombre: e.target.value })}
              required
            />
          </div>

          <div className="col-md-4">
            <input
              type="text"
              className="form-control"
              placeholder="Descripción"
              value={form.descripcion}
              onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
              required
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

          <div className="col-md-2 d-grid">
            <button className="btn btn-primary">
              {editando ? "Actualizar" : "Agregar"}
            </button>
          </div>
        </div>
      </form>

      {/* Tabla de especialidades */}
      <div className="table-responsive">
        <table className="table table-striped table-hover align-middle">
          <thead className="table-primary">
            <tr>
              <th>#</th>
              <th>Imagen</th>
              <th>Nombre</th>
              <th>Descripción</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {especialidades.map((esp, index) => (
              <tr key={esp.idEspecialidad}>
                <td>{index + 1}</td>
                <td>
                  {esp.imagen ? (
                    <img
                      src={
                        esp.imagen?.startsWith("http")
                          ? esp.imagen
                          : `http://localhost:8080${esp.imagen}`
                      }
                      alt={esp.nombre}
                      style={{
                        width: "70px",
                        height: "70px",
                        borderRadius: "10px",
                        objectFit: "cover",
                        border: "1px solid #ccc",
                      }}
                    />
                  ) : (
                    <span className="text-muted">Sin imagen</span>
                  )}
                </td>
                <td>{esp.nombre}</td>
                <td>{esp.descripcion}</td>
                <td>
                  <button
                    className="btn btn-warning btn-sm me-2"
                    onClick={() => editarEspecialidad(esp)}
                  >
                    Editar
                  </button>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => eliminarEspecialidad(esp.idEspecialidad)}
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
