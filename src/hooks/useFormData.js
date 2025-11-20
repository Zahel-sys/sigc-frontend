/**
 * Hook personalizado: useFormData
 * Manejo centralizado de estados de formulario (SRP)
 * Evita tener múltiples useState en componentes
 */

import { useState, useCallback } from 'react';

export const useFormData = (initialData = {}) => {
  const [formData, setFormData] = useState(initialData);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  // Actualizar un campo específico
  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  }, []);

  // Actualizar múltiples campos
  const updateFields = useCallback((fields) => {
    setFormData(prev => ({
      ...prev,
      ...fields,
    }));
  }, []);

  // Marcar campo como tocado
  const handleBlur = useCallback((e) => {
    const { name } = e.target;
    setTouched(prev => ({
      ...prev,
      [name]: true,
    }));
  }, []);

  // Establecer errores
  const setFieldError = useCallback((fieldName, errorMessage) => {
    setErrors(prev => ({
      ...prev,
      [fieldName]: errorMessage,
    }));
  }, []);

  // Limpiar un campo
  const clearField = useCallback((fieldName) => {
    setFormData(prev => ({
      ...prev,
      [fieldName]: '',
    }));
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[fieldName];
      return newErrors;
    });
  }, []);

  // Resetear el formulario
  const reset = useCallback(() => {
    setFormData(initialData);
    setErrors({});
    setTouched({});
  }, [initialData]);

  return {
    formData,
    errors,
    touched,
    handleChange,
    handleBlur,
    updateFields,
    setFieldError,
    clearField,
    reset,
  };
};

export default useFormData;
