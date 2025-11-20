import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Badge } from "../../../components/atoms/Badge";

describe("Badge Component", () => {
  it("debería renderizar el contenido", () => {
    render(<Badge>Activo</Badge>);
    expect(screen.getByText("Activo")).toBeInTheDocument();
  });

  it("debería renderizar con variante default", () => {
    render(<Badge variant="default">Default</Badge>);
    expect(screen.getByText("Default")).toBeInTheDocument();
  });

  it("debería renderizar con variante primary", () => {
    render(<Badge variant="primary">Primary</Badge>);
    expect(screen.getByText("Primary")).toBeInTheDocument();
  });

  it("debería renderizar con variante success", () => {
    render(<Badge variant="success">Success</Badge>);
    expect(screen.getByText("Success")).toBeInTheDocument();
  });

  it("debería renderizar con variante danger", () => {
    render(<Badge variant="danger">Danger</Badge>);
    expect(screen.getByText("Danger")).toBeInTheDocument();
  });

  it("debería renderizar con variante warning", () => {
    render(<Badge variant="warning">Warning</Badge>);
    expect(screen.getByText("Warning")).toBeInTheDocument();
  });

  it("debería renderizar con icono", () => {
    const { container } = render(
      <Badge icon="fas fa-check">Completado</Badge>
    );
    const icon = container.querySelector("i.fas.fa-check");
    expect(icon).toBeInTheDocument();
  });

  it("debería renderizar icono y contenido juntos", () => {
    const { container } = render(
      <Badge icon="fas fa-check">Completado</Badge>
    );
    expect(screen.getByText("Completado")).toBeInTheDocument();
    const icon = container.querySelector("i.fas.fa-check");
    expect(icon).toBeInTheDocument();
  });

  it("debería renderizar con todas las variantes", () => {
    const variants = [
      "default",
      "primary",
      "secondary",
      "success",
      "danger",
      "warning",
      "info"
    ];

    variants.forEach((variant) => {
      const { unmount } = render(
        <Badge variant={variant}>{variant}</Badge>
      );
      expect(screen.getByText(variant)).toBeInTheDocument();
      unmount();
    });
  });
});
