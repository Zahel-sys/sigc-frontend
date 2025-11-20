import { useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import { showSuccess, showError, showConfirm } from '../utils/alerts';

/**
 * Hook para gestionar doctores en el admin
 * Responsabilidad única: CRUD de doctores
 */
export function useDoctoresAdmin() {
  const [doctores, setDoctores] = useState([]);
  const [especialidades, setEspecialidades] = useState([]);
  const [loading, setLoading] = useState(true);

  // Cargar doctores
  const cargarDoctores = useCallback(async () => {
    try {
      const res = await api.get("/doctores");
      setDoctores(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error("Error al cargar doctores:", error);
      setDoctores([]);
      showError("Error", "No se pudieron cargar los doctores");
    }
  }, []);

  // Cargar especialidades
  const cargarEspecialidades = useCallback(async () => {
    try {
      const res = await api.get("/especialidades");
      setEspecialidades(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error("Error al cargar especialidades:", error);
      setEspecialidades([]);
    }
  }, []);

  // Guardar doctor (crear o actualizar)
  const guardarDoctor = useCallback(async (datos, idDoctor = null) => {
    try {
      const formData = new FormData();
      formData.append("nombre", datos.nombre);
      formData.append("especialidad", datos.especialidad);
      formData.append("cupoPacientes", datos.cupoPacientes);
      if (datos.imagen) formData.append("imagen", datos.imagen);

      if (idDoctor) {
        await api.put(`/doctores/${idDoctor}`, formData);
        showSuccess("Doctor actualizado", "Los datos se guardaron correctamente");
      } else {
        await api.post("/doctores", formData);
        showSuccess("Doctor registrado", "El doctor se registró correctamente");
      }

      await cargarDoctores();
      return true;
    } catch (error) {
      console.error("Error al guardar doctor:", error);
      showError("Error", error.response?.data?.message || "No se pudo guardar el doctor");
      return false;
    }
  }, [cargarDoctores]);

  // Eliminar doctor
  const eliminarDoctor = useCallback(async (idDoctor) => {
    const confirmar = await showConfirm(
      "¿Estás seguro de que deseas eliminar este doctor?",
      "Eliminar doctor"
    );

    if (!confirmar) return false;

    try {
      await api.delete(`/doctores/${idDoctor}`);
      showSuccess("Doctor eliminado", "El doctor se eliminó correctamente");
      await cargarDoctores();
      return true;
    } catch (error) {
      console.error("Error al eliminar doctor:", error);
      showError("Error", error.response?.data?.message || "No se pudo eliminar el doctor");
      return false;
    }
  }, [cargarDoctores]);

  // Cargar datos iniciales
  useEffect(() => {
    const cargarDatos = async () => {
      setLoading(true);
      await Promise.all([cargarDoctores(), cargarEspecialidades()]);
      setLoading(false);
    };
    cargarDatos();
  }, [cargarDoctores, cargarEspecialidades]);

  return {
    doctores,
    especialidades,
    loading,
    cargarDoctores,
    guardarDoctor,
    eliminarDoctor
  };
}
