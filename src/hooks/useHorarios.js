/**
 * Hook personalizado: useHorarios
 * Encapsula toda la lógica de carga de horarios por doctor (SRP)
 */

import { useState, useCallback } from 'react';
import horariosService from '../services/horarios/horariosService';
import { MESSAGES } from '../constants/messages';

export const useHorarios = () => {
  const [horarios, setHorarios] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const cargarHorarios = useCallback(async (idDoctor) => {
    if (!idDoctor) return;

    setLoading(true);
    setError(null);
    try {
      const datos = await horariosService.getHorariosByDoctor(idDoctor);
      setHorarios(datos);
    } catch (err) {
      console.error('Error al cargar horarios:', err);
      setError(err.message || MESSAGES.HORARIOS.LOADING);
      setHorarios([]);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    horarios,
    loading,
    error,
    cargarHorarios,
    horariosDisponibles: horarios.filter(h => h.disponible),
  };
};

export default useHorarios;
