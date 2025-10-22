import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import DashboardAdmin from "./pages/DashboardAdmin";
import DashboardCliente from "./pages/DashboardCliente";
import CitasCliente from "./pages/CitasCliente";
import Especialidades from "./pages/Especialidades";
import Turnos from "./pages/Turnos";
import CitaConfirmada from "./pages/CitaConfirmada";
import AdminEspecialidades from "./pages/AdminEspecialidades";
import AdminDoctores from "./pages/AdminDoctores"; // 👈 nuevo import
import PrivateRoute from "./components/PrivateRoute";

function App() {
  return (
    <Router>
      <Routes>
        {/* Página de Login */}
        <Route path="/" element={<Login />} />

        {/* Panel del Administrador */}
        <Route
          path="/admin"
          element={
            <PrivateRoute>
              <DashboardAdmin />
            </PrivateRoute>
          }
        />

        {/* CRUD de Especialidades del Administrador */}
        <Route
          path="/admin/especialidades"
          element={
            <PrivateRoute>
              <AdminEspecialidades />
            </PrivateRoute>
          }
        />

        {/* CRUD de Doctores del Administrador */}
        <Route
          path="/admin/doctores"
          element={
            <PrivateRoute>
              <AdminDoctores />
            </PrivateRoute>
          }
        />

        {/* Panel del Cliente */}
        <Route
          path="/cliente"
          element={
            <PrivateRoute>
              <DashboardCliente />
            </PrivateRoute>
          }
        />

        {/* Gestión de Citas del Cliente */}
        <Route
          path="/cliente/citas"
          element={
            <PrivateRoute>
              <CitasCliente />
            </PrivateRoute>
          }
        />

        {/* Catálogo de Especialidades (visible para todos los clientes) */}
        <Route path="/especialidades" element={<Especialidades />} />

        {/* Página de turnos disponibles (filtrados por especialidad) */}
        <Route path="/turnos/:idEspecialidad" element={<Turnos />} />

        {/* Confirmación de cita */}
        <Route path="/cita-confirmada" element={<CitaConfirmada />} />
      </Routes>
    </Router>
  );
}

export default App;
