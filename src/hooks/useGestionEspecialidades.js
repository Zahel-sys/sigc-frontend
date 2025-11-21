import { useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import { showConfirm, showSuccess, showError } from '../utils/alerts';

/**
 * Hook para gestionar especialidades (CRUD)
 * Responsabilidad única: obtener, crear, editar y eliminar especialidades
 */
export function useGestionEspecialidades() {
  const [especialidades, setEspecialidades] = useState([]);
  const [loading, setLoading] = useState(true);

  const cargarEspecialidades = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get("/especialidades");
      setEspecialidades(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error("Error al cargar especialidades:", error);
      setEspecialidades([]);
      showError("Error", "No se pudieron cargar las especialidades");
    } finally {
      setLoading(false);
    }
  }, []);

  const guardarEspecialidad = useCallback(async (formData, idEspecialidad = null) => {
    try {
      if (idEspecialidad) {
        await api.put(`/especialidades/${idEspecialidad}`, formData);
        showSuccess("Éxito", "Especialidad actualizada correctamente");
      } else {
        await api.post("/especialidades", formData);
        showSuccess("Éxito", "Especialidad creada correctamente");
      }
      await cargarEspecialidades();
      return true;
    } catch (error) {
      const msg = error.response?.data?.error || error.response?.data?.message || "Error al guardar";
      showError("Error", msg);
      return false;
    }
  }, [cargarEspecialidades]);

  const eliminarEspecialidad = useCallback(async (id) => {
    const confirmar = await showConfirm(
      "¿Deseas eliminar esta especialidad?",
      "Eliminar especialidad"
    );

    if (!confirmar) return;

    try {
      await api.delete(`/especialidades/${id}`);
      showSuccess("Éxito", "Especialidad eliminada correctamente");
      await cargarEspecialidades();
    } catch (error) {
      const msg = error.response?.data?.error || error.response?.data?.message || "Error al eliminar";
      showError("Error", msg);
    }
  }, [cargarEspecialidades]);

  const subirImagen = useCallback(async (file) => {
    const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"];
    
    if (!validTypes.includes(file.type)) {
      showError("Error", "Solo se permiten archivos de imagen (JPG, PNG, GIF, WEBP)");
      return null;
    }

    if (file.size > 5 * 1024 * 1024) {
      showError("Error", "La imagen no puede superar los 5MB");
      return null;
    }

    try {
      const data = new FormData();
      data.append("file", file);

      // ✅ NO especificar Content-Type - axios lo maneja automáticamente
      const res = await api.post("/uploads", data);

      const imageUrl = res.data.url;
      return imageUrl.split("/").pop();
    } catch (error) {
      const msg = error.response?.data?.error || error.message || "Error al subir imagen";
      showError("Error", msg);
      return null;
    }
  }, []);

  useEffect(() => {
    cargarEspecialidades();
  }, [cargarEspecialidades]);

  return {
    especialidades,
    loading,
    cargarEspecialidades,
    guardarEspecialidad,
    eliminarEspecialidad,
    subirImagen
  };
}
