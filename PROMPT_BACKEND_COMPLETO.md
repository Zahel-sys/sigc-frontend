# 🚀 PROMPT COMPLETO: BACKEND SIGC OPTIMIZADO PARA EXPOSICIÓN

## 📋 CONTEXTO Y OBJETIVO

**Proyecto:** Sistema Integral de Gestión de Citas (SIGC) - Backend Spring Boot
**Tecnologías:** Spring Boot 3.5.8, Java 21, H2 Database, Maven
**Ubicación:** `C:\Users\LEONARDO\sigc-backend`

**OBJETIVO CRÍTICO:** Optimizar backend para cumplir rúbrica de exposición académica:
- ✅ Swagger/OpenAPI Documentation (4 pts)
- ✅ CRUD completo y funcional 
- ✅ Buenas prácticas de desarrollo
- ✅ Arquitectura SOLID bien estructurada
- ✅ Testing y validaciones

---

## 🎯 TAREAS PRIORITARIAS

### 1️⃣ **SWAGGER/OpenAPI Documentation (CRÍTICO - 4 pts)**

**Agregar dependencia en `pom.xml`:**
```xml
<!-- Después de las dependencias existentes -->
<dependency>
    <groupId>org.springdoc</groupId>
    <artifactId>springdoc-openapi-starter-webmvc-ui</artifactId>
    <version>2.2.0</version>
</dependency>
```

**Crear configuración Swagger en `src/main/java/com/sigc/backend/config/OpenApiConfig.java`:**
```java
@Configuration
@OpenAPIDefinition(
    info = @Info(
        title = "SIGC - Sistema Integral de Gestión de Citas",
        description = "API REST para gestión de citas médicas con autenticación JWT",
        version = "1.0.0",
        contact = @Contact(
            name = "Equipo SIGC",
            email = "sigc@example.com"
        )
    ),
    servers = {
        @Server(url = "http://localhost:8080", description = "Servidor de Desarrollo"),
        @Server(url = "https://sigc-backend.onrender.com", description = "Servidor de Producción")
    }
)
@SecurityScheme(
    name = "JWT",
    type = SecuritySchemeType.HTTP,
    scheme = "bearer",
    bearerFormat = "JWT"
)
public class OpenApiConfig {
}
```

**Documentar controladores con anotaciones:**
```java
@Tag(name = "Autenticación", description = "Endpoints para login y registro")
@SecurityRequirement(name = "JWT")

@Operation(summary = "Iniciar sesión", description = "Autentica usuario y retorna JWT token")
@ApiResponses({
    @ApiResponse(responseCode = "200", description = "Login exitoso"),
    @ApiResponse(responseCode = "401", description = "Credenciales inválidas")
})
```

### 2️⃣ **CRUD COMPLETO OPTIMIZADO**

**Estructura requerida para cada entidad:**
```
📁 controller/    - REST Controllers
📁 service/       - Business Logic
📁 repository/    - Data Access Layer  
📁 dto/          - Data Transfer Objects
📁 entity/       - JPA Entities
📁 exception/    - Custom Exceptions
```

**Entidades principales a optimizar:**
- ✅ Usuario (PACIENTE/ADMIN)
- ✅ Especialidad 
- ✅ Doctor
- ✅ Horario
- ✅ Cita
- ✅ Upload de archivos

### 3️⃣ **VALIDACIONES Y MANEJO DE ERRORES**

**GlobalExceptionHandler optimizado:**
```java
@RestControllerAdvice
public class GlobalExceptionHandler {
    
    @ExceptionHandler(MethodArgumentNotValidException.class)
    @ResponseStatus(BAD_REQUEST)
    public ApiErrorResponse handleValidation(MethodArgumentNotValidException ex) {
        // Manejo detallado de errores de validación
    }
    
    @ExceptionHandler(ResourceNotFoundException.class)
    @ResponseStatus(NOT_FOUND) 
    public ApiErrorResponse handleNotFound(ResourceNotFoundException ex) {
        // Manejo de recursos no encontrados
    }
}
```

### 4️⃣ **TESTING UNITARIO**

**Crear pruebas en `src/test/java/`:**
```java
@SpringBootTest
@TestPropertySource(properties = "spring.profiles.active=test")
class AuthControllerTest {
    
    @Test
    void login_ConCredencialesValidas_RetornaToken() {
        // Test de login exitoso
    }
    
    @Test
    void register_ConDatosValidos_CreaUsuario() {
        // Test de registro exitoso
    }
}
```

