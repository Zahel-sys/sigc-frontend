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
      // El backend requiere multipart/form-data
      const formData = new FormData();
      formData.append("nombre", datos.nombre.trim());
      formData.append("especialidad", datos.especialidad.trim());
      formData.append("cupoPacientes", parseInt(datos.cupoPacientes));
      
      // Solo agregar imagen si existe
      if (datos.imagen instanceof File) {
        formData.append("imagen", datos.imagen);
      }

      console.log('📤 Enviando datos al backend:');
      console.log('  - Nombre:', datos.nombre);
      console.log('  - Especialidad:', datos.especialidad);
      console.log('  - Cupo:', datos.cupoPacientes);
      console.log('  - Imagen:', datos.imagen ? datos.imagen.name : 'Sin imagen');

      if (idDoctor) {
        // Actualizar doctor existente
        // ✅ NO especificar Content-Type - axios lo maneja automáticamente
        const response = await api.put(`/doctores/${idDoctor}`, formData);
        console.log('✅ Doctor actualizado:', response.data);
        showSuccess("Doctor actualizado", "Los datos se guardaron correctamente");
      } else {
        // Crear nuevo doctor
        // ✅ NO especificar Content-Type - axios lo maneja automáticamente
        const response = await api.post("/doctores", formData);
        console.log('✅ Doctor creado:', response.data);
        showSuccess("Doctor registrado", "El doctor se registró correctamente");
      }

      await cargarDoctores();
      return true;
    } catch (error) {
      console.error('❌ Error completo:', error);
      console.error('❌ Response:', error.response);
      
      let mensaje = "No se pudo guardar el doctor";
      
      if (error.response?.data) {
        if (typeof error.response.data === 'string') {
          mensaje = error.response.data;
        } else if (error.response.data.message) {
          mensaje = error.response.data.message;
        } else if (error.response.data.error) {
          mensaje = error.response.data.error;
        }
      } else if (error.message) {
        mensaje = error.message;
      }
      
      showError("Error al guardar doctor", mensaje);
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
