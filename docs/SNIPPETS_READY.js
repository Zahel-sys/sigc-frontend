/**
 * SNIPPETS LISTOS PARA COPY-PASTE
 * 
 * Estos snippets te ayudarán a refactorizar componentes rápidamente.
 * Solo copia, pega y adapta según tu componente.
 */

// ==========================================
// SNIPPET 1: Refactorizar un formulario
// ==========================================

/**
 * ANTES:
 * const [nombre, setNombre] = useState('');
 * const [email, setEmail] = useState('');
 * const [errors, setErrors] = useState({});
 * 
 * DESPUÉS:
 */

import { useFormData } from '../hooks/useFormData';
import { validarEmail } from '../utils/validators';

function MiFormulario() {
  const { formData, errors, handleChange, reset } = useFormData({
    nombre: '',
    email: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validar email
    if (!validarEmail(formData.email)) {
      // mostrar error
      return;
    }
    
    // Enviar datos
    reset();
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        name="nombre"
        value={formData.nombre}
        onChange={handleChange}
      />
      {errors.nombre && <span>{errors.nombre}</span>}
      
      <input
        name="email"
        type="email"
        value={formData.email}
        onChange={handleChange}
      />
      {errors.email && <span>{errors.email}</span>}
      
      <button type="submit">Enviar</button>
    </form>
  );
}

// ==========================================
// SNIPPET 2: Refactorizar una carga de datos
// ==========================================

/**
 * ANTES:
 * useEffect(() => {
 *   const fetchData = async () => {
 *     try {
 *       const res = await api.get('/doctores');
 *       setDatos(res.data);
 *     } catch (err) {
 *       setError(err.message);
 *     }
 *   };
 *   fetchData();
 * }, []);
 * 
 * DESPUÉS:
 */

import { useDoctores } from '../hooks/useDoctores';

function MiComponente() {
  const { doctores, loading, error } = useDoctores();

  if (loading) return <div>Cargando...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <ul>
      {doctores.map(doc => (
        <li key={doc.id}>{doc.nombre}</li>
      ))}
    </ul>
  );
}

// ==========================================
// SNIPPET 3: Refactorizar operación CRUD
// ==========================================

/**
 * ANTES:
 * const handleCreate = async () => {
 *   try {
 *     await api.post('/doctores', formData);
 *     alert('Creado');
 *     cargarDatos();
 *   } catch (err) {
 *     alert('Error: ' + err.message);
 *   }
 * };
 * 
 * DESPUÉS:
 */

import { useDoctoresAdmin } from '../hooks/admin/useDoctoresAdmin';
import { MESSAGES } from '../constants/messages';

function AdminDoctores() {
  const { doctores, crear, actualizar, eliminar } = useDoctoresAdmin();

  const handleCreate = async (formData) => {
    const success = await crear(formData);
    if (success) {
      reset(); // limpiar formulario
    }
  };

  const handleUpdate = async (id, formData) => {
    await actualizar(id, formData);
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(MESSAGES.GENERAL.CONFIRM_DELETE);
    if (confirmed) {
      await eliminar(id);
    }
  };

  return (
    <div>
      {/* JSX */}
    </div>
  );
}

// ==========================================
// SNIPPET 4: Refactorizar autenticación
// ==========================================

/**
 * ANTES:
 * const handleLogin = async (e) => {
 *   e.preventDefault();
 *   try {
 *     const res = await api.post('/auth/login', { email, password });
 *     localStorage.setItem('usuario', JSON.stringify(res.data));
 *     navigate('/dashboard');
 *   } catch (err) {
 *     alert('Error: ' + err.message);
 *   }
 * };
 * 
 * DESPUÉS:
 */

import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

