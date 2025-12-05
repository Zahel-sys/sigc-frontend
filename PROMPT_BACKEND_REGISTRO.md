# 🚀 PROMPT COMPLETO PARA ARREGLAR REGISTRO EN BACKEND

## Copia y pega este prompt en tu repositorio del backend

---

## 📋 TAREA: Arreglar el Registro de Usuarios para Guardar Todos los Datos

**Contexto:** El frontend envía `nombre`, `email`, `password`, `dni`, `telefono` y `rol`, pero el backend solo estaba guardando `email` y `password`, causando error 500.

**Archivos a Modificar:**
1. `AuthController.java`
2. `AuthApplicationService.java`
3. `RegisterUseCase.java`

---

## 📝 PASO 1: Modificar `AuthController.java`

**Archivo:** `src/main/java/com/sigc/backend/controller/AuthController.java`

**Localiza el método `register` (línea ~44):**

**ANTES:**
```java
@PostMapping("/register")
public ResponseEntity<RegistroResponse> register(@Valid @RequestBody RegistroRequest request) {
    log.info("Recibida petición de registro para: {}", request.getEmail());

    // Construir request de dominio (RegisterUseCase usa LoginRequest internamente)
    LoginRequest registerRequest = new LoginRequest(
        request.getEmail(),
        request.getPassword()
    );

    // Delegar a Application Service
    LoginResponse registerResponse = authApplicationService.register(registerRequest);

    // Mapear a DTO de respuesta
    RegistroResponse response = new RegistroResponse(
        registerResponse.getUserId(),
        registerResponse.getEmail(),
        registerResponse.getToken(),
        registerResponse.getRole()
    );

    log.info("Usuario registrado exitosamente: {}", response.getIdUsuario());
    return ResponseEntity.status(HttpStatus.CREATED).body(response);
}
```

**DESPUÉS (Reemplaza completamente):**
```java
@PostMapping("/register")
public ResponseEntity<RegistroResponse> register(@Valid @RequestBody RegistroRequest request) {
    log.info("Recibida petición de registro para: {}", request.getEmail());

    // Construir request de dominio (RegisterUseCase usa LoginRequest internamente)
    LoginRequest registerRequest = new LoginRequest(
        request.getEmail(),
        request.getPassword()
    );

    // Delegar a Application Service pasando el RegistroRequest completo
    LoginResponse registerResponse = authApplicationService.register(registerRequest, request);

    // Mapear a DTO de respuesta
    RegistroResponse response = new RegistroResponse(
        registerResponse.getUserId(),
        registerResponse.getEmail(),
        registerResponse.getToken(),
        registerResponse.getRole()
    );

    log.info("Usuario registrado exitosamente: {}", response.getIdUsuario());
    return ResponseEntity.status(HttpStatus.CREATED).body(response);
}
```

**Cambio clave:** Línea que llama a `register`:
- **Antes:** `authApplicationService.register(registerRequest);`
- **Después:** `authApplicationService.register(registerRequest, request);`

---

## 📝 PASO 2: Modificar `AuthApplicationService.java`

**Archivo:** `src/main/java/com/sigc/backend/application/service/AuthApplicationService.java`

**Añade el import al inicio:**
```java
import com.sigc.backend.dto.RegistroRequest;
```

**Localiza el método `register` (línea ~50 aproximadamente):**

**ANTES:**
```java
/**
 * Ejecuta el proceso de registro.
 *
 * @param request Datos de registro (email + password)
 * @return Confirmación de registro
 * @throws DomainException si el email ya está registrado
 */
public LoginResponse register(LoginRequest request) {
    var registerUseCase = new RegisterUseCase(usuarioRepository, passwordEncoder);
    return registerUseCase.execute(request);
}
```

