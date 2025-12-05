# 🏗️ Diagrama de Arquitectura - Solución Hybrid

## Flujo de Decisión (Feature Flags)

```
┌─────────────────────────────────────────────────────┐
│         Frontend (React + Vite)                     │
│                                                     │
│  AdminDoctores.jsx (Formulario CRUD)               │
│           ↓                                         │
│  doctoresAPI.create/update/delete()                │
│           ↓                                         │
│  ┌────────────────────────────────────────┐        │
│  │  Leer .env (Feature Flags)             │        │
│  │                                        │        │
│  │  VITE_USE_MOCK_FOR_DOCTORS = ?        │        │
│  └────────┬───────────────────────────────┘        │
│           ↓                                         │
│      ┌────┴────┐                                    │
│      ↓         ↓                                    │
│   true      false                                  │
│      ↓         ↓                                    │
│   [MOCK]   [BACKEND]                               │
│      ↓         ↓                                    │
│ mockApi.js  api.post/put/delete                    │
│      ↓         ↓                                    │
│   Memory   http://localhost:8080/doctores          │
│    Data    (JSON)                                  │
│      ↓         ↓                                    │
│      └────┬────┘                                    │
│           ↓                                         │
│  ✅ Respuesta (Éxito)                             │
│           ↓                                         │
│  Actualizar UI                                     │
│  Mostrar doctor en lista                           │
│  Console: "✅ Doctor creado exitosamente"         │
│                                                     │
└─────────────────────────────────────────────────────┘
```

---

## Estado Actual de Endpoints

```
GET /especialidades
├─ .env: VITE_USE_MOCK_FOR_SPECIALTIES=true
├─ Usa: ✅ Mock API (mockApi.getEspecialidades())
└─ Resultado: Datos en memoria

GET /doctores
├─ .env: VITE_USE_MOCK_FOR_DOCTORS=true
├─ Usa: ✅ Mock API (mockApi.getDoctores())
└─ Resultado: Datos en memoria (puede fallar backend real, pero mockea)

POST /doctores
├─ .env: VITE_USE_MOCK_FOR_DOCTORS=true
├─ Usa: ✅ Mock API (mockApi.createDoctor())
├─ Backend: ❌ Error 400/500 (no se usa)
└─ Resultado: Doctor agregado a mock en memoria

PUT /doctores/{id}
├─ .env: VITE_USE_MOCK_FOR_DOCTORS=true
├─ Usa: ✅ Mock API (mockApi.updateDoctor())
├─ Backend: ❌ Error 400/500 (no se usa)
└─ Resultado: Doctor actualizado en mock en memoria

DELETE /doctores/{id}
├─ .env: VITE_USE_MOCK_FOR_DOCTORS=true
├─ Usa: ✅ Mock API (mockApi.deleteDoctor())
├─ Backend: ❌ Retorna error (no se intenta)
└─ Resultado: Doctor eliminado de mock en memoria
```

---

## Cambio Fácil: Revertir a Backend Real

```
ACTUAL (Mock):                    CAMBIAR A (Backend Real):
──────────────────                ─────────────────────

.env                              .env
├─ VITE_USE_MOCK_FOR_              ├─ VITE_USE_MOCK_FOR_
│  DOCTORS=true       ───────→      │  DOCTORS=false
├─ VITE_USE_MOCK_FOR_              ├─ VITE_USE_MOCK_FOR_
│  SPECIALTIES=true   ───────→      │  SPECIALTIES=false
└─                                  └─

Luego: npm run dev (reiniciar)     Resultado: Usa backend real


FLUJO EN CÓDIGO:
─────────────────

// Cuando VITE_USE_MOCK_FOR_DOCTORS=true:
if (!USE_REAL_BACKEND.doctors) {  // true
  return mockApi.createDoctor(...)  ← USA MOCK
}

// Cuando VITE_USE_MOCK_FOR_DOCTORS=false:
if (!USE_REAL_BACKEND.doctors) {  // false
  return mockApi.createDoctor(...)
}
return api.post('/doctores/json', ...)  ← USA BACKEND
```

