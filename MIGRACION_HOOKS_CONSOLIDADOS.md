# 📚 Guía de Migración a Hooks Consolidados

## 🎯 Objetivo

Se han creado **hooks consolidados** que unifican funcionalidades duplicadas y mejoran la API de los hooks admin. Esta guía explica cómo migrar del código antiguo al nuevo.

---

## ✨ Ventajas de los Hooks Consolidados

### Antes (Código duplicado)

```javascript
// Había 2 hooks haciendo lo mismo:
import { useDoctoresAdmin } from './hooks/admin/useDoctoresAdmin';
import { useDoctoresAdmin as useGestionDoctores } from './hooks/useGestionDoctores';

// ❌ Problema: Duplicación de lógica
// ❌ Problema: APIs inconsistentes
// ❌ Problema: Difícil de mantener
```

### Ahora (Un solo hook consolidado)

```javascript
// Un solo hook con toda la funcionalidad:
import { useDoctoresAdminConsolidated } from './hooks/admin';

// ✅ Sin duplicación
// ✅ API consistente
// ✅ Fácil de mantener
// ✅ Mejor documentación JSDoc
```

---

## 🔄 Migración por Hook

### 1️⃣ useDoctoresAdmin

#### **Código Anterior**

```javascript
import { useDoctoresAdmin } from '../hooks/useGestionDoctores';

function AdminDoctores() {
  const { doctores, especialidades, loading, guardarDoctor, eliminarDoctor } = useDoctoresAdmin();

  const handleSubmit = async (formData) => {
    const success = await guardarDoctor(formData, modoEdicion ? doctorId : null);
    if (success) {
      // ...
    }
  };
}
```

#### **Código Nuevo (Recomendado)**

```javascript
import { useDoctoresAdminConsolidated } from '../hooks/admin';

function AdminDoctores() {
  const { 
    doctores, 
    especialidades, 
    loading, 
    error,
    guardarDoctor,    // Crear o actualizar
    crearDoctor,      // Solo crear (alias)
    actualizarDoctor, // Solo actualizar (alias)
    eliminarDoctor,
    recargar
  } = useDoctoresAdminConsolidated();

  const handleSubmit = async (formData) => {
    // Opción 1: Usar guardarDoctor (como antes)
    const success = await guardarDoctor(formData, modoEdicion ? doctorId : null);
    
    // Opción 2: Usar métodos específicos (más claro)
    const success = modoEdicion 
      ? await actualizarDoctor(doctorId, formData)
      : await crearDoctor(formData);
    
    if (success) {
      // ...
    }
  };
}
```

#### **Cambios Principales**

| Antes | Ahora | Notas |
|-------|-------|-------|
| `guardarDoctor(data, id)` | `guardarDoctor(data, id)` | Sigue funcionando igual |
| N/A | `crearDoctor(data)` | Nuevo: Alias para crear |
| N/A | `actualizarDoctor(id, data)` | Nuevo: Alias para actualizar |
| `eliminarDoctor(id)` | `eliminarDoctor(id)` | Sigue igual |
| N/A | `error` | Nuevo: Estado de error |
| N/A | `recargar()` | Nuevo: Recargar todo |

---

### 2️⃣ useEspecialidadesAdmin

#### **Código Anterior**

```javascript
import { useGestionEspecialidades } from '../hooks';

function AdminEspecialidades() {
  const { especialidades, loading, guardar, eliminar } = useGestionEspecialidades();
}
```

#### **Código Nuevo (Recomendado)**

```javascript
import { useEspecialidadesAdminConsolidated } from '../hooks/admin';

function AdminEspecialidades() {
  const { 
    especialidades, 
    loading, 
    error,
    guardarEspecialidad,
    crearEspecialidad,      // Alias
    actualizarEspecialidad, // Alias
    eliminarEspecialidad,
    recargar
  } = useEspecialidadesAdminConsolidated();
}
```

---

### 3️⃣ useHorariosAdmin

