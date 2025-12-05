# 🔧 GUÍA DE DIAGNÓSTICO PARA EL EQUIPO DEL BACKEND

**Fecha:** 5 de diciembre de 2025  
**Problema:** Los endpoints PUT y POST en `/doctores/{id}/json` y `/doctores/json` están retornando errores 400/500

---

## 📋 Resumen del Problema

El frontend está intentando actualizar doctores pero recibe errores:
- **Error 400 (Bad Request):** Validación rechazando datos válidos
- **Error 500 (Internal Server Error):** Errores internos en el servidor

### Comandos Probados Desde el Frontend

```powershell
# Todos estos comandos retornan error 400 o 500
curl -X PUT http://localhost:8080/doctores/1/json \
  -H "Content-Type: application/json" \
  -d '{"nombre":"María","especialidad":"Medicina General","cupoPacientes":16}'

# Incluso con exactamente los mismos campos que devuelve GET:
curl -X PUT http://localhost:8080/doctores/1/json \
  -H "Content-Type: application/json" \
  -d '{
    "idDoctor": 1,
    "nombre": "María",
    "apellido": null,
    "telefono": null,
    "correo": null,
    "especialidadId": null,
    "especialidad": "Medicina General",
    "cupoPacientes": 16,
    "imagen": "/uploads/doctores/default_doctor.png"
  }'
```

**Resultado:** Todos retornan error 400 Bad Request

---

## 🔍 Pasos para Diagnosticar

### 1. **Revisar Logs del Servidor Backend**

```bash
# Si es Java/Spring Boot
tail -f logs/application.log
grep -i "error\|exception" logs/application.log | tail -50

# Si es Docker
docker logs -f nombre_contenedor | grep -i error

# Si es Node.js
npm run dev
# Ver output en consola
```

**Busca específicamente:**
- Mensajes de error al recibir PUT a `/doctores/{id}/json`
- Stack traces de excepciones
- Mensajes de validación

### 2. **Probar Directamente en el Backend**

```bash
# SSH/RDP al servidor del backend

# Prueba 1: GET funciona?
curl http://localhost:8080/doctores

# Prueba 2: PUT con datos mínimos
curl -X PUT http://localhost:8080/doctores/1/json \
  -H "Content-Type: application/json" \
  -d '{"nombre":"Test"}'

# Prueba 3: POST con datos mínimos  
curl -X POST http://localhost:8080/doctores/json \
  -H "Content-Type: application/json" \
  -d '{"nombre":"Test","especialidad":"Medicina General","cupoPacientes":5}'
```

### 3. **Verificar Base de Datos**

```sql
-- Conectarse a la BD
mysql -u usuario -p
USE nombre_bd;

-- Ver estructura de tabla doctores
DESCRIBE doctores;

-- Ver doctores existentes
SELECT * FROM doctores LIMIT 5;

-- Ver si hay restricciones o triggers
SHOW CREATE TABLE doctores;

-- Ver triggers
SHOW TRIGGERS WHERE `trigger_table` = 'doctores';
```

**Checklist:**
- [ ] Tabla `doctores` existe
- [ ] Campos coinciden con estructura esperada
- [ ] No hay restricciones de clave única conflictivas
- [ ] No hay triggers que causen problemas

### 4. **Revisar Código del Backend**

**Busca el código del endpoint PUT:**

```java
// Java/Spring Boot
@PutMapping("/doctores/{id}/json")
public ResponseEntity<?> actualizarDoctor(
    @PathVariable Long id,
    @RequestBody DoctorDTO doctorDTO
) {
    // Revisar validaciones aquí
    // ¿Hay @Valid o validaciones manuales?
    // ¿Se está rechazando algún campo?
}
```

```javascript
// Node.js/Express
router.put('/doctores/:id/json', (req, res) => {
    // Revisar validaciones
    // ¿Qué campos se esperan?
    // ¿Hay validaciones muy estrictas?
});
```

