/**
 * Hook personalizado: useEspecialidades
 * Encapsula toda la lógica de carga de especialidades (SRP)
 */

import { useState, useEffect, useCallback } from 'react';
import especialidadesService from '../services/especialidades/especialidadesService';
import { MESSAGES } from '../constants/messages';

export const useEspecialidades = () => {
  const [especialidades, setEspecialidades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const cargarEspecialidades = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const datos = await especialidadesService.getAllEspecialidades();
      setEspecialidades(datos);
    } catch (err) {
      console.error('Error al cargar especialidades:', err);
      setError(err.message || MESSAGES.ERRORS.FETCH_ERROR);
      setEspecialidades([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    cargarEspecialidades();
  }, [cargarEspecialidades]);

  return {
    especialidades,
    loading,
    error,
    recargar: cargarEspecialidades,
  };
};

export default useEspecialidades;
