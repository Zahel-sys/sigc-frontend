import ClienteLayout from "../layouts/ClienteLayout";

export default function DashboardCliente() {
  return (
    <ClienteLayout>
      <h3>Bienvenido al Sistema de Gestión de Citas</h3>
      <p>Desde este panel puedes:</p>
      <ul>
        <li>Ver tus citas registradas.</li>
        <li>Explorar especialidades y agendar nuevas citas.</li>
        <li>Actualizar tu información personal.</li>
      </ul>
    </ClienteLayout>
  );
}
