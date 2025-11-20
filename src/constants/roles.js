/**
 * Constantes de roles y permisos
 */

export const ROLES = {
  ADMIN: 'ADMIN',
  PACIENTE: 'PACIENTE',
};

export const ROLE_ROUTES = {
  [ROLES.ADMIN]: ['/admin', '/admin/doctores', '/admin/especialidades', '/admin/horarios'],
  [ROLES.PACIENTE]: ['/cliente', '/cliente/citas', '/cliente/perfil', '/especialidades'],
};

export const ROLE_NAMES = {
  [ROLES.ADMIN]: 'Administrador',
  [ROLES.PACIENTE]: 'Paciente',
};

export default {
  ROLES,
  ROLE_ROUTES,
  ROLE_NAMES,
};
