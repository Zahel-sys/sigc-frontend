import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Card } from "../../../components/atoms/Card";

describe("Card Component", () => {
  it("debería renderizar el contenido", () => {
    render(<Card>Mi contenido</Card>);
    expect(screen.getByText("Mi contenido")).toBeInTheDocument();
  });

  it("debería renderizar el título", () => {
    render(<Card title="Mi Título">Contenido</Card>);
    expect(screen.getByText("Mi Título")).toBeInTheDocument();
  });

  it("debería renderizar el footer", () => {
    render(<Card footer="Mi Footer">Contenido</Card>);
    expect(screen.getByText("Mi Footer")).toBeInTheDocument();
  });

  it("debería renderizar con icono", () => {
    const { container } = render(
      <Card title="Título" icon="fas fa-info-circle">
        Contenido
      </Card>
    );
    const icon = container.querySelector("i.fas.fa-info-circle");
    expect(icon).toBeInTheDocument();
  });

  it("debería llamar onClick cuando se hace click", async () => {
    const handleClick = vi.fn();
    render(
      <Card onClick={handleClick}>
        Click me
      </Card>
    );

    await userEvent.click(screen.getByText("Click me").closest("div"));
    expect(handleClick).toHaveBeenCalled();
  });

  it("debería tener el cursor como pointer cuando es clickeable", () => {
    const handleClick = vi.fn();
    const { container } = render(
      <Card onClick={handleClick}>
        Contenido
      </Card>
    );

    const cardDiv = container.querySelector("div");
    expect(cardDiv.style.cursor).toBe("pointer");
  });

  it("debería renderizar con diferentes variantes", () => {
    const { rerender } = render(
      <Card variant="default">Default</Card>
    );
    expect(screen.getByText("Default")).toBeInTheDocument();

    rerender(<Card variant="primary">Primary</Card>);
    expect(screen.getByText("Primary")).toBeInTheDocument();

    rerender(<Card variant="secondary">Secondary</Card>);
    expect(screen.getByText("Secondary")).toBeInTheDocument();
  });

  it("debería ser hoverable", () => {
    const { container } = render(
      <Card hoverable>Contenido</Card>
    );
    const cardDiv = container.querySelector("div");
    expect(cardDiv.style.cursor).toBe("pointer");
  });

  it("debería renderizar tanto título como footer", () => {
    render(
      <Card title="Título" footer="Footer">
        Contenido
      </Card>
    );
    expect(screen.getByText("Título")).toBeInTheDocument();
    expect(screen.getByText("Contenido")).toBeInTheDocument();
    expect(screen.getByText("Footer")).toBeInTheDocument();
  });
});
