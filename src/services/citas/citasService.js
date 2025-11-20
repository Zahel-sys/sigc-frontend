/**
 * Servicio de Citas (DIP - Dependency Inversion)
 * Encapsula toda la lógica de gestión de citas
 */

import api from '../../services/api';
import { API_CONFIG } from '../../config/api';

export const citasService = {
  /**
   * Obtiene todas las citas
   * @returns {Promise<Array>}
   */
  getAllCitas: async () => {
    const response = await api.get(API_CONFIG.ENDPOINTS.CITAS);
    return Array.isArray(response.data) ? response.data : [];
  },

  /**
   * Obtiene citas de un usuario
   * @param {number} idUsuario
   * @returns {Promise<Array>}
   */
  getCitasByUser: async (idUsuario) => {
    const response = await api.get(API_CONFIG.ENDPOINTS.CITAS_BY_USER(idUsuario));
    return Array.isArray(response.data) ? response.data : [];
  },

  /**
   * Obtiene citas activas de un usuario
   * @param {number} idUsuario
   * @returns {Promise<Array>}
   */
  getActiveCitasByUser: async (idUsuario) => {
    const citas = await citasService.getCitasByUser(idUsuario);
    return citas.filter(c => c.estado === 'ACTIVA');
  },

  /**
   * Obtiene una cita por ID
   * @param {number} id
   * @returns {Promise<Object>}
   */
  getCitaById: async (id) => {
    const response = await api.get(API_CONFIG.ENDPOINTS.CITA_BY_ID(id));
    return response.data;
  },

  /**
   * Crea una nueva cita
   * @param {Object} data { usuario: { idUsuario }, horario: { idHorario } }
   * @returns {Promise<Object>}
   */
  createCita: async (data) => {
    const response = await api.post(API_CONFIG.ENDPOINTS.CITAS, data);
    return response.data;
  },

  /**
   * Cancela una cita existente
   * @param {number} id
   * @returns {Promise<Object>}
   */
  cancelCita: async (id) => {
    const response = await api.put(API_CONFIG.ENDPOINTS.CANCEL_CITA(id));
    return response.data;
  },

  /**
   * Filtra citas por estado
   * @param {Array} citas
   * @param {string} estado
   * @returns {Array}
   */
  filterByEstado: (citas, estado) => {
    return citas.filter(c => c.estado === estado);
  },

  /**
   * Ordena citas por fecha ascendente
   * @param {Array} citas
   * @returns {Array}
   */
  sortByFecha: (citas) => {
    return [...citas].sort((a, b) => 
      new Date(a.fechaCita) - new Date(b.fechaCita)
    );
  },
};

export default citasService;