#### **Código Anterior**

```javascript
import { useGestionHorarios } from '../hooks';

function AdminHorarios() {
  const { horarios, doctores, loading, guardar, eliminar } = useGestionHorarios();
}
```

#### **Código Nuevo (Recomendado)**

```javascript
import { useHorariosAdminConsolidated } from '../hooks/admin';

function AdminHorarios() {
  const { 
    horarios, 
    doctores,
    especialidades, // Nuevo: También carga especialidades
    loading, 
    error,
    guardarHorario,
    crearHorario,      // Alias
    actualizarHorario, // Alias
    eliminarHorario,
    recargar
  } = useHorariosAdminConsolidated();
}
```

---

## 📋 Checklist de Migración

### Por cada archivo que use hooks admin:

- [ ] Identificar qué hook usa actualmente
- [ ] Reemplazar import con versión consolidada
- [ ] Actualizar destructuring para incluir nuevos campos (`error`, `recargar`)
- [ ] (Opcional) Usar métodos específicos (`crearX`, `actualizarX`) en vez de `guardarX`
- [ ] Probar que todo funciona correctamente
- [ ] Eliminar imports antiguos

---

## 🎨 Ejemplo Completo de Migración

### **ANTES** - AdminDoctores.jsx (versión antigua)

```javascript
import { useState } from "react";
import { useDoctoresAdmin } from "../hooks/useGestionDoctores";

export default function AdminDoctores() {
  const { doctores, especialidades, loading, guardarDoctor, eliminarDoctor } = useDoctoresAdmin();
  const [modoEdicion, setModoEdicion] = useState(false);
  const [doctorId, setDoctorId] = useState(null);

  const handleSubmit = async (formData) => {
    const success = await guardarDoctor(formData, modoEdicion ? doctorId : null);
    if (success) {
      resetForm();
    }
  };

  const handleEliminar = async (id) => {
    await eliminarDoctor(id);
  };

  return (
    <div>
      {/* Formulario y tabla */}
    </div>
  );
}
```

### **DESPUÉS** - AdminDoctores.jsx (versión consolidada)

```javascript
import { useState } from "react";
import { useDoctoresAdminConsolidated } from "../hooks/admin";
import { DoctorForm } from "../components/organisms/DoctorForm";

export default function AdminDoctores() {
  const { 
    doctores, 
    especialidades, 
    loading, 
    error,
    crearDoctor,
    actualizarDoctor,
    eliminarDoctor,
    recargar
  } = useDoctoresAdminConsolidated();
  
  const [modoEdicion, setModoEdicion] = useState(false);
  const [doctorId, setDoctorId] = useState(null);

  // Método más claro usando funciones específicas
  const handleSubmit = async (formData) => {
    const success = modoEdicion
      ? await actualizarDoctor(doctorId, formData)
      : await crearDoctor(formData);
      
    if (success) {
      resetForm();
    }
  };

  const handleEliminar = async (id) => {
    await eliminarDoctor(id);
  };

  // Mostrar error si existe
  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }

  return (
    <div>
      {/* Ahora puedes usar el componente DoctorForm organism */}
      <DoctorForm
        initialData={modoEdicion ? getCurrentDoctor() : undefined}
        especialidades={especialidades}
        onSubmit={handleSubmit}
        onCancel={() => setModoEdicion(false)}
        isEditing={modoEdicion}
        loading={loading}
      />
      
      {/* Tabla de doctores */}
    </div>
  );
}
```

---

## 🚀 Nuevas Características

### 1. Estado de Error

```javascript
const { error } = useDoctoresAdminConsolidated();

// Mostrar error global
{error && <div className="alert alert-danger">{error}</div>}
```

### 2. Función de Recarga

```javascript
const { recargar } = useDoctoresAdminConsolidated();

// Recargar todo manualmente
<button onClick={recargar}>🔄 Recargar</button>
```

### 3. Validaciones Integradas

