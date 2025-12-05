# 🚀 Guía de Testing APIs - SIGC Backend

## 📦 Archivos Postman Creados

1. **`SIGC_Backend_APIs.postman_collection.json`** - Colección completa de APIs
2. **`SIGC_Development.postman_environment.json`** - Entorno de desarrollo

## 🔧 Importar en Postman

### Paso 1: Importar Colección
```bash
# En Postman:
File → Import → Seleccionar archivo
→ SIGC_Backend_APIs.postman_collection.json
```

### Paso 2: Importar Entorno
```bash
# En Postman:
File → Import → Seleccionar archivo  
→ SIGC_Development.postman_environment.json
```

### Paso 3: Activar Entorno
```bash
# En Postman, esquina superior derecha:
Seleccionar "SIGC Development"
```

---

## 🎯 APIs Organizadas

### 🔐 **1. Autenticación**
```bash
POST /auth/login          # Login de usuarios
POST /auth/register       # Registro de nuevos usuarios  
GET  /auth/me            # Perfil del usuario autenticado
```

### 🏥 **2. Especialidades CRUD**
```bash
GET    /especialidades              # Listar todas
POST   /especialidades              # Crear nueva (ADMIN)
PUT    /especialidades/{id}         # Actualizar (ADMIN)
DELETE /especialidades/{id}         # Eliminar (ADMIN)
```

### 👩‍⚕️ **3. Doctores CRUD**
```bash
GET    /doctores                    # Listar todos
GET    /doctores/especialidad/{id}  # Por especialidad
POST   /doctores                    # Crear nuevo (ADMIN)
PUT    /doctores/{id}               # Actualizar (ADMIN)
DELETE /doctores/{id}               # Eliminar (ADMIN)
```

### 📅 **4. Citas CRUD**
```bash
POST /citas                        # Crear cita
GET  /citas                        # Todas las citas (ADMIN)
GET  /citas/usuario/{id}           # Citas de un usuario
PUT  /citas/{id}/cancelar          # Cancelar cita
PUT  /citas/{id}                   # Actualizar estado (ADMIN)
```

### 🕐 **5. Horarios**
```bash
GET  /horarios/doctor/{id}/fecha/{fecha}  # Horarios disponibles
POST /horarios                            # Configurar horarios (ADMIN)
```

### 👥 **6. Usuarios (Admin)**
```bash
GET /usuarios                      # Listar todos (ADMIN)
PUT /usuarios/{id}/rol            # Cambiar rol (ADMIN)
PUT /usuarios/{id}/desactivar     # Desactivar (ADMIN)
```

### 📊 **7. Dashboard**
```bash
GET /dashboard/admin              # Estadísticas admin
GET /dashboard/cliente            # Resumen cliente
```

---

## 🧪 Secuencia de Testing

### **Paso 1: Autenticación**
```bash
1. POST /auth/login (Admin)
   Email: admin@sigc.com
   Password: admin123

2. POST /auth/login (Paciente)  
   Email: paciente@sigc.com
   Password: paciente123
```

### **Paso 2: Datos Base (Como Admin)**
```bash
3. POST /especialidades (Crear especialidad)
4. POST /doctores (Crear doctor)
5. POST /horarios (Configurar horarios)
```

### **Paso 3: Flujo Usuario (Como Paciente)**
```bash
6. GET /especialidades (Ver disponibles)
7. GET /doctores/especialidad/1 (Ver doctores)
8. GET /horarios/doctor/1/fecha/2024-12-15 (Ver horarios)
9. POST /citas (Agendar cita)
10. GET /citas/usuario/{user_id} (Ver mis citas)
```

### **Paso 4: Gestión Admin**
```bash
11. GET /citas (Ver todas las citas)
12. GET /dashboard/admin (Estadísticas)
13. PUT /citas/1 (Cambiar estado cita)
```

---

## 📝 Datos de Prueba

### **Login Credenciales**
```json
// Admin
{
  "email": "admin@sigc.com",
  "password": "admin123"
}

// Paciente  
{
  "email": "paciente@sigc.com", 
  "password": "paciente123"
}
```

### **Crear Especialidad**
```json
{
  "nombre": "Cardiología",
  "descripcion": "Especialidad del corazón",
  "imagen": "https://via.placeholder.com/300x200"
}
```

### **Crear Doctor**
```json
{
  "nombre": "Dr. Carlos Mendoza",
  "especialidad_id": 1,
  "email": "carlos@hospital.com",
  "telefono": "+51987654321",
  "imagen": "https://via.placeholder.com/150x150"
}
```

### **Crear Cita**
```json
{
  "doctor_id": 1,
  "fecha": "2024-12-15", 
  "hora": "10:00",
  "motivo": "Consulta general",
  "notas": "Dolor en el pecho"
}
```

---

## 🔑 Variables de Entorno

Las siguientes variables se configuran automáticamente:

- **`base_url`** = `http://localhost:8080`
- **`auth_token`** = Se guarda automáticamente tras login
- **`user_id`** = ID del usuario autenticado
- **`user_rol`** = Rol del usuario (ADMIN/PACIENTE)

---

## ✅ Tests Automáticos

Cada request incluye tests que verifican:

- ✅ Status code no es 500
- ✅ Response time < 5000ms  
- ✅ Response es JSON válido
- ✅ Token se guarda automáticamente tras login

---

## 🎯 Endpoints Críticos para Frontend

**Tu frontend SIGC necesita estos endpoints funcionando:**

```bash
# Autenticación
POST /auth/login ✓
POST /auth/register ✓

# Datos públicos  
GET /especialidades ✓
GET /doctores ✓
GET /doctores/especialidad/{id} ✓

# Sistema de citas
GET /horarios/doctor/{id}/fecha/{fecha} ✓
POST /citas ✓
GET /citas/usuario/{id} ✓
PUT /citas/{id}/cancelar ✓

# Admin (opcional)
GET /dashboard/admin ✓
CRUD Especialidades ✓
CRUD Doctores ✓
```

---

## 🚀 Listo para Testing

**Importa los archivos en Postman y empieza a probar tu backend!**

1. ✅ Colección completa con 25+ endpoints
2. ✅ Entorno configurado 
3. ✅ Tests automáticos
4. ✅ Documentación incluida
5. ✅ Variables automáticas
6. ✅ Flujo completo de testing

**¡Ahora puedes probar todos los endpoints que tu frontend SIGC necesita! 🎉**