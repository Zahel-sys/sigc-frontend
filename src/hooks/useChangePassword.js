import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../services/auth/authService';
import { MESSAGES } from '../constants/messages';
import { validarContraseña } from '../utils/validators';
import { showSuccess, showError, showWarning } from '../utils/alerts';

/**
 * Hook personalizado para cambiar contraseña
 * Responsabilidad: Orquestar el cambio de contraseña
 * 
 * @returns {Object} { changePassword, loading, error }
 */
export const useChangePassword = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const changePassword = useCallback(async (passwordActual, passwordNueva, passwordConfirmar) => {
    setLoading(true);
    setError(null);

    // Validaciones básicas
    if (!passwordActual.trim()) {
      const mensaje = MESSAGES.VALIDATION.PASSWORD_REQUIRED;
      setError(mensaje);
      showWarning(mensaje);
      setLoading(false);
      return false;
    }

    if (!passwordNueva.trim()) {
      const mensaje = MESSAGES.VALIDATION.PASSWORD_REQUIRED;
      setError(mensaje);
      showWarning(mensaje);
      setLoading(false);
      return false;
    }

    if (!validarContraseña(passwordNueva)) {
      const mensaje = MESSAGES.VALIDATION.PASSWORD_WEAK;
      setError(mensaje);
      showError('Contraseña débil', mensaje);
      setLoading(false);
      return false;
    }

    if (passwordNueva !== passwordConfirmar) {
      const mensaje = MESSAGES.VALIDATION.PASSWORD_MISMATCH;
      setError(mensaje);
      showWarning(mensaje);
      setLoading(false);
      return false;
    }

    if (passwordActual === passwordNueva) {
      const mensaje = MESSAGES.VALIDATION.PASSWORD_SAME;
      setError(mensaje);
      showWarning(mensaje);
      setLoading(false);
      return false;
    }

    try {
      await authService.changePassword(
        passwordActual,
        passwordNueva,
        passwordConfirmar
      );

      showSuccess(
        'Contraseña actualizada',
        'Por favor, inicia sesión nuevamente con tu nueva contraseña'
      );

      // Limpiar localStorage y redirigir
      setTimeout(() => {
        localStorage.clear();
        navigate('/login');
      }, 2000);

      return true;
    } catch (err) {
      console.error('Error cambiando contraseña:', err);
      const mensaje =
        err.response?.data?.message ||
        MESSAGES.PROFILE.ERROR_PASSWORD_CHANGE;
      setError(mensaje);
      showError('Error', mensaje);
      return false;
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  return {
    changePassword,
    loading,
    error,
  };
};
