# 📋 PLAN DE REFACTOR POR PÁGINA

Orden de refactor recomendado (por complejidad y impacto):

---

## 1️⃣ Login.jsx → 70% de duplicación

**Estado actual:** 120 líneas, lógica duplicada en Registrar.jsx

**Cambios necesarios:**
- Reemplazar `api.post` con `useAuth().login()`
- Mover validación a `utils/validators`
- Mover mensajes a `MESSAGES.AUTH`
- Usar `useFormData` para estado

**Tiempo estimado:** 20 minutos
**Líneas antes:** 120 | **Líneas después:** 50

```jsx
// ANTES
const handleLogin = async (e) => {
  e.preventDefault();
  try {
    const res = await api.post("/auth/login", { email, password });
    localStorage.setItem("usuario", JSON.stringify(res.data));
    alert("✅ Bienvenido!");
    navigate("/dashboard-cliente");
  } catch (err) {
    alert("❌ Usuario o contraseña incorrectos");
  }
};

// DESPUÉS
const { login, loading } = useAuth();
const handleLogin = async (e) => {
  e.preventDefault();
  const success = await login(formData.email, formData.password);
  if (success) navigate("/dashboard-cliente");
};
```

---

## 2️⃣ Registrar.jsx → 80% de duplicación (mismo código que Login)

**Estado actual:** 140 líneas, casi idéntica a Login

**Cambios necesarios:**
- Reemplazar `api.post` con `useAuth().register()`
- Usar componentes atómicos para formulario
- Compartir validación con Login

**Tiempo estimado:** 20 minutos
**Líneas antes:** 140 | **Líneas después:** 55

---

## 3️⃣ PerfilCliente.jsx → 300 líneas, 4 responsabilidades

**Estado actual:** 
- Fetch usuario (useEffect + api.get)
- Editar perfil (api.put)
- Cambiar contraseña (api.post)
- Renderizar (150+ líneas JSX)

**Cambios necesarios:**
- Crear `useUpdateProfile()` hook
- Crear `ProfileSection` (Organism)
- Crear `PasswordSection` (Organism)
- Separar en 2 componentes moleculares

**Tiempo estimado:** 45 minutos
**Líneas antes:** 300 | **Líneas después:** 100 (distribuidas)

**Archivos a crear:**
```
src/hooks/useUpdateProfile.js (100 líneas)
src/components/organisms/ProfileSection.jsx (120 líneas)
src/components/organisms/PasswordSection.jsx (130 líneas)
src/pages/PerfilCliente.jsx (60 líneas) - Refactored
```

---

## 4️⃣ Turnos.jsx → 280 líneas, 3 responsabilidades

**Estado actual:**
- Cargar doctores + filtro especialidad
- Cargar horarios por doctor
- Crear cita

**Cambios necesarios:**
- Usar `useDoctores()` hook
- Usar `useHorarios()` hook
- Usar `useReservarCita()` hook (nuevo)
- Crear `ReservarCitaForm` (Organism)

**Tiempo estimado:** 40 minutos
**Líneas antes:** 280 | **Líneas después:** 90

---

## 5️⃣ CitasCliente.jsx → 250 líneas, 2 responsabilidades

**Estado actual:**
- Cargar citas del usuario
- Cancelar cita

**Cambios necesarios:**
- Usar `useCitas()` hook
- Crear `CitasList` (Organism)
- Crear `CitaCard` (Molecule)
- Mover lógica de cancelar a servicio

**Tiempo estimado:** 35 minutos
**Líneas antes:** 250 | **Líneas después:** 80

---

## 6️⃣ AdminDoctores.jsx → 250 líneas, 3 responsabilidades

**Estado actual:**
- Cargar doctores
- Formulario crear/editar
- Tabla listado

**Cambios necesarios:**
- Usar `useDoctoresAdmin()` hook (YA CREADO ✅)
- Crear `DoctoresForm` (Organism)
- Crear `DoctoresTable` (Organism)
- Crear `DoctorRow` (Molecule)

**Tiempo estimado:** 45 minutos
**Líneas antes:** 250 | **Líneas después:** 95

**Archivos a crear:**
```
src/components/organisms/DoctoresForm.jsx (130 líneas)
src/components/organisms/DoctoresTable.jsx (120 líneas)
src/components/molecules/DoctorRow.jsx (60 líneas)
src/pages/AdminDoctores.jsx (80 líneas) - Refactored
```

---

