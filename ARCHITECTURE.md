# 🏗️ GUÍA DE ARQUITECTURA SOLID - SIGC FRONTEND

**Versión:** 1.0  
**Fecha:** 20 de noviembre de 2025  
**Stack:** React 19.1.1 + Vite 7.1.7 + Bootstrap 5.3.8

---

## 📑 TABLA DE CONTENIDOS

1. [Estructura de Carpetas](#estructura-de-carpetas)
2. [Principios SOLID Implementados](#principios-solid-implementados)
3. [Patrones y Arquitectura](#patrones-y-arquitectura)
4. [Guía de Desarrollo](#guía-de-desarrollo)
5. [Ejemplos Prácticos](#ejemplos-prácticos)
6. [Best Practices](#best-practices)

---

## 📁 Estructura de Carpetas

```
src/
├── config/                        # Configuración centralizada
│   ├── theme.js                   # Paleta de colores, espaciado, sombras
│   └── api.js                     # URLs, endpoints, configuración de API
│
├── constants/                     # Constantes de la aplicación
│   ├── messages.js                # Todos los textos/mensajes
│   ├── validation.js              # Patrones y reglas de validación
│   └── roles.js                   # Roles y permisos
│
├── utils/                         # Funciones reutilizables
│   ├── alerts.js                  # Notificaciones (SweetAlert)
│   ├── formatters.js              # Formateo de datos
│   ├── validators.js              # Funciones de validación
│   └── index.js                   # Exporta todas las utilidades
│
├── hooks/                         # Custom Hooks (lógica reutilizable)
│   ├── useAuth.js                 # Autenticación y login
│   ├── useCurrentUser.js          # Obtener usuario actual
│   ├── useDoctores.js             # Carga de doctores
│   ├── useEspecialidades.js       # Carga de especialidades
│   ├── useCitas.js                # Gestión de citas
│   ├── useHorarios.js             # Carga de horarios
│   ├── useFormData.js             # Manejo de formularios
│   └── index.js                   # Exporta todos los hooks
│
├── contexts/                      # Global State (Context API)
│   ├── AuthContext.js             # Contexto de autenticación
│   ├── UserContext.js             # Contexto de usuario
│   └── index.js                   # Exporta contextos
│
├── services/                      # Servicios (API Layer - DIP)
│   ├── api.js                     # Cliente axios centralizado
│   ├── auth/                      # Servicios de autenticación
│   │   └── authService.js
│   ├── users/                     # Servicios de usuarios
│   │   └── usersService.js
│   ├── citas/                     # Servicios de citas
│   │   └── citasService.js
│   ├── doctores/                  # Servicios de doctores
│   │   └── doctoresService.js
│   ├── especialidades/            # Servicios de especialidades
│   │   └── especialidadesService.js
│   └── horarios/                  # Servicios de horarios
│       └── horariosService.js
│
├── components/                    # Componentes (Atomic Design)
│   ├── atoms/                     # Componentes básicos (SRP)
│   │   ├── Button.jsx             # Botón reutilizable
│   │   ├── FormField.jsx          # Input reutilizable
│   │   ├── Badge.jsx              # Badge/etiqueta
│   │   ├── Alert.jsx              # Alertas
│   │   └── Icon.jsx               # Iconos
│   │
│   ├── molecules/                 # Componentes compuestos
│   │   ├── FormSection.jsx        # Sección de formulario
│   │   ├── CardHeader.jsx         # Encabezado de tarjeta
│   │   ├── InputGroup.jsx         # Grupo de inputs
│   │   └── TableRow.jsx           # Fila de tabla
│   │
│   ├── organisms/                 # Componentes complejos
│   │   ├── ProfileCard.jsx        # Tarjeta de perfil
│   │   ├── DoctorCard.jsx         # Tarjeta de doctor
│   │   ├── HorarioCard.jsx        # Tarjeta de horario
│   │   └── CitasTable.jsx         # Tabla de citas
│   │
│   ├── layouts/                   # Layouts reutilizables
│   │   ├── AdminLayout.jsx
│   │   ├── ClienteLayout.jsx
│   │   └── PublicLayout.jsx
│   │
│   ├── PrivateRoute.jsx           # Componente de rutas privadas
│   └── index.js                   # Exporta componentes
│
├── pages/                         # Páginas (Smart Components)
│   ├── auth/
│   │   ├── Login.jsx              # Página de login (refactorizado)
│   │   └── Register.jsx           # Página de registro
│   ├── client/
│   │   ├── Dashboard.jsx
│   │   ├── Perfil.jsx
│   │   └── Citas.jsx
│   ├── admin/
│   │   ├── Dashboard.jsx
│   │   ├── Doctores.jsx
│   │   ├── Especialidades.jsx
│   │   └── Horarios.jsx
│   └── public/
│       ├── Home.jsx
│       ├── Especialidades.jsx
│       └── Turnos.jsx
│
├── styles/                        # Estilos CSS
│   ├── variables.css              # Variables CSS compartidas
│   ├── base.css                   # Estilos base globales
│   ├── components/                # Estilos por componente
│   │   ├── Button.css
│   │   ├── FormField.css
│   │   └── ...
│   └── pages/                     # Estilos por página
│       ├── Login.css
│       └── ...
│
├── App.jsx                        # Componente raíz
├── main.jsx                       # Punto de entrada
└── index.css                      # Estilos globales
```

### Justificación de la Estructura

| Carpeta | Principio SOLID | Beneficio |
|---|---|---|
| `config/` | Open/Closed | Cambios de configuración sin modificar componentes |
| `constants/` | DRY | Mensajes y validaciones en un único lugar |
| `utils/` | Single Responsibility | Funciones pequeñas y reutilizables |
| `hooks/` | Single Responsibility | Lógica separada del renderizado |
| `services/` | Dependency Inversion | Componentes no dependes de implementación |
| `components/atoms/` | Interface Segregation | Props pequeños y específicos |
| `contexts/` | Liskov Substitution | Global state predecible |

---

## ✅ Principios SOLID Implementados

### 1. Single Responsibility Principle (SRP)

**Cada archivo tiene UNA única responsabilidad:**

```jsx
// ❌ VIOLACIÓN: Múltiples responsabilidades
function PerfilCliente() {
  // Fetch, validación, renderizado, cambio de contraseña todo aquí
  const handleChangePassword = async (e) => { /* 50 líneas */ };
  const handleSave = async (e) => { /* 30 líneas */ };
  return <div>200+ líneas JSX</div>;
}

// ✅ SOLUCIÓN: Separar responsabilidades
// archivo: hooks/useCurrentUser.js
const useCurrentUser = () => {
  // RESPONSABILIDAD 1: Fetch usuario
  const [usuario, setUsuario] = useState(null);
  // ...
  return { usuario, loading, error };
};

// archivo: pages/client/Perfil.jsx
function PerfilCliente() {
  const { usuario } = useCurrentUser();
  // RESPONSABILIDAD 2: Solo renderizar
  return <ProfileCard usuario={usuario} onSave={handleSave} />;
}
```

**Beneficios:**
- Fácil de testear
- Fácil de mantener
- Reutilizable

---

### 2. Open/Closed Principle (OCP)

**El código está abierto para extensión pero cerrado para modificación:**

```jsx
// ❌ VIOLACIÓN: Hardcoded
const buttonColor = '#20c997';
const borderRadius = '12px';
// Repetido en 20+ lugares

// ✅ SOLUCIÓN: Configuración centralizada
// archivo: config/theme.js
export const THEME = {
  primary: { main: '#20c997' },
  borderRadius: { lg: '12px' },
};

// Uso en componentes
import { THEME } from '../config/theme';
const buttonStyle = {
  background: THEME.primary.main,
  borderRadius: THEME.borderRadius.lg,
};
```

**Beneficios:**
- Cambiar tema = editar 1 archivo
- Consistencia visual
- Fácil de mantener

---

### 3. Liskov Substitution Principle (LSP)

**Valores predecibles y consistentes:**

```jsx
// ❌ VIOLACIÓN: Inconsistencia
const [citas, setCitas] = useState(null);      // null
const [doctores, setDoctores] = useState([]);  // array
const [error, setError] = useState('');        // string

// ✅ SOLUCIÓN: Siempre arrays, siempre strings
export const useCitas = () => {
  const [citas, setCitas] = useState([]);     // SIEMPRE array
  const [error, setError] = useState(null);   // null o string
  
  return {
    citas: Array.isArray(citas) ? citas : [], // Garantiza array
  };
};
```

**Beneficios:**
- Predictibilidad
- Menos bugs
- Mejor testing

---

### 4. Interface Segregation Principle (ISP)

**Props específicos, no objetos enormes:**

```jsx
// ❌ VIOLACIÓN: Props enormes
<DoctorCard 
  doctor={{
    id, nombre, especialidad, cupoPacientes, imagen,
    email, telefono, experiencia, horarios, disponibilidad,
    // ...10 propiedades más
  }}
/>

// ✅ SOLUCIÓN: Solo lo necesario
<DoctorCard 
  nombre="Dr. García"
  especialidad="Cardiología"
  imagen={imageUrl}
/>
```

**Beneficios:**
- Componentes más simples
- Fácil de reutilizar
- Mejor rendimiento

---

### 5. Dependency Inversion Principle (DIP)

**Dependencias en interfaces, no en implementaciones:**

```jsx
// ❌ VIOLACIÓN: Acoplado a axios
export const PerfilCliente = () => {
  const cargarPerfil = async () => {
    const res = await api.get("/auth/me"); // Acoplado a axios
  };
};

// ✅ SOLUCIÓN: Dependencia invertida
import authService from '../services/auth/authService';

export const PerfilCliente = () => {
  const { usuario } = useCurrentUser();
  // useCurrentUser usa authService, no axios directamente
};
```

**Beneficios:**
- Fácil cambiar a GraphQL
- Fácil mockear para tests
- Componentes agnósticos

---

## 🎯 Patrones y Arquitectura

### Patrón: Container/Presentational Components

```jsx
// ❌ ANTES: Todo junto
function CitasCliente() {
  const [citas, setCitas] = useState([]);
  useEffect(() => { /* fetch */ }, []);
  return <table>/* renderizado */</table>;
}

// ✅ DESPUÉS: Separado

// archivo: pages/client/Citas.jsx (Container)
function CitasCliente() {
  const { citas, loading } = useCitas(usuarioId);
  return <CitasTable citas={citas} loading={loading} />;
}

// archivo: components/organisms/CitasTable.jsx (Presentational)
function CitasTable({ citas, loading }) {
  return <table>...</table>;
}
```

### Patrón: Custom Hooks para Lógica

```jsx
// Encapsula:
// - Estado
// - Efectos secundarios
// - Lógica de negocio

export const useDoctores = (especialidad) => {
  const [doctores, setDoctores] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    doctoresService.getDoctoresByEspecialidad(especialidad)
      .then(setDoctores)
      .catch(err => console.error(err));
  }, [especialidad]);
  
  return { doctores, loading };
};
```

### Patrón: Service Layer (DIP)

```
Componente → Hook → Service → API
            ↑       ↑
     SRP + DIP  Fácil de mockear
```

Cada capa tiene responsabilidades claras:
- **Componente:** Renderización
- **Hook:** Lógica y estado
- **Service:** Llamadas API
- **API:** Configuración HTTP

---

## 📖 Guía de Desarrollo

### ¿Cuándo crear un Custom Hook?

**Crear un hook cuando:**
- ✅ La lógica se repite en 2+ componentes
- ✅ El componente tiene múltiples `useState`/`useEffect`
- ✅ Hay lógica compleja de estado

**No crear un hook cuando:**
- ❌ Es solo un `useState` simple
- ❌ Se usa en solo 1 componente
- ❌ No hay efectos secundarios

### ¿Cuándo crear un Servicio?

**Crear un servicio cuando:**
- ✅ Hay llamadas a API
- ✅ La lógica puede reutilizarse en múltiples hooks
- ✅ Quieres desacoplar la API de los componentes

### ¿Cuándo crear un Componente Atómico?

**Crear un atom/molecule cuando:**
- ✅ Se reutiliza en 2+ lugares
- ✅ Tiene una única responsabilidad visual
- ✅ Es simple (< 50 líneas)

### ¿Cuándo crear un Contexto?

**Usar Context cuando:**
- ✅ Datos globales (usuario autenticado, tema, idioma)
- ✅ Evitar prop drilling
- ✅ Menos de 5 contextos recomendado

---

## 💡 Ejemplos Prácticos

### Ejemplo 1: Crear un Hook Personalizado

```jsx
// ✅ useValidation.js - Custom Hook para validación
import { useState, useCallback } from 'react';
import { validarFormulario } from '../utils/validators';
import { MESSAGES } from '../constants/messages';

export const useValidation = () => {
  const [errors, setErrors] = useState({});

  const validate = useCallback((formData, fieldNames) => {
    const newErrors = validarFormulario(formData, fieldNames);
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, []);

  const setFieldError = useCallback((field, error) => {
    setErrors(prev => ({ ...prev, [field]: error }));
  }, []);

  const clearErrors = useCallback(() => setErrors({}), []);

  return { errors, validate, setFieldError, clearErrors };
};

// Uso en componente
function LoginForm() {
  const { formData, handleChange } = useFormData();
  const { errors, validate } = useValidation();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate(formData, ['email', 'password'])) {
      // Enviar login
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <FormField 
        name="email" 
        value={formData.email}
        onChange={handleChange}
        error={errors.email}
      />
    </form>
  );
}
```

### Ejemplo 2: Crear un Servicio

```jsx
// ✅ services/uploads/uploadsService.js
import api from '../api';
import { API_CONFIG } from '../../config/api';

export const uploadsService = {
  uploadImage: async (file) => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await api.post(
      API_CONFIG.ENDPOINTS.UPLOAD,
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    );

    return response.data;
  },

  validarImagen: (file) => {
    const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (!validTypes.includes(file.type)) {
      throw new Error('Tipo de imagen no válido');
    }
    if (file.size > maxSize) {
      throw new Error('Imagen demasiado grande');
    }
  },
};

// Uso en hook
export const useUploadImage = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const upload = useCallback(async (file) => {
    setLoading(true);
    setError(null);
    try {
      uploadsService.validarImagen(file);
      const result = await uploadsService.uploadImage(file);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { upload, loading, error };
};
```

### Ejemplo 3: Componente Atómico SOLID

```jsx
// ✅ components/atoms/FormField.jsx
import PropTypes from 'prop-types';
import { THEME } from '../../config/theme';

/**
 * Componente de campo de formulario reutilizable (SRP)
 * Responsabilidad única: Renderizar un input con validación
 */
export const FormField = ({
  label,
  name,
  type = 'text',
  value,
  onChange,
  onBlur,
  error,
  placeholder,
  disabled = false,
  required = false,
  maxLength,
  pattern,
}) => {
  const hasError = !!error;

  return (
    <div style={{ marginBottom: THEME.spacing.lg }}>
      {label && (
        <label htmlFor={name} style={{ fontWeight: '600', display: 'block', marginBottom: THEME.spacing.sm }}>
          {label}
          {required && <span style={{ color: THEME.danger.main }}>*</span>}
        </label>
      )}

      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        placeholder={placeholder}
        disabled={disabled}
        maxLength={maxLength}
        pattern={pattern}
        style={{
          width: '100%',
          padding: THEME.spacing.md,
          border: `2px solid ${hasError ? THEME.danger.main : THEME.gray[200]}`,
          borderRadius: THEME.borderRadius.md,
          fontSize: '1rem',
          transition: THEME.transition.normal,
        }}
        onFocus={(e) => {
          e.target.style.borderColor = THEME.primary.main;
        }}
        onBlur={(e) => {
          e.target.style.borderColor = hasError ? THEME.danger.main : THEME.gray[200];
        }}
      />

      {hasError && (
        <p style={{
          color: THEME.danger.main,
          fontSize: '0.875rem',
          marginTop: THEME.spacing.xs,
          margin: '4px 0 0 0',
        }}>
          {error}
        </p>
      )}
    </div>
  );
};

FormField.propTypes = {
  label: PropTypes.string,
  name: PropTypes.string.isRequired,
  type: PropTypes.string,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  onBlur: PropTypes.func,
  error: PropTypes.string,
  placeholder: PropTypes.string,
  disabled: PropTypes.bool,
  required: PropTypes.bool,
  maxLength: PropTypes.number,
  pattern: PropTypes.string,
};

export default FormField;
```

---

## 🏆 Best Practices

### 1. Nombres Descriptivos

```jsx
// ❌ MALO
const d = (e) => {};
const x = useState(null);
const foo = () => {};

// ✅ BUENO
const handleDoctorClick = (event) => {};
const [doctores, setDoctores] = useState([]);
const cargarEspecialidades = () => {};
```

### 2. Documentación con JSDoc

```jsx
/**
 * Obtiene todos los doctores filtrados por especialidad
 * @param {string} especialidad - Nombre de la especialidad
 * @returns {Promise<Array>} Array de doctores
 * @throws {Error} Si hay error en la API
 */
export const getDoctoresByEspecialidad = async (especialidad) => {
  // ...
};
```

### 3. Manejo de Errores Consistente

```jsx
// ✅ BUENO: Manejo consistente
try {
  const data = await api.get('/endpoint');
  return data;
} catch (err) {
  const message = err.response?.data?.message || MESSAGES.ERRORS.FETCH_ERROR;
  showError(message);
  return null;
}
```

### 4. Evitar Props Drilling

```jsx
// ❌ MALO: Prop drilling
<Level1 usuario={usuario}>
  <Level2 usuario={usuario}>
    <Level3 usuario={usuario}>
      <Level4 usuario={usuario} />
    </Level3>
  </Level2>
</Level1>

// ✅ BUENO: Usar Context
const AuthContext = createContext();
<AuthContext.Provider value={{ usuario }}>
  <Level1>
    <Level2>
      <Level3>
        <Level4 /> {/* Usa useContext(AuthContext) */}
      </Level3>
    </Level2>
  </Level1>
</AuthContext.Provider>
```

### 5. Evitar `useCallback` innecesario

```jsx
// ❌ SOBRE-INGENIERÍA: useCallback en todo
const handleClick = useCallback(() => {
  console.log('Clicked');
}, []);

// ✅ SIMPLIFICAR: Solo cuando sea necesario
const handleClick = () => {
  console.log('Clicked');
};
```

### 6. Usar Optional Chaining

```jsx
// ❌ VERBOSE
const email = usuario && usuario.email ? usuario.email : '';

// ✅ LIMPIO
const email = usuario?.email || '';
```

### 7. Tipos con PropTypes o TypeScript

```jsx
import PropTypes from 'prop-types';

export const UserCard = ({ nombre, email, rol }) => {
  return <div>{nombre}</div>;
};

UserCard.propTypes = {
  nombre: PropTypes.string.isRequired,
  email: PropTypes.string.isRequired,
  rol: PropTypes.oneOf(['ADMIN', 'PACIENTE']),
};
```

---

## 🔄 Flujo de Desarrollo Recomendado

### Crear una Página Nueva

```jsx
// 1. Crear el hook (si necesita lógica)
src/hooks/useTuHook.js

// 2. Crear componentes reutilizables
src/components/atoms/TuAtom.jsx
src/components/molecules/TuMolecula.jsx

// 3. Crear la página
src/pages/TuPagina.jsx

// 4. Agregar ruta en App.jsx
<Route path="/tu-pagina" element={<TuPagina />} />

// 5. Agregar link en layout/navbar
```

### Crear un Servicio Nuevo

```jsx
// 1. Crear el servicio
src/services/tudominio/tuDominioService.js

// 2. Crear un hook si es necesario
src/hooks/useTuDominio.js

// 3. Usar el hook en componentes
```

---

## 📚 Recursos Adicionales

- [React Docs](https://react.dev)
- [SOLID Principles](https://en.wikipedia.org/wiki/SOLID)
- [Atomic Design](https://bradfrost.com/blog/post/atomic-web-design/)
- [Custom Hooks Patterns](https://usehooks.com/)

---

## ✅ Checklist para New Features

- [ ] Crear servicio si usa API
- [ ] Crear hook si tiene lógica reutilizable
- [ ] Crear componentes atómicos si son reutilizables
- [ ] Usar constants para strings
- [ ] Usar config/theme para estilos
- [ ] Validar entrada del usuario
- [ ] Manejar errores correctamente
- [ ] Documentar con JSDoc
- [ ] PropTypes en componentes
- [ ] Exportar en index.js

---

**Última actualización:** 20 de noviembre de 2025
