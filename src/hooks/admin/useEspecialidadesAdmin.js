import { useState, useCallback, useEffect } from 'react';
import especialidadesService from '../../services/especialidades/especialidadesService';
import { MESSAGES } from '../../constants/messages';
import { showSuccess, showError } from '../../utils/alerts';

/**
 * Hook personalizado para gestionar especialidades en admin
 * Responsabilidad: Orquestar la lógica CRUD de especialidades
 * 
 * @returns {Object} { especialidades, loading, error, crear, actualizar, eliminar, recargar }
 */
export const useEspecialidadesAdmin = () => {
  const [especialidades, setEspecialidades] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const cargarEspecialidades = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const datos = await especialidadesService.getAllEspecialidades();
      setEspecialidades(Array.isArray(datos) ? datos : []);
    } catch (err) {
      console.error('Error cargando especialidades:', err);
      setError('No se pudieron cargar las especialidades');
      setEspecialidades([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const crear = useCallback(async (formData) => {
    setLoading(true);
    setError(null);
    try {
      await especialidadesService.createEspecialidad(formData);
      showSuccess('Éxito', MESSAGES.ESPECIALIDADES.CREATED);
      await cargarEspecialidades();
      return true;
    } catch (err) {
      console.error('Error creando especialidad:', err);
      const mensaje = err.response?.data?.message || MESSAGES.ESPECIALIDADES.ERROR_SAVE;
      showError('Error', mensaje);
      setError(mensaje);
      return false;
    } finally {
      setLoading(false);
    }
  }, [cargarEspecialidades]);

  const actualizar = useCallback(async (id, formData) => {
    setLoading(true);
    setError(null);
    try {
      await especialidadesService.updateEspecialidad(id, formData);
      showSuccess('Éxito', MESSAGES.ESPECIALIDADES.UPDATED);
      await cargarEspecialidades();
      return true;
    } catch (err) {
      console.error('Error actualizando especialidad:', err);
      const mensaje = err.response?.data?.message || MESSAGES.ESPECIALIDADES.ERROR_SAVE;
      showError('Error', mensaje);
      setError(mensaje);
      return false;
    } finally {
      setLoading(false);
    }
  }, [cargarEspecialidades]);

  const eliminar = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      await especialidadesService.deleteEspecialidad(id);
      showSuccess('Éxito', MESSAGES.ESPECIALIDADES.DELETED);
      await cargarEspecialidades();
      return true;
    } catch (err) {
      console.error('Error eliminando especialidad:', err);
      const mensaje = err.response?.data?.message || MESSAGES.ESPECIALIDADES.ERROR_DELETE;
      showError('Error', mensaje);
      setError(mensaje);
      return false;
    } finally {
      setLoading(false);
    }
  }, [cargarEspecialidades]);

  const recargar = useCallback(() => {
    cargarEspecialidades();
  }, [cargarEspecialidades]);

  useEffect(() => {
    cargarEspecialidades();
  }, [cargarEspecialidades]);

  return {
    especialidades,
    loading,
    error,
    crear,
    actualizar,
    eliminar,
    recargar,
  };
};
