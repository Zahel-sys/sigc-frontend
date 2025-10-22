import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";
import NavbarCliente from "../components/NavbarCliente";

export default function Turnos() {
  const { idEspecialidad } = useParams();
  const navigate = useNavigate();
  const [horarios, setHorarios] = useState([]);

  useEffect(() => {
    const cargarHorarios = async () => {
      const res = await api.get("/horarios");
      setHorarios(res.data);
    };
    cargarHorarios();
  }, []);

  const agendarCita = (idHorario) => {
    // Aquí podrías llamar a /api/citas cuando esté implementado
    navigate("/cita-confirmada");
  };

  return (
    <>
      <NavbarCliente />
      <div className="container mt-5">
        <h3 className="text-center mb-4">Turnos disponibles</h3>
        <div className="row">
          {horarios.map((h) => (
            <div className="col-md-4 mb-4" key={h.idHorario}>
              <div className="card p-3 shadow-sm">
                <h5 className="text-primary">{h.turno}</h5>
                <p>
                  Fecha: {h.fecha} <br />
                  Hora: {h.horaInicio} - {h.horaFin}
                </p>
                <button
                  className="btn btn-success w-100"
                  onClick={() => agendarCita(h.idHorario)}
                >
                  Agendar
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
