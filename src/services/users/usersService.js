/**
 * Servicio de Usuarios (DIP - Dependency Inversion)
 * Encapsula toda la lógica de gestión de usuarios
 */

import api from '../../services/api';
import { API_CONFIG } from '../../config/api';

export const usersService = {
  /**
   * Obtiene un usuario por ID
   * @param {number} id
   * @returns {Promise<Object>}
   */
  getUserById: async (id) => {
    const response = await api.get(API_CONFIG.ENDPOINTS.USER_BY_ID(id));
    return response.data;
  },

  /**
   * Actualiza el perfil del usuario
   * @param {number} id
   * @param {Object} userData
   * @returns {Promise<Object>}
   */
  updateUser: async (id, userData) => {
    const response = await api.put(API_CONFIG.ENDPOINTS.UPDATE_USER(id), userData);
    return response.data;
  },

  /**
   * Actualiza la contraseña del usuario
   * @param {Object} passwordData
   * @returns {Promise<Object>}
   */
  updatePassword: async (passwordData) => {
    const response = await api.post(API_CONFIG.ENDPOINTS.CHANGE_PASSWORD, passwordData);
    return response.data;
  },

  /**
   * Obtiene todos los usuarios (solo admin)
   * @returns {Promise<Array>}
   */
  getAllUsers: async () => {
    const response = await api.get(API_CONFIG.ENDPOINTS.USERS);
    return Array.isArray(response.data) ? response.data : [];
  },
};

export default usersService;
