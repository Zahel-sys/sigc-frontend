/**
 * Barrel exports para hooks administrativos consolidados
 * 
 * Estos hooks unifican la lógica de gestión de entidades administrativas,
 * eliminando duplicación y proporcionando una API consistente.
 * 
 * Uso recomendado:
 * import { useDoctoresAdmin, useEspecialidadesAdmin } from '../hooks/admin';
 */

// ✅ Hooks consolidados (RECOMENDADOS)
export { useDoctoresAdmin } from './useDoctoresAdminConsolidated';
export { useEspecialidadesAdmin } from './useEspecialidadesAdminConsolidated';
export { useHorariosAdmin } from './useHorariosAdminConsolidated';

// ⚠️ DEPRECATED: Mantener por compatibilidad temporal
// TODO: Eliminar en próxima versión major (v2.0.0)
export { useDoctoresAdmin as useDoctoresAdminOld } from './useDoctoresAdmin';
export { useEspecialidadesAdmin as useEspecialidadesAdminOld } from './useEspecialidadesAdmin';
export { useHorariosAdmin as useHorariosAdminOld } from './useHorariosAdmin';
