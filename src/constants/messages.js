/**
 * Mensajes centralizados (Single Responsibility + DRY)
 * Todos los textos en la app en un único lugar
 */

export const MESSAGES = {
  // Auth
  AUTH: {
    LOGIN_SUCCESS: 'Inicio de sesión exitoso',
    LOGIN_ERROR: 'Credenciales inválidas. Intenta nuevamente.',
    REGISTER_SUCCESS: 'Registro exitoso. Ahora puedes iniciar sesión.',
    REGISTER_ERROR: 'Error al registrar el usuario.',
    LOGOUT_SUCCESS: 'Sesión cerrada exitosamente',
    SESSION_EXPIRED: 'Sesión expirada. Por favor, inicia sesión nuevamente.',
    INVALID_TOKEN: 'Token inválido o expirado.',
    NO_SESSION: 'No hay sesión activa. Redirigiendo al login...',
  },

  // Perfil
  PROFILE: {
    UPDATED: 'Perfil actualizado',
    UPDATE_SUCCESS: 'Tus datos se guardaron correctamente',
    UPDATE_ERROR: 'No se pudo actualizar tu perfil. Intenta nuevamente.',
    PASSWORD_CHANGE_SUCCESS: 'Contraseña actualizada',
    PASSWORD_CHANGE_MESSAGE: 'Tu contraseña se cambió correctamente. Por favor, inicia sesión nuevamente.',
    PASSWORD_CHANGE_ERROR: 'No se pudo cambiar la contraseña. Verifica tu contraseña actual.',
  },

  // Citas
  CITAS: {
    BOOKED_SUCCESS: '¡Cita reservada exitosamente!',
    BOOKED_ERROR: 'Error al crear la cita',
    CANCELLED_SUCCESS: 'Cita cancelada correctamente',
    CANCELLED_ERROR: 'Error al cancelar la cita',
    NO_CITAS: 'No tienes citas activas actualmente.',
    LOADING: 'Cargando citas...',
  },

  // Doctores
  DOCTORS: {
    CREATED: 'Doctor registrado correctamente',
    UPDATED: 'Doctor actualizado correctamente',
    DELETED: 'Doctor eliminado correctamente',
    ERROR_SAVE: 'Error al guardar el doctor',
    ERROR_DELETE: 'Error al eliminar doctor',
  },

  // Especialidades
  ESPECIALIDADES: {
    CREATED: 'Especialidad creada correctamente',
    UPDATED: 'Especialidad actualizada correctamente',
    DELETED: 'Especialidad eliminada correctamente',
    ERROR_SAVE: 'No se pudo guardar.',
    ERROR_DELETE: 'No se pudo eliminar.',
  },

  // Horarios
  HORARIOS: {
    CREATED: 'Horario creado correctamente',
    UPDATED: 'Horario actualizado correctamente',
    DELETED: 'Horario eliminado correctamente',
    LOADING: 'Cargando horarios...',
    NO_AVAILABLE: 'No hay horarios disponibles para este doctor',
  },

  // Validación
  VALIDATION: {
    REQUIRED: 'Este campo es requerido',
    INVALID_EMAIL: 'El correo ingresado no es válido.',
    INVALID_DNI: 'El DNI debe contener exactamente 8 dígitos numéricos.',
    INVALID_PHONE: 'El número telefónico debe contener 9 dígitos.',
    PASSWORD_MIN_LENGTH: 'La contraseña debe tener al menos 6 caracteres',
    PASSWORD_NO_MATCH: 'Las contraseñas no coinciden',
    PASSWORD_SAME: 'La nueva contraseña debe ser diferente a la actual',
    CURRENT_PASSWORD_REQUIRED: 'Ingresa tu contraseña actual',
    NEW_PASSWORD_REQUIRED: 'Ingresa una nueva contraseña',
    ALL_FIELDS_REQUIRED: 'Por favor completa todos los campos.',
  },

  // General
  GENERAL: {
    LOADING: 'Cargando...',
    ERROR: 'Ha ocurrido un error',
    SUCCESS: 'Éxito',
    CONFIRM: '¿Estás seguro?',
    DELETE_CONFIRM: '¿Eliminar este elemento?',
    SAVE: 'Guardar',
    CANCEL: 'Cancelar',
    DELETE: 'Eliminar',
    EDIT: 'Editar',
  },

  // Errores específicos
  ERRORS: {
    FETCH_ERROR: 'No se pudieron cargar los datos. Verifica tu conexión.',
    PROFILE_LOAD_ERROR: 'No se pudo cargar tu perfil. Verifica tu conexión o contacta al administrador.',
    CONNECTION_ERROR: 'Error de conexión. Intenta nuevamente.',
    SERVER_ERROR: 'Error del servidor. Intenta más tarde.',
  },
};

export default MESSAGES;