**DESPUÉS (Reemplaza completamente):**
```java
/**
 * Ejecuta el proceso de registro.
 *
 * @param loginRequest Datos de registro (email + password)
 * @param registroRequest Datos completos del usuario (nombre, dni, telefono, rol)
 * @return Confirmación de registro
 * @throws DomainException si el email ya está registrado
 */
public LoginResponse register(LoginRequest loginRequest, RegistroRequest registroRequest) {
    var registerUseCase = new RegisterUseCase(usuarioRepository, passwordEncoder);
    return registerUseCase.execute(loginRequest, registroRequest);
}
```

**Cambios clave:**
- Parámetro: `LoginRequest request` → `LoginRequest loginRequest, RegistroRequest registroRequest`
- Llamada: `registerUseCase.execute(request)` → `registerUseCase.execute(loginRequest, registroRequest)`

---

## 📝 PASO 3: Modificar `RegisterUseCase.java`

**Archivo:** `src/main/java/com/sigc/backend/domain/service/usecase/auth/RegisterUseCase.java`

**Añade el import al inicio:**
```java
import com.sigc.backend.dto.RegistroRequest;
```

**Reemplaza COMPLETAMENTE el método `execute` (línea ~48 aproximadamente):**

**ANTES:**
```java
public LoginResponse execute(LoginRequest request) {
    // PASO 1: Validar credenciales de registro
    CredentialValidator.ValidationResult validationResult =
        CredentialValidator.validateRegistrationCredentials(
            request.getEmail(),
            request.getPassword(),
            request.getPassword()  // confirmPassword (mismo que password en login simple)
        );

    if (!validationResult.isValid()) {
        throw new IllegalArgumentException(validationResult.getErrorMessage());
    }

    // PASO 2: Verificar que el email no esté registrado
    if (usuarioRepository.existsByEmail(request.getEmail())) {
        throw new EmailAlreadyRegisteredException("El email " + request.getEmail() + " ya está registrado");
    }

    // PASO 3: Encriptar contraseña
    String encryptedPassword = passwordEncoder.encodePassword(request.getPassword());

    // PASO 4: Crear usuario en base de datos
    // Nota: La creación del usuario será delegada al repositorio
    // Este caso de uso solo asegura la lógica de negocio
    var nuevoUsuario = crearUsuario(request.getEmail(), encryptedPassword);
    usuarioRepository.save(nuevoUsuario);

    // PASO 5: Retornar confirmación
    // En registro, no devolvemos token inmediatamente
    // El usuario debe hacer login después
    return new LoginResponse(
        0L,  // ID será asignado por la base de datos
        request.getEmail(),
        "",  // Sin token en registro
        "USER"
    );
}
```

**DESPUÉS:**
```java
/**
 * Ejecuta el caso de uso de registro.
 *
 * @param loginRequest Datos básicos (email + password)
 * @param registroRequest Datos completos del usuario (nombre, dni, telefono, rol)
 * @return Confirmación de registro creado
 * @throws EmailAlreadyRegisteredException si el email ya está registrado
 */
public LoginResponse execute(LoginRequest loginRequest, RegistroRequest registroRequest) {
    // PASO 1: Validar credenciales de registro
    CredentialValidator.ValidationResult validationResult =
        CredentialValidator.validateRegistrationCredentials(
            loginRequest.getEmail(),
            loginRequest.getPassword(),
            loginRequest.getPassword()  // confirmPassword (mismo que password en login simple)
        );

    if (!validationResult.isValid()) {
        throw new IllegalArgumentException(validationResult.getErrorMessage());
    }

    // PASO 2: Verificar que el email no esté registrado
    if (usuarioRepository.existsByEmail(loginRequest.getEmail())) {
        throw new EmailAlreadyRegisteredException("El email " + loginRequest.getEmail() + " ya está registrado");
    }

    // PASO 3: Encriptar contraseña
    String encryptedPassword = passwordEncoder.encodePassword(loginRequest.getPassword());

    // PASO 4: Crear usuario en base de datos con todos los datos
    var nuevoUsuario = crearUsuario(
        registroRequest.getNombre(),
        loginRequest.getEmail(),
        registroRequest.getDni(),
        registroRequest.getTelefono(),
        encryptedPassword,
        registroRequest.getRol()
    );
    usuarioRepository.save(nuevoUsuario);

    // PASO 5: Retornar confirmación
    // En registro, no devolvemos token inmediatamente
    // El usuario debe hacer login después
    return new LoginResponse(
        0L,  // ID será asignado por la base de datos
        loginRequest.getEmail(),
        "",  // Sin token en registro
        registroRequest.getRol() != null ? registroRequest.getRol() : "PACIENTE"
    );
}
```

