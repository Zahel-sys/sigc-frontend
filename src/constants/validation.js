/**
 * Patrones y reglas de validación centralizadas
 */

export const VALIDATION_PATTERNS = {
  // Email: RFC 5322 simplificado
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,

  // DNI: exactamente 8 dígitos
  DNI: /^\d{8}$/,

  // Teléfono: exactamente 9 dígitos
  PHONE: /^\d{9}$/,

  // Nombre: mínimo 3 caracteres, sin números
  NAME: /^[a-záéíóúñ\s]{3,}$/i,

  // Contraseña fuerte (recomendado)
  STRONG_PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,

  // Contraseña simple (actual)
  SIMPLE_PASSWORD: /^.{6,}$/,
};

export const VALIDATION_RULES = {
  // Email
  email: {
    required: true,
    pattern: VALIDATION_PATTERNS.EMAIL,
    minLength: 5,
    maxLength: 100,
  },

  // Contraseña
  password: {
    required: true,
    pattern: VALIDATION_PATTERNS.SIMPLE_PASSWORD,
    minLength: 6,
    maxLength: 50,
  },

  // DNI
  dni: {
    required: true,
    pattern: VALIDATION_PATTERNS.DNI,
    minLength: 8,
    maxLength: 8,
  },

  // Teléfono
  phone: {
    required: true,
    pattern: VALIDATION_PATTERNS.PHONE,
    minLength: 9,
    maxLength: 9,
  },

  // Nombre
  name: {
    required: true,
    minLength: 3,
    maxLength: 100,
  },
};

/**
 * Función reutilizable para validar un campo
 */
export const validateField = (value, fieldName) => {
  const rules = VALIDATION_RULES[fieldName];
  if (!rules) return null; // Sin reglas definidas

  if (rules.required && !value?.trim()) {
    return `${fieldName} es requerido`;
  }

  if (value?.length < (rules.minLength || 0)) {
    return `${fieldName} debe tener al menos ${rules.minLength} caracteres`;
  }

  if (value?.length > (rules.maxLength || Infinity)) {
    return `${fieldName} no puede exceder ${rules.maxLength} caracteres`;
  }

  if (rules.pattern && !rules.pattern.test(value)) {
    return `${fieldName} tiene un formato inválido`;
  }

  return null;
};

export default {
  VALIDATION_PATTERNS,
  VALIDATION_RULES,
  validateField,
};
