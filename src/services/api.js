import axios from "axios";

// Configuración centralizada (DIP - Dependency Inversion Principle)
const getBaseURL = () => {
  return import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';
};

const api = axios.create({
  baseURL: getBaseURL(),
});

// Interceptor para agregar el token automáticamente a todas las peticiones
api.interceptors.request.use(
  (config) => {
    const usuario = localStorage.getItem("usuario");
    
    if (usuario) {
      try {
        const user = JSON.parse(usuario);
        if (user.token) {
          config.headers.Authorization = `Bearer ${user.token}`;
        }
      } catch (e) {
        console.error("Error al parsear usuario del localStorage:", e);
      }
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar errores 401 (token expirado/inválido)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Solo limpiar y redirigir si NO estamos en rutas públicas
      const rutasPublicas = ['/login', '/registrar', '/especialidades', '/turnos'];
      const rutaActual = window.location.pathname;
      
      const esRutaPublica = rutasPublicas.some(ruta => rutaActual.startsWith(ruta));
      
      if (!esRutaPublica) {
        console.warn("⚠️ Token expirado o inválido. Redirigiendo al login...");
        localStorage.clear();
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default api;