**Reemplaza COMPLETAMENTE el método `crearUsuario` (línea ~78 aproximadamente):**

**ANTES:**
```java
private Usuario crearUsuario(String email, String encryptedPassword) {
    // PLACEHOLDER: Será implementado completamente en PASO 6
    // Por ahora retorna Usuario básico
    Usuario usuario = new Usuario();
    usuario.setEmail(email);
    usuario.setPassword(encryptedPassword);
    usuario.setRole("USER");
    usuario.setActivo(true);
    return usuario;
}
```

**DESPUÉS:**
```java
/**
 * Método auxiliar para crear objeto Usuario con todos los datos completos.
 *
 * @param nombre Nombre completo del usuario
 * @param email Email del usuario
 * @param dni DNI del usuario
 * @param telefono Teléfono del usuario
 * @param encryptedPassword Contraseña encriptada
 * @param rol Rol del usuario (PACIENTE, DOCTOR, ADMIN)
 * @return Usuario creado con todos los datos
 */
private Usuario crearUsuario(String nombre, String email, String dni,
                            String telefono, String encryptedPassword, String rol) {
    Usuario usuario = new Usuario();
    usuario.setNombre(nombre);
    usuario.setEmail(email);
    usuario.setDni(dni);
    usuario.setTelefono(telefono);
    usuario.setPassword(encryptedPassword);
    usuario.setRole(rol != null ? rol : "PACIENTE");
    usuario.setActivo(true);
    return usuario;
}
```

---

## 🔧 PASO 4: Compilar y Probar

```bash
# Compilar
mvn clean install

# O si usas Gradle
gradle clean build

# Ejecutar
mvn spring-boot:run
# O
gradle bootRun
```

---

## ✅ VERIFICACIÓN

1. **Intenta registrar desde el frontend:**
   - Nombre: Bastian Flores Barboza
   - Email: bastian@test.com
   - Contraseña: Test123
   - DNI: 12345678
   - Teléfono: 987654321

2. **Verifica en la BD:**
   ```sql
   SELECT nombre, email, dni, telefono, rol, activo FROM usuario WHERE email = 'bastian@test.com';
   ```

3. **Esperado:**
   ```
   | nombre                  | email           | dni      | telefono  | rol     | activo |
   |-------------------------|-----------------|----------|-----------|---------|--------|
   | Bastian Flores Barboza  | bastian@test.com| 12345678 | 987654321 | PACIENTE| 1      |
   ```

---

## 🎯 Resumen de Cambios

| Archivo | Cambio |
|---------|--------|
| **AuthController.java** | Pasar `request` completo a `authApplicationService.register()` |
| **AuthApplicationService.java** | Aceptar `RegistroRequest` adicional en método `register()` |
| **RegisterUseCase.java** | Guardar todos los campos (`nombre`, `dni`, `telefono`, `rol`) en BD |

---

## ❓ Preguntas Frecuentes

**¿Qué pasa si no cambio el backend?**
- El frontend sigue mandando todos los datos, pero el backend solo guarda email y password
- Resultado: Error 500 en cada intento de registro

**¿Puedo cambiar solo uno de los archivos?**
- No, los 3 deben cambiarse juntos o no funcionará

**¿Qué pasa si el `rol` es NULL?**
- Se asigna automáticamente "PACIENTE" (línea 56 en RegisterUseCase)

**¿Cómo sé si funcionó?**
- Sin errores en la consola del backend
- El usuario aparece en la BD con todos los campos
- El frontend permite hacer login después

---
