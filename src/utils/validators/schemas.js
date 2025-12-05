import * as yup from 'yup';

// 🔹 Validaciones personalizadas para Perú
export const validationSchemas = {
  // Login Schema
  login: yup.object({
    email: yup
      .string()
      .required('El correo es obligatorio')
      .email('Ingresa un correo válido')
      .matches(
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        'El formato del correo no es válido'
      ),
    password: yup
      .string()
      .required('La contraseña es obligatoria')
      .min(6, 'La contraseña debe tener mínimo 6 caracteres'),
  }),

  // Registro Schema
  registro: yup.object({
    nombre: yup
      .string()
      .required('El nombre es obligatorio')
      .min(2, 'El nombre debe tener mínimo 2 caracteres')
      .max(100, 'El nombre no puede superar 100 caracteres')
      .matches(
        /^[a-zA-ZñÑáéíóúÁÉÍÓÚ\s]+$/,
        'El nombre solo puede contener letras y espacios'
      ),
    email: yup
      .string()
      .required('El correo es obligatorio')
      .email('Ingresa un correo válido')
      .matches(
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        'El formato del correo no es válido'
      ),
    password: yup
      .string()
      .required('La contraseña es obligatoria')
      .min(6, 'La contraseña debe tener mínimo 6 caracteres')
      .max(50, 'La contraseña no puede superar 50 caracteres')
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        'La contraseña debe contener al menos: 1 mayúscula, 1 minúscula y 1 número'
      ),
    confirmPassword: yup
      .string()
      .required('Confirma tu contraseña')
      .oneOf([yup.ref('password')], 'Las contraseñas deben coincidir'),
    dni: yup
      .string()
      .required('El DNI es obligatorio')
      .matches(
        /^\d{8}$/,
        'El DNI debe contener exactamente 8 dígitos'
      )
      .test('dni-valido', 'DNI no válido', (value) => {
        if (!value) return false;
        // Validación básica: no puede ser todos ceros o secuencias
        return value !== '00000000' && 
               value !== '11111111' && 
               value !== '12345678' && 
               value !== '87654321';
      }),
    telefono: yup
      .string()
      .required('El teléfono es obligatorio')
      .matches(
        /^9\d{8}$/,
        'El teléfono debe empezar con 9 y tener 9 dígitos'
      ),
    rol: yup
      .string()
      .required('El rol es obligatorio')
      .oneOf(['PACIENTE', 'ADMIN', 'DOCTOR'], 'Selecciona un rol válido'),
  }),

  // Perfil Usuario Schema
  perfil: yup.object({
    nombre: yup
      .string()
      .required('El nombre es obligatorio')
      .min(2, 'El nombre debe tener mínimo 2 caracteres')
      .max(100, 'El nombre no puede superar 100 caracteres'),
    email: yup
      .string()
      .required('El correo es obligatorio')
      .email('Ingresa un correo válido'),
    dni: yup
      .string()
      .required('El DNI es obligatorio')
      .matches(/^\d{8}$/, 'El DNI debe contener exactamente 8 dígitos'),
    telefono: yup
      .string()
      .required('El teléfono es obligatorio')
      .matches(/^9\d{8}$/, 'El teléfono debe empezar con 9 y tener 9 dígitos'),
  }),

  // Cambiar Contraseña Schema
  changePassword: yup.object({
    passwordActual: yup
      .string()
      .required('La contraseña actual es obligatoria'),
    passwordNueva: yup
      .string()
      .required('La nueva contraseña es obligatoria')
      .min(6, 'La contraseña debe tener mínimo 6 caracteres')
      .notOneOf([yup.ref('passwordActual')], 'La nueva contraseña debe ser diferente a la actual'),
    passwordConfirmar: yup
      .string()
      .required('Confirma la nueva contraseña')
      .oneOf([yup.ref('passwordNueva')], 'Las contraseñas no coinciden'),
  }),

  // Especialidad Schema
  especialidad: yup.object({
    nombre: yup
      .string()
      .required('El nombre de la especialidad es obligatorio')
      .min(3, 'Mínimo 3 caracteres')
      .max(50, 'Máximo 50 caracteres'),
    descripcion: yup
      .string()
      .required('La descripción es obligatoria')
      .min(10, 'Mínimo 10 caracteres')
      .max(500, 'Máximo 500 caracteres'),
    imagen: yup
      .string()
      .notRequired(),
  }),

  // Doctor Schema
  doctor: yup.object({
    nombre: yup
      .string()
      .required('El nombre del doctor es obligatorio')
      .min(3, 'Mínimo 3 caracteres')
      .max(100, 'Máximo 100 caracteres'),
    especialidad: yup
      .string()
      .required('La especialidad es obligatoria'),
    cupoPacientes: yup
      .number()
      .required('El cupo de pacientes es obligatorio')
      .min(1, 'Mínimo 1 paciente')
      .max(50, 'Máximo 50 pacientes'),
  }),

  // Horario Schema
  horario: yup.object({
    fecha: yup
      .date()
      .required('La fecha es obligatoria')
      .min(new Date(), 'No se pueden crear horarios en fechas pasadas'),
    turno: yup
      .string()
      .required('El turno es obligatorio')
      .oneOf(['Mañana', 'Tarde', 'Noche'], 'Selecciona un turno válido'),
    horaInicio: yup
      .string()
      .required('La hora de inicio es obligatoria')
      .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Formato de hora inválido (HH:MM)'),
    horaFin: yup
      .string()
      .required('La hora de fin es obligatoria')
      .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Formato de hora inválido (HH:MM)')
      .test('hora-mayor', 'La hora de fin debe ser posterior a la de inicio', function(value) {
        const { horaInicio } = this.parent;
        if (!horaInicio || !value) return true;
        return value > horaInicio;
      }),
    doctorId: yup
      .number()
      .required('Debes seleccionar un doctor')
      .positive('ID de doctor inválido'),
  }),
};

// 🔧 Helpers para validaciones específicas
export const validators = {
  // Validar DNI peruano básico
  validateDNI: (dni) => {
    if (!dni) return false;
    return /^\d{8}$/.test(dni) && dni !== '00000000';
  },

  // Validar teléfono peruano
  validatePhone: (phone) => {
    if (!phone) return false;
    return /^9\d{8}$/.test(phone);
  },

  // Validar email
  validateEmail: (email) => {
    if (!email) return false;
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  },

  // Validar solo letras y espacios
  validateName: (name) => {
    if (!name) return false;
    return /^[a-zA-ZñÑáéíóúÁÉÍÓÚ\s]+$/.test(name);
  },

  // Validar archivo de imagen
  validateImageFile: (file) => {
    if (!file) return { valid: true };
    
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    const maxSize = 5 * 1024 * 1024; // 5MB
    
    if (!validTypes.includes(file.type)) {
      return {
        valid: false,
        error: 'Solo se permiten imágenes (JPG, PNG, GIF, WEBP)'
      };
    }
    
    if (file.size > maxSize) {
      return {
        valid: false,
        error: 'La imagen no puede superar los 5MB'
      };
    }
    
    return { valid: true };
  },
};

export default validationSchemas;