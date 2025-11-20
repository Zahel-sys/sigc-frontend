import ClienteLayout from "../layouts/ClienteLayout";
import { useCitasCliente } from "../hooks/useCitasCliente";
import { THEME } from "../config/theme";

/**
 * Página Mis Citas - Mostrar y cancelar citas del cliente
 * Responsabilidad: Orquestar visualización y cancelación de citas
 */
export default function CitasCliente() {
  const { citas, loading, error, cancelarCita } = useCitasCliente();

  const formatearFecha = (fecha) => {
    const opciones = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(fecha).toLocaleDateString('es-ES', opciones);
  };

  return (
    <ClienteLayout>
      <div className="container-fluid py-4">
        <h3 className="mb-4" style={{ color: THEME.primary.main, fontWeight: "600" }}>
          <i className="fas fa-calendar me-2"></i>Mis Citas
        </h3>

        {/* CARGANDO */}
        {loading && (
          <div className="alert alert-info" role="alert">
            <div className="spinner-border spinner-border-sm me-2" role="status">
              <span className="visually-hidden">Cargando...</span>
            </div>
            Cargando tus citas...
          </div>
        )}

        {/* ERROR */}
        {!loading && error && (
          <div className="alert alert-danger" role="alert">
            ⚠️ {error}
          </div>
        )}

        {/* SIN CITAS */}
        {!loading && !error && citas.length === 0 && (
          <div className="alert alert-warning" role="alert">
            📅 No tienes citas registradas
          </div>
        )}

        {/* TABLA DE CITAS */}
        {!loading && !error && citas.length > 0 && (
          <div className="table-responsive">
            <table 
              className="table table-striped align-middle text-center"
              style={{ borderRadius: THEME.borderRadius.lg, overflow: "hidden" }}
            >
              <thead style={{ background: THEME.primary.gradient, color: "white" }}>
                <tr>
                  <th>#</th>
                  <th>Doctor</th>
                  <th>Especialidad</th>
                  <th>Fecha</th>
                  <th>Hora</th>
                  <th>Estado</th>
                  <th>Acción</th>
                </tr>
              </thead>
              <tbody>
                {citas.map((cita, index) => (
                  <tr key={cita.idCita} style={{ borderBottom: `1px solid ${THEME.gray[200]}` }}>
                    <td style={{ fontWeight: "600" }}>{index + 1}</td>
                    <td>{cita.doctor?.nombre || "N/A"}</td>
                    <td>{cita.doctor?.especialidad || "N/A"}</td>
                    <td>{formatearFecha(cita.fechaCita)}</td>
                    <td>{cita.horaCita}</td>
                    <td>
                      <span
                        className="badge"
                        style={{
                          backgroundColor: cita.estado === "ACTIVA"
                            ? THEME.success.main
                            : cita.estado === "CANCELADA"
                            ? THEME.danger.main
                            : THEME.warning.main
                        }}
                      >
                        {cita.estado}
                      </span>
                    </td>
                    <td>
                      {cita.estado === "ACTIVA" ? (
                        <button
                          className="btn btn-sm"
                          style={{
                            background: THEME.danger.main,
                            color: "white",
                            border: "none",
                            borderRadius: THEME.borderRadius.md,
                            padding: "0.5rem 1rem",
                            fontWeight: "500",
                            cursor: "pointer",
                            transition: "all 0.3s ease"
                          }}
                          onClick={() => cancelarCita(cita.idCita)}
                          onMouseEnter={(e) => {
                            e.target.style.background = THEME.danger.dark;
                            e.target.style.transform = "scale(1.05)";
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.background = THEME.danger.main;
                            e.target.style.transform = "scale(1)";
                          }}
                        >
                          <i className="fas fa-times me-1"></i>
                          Cancelar
                        </button>
                      ) : (
                        <span className="text-muted small">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </ClienteLayout>
  );
}
