/**
 * Hook personalizado: useAuth
 * Encapsula toda la lógica de autenticación (SRP)
 * Separa la lógica de autenticación del renderizado
 */

import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../services/auth/authService';
import { MESSAGES } from '../constants/messages';
import { showError, showSuccess } from '../utils/alerts';

export const useAuth = () => {
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Verificar si está autenticado al cargar
  useEffect(() => {
    const checkAuth = () => {
      const token = authService.getToken();
      const storedUser = authService.getStoredUser();
      if (token && storedUser) {
        setUsuario(storedUser);
        setError(null);
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  // Login
  const login = useCallback(async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const data = await authService.login(email, password);
      // Backend devuelve: { token: string, usuario: {...} }
      authService.saveUser(data);
      setUsuario(data.usuario); // Guardar solo el usuario en el estado
      showSuccess(MESSAGES.AUTH.LOGIN_SUCCESS);
      return true; // Mantener compatibilidad con componente Login
    } catch (err) {
      const message = err.response?.data?.message || MESSAGES.AUTH.LOGIN_ERROR;
      setError(message);
      showError(message);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  // Register
  const register = useCallback(async (userData) => {
    setLoading(true);
    setError(null);
    try {
      await authService.register(userData);
      showSuccess(MESSAGES.AUTH.REGISTER_SUCCESS);
      return { success: true };
    } catch (err) {
      const message = err.response?.data?.message || MESSAGES.AUTH.REGISTER_ERROR;
      setError(message);
      showError(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  }, []);

  // Logout
  const logout = useCallback(() => {
    authService.logout();
    setUsuario(null);
    setError(null);
    showSuccess(MESSAGES.AUTH.LOGOUT_SUCCESS);
    navigate('/login');
  }, [navigate]);

  // Cambiar contraseña
  const changePassword = useCallback(async (passwordData) => {
    setLoading(true);
    setError(null);
    try {
      await authService.changePassword(passwordData);
      showSuccess(MESSAGES.PROFILE.PASSWORD_CHANGE_SUCCESS);
      return { success: true };
    } catch (err) {
      const message = err.response?.data?.message || MESSAGES.PROFILE.PASSWORD_CHANGE_ERROR;
      setError(message);
      showError(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    usuario,
    loading,
    error,
    login,
    register,
    logout,
    changePassword,
    isAuthenticated: !!usuario,
  };
};

export default useAuth;
