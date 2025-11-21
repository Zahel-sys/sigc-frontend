import { useState, useCallback, useEffect } from 'react';
import api from '../../services/api';
import { MESSAGES } from '../../constants/messages';
import { showSuccess, showError, showConfirm } from '../../utils/alerts';

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
   * @param {File|string|null} datos.imagen - Archivo de imagen o nombre de archivo existente
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

      // Determinar si hay una imagen (File nuevo o string existente)
      const tieneImagenNueva = datos.imagen instanceof File;
      const tieneImagenExistente = typeof datos.imagen === 'string' && datos.imagen.trim();
      
      let payload;
      let config = {};

      // SIEMPRE usar FormData si hay imagen (consistencia con backend)
      if (tieneImagenNueva || tieneImagenExistente) {
        payload = new FormData();
        payload.append('nombre', datos.nombre.trim());
        payload.append('descripcion', datos.descripcion?.trim() || '');
        
        if (tieneImagenNueva) {
          // Archivo nuevo (File object)
          payload.append('imagen', datos.imagen);
          console.log('📤 Enviando especialidad con archivo nuevo');
        } else if (tieneImagenExistente) {
          // Nombre de archivo existente (string)
          payload.append('imagen', datos.imagen);
          console.log('📤 Enviando especialidad manteniendo imagen:', datos.imagen);
        }
        
        config.headers = { 'Content-Type': 'multipart/form-data' };
      } else {
        // Sin imagen, usar JSON puro
        payload = {
          nombre: datos.nombre.trim(),
          descripcion: datos.descripcion?.trim() || null
        };
        console.log('📤 Enviando especialidad sin imagen:', payload);
      }

      let response;
      if (idEspecialidad) {
        // Actualizar
        response = await api.put(`/especialidades/${idEspecialidad}`, payload, config);
        showSuccess("Especialidad actualizada", MESSAGES.SPECIALTIES?.UPDATED || "Los datos se guardaron correctamente");
      } else {
        // Crear
        response = await api.post("/especialidades", payload, config);
        showSuccess("Especialidad creada", MESSAGES.SPECIALTIES?.CREATED || "La especialidad se registró correctamente");
      }

      console.log('✅ Especialidad guardada:', response.data);
      await cargarEspecialidades();
      return true;
      
    } catch (err) {
      console.error('❌ Error completo:', err);
      console.error('❌ Response error:', err.response?.data);
      console.error('❌ Status:', err.response?.status);
      
      let mensaje = MESSAGES.SPECIALTIES?.ERROR_SAVE || "No se pudo guardar la especialidad";
      
      // Manejo específico de errores HTTP
      if (err.response) {
        const status = err.response.status;
        const serverMessage = err.response.data?.message || err.response.data?.error;
        
        if (status === 500) {
          mensaje = serverMessage || "Error interno del servidor. Por favor contacta al administrador.";
        } else if (status === 400) {
          mensaje = serverMessage || "Datos inválidos. Verifica el formulario.";
        } else if (status === 404) {
          mensaje = "Especialidad no encontrada.";
        } else if (serverMessage) {
          mensaje = serverMessage;
        }
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
