import { useEffect, useState, useCallback } from "react";
import api from "../services/api";

/**
 * Hook para gestionar el dashboard del administrador
 * Responsabilidad: Centralizamos la obtención de datos estadísticos
 */
export function useGestionAdminDashboard() {
  const [resumen, setResumen] = useState({
    doctores: 0,
    especialidades: 0,
    citas: 0,
  });
  const [loading, setLoading] = useState(true);

  const cargarDatos = useCallback(async () => {
    try {
      setLoading(true);
      const [resDoc, resEsp, resCitas] = await Promise.all([
        api.get("/doctores"),
        api.get("/especialidades"),
        api.get("/citas"),
      ]);
      
      setResumen({
        doctores: resDoc.data.length,
        especialidades: resEsp.data.length,
        citas: resCitas.data.length,
      });
    } catch (error) {
      console.error("Error al cargar datos del dashboard admin:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    cargarDatos();
  }, [cargarDatos]);

  return { resumen, loading, cargarDatos };
}
