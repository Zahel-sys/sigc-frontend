/**
 * Servicio de Autenticación (DIP - Dependency Inversion)
 * Encapsula toda la lógica de autenticación
 * Los componentes dependen de esta interfaz, no de axios
 */

import api from '../../services/api';
import { API_CONFIG } from '../../config/api';

export const authService = {
  /**
   * Inicia sesión con email y contraseña
   * @param {string} email
   * @param {string} password
   * @returns {Promise<Object>} Usuario con token
   */
  login: async (email, password) => {
    const response = await api.post(API_CONFIG.ENDPOINTS.LOGIN, {
      email,
      password,
    });
    return response.data;
  },

  /**
   * Registra un nuevo usuario
   * @param {Object} userData
   * @returns {Promise<Object>} Usuario registrado
   */
  register: async (userData) => {
    const response = await api.post(API_CONFIG.ENDPOINTS.REGISTER, userData);
    return response.data;
  },

  /**
   * Obtiene el usuario actual autenticado
   * @returns {Promise<Object>} Usuario actual
   */
  getCurrentUser: async () => {
    const response = await api.get(API_CONFIG.ENDPOINTS.ME);
    return response.data;
  },

  /**
   * Cambia la contraseña del usuario
   * @param {Object} passwordData
   * @returns {Promise<Object>}
   */
  changePassword: async (passwordData) => {
    const response = await api.post(API_CONFIG.ENDPOINTS.CHANGE_PASSWORD, passwordData);
    return response.data;
  },

  /**
   * Cierra la sesión (limpia localStorage)
   */
  logout: () => {
    localStorage.clear();
  },

  /**
   * Obtiene el token del usuario almacenado
   * @returns {string|null}
   */
  getToken: () => {
    try {
      const usuario = JSON.parse(localStorage.getItem('usuario') || '{}');
      return usuario.token || null;
    } catch {
      return null;
    }
  },

  /**
   * Obtiene el usuario almacenado en localStorage
   * @returns {Object|null}
   */
  getStoredUser: () => {
    try {
      return JSON.parse(localStorage.getItem('usuario') || 'null');
    } catch {
      return null;
    }
  },

  /**
   * Guarda el usuario en localStorage
   * @param {Object} usuario
   */
  saveUser: (usuario) => {
    localStorage.setItem('usuario', JSON.stringify(usuario));
  },

  /**
   * Verifica si el usuario está autenticado
   * @returns {boolean}
   */
  isAuthenticated: () => {
    return !!authService.getToken();
  },
};

export default authService;
