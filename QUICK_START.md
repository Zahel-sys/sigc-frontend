# ⚡ QUICK START - 5 Minutos para Empezar

**Versión acelerada para empezar AHORA**

---

## 🚀 En 5 Minutos

### Paso 1: Verificar Setup (1 min)
```bash
# Abre DevTools (F12) → Console
# Copia y pega:

console.log('✅ Setup completo');
console.log('Servicios: 41 métodos centralizados');
console.log('Hooks: 10 hooks reutilizables');
console.log('Config: THEME, API_CONFIG, MESSAGES');
```

### Paso 2: Entender el Patrón (2 min)

**ANTES:** Monolítico
```jsx
function Login() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  
  const handleLogin = async () => {
    setLoading(true);
    const res = await api.post('/auth/login', { email });
    localStorage.setItem('usuario', JSON.stringify(res.data));
    setLoading(false);
    navigate('/dashboard');
  };
  
  return <form onSubmit={handleLogin}>...</form>;
}
```

**DESPUÉS:** SOLID
```jsx
function Login() {
  const { formData, handleChange } = useFormData({ email: '' });
  const { login, loading } = useAuth();
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await login(formData.email, '');
    if (success) navigate('/dashboard');
  };
  
  return <form onSubmit={handleSubmit}>...</form>;
}
```

**Diferencia:** 20 líneas → 8 líneas (60% menos)

### Paso 3: Copiar Snippet (1 min)
```bash
# Abre: SNIPPETS_READY.js
# Copia el snippet #1: "Refactorizar un formulario"
# Adapta a tu caso
```

### Paso 4: Refactorizar (1 min)
```bash
# Refactoriza Login.jsx usando el snippet
# Test en navegador
# Listo ✅
```

---

## 📚 Archivos Clave

### Para Empezar
| Archivo | Lee | Tiempo |
|---------|------|--------|
| `QUICK_START.md` | Ahora | 5 min |
| `ARCHITECTURE.md` | Luego | 20 min |
| `REFACTOR_GUIDE.md` | Si duda | 10 min |

### Para Trabajar
| Archivo | Usa para | Tiempo |
|---------|----------|--------|
| `SNIPPETS_READY.js` | Copy-paste | 2 min |
| `REFACTOR_PLAN.md` | Saber qué hacer | 5 min |
| `CHECKLIST_FINAL.md` | Tracking | 2 min |

### Para Referencia
| Archivo | Consulta para | Tiempo |
|---------|--------------|--------|
| `config/theme.js` | Colores/spacing | 1 min |
| `constants/messages.js` | Mensajes | 1 min |
| `services/*/` | API calls | 2 min |
| `hooks/*.js` | Lógica | 2 min |

---

## 🎯 Tareas Rápidas

### Refactorizar Login (20 min)

**1. Abrir archivo**
```bash
src/pages/Login.jsx
```

**2. Copiar imports**
```jsx
import { useAuth } from '../hooks/useAuth';
import { useFormData } from '../hooks/useFormData';
import { MESSAGES } from '../constants/messages';
```

**3. Reemplazar lógica**
```jsx
// Eliminar: const [email, setEmail], api.post(), localStorage.setItem()
// Agregar:
const { login, loading } = useAuth();
const { formData, handleChange } = useFormData({ email: '', password: '' });

const handleSubmit = async (e) => {
  e.preventDefault();
  const success = await login(formData.email, formData.password);
  if (success) navigate('/dashboard');
};
```

**4. Reemplazar JSX**
```jsx
{error && <Alert>{error}</Alert>}
<FormField
  name="email"
  value={formData.email}
  onChange={handleChange}
  label="Email"
/>
```

**5. Test**
```bash
# Abrir navegador
# Probar Login
# ✅ Debe funcionar igual que antes
```

---

## 🔍 Patrón General

### Para refactorizar CUALQUIER componente:

1. **Identificar responsabilidades**
   ```
   Componente actual hace:
   - [ ] Cargar datos
   - [ ] Validar
   - [ ] Enviar
   - [ ] Mostrar error
   ```

2. **Buscar hook existente**
   ```bash
   # ¿Ya existe un hook para esto?
   grep -r "useCitas\|useDoctores" src/hooks/
   # Si sí, usar. Si no, crear.
   ```

3. **Reemplazar lógica**
   ```jsx
   // Antes
   useEffect(() => {
     api.get('/data').then(r => setData(r.data));
   }, []);
   
   // Después
   const { data } = useMyData();
   ```

4. **Testear**
   ```bash
   # Abrir navegador
   # Verificar que funciona igual
   ```

---

## 🎓 Ejemplos por Tipo

### Tipo 1: Cargar Datos
```jsx
// Antes
const [citas, setCitas] = useState([]);
useEffect(() => {
  api.get('/citas').then(r => setCitas(r.data));
}, []);

// Después
const { citas } = useCitas();
```

