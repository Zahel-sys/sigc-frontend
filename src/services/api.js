import axios from "axios";

// Leer la URL base desde la variable de entorno
// Si no existe, usa http://localhost:8080 como fallback
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

// Configuración para uso selectivo del backend real
const USE_REAL_BACKEND = {
  specialties: import.meta.env.VITE_USE_REAL_BACKEND_FOR_SPECIALTIES === 'true',
  doctors: import.meta.env.VITE_USE_REAL_BACKEND_FOR_DOCTORS === 'true',
  auth: !import.meta.env.VITE_USE_MOCK_FOR_AUTH === 'true',
  appointments: !import.meta.env.VITE_USE_MOCK_FOR_APPOINTMENTS === 'true',
  schedules: !import.meta.env.VITE_USE_MOCK_FOR_SCHEDULES === 'true'
};

console.log("🔗 API URL configurada:", API_URL);
console.log("⚙️ Configuración backend/mock:", USE_REAL_BACKEND);

// Funciones para normalizar datos del backend
const normalizarEspecialidades = (especialidades) => {
  return especialidades.map(esp => ({
    id: esp.idEspecialidad,
    name: esp.nombre,
    description: esp.descripcion,
    // Mantener campos originales para compatibilidad
    idEspecialidad: esp.idEspecialidad,
    nombre: esp.nombre,
    descripcion: esp.descripcion
  }));
};

const normalizarDoctores = (doctores) => {
  return doctores.map(doc => ({
    id: doc.idDoctor,
    name: doc.nombre,
    especialidad_id: doc.especialidad?.idEspecialidad,
    especialidad: doc.especialidad,
    // Mantener campos originales para compatibilidad
    idDoctor: doc.idDoctor,
    nombre: doc.nombre
  }));
};

const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
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

// Funciones API con fallback automático a mock
export const authAPI = {
  login: async (credentials) => {
    if (USE_MOCK_API) {
      return mockApi.login(credentials);
    }
    
    try {
      const response = await api.post('/auth/login', credentials);
      return response.data;
    } catch (error) {
      if (error.useMock || error.code === 'ERR_NETWORK') {
        console.log("🎭 Fallback a mock API para login");
        return mockApi.login(credentials);
      }
      throw error;
    }
  },

  register: async (userData) => {
    if (USE_MOCK_API) {
      return mockApi.register(userData);
    }
    
    try {
      const response = await api.post('/auth/register', userData);
      return response.data;
    } catch (error) {
      if (error.useMock || error.code === 'ERR_NETWORK') {
        console.log("🎭 Fallback a mock API para registro");
        return mockApi.register(userData);
      }
      throw error;
    }
  },

  getProfile: async () => {
    if (USE_MOCK_API) {
      // Mock profile basado en token almacenado
      const usuario = localStorage.getItem("usuario");
      if (usuario) {
        return { data: JSON.parse(usuario) };
      }
      throw new Error('No autenticado');
    }
    
    try {
      const response = await api.get('/auth/me');
      return response.data;
    } catch (error) {
      if (error.useMock || error.code === 'ERR_NETWORK') {
        const usuario = localStorage.getItem("usuario");
        if (usuario) {
          return { data: JSON.parse(usuario) };
        }
      }
      throw error;
    }
  }
};

export const especialidadesAPI = {
  getAll: async () => {
    // Usar backend real si está configurado, sino usar mock
    if (USE_REAL_BACKEND.specialties) {
      try {
        const response = await api.get('/especialidades');
        // Normalizar datos del backend para el frontend
        const especialidadesNormalizadas = normalizarEspecialidades(response.data);
        console.log("✅ Especialidades obtenidas del backend:", especialidadesNormalizadas);
        return especialidadesNormalizadas;
      } catch (error) {
        console.error("❌ Error obteniendo especialidades del backend, usando mock:", error.message);
        return mockApi.getEspecialidades();
      }
    }
    
    // Usar mock API
    return mockApi.getEspecialidades();
  }
};

export const doctoresAPI = {
  getAll: async () => {
    // Usar backend real si está configurado, sino usar mock
    if (USE_REAL_BACKEND.doctors) {
      try {
        const response = await api.get('/doctores');
        // Normalizar datos del backend para el frontend
        const doctoresNormalizados = normalizarDoctores(response.data);
        console.log("✅ Doctores obtenidos del backend:", doctoresNormalizados);
        return doctoresNormalizados;
      } catch (error) {
        console.error("❌ Error obteniendo doctores del backend, usando mock:", error.message);
        return mockApi.getDoctores();
      }
    }
    
    // Usar mock API
    return mockApi.getDoctores();
  },

  getByEspecialidad: async (especialidadId) => {
    // Usar backend real si está configurado
    if (USE_REAL_BACKEND.doctors) {
      try {
        const response = await api.get(`/doctores/especialidad/${especialidadId}`);
        const doctoresNormalizados = normalizarDoctores(response.data);
        console.log("✅ Doctores por especialidad obtenidos del backend:", doctoresNormalizados);
        return doctoresNormalizados;
      } catch (error) {
        console.error("❌ Error obteniendo doctores por especialidad del backend, usando mock:", error.message);
        return mockApi.getDoctoresByEspecialidad(especialidadId);
      }
    }
    
    // Usar mock API
    return mockApi.getDoctoresByEspecialidad(especialidadId);
  }
};

export const citasAPI = {
  create: async (citaData) => {
    if (USE_MOCK_API) {
      return mockApi.createCita(citaData);
    }
    
    try {
      const response = await api.post('/citas', citaData);
      return response.data;
    } catch (error) {
      if (error.useMock || error.code === 'ERR_NETWORK') {
        console.log("🎭 Fallback a mock API para crear cita");
        return mockApi.createCita(citaData);
      }
      throw error;
    }
  },

  getByUsuario: async (usuarioId) => {
    if (USE_MOCK_API) {
      return mockApi.getCitasUsuario(usuarioId);
    }
    
    try {
      const response = await api.get(`/citas/usuario/${usuarioId}`);
      return response.data;
    } catch (error) {
      if (error.useMock || error.code === 'ERR_NETWORK') {
        console.log("🎭 Fallback a mock API para citas del usuario");
        return mockApi.getCitasUsuario(usuarioId);
      }
      throw error;
    }
  },

  cancel: async (citaId) => {
    if (USE_MOCK_API) {
      return mockApi.cancelarCita(citaId);
    }
    
    try {
      const response = await api.put(`/citas/${citaId}/cancelar`);
      return response.data;
    } catch (error) {
      if (error.useMock || error.code === 'ERR_NETWORK') {
        console.log("🎭 Fallback a mock API para cancelar cita");
        return mockApi.cancelarCita(citaId);
      }
      throw error;
    }
  }
};

export const horariosAPI = {
  getByDoctor: async (doctorId, fecha) => {
    if (USE_MOCK_API) {
      return mockApi.getHorarios(doctorId, fecha);
    }
    
    try {
      const response = await api.get(`/horarios/doctor/${doctorId}/fecha/${fecha}`);
      return response.data;
    } catch (error) {
      if (error.useMock || error.code === 'ERR_NETWORK') {
        console.log("🎭 Fallback a mock API para horarios");
        return mockApi.getHorarios(doctorId, fecha);
      }
      throw error;
    }
  }
};

export default api;
