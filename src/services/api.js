import axios from "axios";

// Configuración centralizada (DIP - Dependency Inversion Principle)
const getBaseURL = () => {
  return import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';
};

const api = axios.create({
  baseURL: getBaseURL(),
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor para agregar el token automáticamente a todas las peticiones
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor global de errores mejorado
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Error del servidor con respuesta
      switch (error.response.status) {
        case 400:
          console.error('❌ Datos inválidos:', error.response.data);
          break;
        case 401:
          console.error('❌ No autenticado');
          // Solo limpiar y redirigir si NO estamos en rutas públicas
          const rutasPublicas = ['/login', '/registrar', '/especialidades', '/turnos', '/'];
          const rutaActual = window.location.pathname;
          
          const esRutaPublica = rutasPublicas.some(ruta => rutaActual.startsWith(ruta));
          
          if (!esRutaPublica) {
            console.warn("⚠️ Token expirado o inválido. Redirigiendo al login...");
            localStorage.removeItem('token');
            localStorage.removeItem('usuario');
            window.location.href = "/login";
          }
          break;
        case 404:
          console.error('❌ Recurso no encontrado:', error.config?.url);
          break;
        case 500:
          console.error('❌ Error del servidor:', error.response.data);
          break;
        default:
          console.error(`❌ Error ${error.response.status}:`, error.response.data);
      }
    } else if (error.request) {
      // No hay respuesta del servidor
      console.error('❌ No hay respuesta del servidor. Verifique que el backend esté corriendo en', getBaseURL());
    } else {
      // Error al configurar la petición
      console.error('❌ Error:', error.message);
    }
    return Promise.reject(error);
  }
);

export default api;
