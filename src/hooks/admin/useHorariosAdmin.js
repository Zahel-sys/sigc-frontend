import { useState, useCallback, useEffect } from 'react';
import horariosService from '../../services/horarios/horariosService';
import { MESSAGES } from '../../constants/messages';
import { showSuccess, showError } from '../../utils/alerts';

/**
 * Hook personalizado para gestionar horarios en admin
 * Responsabilidad: Orquestar la lógica CRUD de horarios
 * 
 * @returns {Object} { horarios, loading, error, crear, actualizar, eliminar, recargar }
 */
export const useHorariosAdmin = () => {
  const [horarios, setHorarios] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const cargarHorarios = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const datos = await horariosService.getAllHorarios();
      setHorarios(Array.isArray(datos) ? datos : []);
    } catch (err) {
      console.error('Error cargando horarios:', err);
      setError('No se pudieron cargar los horarios');
      setHorarios([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const crear = useCallback(async (formData) => {
    setLoading(true);
    setError(null);
    try {
      await horariosService.createHorario(formData);
      showSuccess('Éxito', MESSAGES.HORARIOS.CREATED);
      await cargarHorarios();
      return true;
    } catch (err) {
      console.error('Error creando horario:', err);
      const mensaje = err.response?.data?.message || MESSAGES.HORARIOS.ERROR_SAVE;
      showError('Error', mensaje);
      setError(mensaje);
      return false;
    } finally {
      setLoading(false);
    }
  }, [cargarHorarios]);

  const actualizar = useCallback(async (id, formData) => {
    setLoading(true);
    setError(null);
    try {
      await horariosService.updateHorario(id, formData);
      showSuccess('Éxito', MESSAGES.HORARIOS.UPDATED);
      await cargarHorarios();
      return true;
    } catch (err) {
      console.error('Error actualizando horario:', err);
      const mensaje = err.response?.data?.message || MESSAGES.HORARIOS.ERROR_SAVE;
      showError('Error', mensaje);
      setError(mensaje);
      return false;
    } finally {
      setLoading(false);
    }
  }, [cargarHorarios]);

  const eliminar = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      await horariosService.deleteHorario(id);
      showSuccess('Éxito', MESSAGES.HORARIOS.DELETED);
      await cargarHorarios();
      return true;
    } catch (err) {
      console.error('Error eliminando horario:', err);
      const mensaje = err.response?.data?.message || MESSAGES.HORARIOS.ERROR_DELETE;
      showError('Error', mensaje);
      setError(mensaje);
      return false;
    } finally {
      setLoading(false);
    }
  }, [cargarHorarios]);

  const recargar = useCallback(() => {
    cargarHorarios();
  }, [cargarHorarios]);

  useEffect(() => {
    cargarHorarios();
  }, [cargarHorarios]);

  return {
    horarios,
    loading,
    error,
    crear,
    actualizar,
    eliminar,
    recargar,
  };
};
