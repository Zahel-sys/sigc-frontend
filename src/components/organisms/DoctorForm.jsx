import React, { useState } from "react";
import { FormGroup } from "../molecules/FormGroup";
import { Button } from "../atoms/Button";
import { THEME } from "../../config/theme";

/**
 * DoctorForm - Componente organism para formulario de doctor
 * Combina: Múltiples FormGroup + Button + Lógica de validación
 * 
 * ACTUALIZADO: Nueva estructura de doctores (21/11/2025)
 * - Agregado: apellido, telefono, correo
 * - Cambiado: especialidadId (ID numérico, no string)
 * - Eliminado: cupoPacientes
 * 
 * @param {Object} initialData - Datos iniciales del formulario
 * @param {Array} especialidades - Lista de especialidades disponibles
 * @param {Function} onSubmit - Callback al enviar (recibe formData)
 * @param {Function} onCancel - Callback al cancelar
 * @param {boolean} isEditing - Modo edición
 * @param {boolean} loading - Estado de carga
 */
export function DoctorForm({
  initialData = {
    nombre: "",
    apellido: "",
    telefono: "",
    correo: "",
    especialidadId: "",
    imagen: null,
  },
  especialidades = [],
  onSubmit,
  onCancel,
  isEditing = false,
  loading = false,
}) {
  const [formData, setFormData] = useState(initialData);
  const [errors, setErrors] = useState({});

  // Handlers
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    // Limpiar error del campo
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setFormData((prev) => ({ ...prev, imagen: file }));
    
    if (errors.imagen) {
      setErrors((prev) => ({ ...prev, imagen: "" }));
    }
  };

  // Validaciones
  const validate = () => {
    const newErrors = {};

    // Validar nombre
    if (!formData.nombre.trim()) {
      newErrors.nombre = "El nombre es obligatorio";
    } else if (formData.nombre.trim().length < 2) {
      newErrors.nombre = "El nombre debe tener al menos 2 caracteres";
    } else if (formData.nombre.trim().length > 100) {
      newErrors.nombre = "El nombre no puede superar 100 caracteres";
    }

    // Validar apellido
    if (!formData.apellido.trim()) {
      newErrors.apellido = "El apellido es obligatorio";
    } else if (formData.apellido.trim().length < 2) {
      newErrors.apellido = "El apellido debe tener al menos 2 caracteres";
    } else if (formData.apellido.trim().length > 100) {
      newErrors.apellido = "El apellido no puede superar 100 caracteres";
    }

    // Validar teléfono
    if (!formData.telefono.trim()) {
      newErrors.telefono = "El teléfono es obligatorio";
    } else if (formData.telefono.trim().length > 20) {
      newErrors.telefono = "El teléfono no puede superar 20 caracteres";
    } else {
      const telefonoRegex = /^[0-9+\-\s()]+$/;
      if (!telefonoRegex.test(formData.telefono.trim())) {
        newErrors.telefono = "Teléfono inválido (solo números, +, -, espacios, paréntesis)";
      }
    }

    // Validar correo
    if (!formData.correo.trim()) {
      newErrors.correo = "El correo es obligatorio";
    } else if (formData.correo.trim().length > 100) {
      newErrors.correo = "El correo no puede superar 100 caracteres";
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.correo.trim())) {
        newErrors.correo = "Correo electrónico inválido";
      }
    }

    // Validar especialidad
    if (!formData.especialidadId) {
      newErrors.especialidadId = "Debes seleccionar una especialidad";
    }

    // Validar imagen solo si es nueva (no en edición)
    if (!isEditing && formData.imagen) {
      const validTypes = ["image/jpeg", "image/png", "image/jpg", "image/webp"];
      if (!validTypes.includes(formData.imagen.type)) {
        newErrors.imagen = "Formato inválido. Usa JPG, PNG o WEBP";
      }
      
      // Máximo 5MB
      if (formData.imagen.size > 5 * 1024 * 1024) {
        newErrors.imagen = "La imagen no debe superar 5MB";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    if (onSubmit) {
      onSubmit(formData);
    }
  };

  const handleCancelClick = () => {
    setFormData(initialData);
    setErrors({});
    
    if (onCancel) {
      onCancel();
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        background: "white",
        padding: "2rem",
        borderRadius: THEME.borderRadius.lg,
        boxShadow: THEME.shadows.md,
        marginBottom: "2rem",
      }}
    >
      {/* Header */}
      <div style={{ marginBottom: "2rem" }}>
        <h2
          style={{
            margin: 0,
            color: THEME.primary.main,
            fontSize: "1.5rem",
            fontWeight: "700",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
          }}
        >
          <span>{isEditing ? "✏️" : "➕"}</span>
          {isEditing ? "Editar Doctor" : "Nuevo Doctor"}
        </h2>
        <p
          style={{
            margin: "0.5rem 0 0 0",
            color: THEME.text.secondary,
            fontSize: "0.95rem",
          }}
        >
          {isEditing
            ? "Modifica la información del doctor"
            : "Completa los datos para registrar un nuevo doctor"}
        </p>
      </div>

      {/* Campos del formulario */}
      <div style={{ display: "grid", gap: "1rem" }}>
        {/* Nombre */}
        <FormGroup
          label="Nombre"
          name="nombre"
          type="text"
          value={formData.nombre}
          onChange={handleChange}
          error={errors.nombre}
          required
          placeholder="Ej: Ricardo"
          icon="👨‍⚕️"
          disabled={loading}
          maxLength={100}
        />

        {/* Apellido */}
        <FormGroup
          label="Apellido"
          name="apellido"
          type="text"
          value={formData.apellido}
          onChange={handleChange}
          error={errors.apellido}
          required
          placeholder="Ej: López García"
          icon="👤"
          disabled={loading}
          maxLength={100}
        />

        {/* Teléfono */}
        <FormGroup
          label="Teléfono"
          name="telefono"
          type="tel"
          value={formData.telefono}
          onChange={handleChange}
          error={errors.telefono}
          required
          placeholder="Ej: 555-1234"
          icon="📞"
          disabled={loading}
          maxLength={20}
        />

        {/* Correo */}
        <FormGroup
          label="Correo Electrónico"
          name="correo"
          type="email"
          value={formData.correo}
          onChange={handleChange}
          error={errors.correo}
          required
          placeholder="Ej: ricardo.lopez@sigc.com"
          icon="📧"
          disabled={loading}
          maxLength={100}
        />

        {/* Especialidad */}
        <div>
          <label
            style={{
              display: "block",
              marginBottom: "0.5rem",
              fontWeight: "600",
              color: errors.especialidadId ? THEME.danger.main : THEME.text.primary,
              fontSize: "0.95rem",
            }}
          >
            Especialidad <span style={{ color: THEME.danger.main }}>*</span>
          </label>

          <select
            name="especialidadId"
            value={formData.especialidadId}
            onChange={handleChange}
            disabled={loading}
            style={{
              width: "100%",
              padding: "0.75rem 1rem",
              borderRadius: THEME.borderRadius.md,
              border: `2px solid ${
                errors.especialidadId ? THEME.danger.main : THEME.border.light
              }`,
              fontSize: "1rem",
              color: THEME.text.primary,
              background: "white",
              cursor: loading ? "not-allowed" : "pointer",
            }}
          >
            <option value="">Seleccione una especialidad</option>
            {especialidades.map((esp) => (
              <option key={esp.idEspecialidad} value={esp.idEspecialidad}>
                {esp.nombre}
              </option>
            ))}
          </select>

          {errors.especialidadId && (
            <div
              style={{
                marginTop: "0.5rem",
                color: THEME.danger.main,
                fontSize: "0.875rem",
                display: "flex",
                alignItems: "center",
                gap: "0.25rem",
              }}
            >
              <span>⚠️</span>
              <span>{errors.especialidadId}</span>
            </div>
          )}
        </div>

        {/* Imagen */}
        <div>
          <label
            style={{
              display: "block",
              marginBottom: "0.5rem",
              fontWeight: "600",
              color: errors.imagen ? THEME.danger.main : THEME.text.primary,
              fontSize: "0.95rem",
            }}
          >
            Foto del Doctor {!isEditing && <span style={{ fontSize: "0.85rem", color: THEME.text.secondary }}>(Opcional)</span>}
          </label>

          <input
            type="file"
            accept="image/jpeg,image/png,image/jpg,image/webp"
            onChange={handleImageChange}
            disabled={loading}
            style={{
              width: "100%",
              padding: "0.75rem 1rem",
              borderRadius: THEME.borderRadius.md,
              border: `2px solid ${
                errors.imagen ? THEME.danger.main : THEME.border.light
              }`,
              fontSize: "1rem",
              cursor: loading ? "not-allowed" : "pointer",
            }}
          />

          {errors.imagen && (
            <div
              style={{
                marginTop: "0.5rem",
                color: THEME.danger.main,
                fontSize: "0.875rem",
                display: "flex",
                alignItems: "center",
                gap: "0.25rem",
              }}
            >
              <span>⚠️</span>
              <span>{errors.imagen}</span>
            </div>
          )}

          {!errors.imagen && (
            <div
              style={{
                marginTop: "0.5rem",
                color: THEME.text.secondary,
                fontSize: "0.875rem",
              }}
            >
              Formatos: JPG, PNG, WEBP. Tamaño máximo: 5MB
            </div>
          )}
        </div>
      </div>

      {/* Botones */}
      <div
        style={{
          display: "flex",
          gap: "1rem",
          marginTop: "2rem",
          justifyContent: "flex-end",
        }}
      >
        {(isEditing || onCancel) && (
          <Button
            type="button"
            variant="secondary"
            onClick={handleCancelClick}
            disabled={loading}
          >
            Cancelar
          </Button>
        )}

        <Button
          type="submit"
          variant={isEditing ? "warning" : "primary"}
          loading={loading}
          disabled={loading}
        >
          {isEditing ? "💾 Guardar Cambios" : "➕ Crear Doctor"}
        </Button>
      </div>
    </form>
  );
}
