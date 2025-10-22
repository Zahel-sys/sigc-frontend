import { Link } from "react-router-dom";

export default function DashboardCliente() {
  return (
    <div className="container mt-5">
      <h2>Panel del Cliente</h2>
      <p>Bienvenido, Cliente. Aquí puedes gestionar tus citas.</p>
      <Link to="/cliente/citas" className="btn btn-primary mt-3">
        Ir a mis citas
      </Link>
      <Link to="/especialidades" className="btn btn-primary mt-3">
  Ver especialidades disponibles
</Link>
    </div>
  );
}