---

## Datos: Ciclo de Vida en Mock

```
┌────────────────────────────────────┐
│  Usuario Inicia App                │
│  (npm run dev)                     │
└────────────┬───────────────────────┘
             ↓
┌────────────────────────────────────┐
│  mockApi.js se carga              │
│  Inicializa datos mock en memoria │
│  (doctores[], especialidades[])   │
└────────────┬───────────────────────┘
             ↓
┌────────────────────────────────────┐
│  Usuario: Crear Doctor             │
│  POST → mockApi.createDoctor()     │
│  ✅ Doctor agregado a memoria     │
└────────────┬───────────────────────┘
             ↓
┌────────────────────────────────────┐
│  Usuario: Editar Doctor            │
│  PUT → mockApi.updateDoctor()      │
│  ✅ Doctor actualizado en memoria │
└────────────┬───────────────────────┘
             ↓
┌────────────────────────────────────┐
│  Usuario: Eliminar Doctor          │
│  DELETE → mockApi.deleteDoctor()   │
│  ✅ Doctor removido de memoria    │
└────────────┬───────────────────────┘
             ↓
┌────────────────────────────────────┐
│  Usuario: Refrescar Página (F5)    │
│  ❌ Todos los cambios se pierden  │
│  (Mock reinicia)                   │
│                                    │
│  NOTA: Los cambios NO persisten   │
│  Solo disponibles durante sesión   │
└────────────────────────────────────┘
```

---

## Transición: Mock → Backend Real

```
Fase 1: ACTUAL (Mock Mode)
───────────────────────────
Frontend                Backend
    │                     │
    ├─ GET /doctores ────→ ✅ Funciona
    │ ← doctores[]         (Lectura)
    │
    ├─ POST /doctores ────→ ❌ Error 400/500
    │ ← Fallback a Mock     (Validación falla)
    │
    └─ Mock: Crea en memoria
       ✅ Usuario ve doctor en lista


Fase 2: TRANSITORIO (Cambiar .env + Reiniciar)
──────────────────────────────────
.env: VITE_USE_MOCK_FOR_DOCTORS=false
npm run dev


Fase 3: OBJETIVO (Backend Real Mode)
────────────────────────────────────
Frontend                Backend
    │                     │
    ├─ GET /doctores ────→ ✅ Funciona
    │ ← doctores[]         (Lectura)
    │
    ├─ POST /doctores ────→ ✅ Funciona (después de fixes)
    │ ← { idDoctor, ... }  (Creación)
    │
    ├─ PUT /doctores/id ──→ ✅ Funciona (después de fixes)
    │ ← { idDoctor, ... }  (Actualización)
    │
    ├─ DELETE /doctores/id→ ✅ Funciona
    │ ← { success: true }  (Eliminación)
    │
    └─ Database: Datos persistentes
       ✅ Todos los cambios guardados
```

---

## Estructura de Archivos: Cambios Realizados

```
sigc-frontend/
│
├─ 📄 .env                          [✏️ MODIFICADO]
│  └─ Agregado:
│     ├─ VITE_USE_MOCK_FOR_DOCTORS=true
│     └─ VITE_USE_MOCK_FOR_SPECIALTIES=true
│
├─ src/
│  ├─ services/
│  │  └─ api.js                     [✏️ MODIFICADO]
│  │     └─ USE_REAL_BACKEND lógica invertida:
│  │        ├─ specialties: !== 'true'
│  │        └─ doctors: !== 'true'
│  │
│  ├─ pages/
│  │  └─ AdminDoctores.jsx          [✏️ MODIFICADO]
│  │     ├─ Formulario habilitado (sin opacity/disabled)
│  │     ├─ Botones Editar/Eliminar habilitados
│  │     └─ Alerta actualizada a "Modo Hybrid"
│  │
│  ├─ services/
│  │  └─ mockApi.js                 [✅ SIN CAMBIOS - Ya tiene todas las funciones]
│  │
│  └─ ... (otros archivos sin cambios)
│
├─ 📄 BACKEND_FIX_PROMPTS.md         [📝 CREADO]
│  └─ Guía para equipo backend
│
├─ 📄 HYBRID_SOLUTION_SUMMARY.md     [📝 CREADO]
│  └─ Resumen técnico de la solución
│
└─ 📄 VERIFICACION_FINAL.md          [📝 CREADO]
   └─ Instrucciones de prueba y troubleshooting
```