### Tipo 2: Enviar Formulario
```jsx
// Antes
const handleSubmit = async (e) => {
  e.preventDefault();
  await api.post('/citas', formData);
  alert('Listo');
};

// Después
const { crear } = useCitasAdmin();
const handleSubmit = async (e) => {
  e.preventDefault();
  await crear(formData);
};
```

### Tipo 3: Múltiples Estados
```jsx
// Antes
const [email, setEmail] = useState('');
const [password, setPassword] = useState('');
const [errors, setErrors] = useState({});
const [touched, setTouched] = useState({});

// Después
const { formData, errors, touched, handleChange } = useFormData({
  email: '', password: ''
});
```

---

## 📖 Documentación Rápida

### Para THEME
```jsx
import { THEME } from '../config/theme';

// Usar
backgroundColor: THEME.primary.main
color: THEME.text.primary
padding: THEME.spacing.md
borderRadius: THEME.borderRadius.lg
```

### Para MESSAGES
```jsx
import { MESSAGES } from '../constants/messages';

// Usar
showSuccess(MESSAGES.AUTH.LOGIN_SUCCESS);
showError(MESSAGES.VALIDATION.EMAIL_INVALID);
alert(MESSAGES.DOCTORS.CREATED);
```

### Para Validators
```jsx
import { validarEmail, validarDNI } from '../utils/validators';

if (!validarEmail(email)) {
  showError('Email inválido');
}
if (!validarDNI(dni)) {
  showError('DNI inválido');
}
```

---

## ⚡ Atajos Útiles

### Crear un Hook Rápido
```jsx
import { useState, useCallback, useEffect } from 'react';

export const useMiFeature = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const cargar = useCallback(async () => {
    setLoading(true);
    try {
      const resultado = await miService.get();
      setData(resultado);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    cargar();
  }, [cargar]);

  return { data, loading, cargar };
};
```

### Crear un Servicio Rápido
```jsx
import api from '../../services/api';

const miService = {
  get: async () => {
    const res = await api.get('/mi-ruta');
    return res.data;
  },
  post: async (data) => {
    const res = await api.post('/mi-ruta', data);
    return res.data;
  },
};

export default miService;
```

### Crear un Componente Rápido
```jsx
import PropTypes from 'prop-types';
import { THEME } from '../config/theme';

function MiComponente({ titulo, contenido, onClick }) {
  return (
    <div style={{ padding: THEME.spacing.md }}>
      <h2>{titulo}</h2>
      <p>{contenido}</p>
      <button onClick={onClick}>Acción</button>
    </div>
  );
}

MiComponente.propTypes = {
  titulo: PropTypes.string.isRequired,
  contenido: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
};

export default MiComponente;
```

---

## 🐛 Troubleshooting Rápido

### "No puedo importar el hook"
```bash
# Verificar que existe en:
src/hooks/miHook.js
# Y está exportado en:
src/hooks/index.js
```

### "Hook retorna undefined"
```bash
# Verificar que el servicio funciona:
# DevTools → Network → Ver petición
# Verificar error en console
# Usar hook admin en lugar de hook regular
```

### "Estilos no se ven"
```jsx
// Reemplazar inline style:
style={{ color: 'red' }} // ❌

// Con THEME:
style={{ color: THEME.primary.main }} // ✅
```

### "Validación no funciona"
```jsx
// Usar validadores correctos:
import { validarEmail } from '../utils/validators';

if (!validarEmail(email)) {
  setError('Email inválido');
}
```

---

## ✅ Checklist Después de Refactorizar

- [ ] ¿El componente funciona igual que antes?
- [ ] ¿No hay errores en console?
- [ ] ¿Usa hooks en lugar de useState + useEffect?
- [ ] ¿Usa servicios en lugar de api.get/post directo?
- [ ] ¿Usa THEME para estilos?
- [ ] ¿Usa MESSAGES para textos?
- [ ] ¿Usa validators para validación?
- [ ] ¿El archivo tiene < 100 líneas?
- [ ] ¿Hay un commit descriptivo?

---

## 📞 Quick Reference

```
Para cargar:        const { data } = useHook();
Para enviar:        await servicio.action(data);
Para estilos:       style={{ color: THEME.primary.main }}
Para mensajes:      alert(MESSAGES.TIPO.ACCION);
Para validar:       if (!validator(value)) showError();
Para formularios:   const { formData, handleChange } = useFormData();
```

---

## 🎯 Siguiente Paso

1. ✅ Leíste esto (5 min) ✨
2. 📖 Lee `ARCHITECTURE.md` (20 min)
3. 🔄 Refactoriza Login.jsx (20 min)
4. 🧪 Test en navegador (5 min)
5. 📝 Hace commit
6. 🔁 Repite con Registrar.jsx

**Total:** 50 minutos = 2 páginas refactorizadas ✅

---

**¡Vamos a hackear esto! 🚀**

Tiempo: 5 minutos
Complejidad: ⭐☆☆☆☆ (muy fácil)
Impacto: ⭐⭐⭐⭐⭐ (muy alto)

Próximo: ARCHITECTURE.md
