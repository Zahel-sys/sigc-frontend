# 🏥 SIGC Frontend - Sistema Integral de Gestión de Citas

[![React](https://img.shields.io/badge/React-19.1.1-blue.svg)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-7.1.11-646CFF.svg)](https://vitejs.dev/)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)

Sistema web moderno para gestión de citas médicas con roles de **Administrador** y **Paciente**. Construido con React 19, Vite, y siguiendo principios SOLID + Atomic Design.

---

## 📋 Tabla de Contenidos

- [Características](#características)
- [Tecnologías](#tecnologías)
- [Requisitos Previos](#requisitos-previos)
- [Instalación](#instalación)
- [Configuración](#configuración)
- [Scripts Disponibles](#scripts-disponibles)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Arquitectura](#arquitectura)
- [Testing](#testing)
- [Despliegue](#despliegue)
- [Documentación](#documentación)

---

## ✨ Características

### Módulo Administrador
- ✅ Gestión completa de doctores (CRUD)
- ✅ Gestión de especialidades médicas
- ✅ Gestión de horarios disponibles
- ✅ Dashboard con estadísticas en tiempo real
- ✅ Gestión de usuarios del sistema

### Módulo Paciente
- ✅ Reserva de citas médicas por especialidad
- ✅ Visualización de citas agendadas
- ✅ Perfil de usuario editable
- ✅ Cambio de contraseña
- ✅ Historial de citas

### Características Técnicas
- 🔐 Autenticación JWT con refresh tokens
- 🎨 Diseño responsive (Bootstrap 5.3.8)
- ⚡ Carga rápida con Vite
- 🧪 Suite de tests con Vitest (52 tests)
- 🏗️ Arquitectura SOLID + Atomic Design
- 📱 PWA ready
- 🌐 API REST integrada con backend Spring Boot

---

## 🛠️ Tecnologías

| Categoría | Tecnología | Versión |
|-----------|-----------|---------|
| **Framework** | React | 19.1.1 |
| **Build Tool** | Vite | 7.1.11 |
| **Routing** | React Router DOM | 7.9.4 |
| **HTTP Client** | Axios | 1.12.2 |
| **UI Framework** | Bootstrap | 5.3.8 |
| **Notificaciones** | SweetAlert2 | 11.26.3 |
| **Auth** | JWT Decode | 4.0.0 |
| **Testing** | Vitest + Testing Library | Latest |
| **Linting** | ESLint | 9.21.0 |

---

## 📦 Requisitos Previos

Asegúrate de tener instalado:

- **Node.js**: >= 18.0.0 (Recomendado: 20.x LTS)
- **npm**: >= 9.0.0 (o **yarn** >= 1.22.0)
- **Backend**: Spring Boot corriendo en `http://localhost:8080`

---

## 🚀 Instalación

### 1. Clonar el repositorio

```bash
git clone https://github.com/Zahel-sys/sigc-frontend.git
cd sigc-frontend
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar variables de entorno

Crea un archivo `.env` en la raíz del proyecto:

```env
# API Backend
VITE_API_BASE_URL=http://localhost:8080

# Opcional: Configuración adicional
VITE_APP_NAME=SIGC
VITE_APP_VERSION=2.0.0
```

### 4. Iniciar servidor de desarrollo

```bash
npm run dev
```

La aplicación estará disponible en: **http://localhost:5173**

---

## ⚙️ Configuración

### Credenciales de Prueba

**Administrador:**
```
Email: admin@sigc.com
Contraseña: Admin123456
```

**Paciente:**
```
Email: paciente@sigc.com
Contraseña: Paciente123456
```

### Configuración de la API

La URL base de la API se configura en:
- **Variable de entorno**: `VITE_API_BASE_URL` (archivo `.env`)
- **Fallback**: `http://localhost:8080` (en `src/services/api.js`)

Para cambiar el puerto del backend, modifica el archivo `.env`:

```env
VITE_API_BASE_URL=http://localhost:8080
```

---

## 📜 Scripts Disponibles

| Script | Comando | Descripción |
|--------|---------|-------------|
| **Desarrollo** | `npm run dev` | Inicia servidor de desarrollo (puerto 5173) |
| **Build** | `npm run build` | Genera build de producción en `/dist` |
| **Preview** | `npm run preview` | Preview del build de producción |
| **Tests** | `npm run test` | Ejecuta tests con Vitest |
| **Tests UI** | `npm run test:ui` | Abre interfaz gráfica de tests |
| **Coverage** | `npm run test:coverage` | Genera reporte de cobertura |
| **Lint** | `npm run lint` | Analiza código con ESLint |

### Ejemplos de Uso

```bash
# Desarrollo
npm run dev

# Build para producción
npm run build

# Ejecutar tests
npm run test

# Ver cobertura de tests
npm run test:coverage

# Lint del código
npm run lint
```

---

## 📁 Estructura del Proyecto

```
sigc-frontend/
├── public/                      # Archivos estáticos
├── src/
│   ├── __tests__/              # Suite de tests (Vitest)
│   │   ├── components/         # Tests de componentes
│   │   ├── hooks/              # Tests de hooks
│   │   └── utils/              # Tests de utilidades
│   │
│   ├── assets/                 # Imágenes, iconos, etc.
│   │
│   ├── components/             # Componentes (Atomic Design)
│   │   ├── atoms/              # Componentes base (Button, Card, etc.)
│   │   ├── molecules/          # Componentes compuestos
│   │   ├── organisms/          # Secciones completas
│   │   └── *.jsx               # Componentes específicos
│   │
│   ├── config/                 # Configuración centralizada
│   │   ├── api.js              # Endpoints y config API
│   │   └── theme.js            # Colores, espaciado, sombras
│   │
│   ├── constants/              # Constantes de la app
│   │   ├── messages.js         # Textos y mensajes UI
│   │   ├── roles.js            # Roles y permisos
│   │   └── validation.js       # Reglas de validación
│   │
│   ├── contexts/               # React Context
│   │   ├── AuthContext.jsx    # Contexto de autenticación
│   │   └── AuthProvider.jsx   # Provider con lógica
│   │
│   ├── hooks/                  # Custom Hooks (19 hooks)
│   │   ├── admin/              # Hooks específicos admin
│   │   ├── useAuth.js
│   │   ├── useDoctores.js
│   │   └── ...
│   │
│   ├── layouts/                # Layouts de páginas
│   │   ├── AdminLayout.jsx    # Layout para admin
│   │   ├── ClienteLayout.jsx  # Layout para cliente
│   │   └── PublicLayout.jsx   # Layout público
│   │
│   ├── pages/                  # Páginas (14 páginas)
│   │   ├── AdminDoctores.jsx
│   │   ├── DashboardCliente.jsx
│   │   ├── login.jsx
│   │   └── ...
│   │
│   ├── services/               # Servicios API (41 métodos)
│   │   ├── auth/               # Servicios de autenticación
│   │   ├── citas/              # Servicios de citas
│   │   ├── doctores/           # Servicios de doctores
│   │   ├── especialidades/     # Servicios de especialidades
│   │   ├── horarios/           # Servicios de horarios
│   │   └── users/              # Servicios de usuarios
│   │
│   ├── styles/                 # CSS específico por página
│   │
│   ├── utils/                  # Utilidades reutilizables
│   │   ├── alerts.js           # SweetAlert2 helpers
│   │   ├── formatters.js       # Formateo de datos
│   │   └── validators.js       # Funciones de validación
│   │
│   ├── App.jsx                 # Componente principal + routing
│   ├── main.jsx                # Entry point
│   └── index.css               # Estilos globales
│
├── docs/                        # Documentación del proyecto
├── .env                         # Variables de entorno (crear)
├── package.json
├── vite.config.js
├── eslint.config.js
└── README.md
```

---

## 🏗️ Arquitectura

### Principios SOLID Implementados

✅ **S**ingle Responsibility - Cada módulo/componente tiene una única responsabilidad  
✅ **O**pen/Closed - Componentes extensibles sin modificar código existente  
✅ **L**iskov Substitution - Hooks intercambiables con mismo contrato  
✅ **I**nterface Segregation - Props específicas por componente  
✅ **D**ependency Inversion - Dependencia de abstracciones (hooks/servicios)

### Patrones de Diseño

- **Atomic Design**: Componentes organizados en atoms → molecules → organisms
- **Custom Hooks**: Lógica reutilizable separada de UI
- **Service Layer**: 6 servicios con 41 métodos API centralizados
- **Context API**: Estado global con AuthContext
- **Barrel Exports**: Importaciones simplificadas desde `index.js`

### Flujo de Datos

```
Usuario → Página → Hook → Servicio → API Backend
                ↓
              Estado (useState/useReducer)
                ↓
            Re-render UI
```

---

## 🧪 Testing

### Ejecutar Tests

```bash
# Ejecutar todos los tests
npm run test

# Ver interfaz gráfica
npm run test:ui

# Generar reporte de cobertura
npm run test:coverage
```

### Cobertura Actual

- **52 tests** implementados (todos pasando ✅)
- **10 test suites** completas
- **Componentes**: Badge, Button, Card, FormField, DataTable, Modal
- **Hooks**: useFormData (5 tests), useAuth, useAuthContext
- **Utils**: validators.js (8 tests)

### Escribir Tests

Los tests están en `src/__tests__/` espejando la estructura de `src/`:

```javascript
// Ejemplo: src/__tests__/components/atoms/Button.test.jsx
import { render, screen } from '@testing-library/react';
import { Button } from '../../../components/atoms/Button';

describe('Button', () => {
  it('renderiza correctamente', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });
});
```

---

## 🚢 Despliegue

### Build de Producción

```bash
npm run build
```

Genera archivos optimizados en `/dist`:
- **HTML minificado**
- **JS con code splitting**
- **CSS optimizado**
- **Assets con hash** para cache busting

### Desplegar en Vercel

```bash
npm install -g vercel
vercel
```

### Desplegar en Netlify

```bash
npm run build
netlify deploy --prod --dir=dist
```

### Variables de Entorno en Producción

Asegúrate de configurar:

```env
VITE_API_BASE_URL=https://tu-api-backend.com
```

---

## 📚 Documentación

### Documentación Interna

El proyecto incluye documentación detallada en la carpeta raíz:

- **ARCHITECTURE.md** - Arquitectura completa del proyecto (1,112 líneas)
- **REFACTOR_STATUS.md** - Estado de refactorización SOLID
- **CHECKLIST_FINAL.md** - Checklist de implementación
- **QUICK_START.md** - Guía de inicio rápido
- **EXECUTIVE_SUMMARY.md** - Resumen ejecutivo del proyecto

### Guías en `/docs`

- **SOLID_FINAL_REPORT.md** - Reporte de implementación SOLID
- **QUICK_REFERENCE_SOLID.md** - Referencia rápida de patrones

### API Documentation

Los endpoints del backend están documentados en `src/config/api.js`:

```javascript
export const ENDPOINTS = {
  AUTH: '/auth',
  USERS: '/usuarios',
  DOCTORES: '/doctores',
  ESPECIALIDADES: '/especialidades',
  HORARIOS: '/horarios',
  CITAS: '/citas'
};
```

---

## 🤝 Contribuir

### Workflow de Desarrollo

1. **Crear rama desde `Pequenos-Arreglos`**:
   ```bash
   git checkout -b feature/nueva-funcionalidad
   ```

2. **Hacer commits descriptivos**:
   ```bash
   git commit -m "feat: agregar componente SearchBar"
   ```

3. **Ejecutar tests**:
   ```bash
   npm run test
   npm run lint
   ```

4. **Push y crear Pull Request**:
   ```bash
   git push origin feature/nueva-funcionalidad
   ```

### Convenciones de Código

- **Componentes**: PascalCase (`Button.jsx`)
- **Hooks**: camelCase con prefijo `use` (`useAuth.js`)
- **Servicios**: camelCase con sufijo `Service` (`authService.js`)
- **Constantes**: UPPER_SNAKE_CASE (`THEME`, `MESSAGES`)
- **Archivos**: camelCase para JS, PascalCase para componentes

---

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver archivo `LICENSE` para más detalles.

---

## 👥 Equipo

Desarrollado con ❤️ por el equipo SIGC

- **GitHub**: [Zahel-sys](https://github.com/Zahel-sys)
- **Repositorio**: [sigc-frontend](https://github.com/Zahel-sys/sigc-frontend)

---

## 📞 Soporte

¿Problemas o preguntas?

1. Revisa la [documentación interna](#documentación)
2. Abre un [issue en GitHub](https://github.com/Zahel-sys/sigc-frontend/issues)
3. Consulta el archivo `ARCHITECTURE.md` para arquitectura detallada

---

**Última actualización**: 20 de noviembre de 2025  
**Versión**: 2.0.0