function LoginPage() {
  const navigate = useNavigate();
  const { login, loading, error } = useAuth();
  const { formData, handleChange } = useFormData({ email: '', password: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await login(formData.email, formData.password);
    if (success) {
      navigate('/dashboard');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && <div className="alert alert-danger">{error}</div>}
      
      <input
        type="email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        placeholder="Email"
      />
      
      <input
        type="password"
        name="password"
        value={formData.password}
        onChange={handleChange}
        placeholder="Contraseña"
      />
      
      <button type="submit" disabled={loading}>
        {loading ? 'Cargando...' : 'Ingresar'}
      </button>
    </form>
  );
}

// ==========================================
// SNIPPET 5: Usar configuraciones
// ==========================================

import { THEME } from '../config/theme';
import { MESSAGES } from '../constants/messages';
import { API_CONFIG } from '../config/api';

// Usar colores del tema
<div style={{ backgroundColor: THEME.primary.main }}>
  <h1 style={{ color: THEME.primary.contrast }}>Título</h1>
</div>

// Usar espaciado
<div style={{ padding: THEME.spacing.lg, margin: THEME.spacing.md }}>
  Contenido
</div>

// Usar sombras
<card style={{ boxShadow: THEME.shadows.lg }}>

// Usar mensajes
showSuccess(MESSAGES.AUTH.LOGIN_SUCCESS);
showError(MESSAGES.VALIDATION.EMAIL_INVALID);
alert(MESSAGES.DOCTORS.CREATED);

// Usar endpoints
fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.DOCTORS.GET_ALL}`)

// ==========================================
// SNIPPET 6: Componente inteligente (Smart)
// ==========================================

/**
 * Un componente inteligente:
 * - Obtiene datos
 * - Maneja lógica
 * - Orquesta componentes tontos
 */

import { useCitas } from '../hooks/useCitas';
import CitasList from '../components/organisms/CitasList';
import EmptyState from '../components/molecules/EmptyState';
import Loader from '../components/atoms/Loader';

export default function CitasPageContainer() {
  const { citas, loading, error, cancelarCita } = useCitas();

  if (loading) return <Loader />;
  if (error) return <div className="alert alert-danger">{error}</div>;
  if (citas.length === 0) return <EmptyState />;

  return (
    <CitasList 
      citas={citas}
      onCancel={cancelarCita}
    />
  );
}

// ==========================================
// SNIPPET 7: Componente tonto (Dumb)
// ==========================================

/**
 * Un componente tonto:
 * - Solo renderiza
 * - Recibe datos por props
 * - Llama callbacks para acciones
 */

import Button from '../atoms/Button';
import { THEME } from '../config/theme';

export default function CitasList({ citas, onCancel }) {
  return (
    <div className="row">
      {citas.map(cita => (
        <div key={cita.id} className="col-md-6 mb-3">
          <div 
            className="card"
            style={{
              borderRadius: THEME.borderRadius.lg,
              boxShadow: THEME.shadows.md,
            }}
          >
            <div className="card-body">
              <h5>{cita.doctor}</h5>
              <p>{cita.fecha}</p>
              
              <Button
                variant="danger"
                size="sm"
                onClick={() => onCancel(cita.id)}
              >
                Cancelar
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// ==========================================
// SNIPPET 8: Validación de formulario
// ==========================================

import { validarEmail, validarDNI, validarContraseña } from '../utils/validators';
import { MESSAGES } from '../constants/messages';

function MiFormulario() {
  const { formData, errors, setFieldError } = useFormData({
    email: '',
    dni: '',
    password: '',
  });

  const handleBlur = (fieldName) => {
    if (fieldName === 'email' && !validarEmail(formData.email)) {
      setFieldError('email', MESSAGES.VALIDATION.EMAIL_INVALID);
    }
    if (fieldName === 'dni' && !validarDNI(formData.dni)) {
      setFieldError('dni', MESSAGES.VALIDATION.DNI_INVALID);
    }
    if (fieldName === 'password' && !validarContraseña(formData.password)) {
      setFieldError('password', MESSAGES.VALIDATION.PASSWORD_WEAK);
    }
  };

  return (
    <form>
      <input
        name="email"
        value={formData.email}
        onChange={handleChange}
        onBlur={() => handleBlur('email')}
      />
      {errors.email && <span className="error">{errors.email}</span>}
      
      <input
        name="dni"
        value={formData.dni}
        onChange={handleChange}
        onBlur={() => handleBlur('dni')}
      />
      {errors.dni && <span className="error">{errors.dni}</span>}
      
      <input
        name="password"
        type="password"
        value={formData.password}
        onChange={handleChange}
        onBlur={() => handleBlur('password')}
      />
      {errors.password && <span className="error">{errors.password}</span>}
    </form>
  );
}

// ==========================================
// SNIPPET 9: Filtrar y ordenar
// ==========================================

import { useDoctores } from '../hooks/useDoctores';
import { doctoresService } from '../services/doctores/doctoresService';

function FiltrarDoctores() {
  const { doctores } = useDoctores();
  const [especialidad, setEspecialidad] = useState('');

  // Filtrar
  const doctoresFiltrados = especialidad
    ? doctoresService.getDoctoresByEspecialidad(doctores, especialidad)
    : doctores;

  // O filtrar con find
  const doctoresCardiologia = doctores.filter(d => 
    d.especialidad === 'Cardiología'
  );

  return (
    <select onChange={(e) => setEspecialidad(e.target.value)}>
      <option value="">Todas</option>
      <option value="Cardiología">Cardiología</option>
      <option value="Neurología">Neurología</option>
    </select>
  );
}

// ==========================================
// SNIPPET 10: Componente con subcomponentes
// ==========================================

/**
 * Separar componentes grandes en:
 * - Header
 * - Form
 * - List
 * - Footer
 */

import Header from './ProfileHeader';
import ProfileForm from './ProfileForm';
import PasswordSection from './PasswordSection';

export default function PerfilCliente() {
  const { usuario, loading } = useCurrentUser();

  if (loading) return <Loader />;

  return (
    <div className="container">
      <Header usuario={usuario} />
      
      <div className="row">
        <div className="col-md-6">
          <ProfileForm usuario={usuario} />
        </div>
        <div className="col-md-6">
          <PasswordSection />
        </div>
      </div>
    </div>
  );
}

// ==========================================
// SNIPPET 11: Hook personalizado nuevo
// ==========================================

/**
 * Template para crear un nuevo hook
 */

import { useState, useEffect, useCallback } from 'react';
import miService from '../services/mi-servicio/miService';
import { MESSAGES } from '../constants/messages';
import { showSuccess, showError } from '../utils/alerts';

export const useMiFeature = () => {
  const [datos, setDatos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const cargar = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const resultado = await miService.obtenerDatos();
      setDatos(resultado);
    } catch (err) {
      console.error('Error:', err);
      setError(err.message);
      showError('Error', MESSAGES.GENERAL.ERROR);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    cargar();
  }, [cargar]);

  return {
    datos,
    loading,
    error,
    cargar,
  };
};

// Uso:
// const { datos, loading, error, cargar } = useMiFeature();

// ==========================================
// SNIPPET 12: Servicio personalizado nuevo
// ==========================================

/**
 * Template para crear un nuevo servicio
 */

import api from '../../services/api';

const miService = {
  // Obtener todos
  obtenerTodos: async () => {
    try {
      const response = await api.get('/mi-ruta');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Obtener por ID
  obtenerPorId: async (id) => {
    try {
      const response = await api.get(`/mi-ruta/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Crear
  crear: async (datos) => {
    try {
      const response = await api.post('/mi-ruta', datos);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Actualizar
  actualizar: async (id, datos) => {
    try {
      const response = await api.put(`/mi-ruta/${id}`, datos);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Eliminar
  eliminar: async (id) => {
    try {
      await api.delete(`/mi-ruta/${id}`);
    } catch (error) {
      throw error;
    }
  },
};

export default miService;

// ==========================================
// SNIPPET 13: Mejorar rendimiento
// ==========================================

/**
 * Memoización para evitar re-renders innecesarios
 */

import { memo, useMemo, useCallback } from 'react';

// Memoizar componente
const MiComponente = memo(({ citas, onSelect }) => (
  <ul>
    {citas.map(c => (
      <li key={c.id} onClick={() => onSelect(c.id)}>
        {c.nombre}
      </li>
    ))}
  </ul>
));

// Usar useMemo para datos pesados
const citasOrdenadas = useMemo(() => {
  return citas.sort((a, b) => new Date(a.fecha) - new Date(b.fecha));
}, [citas]);

// Usar useCallback para callbacks estables
const handleSelect = useCallback((id) => {
  // hacer algo
}, [dependencias]);

// ==========================================
// SNIPPET 14: Manejo de errores
// ==========================================

/**
 * Patrón consistente para manejar errores
 */

const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const resultado = await miService.hacer(datos);
    showSuccess('Éxito', MESSAGES.GENERAL.SUCCESS);
  } catch (err) {
    // Error de validación desde backend
    if (err.response?.status === 400) {
      showError('Validación', err.response.data.message);
    }
    // No autorizado
    else if (err.response?.status === 401) {
      showError('Sesión', MESSAGES.AUTH.SESSION_EXPIRED);
      localStorage.clear();
      navigate('/login');
    }
    // No encontrado
    else if (err.response?.status === 404) {
      showError('No encontrado', MESSAGES.GENERAL.NOT_FOUND);
    }
    // Error general
    else {
      showError('Error', err.message || MESSAGES.GENERAL.ERROR);
    }
  }
};

// ==========================================
// SNIPPET 15: Testing con Mock
// ==========================================

/**
 * Mockar servicios para tests
 */

jest.mock('../services/doctores/doctoresService');
import doctoresService from '../services/doctores/doctoresService';

describe('useDoctoresAdmin', () => {
  beforeEach(() => {
    doctoresService.getAllDoctores.mockResolvedValue([
      { id: 1, nombre: 'Dr. Juan' }
    ]);
  });

  test('debería cargar doctores', async () => {
    const { result } = renderHook(() => useDoctoresAdmin());
    
    await waitFor(() => {
      expect(result.current.doctores).toHaveLength(1);
    });
  });
});
