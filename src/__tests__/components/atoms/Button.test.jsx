import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Button } from "../../../components/atoms/Button";

describe("Button Component", () => {
  it("debería renderizar con el texto correcto", () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText("Click me")).toBeInTheDocument();
  });

  it("debería llamar onClick cuando se hace click", async () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click me</Button>);

    await userEvent.click(screen.getByText("Click me"));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("debería estar deshabilitado cuando disabled=true", () => {
    render(<Button disabled>Click me</Button>);
    expect(screen.getByText("Click me")).toBeDisabled();
  });

  it("debería mostrar loading spinner cuando loading=true", () => {
    render(<Button loading>Click me</Button>);
    const spinner = screen.getByRole("status");
    expect(spinner).toBeInTheDocument();
    expect(spinner).toHaveClass("spinner-border");
  });

  it("no debería hacer click cuando está loading", async () => {
    const handleClick = vi.fn();
    render(
      <Button loading onClick={handleClick}>
        Click me
      </Button>
    );

    const button = screen.getByRole("button");
    await userEvent.click(button);
    expect(handleClick).not.toHaveBeenCalled();
  });

  it("debería renderizar con fullWidth cuando fullWidth=true", () => {
    const { container } = render(<Button fullWidth>Click me</Button>);
    const button = container.querySelector("button");
    expect(button.style.width).toBe("100%");
  });

  it("debería renderizar con icono", () => {
    const { container } = render(
      <Button icon="fas fa-save">Guardar</Button>
    );
    const icon = container.querySelector("i.fas.fa-save");
    expect(icon).toBeInTheDocument();
  });

  it("debería renderizar con diferentes variantes", () => {
    const { rerender } = render(
      <Button variant="primary">Primary</Button>
    );
    expect(screen.getByText("Primary")).toBeInTheDocument();

    rerender(<Button variant="danger">Danger</Button>);
    expect(screen.getByText("Danger")).toBeInTheDocument();
  });

  it("debería renderizar con diferentes tamaños", () => {
    const { rerender } = render(<Button size="sm">Small</Button>);
    expect(screen.getByText("Small")).toBeInTheDocument();

    rerender(<Button size="lg">Large</Button>);
    expect(screen.getByText("Large")).toBeInTheDocument();
  });
});
