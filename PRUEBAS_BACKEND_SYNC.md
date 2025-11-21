# ✅ Frontend Sincronizado con Backend - Guía de Pruebas

## 🎯 Cambios Implementados

El frontend ha sido **completamente sincronizado** con el backend actualizado de Spring Boot + MySQL.

---

## 📋 CHECKLIST DE VERIFICACIÓN

### ✅ 1. Configuración Base
- [x] API base configurada en `http://localhost:8080`
- [x] Interceptor de tokens usando `localStorage.getItem('token')`
- [x] Manejo de errores global mejorado (400, 401, 404, 500)
- [x] Token y usuario almacenados por separado en localStorage

### ✅ 2. Autenticación
- [x] Login adaptado a estructura `{token, usuario}` del backend
- [x] authService guarda token por separado
- [x] Interceptor agrega automáticamente `Authorization: Bearer {token}`
- [x] Logout limpia ambos: token y usuario

### ✅ 3. Doctores
- [x] POST/PUT usan FormData con `multipart/form-data`
- [x] Imágenes se envían correctamente
- [x] URLs de imágenes: `http://localhost:8080${doctor.imagen}`

### ✅ 4. Especialidades
- [x] POST/PUT usan FormData (ya estaba implementado)
- [x] URLs de imágenes: `http://localhost:8080${especialidad.imagen}`

### ✅ 5. Horarios (FIX CRÍTICO APLICADO)
- [x] **idDoctor ahora es Number plano, NO objeto anidado**
- [x] Payload: `{fecha, turno, horaInicio, horaFin, idDoctor, disponible}`
- [x] Validación estricta de tipo number
- [x] Formato de horas: HH:MM:SS automático
- [x] Select de doctor correctamente vinculado

### ✅ 6. Citas
- [x] Estructura actualizada: `{date, description, doctorId}`
- [x] date en formato ISO: `YYYY-MM-DDTHH:MM:SS`
- [x] Token obtenido directamente de localStorage

### ✅ 7. Imágenes
- [x] Todas las URLs actualizadas a `http://localhost:8080${ruta}`
- [x] Fallback con onError en todos los componentes

---

## 🚀 PASOS PARA PROBAR

### 1️⃣ Verificar Backend
```powershell
# El backend debe estar corriendo en http://localhost:8080
# Verifica que MySQL esté activo
# Ejecuta: .\mvnw.cmd spring-boot:run
```

### 2️⃣ Limpiar LocalStorage (Importante)
```javascript
// En la consola del navegador:
localStorage.clear()
```

### 3️⃣ Probar Login
```
1. Ir a http://localhost:5174/login
2. Credenciales Admin:
   - Email: admin@sigc.com
   - Password: Admin123456
3. Verificar en consola:
   ✅ "📥 Response: {token, usuario}"
   ✅ localStorage.getItem('token') existe
   ✅ localStorage.getItem('usuario') existe
4. Debe redirigir a /admin
```

### 4️⃣ Probar Doctores
```
1. Ir a Admin > Gestión de Doctores
2. Crear nuevo doctor CON IMAGEN:
   - Nombre: Dr. Test
   - Especialidad: Cardiología
   - Cupo: 10
   - Imagen: Seleccionar JPG/PNG/WEBP
3. Verificar en consola:
   ✅ "📤 Enviando datos al backend"
   ✅ "Content-Type: multipart/form-data"
   ✅ "✅ Doctor creado"
4. La imagen debe mostrarse correctamente
```

### 5️⃣ Probar Especialidades
```
1. Ir a Admin > Gestión de Especialidades
2. Crear nueva especialidad CON IMAGEN
3. Verificar que la imagen se sube y muestra
4. Editar especialidad y cambiar imagen
```

### 6️⃣ Probar Horarios (CRÍTICO)
```
1. Ir a Admin > Gestión de Horarios
2. IMPORTANTE: Primero crear doctores si no existen
3. Crear nuevo horario:
   - Fecha: 2025-11-25
   - Turno: Mañana
   - Hora Inicio: 08:00
   - Hora Fin: 12:00
   - Doctor: Seleccionar de la lista
4. Verificar en consola:
   ✅ "🔍 Doctor seleccionado ID: 1 number"
   ✅ "📋 Tipo de idDoctor: number"
   ✅ "🔍 Validando idDoctor: {esNumero: true}"
   ✅ "📤 Payload a enviar: {idDoctor: 1, ...}"
   ✅ Response 200 o 201
5. Si ves error 400, revisar logs del backend
```

