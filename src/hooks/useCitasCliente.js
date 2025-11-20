import { useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import { showConfirm, showSuccess, showError } from '../utils/alerts';

/**
 * Hook para gestionar citas del cliente actual
 * Responsabilidad única: obtener, cargar y cancelar citas del usuario
 */
export function useCitasCliente() {
  const [citas, setCitas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const cargarCitas = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const usuario = JSON.parse(localStorage.getItem("usuario"));
      const token = usuario?.token;

      if (!token) {
        throw new Error("No hay sesión activa");
      }

      // Obtener datos del usuario desde /auth/me
      const resUsuario = await api.get("/auth/me", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const idUsuario = resUsuario.data.idUsuario;

      if (!idUsuario) {
        throw new Error("No se pudo obtener el ID del usuario");
      }

      // Obtener citas del usuario
      const res = await api.get(`/citas/usuario/${idUsuario}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setCitas(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Error al cargar citas:", err);
      setError(err.message || "Error al cargar las citas");
      setCitas([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const cancelarCita = useCallback(async (idCita) => {
    const confirmar = await showConfirm(
      "¿Deseas cancelar esta cita?",
      "Cancelar cita"
    );

    if (!confirmar) return;

    try {
      await api.put(`/citas/${idCita}/cancelar`);
      showSuccess("Cita cancelada", "La cita ha sido cancelada correctamente");
      await cargarCitas();
    } catch (err) {
      console.error("Error al cancelar cita:", err);
      showError("Error al cancelar", err.response?.data?.message || "No se pudo cancelar la cita");
    }
  }, [cargarCitas]);

  // Cargar citas al montar
  useEffect(() => {
    cargarCitas();
  }, [cargarCitas]);

  return {
    citas,
    loading,
    error,
    cargarCitas,
    cancelarCita
  };
}