## 7️⃣ AdminEspecialidades.jsx → 220 líneas, 3 responsabilidades

**Cambios necesarios:**
- Usar `useEspecialidadesAdmin()` hook (YA CREADO ✅)
- Crear `EspecialidadesForm` (Organism)
- Crear `EspecialidadesTable` (Organism)

**Tiempo estimado:** 40 minutos
**Líneas antes:** 220 | **Líneas después:** 85

---

## 8️⃣ AdminHorarios.jsx → 280 líneas, 3 responsabilidades

**Cambios necesarios:**
- Usar `useHorariosAdmin()` hook (YA CREADO ✅)
- Crear `HorariosForm` (Organism)
- Crear `HorariosTable` (Organism)

**Tiempo estimado:** 45 minutos
**Líneas antes:** 280 | **Líneas después:** 90

---

## 9️⃣ ReservarCita.jsx → 200 líneas, 2 responsabilidades

**Estado actual:** Componente para modal de reservar cita

**Cambios necesarios:**
- Mover lógica a `useReservarCita()` hook
- Usar `useFormData` para estado
- Usar componentes atómicos

**Tiempo estimado:** 30 minutos
**Líneas antes:** 200 | **Líneas después:** 70

---

## 🔟 Componentes de utilidad

### Home.jsx, Especialidades.jsx, DashboardAdmin.jsx, DashboardCliente.jsx

**Cambios necesarios:**
- Mover datos a hooks (si aplica)
- Usar componentes atómicos
- Eliminar estilos inline

**Tiempo estimado:** 30 minutos cada uno

---

## 📊 RESUMEN DE CAMBIOS

| Página | Antes | Después | Reducción | Tiempo |
|--------|-------|---------|-----------|--------|
| Login | 120 | 50 | 58% | 20' |
| Registrar | 140 | 55 | 61% | 20' |
| PerfilCliente | 300 | 100* | 67% | 45' |
| Turnos | 280 | 90 | 68% | 40' |
| CitasCliente | 250 | 80 | 68% | 35' |
| AdminDoctores | 250 | 95* | 62% | 45' |
| AdminEspecialidades | 220 | 85 | 61% | 40' |
| AdminHorarios | 280 | 90 | 68% | 45' |
| ReservarCita | 200 | 70 | 65% | 30' |
| Otros | 400 | 300 | 25% | 30' |
| **TOTAL** | **2,640** | **1,115** | **58%** | **370'** |

*Incluye componentes separados (Organisms)

**Resultado:** Reducción de **1,525 líneas** (58% de duplicación eliminada)

---

## 🚀 ORDEN DE PRIORIDAD RECOMENDADO

### Fase 1: Foundation (Día 1)
1. ✅ **Login.jsx** - Necesario para funcionamiento básico
2. ✅ **Registrar.jsx** - Compartirá lógica con Login
3. ✅ **PerfilCliente.jsx** - Refactor complejo pero prioritario

### Fase 2: Páginas de Citas (Día 2)
4. ✅ **Turnos.jsx** - Feature principal
5. ✅ **CitasCliente.jsx** - Complementa Turnos
6. ✅ **ReservarCita.jsx** - Modular y reutilizable

### Fase 3: Admin (Día 3)
7. ✅ **AdminDoctores.jsx** - Complex pero sigue patrón
8. ✅ **AdminEspecialidades.jsx** - Más simple
9. ✅ **AdminHorarios.jsx** - Más simple

### Fase 4: Pulido (Día 4)
10. ✅ **Otros componentes** - Home, Dashboard, etc.
11. ✅ **Componentes atómicos** - Reutilizables
12. ✅ **Contextos globales** - AuthContext, UserContext

---

## 📝 CHECKLIST POR REFACTOR

Para cada página/componente a refactorizar:

```
[ ] Crear hooks necesarios
[ ] Crear servicios si es necesario
[ ] Crear componentes atómicos/molecules
[ ] Crear componentes organisms
[ ] Reemplazar api.get/post con servicios
[ ] Reemplazar mensajes con MESSAGES
[ ] Reemplazar colores con THEME
[ ] Reemplazar validaciones con validators
[ ] Remover estilos inline
[ ] Documentar con JSDoc
[ ] Testear funcionalidad básica
[ ] Verificar no hay errores en consola
```

---

**Total de trabajo:** ~6 horas de refactor
**Inicio recomendado:** Mañana en la mañana
**Commits sugeridos por página**