### 7️⃣ Probar Citas
```
1. Logout del admin
2. Login como paciente:
   - Email: juan@cliente.com
   - Password: Admin123456
3. Ir a Turnos
4. Seleccionar especialidad
5. Seleccionar doctor
6. Reservar cita
7. Verificar en consola:
   ✅ "📤 Enviando cita: {date, description, doctorId}"
   ✅ date: "2025-11-25T08:00:00"
   ✅ doctorId: 1 (number)
```

---

## 🐛 ERRORES COMUNES Y SOLUCIONES

### ❌ Error: 401 Unauthorized
**Causa:** Token expirado o inválido
**Solución:**
```javascript
// Limpiar localStorage y hacer login de nuevo
localStorage.clear()
```

### ❌ Error: 400 Bad Request en Horarios
**Causa:** idDoctor no es número o estructura incorrecta
**Verificar en consola:**
```
🔍 Doctor seleccionado ID: X number  ← Debe ser "number"
📋 Tipo de idDoctor: number          ← Debe ser "number"
```
**Si es string, el select no está parseando:**
```jsx
// Verificar que handleChangeDoctor tenga:
const idDoctor = parseInt(e.target.value, 10);
```

### ❌ Error: 500 Internal Server Error en Doctores/Especialidades
**Causa:** Backend no maneja FormData o endpoint no existe
**Verificar:**
1. Backend tiene `@PostMapping` con `@RequestParam("imagen") MultipartFile`
2. Spring configurado con `spring.servlet.multipart.enabled=true`

### ❌ Imágenes no se muestran
**Causa:** Ruta incorrecta
**Verificar:**
```jsx
// Debe ser:
src={`http://localhost:8080${imagen}`}

// NO:
src={imagen}
src={`http://localhost:8080/images/${imagen}`}
```

### ❌ Error: "No hay doctores disponibles"
**Causa:** No se han registrado doctores
**Solución:**
1. Ir a Admin > Gestión de Doctores
2. Crear al menos un doctor
3. Luego crear horarios

---

## 📊 LOGS ESPERADOS

### Login Exitoso
```
📤 POST /auth/login
📥 Response: {token: "eyJ...", usuario: {...}}
✅ Token guardado en localStorage
```

### Crear Horario
```
🔍 Doctor seleccionado ID: 1 number
📋 Datos del formulario antes de guardar: {idDoctor: 1, ...}
📋 Tipo de idDoctor: number
🔍 Validando idDoctor: {idDoctor: 1, tipo: "number", esNumero: true}
📤 Payload a enviar: {
  fecha: "2025-11-25",
  turno: "Mañana",
  horaInicio: "08:00:00",
  horaFin: "12:00:00",
  idDoctor: 1,
  disponible: true
}
✅ Horario guardado
```

### Crear Cita
```
DEBUG - Token: existe
📤 Enviando cita: {
  date: "2025-11-25T08:00:00",
  description: "Consulta - Mañana",
  doctorId: 1
}
✅ Cita creada exitosamente
```

---

## 🎓 CONCEPTOS CLAVE

### 1. Estructura de idDoctor (CRÍTICO)
```javascript
// ❌ INCORRECTO (antiguo)
{
  doctor: {
    idDoctor: 1
  }
}

// ✅ CORRECTO (actual)
{
  idDoctor: 1  // Number plano
}
```

### 2. Token en LocalStorage
```javascript
// ❌ INCORRECTO (antiguo)
const token = JSON.parse(localStorage.getItem('usuario')).token

// ✅ CORRECTO (actual)
const token = localStorage.getItem('token')
```

### 3. FormData para Imágenes
```javascript
// Siempre usar FormData cuando hay archivos
const formData = new FormData();
formData.append('nombre', 'Dr. Test');
formData.append('imagen', fileInput.files[0]);

axios.post('/doctores', formData, {
  headers: {'Content-Type': 'multipart/form-data'}
});
```

### 4. URLs de Imágenes
```javascript
// Backend devuelve ruta completa: "/uploads/doctors/abc.jpg"
const imgUrl = `http://localhost:8080${doctor.imagen}`;
```

---

## 📝 NOTAS FINALES

- **TODOS los cambios mantienen principios SOLID**
- **Backend DEBE estar corriendo en puerto 8080**
- **MySQL debe estar activo y con datos migrados**
- **Si algo falla, revisar logs del backend primero**
- **LocalStorage debe limpiarse después de cambios de estructura**

---

## 🆘 SOPORTE

Si encuentras errores:
1. Verifica que el backend esté corriendo
2. Limpia localStorage
3. Revisa logs en consola del navegador
4. Revisa logs del backend Spring Boot
5. Verifica que la estructura de datos coincida con esta guía

**Última actualización:** 21 de noviembre de 2025
**Versión Backend:** Spring Boot con MySQL
**Puerto Backend:** 8080
**Puerto Frontend:** 5174
