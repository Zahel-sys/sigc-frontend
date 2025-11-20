/**
 * Hook personalizado: useCitas
 * Encapsula toda la lógica de carga y manejo de citas (SRP)
 */

import { useState, useEffect, useCallback } from 'react';
import citasService from '../services/citas/citasService';
import { MESSAGES } from '../constants/messages';
import { showSuccess, showError } from '../utils/alerts';

export const useCitas = (idUsuario) => {
  const [citas, setCitas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const cargarCitas = useCallback(async () => {
    if (!idUsuario) return;

    setLoading(true);
    setError(null);
    try {
      const datos = await citasService.getCitasByUser(idUsuario);
      setCitas(datos);
    } catch (err) {
      console.error('Error al cargar citas:', err);
      setError(err.message || MESSAGES.ERRORS.FETCH_ERROR);
      setCitas([]);
    } finally {
      setLoading(false);
    }
  }, [idUsuario]);

  const cancelarCita = useCallback(async (idCita) => {
    try {
      await citasService.cancelCita(idCita);
      showSuccess(MESSAGES.CITAS.CANCELLED_SUCCESS);
      cargarCitas();
      return { success: true };
    } catch (err) {
      const message = err.response?.data?.message || MESSAGES.CITAS.CANCELLED_ERROR;
      showError(message);
      return { success: false, error: message };
    }
  }, [cargarCitas]);

  useEffect(() => {
    cargarCitas();
  }, [idUsuario, cargarCitas]);

  return {
    citas,
    loading,
    error,
    cargarCitas,
    cancelarCita,
    citasActivas: citas.filter(c => c.estado === 'ACTIVA'),
  };
};

export default useCitas;