### 5️⃣ **CONFIGURACIÓN PROFILES**

**application-dev.properties:**
```properties
# Configuración desarrollo
spring.h2.console.enabled=true
logging.level.com.sigc=DEBUG
spring.jpa.show-sql=true
```

**application-prod.properties:**
```properties
# Configuración producción
spring.h2.console.enabled=false
logging.level.com.sigc=INFO
spring.jpa.show-sql=false
```

---

## 🏗️ ARQUITECTURA MEJORADA

### **Patrón Repository-Service-Controller**

```java
// Repository Layer
@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Long> {
    Optional<Usuario> findByEmail(String email);
    boolean existsByEmail(String email);
    boolean existsByDni(String dni);
}

// Service Layer  
@Service
@Transactional
public class UsuarioService {
    
    public UsuarioResponseDto crearUsuario(UsuarioCreateDto dto) {
        // Lógica de negocio
        // Validaciones
        // Mapeo DTO ↔ Entity
        // Persistencia
    }
}

// Controller Layer
@RestController
@RequestMapping("/api/usuarios")
@Validated
public class UsuarioController {
    
    @PostMapping
    @Operation(summary = "Crear usuario")
    public ResponseEntity<UsuarioResponseDto> crear(
        @Valid @RequestBody UsuarioCreateDto dto) {
        return ResponseEntity.status(CREATED)
            .body(usuarioService.crearUsuario(dto));
    }
}
```

### **DTOs con Validaciones**

```java
public record UsuarioCreateDto(
    
    @NotBlank(message = "Nombre es obligatorio")
    @Size(min = 2, max = 100)
    String nombre,
    
    @Email(message = "Email debe ser válido")
    @NotBlank
    String email,
    
    @Pattern(regexp = "\\d{8}", message = "DNI debe tener 8 dígitos")
    String dni,
    
    @Pattern(regexp = "\\d{9}", message = "Teléfono debe tener 9 dígitos")  
    String telefono,
    
    @Size(min = 6, message = "Contraseña mínimo 6 caracteres")
    String password,
    
    @Pattern(regexp = "PACIENTE|DOCTOR|ADMIN")
    String rol
) {}
```

---

## 🔧 IMPLEMENTACIÓN PASO A PASO

### **PASO 1: Configurar Swagger**
```bash
# 1. Agregar dependencia en pom.xml
# 2. Crear OpenApiConfig.java  
# 3. Agregar anotaciones en controladores
# 4. Reiniciar aplicación
# 5. Verificar: http://localhost:8080/swagger-ui.html
```

### **PASO 2: Optimizar Controllers**
```bash
# 1. Agregar @Tag, @Operation, @ApiResponse
# 2. Implementar ResponseEntity con códigos HTTP
# 3. Agregar validación @Valid en parámetros
# 4. Manejo de errores con @ExceptionHandler
```

### **PASO 3: Mejorar Services**
```bash
# 1. Lógica de negocio en servicios
# 2. Validaciones antes de persistir
# 3. Mapeo DTO ↔ Entity con ModelMapper
# 4. Transacciones @Transactional
```

### **PASO 4: Testing**
```bash
# 1. Crear tests unitarios para servicios
# 2. Tests de integración para controllers
# 3. Tests de repository con @DataJpaTest
# 4. Cobertura mínima 70%
```

### **PASO 5: Documentación**
```bash
# 1. README.md actualizado
# 2. Endpoints documentados en Swagger
# 3. Modelo de datos DER
# 4. Guía de instalación
```

---

## ✅ ENDPOINTS REQUERIDOS

### **Autenticación**
```
POST /auth/register     - Registro de usuarios
POST /auth/login        - Inicio de sesión
GET  /auth/me          - Perfil usuario autenticado
PUT  /auth/cambiar-password - Cambio de contraseña
```

### **Usuarios (ADMIN)**
```
GET    /usuarios        - Listar todos
GET    /usuarios/{id}   - Obtener por ID
PUT    /usuarios/{id}   - Actualizar usuario
DELETE /usuarios/{id}   - Eliminar usuario
GET    /usuarios/buscar - Búsqueda con filtros
```

