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
      <div className="row">
        <div className="col-md-4 mb-3">
          <div className="card text-center shadow-sm">
            <div className="card-body">
              <h4>{resumen.doctores}</h4>
              <p className="text-muted">Doctores Registrados</p>
            </div>
          </div>
        </div>
        <div className="col-md-4 mb-3">
          <div className="card text-center shadow-sm">
            <div className="card-body">
              <h4>{resumen.especialidades}</h4>
              <p className="text-muted">Especialidades</p>
            </div>
          </div>
        </div>
        <div className="col-md-4 mb-3">
          <div className="card text-center shadow-sm">
            <div className="card-body">
              <h4>{resumen.citas}</h4>
              <p className="text-muted">Citas Totales</p>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
