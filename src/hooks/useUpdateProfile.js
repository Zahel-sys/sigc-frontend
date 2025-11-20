import { useState, useCallback, useEffect } from 'react';
import usersService from '../services/users/usersService';
import authService from '../services/auth/authService';
import { MESSAGES } from '../constants/messages';
import { showSuccess, showError, showWarning } from '../utils/alerts';

/**
 * Hook personalizado para actualizar perfil de usuario
 * Responsabilidad: Orquestar actualización de datos del usuario
 * 
 * @returns {Object} { usuario, loading, error, actualizar, recargar }
 */
export const useUpdateProfile = () => {
  const [usuario, setUsuario] = useState({
    nombre: '',
    email: '',
    dni: '',
    telefono: '',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const recargar = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const usuarioActual = await authService.getCurrentUser();
      if (usuarioActual) {
        setUsuario(usuarioActual);
      }
    } catch (err) {
      console.error('Error cargando usuario:', err);
      setError('No se pudo cargar tu perfil');
      if (err.response?.status === 401) {
        showWarning('Sesión expirada, por favor inicia sesión nuevamente');
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const actualizar = useCallback(
    async (datosActualizados) => {
      setLoading(true);
      setError(null);
      try {
        const resultado = await usersService.updateUser(
          usuario.idUsuario,
          datosActualizados
        );
        setUsuario(resultado);
        showSuccess('Éxito', MESSAGES.PROFILE.UPDATED);
        return true;
      } catch (err) {
        console.error('Error actualizando perfil:', err);
        const mensaje =
          err.response?.data?.message || MESSAGES.PROFILE.ERROR_UPDATE;
        setError(mensaje);
        showError('Error', mensaje);
        return false;
      } finally {
        setLoading(false);
      }
    },
    [usuario.idUsuario]
  );

  useEffect(() => {
    recargar();
  }, [recargar]);

  return {
    usuario,
    loading,
    error,
    actualizar,
    recargar,
  };
};
