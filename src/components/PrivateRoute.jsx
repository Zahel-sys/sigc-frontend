import { Navigate } from "react-router-dom";

export default function PrivateRoute({ children, requiredRole }) {
  // Verificar autenticación: debe existir tanto token como usuario
  const token = localStorage.getItem("token");
  
  let usuario = null;
  try {
    const storedUser = localStorage.getItem("usuario");
    if (storedUser) {
      usuario = JSON.parse(storedUser);
    }
  } catch (error) {
    console.error("Error al parsear usuario desde localStorage:", error);
    localStorage.removeItem("usuario");
    localStorage.removeItem("token");
  }
  
  // Si no hay token O no hay usuario, redirigir al login
  if (!token || !usuario) {
    console.log("PrivateRoute: No autenticado (token:", !!token, "usuario:", !!usuario, "), redirigiendo a /login");
    return <Navigate to="/login" replace />;
  }

  // Log para debugging
  console.log("PrivateRoute - Usuario:", usuario.nombre, "| Rol:", usuario.rol, "| Rol requerido:", requiredRole);

  // Si se especifica un rol requerido y no coincide, redirigir según el rol del usuario
  if (requiredRole && usuario.rol !== requiredRole) {
    console.log(`PrivateRoute: Rol no coincide. Usuario es ${usuario.rol}, se requiere ${requiredRole}`);
    
    // Si es ADMIN pero intentó acceder a ruta de cliente, enviar a /admin
    if (usuario.rol === "ADMIN") {
      console.log("PrivateRoute: Redirigiendo ADMIN a /admin");
      return <Navigate to="/admin" replace />;
    }
    // Si es PACIENTE pero intentó acceder a ruta de admin, enviar a /cliente
    if (usuario.rol === "PACIENTE") {
      console.log("PrivateRoute: Redirigiendo PACIENTE a /cliente");
      return <Navigate to="/cliente" replace />;
    }
  }

  console.log("PrivateRoute: Acceso permitido ✓");
  return children;
}
