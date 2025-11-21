import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { SearchBar } from '../../../components/molecules/SearchBar';

describe('SearchBar', () => {
  it('renderiza correctamente', () => {
    render(<SearchBar onSearch={() => {}} />);
    
    expect(screen.getByPlaceholderText('Buscar...')).toBeInTheDocument();
    expect(screen.getByText('Buscar')).toBeInTheDocument();
  });

  it('usa placeholder personalizado', () => {
    const placeholder = 'Buscar doctores...';
    render(<SearchBar onSearch={() => {}} placeholder={placeholder} />);
    
    expect(screen.getByPlaceholderText(placeholder)).toBeInTheDocument();
  });

  it('llama a onSearch cuando se hace click en el botón', () => {
    const handleSearch = vi.fn();
    render(<SearchBar onSearch={handleSearch} />);
    
    const input = screen.getByPlaceholderText('Buscar...');
    const button = screen.getByText('Buscar');
    
    fireEvent.change(input, { target: { value: 'test' } });
    fireEvent.click(button);
    
    expect(handleSearch).toHaveBeenCalledWith('test');
  });

  it('llama a onSearch cuando se presiona Enter', () => {
    const handleSearch = vi.fn();
    render(<SearchBar onSearch={handleSearch} />);
    
    const input = screen.getByPlaceholderText('Buscar...');
    
    fireEvent.change(input, { target: { value: 'busqueda' } });
    fireEvent.keyPress(input, { key: 'Enter', code: 'Enter', charCode: 13 });
    
    expect(handleSearch).toHaveBeenCalledWith('busqueda');
  });

  it('llama a onChange cuando el usuario escribe', () => {
    const handleChange = vi.fn();
    render(<SearchBar onSearch={() => {}} onChange={handleChange} />);
    
    const input = screen.getByPlaceholderText('Buscar...');
    fireEvent.change(input, { target: { value: 'abc' } });
    
    expect(handleChange).toHaveBeenCalledWith('abc');
  });

  it('muestra botón de limpiar cuando hay texto', () => {
    render(<SearchBar onSearch={() => {}} />);
    
    const input = screen.getByPlaceholderText('Buscar...');
    
    // No debe haber botón de limpiar inicialmente
    expect(screen.queryByLabelText('Limpiar búsqueda')).not.toBeInTheDocument();
    
    // Escribir texto
    fireEvent.change(input, { target: { value: 'test' } });
    
    // Ahora debe aparecer el botón de limpiar
    expect(screen.getByLabelText('Limpiar búsqueda')).toBeInTheDocument();
  });

  it('limpia el input cuando se hace click en el botón de limpiar', () => {
    const handleSearch = vi.fn();
    render(<SearchBar onSearch={handleSearch} />);
    
    const input = screen.getByPlaceholderText('Buscar...');
    
    // Escribir texto
    fireEvent.change(input, { target: { value: 'test' } });
    expect(input).toHaveValue('test');
    
    // Limpiar
    const clearButton = screen.getByLabelText('Limpiar búsqueda');
    fireEvent.click(clearButton);
    
    expect(input).toHaveValue('');
    expect(handleSearch).toHaveBeenCalledWith('');
  });

  it('deshabilita controles cuando loading es true', () => {
    render(<SearchBar onSearch={() => {}} loading />);
    
    const input = screen.getByPlaceholderText('Buscar...');
    const button = screen.getByText('Buscar');
    
    expect(input).toBeDisabled();
    expect(button).toBeDisabled();
  });

  it('deshabilita botón cuando no hay texto', () => {
    render(<SearchBar onSearch={() => {}} />);
    
    const button = screen.getByText('Buscar');
    expect(button).toBeDisabled();
  });

  it('usa buttonText personalizado', () => {
    render(<SearchBar onSearch={() => {}} buttonText="Filtrar" />);
    
    expect(screen.getByText('Filtrar')).toBeInTheDocument();
  });

  it('usa icono personalizado', () => {
    render(<SearchBar onSearch={() => {}} icon="🎯" />);
    
    expect(screen.getByText('🎯')).toBeInTheDocument();
  });

  it('establece valor inicial correctamente', () => {
    render(<SearchBar onSearch={() => {}} initialValue="inicial" />);
    
    const input = screen.getByPlaceholderText('Buscar...');
    expect(input).toHaveValue('inicial');
  });
});
