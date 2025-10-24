import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import DashboardAdmin from "./pages/DashboardAdmin";
import DashboardCliente from "./pages/DashboardCliente";
import CitasCliente from "./pages/CitasCliente";
import PerfilCliente from "./pages/PerfilCliente";
import Especialidades from "./pages/Especialidades";
import Turnos from "./pages/Turnos";
import CitaConfirmada from "./pages/CitaConfirmada";
import AdminEspecialidades from "./pages/AdminEspecialidades";
import AdminDoctores from "./pages/AdminDoctores";
import AdminHorarios from "./pages/AdminHorarios";
import Registrar from "./pages/Registrar";
import Home from "./pages/Home";
import PrivateRoute from "./components/PrivateRoute";

function App() {
  return (
    <Router>
      <Routes>
        {/* Ruta raíz - redirige al login */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Página de inicio */}
        <Route path="/inicio" element={<Home />} />

        {/* Login */}
        <Route path="/login" element={<Login />} />

        {/* Registro */}
        <Route path="/registrar" element={<Registrar />} />

        {/* Panel del Administrador */}
        <Route
          path="/admin"
          element={
            <PrivateRoute requiredRole="ADMIN">
              <DashboardAdmin />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/especialidades"
          element={
            <PrivateRoute requiredRole="ADMIN">
              <AdminEspecialidades />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/doctores"
          element={
            <PrivateRoute requiredRole="ADMIN">
              <AdminDoctores />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/horarios"
          element={
            <PrivateRoute requiredRole="ADMIN">
              <AdminHorarios />
            </PrivateRoute>
          }
        />

        {/* Panel del Cliente */}
        <Route
          path="/cliente"
          element={
            <PrivateRoute requiredRole="PACIENTE">
              <DashboardCliente />
            </PrivateRoute>
          }
        />
        <Route
          path="/cliente/citas"
          element={
            <PrivateRoute requiredRole="PACIENTE">
              <CitasCliente />
            </PrivateRoute>
          }
        />
        <Route
          path="/cliente/perfil"
          element={
            <PrivateRoute requiredRole="PACIENTE">
              <PerfilCliente />
            </PrivateRoute>
          }
        />

        {/* Catálogo de Especialidades */}
        <Route path="/especialidades" element={<Especialidades />} />
        <Route path="/turnos/:idEspecialidad" element={<Turnos />} />
        <Route path="/cita-confirmada" element={<CitaConfirmada />} />
      </Routes>
    </Router>
  );
}

export default App;
