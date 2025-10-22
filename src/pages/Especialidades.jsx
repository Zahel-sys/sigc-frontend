import { useEffect, useState } from "react";
import api from "../services/api";
import EspecialidadCard from "../components/EspecialidadCard";
import NavbarCliente from "../components/NavbarCliente";

export default function Especialidades() {
  const [especialidades, setEspecialidades] = useState([]);

  useEffect(() => {
    const cargarEspecialidades = async () => {
      const res = await api.get("/especialidades");
      setEspecialidades(res.data);
    };
    cargarEspecialidades();
  }, []);

  return (
    <>
      <NavbarCliente />
      <div className="container mt-5">
        <h2 className="text-center mb-4">Especialidades Médicas</h2>
        <div className="row">
          {especialidades.map((esp) => (
            <div className="col-md-4 mb-4" key={esp.idEspecialidad}>
              <EspecialidadCard especialidad={esp} />
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
