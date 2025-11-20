import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

/**
 * Hook para gestionar el dashboard del cliente
 * Responsabilidad: Centralizar obtención de datos del usuario y citas
 */
export function useClienteDashboard() {
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState(null);
  const [citas, setCitas] = useState([]);
  const [loading, setLoading] = useState(true);

  const cargarDatos = useCallback(async () => {
    try {
      setLoading(true);
      const usuarioGuardado = JSON.parse(localStorage.getItem("usuario"));
      const token = usuarioGuardado?.token;

      if (!token) {
        navigate("/login");
        return;
      }

      // Obtener datos del usuario autenticado
      const resUsuario = await api.get("/auth/me", {
        headers: { Authorization: `Bearer ${token}` }
      });

      setUsuario(resUsuario.data);

      // Cargar citas del usuario
      try {
        const resCitas = await api.get(`/citas/usuario/${resUsuario.data.idUsuario}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setCitas(Array.isArray(resCitas.data) ? resCitas.data : []);
      } catch (err) {
        console.warn("No se pudieron cargar las citas:", err.message);
        setCitas([]);
      }
    } catch (err) {
      console.error("Error al cargar datos del dashboard:", err);

      if (err.response?.status === 401) {
        localStorage.clear();
        navigate("/login");
      } else {
        // Fallback: usar datos del localStorage
        const usuarioGuardado = JSON.parse(localStorage.getItem("usuario"));
        if (usuarioGuardado) {
          setUsuario({
            nombre: "Usuario",
            email: usuarioGuardado?.email || "Sin email",
            rol: usuarioGuardado?.rol || "PACIENTE",
            dni: "No disponible",
            telefono: "No disponible"
          });
        }
      }
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    cargarDatos();
  }, [cargarDatos]);

  // Filtrar citas activas
  const citasActivas = Array.isArray(citas) ? citas.filter((c) => c.estado === "ACTIVA") : [];

  return { usuario, citas, citasActivas, loading, cargarDatos };
}
