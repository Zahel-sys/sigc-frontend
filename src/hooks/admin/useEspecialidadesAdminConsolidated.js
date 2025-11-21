import { useState, useCallback, useEffect } from 'react';
import api from '../services/api';
import { MESSAGES } from '../constants/messages';
import { showSuccess, showError, showConfirm } from '../utils/alerts';

/**
 * Hook consolidado para gestión completa de especialidades (Admin)
 * 
 * Responsabilidades:
 * - Cargar especialidades
 * - CRUD completo de especialidades (crear, editar, eliminar)
 * - Manejo de estado (loading, error)
 * 
 * @returns {Object} Estado y funciones para gestionar especialidades
 */
export function useEspecialidadesAdmin() {
  const [especialidades, setEspecialidades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /**
   * Cargar todas las especialidades del servidor
   */
  const cargarEspecialidades = useCallback(async () => {
    try {
      const res = await api.get("/especialidades");
      const datos = Array.isArray(res.data) ? res.data : [];
      setEspecialidades(datos);
      setError(null);
      return datos;
    } catch (err) {
      console.error("❌ Error al cargar especialidades:", err);
      setEspecialidades([]);
      setError(err.response?.data?.message || "No se pudieron cargar las especialidades");
      return [];
    }
  }, []);

  /**
   * Guardar especialidad (crear nueva o actualizar existente)
   * 
   * @param {Object} datos - Datos del formulario
   * @param {string} datos.nombre - Nombre de la especialidad
   * @param {string} datos.descripcion - Descripción (opcional)
   * @param {number|null} idEspecialidad - ID (null para crear, ID para actualizar)
   * @returns {Promise<boolean>} true si éxito, false si error
   */
  const guardarEspecialidad = useCallback(async (datos, idEspecialidad = null) => {
    setLoading(true);
    setError(null);
    
    try {
      // Validación
      if (!datos.nombre?.trim()) {
        throw new Error("El nombre es obligatorio");
      }

      const payload = {
        nombre: datos.nombre.trim(),
        descripcion: datos.descripcion?.trim() || null
      };

      console.log('📤 Enviando especialidad:', payload);

      let response;
      if (idEspecialidad) {
        // Actualizar
        response = await api.put(`/especialidades/${idEspecialidad}`, payload);
        showSuccess("Especialidad actualizada", MESSAGES.SPECIALTIES?.UPDATED || "Los datos se guardaron correctamente");
      } else {
        // Crear
        response = await api.post("/especialidades", payload);
        showSuccess("Especialidad creada", MESSAGES.SPECIALTIES?.CREATED || "La especialidad se registró correctamente");
      }

      console.log('✅ Especialidad guardada:', response.data);
      await cargarEspecialidades();
      return true;
      
    } catch (err) {
      console.error('❌ Error:', err);
      
      let mensaje = MESSAGES.SPECIALTIES?.ERROR_SAVE || "No se pudo guardar la especialidad";
      if (err.response?.data?.message) {
        mensaje = err.response.data.message;
      } else if (err.message) {
        mensaje = err.message;
      }
      
      showError("Error al guardar", mensaje);
      setError(mensaje);
      return false;
      
    } finally {
      setLoading(false);
    }
  }, [cargarEspecialidades]);

  /**
   * Crear nueva especialidad
   */
  const crearEspecialidad = useCallback(async (datos) => {
    return await guardarEspecialidad(datos, null);
  }, [guardarEspecialidad]);

  /**
   * Actualizar especialidad existente
   */
  const actualizarEspecialidad = useCallback(async (id, datos) => {
    return await guardarEspecialidad(datos, id);
  }, [guardarEspecialidad]);

  /**
   * Eliminar especialidad con confirmación
   */
  const eliminarEspecialidad = useCallback(async (idEspecialidad) => {
    const confirmar = await showConfirm(
      "¿Eliminar especialidad?",
      "Esta acción no se puede deshacer",
      "Sí, eliminar",
      "Cancelar"
    );

    if (!confirmar) {
      return false;
    }

    setLoading(true);
    setError(null);
    
    try {
      await api.delete(`/especialidades/${idEspecialidad}`);
      showSuccess("Especialidad eliminada", MESSAGES.SPECIALTIES?.DELETED || "La especialidad se eliminó correctamente");
      await cargarEspecialidades();
      return true;
      
    } catch (err) {
      console.error('❌ Error al eliminar:', err);
      
      let mensaje = MESSAGES.SPECIALTIES?.ERROR_DELETE || "No se pudo eliminar la especialidad";
      if (err.response?.data?.message) {
        mensaje = err.response.data.message;
      }
      
      showError("Error al eliminar", mensaje);
      setError(mensaje);
      return false;
      
    } finally {
      setLoading(false);
    }
  }, [cargarEspecialidades]);

  /**
   * Recargar datos
   */
  const recargar = useCallback(async () => {
    setLoading(true);
    await cargarEspecialidades();
    setLoading(false);
  }, [cargarEspecialidades]);

  // Cargar datos iniciales
  useEffect(() => {
    recargar();
  }, [recargar]);

  return {
    // Estado
    especialidades,
    loading,
    error,
    
    // Funciones CRUD
    guardarEspecialidad,
    crearEspecialidad,
    actualizarEspecialidad,
    eliminarEspecialidad,
    
    // Recarga
    cargarEspecialidades,
    recargar,
  };
}

export default useEspecialidadesAdmin;
