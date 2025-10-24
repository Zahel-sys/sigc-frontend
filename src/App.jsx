import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import DashboardAdmin from "./pages/DashboardAdmin";
import DashboardCliente from "./pages/DashboardCliente";
import CitasCliente from "./pages/CitasCliente";
import Especialidades from "./pages/Especialidades";
import Turnos from "./pages/Turnos";
import CitaConfirmada from "./pages/CitaConfirmada";
import AdminEspecialidades from "./pages/AdminEspecialidades";
import AdminDoctores from "./pages/AdminDoctores";
import Registrar from "./pages/Registrar";
import Home from "./pages/Home";
import PrivateRoute from "./components/PrivateRoute";

function App() {
  return (
    <Router>
      <Routes>
        {/* Página de inicio */}
        <Route path="/inicio" element={<Home />} />
        <Route path="/" element={<Navigate to="/inicio" />} />

        {/* Login */}
        <Route path="/login" element={<Login />} />

        {/* Registro */}
        <Route path="/registrar" element={<Registrar />} />

        {/* Panel del Administrador */}
        <Route
          path="/admin"
          element={
            <PrivateRoute>
              <DashboardAdmin />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/especialidades"
          element={
            <PrivateRoute>
              <AdminEspecialidades />
            </PrivateRoute>
          }
        />
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
        <Route
          path="/cliente/citas"
          element={
            <PrivateRoute>
              <CitasCliente />
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
