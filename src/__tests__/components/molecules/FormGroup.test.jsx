import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { FormGroup } from '../../../components/molecules/FormGroup';

describe('FormGroup', () => {
  it('renderiza correctamente con props básicas', () => {
    render(
      <FormGroup
        label="Nombre"
        name="nombre"
        value=""
        onChange={() => {}}
      />
    );

    expect(screen.getByLabelText('Nombre')).toBeInTheDocument();
  });

  it('muestra asterisco cuando es requerido', () => {
    render(
      <FormGroup
        label="Email"
        name="email"
        value=""
        onChange={() => {}}
        required
      />
    );

    const label = screen.getByText(/Email/i);
    expect(label).toBeInTheDocument();
    expect(label.parentElement).toContainHTML('*');
  });

  it('muestra mensaje de error cuando hay error', () => {
    const errorMsg = 'Este campo es obligatorio';
    
    render(
      <FormGroup
        label="Teléfono"
        name="telefono"
        value=""
        onChange={() => {}}
        error={errorMsg}
      />
    );

    expect(screen.getByText(errorMsg)).toBeInTheDocument();
  });

  it('no muestra helper text cuando hay error', () => {
    const helperText = 'Texto de ayuda';
    const errorMsg = 'Error presente';
    
    render(
      <FormGroup
        label="Campo"
        name="campo"
        value=""
        onChange={() => {}}
        error={errorMsg}
        helperText={helperText}
      />
    );

    expect(screen.getByText(errorMsg)).toBeInTheDocument();
    expect(screen.queryByText(helperText)).not.toBeInTheDocument();
  });

  it('muestra helper text cuando no hay error', () => {
    const helperText = 'Formato: XXX-XXX-XXXX';
    
    render(
      <FormGroup
        label="Teléfono"
        name="telefono"
        value=""
        onChange={() => {}}
        helperText={helperText}
      />
    );

    expect(screen.getByText(helperText)).toBeInTheDocument();
  });

  it('llama a onChange cuando el usuario escribe', () => {
    const handleChange = vi.fn();
    
    render(
      <FormGroup
        label="Nombre"
        name="nombre"
        value=""
        onChange={handleChange}
      />
    );

    const input = screen.getByLabelText('Nombre');
    fireEvent.change(input, { target: { value: 'Juan' } });

    expect(handleChange).toHaveBeenCalled();
  });

  it('deshabilita el input cuando disabled es true', () => {
    render(
      <FormGroup
        label="Email"
        name="email"
        value=""
        onChange={() => {}}
        disabled
      />
    );

    const input = screen.getByLabelText('Email');
    expect(input).toBeDisabled();
  });

  it('aplica el placeholder correctamente', () => {
    const placeholder = 'Ingresa tu nombre';
    
    render(
      <FormGroup
        label="Nombre"
        name="nombre"
        value=""
        onChange={() => {}}
        placeholder={placeholder}
      />
    );

    expect(screen.getByPlaceholderText(placeholder)).toBeInTheDocument();
  });

  it('renderiza icono cuando se proporciona', () => {
    render(
      <FormGroup
        label="Email"
        name="email"
        value=""
        onChange={() => {}}
        icon={<span data-testid="email-icon">📧</span>}
      />
    );

    expect(screen.getByTestId('email-icon')).toBeInTheDocument();
  });

  it('muestra el valor correctamente', () => {
    render(
      <FormGroup
        label="Nombre"
        name="nombre"
        value="Leonardo"
        onChange={() => {}}
      />
    );

    const input = screen.getByLabelText('Nombre');
    expect(input).toHaveValue('Leonardo');
  });
});
