/**
 * Servicio de Horarios (DIP - Dependency Inversion)
 * Encapsula toda la lógica de gestión de horarios
 */

import api from '../../services/api';
import { API_CONFIG } from '../../config/api';

export const horariosService = {
  /**
   * Obtiene todos los horarios
   * @returns {Promise<Array>}
   */
  getAllHorarios: async () => {
    const response = await api.get(API_CONFIG.ENDPOINTS.HORARIOS);
    return Array.isArray(response.data) ? response.data : [];
  },

  /**
   * Obtiene un horario por ID
   * @param {number} id
   * @returns {Promise<Object>}
   */
  getHorarioById: async (id) => {
    const response = await api.get(API_CONFIG.ENDPOINTS.HORARIO_BY_ID(id));
    return response.data;
  },

  /**
   * Obtiene horarios de un doctor específico
   * @param {number} idDoctor
   * @returns {Promise<Array>}
   */
  getHorariosByDoctor: async (idDoctor) => {
    const response = await api.get(API_CONFIG.ENDPOINTS.HORARIOS_BY_DOCTOR(idDoctor));
    return Array.isArray(response.data) ? response.data : [];
  },

  /**
   * Crea un nuevo horario
   * @param {Object} data
   * @returns {Promise<Object>}
   */
  createHorario: async (data) => {
    const response = await api.post(API_CONFIG.ENDPOINTS.HORARIOS, data);
    return response.data;
  },

  /**
   * Actualiza un horario
   * @param {number} id
   * @param {Object} data
   * @returns {Promise<Object>}
   */
  updateHorario: async (id, data) => {
    const response = await api.put(API_CONFIG.ENDPOINTS.HORARIO_BY_ID(id), data);
    return response.data;
  },

  /**
   * Elimina un horario
   * @param {number} id
   * @returns {Promise<Object>}
   */
  deleteHorario: async (id) => {
    const response = await api.delete(API_CONFIG.ENDPOINTS.HORARIO_BY_ID(id));
    return response.data;
  },

  /**
   * Formatea una fecha
   * @param {string} fecha
   * @returns {string}
   */
  formatearFecha: (fecha) => {
    const opciones = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(fecha).toLocaleDateString('es-ES', opciones);
  },

  /**
   * Formatea una hora (HH:mm:ss → HH:mm)
   * @param {string} hora
   * @returns {string}
   */
  formatearHora: (hora) => {
    return hora.substring(0, 5);
  },
};

export default horariosService;
