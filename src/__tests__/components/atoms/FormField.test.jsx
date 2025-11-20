import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { FormField } from "../../../components/atoms/FormField";

describe("FormField Component", () => {
  it("debería renderizar con la etiqueta correcta", () => {
    render(
      <FormField label="Email" name="email" value="" onChange={() => {}} />
    );
    expect(screen.getByText("Email")).toBeInTheDocument();
  });

  it("debería renderizar el input con el tipo correcto", () => {
    render(
      <FormField
        type="email"
        name="email"
        value=""
        onChange={() => {}}
      />
    );
    const input = screen.getByRole("textbox");
    expect(input).toHaveAttribute("type", "email");
  });

  it("debería mostrar el placeholder", () => {
    render(
      <FormField
        name="email"
        value=""
        onChange={() => {}}
        placeholder="test@ejemplo.com"
      />
    );
    expect(screen.getByPlaceholderText("test@ejemplo.com")).toBeInTheDocument();
  });

  it("debería llamar onChange cuando el usuario escribe", async () => {
    const handleChange = vi.fn();
    render(
      <FormField
        name="email"
        value=""
        onChange={handleChange}
      />
    );

    const input = screen.getByRole("textbox");
    await userEvent.type(input, "test@ejemplo.com");

    expect(handleChange).toHaveBeenCalled();
  });

  it("debería mostrar mensaje de error cuando error está presente", () => {
    render(
      <FormField
        name="email"
        value=""
        onChange={() => {}}
        error="El email es inválido"
      />
    );
    expect(screen.getByText("El email es inválido")).toBeInTheDocument();
  });

  it("debería marcar como requerido", () => {
    render(
      <FormField
        label="Email"
        name="email"
        value=""
        onChange={() => {}}
        required
      />
    );
    const label = screen.getByText("Email");
    expect(label.innerHTML).toContain("*");
  });

  it("debería deshabilitar el input cuando disabled=true", () => {
    render(
      <FormField
        name="email"
        value=""
        onChange={() => {}}
        disabled
      />
    );
    expect(screen.getByRole("textbox")).toBeDisabled();
  });

  it("debería renderizar icono cuando se proporciona", () => {
    const { container } = render(
      <FormField
        name="email"
        value=""
        onChange={() => {}}
        icon="fas fa-envelope"
      />
    );
    const icon = container.querySelector("i.fas.fa-envelope");
    expect(icon).toBeInTheDocument();
  });
});
