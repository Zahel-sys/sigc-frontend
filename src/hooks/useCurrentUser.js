/**
 * Hook personalizado: useCurrentUser
 * Obtiene el usuario autenticado actual de forma centralizada (SRP)
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../services/auth/authService';
import { MESSAGES } from '../constants/messages';
import { showError, showWarning } from '../utils/alerts';

export const useCurrentUser = () => {
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsuario = async () => {
      try {
        const storedUser = authService.getStoredUser();
        const token = storedUser?.token;

        if (!token) {
          showWarning(MESSAGES.AUTH.NO_SESSION);
          navigate('/login');
          return;
        }

        // Fetch usuario actual del backend
        const response = await fetch('/auth/me', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status === 401) {
          showError(MESSAGES.AUTH.SESSION_EXPIRED);
          authService.logout();
          navigate('/login');
          return;
        }

        if (!response.ok) {
          throw new Error(MESSAGES.ERRORS.PROFILE_LOAD_ERROR);
        }

        const data = await response.json();
        setUsuario(data);
        setError(null);
      } catch (err) {
        console.error('Error al cargar usuario:', err);
        setError(err.message || MESSAGES.ERRORS.PROFILE_LOAD_ERROR);
      } finally {
        setLoading(false);
      }
    };

    fetchUsuario();
  }, [navigate]);

  return { usuario, loading, error };
};

export default useCurrentUser;
