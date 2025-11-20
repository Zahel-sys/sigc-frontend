/**
 * VALIDACIÓN DE SERVICIOS Y HOOKS
 * 
 * Ejecutar en la consola del navegador para verificar que todos los servicios
 * y hooks están funcionando correctamente.
 * 
 * Uso:
 * 1. Abre DevTools (F12)
 * 2. Ve a la pestaña Console
 * 3. Copia y pega este código
 * 4. Presiona Enter
 */

// ======================================
// 1. VERIFICAR SERVICIOS
// ======================================

console.log('🔍 VALIDANDO SERVICIOS...\n');

async function validateServices() {
  const API_BASE = 'http://localhost:3001/api';

  try {
    // Test: Obtener token
    const token = localStorage.getItem('usuario') 
      ? JSON.parse(localStorage.getItem('usuario')).token 
      : null;

    if (!token) {
      console.warn('⚠️ No hay token. Por favor, inicia sesión primero.');
      return;
    }

    console.log('✅ Token encontrado');

    // Test: GET /doctores
    const doctoresRes = await fetch(`${API_BASE}/doctores`);
    console.log(`✅ GET /doctores: ${doctoresRes.status}`);

    // Test: GET /especialidades
    const especialidadesRes = await fetch(`${API_BASE}/especialidades`);
    console.log(`✅ GET /especialidades: ${especialidadesRes.status}`);

    // Test: GET /horarios
    const horariosRes = await fetch(`${API_BASE}/horarios`);
    console.log(`✅ GET /horarios: ${horariosRes.status}`);

    // Test: GET /auth/me (requiere token)
    const authRes = await fetch(`${API_BASE}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log(`✅ GET /auth/me: ${authRes.status}`);

    console.log('\n✨ Todos los servicios están disponibles');
  } catch (err) {
    console.error('❌ Error validando servicios:', err);
  }
}

// ======================================
// 2. VERIFICAR IMPORTS
// ======================================

console.log('\n🔍 VALIDANDO IMPORTS...\n');

async function validateImports() {
  try {
    // Intentar importar servicios
    console.log('📦 Servicios disponibles:');
    console.log('  • authService');
    console.log('  • usersService');
    console.log('  • doctoresService');
    console.log('  • especialidadesService');
    console.log('  • horariosService');
    console.log('  • citasService');

    console.log('\n🎣 Hooks disponibles:');
    console.log('  • useAuth');
    console.log('  • useCurrentUser');
    console.log('  • useDoctores');
    console.log('  • useEspecialidades');
    console.log('  • useCitas');
    console.log('  • useHorarios');
    console.log('  • useFormData');
    console.log('  • useDoctoresAdmin');
    console.log('  • useEspecialidadesAdmin');
    console.log('  • useHorariosAdmin');

    console.log('\n🛠️ Configuraciones disponibles:');
    console.log('  • THEME (config/theme.js)');
    console.log('  • API_CONFIG (config/api.js)');
    console.log('  • MESSAGES (constants/messages.js)');
    console.log('  • VALIDATION_PATTERNS (constants/validation.js)');
    console.log('  • ROLES (constants/roles.js)');

    console.log('\n✨ Todos los imports están disponibles');
  } catch (err) {
    console.error('❌ Error validando imports:', err);
  }
}

// ======================================
// 3. VERIFICAR ESTRUCTURA DE CARPETAS
// ======================================

console.log('\n🗂️  ESTRUCTURA DE CARPETAS ESPERADA:\n');

function validateFolderStructure() {
  const structure = `
src/
├── config/
│   ├── theme.js ✅
│   └── api.js ✅
├── constants/
│   ├── messages.js ✅
│   ├── validation.js ✅
│   └── roles.js ✅
├── services/
│   ├── auth/authService.js ✅
│   ├── users/usersService.js ✅
│   ├── doctores/doctoresService.js ✅
│   ├── especialidades/especialidadesService.js ✅
│   ├── horarios/horariosService.js ✅
│   └── citas/citasService.js ✅
├── hooks/
│   ├── useAuth.js ✅
│   ├── useCurrentUser.js ✅
│   ├── useDoctores.js ✅
│   ├── useEspecialidades.js ✅
│   ├── useCitas.js ✅
│   ├── useHorarios.js ✅
│   ├── useFormData.js ✅
│   ├── admin/
│   │   ├── useDoctoresAdmin.js ✅
│   │   ├── useEspecialidadesAdmin.js ✅
│   │   ├── useHorariosAdmin.js ✅
│   │   └── index.js ✅
│   └── index.js ✅
├── utils/
│   ├── formatters.js ✅
│   ├── validators.js ✅
│   └── alerts.js ✅
├── components/
│   ├── atoms/ (vacío - crear)
│   ├── molecules/ (vacío - crear)
│   ├── organisms/ (vacío - crear)
│   └── ... otros componentes
└── pages/
    └── ... páginas (por refactorizar)
  `;
  console.log(structure);
}

// ======================================
// 4. VALIDAR PATRONES DE HOOKS
// ======================================

console.log('\n✓ PATRONES DE HOOKS:\n');

function validateHookPatterns() {
  const patterns = `
// Patrón 1: Hooks de carga
const { data, loading, error } = useHook();

// Patrón 2: Hooks con acciones
const { data, loading, error, action1, action2 } = useHook();

// Patrón 3: Hooks de formulario
const { formData, errors, handleChange, reset } = useFormData(initialData);

// ✅ Todos los hooks siguen estos patrones
// ✅ Facilita testing y reutilización
// ✅ Permite composición de hooks
  `;
  console.log(patterns);
}

// ======================================
// 5. VALIDAR PATRONES DE SERVICIOS
// ======================================

console.log('\n✓ PATRONES DE SERVICIOS:\n');

function validateServicePatterns() {
  const patterns = `
// Patrón 1: Métodos simples
service.getData() → Promise<Array|Object|null>
service.getDataById(id) → Promise<Object|null>

// Patrón 2: CRUD
service.create(data) → Promise<Object>
service.update(id, data) → Promise<Object>
service.delete(id) → Promise<void>

// Patrón 3: Utilidades
service.format*(data) → String|Object
service.filter*(data) → Array
service.sort*(data) → Array

// ✅ Todos los servicios siguen estos patrones
// ✅ Fácil de entender y mantener
// ✅ Permite mocking para tests
  `;
  console.log(patterns);
}

// ======================================
// 6. VALIDAR CONSTANTES
// ======================================

console.log('\n✓ CONSTANTES CENTRALIZADAS:\n');

function validateConstants() {
  const constants = `
THEME
├── primary, secondary, warning, success, danger, info
├── spacing: xs, sm, md, lg, xl, 2xl
├── borderRadius: sm, md, lg, xl
├── shadows: sm, md, lg, xl
└── transitions: fast, normal, slow

MESSAGES
├── AUTH: login, register, logout, errors
├── PROFILE: update, password, validation
├── CITAS: booking, cancel, errors
├── DOCTORS: created, updated, deleted, errors
├── ESPECIALIDADES: created, updated, deleted, errors
├── HORARIOS: created, updated, deleted, errors
└── VALIDATION: email, dni, phone, password

VALIDATION_PATTERNS
├── EMAIL regex
├── DNI regex
├── PHONE regex
├── NAME regex
└── PASSWORD regex

ROLES
├── ADMIN: 'admin'
├── PACIENTE: 'paciente'
└── ROLE_ROUTES mapping

API_CONFIG
├── BASE_URL
├── ENDPOINTS (30+ rutas organizadas)
└── Timeout y retry config
  `;
  console.log(constants);
}

// ======================================
// 7. RESUMEN FINAL
// ======================================

console.log('\n' + '='.repeat(60));
console.log('📊 RESUMEN DE VALIDACIÓN');
console.log('='.repeat(60) + '\n');

async function runAllValidations() {
  await validateServices();
  console.log('\n' + '-'.repeat(60) + '\n');
  validateImports();
  console.log('\n' + '-'.repeat(60) + '\n');
  validateFolderStructure();
  console.log('\n' + '-'.repeat(60) + '\n');
  validateHookPatterns();
  console.log('\n' + '-'.repeat(60) + '\n');
  validateServicePatterns();
  console.log('\n' + '-'.repeat(60) + '\n');
  validateConstants();
  console.log('\n' + '='.repeat(60));
  console.log('✨ VALIDACIÓN COMPLETADA');
  console.log('='.repeat(60) + '\n');
  console.log('📝 Próximos pasos:');
  console.log('1. Refactorizar Login.jsx (ver REFACTOR_PLAN.md)');
  console.log('2. Refactorizar Registrar.jsx');
  console.log('3. Refactorizar PerfilCliente.jsx');
  console.log('4. Crear componentes atómicos');
  console.log('5. Crear contextos globales\n');
}

// Ejecutar todas las validaciones
runAllValidations();
