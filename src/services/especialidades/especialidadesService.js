/**
 * Servicio de Especialidades (DIP - Dependency Inversion)
 * Encapsula toda la lógica de gestión de especialidades
 */

import api from '../../services/api';
import { API_CONFIG } from '../../config/api';

export const especialidadesService = {
  /**
   * Obtiene todas las especialidades
   * @returns {Promise<Array>}
   */
  getAllEspecialidades: async () => {
    const response = await api.get(API_CONFIG.ENDPOINTS.ESPECIALIDADES);
    return Array.isArray(response.data) ? response.data : [];
  },

  /**
   * Obtiene una especialidad por ID
   * @param {number} id
   * @returns {Promise<Object>}
   */
  getEspecialidadById: async (id) => {
    const response = await api.get(API_CONFIG.ENDPOINTS.ESPECIALIDAD_BY_ID(id));
    return response.data;
  },

  /**
   * Crea una nueva especialidad
   * @param {Object} data
   * @returns {Promise<Object>}
   */
  createEspecialidad: async (data) => {
    const response = await api.post(API_CONFIG.ENDPOINTS.ESPECIALIDADES, data);
    return response.data;
  },

  /**
   * Actualiza una especialidad
   * @param {number} id
   * @param {Object} data
   * @returns {Promise<Object>}
   */
  updateEspecialidad: async (id, data) => {
    const response = await api.put(API_CONFIG.ENDPOINTS.ESPECIALIDAD_BY_ID(id), data);
    return response.data;
  },

  /**
   * Elimina una especialidad
   * @param {number} id
   * @returns {Promise<Object>}
   */
  deleteEspecialidad: async (id) => {
    const response = await api.delete(API_CONFIG.ENDPOINTS.ESPECIALIDAD_BY_ID(id));
    return response.data;
  },

  /**
   * Construye la URL de la imagen de especialidad
   * @param {string} imagen
   * @returns {string}
   */
  getImageUrl: (imagen) => {
    return imagen
      ? `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.ESPECIALIDAD_IMAGE(imagen)}`
      : 'https://via.placeholder.com/200x150?text=Sin+Foto';
  },
};

export default especialidadesService;
