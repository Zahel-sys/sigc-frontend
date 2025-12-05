# 🔧 Backend Fix Prompts - SIGC Doctor Management

## Situación Actual
El frontend del SIGC tiene funciones CRUD para doctores funcionando con **mock data** temporalmente debido a errores de validación en los endpoints del backend:
- **POST /doctores** → Error 400/500 en creación
- **PUT /doctores/{id}** → Error 400/500 en actualización

El frontend espera una respuesta exitosa y continúa funcionando con mock, pero necesita que estos endpoints se corrijan para productividad.

---

## 📝 Prompt 1: Diagnosticar Error POST /doctores

### Contexto
El endpoint `POST /doctores` está retornando errores 400 o 500 cuando se intenta crear un nuevo doctor. El frontend envía los siguientes datos de prueba:

```json
{
  "nombre": "Dr. Juan Pérez",
  "especialidad": "Cardiología",
  "cupoPacientes": 20,
  "imagen": "doctor_image.jpg"  // opcional, puede ser null
}
```

### Tareas para Backend
1. **Revisar validaciones en el controller/endpoint POST /doctores**:
   - ¿Se están validando correctamente los campos requeridos?
   - ¿Hay restricciones de longitud en `nombre` o `especialidad`?
   - ¿El campo `cupoPacientes` debe ser un número positivo?
   - ¿Hay validación de email del doctor que no se está considerando?

2. **Verificar la respuesta esperada**:
   - El frontend espera recibir al menos: `{ idDoctor, nombre, especialidad, cupoPacientes }`
   - Si hay otros campos requeridos por el backend, documentarlos

3. **Revisar logs del servidor**:
   - Ejecutar `docker logs <backend-container>` o similar
   - Buscar stack traces completos del error 400/500
   - Identificar qué validación está fallando

### Endpoint Esperado
```
POST /doctores
Content-Type: application/json

{
  "nombre": "string (requerido)",
  "especialidad": "string (requerido)",
  "cupoPacientes": "number (requerido)",
  "imagen": "file (opcional)"
}

Response 201:
{
  "idDoctor": "UUID o ID",
  "nombre": "string",
  "especialidad": "string",
  "cupoPacientes": "number"
}
```

---

## 📝 Prompt 2: Diagnosticar Error PUT /doctores/{id}

### Contexto
El endpoint `PUT /doctores/{id}` está retornando errores 400 o 500 cuando se intenta actualizar un doctor existente. El frontend envía los siguientes datos:

```json
{
  "nombre": "Dr. Carlos López",
  "especialidad": "Neurología",
  "cupoPacientes": 15,
  "imagen": "updated_image.jpg"  // opcional
}
```

### Tareas para Backend
1. **Revisar validaciones en el controller/endpoint PUT /doctores/{id}**:
   - ¿Se está validando el `id` correctamente?
   - ¿Se está verificando que el doctor existe antes de actualizar?
   - ¿Hay validaciones diferentes entre POST y PUT?
   - ¿El campo `cupoPacientes` permite actualización?

2. **Verificar parámetro de ruta**:
   - El frontend envía el ID en la ruta: `/doctores/{id}`
   - ¿Se está parseando correctamente el ID?
   - ¿Qué formato tiene el ID? (UUID, integer, string)

3. **Revisar comportamiento esperado**:
   - Si el doctor no existe, ¿retornar 404?
   - Si hay campos válidos pero otros fallan, ¿retornar error o actualizar parcialmente?

4. **Revisar logs del servidor**:
   - Buscar el stack trace completo del error
   - Identificar qué validación está fallando en la actualización

### Endpoint Esperado
```
PUT /doctores/{id}
Content-Type: application/json

{
  "nombre": "string (requerido)",
  "especialidad": "string (requerido)",
  "cupoPacientes": "number (requerido)",
  "imagen": "file (opcional)"
}

Response 200:
{
  "idDoctor": "UUID o ID",
  "nombre": "string",
  "especialidad": "string",
  "cupoPacientes": "number"
}
```

---

## 🧪 Prompt 3: Testing - Validar Endpoints POST y PUT

### Pasos para Verificar Correcciones

#### Con Postman o cURL:

**1. Test POST /doctores (Creación)**
```bash
curl -X POST http://localhost:8080/doctores \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Dr. Test Creation",
    "especialidad": "Test Specialty",
    "cupoPacientes": 20
  }'
```
✅ Esperado: Status 201 + objeto doctor con idDoctor

**2. Test PUT /doctores/{id} (Actualización)**
```bash
# Reemplazar {id} con un ID válido obtenido del GET anterior
curl -X PUT http://localhost:8080/doctores/{id} \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Dr. Test Updated",
    "especialidad": "Updated Specialty",
    "cupoPacientes": 25
  }'
```
✅ Esperado: Status 200 + objeto doctor actualizado

**3. Test GET /doctores (Verificar lectura)**
```bash
curl -X GET http://localhost:8080/doctores
```
✅ Esperado: Status 200 + array de doctores

---

## 🔍 Prompt 4: Common Backend Validation Issues

### Problemas Frecuentes en Endpoints CRUD:

| Problema | Síntoma | Solución |
|----------|---------|----------|
| **Validación nula** | Los campos no se validan | Agregar `@NotNull`, `@NotBlank` en DTOs |
| **Longitud excesiva** | El nombre es muy largo | Establecer `@Length` o `@Size` máximos |
| **Tipo de dato incorrecto** | cupoPacientes recibe string | Asegurar deserialización correcta con `@RequestBody` |
| **ID no encontrado** | PUT no encuentra el doctor | Verificar con `findById()` antes de actualizar |
| **Falta @PathVariable** | El ID no se recibe en PUT | Agregar `@PathVariable Long/UUID id` |
| **Content-Type incorrecto** | Los datos no se reciben | Verificar que `consumes = "application/json"` |
| **CORS bloqueado** | Las peticiones fallan desde frontend | Configurar `@CrossOrigin` si es necesario |
| **Token/Auth fallando** | 401/403 en la respuesta | Revisar interceptores de seguridad/JWT |

---

## 📋 Checklist de Corrección

- [ ] Revisar logs exactos del error (stack trace completo)
- [ ] Verificar DTOs de Doctor tienen validaciones apropiadas
- [ ] Confirmar POST /doctores retorna 201 con doctor creado
- [ ] Confirmar PUT /doctores/{id} retorna 200 con doctor actualizado
- [ ] Probar con cURL o Postman según ejemplos arriba
- [ ] Verificar que DELETE /doctores/{id} también funciona (si existe)
- [ ] Documentar cambios realizados para referencia futura
- [ ] Comunicar al frontend que los endpoints están corregidos

---

## 🔗 Información para Frontend

Una vez que los endpoints estén corregidos:

1. **Cambiar en `.env`:**
   ```env
   VITE_USE_MOCK_FOR_DOCTORS=false
   ```

2. **Reiniciar la aplicación** para cargar la nueva configuración

3. **Verificar en console** que aparece: ✅ Doctores obtenidos del backend

---

## 📞 Contacto

Si necesitas más detalles sobre el formato de datos esperado o tienes preguntas sobre la integración, el frontend está esperando que completes estos prompts.

**Información de Debugging Disponible:**
- Console logs con `📝`, `✅`, `❌` indican qué endpoints funcionan/fallan
- Mock data en `src/services/mockApi.js` muestra estructura esperada
- Validaciones en `src/pages/AdminDoctores.jsx` lines 45-48 muestran campos requeridos
