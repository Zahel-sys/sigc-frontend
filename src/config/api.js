/**
 * Configuración centralizada de API (Open/Closed Principle)
 * URLs, endpoints y rutas en un único lugar
 */

const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';

export const API_CONFIG = {
  BASE_URL,

  // Endpoints
  ENDPOINTS: {
    // Auth
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    ME: '/auth/me',
    CHANGE_PASSWORD: '/auth/cambiar-contrasena',
    REFRESH_TOKEN: '/auth/refresh',

    // Usuarios
    USERS: '/usuarios',
    USER_BY_ID: (id) => `/usuarios/${id}`,
    UPDATE_USER: (id) => `/usuarios/${id}`,

    // Especialidades
    ESPECIALIDADES: '/especialidades',
    ESPECIALIDAD_BY_ID: (id) => `/especialidades/${id}`,

    // Doctores
    DOCTORES: '/doctores',
    DOCTOR_BY_ID: (id) => `/doctores/${id}`,
    DOCTOR_IMAGE: (imagen) => `/doctores/imagen/${imagen}`,

    // Horarios
    HORARIOS: '/horarios',
    HORARIOS_BY_DOCTOR: (idDoctor) => `/horarios/doctor/${idDoctor}`,
    HORARIO_BY_ID: (id) => `/horarios/${id}`,

    // Citas
    CITAS: '/citas',
    CITAS_BY_USER: (idUsuario) => `/citas/usuario/${idUsuario}`,
    CITA_BY_ID: (id) => `/citas/${id}`,
    CANCEL_CITA: (id) => `/citas/${id}/cancelar`,

    // Uploads
    UPLOAD: '/uploads',
    ESPECIALIDAD_IMAGE: (imagen) => `/images/especialidades/${imagen}`,
  },

  // Timeouts y reintentos
  TIMEOUT: 10000,
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000,

  // Logs
  DEBUG: process.env.NODE_ENV === 'development',
};

export default API_CONFIG;
