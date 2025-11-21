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
    console.log('🔍 DEBUG - Response completo del login:', response.data);
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
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
  },

  /**
   * Obtiene el token del usuario almacenado
   * @returns {string|null}
   */
  getToken: () => {
    return localStorage.getItem('token') || null;
  },

  /**
   * Obtiene el usuario almacenado en localStorage
   * @returns {Object|null}
   */
  getStoredUser: () => {
    try {
      const usuario = localStorage.getItem('usuario');
      return usuario ? JSON.parse(usuario) : null;
    } catch {
      return null;
    }
  },

  /**
   * Guarda el usuario y token en localStorage
   * Backend devuelve: { idUsuario, message, rol, email, token, nombre? }
   * @param {Object} data - Respuesta del backend
   */
  saveUser: (data) => {
    console.log('💾 DEBUG - Guardando en localStorage:', data);
    
    // Guardar token
    if (data.token) {
      localStorage.setItem('token', data.token);
      console.log('✅ Token guardado');
    } else {
      console.warn('⚠️ No se encontró token en data');
    }
    
    // Extraer datos del usuario (el backend los devuelve en el objeto raíz)
    const usuario = {
      idUsuario: data.idUsuario,
      nombre: data.nombre || data.email, // Usar email si no hay nombre
      email: data.email,
      rol: data.rol
    };
    
    localStorage.setItem('usuario', JSON.stringify(usuario));
    console.log('✅ Usuario guardado:', usuario);
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