Los hooks consolidados incluyen validaciones antes de enviar:

```javascript
// ✅ Valida automáticamente antes de enviar
await crearDoctor({
  nombre: "Dr. Juan",
  especialidad: "", // ❌ Error: "La especialidad es obligatoria"
  cupoPacientes: 25  // ❌ Error: "El cupo debe ser entre 1 y 20"
});
```

### 4. Mejor Logging

```javascript
// Los hooks consolidados incluyen console.log detallado:
// 📤 Enviando datos al backend...
// ✅ Doctor creado: { id: 1, nombre: "Dr. Juan" }
// ❌ Error: [detalles del error]
```

---

## ⚠️ Notas de Compatibilidad

### Retrocompatibilidad

Los hooks consolidados **mantienen compatibilidad** con el código anterior:

```javascript
// ✅ Esto sigue funcionando:
await guardarDoctor(formData, id);

// ✅ Pero esto es más claro:
await actualizarDoctor(id, formData);
```

### Deprecación Gradual

Los hooks antiguos están marcados como **DEPRECATED** pero **siguen funcionando**:

```javascript
// ⚠️ DEPRECATED (pero funciona)
import { useDoctoresAdmin } from './hooks/admin/useDoctoresAdmin';

// ✅ RECOMENDADO
import { useDoctoresAdminConsolidated } from './hooks/admin';
```

---

## 📊 Comparación de APIs

### Doctores

| Método | Hook Antiguo | Hook Consolidado |
|--------|-------------|------------------|
| Cargar | `useEffect(() => cargarDoctores())` | Automático |
| Crear | `guardarDoctor(data, null)` | `crearDoctor(data)` |
| Actualizar | `guardarDoctor(data, id)` | `actualizarDoctor(id, data)` |
| Eliminar | `eliminarDoctor(id)` | `eliminarDoctor(id)` |
| Recargar | `cargarDoctores()` | `recargar()` |
| Error | N/A | `error` |

### Especialidades

| Método | Hook Antiguo | Hook Consolidado |
|--------|-------------|------------------|
| Cargar | Manual | Automático |
| Crear | `guardar(data)` | `crearEspecialidad(data)` |
| Actualizar | `guardar(data, id)` | `actualizarEspecialidad(id, data)` |
| Eliminar | `eliminar(id)` | `eliminarEspecialidad(id)` |

### Horarios

| Método | Hook Antiguo | Hook Consolidado |
|--------|-------------|------------------|
| Cargar | Manual | Automático |
| Crear | `guardar(data)` | `crearHorario(data)` |
| Actualizar | `guardar(data, id)` | `actualizarHorario(id, data)` |
| Eliminar | `eliminar(id)` | `eliminarHorario(id)` |

---

## ✅ Ventajas Resumidas

1. **Sin duplicación** - Un solo hook por entidad
2. **API consistente** - Mismos nombres en todos los hooks
3. **Validaciones integradas** - Menos código boilerplate
4. **Mejor manejo de errores** - Estado `error` centralizado
5. **Carga automática** - useEffect integrado
6. **Aliases claros** - `crearX`, `actualizarX` más legibles
7. **Mejor documentación** - JSDoc completo
8. **Fácil testing** - Lógica centralizada

---

## 🎓 Recomendaciones

1. **Migra gradualmente** - Un archivo a la vez
2. **Prueba después de cada cambio** - Asegúrate que funciona
3. **Usa los aliases** - `crearDoctor` es más claro que `guardarDoctor(data, null)`
4. **Aprovecha el estado error** - Muestra mensajes al usuario
5. **Usa los organisms** - Combina hooks consolidados con componentes organism

---

## 📞 Soporte

Si tienes dudas sobre la migración:

1. Revisa los ejemplos en esta guía
2. Consulta los JSDoc en los archivos consolidados
3. Compara el código antes/después

---

**Última actualización**: 20 de noviembre de 2025  
**Hooks consolidados**: v1.0.0
