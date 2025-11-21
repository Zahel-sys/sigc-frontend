import { useState, useEffect } from 'react';
import api from '../services/api';

/**
 * 🎯 COMPONENTE DE DEMOSTRACIÓN
 * Este componente muestra EXPLÍCITAMENTE cómo el frontend obtiene datos de la BD
 * a través de las APIs REST del backend
 */
export default function EjemploAPI() {
  const [especialidades, setEspecialidades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 📡 Función que obtiene datos de la BD a través de la API
  const obtenerDatosDeLaBD = async () => {
    console.log('🔍 Consultando la API: GET http://localhost:8080/especialidades');
    setLoading(true);
    
    try {
      // ✅ Esta línea hace una petición HTTP GET al backend
      // El backend consulta MySQL y devuelve los datos en formato JSON
      const respuesta = await api.get('/especialidades');
      
      console.log('✅ Datos recibidos de la BD:', respuesta.data);
      setEspecialidades(respuesta.data);
      setError(null);
    } catch (err) {
      console.error('❌ Error al consultar la API:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // 🚀 Al cargar el componente, obtiene los datos automáticamente
  useEffect(() => {
    obtenerDatosDeLaBD();
  }, []);

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>🎯 Ejemplo: Mostrar Datos de la BD usando APIs</h1>
      
      <div style={{ background: '#f0f0f0', padding: '15px', borderRadius: '8px', marginBottom: '20px' }}>
        <h3>📊 Cómo funciona:</h3>
        <ol>
          <li><strong>Frontend</strong> hace una petición: <code>GET http://localhost:8080/especialidades</code></li>
          <li><strong>Backend (Spring Boot)</strong> recibe la petición</li>
          <li><strong>Backend</strong> consulta la base de datos MySQL: <code>SELECT * FROM especialidades</code></li>
          <li><strong>Backend</strong> devuelve los datos en formato JSON</li>
          <li><strong>Frontend</strong> recibe los datos y los muestra en pantalla</li>
        </ol>
      </div>

      <button 
        onClick={obtenerDatosDeLaBD}
        style={{
          background: '#4CAF50',
          color: 'white',
          padding: '10px 20px',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
          marginBottom: '20px'
        }}
      >
        🔄 Recargar Datos desde la BD
      </button>

      {loading && <p>⏳ Cargando datos de la base de datos...</p>}
      
      {error && (
        <div style={{ background: '#ffebee', padding: '15px', borderRadius: '5px', color: '#c62828' }}>
          <strong>❌ Error:</strong> {error}
        </div>
      )}

      {!loading && !error && (
        <div>
          <h2>📋 Datos obtenidos de la BD ({especialidades.length} registros):</h2>
          
          {especialidades.length === 0 ? (
            <p style={{ color: '#666' }}>No hay especialidades en la base de datos</p>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#2196F3', color: 'white' }}>
                  <th style={{ padding: '10px', border: '1px solid #ddd' }}>ID</th>
                  <th style={{ padding: '10px', border: '1px solid #ddd' }}>Nombre</th>
                  <th style={{ padding: '10px', border: '1px solid #ddd' }}>Descripción</th>
                </tr>
              </thead>
              <tbody>
                {especialidades.map((esp) => (
                  <tr key={esp.idEspecialidad}>
                    <td style={{ padding: '10px', border: '1px solid #ddd' }}>{esp.idEspecialidad}</td>
                    <td style={{ padding: '10px', border: '1px solid #ddd' }}>{esp.nombre}</td>
                    <td style={{ padding: '10px', border: '1px solid #ddd' }}>{esp.descripcion}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      <div style={{ marginTop: '30px', background: '#e3f2fd', padding: '15px', borderRadius: '5px' }}>
        <h3>💡 Información Técnica:</h3>
        <ul>
          <li><strong>API Base URL:</strong> http://localhost:8080</li>
          <li><strong>Endpoint:</strong> /especialidades</li>
          <li><strong>Método HTTP:</strong> GET</li>
          <li><strong>Respuesta:</strong> Array de objetos JSON</li>
          <li><strong>Base de Datos:</strong> MySQL (sigc_db)</li>
          <li><strong>Tabla:</strong> especialidades</li>
        </ul>
      </div>
    </div>
  );
}
