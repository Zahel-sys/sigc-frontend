import { useState, useCallback } from 'react';
import { showSuccess, showError } from '../utils/alerts';

/**
 * Hook para cargar y gestionar horarios disponibles de un doctor
 * Responsabilidad única: obtener y filtrar horarios
 */
export function useHorariosDisponibles() {
  const [horarios, setHorarios] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const cargarHorarios = useCallback(async (idDoctor) => {
    if (!idDoctor) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`http://localhost:8080/horarios/doctor/${idDoctor}`);

      if (!res.ok) {
        throw new Error(`Error al obtener horarios: ${res.status}`);
      }

      const datos = await res.json();
      const horariosFiltrados = Array.isArray(datos) ? datos : [];
      setHorarios(horariosFiltrados);
    } catch (err) {
      console.error('Error al cargar horarios:', err);
      setError(err.message || 'No se pudieron cargar los horarios disponibles.');
      setHorarios([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const recargarHorarios = useCallback(async (idDoctor) => {
    await cargarHorarios(idDoctor);
  }, [cargarHorarios]);

  return {
    horarios,
    loading,
    error,
    cargarHorarios,
    recargarHorarios,
  };
}
