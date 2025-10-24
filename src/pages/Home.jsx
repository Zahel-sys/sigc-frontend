import React from "react";
import { Link } from "react-router-dom";
import "../styles/Home.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";


export default function Home() {
  return (
    <div className="dashboard-container">
      <aside className="sidebar">
        <h2 className="logo">SIGC</h2>
        <p className="role">Bienvenido</p>
        <nav className="nav-menu">
          <Link to="/">Inicio</Link>
          <Link to="/login">Iniciar Sesión</Link>
          <Link to="/registrar">Registrarse</Link>
        </nav>
      </aside>

      <main className="content">
        <h1 className="title">🏥 Bienvenido a SIGC Clínica</h1>
        <p className="subtitle">
          Agenda tus citas médicas fácilmente con nuestros especialistas.
        </p>

        <div className="cards">
          <div className="card">
            <h3>Accede a tu cuenta</h3>
            <p>Gestiona tus citas y tu perfil como paciente.</p>
            <Link to="/login" className="btn">Iniciar sesión</Link>
          </div>

          <div className="card">
            <h3>¿Nuevo usuario?</h3>
            <p>Regístrate y accede a los servicios de la clínica.</p>
            <Link to="/registrar" className="btn">Registrarse</Link>
          </div>
        </div>
      </main>
    </div>
  );
}