### **Especialidades**
```
GET    /especialidades        - Listar (público)
POST   /especialidades        - Crear (ADMIN)
PUT    /especialidades/{id}   - Actualizar (ADMIN)
DELETE /especialidades/{id}   - Eliminar (ADMIN)
```

### **Doctores**
```
GET    /doctores              - Listar (público)
POST   /doctores              - Crear (ADMIN)
PUT    /doctores/{id}         - Actualizar (ADMIN)
DELETE /doctores/{id}         - Eliminar (ADMIN)
POST   /doctores/{id}/imagen  - Subir foto
```

### **Horarios**
```
GET    /horarios                    - Listar disponibles
POST   /horarios                    - Crear (ADMIN)
PUT    /horarios/{id}               - Actualizar (ADMIN)
DELETE /horarios/{id}               - Eliminar (ADMIN)
GET    /horarios/doctor/{doctorId}  - Por doctor
```

### **Citas**
```
GET    /citas                       - Listar (filtradas por rol)
POST   /citas                       - Agendar (PACIENTE)
PUT    /citas/{id}/cancelar         - Cancelar (PACIENTE/ADMIN)
GET    /citas/usuario/{usuarioId}   - Citas de usuario
GET    /citas/doctor/{doctorId}     - Citas de doctor
```

---

## 📊 VERIFICACIÓN DE CALIDAD

### **Checklist Rúbrica:**
```
✅ Swagger UI funcionando en /swagger-ui.html
✅ Todos los endpoints documentados
✅ Códigos HTTP correctos (200, 201, 400, 401, 404, 500)
✅ Validaciones con mensajes claros
✅ Manejo de errores centralizado
✅ Tests unitarios > 70% cobertura
✅ Arquitectura SOLID aplicada
✅ DTOs para entrada/salida
✅ Transacciones en servicios
✅ Logging apropiado
```

### **Testing Strategy:**
```java
// Unit Tests
@ExtendWith(MockitoExtension.class)
class UsuarioServiceTest {
    
    @Mock private UsuarioRepository repository;
    @InjectMocks private UsuarioService service;
    
    @Test
    void crearUsuario_ConDatosValidos_RetornaDto() {
        // Given, When, Then
    }
}

// Integration Tests
@SpringBootTest(webEnvironment = RANDOM_PORT)
@TestPropertySource(properties = "spring.profiles.active=test")
class UsuarioControllerIntegrationTest {
    
    @Autowired private TestRestTemplate restTemplate;
    
    @Test
    void crear_ConDatosValidos_Retorna201() {
        // Test completo HTTP
    }
}
```

---

## 🎯 RESULTADO ESPERADO

**Después de implementar:**
- 📚 **Swagger UI completo:** `http://localhost:8080/swagger-ui.html`
- 🧪 **Tests funcionando:** `mvn test`
- 🏗️ **Arquitectura SOLID:** Separación clara de responsabilidades
- 🔐 **Seguridad JWT:** Endpoints protegidos adecuadamente
- 📝 **Documentación:** API autodocumentada
- ✨ **CRUD optimizado:** Operaciones eficientes y validadas

**Puntaje rúbrica esperado:**
```
✅ API Documentation: 4/4 pts (Swagger completo)
✅ Testing: Incluido en documentación
✅ Best Practices: Arquitectura SOLID
✅ Error Handling: Manejo centralizado
```

---

## 🚀 COMANDOS DE VERIFICACIÓN

```bash
# 1. Compilar y verificar
mvn clean compile

# 2. Ejecutar tests
mvn test

# 3. Generar coverage report
mvn jacoco:report

# 4. Ejecutar aplicación
mvn spring-boot:run

# 5. Verificar Swagger
# Abrir: http://localhost:8080/swagger-ui.html

# 6. Verificar H2 Console
# Abrir: http://localhost:8080/h2-console
```

---

## 💼 ENTREGABLES FINALES

1. **Backend optimizado** con Swagger funcionando
2. **Tests unitarios** con cobertura > 70%
3. **Documentación API** autodocumentada
4. **CRUD completo** para todas las entidades
5. **Manejo de errores** profesional
6. **Arquitectura limpia** siguiendo SOLID

**🎯 Con esto tendrás el puntaje máximo en la rúbrica de tu exposición.**

---

**¿Listo para implementar? Copia este prompt y pégalo en una nueva conversación con Claude para que implemente todo paso a paso.**