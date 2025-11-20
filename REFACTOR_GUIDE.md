# 🔄 GUÍA DE MIGRACIÓN - REFACTOR A SOLID

**Objetivo:** Guía paso a paso para refactorizar componentes existentes al nuevo patrón SOLID

---

## 📊 BEFORE vs AFTER

### Caso 1: PerfilCliente.jsx (300 líneas → 80 líneas)

#### ❌ ANTES (Monolítico)

```jsx
// archivo: src/pages/PerfilCliente.jsx (300+ líneas)
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ClienteLayout from "../layouts/ClienteLayout";
import api from "../services/api";
import { showSuccess, showError, showWarning } from "../utils/alerts";

export default function PerfilCliente() {
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState({ 
    nombre: "", email: "", dni: "", telefono: "" 
  });
  const [contrasena, setContrasena] = useState({
    actual: "", nueva: "", confirmar: ""
  });
  const [loading, setLoading] = useState(true);
  const [loadingContrasena, setLoadingContrasena] = useState(false);

  // RESPONSABILIDAD 1: Fetch usuario
  useEffect(() => {
    const fetchUsuario = async () => {
      try {
        const storedUser = JSON.parse(localStorage.getItem("usuario"));
        const token = storedUser?.token;
        if (!token) {
          showWarning("No hay sesión activa...");
          navigate("/login");
          return;
        }
        const res = await api.get("/auth/me", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUsuario(res.data);
      } catch (err) {
        console.error("Error al cargar perfil:", err);
        if (err.response?.status === 401) {
          showError("Sesión expirada...");
          localStorage.clear();
          navigate("/login");
        } else {
          showError("No se pudo cargar tu perfil...");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchUsuario();
  }, [navigate]);

  // RESPONSABILIDAD 2: Guardar perfil
  const handleSave = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/usuarios/${usuario.idUsuario}`, usuario);
      showSuccess("Perfil actualizado", "Tus datos se guardaron correctamente");
      const storedUser = JSON.parse(localStorage.getItem("usuario"));
      localStorage.setItem("usuario", JSON.stringify({ ...storedUser, ...usuario }));
    } catch (err) {
      console.error("Error al actualizar perfil:", err);
      showError("No se pudo actualizar tu perfil...");
    }
  };

  // RESPONSABILIDAD 3: Cambiar contraseña
  const handleChangePassword = async (e) => {
    e.preventDefault();

    // RESPONSABILIDAD 3a: Validar
    if (!contrasena.actual.trim()) {
      showWarning("Ingresa tu contraseña actual");
      return;
    }
    if (!contrasena.nueva.trim()) {
      showWarning("Ingresa una nueva contraseña");
      return;
    }
    if (contrasena.nueva.length < 6) {
      showWarning("La contraseña debe tener al menos 6 caracteres");
      return;
    }
    if (contrasena.nueva !== contrasena.confirmar) {
      showWarning("Las contraseñas no coinciden");
      return;
    }
    if (contrasena.actual === contrasena.nueva) {
      showWarning("La nueva contraseña debe ser diferente");
      return;
    }

    setLoadingContrasena(true);
    try {
      const storedUser = JSON.parse(localStorage.getItem("usuario"));
      const token = storedUser?.token;
      const response = await api.post(
        "/auth/cambiar-contrasena",
        {
          passwordActual: contrasena.actual,
          passwordNueva: contrasena.nueva,
          passwordConfirmar: contrasena.confirmar
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      showSuccess("Contraseña actualizada", "Por favor, inicia sesión nuevamente.");
      setContrasena({ actual: "", nueva: "", confirmar: "" });
      setTimeout(() => {
        localStorage.clear();
        navigate("/login");
      }, 2000);
    } catch (err) {
      console.error("Error al cambiar contraseña:", err);
      showError(err.response?.data?.message || "No se pudo cambiar la contraseña...");
    } finally {
      setLoadingContrasena(false);
    }
  };

  if (loading) {
    return (
      <ClienteLayout>
        <div className="text-center mt-5">
          <div className="spinner-border text-success" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
        </div>
      </ClienteLayout>
    );
  }

  // RESPONSABILIDAD 4: Renderizar (con estilos inline)
  return (
    <ClienteLayout>
      <div className="container-fluid py-4">
        <div className="row">
          <div className="col-12 col-lg-6 mb-4 mb-lg-0">
            <div className="card border-0 shadow-lg" style={{ 
              borderRadius: '15px', overflow: 'hidden', height: '100%', width: '100%' 
            }}>
              {/* ... 150 líneas de JSX con estilos inline ... */}
            </div>
          </div>
          {/* ... */}
        </div>
      </div>
    </ClienteLayout>
  );
}
```

**Problemas:**
- 300+ líneas en 1 archivo
- Múltiples responsabilidades
- Estilos inline (difícil de mantener)
- Lógica de validación dispersa
- Imposible testear

---

#### ✅ DESPUÉS (SOLID)

```jsx
// archivo: src/pages/client/Perfil.jsx (80 líneas)
import ClienteLayout from '../../layouts/ClienteLayout';
import { useCurrentUser } from '../../hooks/useCurrentUser';
import ProfileSection from '../../components/organisms/ProfileSection';
import PasswordSection from '../../components/organisms/PasswordSection';

/**
 * Página de perfil del cliente
 * Responsabilidad: Orquestar componentes (Smart Component)
 */
export default function PerfilClientePage() {
  const { usuario, loading, error } = useCurrentUser();

  if (loading) {
    return <ClienteLayout><Loader /></ClienteLayout>;
  }

  if (error) {
    return <ClienteLayout><ErrorMessage message={error} /></ClienteLayout>;
  }

  return (
    <ClienteLayout>
      <div className="container-fluid py-4">
        <div className="row">
          <div className="col-12 col-lg-6">
            <ProfileSection usuario={usuario} />
          </div>
          <div className="col-12 col-lg-6">
            <PasswordSection />
          </div>
        </div>
      </div>
    </ClienteLayout>
  );
}
```

```jsx
// archivo: src/components/organisms/ProfileSection.jsx (120 líneas)
import { useFormData } from '../../hooks/useFormData';
import FormSection from '../molecules/FormSection';
import FormField from '../atoms/FormField';
import Button from '../atoms/Button';
import { useUpdateProfile } from '../../hooks/useUpdateProfile';
import { THEME } from '../../config/theme';

/**
 * Sección de perfil (Organism)
 * Responsabilidad: Renderizar formulario de perfil
 */
export default function ProfileSection({ usuario }) {
  const { formData, errors, handleChange, setFieldError } = useFormData(usuario);
  const { updateProfile, loading } = useUpdateProfile();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await updateProfile(formData);
    if (success) {
      // Mostrar éxito
    }
  };

  return (
    <div className="card border-0 shadow-lg" style={{
      borderRadius: THEME.borderRadius.xl,
      overflow: 'hidden',
    }}>
      <div className="card-header" style={{
        background: THEME.primary.gradient,
        color: 'white',
        padding: THEME.spacing.lg,
      }}>
        <h3 style={{ fontWeight: '600', margin: 0 }}>Mi Perfil</h3>
      </div>

      <form className="card-body p-4" onSubmit={handleSubmit}>
        <FormSection title="Información Personal">
          <FormField
            label="Nombre Completo"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            error={errors.nombre}
            required
          />
          <FormField
            label="Correo Electrónico"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            error={errors.email}
            required
          />
          <FormField
            label="DNI"
            name="dni"
            value={formData.dni}
            onChange={handleChange}
            error={errors.dni}
            pattern="\d{8}"
            maxLength="8"
            required
          />
          <FormField
            label="Teléfono"
            name="telefono"
            value={formData.telefono}
            onChange={handleChange}
            error={errors.telefono}
            pattern="\d{9}"
            maxLength="9"
            required
          />
        </FormSection>

        <Button
          type="submit"
          variant="primary"
          size="lg"
          loading={loading}
          fullWidth
        >
          Guardar Cambios
        </Button>
      </form>
    </div>
  );
}
```

**Beneficios:**
- ✅ Cada archivo < 150 líneas
- ✅ Una responsabilidad por archivo
- ✅ Componentes reutilizables
- ✅ Estilos centralizados
- ✅ Fácil de testear
- ✅ Fácil de mantener

---

### Caso 2: AdminDoctores.jsx (250 líneas → 5 componentes)

#### ❌ ANTES (Monolítico)

```jsx
// archivo: src/pages/AdminDoctores.jsx (250+ líneas)
export default function AdminDoctores() {
  const [doctores, setDoctores] = useState([]);
  const [especialidades, setEspecialidades] = useState([]);
  const [nombre, setNombre] = useState("");
  const [especialidad, setEspecialidad] = useState("");
  const [cupoPacientes, setCupoPacientes] = useState("");
  const [imagen, setImagen] = useState(null);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [doctorEditando, setDoctorEditando] = useState(null);

  useEffect(() => {
    cargarDoctores();
    cargarEspecialidades();
  }, []);

  const cargarDoctores = async () => {
    try {
      const res = await api.get("/doctores");
      setDoctores(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      setDoctores([]);
    }
  };

  const cargarEspecialidades = async () => {
    try {
      const res = await api.get("/especialidades");
      setEspecialidades(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      setEspecialidades([]);
    }
  };

  const handleRegistrarOEditar = async (e) => {
    e.preventDefault();

    if (!nombre || !especialidad || !cupoPacientes) {
      alert("Por favor completa todos los campos");
      return;
    }

    const formData = new FormData();
    formData.append("nombre", nombre);
    formData.append("especialidad", especialidad);
    formData.append("cupoPacientes", cupoPacientes);
    if (imagen) formData.append("imagen", imagen);

    try {
      if (modoEdicion) {
        await api.put(`/doctores/${doctorEditando}`, formData);
        alert("✅ Doctor actualizado correctamente");
        setModoEdicion(false);
        setDoctorEditando(null);
      } else {
        await api.post("/doctores", formData);
        alert("✅ Doctor registrado correctamente");
      }
      setNombre("");
      setEspecialidad("");
      setCupoPacientes("");
      setImagen(null);
      cargarDoctores();
    } catch (error) {
      alert("Error al guardar el doctor");
    }
  };

  const handleEliminar = async (id) => {
    if (window.confirm("¿Eliminar este doctor?")) {
      try {
        await api.delete(`/doctores/${id}`);
        alert("✅ Doctor eliminado correctamente");
        cargarDoctores();
      } catch (error) {
        alert("Error al eliminar doctor");
      }
    }
  };

  const handleEditar = (doctor) => {
    setModoEdicion(true);
    setDoctorEditando(doctor.idDoctor);
    setNombre(doctor.nombre);
    setEspecialidad(doctor.especialidad);
    setCupoPacientes(doctor.cupoPacientes);
    setImagen(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // ... 100 líneas más de JSX
}
```

**Problemas:**
- 8 `useState` separados
- Lógica CRUD + Upload + Validación mezclada
- Tabla sin componente separado
- Formulario sin componente separado
- Imposible testear

---

#### ✅ DESPUÉS (SOLID)

```jsx
// archivo: src/pages/admin/Doctores.jsx (60 líneas)
import { useDoctoresAdmin } from '../../hooks/admin/useDoctoresAdmin';
import AdminLayout from '../../layouts/AdminLayout';
import DoctoresForm from '../../components/organisms/DoctoresForm';
import DoctoresTable from '../../components/organisms/DoctoresTable';

export default function DoctoresPage() {
  const { doctores, loading, crear, actualizar, eliminar, recargar } = useDoctoresAdmin();

  return (
    <AdminLayout>
      <h2>Gestión de Doctores</h2>
      
      <DoctoresForm 
        onSubmit={crear}
        onUpdate={actualizar}
        loading={loading}
      />

      <DoctoresTable 
        doctores={doctores}
        onEdit={() => {/* ... */}}
        onDelete={eliminar}
        loading={loading}
      />
    </AdminLayout>
  );
}
```

```jsx
// archivo: src/hooks/admin/useDoctoresAdmin.js
export const useDoctoresAdmin = () => {
  const [doctores, setDoctores] = useState([]);
  const [loading, setLoading] = useState(false);

  const cargarDoctores = useCallback(async () => {
    setLoading(true);
    try {
      const datos = await doctoresService.getAllDoctores();
      setDoctores(datos);
    } finally {
      setLoading(false);
    }
  }, []);

  const crear = useCallback(async (formData) => {
    setLoading(true);
    try {
      await doctoresService.createDoctor(formData);
      showSuccess(MESSAGES.DOCTORS.CREATED);
      cargarDoctores();
      return { success: true };
    } catch (err) {
      showError(MESSAGES.DOCTORS.ERROR_SAVE);
      return { success: false };
    } finally {
      setLoading(false);
    }
  }, [cargarDoctores]);

  const actualizar = useCallback(async (id, formData) => {
    setLoading(true);
    try {
      await doctoresService.updateDoctor(id, formData);
      showSuccess(MESSAGES.DOCTORS.UPDATED);
      cargarDoctores();
      return { success: true };
    } catch (err) {
      showError(MESSAGES.DOCTORS.ERROR_SAVE);
      return { success: false };
    } finally {
      setLoading(false);
    }
  }, [cargarDoctores]);

  useEffect(() => {
    cargarDoctores();
  }, [cargarDoctores]);

  return { doctores, loading, crear, actualizar, eliminar, recargar: cargarDoctores };
};
```

```jsx
// archivo: src/components/organisms/DoctoresForm.jsx (100 líneas)
import FormField from '../atoms/FormField';
import ImageUploader from '../molecules/ImageUploader';
import Button from '../atoms/Button';
import { useFormData } from '../../hooks/useFormData';
import { useEspecialidades } from '../../hooks/useEspecialidades';

export default function DoctoresForm({ onSubmit, loading }) {
  const { formData, errors, handleChange, updateFields, reset } = useFormData({
    nombre: '',
    especialidad: '',
    cupoPacientes: '',
    imagen: null,
  });

  const { especialidades } = useEspecialidades();
  const [imageUrl, setImageUrl] = useState(null);

  const handleImageUpload = useCallback((imageUrl) => {
    setImageUrl(imageUrl);
    updateFields({ imagen: imageUrl });
  }, [updateFields]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await onSubmit(formData);
    if (success) {
      reset();
      setImageUrl(null);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4">
      <FormField
        label="Nombre"
        name="nombre"
        value={formData.nombre}
        onChange={handleChange}
        error={errors.nombre}
        required
      />

      <select value={formData.especialidad} onChange={handleChange}>
        {especialidades.map(esp => (
          <option key={esp.id} value={esp.nombre}>
            {esp.nombre}
          </option>
        ))}
      </select>

      <FormField
        label="Cantidad de Pacientes"
        name="cupoPacientes"
        type="number"
        value={formData.cupoPacientes}
        onChange={handleChange}
        error={errors.cupoPacientes}
        required
      />

      <ImageUploader onUpload={handleImageUpload} />

      <Button type="submit" loading={loading}>
        {formData.id ? 'Actualizar' : 'Registrar'}
      </Button>
    </form>
  );
}
```

**Beneficios:**
- ✅ Página 60 líneas
- ✅ Hook 100 líneas
- ✅ Componentes reutilizables
- ✅ Fácil de extender
- ✅ Testeable

---

## 🎯 Pasos para Migrar tu Componente

### Paso 1: Identificar Responsabilidades

1. Listar todas las acciones en el componente
2. Agrupar por responsabilidad
3. Decidir dónde va cada una

### Paso 2: Extraer Hooks

```jsx
// Si tienes lógica de carga + validación + actualización:
const useMyFeature = () => {
  // Toda la lógica aquí
};
```

### Paso 3: Separar Componentes

```
Component Monolítico
├── Formulario → FormComponent
├── Tabla → TableComponent
├── Modal → ModalComponent
└── Lógica → Hook
```

### Paso 4: Crear Servicios

```
useMyFeature (Hook)
├── myService.js (API calls)
└── api.js (HTTP config)
```

### Paso 5: Mover Estilos

```jsx
// Antes
style={{ background: '#20c997', borderRadius: '12px' }}

// Después
import { THEME } from '../config/theme';
style={{ background: THEME.primary.main, borderRadius: THEME.borderRadius.lg }}
```

---

## ✅ Checklist de Migración

Para cada componente migrado:

- [ ] Crear hook si tiene lógica
- [ ] Crear servicio si tiene API calls
- [ ] Separar en componentes menores
- [ ] Mover estilos a `config/theme`
- [ ] Mover textos a `constants/messages`
- [ ] Mover validación a `utils/validators`
- [ ] Usar PropTypes
- [ ] Documentar con JSDoc
- [ ] Testear manualmente
- [ ] Verificar no hay duplicación

---

**Última actualización:** 20 de noviembre de 2025
