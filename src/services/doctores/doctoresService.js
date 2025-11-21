/**
 * Servicio de Doctores (DIP - Dependency Inversion)
 * Encapsula toda la lógica de gestión de doctores
 */

import api from '../../services/api';
import { API_CONFIG } from '../../config/api';

export const doctoresService = {
  /**
   * Obtiene todos los doctores
   * @returns {Promise<Array>}
   */
  getAllDoctores: async () => {
    const response = await api.get(API_CONFIG.ENDPOINTS.DOCTORES);
    return Array.isArray(response.data) ? response.data : [];
  },

  /**
   * Obtiene un doctor por ID
   * @param {number} id
   * @returns {Promise<Object>}
   */
  getDoctorById: async (id) => {
    const response = await api.get(API_CONFIG.ENDPOINTS.DOCTOR_BY_ID(id));
    return response.data;
  },

  /**
   * Crea un nuevo doctor
   * @param {FormData} formData
   * @returns {Promise<Object>}
   */
  createDoctor: async (formData) => {
    // ✅ NO especificar Content-Type - axios lo maneja automáticamente con boundary
    const response = await api.post(API_CONFIG.ENDPOINTS.DOCTORES, formData);
    return response.data;
  },

  /**
   * Actualiza un doctor existente
   * @param {number} id
   * @param {FormData} formData
   * @returns {Promise<Object>}
   */
  updateDoctor: async (id, formData) => {
    // ✅ NO especificar Content-Type - axios lo maneja automáticamente con boundary
    const response = await api.put(API_CONFIG.ENDPOINTS.DOCTOR_BY_ID(id), formData);
    return response.data;
  },

  /**
   * Elimina un doctor
   * @param {number} id
   * @returns {Promise<Object>}
   */
  deleteDoctor: async (id) => {
    const response = await api.delete(API_CONFIG.ENDPOINTS.DOCTOR_BY_ID(id));
    return response.data;
  },

  /**
   * Obtiene doctores por especialidad
   * @param {string} especialidad
   * @returns {Promise<Array>}
   */
  getDoctoresByEspecialidad: async (especialidad) => {
    const doctores = await doctoresService.getAllDoctores();
    return doctores.filter(d => 
      d.especialidad.toLowerCase().trim() === especialidad.toLowerCase().trim()
    );
  },

  /**
   * Construye la URL de la imagen del doctor
   * @param {string} imagen
   * @returns {string}
   */
  getDoctorImageUrl: (imagen) => {
    return imagen 
      ? `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.DOCTOR_IMAGE(imagen)}`
      : 'https://via.placeholder.com/200x250?text=Sin+Foto';
  },
};

export default doctoresService;
