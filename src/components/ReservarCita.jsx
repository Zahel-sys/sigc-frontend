import React, { useState } from 'react';
import '../styles/ReservarCita.css';

function ReservarCita({ horarioId, horario, onCitaCreada }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [citaCreada, setCitaCreada] = useState(null);

  // Obtener el token JWT
  const getToken = () => {
    return localStorage.getItem('token') || null;
  };

  const handleReservar = async () => {
    setLoading(true);
    setError(null);
    setCitaCreada(null);

    try {
      // Obtener datos
      const token = getToken();
      
      console.log('DEBUG - Token:', token ? 'existe' : 'NO EXISTE');
      console.log('DEBUG - Horario:', horario);

      // Validar token
      if (!token) {
        throw new Error('No hay sesión activa. Por favor, inicia sesión.');
      }

      // Validar que se proporcionó horarioId y doctorId
      if (!horarioId) {
        throw new Error('Horario no válido');
      }

      const doctorId = horario?.doctor?.idDoctor || horario?.idDoctor;
      if (!doctorId) {
        throw new Error('No se pudo identificar el doctor del horario');
      }

      // Construir fecha y hora en formato ISO (LocalDateTime)
      // Backend espera: { date: LocalDateTime ISO, description: string, doctorId: number }
      const fechaHora = `${horario.fecha}T${horario.horaInicio}`;
      
      const payload = {
        date: fechaHora,  // "2025-11-25T09:00:00"
        description: `Consulta - ${horario.turno}`,
        doctorId: parseInt(doctorId, 10)  // Number
      };

      console.log('📤 Enviando cita:', payload);

      // Realizar la petición al backend
      const response = await fetch('http://localhost:8080/citas', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      // Procesar respuesta
      const data = await response.json();

      // Manejar errores según el código de estado
      if (response.status === 401) {
        throw new Error('Sesión expirada. Por favor, inicia sesión de nuevo.');
      } else if (response.status === 400) {
        throw new Error(data.error || data.message || 'Datos inválidos');
      } else if (response.status === 404) {
        throw new Error(data.error || data.message || 'Paciente u horario no encontrado');
      } else if (response.status === 409) {
        throw new Error(data.error || data.message || 'Este horario ya no está disponible');
      } else if (response.status === 422) {
        throw new Error(data.error || data.message || 'No se puede reservar en un horario pasado');
      } else if (!response.ok) {
        throw new Error(data.error || data.message || 'Error al crear la cita');
      }

      // Éxito
      setCitaCreada(data);
      console.log('✅ Cita creada exitosamente:', data);

      // Ejecutar callback si existe
      if (onCitaCreada) {
        onCitaCreada(data);
      }

      // Limpiar estado después de 3 segundos
      setTimeout(() => {
        setCitaCreada(null);
        setError(null);
      }, 3000);

    } catch (err) {
      console.error('❌ Error:', err.message);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="reservar-cita-container">
      {/* Información del horario */}
      {horario && (
        <div className="horario-info">
          <p><strong>Fecha:</strong> {horario.fecha}</p>
          <p><strong>Turno:</strong> {horario.turno}</p>
          <p><strong>Hora:</strong> {horario.horaInicio} - {horario.horaFin}</p>
          <p className="disponibilidad">
            {horario.disponible ? (
              <span className="disponible">✓ Disponible</span>
            ) : (
              <span className="ocupado">✗ Ocupado</span>
            )}
          </p>
        </div>
      )}

      {/* Botón de reservar */}
      <button 
        onClick={handleReservar} 
        disabled={loading || !horario?.disponible}
        className="btn-reservar"
      >
        {loading ? '⏳ Reservando...' : '📅 Reservar Cita'}
      </button>

      {/* Mensaje de error */}
      {error && (
        <div className="error-message">
          <span>❌ {error}</span>
        </div>
      )}

      {/* Confirmación de éxito */}
      {citaCreada && (
        <div className="success-message">
          <p>✅ ¡Cita reservada exitosamente!</p>
          <p><strong>ID de Cita:</strong> {citaCreada.idCita}</p>
          <p><strong>Estado:</strong> {citaCreada.estado}</p>
          <p><strong>Doctor:</strong> {citaCreada.doctor?.nombre}</p>
          <p><strong>Fecha:</strong> {citaCreada.fechaCita}</p>
          <p><strong>Hora:</strong> {citaCreada.horaCita}</p>
        </div>
      )}
    </div>
  );
}

export default ReservarCita;
