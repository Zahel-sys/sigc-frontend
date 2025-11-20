/**
 * Hook personalizado: useDoctores
 * Encapsula toda la lógica de carga y filtrado de doctores (SRP)
 */

import { useState, useEffect, useCallback } from 'react';
import doctoresService from '../services/doctores/doctoresService';
import { MESSAGES } from '../constants/messages';

export const useDoctores = (especialidadFilter = null) => {
  const [doctores, setDoctores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const cargarDoctores = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      let datos = await doctoresService.getAllDoctores();

      // Filtrar por especialidad si se proporciona
      if (especialidadFilter) {
        datos = datos.filter(d =>
          d.especialidad.toLowerCase().trim() === especialidadFilter.toLowerCase().trim()
        );
      }

      setDoctores(datos);
    } catch (err) {
      console.error('Error al cargar doctores:', err);
      setError(err.message || MESSAGES.ERRORS.FETCH_ERROR);
      setDoctores([]);
    } finally {
      setLoading(false);
    }
  }, [especialidadFilter]);

  useEffect(() => {
    cargarDoctores();
  }, [especialidadFilter, cargarDoctores]);

  return {
    doctores,
    loading,
    error,
    recargar: cargarDoctores,
  };
};

export default useDoctores;
