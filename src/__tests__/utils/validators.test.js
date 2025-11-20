import { describe, it, expect } from "vitest";
import {
  validarEmail,
  validarDNI,
  validarTelefono,
  validarContraseña
} from "../../utils/validators";

describe("Validators Utilities", () => {
  describe("validarEmail", () => {
    it("debería validar emails correctos", () => {
      expect(validarEmail("test@ejemplo.com")).toBe(true);
      expect(validarEmail("usuario@dominio.co.uk")).toBe(true);
      expect(validarEmail("correo+tag@example.com")).toBe(true);
    });

    it("debería rechazar emails incorrectos", () => {
      expect(validarEmail("invalido")).toBe(false);
      expect(validarEmail("@ejemplo.com")).toBe(false);
      expect(validarEmail("test@")).toBe(false);
      expect(validarEmail("")).toBe(false);
    });
  });

  describe("validarDNI", () => {
    it("debería validar DNI con formato correcto", () => {
      expect(validarDNI("12345678")).toBe(true);
      expect(validarDNI("98765432")).toBe(true);
    });

    it("debería rechazar DNI inválido", () => {
      expect(validarDNI("1234567")).toBe(false);
      expect(validarDNI("123456789")).toBe(false);
      expect(validarDNI("")).toBe(false);
      expect(validarDNI("ABCDEFGH")).toBe(false);
    });
  });

  describe("validarTelefono", () => {
    it("debería validar teléfonos correctos", () => {
      expect(validarTelefono("600000000")).toBe(true);
      expect(validarTelefono("911234567")).toBe(true);
      expect(validarTelefono("123456789")).toBe(true);
    });

    it("debería rechazar teléfonos incorrectos", () => {
      expect(validarTelefono("123")).toBe(false);
      expect(validarTelefono("+34600000000")).toBe(false); // Tiene caracteres no dígitos
      expect(validarTelefono("abcdefghij")).toBe(false);
      expect(validarTelefono("")).toBe(false);
    });
  });

  describe("validarContraseña", () => {
    it("debería validar contraseñas seguras", () => {
      expect(validarContraseña("password")).toBe(true);
      expect(validarContraseña("123456")).toBe(true); // 6+ caracteres
      expect(validarContraseña("Mi1234")).toBe(true);
    });

    it("debería rechazar contraseñas débiles", () => {
      expect(validarContraseña("Pass")).toBe(false); // Menos de 6
      expect(validarContraseña("12345")).toBe(false); // Menos de 6
      expect(validarContraseña("")).toBe(false);
      expect(validarContraseña("a")).toBe(false);
    });
  });
});
