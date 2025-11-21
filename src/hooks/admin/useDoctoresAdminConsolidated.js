import { useState, useCallback, useEffect } from 'react';
import api from '../../services/api';
import { MESSAGES } from '../../constants/messages';
import { showSuccess, showError, showConfirm } from '../../utils/alerts';

/**
 * Hook consolidado para gestión completa de doctores (Admin)
 * Unifica: useDoctoresAdmin + useGestionDoctores
 * 
 * Responsabilidades:
 * - Cargar doctores y especialidades
 * - CRUD completo de doctores (crear, editar, eliminar)
 * - Manejo de estado (loading, error)
 * - Integración con backend (multipart/form-data)
 * 
 * @returns {Object} Estado y funciones para gestionar doctores
 */
export function useDoctoresAdmin() {
  const [doctores, setDoctores] = useState([]);
  const [especialidades, setEspecialidades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /**
   * Cargar todos los doctores del servidor
   */
  const cargarDoctores = useCallback(async () => {
    try {
      const res = await api.get("/doctores");
      const datos = Array.isArray(res.data) ? res.data : [];
      setDoctores(datos);
      setError(null);
      return datos;
    } catch (err) {
      console.error("❌ Error al cargar doctores:", err);
      setDoctores([]);
      setError(err.response?.data?.message || "No se pudieron cargar los doctores");
      return [];
    }
  }, []);

  /**
   * Cargar todas las especialidades disponibles
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
   * Guardar doctor (crear nuevo o actualizar existente)
   * 
   * @param {Object} datos - Datos del formulario
   * @param {string} datos.nombre - Nombre completo del doctor
   * @param {string} datos.especialidad - Especialidad médica
   * @param {number} datos.cupoPacientes - Cupo de pacientes (1-20)
   * @param {File} datos.imagen - Archivo de imagen (opcional)
   * @param {number|null} idDoctor - ID del doctor (null para crear, ID para actualizar)
   * @returns {Promise<boolean>} true si éxito, false si error
   */
  const guardarDoctor = useCallback(async (datos, idDoctor = null) => {
    setLoading(true);
    setError(null);
    
    try {
      // Validaciones básicas
      if (!datos.nombre?.trim()) {
        throw new Error("El nombre es obligatorio");
      }
      if (!datos.especialidad?.trim()) {
        throw new Error("La especialidad es obligatoria");
      }
      
      const cupo = parseInt(datos.cupoPacientes);
      if (isNaN(cupo) || cupo < 1 || cupo > 20) {
        throw new Error("El cupo debe ser un número entre 1 y 20");
      }

      // Preparar FormData (backend requiere multipart/form-data)
      const formData = new FormData();
      formData.append("nombre", datos.nombre.trim());
      formData.append("especialidad", datos.especialidad.trim());
      formData.append("cupoPacientes", cupo);
      
      // Solo agregar imagen si existe y es un archivo
      if (datos.imagen instanceof File) {
        formData.append("imagen", datos.imagen);
      }

      console.log('📤 Enviando datos al backend:');
      console.log('  - Nombre:', datos.nombre);
      console.log('  - Especialidad:', datos.especialidad);
      console.log('  - Cupo:', cupo);
      console.log('  - Imagen:', datos.imagen ? datos.imagen.name : 'Sin imagen');
      console.log('  - Modo:', idDoctor ? 'Actualizar' : 'Crear');

      let response;
      if (idDoctor) {
        // Actualizar doctor existente
        response = await api.put(`/doctores/${idDoctor}`, formData, {
          headers: { "Content-Type": "multipart/form-data" }
        });
        console.log('✅ Doctor actualizado:', response.data);
        showSuccess("Doctor actualizado", MESSAGES.DOCTORS.UPDATED || "Los datos se guardaron correctamente");
      } else {
        // Crear nuevo doctor
        response = await api.post("/doctores", formData, {
          headers: { "Content-Type": "multipart/form-data" }
        });
        console.log('✅ Doctor creado:', response.data);
        showSuccess("Doctor registrado", MESSAGES.DOCTORS.CREATED || "El doctor se registró correctamente");
      }

      // Recargar lista de doctores
      await cargarDoctores();
      return true;
      
    } catch (err) {
      console.error('❌ Error completo:', err);
      console.error('❌ Response:', err.response);
      
      let mensaje = idDoctor 
        ? (MESSAGES.DOCTORS?.ERROR_SAVE || "No se pudo actualizar el doctor")
        : (MESSAGES.DOCTORS?.ERROR_SAVE || "No se pudo guardar el doctor");
      
      // Intentar extraer mensaje de error del servidor
      if (err.response?.data) {
        if (typeof err.response.data === 'string') {
          mensaje = err.response.data;
        } else if (err.response.data.message) {
          mensaje = err.response.data.message;
        } else if (err.response.data.error) {
          mensaje = err.response.data.error;
        }
      } else if (err.message) {
        mensaje = err.message;
      }
      
      showError("Error al guardar doctor", mensaje);
      setError(mensaje);
      return false;
      
    } finally {
      setLoading(false);
    }
  }, [cargarDoctores]);

  /**
   * Crear un nuevo doctor
   * Wrapper de guardarDoctor para mayor claridad
   * 
   * @param {Object} datos - Datos del formulario
   * @returns {Promise<boolean>}
   */
  const crearDoctor = useCallback(async (datos) => {
    return await guardarDoctor(datos, null);
  }, [guardarDoctor]);

  /**
   * Actualizar un doctor existente
   * Wrapper de guardarDoctor para mayor claridad
   * 
   * @param {number} id - ID del doctor
   * @param {Object} datos - Datos actualizados
   * @returns {Promise<boolean>}
   */
  const actualizarDoctor = useCallback(async (id, datos) => {
    return await guardarDoctor(datos, id);
  }, [guardarDoctor]);

  /**
   * Eliminar un doctor
   * Muestra confirmación antes de eliminar
   * 
   * @param {number} idDoctor - ID del doctor a eliminar
   * @returns {Promise<boolean>} true si se eliminó, false si canceló o error
   */
  const eliminarDoctor = useCallback(async (idDoctor) => {
    // Confirmar eliminación
    const confirmar = await showConfirm(
      "¿Eliminar doctor?",
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
      await api.delete(`/doctores/${idDoctor}`);
      console.log('✅ Doctor eliminado:', idDoctor);
      showSuccess("Doctor eliminado", MESSAGES.DOCTORS.DELETED || "El doctor se eliminó correctamente");
      
      // Recargar lista de doctores
      await cargarDoctores();
      return true;
      
    } catch (err) {
      console.error('❌ Error al eliminar doctor:', err);
      
      let mensaje = MESSAGES.DOCTORS?.ERROR_DELETE || "No se pudo eliminar el doctor";
      if (err.response?.data?.message) {
        mensaje = err.response.data.message;
      }
      
      showError("Error al eliminar", mensaje);
      setError(mensaje);
      return false;
      
    } finally {
      setLoading(false);
    }
  }, [cargarDoctores]);

  /**
   * Recargar datos (doctores y especialidades)
   */
  const recargar = useCallback(async () => {
    setLoading(true);
    await Promise.all([
      cargarDoctores(),
      cargarEspecialidades()
    ]);
    setLoading(false);
  }, [cargarDoctores, cargarEspecialidades]);

  // Cargar datos iniciales
  useEffect(() => {
    recargar();
  }, [recargar]);

  return {
    // Estado
    doctores,
    especialidades,
    loading,
    error,
    
    // Funciones CRUD
    guardarDoctor,      // Función general (crear o actualizar)
    crearDoctor,        // Alias específico para crear
    actualizarDoctor,   // Alias específico para actualizar
    eliminarDoctor,     // Eliminar con confirmación
    
    // Funciones de recarga
    cargarDoctores,
    cargarEspecialidades,
    recargar,
  };
}

export default useDoctoresAdmin;
