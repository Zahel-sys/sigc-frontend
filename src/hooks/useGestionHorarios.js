import { useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import { showConfirm, showSuccess, showError } from '../utils/alerts';

/**
 * Hook para gestionar horarios (CRUD)
 * Responsabilidad única: obtener, crear, editar y eliminar horarios
 */
export function useGestionHorarios() {
  const [horarios, setHorarios] = useState([]);
  const [doctores, setDoctores] = useState([]);
  const [loading, setLoading] = useState(true);

  const cargarDatos = useCallback(async () => {
    setLoading(true);
    try {
      const [resHor, resDoc] = await Promise.all([
        api.get("/horarios"),
        api.get("/doctores")
      ]);
      setHorarios(Array.isArray(resHor.data) ? resHor.data : []);
      setDoctores(Array.isArray(resDoc.data) ? resDoc.data : []);
    } catch (error) {
      console.error("Error al cargar datos:", error);
      setHorarios([]);
      setDoctores([]);
      showError("Error", "No se pudieron cargar los datos");
    } finally {
      setLoading(false);
    }
  }, []);

  const guardarHorario = useCallback(async (formData, idHorario = null) => {
    try {
      const payload = {
        ...formData,
        doctor: { idDoctor: formData.doctor.idDoctor }
      };

      if (idHorario) {
        await api.put(`/horarios/${idHorario}`, payload);
        showSuccess("Éxito", "Horario actualizado correctamente");
      } else {
        await api.post("/horarios", payload);
        showSuccess("Éxito", "Horario creado correctamente");
      }

      await cargarDatos();
      return true;
    } catch (error) {
      const msg = error.response?.data?.error || error.response?.data?.message || "Error al guardar";
      showError("Error", msg);
      return false;
    }
  }, [cargarDatos]);

  const eliminarHorario = useCallback(async (id) => {
    const confirmar = await showConfirm(
      "¿Deseas eliminar este horario?",
      "Eliminar horario"
    );

    if (!confirmar) return;

    try {
      await api.delete(`/horarios/${id}`);
      showSuccess("Éxito", "Horario eliminado correctamente");
      await cargarDatos();
    } catch (error) {
      const msg = error.response?.data?.error || error.response?.data?.message || "Error al eliminar";
      showError("Error", msg);
    }
  }, [cargarDatos]);

  useEffect(() => {
    cargarDatos();
  }, [cargarDatos]);

  return {
    horarios,
    doctores,
    loading,
    cargarDatos,
    guardarHorario,
    eliminarHorario
  };
}
