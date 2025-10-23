import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Registrar from "./pages/Registrar";
import DashboardCliente from "./pages/DashboardCliente";
import CitasCliente from "./pages/CitasCliente";
import Especialidades from "./pages/Especialidades";
import PerfilCliente from "./pages/PerfilCliente";
import PrivateRoute from "./components/PrivateRoute";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/registrar" element={<Registrar />} />

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
        <Route path="/especialidades" element={<Especialidades />} />
      </Routes>
    </Router>
  );
}

export default App;
