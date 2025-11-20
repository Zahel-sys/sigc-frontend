import React, { createContext, useReducer, useCallback } from "react";
import authService from "../services/auth/authService";

/**
 * AuthContext - Gestión centralizada de autenticación
 * Responsabilidad: Mantener estado global de usuario autenticado
 * Patrón: useReducer para mejor control de estado complejo
 */
export const AuthContext = createContext();

const initialState = {
  usuario: JSON.parse(localStorage.getItem("usuario")) || null,
  token: localStorage.getItem("token") || null,
  isAuthenticated: !!localStorage.getItem("token"),
  loading: false,
  error: null,
  rol: localStorage.getItem("rol") || null
};

function authReducer(state, action) {
  switch (action.type) {
    case "LOGIN_START":
      return { ...state, loading: true, error: null };
    case "LOGIN_SUCCESS":
      return {
        ...state,
        usuario: action.payload.usuario,
        token: action.payload.token,
        rol: action.payload.rol,
        isAuthenticated: true,
        loading: false,
        error: null
      };
    case "LOGIN_ERROR":
      return { ...state, loading: false, error: action.payload };
    case "LOGOUT":
      return {
        usuario: null,
        token: null,
        isAuthenticated: false,
        loading: false,
        error: null,
        rol: null
      };
    case "UPDATE_USER":
      return { ...state, usuario: action.payload };
    case "CLEAR_ERROR":
      return { ...state, error: null };
    default:
      return state;
  }
}

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  const login = useCallback(async (correo, contraseña) => {
    dispatch({ type: "LOGIN_START" });
    try {
      const response = await authService.login(correo, contraseña);
      const { usuario, token, rol } = response;

      // Persiste en localStorage
      localStorage.setItem("usuario", JSON.stringify(usuario));
      localStorage.setItem("token", token);
      localStorage.setItem("rol", rol);

      dispatch({
        type: "LOGIN_SUCCESS",
        payload: { usuario, token, rol }
      });

      return response;
    } catch (error) {
      const errorMsg = error.response?.data?.mensaje || "Error en login";
      dispatch({ type: "LOGIN_ERROR", payload: errorMsg });
      throw error;
    }
  }, []);

  const register = useCallback(async (userData) => {
    dispatch({ type: "LOGIN_START" });
    try {
      const response = await authService.register(userData);
      const { usuario, token, rol } = response;

      localStorage.setItem("usuario", JSON.stringify(usuario));
      localStorage.setItem("token", token);
      localStorage.setItem("rol", rol);

      dispatch({
        type: "LOGIN_SUCCESS",
        payload: { usuario, token, rol }
      });

      return response;
    } catch (error) {
      const errorMsg = error.response?.data?.mensaje || "Error en registro";
      dispatch({ type: "LOGIN_ERROR", payload: errorMsg });
      throw error;
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("usuario");
    localStorage.removeItem("token");
    localStorage.removeItem("rol");
    dispatch({ type: "LOGOUT" });
  }, []);

  const updateUser = useCallback((usuario) => {
    localStorage.setItem("usuario", JSON.stringify(usuario));
    dispatch({ type: "UPDATE_USER", payload: usuario });
  }, []);

  const clearError = useCallback(() => {
    dispatch({ type: "CLEAR_ERROR" });
  }, []);

  const value = {
    ...state,
    login,
    register,
    logout,
    updateUser,
    clearError
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
