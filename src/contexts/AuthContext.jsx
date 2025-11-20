import React, { createContext } from "react";

/**
 * AuthContext - Contexto centralizado de autenticación
 * RESPONSABILIDAD ÚNICA: Definir la estructura del contexto
 * El provider con lógica está en AuthProvider.jsx (SRP)
 */
export const AuthContext = createContext();
