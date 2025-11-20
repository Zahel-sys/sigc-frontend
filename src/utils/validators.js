/**
 * Funciones de validación centralizadas (DRY)
 * Evita duplicación de lógica de validación
 */

import { VALIDATION_PATTERNS, validateField } from '../constants/validation';

/**
 * Valida un email
 * @param {string} email
 * @returns {boolean}
 */
export const validarEmail = (email) => {
  return VALIDATION_PATTERNS.EMAIL.test(email);
};

/**
 * Valida un DNI
 * @param {string} dni
 * @returns {boolean}
 */
export const validarDNI = (dni) => {
  return VALIDATION_PATTERNS.DNI.test(dni);
};

/**
 * Valida un teléfono
 * @param {string} telefono
 * @returns {boolean}
 */
export const validarTelefono = (telefono) => {
  return VALIDATION_PATTERNS.PHONE.test(telefono);
};

/**
 * Valida una contraseña simple
 * @param {string} password
 * @returns {boolean}
 */
export const validarContraseña = (password) => {
  return VALIDATION_PATTERNS.SIMPLE_PASSWORD.test(password);
};

/**
 * Valida un nombre
 * @param {string} nombre
 * @returns {boolean}
 */
export const validarNombre = (nombre) => {
  return nombre.trim().length >= 3;
};

/**
 * Valida todos los campos de un formulario
 * @param {Object} formData - Los datos del formulario
 * @param {string[]} fieldNames - Nombres de los campos a validar
 * @returns {Object} Errores encontrados { fieldName: errorMessage }
 */
export const validarFormulario = (formData, fieldNames) => {
  const errors = {};

  fieldNames.forEach(fieldName => {
    const error = validateField(formData[fieldName], fieldName);
    if (error) {
      errors[fieldName] = error;
    }
  });

  return errors;
};

/**
 * Valida un objeto con múltiples validadores
 * @param {Object} formData
 * @param {Object} validators - { fieldName: validatorFn }
 * @returns {Object} Errores encontrados
 */
export const validarConValidadores = (formData, validators) => {
  const errors = {};

  Object.entries(validators).forEach(([fieldName, validatorFn]) => {
    const error = validatorFn(formData[fieldName]);
    if (error) {
      errors[fieldName] = error;
    }
  });

  return errors;
};

/**
 * Verifica si hay errores en la validación
 * @param {Object} errors
 * @returns {boolean}
 */
export const tieneErrores = (errors) => {
  return Object.keys(errors).length > 0;
};

export default {
  validarEmail,
  validarDNI,
  validarTelefono,
  validarContraseña,
  validarNombre,
  validarFormulario,
  validarConValidadores,
  tieneErrores,
};
