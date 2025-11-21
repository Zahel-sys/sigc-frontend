import { useState, useCallback, useEffect } from 'react';
import api from '../../services/api';
import { MESSAGES } from '../../constants/messages';
import { showSuccess, showError, showConfirm } from '../../utils/alerts';

/**
 * Hook consolidado para gestión completa de horarios (Admin)
 * 
 * Responsabilidades:
 * - Cargar horarios, doctores y especialidades
 * - CRUD completo de horarios (crear, editar, eliminar)
 * - Manejo de estado (loading, error)
 * 
 * @returns {Object} Estado y funciones para gestionar horarios
 */
export function useHorariosAdmin() {
  const [horarios, setHorarios] = useState([]);
  const [doctores, setDoctores] = useState([]);
  const [especialidades, setEspecialidades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /**
   * Cargar todos los horarios
   */
  const cargarHorarios = useCallback(async () => {
    try {
      const res = await api.get("/horarios");
      const datos = Array.isArray(res.data) ? res.data : [];
      setHorarios(datos);
      setError(null);
      return datos;
    } catch (err) {
      console.error("❌ Error al cargar horarios:", err);
      setHorarios([]);
      setError(err.response?.data?.message || "No se pudieron cargar los horarios");
      return [];
    }
  }, []);

  /**
   * Cargar todos los doctores
   */
  const cargarDoctores = useCallback(async () => {
    try {
      const res = await api.get("/doctores");
      const datos = Array.isArray(res.data) ? res.data : [];
      setDoctores(datos);
      return datos;
    } catch (err) {
      console.error("❌ Error al cargar doctores:", err);
      setDoctores([]);
      return [];
    }
  }, []);

  /**
   * Cargar todas las especialidades
   */
  const cargarEspecialidades = useCallback(async () => {
    try {
      const res = await api.get("/especialidades");
      const datos = Array.isArray(res.data) ? res.data : [];
      setEspecialidades(datos);
      return datos;
    } catch (err) {
      console.error("❌ Error al cargar especialidades:", err);
      setEspecialidades([]);
      return [];
    }
  }, []);

  /**
   * Guardar horario (crear nuevo o actualizar existente)
   * 
   * @param {Object} datos - Datos del formulario
   * @param {string} datos.fecha - Fecha del horario
   * @param {string} datos.horaInicio - Hora de inicio
   * @param {string} datos.horaFin - Hora de fin
   * @param {number} datos.idDoctor - ID del doctor
   * @param {string} datos.estado - Estado (DISPONIBLE, RESERVADO, etc.)
   * @param {number|null} idHorario - ID (null para crear, ID para actualizar)
   * @returns {Promise<boolean>} true si éxito, false si error
   */
  const guardarHorario = useCallback(async (datos, idHorario = null) => {
    setLoading(true);
    setError(null);
    
    try {
      // Validaciones
      if (!datos.fecha) {
        throw new Error("La fecha es obligatoria");
      }
      if (!datos.horaInicio || !datos.horaFin) {
        throw new Error("Las horas de inicio y fin son obligatorias");
      }
      if (!datos.idDoctor) {
        throw new Error("Debes seleccionar un doctor");
      }

      const payload = {
        fecha: datos.fecha,
        horaInicio: datos.horaInicio,
        horaFin: datos.horaFin,
        idDoctor: parseInt(datos.idDoctor),
        estado: datos.estado || "DISPONIBLE"
      };

      console.log('📤 Enviando horario:', payload);

      let response;
      if (idHorario) {
        // Actualizar
        response = await api.put(`/horarios/${idHorario}`, payload);
        showSuccess("Horario actualizado", MESSAGES.SCHEDULES?.UPDATED || "Los datos se guardaron correctamente");
      } else {
        // Crear
        response = await api.post("/horarios", payload);
        showSuccess("Horario creado", MESSAGES.SCHEDULES?.CREATED || "El horario se registró correctamente");
      }

      console.log('✅ Horario guardado:', response.data);
      await cargarHorarios();
      return true;
      
    } catch (err) {
      console.error('❌ Error:', err);
      
      let mensaje = MESSAGES.SCHEDULES?.ERROR_SAVE || "No se pudo guardar el horario";
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
  }, [cargarHorarios]);

  /**
   * Crear nuevo horario
   */
  const crearHorario = useCallback(async (datos) => {
    return await guardarHorario(datos, null);
  }, [guardarHorario]);

  /**
   * Actualizar horario existente
   */
  const actualizarHorario = useCallback(async (id, datos) => {
    return await guardarHorario(datos, id);
  }, [guardarHorario]);

  /**
   * Eliminar horario con confirmación
   */
  const eliminarHorario = useCallback(async (idHorario) => {
    const confirmar = await showConfirm(
      "¿Eliminar horario?",
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
      await api.delete(`/horarios/${idHorario}`);
      showSuccess("Horario eliminado", MESSAGES.SCHEDULES?.DELETED || "El horario se eliminó correctamente");
      await cargarHorarios();
      return true;
      
    } catch (err) {
      console.error('❌ Error al eliminar:', err);
      
      let mensaje = MESSAGES.SCHEDULES?.ERROR_DELETE || "No se pudo eliminar el horario";
      if (err.response?.data?.message) {
        mensaje = err.response.data.message;
      }
      
      showError("Error al eliminar", mensaje);
      setError(mensaje);
      return false;
      
    } finally {
      setLoading(false);
    }
  }, [cargarHorarios]);

  /**
   * Recargar todos los datos
   */
  const recargar = useCallback(async () => {
    setLoading(true);
    await Promise.all([
      cargarHorarios(),
      cargarDoctores(),
      cargarEspecialidades()
    ]);
    setLoading(false);
  }, [cargarHorarios, cargarDoctores, cargarEspecialidades]);

  // Cargar datos iniciales
  useEffect(() => {
    recargar();
  }, [recargar]);

  return {
    // Estado
    horarios,
    doctores,
    especialidades,
    loading,
    error,
    
    // Funciones CRUD
    guardarHorario,
    crearHorario,
    actualizarHorario,
    eliminarHorario,
    
    // Recarga
    cargarHorarios,
    cargarDoctores,
    cargarEspecialidades,
    recargar,
  };
}

export default useHorariosAdmin;
