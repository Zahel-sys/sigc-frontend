import { useState, useCallback, useEffect } from 'react';
import doctoresService from '../../services/doctores/doctoresService';
import { MESSAGES } from '../../constants/messages';
import { showSuccess, showError } from '../../utils/alerts';

/**
 * Hook personalizado para gestionar doctores en admin
 * Responsabilidad: Orquestar la lógica CRUD de doctores
 * 
 * @returns {Object} { doctores, loading, error, crear, actualizar, eliminar, recargar }
 */
export const useDoctoresAdmin = () => {
  const [doctores, setDoctores] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Cargar todos los doctores del servidor
   */
  const cargarDoctores = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const datos = await doctoresService.getAllDoctores();
      setDoctores(Array.isArray(datos) ? datos : []);
    } catch (err) {
      console.error('Error cargando doctores:', err);
      setError('No se pudieron cargar los doctores');
      setDoctores([]);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Crear un nuevo doctor
   * @param {Object} formData - Datos del formulario { nombre, especialidad, cupoPacientes, imagen }
   * @returns {Promise<boolean>} true si éxito, false si error
   */
  const crear = useCallback(async (formData) => {
    setLoading(true);
    setError(null);
    try {
      await doctoresService.createDoctor(formData);
      showSuccess('Éxito', MESSAGES.DOCTORS.CREATED);
      await cargarDoctores();
      return true;
    } catch (err) {
      console.error('Error creando doctor:', err);
      const mensaje = err.response?.data?.message || MESSAGES.DOCTORS.ERROR_SAVE;
      showError('Error', mensaje);
      setError(mensaje);
      return false;
    } finally {
      setLoading(false);
    }
  }, [cargarDoctores]);

  /**
   * Actualizar un doctor existente
   * @param {string|number} id - ID del doctor
   * @param {Object} formData - Datos actualizados
   * @returns {Promise<boolean>} true si éxito, false si error
   */
  const actualizar = useCallback(async (id, formData) => {
    setLoading(true);
    setError(null);
    try {
      await doctoresService.updateDoctor(id, formData);
      showSuccess('Éxito', MESSAGES.DOCTORS.UPDATED);
      await cargarDoctores();
      return true;
    } catch (err) {
      console.error('Error actualizando doctor:', err);
      const mensaje = err.response?.data?.message || MESSAGES.DOCTORS.ERROR_SAVE;
      showError('Error', mensaje);
      setError(mensaje);
      return false;
    } finally {
      setLoading(false);
    }
  }, [cargarDoctores]);

  /**
   * Eliminar un doctor
   * @param {string|number} id - ID del doctor
   * @returns {Promise<boolean>} true si éxito, false si error
   */
  const eliminar = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      await doctoresService.deleteDoctor(id);
      showSuccess('Éxito', MESSAGES.DOCTORS.DELETED);
      await cargarDoctores();
      return true;
    } catch (err) {
      console.error('Error eliminando doctor:', err);
      const mensaje = err.response?.data?.message || MESSAGES.DOCTORS.ERROR_DELETE;
      showError('Error', mensaje);
      setError(mensaje);
      return false;
    } finally {
      setLoading(false);
    }
  }, [cargarDoctores]);

  /**
   * Recargar lista de doctores
   */
  const recargar = useCallback(() => {
    cargarDoctores();
  }, [cargarDoctores]);

  // Cargar doctores al montar el componente
  useEffect(() => {
    cargarDoctores();
  }, [cargarDoctores]);

  return {
    doctores,
    loading,
    error,
    crear,
    actualizar,
    eliminar,
    recargar,
  };
};
