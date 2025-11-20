/**
 * Funciones de formateo centralizadas (DRY)
 * Evita duplicación de lógica en múltiples componentes
 */

/**
 * Formatea una fecha ISO a formato legible español
 * @param {string} fecha - Fecha en formato ISO
 * @returns {string} Fecha formateada "1 de enero de 2025"
 */
export const formatearFecha = (fecha) => {
  if (!fecha) return '';
  try {
    const opciones = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(fecha).toLocaleDateString('es-ES', opciones);
  } catch {
    return fecha;
  }
};

/**
 * Formatea una hora en formato HH:mm
 * @param {string} hora - Hora en formato HH:mm:ss
 * @returns {string} Hora formateada "14:30"
 */
export const formatearHora = (hora) => {
  if (!hora) return '';
  return hora.substring(0, 5);
};

/**
 * Formatea datetime completo
 * @param {string} fecha - Fecha en formato ISO
 * @returns {string} Fecha y hora formateadas
 */
export const formatearFechaHora = (fecha) => {
  if (!fecha) return '';
  try {
    return new Date(fecha).toLocaleString('es-ES');
  } catch {
    return fecha;
  }
};

/**
 * Trunca un texto a una longitud máxima
 * @param {string} texto
 * @param {number} maxLength
 * @returns {string}
 */
export const truncarTexto = (texto, maxLength = 50) => {
  if (!texto) return '';
  return texto.length > maxLength ? `${texto.substring(0, maxLength)}...` : texto;
};

/**
 * Capitaliza la primera letra de una cadena
 * @param {string} texto
 * @returns {string}
 */
export const capitalizarPrimera = (texto) => {
  if (!texto) return '';
  return texto.charAt(0).toUpperCase() + texto.slice(1).toLowerCase();
};

/**
 * Convierte a mayúsculas solo la primera letra de cada palabra
 * @param {string} texto
 * @returns {string}
 */
export const capitalizarCadaPalabra = (texto) => {
  if (!texto) return '';
  return texto
    .split(' ')
    .map(palabra => capitalizarPrimera(palabra))
    .join(' ');
};

/**
 * Oculta información sensible
 * @param {string} texto
 * @param {number} charsToShow
 * @returns {string}
 */
export const ocultarInformacion = (texto, charsToShow = 4) => {
  if (!texto) return '';
  const chars = texto.substring(0, charsToShow);
  return chars + '*'.repeat(Math.max(0, texto.length - charsToShow));
};

export default {
  formatearFecha,
  formatearHora,
  formatearFechaHora,
  truncarTexto,
  capitalizarPrimera,
  capitalizarCadaPalabra,
  ocultarInformacion,
};
