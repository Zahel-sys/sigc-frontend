import { describe, it, expect } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useFormData } from "../../hooks/useFormData";

describe("useFormData Hook", () => {
  it("debería inicializar con los valores por defecto", () => {
    const initialValues = { email: "", password: "" };
    const { result } = renderHook(() => useFormData(initialValues));

    expect(result.current.formData).toEqual(initialValues);
  });

  it("debería actualizar el formData cuando cambia un campo", () => {
    const { result } = renderHook(() =>
      useFormData({ email: "", password: "" })
    );

    act(() => {
      result.current.handleChange({
        target: { name: "email", value: "test@ejemplo.com" }
      });
    });

    expect(result.current.formData.email).toBe("test@ejemplo.com");
  });

  it("debería resetear los valores al llamar reset()", () => {
    const initialValues = { email: "", password: "" };
    const { result } = renderHook(() => useFormData(initialValues));

    act(() => {
      result.current.handleChange({
        target: { name: "email", value: "test@ejemplo.com" }
      });
    });

    expect(result.current.formData.email).toBe("test@ejemplo.com");

    act(() => {
      result.current.reset();
    });

    expect(result.current.formData).toEqual(initialValues);
  });

  it("debería manejar múltiples campos correctamente", () => {
    const initialValues = {
      nombre: "",
      email: "",
      telefono: ""
    };
    const { result } = renderHook(() => useFormData(initialValues));

    act(() => {
      result.current.handleChange({
        target: { name: "nombre", value: "Juan" }
      });
      result.current.handleChange({
        target: { name: "email", value: "juan@ejemplo.com" }
      });
      result.current.handleChange({
        target: { name: "telefono", value: "600000000" }
      });
    });

    expect(result.current.formData).toEqual({
      nombre: "Juan",
      email: "juan@ejemplo.com",
      telefono: "600000000"
    });
  });

  it("debería actualizar múltiples campos con updateFields", () => {
    const { result } = renderHook(() =>
      useFormData({ email: "", password: "" })
    );

    act(() => {
      result.current.updateFields({
        email: "test@ejemplo.com",
        password: "123456"
      });
    });

    expect(result.current.formData).toEqual({
      email: "test@ejemplo.com",
      password: "123456"
    });
  });
});
