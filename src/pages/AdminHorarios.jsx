import { useState } from "react";
import AdminLayout from "../layouts/AdminLayout";
import { useHorariosAdmin } from "../hooks/admin";
import { THEME } from "../config/theme";

/**
 * Página Admin Gestión de Horarios
 * Responsabilidad: Orquestar formulario y tabla de horarios
 * MIGRADO: Usa hook consolidado useHorariosAdmin
 */
export default function AdminHorarios() {
  const { horarios, doctores, loading, guardarHorario, eliminarHorario } = useHorariosAdmin();

  const [editando, setEditando] = useState(null);
  const [formData, setFormData] = useState({
    fecha: "",
    turno: "",
    horaInicio: "",
    horaFin: "",
    doctor: { idDoctor: "" }
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleChangeTurno = (e) => {
    setFormData(prev => ({ ...prev, turno: e.target.value }));
  };

  const handleChangeDoctor = (e) => {
    setFormData(prev => ({
      ...prev,
      doctor: { idDoctor: e.target.value }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log('📋 Datos del formulario antes de guardar:', formData);

    // Validación mejorada del doctor
    const idDoctor = formData.doctor?.idDoctor;
    if (!formData.fecha || !formData.turno || !formData.horaInicio || !formData.horaFin || !idDoctor || idDoctor === "" || idDoctor === "0") {
      alert("Por favor completa todos los campos");
      return;
    }

    const success = await guardarHorario(formData, editando);

    if (success) {
      setFormData({
        fecha: "",
        turno: "",
        horaInicio: "",
        horaFin: "",
        doctor: { idDoctor: "" }
      });
      setEditando(null);
    }
  };

  const handleEditar = (horario) => {
    setFormData({
      fecha: horario.fecha,
      turno: horario.turno,
      horaInicio: horario.horaInicio,
      horaFin: horario.horaFin,
      doctor: { idDoctor: horario.doctor.idDoctor }
    });
    setEditando(horario.idHorario);
  };

  const handleCancelar = () => {
    setFormData({
      fecha: "",
      turno: "",
      horaInicio: "",
      horaFin: "",
      doctor: { idDoctor: "" }
    });
    setEditando(null);
  };

  const formatearFecha = (fecha) => {
    const opciones = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(fecha).toLocaleDateString('es-ES', opciones);
  };

  return (
    <AdminLayout>
      <div className="container-fluid py-4">
        <h3 className="mb-4" style={{ color: THEME.primary.main, fontWeight: "600" }}>
          <i className="fas fa-calendar-alt me-2"></i>Gestión de Horarios
        </h3>

        {/* FORMULARIO */}
        <form onSubmit={handleSubmit} className="mb-4" style={{
          backgroundColor: THEME.gray[50],
          padding: "1.5rem",
          borderRadius: THEME.borderRadius.lg,
          border: `1px solid ${THEME.gray[200]}`
        }}>
          <div className="row g-3">
            <div className="col-md-2">
              <label className="form-label fw-bold">Fecha</label>
              <input
                type="date"
                name="fecha"
                className="form-control"
                value={formData.fecha}
                onChange={handleChange}
                style={{
                  border: `2px solid ${THEME.gray[300]}`,
                  borderRadius: THEME.borderRadius.md
                }}
                required
              />
            </div>

            <div className="col-md-2">
              <label className="form-label fw-bold">Turno</label>
              <select
                className="form-select"
                value={formData.turno}
                onChange={handleChangeTurno}
                style={{
                  border: `2px solid ${THEME.gray[300]}`,
                  borderRadius: THEME.borderRadius.md
                }}
                required
              >
                <option value="">Seleccionar</option>
                <option value="MAÑANA">Mañana</option>
                <option value="TARDE">Tarde</option>
                <option value="NOCHE">Noche</option>
              </select>
            </div>

            <div className="col-md-2">
              <label className="form-label fw-bold">Hora Inicio</label>
              <input
                type="time"
                name="horaInicio"
                className="form-control"
                value={formData.horaInicio}
                onChange={handleChange}
                style={{
                  border: `2px solid ${THEME.gray[300]}`,
                  borderRadius: THEME.borderRadius.md
                }}
                required
              />
            </div>

            <div className="col-md-2">
              <label className="form-label fw-bold">Hora Fin</label>
              <input
                type="time"
                name="horaFin"
                className="form-control"
                value={formData.horaFin}
                onChange={handleChange}
                style={{
                  border: `2px solid ${THEME.gray[300]}`,
                  borderRadius: THEME.borderRadius.md
                }}
                required
              />
            </div>

            <div className="col-md-3">
              <label className="form-label fw-bold">Doctor</label>
              <select
                className="form-select"
                value={formData.doctor.idDoctor}
                onChange={handleChangeDoctor}
                style={{
                  border: `2px solid ${THEME.gray[300]}`,
                  borderRadius: THEME.borderRadius.md
                }}
                required
              >
                <option value="">Seleccionar doctor</option>
                {doctores.map((d) => (
                  <option key={d.idDoctor} value={d.idDoctor}>
                    {d.nombre} ({d.especialidad})
                  </option>
                ))}
              </select>
            </div>

            <div className="col-md-1 d-flex gap-2">
              <button
                type="submit"
                className="btn w-100"
                style={{
                  background: THEME.primary.gradient,
                  color: "white",
                  border: "none",
                  borderRadius: THEME.borderRadius.md,
                  fontWeight: "600",
                  marginTop: "auto"
                }}
              >
                {editando ? "Actualizar" : "Agregar"}
              </button>

              {editando && (
                <button
                  type="button"
                  onClick={handleCancelar}
                  className="btn w-100"
                  style={{
                    background: THEME.gray[400],
                    color: "white",
                    border: "none",
                    borderRadius: THEME.borderRadius.md,
                    fontWeight: "600",
                    marginTop: "auto"
                  }}
                >
                  Cancelar
                </button>
              )}
            </div>
          </div>
        </form>

        {/* CARGANDO */}
        {loading && (
          <div className="alert alert-info">
            <div className="spinner-border spinner-border-sm me-2" role="status">
              <span className="visually-hidden">Cargando...</span>
            </div>
            Cargando horarios...
          </div>
        )}

        {/* TABLA */}
        {!loading && (
          <div className="table-responsive">
            <table className="table table-striped table-hover align-middle">
              <thead style={{ background: THEME.primary.gradient, color: "white" }}>
                <tr>
                  <th>#</th>
                  <th>Fecha</th>
                  <th>Turno</th>
                  <th>Inicio</th>
                  <th>Fin</th>
                  <th>Doctor</th>
                  <th style={{ width: "150px" }}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {horarios.map((h, index) => (
                  <tr key={h.idHorario} style={{ borderBottom: `1px solid ${THEME.gray[200]}` }}>
                    <td style={{ fontWeight: "600" }}>{index + 1}</td>
                    <td>{formatearFecha(h.fecha)}</td>
                    <td>
                      <span
                        className="badge"
                        style={{
                          backgroundColor: h.turno === "MAÑANA"
                            ? THEME.info.main
                            : h.turno === "TARDE"
                            ? THEME.warning.main
                            : THEME.secondary.main
                        }}
                      >
                        {h.turno}
                      </span>
                    </td>
                    <td>{h.horaInicio}</td>
                    <td>{h.horaFin}</td>
                    <td>
                      <strong style={{ color: THEME.primary.main }}>
                        {h.doctor?.nombre}
                      </strong>
                      <br />
                      <small className="text-muted">{h.doctor?.especialidad}</small>
                    </td>
                    <td>
                      <div className="d-flex gap-2">
                        <button
                          className="btn btn-sm"
                          style={{
                            background: THEME.info.main,
                            color: "white",
                            border: "none",
                            borderRadius: THEME.borderRadius.md,
                            flex: 1
                          }}
                          onClick={() => handleEditar(h)}
                        >
                          <i className="fas fa-edit me-1"></i>Editar
                        </button>
                        <button
                          className="btn btn-sm"
                          style={{
                            background: THEME.danger.main,
                            color: "white",
                            border: "none",
                            borderRadius: THEME.borderRadius.md,
                            flex: 1
                          }}
                          onClick={() => eliminarHorario(h.idHorario)}
                        >
                          <i className="fas fa-trash me-1"></i>Eliminar
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
