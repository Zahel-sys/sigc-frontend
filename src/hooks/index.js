/**
 * Índice de Custom Hooks
 * Exporta todos los hooks personalizados
 */

// Hooks de Usuario
export { useAuth } from './useAuth';
export { useCurrentUser } from './useCurrentUser';

// Hooks de Datos
export { useDoctores } from './useDoctores';
export { useEspecialidades } from './useEspecialidades';
export { useCitas } from './useCitas';
export { useHorarios } from './useHorarios';

// Hooks de Formulario
export { useFormData } from './useFormData';

// Hooks Admin
export { useDoctoresAdmin } from './admin/useDoctoresAdmin';
export { useEspecialidadesAdmin } from './admin/useEspecialidadesAdmin';
export { useHorariosAdmin } from './admin/useHorariosAdmin';
