import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Registrar from "./pages/Registrar";
import DashboardAdmin from "./pages/DashboardAdmin";
import DashboardCliente from "./pages/DashboardCliente";
import CitasCliente from "./pages/CitasCliente";
import Especialidades from "./pages/Especialidades";
import PerfilCliente from "./pages/PerfilCliente";
import AdminEspecialidades from "./pages/AdminEspecialidades";
import AdminDoctores from "./pages/AdminDoctores";
import AdminHorarios from "./pages/AdminHorarios";
import Turnos from "./pages/Turnos";
import CitaConfirmada from "./pages/CitaConfirmada";
import PrivateRoute from "./components/PrivateRoute";

function App() {
  return (
    <Router>
      <Routes>
        {/* 🔹 LOGIN / REGISTRO */}
        <Route path="/" element={<Login />} />
        <Route path="/registrar" element={<Registrar />} />

        {/* 🔹 PANEL ADMINISTRADOR */}
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
        <Route
          path="/admin/horarios"
          element={
            <PrivateRoute>
              <AdminHorarios />
            </PrivateRoute>
          }
        />

        {/* 🔹 PANEL CLIENTE */}
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
        <Route
          path="/cliente/perfil"
          element={
            <PrivateRoute>
              <PerfilCliente />
            </PrivateRoute>
          }
        />

        {/* 🔹 CATÁLOGO Y TURNOS */}
        <Route path="/especialidades" element={<Especialidades />} />
        <Route
          path="/turnos/:idEspecialidad"
          element={
            <PrivateRoute>
              <Turnos />
            </PrivateRoute>
          }
        />
        <Route
          path="/cita-confirmada"
          element={
            <PrivateRoute>
              <CitaConfirmada />
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
