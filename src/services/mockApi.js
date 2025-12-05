/**
 * Mock API - Datos de prueba para desarrollo y testing
 * Se usa cuando el backend no está disponible o para testing
 */

// Datos mock de especialidades
const especialidadesMock = [
  {
    idEspecialidad: 1,
    nombre: "Cardiología",
    descripcion: "Especialidad del corazón",
    imagen: null
  },
  {
    idEspecialidad: 2,
    nombre: "Dermatología",
    descripcion: "Especialidad de la piel",
    imagen: null
  },
  {
    idEspecialidad: 3,
    nombre: "Pediatría",
    descripcion: "Especialidad de niños",
    imagen: null
  },
  {
    idEspecialidad: 4,
    nombre: "Neurología",
    descripcion: "Especialidad del sistema nervioso",
    imagen: null
  }
];

// Datos mock iniciales de doctores
const doctoresMockInicial = [
  {
    idDoctor: 1,
    nombre: "María",
    apellido: "Pérez",
    especialidad: "Medicina General",
    cupoPacientes: 15,
    imagen: null
  },
  {
    idDoctor: 2,
    nombre: "Carlos",
    apellido: "García",
    especialidad: "Cardiología",
    cupoPacientes: 12,
    imagen: null
  },
  {
    idDoctor: 3,
    nombre: "Ana",
    apellido: "López",
    especialidad: "Neurología",
    cupoPacientes: 8,
    imagen: null
  }
];

// Cargar doctores desde localStorage o usar datos iniciales
let doctoresMock = (() => {
  try {
    const stored = localStorage.getItem('mockDoctores');
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.warn("No se pudo cargar doctores desde localStorage:", e);
  }
  return [...doctoresMockInicial];
})();

// Función para guardar doctores en localStorage
const guardarDoctoresEnLocalStorage = () => {
  try {
    localStorage.setItem('mockDoctores', JSON.stringify(doctoresMock));
  } catch (e) {
    console.warn("No se pudo guardar doctores en localStorage:", e);
  }
};

// Datos mock de citas
const citasMock = [
  {
    idCita: 1,
    usuarioId: 1,
    doctorId: 1,
    fecha: "2025-12-10",
    hora: "10:00",
    estado: "confirmada"
  },
  {
    idCita: 2,
    usuarioId: 1,
    doctorId: 2,
    fecha: "2025-12-12",
    hora: "14:30",
    estado: "confirmada"
  }
];

// API Mock
export const mockApi = {
  // =================== AUTENTICACIÓN ===================
  login: async (credentials) => {
    console.log("🎭 [Mock] Login:", credentials);
    return {
      id: 1,
      email: credentials.email,
      nombre: "Usuario Mock",
      rol: credentials.email.includes("admin") ? "ADMIN" : "PACIENTE",
      token: "mock_token_" + Date.now()
    };
  },

  register: async (userData) => {
    console.log("🎭 [Mock] Registro:", userData);
    return {
      id: Math.floor(Math.random() * 1000),
      email: userData.email,
      nombre: userData.nombre,
      rol: "PACIENTE",
      token: "mock_token_" + Date.now()
    };
  },

  // =================== ESPECIALIDADES ===================
  getEspecialidades: async () => {
    console.log("🎭 [Mock] GET especialidades");
    return especialidadesMock;
  },

  // =================== DOCTORES ===================
  getDoctores: async () => {
    console.log("🎭 [Mock] GET doctores");
    return doctoresMock;
  },

  getDoctoresByEspecialidad: async (especialidadId) => {
    console.log("🎭 [Mock] GET doctores por especialidad:", especialidadId);
    const especialidad = especialidadesMock.find(e => e.idEspecialidad === especialidadId);
    return doctoresMock.filter(d => d.especialidad === especialidad?.nombre);
  },

  createDoctor: async (doctorData) => {
    console.log("🎭 [Mock] POST doctor:", doctorData);
    const newDoctor = {
      idDoctor: Math.max(...doctoresMock.map(d => d.idDoctor), 0) + 1,
      ...doctorData
    };
    doctoresMock.push(newDoctor);
    guardarDoctoresEnLocalStorage(); // Guardar en localStorage
    return newDoctor;
  },

  updateDoctor: async (doctorId, doctorData) => {
    console.log("🎭 [Mock] PUT doctor:", doctorId, doctorData);
    const index = doctoresMock.findIndex(d => d.idDoctor === doctorId);
    if (index !== -1) {
      doctoresMock[index] = {
        ...doctoresMock[index],
        ...doctorData
      };
      guardarDoctoresEnLocalStorage(); // Guardar en localStorage
      return doctoresMock[index];
    }
    return { idDoctor: doctorId, ...doctorData };
  },

  deleteDoctor: async (doctorId) => {
    console.log("🎭 [Mock] DELETE doctor:", doctorId);
    const index = doctoresMock.findIndex(d => d.idDoctor === doctorId);
    if (index !== -1) {
      doctoresMock.splice(index, 1);
      guardarDoctoresEnLocalStorage(); // Guardar en localStorage
    }
    return { success: true };
  },

  // =================== CITAS ===================
  createCita: async (citaData) => {
    console.log("🎭 [Mock] POST cita:", citaData);
    return {
      idCita: Math.floor(Math.random() * 10000),
      ...citaData
    };
  },

  getCitasUsuario: async (usuarioId) => {
    console.log("🎭 [Mock] GET citas usuario:", usuarioId);
    return citasMock.filter(c => c.usuarioId === usuarioId);
  },

  cancelarCita: async (citaId) => {
    console.log("🎭 [Mock] DELETE cita:", citaId);
    return { success: true };
  },

  // =================== HORARIOS ===================
  getHorarios: async (doctorId, fecha) => {
    console.log("🎭 [Mock] GET horarios:", doctorId, fecha);
    return [
      { hora: "08:00", disponible: true },
      { hora: "09:00", disponible: true },
      { hora: "10:00", disponible: false },
      { hora: "11:00", disponible: true },
      { hora: "14:00", disponible: true },
      { hora: "15:00", disponible: true },
      { hora: "16:00", disponible: false },
      { hora: "17:00", disponible: true }
    ];
  }
};

export default mockApi;
