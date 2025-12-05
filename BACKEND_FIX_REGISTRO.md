# 🔧 Solución: Error 500 en Registro

## ❌ Problema Identificado

En `RegisterUseCase.java` línea ~85, el método `crearUsuario()` **NO establece los campos requeridos**:

```java
private Usuario crearUsuario(String email, String encryptedPassword) {
    Usuario usuario = new Usuario();
    usuario.setEmail(email);
    usuario.setPassword(encryptedPassword);
    usuario.setRole("USER");
    usuario.setActivo(true);
    // ❌ Faltan: nombre, dni, telefono
    return usuario;
}
```

Cuando la base de datos intenta guardar sin estos campos, retorna error 500.

---

## ✅ Soluciones

### Opción 1: Arreglar Backend (RECOMENDADO)

**Archivo:** `src/main/java/com/sigc/backend/domain/service/usecase/auth/RegisterUseCase.java`

**Cambio en AuthController.java:**
```java
@PostMapping("/register")
public ResponseEntity<RegistroResponse> register(@Valid @RequestBody RegistroRequest request) {
    log.info("Recibida petición de registro para: {}", request.getEmail());

    // Crear request que incluya todos los datos
    LoginRequest registerRequest = new LoginRequest(
        request.getEmail(),
        request.getPassword()
    );

    // Pasar el RegistroRequest completo al servicio
    LoginResponse registerResponse = authApplicationService.register(registerRequest, request);
    
    // ... resto igual
}
```

**Cambio en AuthApplicationService.java:**
```java
public LoginResponse register(LoginRequest loginRequest, RegistroRequest registroRequest) {
    var registerUseCase = new RegisterUseCase(usuarioRepository, passwordEncoder);
    return registerUseCase.execute(loginRequest, registroRequest);
}
```

**Cambio en RegisterUseCase.java:**
```java
public LoginResponse execute(LoginRequest request, RegistroRequest registroRequest) {
    // ... validaciones ...
    
    var nuevoUsuario = crearUsuario(
        registroRequest.getNombre(),
        request.getEmail(), 
        registroRequest.getDni(),
        registroRequest.getTelefono(),
        encryptedPassword,
        registroRequest.getRol()
    );
    usuarioRepository.save(nuevoUsuario);
    
    return new LoginResponse(...);
}

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

### Opción 2: Parche Temporal en Frontend

Si no puedes modificar el backend inmediatamente, el frontend puede:
1. Usar `http://localhost:8080/usuarios` para crear el usuario (si existe ese endpoint)
2. O esperar a que el backend sea arreglado

---

## 📋 Checklist

- [ ] Arreglaste el backend según Opción 1
- [ ] Compilaste el backend con `mvn clean install` o `gradle build`
- [ ] Reiniciaste el servidor backend
- [ ] Intenta registrar nuevamente en el frontend
- [ ] Verifica que `nombre`, `dni`, `telefono` se guarden en la BD

---

## 🧪 Verificación

Después de arreglado, estos datos deben guardarse en la tabla `usuario`:
```sql
SELECT nombre, email, dni, telefono FROM usuario WHERE email = 'test@example.com';
```

Si todo está correcto, deberías ver los 4 campos poblados.