**Preguntas a responder:**
- ¿Hay validaciones en el DTO que rechacen datos válidos?
- ¿El método de actualización está intentando actualizar campos que no debería?
- ¿Hay restricciones de base de datos que no se cumplen?

---

## 🎯 Causas Probables (En Orden de Probabilidad)

### 1. **Validación sobre-restrictiva en DTO (70% probable)**

```java
// PROBLEMA PROBABLE:
@Data
public class DoctorDTO {
    @NotBlank // ← Puede causar problemas
    private String nombre;
    
    @NotNull
    private String especialidad;
    
    @Min(1) // ← Si es 0, rechaza
    private Integer cupoPacientes;
}
```

**Solución:**
```java
// CORRECCIÓN:
@Data
public class DoctorDTO {
    @NotBlank(message = "Nombre es requerido")
    private String nombre;
    
    private String especialidad; // ← No requiere notificación
    
    @Positive(message = "Cupo debe ser positivo")
    private Integer cupoPacientes;
}
```

### 2. **Problema con campos null (60% probable)**

El backend puede estar rechazando campos `null` que el frontend intenta enviar.

**Solución:**
```java
// Usar Optional
@Data
public class DoctorDTO {
    private String nombre;
    private Optional<String> apellido = Optional.empty();
    private Optional<String> telefono = Optional.empty();
    // ...
}
```

### 3. **Problema con Transacciones (50% probable)**

```java
// PROBLEMA:
@Transactional
public Doctor actualizar(Long id, DoctorDTO dto) {
    // Si falla aquí, no hay rollback
    Doctor doctor = repo.findById(id).orElseThrow();
    // Actualizar campos...
    return repo.save(doctor); // ← ¿Qué pasa si falla aquí?
}
```

### 4. **Conflicto con Especialidades (40% probable)**

El backend espera `especialidadId` pero estamos mandando `especialidad` (nombre).

**Verificar:**
```java
// ¿El DTO espera especialidadId o especialidad?
public class DoctorDTO {
    private Long especialidadId; // ← ¿O debería ser String?
}
```

---

## 🚀 Pasos para Arreglar

### Opción A: Arreglar Backend (RECOMENDADO)

1. **Revisar los logs** → Encontrar el error exacto
2. **Ajustar validaciones** → Hacer menos restrictivas
3. **Probar con curl** → Verificar que funcione
4. **Notificar al frontend**

### Opción B: Temporal (Si no se puede arreglar rápido)

1. **Crear endpoint temporal** `/doctores/{id}/update-simple`
2. **Con validación más flexible**
3. **Que funcione mientras se arregla el otro**

---

## 📊 Checklist de Resolución

- [ ] Revisar logs y encontrar error exacto
- [ ] Identificar si es validación, BD, o lógica de código
- [ ] Arreglar el problema
- [ ] Probar con curl
- [ ] Probar desde el frontend
- [ ] Notificar al frontend que funciona

---

## 📞 Información para Contactar

**Desde el Frontend:**
- Los endpoints `/doctores/json` (POST) y `/doctores/{id}/json` (PUT) no funcionan
- Retornan error 400 Bad Request o 500 Internal Server Error
- El GET `/doctores` funciona perfectamente
- Se han probado múltiples formatos de datos

**Datos de Prueba:**
```json
{
  "nombre": "María",
  "especialidad": "Medicina General",
  "cupoPacientes": 20
}
```

Este JSON debería funcionar en:
- `PUT /doctores/1/json`
- `POST /doctores/json`

---

## 🔗 Enlaces Útiles

- [Spring Boot Validation](https://spring.io/guides/gs/validating-form-input/)
- [Express Middleware Validation](https://express-validator.github.io/docs/)
- [JSON Schema Validation](https://json-schema.org/)

---

**Última actualización:** 5 de diciembre de 2025  
**Prioridad:** ALTA - Bloquea funcionalidad de administración