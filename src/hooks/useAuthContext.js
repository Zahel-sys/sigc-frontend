import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";

/**
 * useAuthContext - Hook para acceder al contexto de autenticación
 * Responsabilidad: Proporcionar acceso simplificado al estado y acciones de auth
 */
export function useAuthContext() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuthContext debe ser usado dentro de AuthProvider");
  }

  return context;
}
