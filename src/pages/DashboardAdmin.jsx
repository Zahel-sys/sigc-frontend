import AdminLayout from "../layouts/AdminLayout";
import { useEffect, useState } from "react";
import api from "../services/api";

export default function DashboardAdmin() {
  const [resumen, setResumen] = useState({
    doctores: 0,
    especialidades: 0,
    citas: 0,
  });

  useEffect(() => {
    const cargarDatos = async () => {
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
    };
    cargarDatos();
  }, []);

  return (
    <AdminLayout>
      <h3 className="mb-4">Resumen General</h3>
      <div style={{ display: "flex", gap: "-8px", width: "100%" }}>
        <div style={{ width: "23%", marginRight: "-8px" }}>
          <div className="card text-center shadow-sm">
            <div className="card-body p-2">
              <h4 className="mb-1">{resumen.doctores}</h4>
              <p className="text-muted mb-0 small">Doctores Registrados</p>
            </div>
          </div>
        </div>
        <div style={{ width: "23%", marginRight: "-8px" }}>
          <div className="card text-center shadow-sm">
            <div className="card-body p-2">
              <h4 className="mb-1">{resumen.especialidades}</h4>
              <p className="text-muted mb-0 small">Especialidades</p>
            </div>
          </div>
        </div>
        <div style={{ width: "23%" }}>
          <div className="card text-center shadow-sm">
            <div className="card-body p-2">
              <h4 className="mb-1">{resumen.citas}</h4>
              <p className="text-muted mb-0 small">Citas Totales</p>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
