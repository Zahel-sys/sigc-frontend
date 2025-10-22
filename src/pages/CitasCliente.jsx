import NavbarCliente from "../components/NavbarCliente";

export default function CitaConfirmada() {
  return (
    <>
      <NavbarCliente />
      <div className="container mt-5 text-center">
        <h2 className="text-success mb-3">✅ Cita Agendada</h2>
        <p>Tu cita ha sido registrada correctamente.</p>
        <a href="/cliente/citas" className="btn btn-primary mt-3">
          Ver mis citas
        </a>
      </div>
    </>
  );
}