---

## Matriz de Decisión: ¿Qué Usa el Frontend?

| Acción | .env Value | Usa | Estado |
|--------|-----------|-----|--------|
| `GET /doctores` | true | Mock | ✅ Funciona |
| `GET /doctores` | false | Backend Real | ✅ Funciona |
| `POST /doctores` | true | Mock | ✅ Funciona |
| `POST /doctores` | false | Backend Real | ❌ Error 400/500 |
| `PUT /doctores/id` | true | Mock | ✅ Funciona |
| `PUT /doctores/id` | false | Backend Real | ❌ Error 400/500 |
| `DELETE /doctores/id` | true | Mock | ✅ Funciona |
| `DELETE /doctores/id` | false | Backend Real | ✅ Funciona |

**Acción necesaria para Fase 3:**
- Backend debe corregir POST y PUT
- Cambiar `.env` a `false`
- Todos los endpoints funcionarán

---

## Comparativa: Mock vs Backend Real

| Aspecto | Mock | Backend Real |
|--------|------|--------------|
| **Persistencia** | ❌ Solo en sesión | ✅ Base de datos |
| **Reinicio** | ❌ Pierde datos | ✅ Mantiene datos |
| **Velocidad** | ✅ Instantáneo | ⚠️ Red |
| **Validación** | ✅ Básica | ✅ Completa |
| **Multiusuario** | ❌ No | ✅ Sí |
| **Autenticación** | ⚠️ Simulada | ✅ Real |
| **Estado Actual** | ✅ **ACTIVO** | ❌ Con errores |

---

## Próximo Cambio: Reactivación Backend

```
1. Backend Team Completa Fixes
   └─ Revisa BACKEND_FIX_PROMPTS.md
   └─ Corrige POST /doctores (400 → 201)
   └─ Corrige PUT /doctores/{id} (400 → 200)
   └─ Prueba con Postman/cURL

2. Cambiar .env
   └─ VITE_USE_MOCK_FOR_DOCTORS=false
   └─ VITE_USE_MOCK_FOR_SPECIALTIES=false

3. Reiniciar Frontend
   └─ npm run dev

4. Verificar Logs
   └─ ✅ Doctores obtenidos del backend
   └─ No hay "usando mock"

5. Probar CRUD
   └─ Crear doctor → Aparece en lista Y en BD
   └─ Editar doctor → Cambios persisten
   └─ Eliminar doctor → Se elimina de BD
```

---

## ✨ Conclusión Visual

```
ANTES (Bloqueado)          AHORA (Hybrid)            DESPUÉS (Backend Real)
───────────────            ──────────────            ───────────────────

❌ Form disabled           ✅ Form enabled           ✅ Form enabled
❌ Botones grises          ✅ Botones azules         ✅ Botones azules
❌ No funciona CRUD        ✅ Funciona CRUD (Mock)   ✅ Funciona CRUD (Real)
❌ Error 400/500           ✅ Usa Mock               ✅ 200/201 OK
❌ Usuario bloqueado       ✅ Usuario puede probar   ✅ Datos persisten en BD
```

La solución permite **desarrollo sin bloqueos** mientras el backend se corrige.
