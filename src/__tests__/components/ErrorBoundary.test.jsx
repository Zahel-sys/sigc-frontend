import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeAll, afterAll } from 'vitest';
import ErrorBoundary from '../../../components/ErrorBoundary';

// Componente de prueba que lanza un error
const ThrowError = ({ shouldThrow }) => {
  if (shouldThrow) {
    throw new Error('Error de prueba');
  }
  return <div>Componente sin errores</div>;
};

describe('ErrorBoundary', () => {
  // Suprimir errores de consola durante las pruebas
  const originalError = console.error;
  beforeAll(() => {
    console.error = vi.fn();
  });
  
  afterAll(() => {
    console.error = originalError;
  });

  it('renderiza children cuando no hay errores', () => {
    render(
      <ErrorBoundary>
        <div>Contenido normal</div>
      </ErrorBoundary>
    );
    
    expect(screen.getByText('Contenido normal')).toBeInTheDocument();
  });

  it('muestra UI de error cuando un hijo lanza un error', () => {
    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );
    
    expect(screen.getByText('Algo salió mal')).toBeInTheDocument();
    expect(screen.getByText(/ha ocurrido un error inesperado/i)).toBeInTheDocument();
  });

  it('muestra botón "Intentar de nuevo"', () => {
    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );
    
    expect(screen.getByText('Intentar de nuevo')).toBeInTheDocument();
  });

  it('muestra botón "Recargar página"', () => {
    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );
    
    expect(screen.getByText('Recargar página')).toBeInTheDocument();
  });

  it('muestra icono de advertencia', () => {
    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );
    
    expect(screen.getByText('⚠️')).toBeInTheDocument();
  });

  it('muestra detalles del error en desarrollo', () => {
    // Simular entorno de desarrollo
    const originalEnv = import.meta.env.VITE_ENV;
    import.meta.env.VITE_ENV = 'development';
    
    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );
    
    expect(screen.getByText(/Detalles del error/i)).toBeInTheDocument();
    
    // Restaurar entorno
    import.meta.env.VITE_ENV = originalEnv;
  });

  it('reinicia el error cuando se hace click en "Intentar de nuevo"', () => {
    const { rerender } = render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );
    
    expect(screen.getByText('Algo salió mal')).toBeInTheDocument();
    
    const resetButton = screen.getByText('Intentar de nuevo');
    fireEvent.click(resetButton);
    
    // Después del reset, debería intentar renderizar children de nuevo
    rerender(
      <ErrorBoundary>
        <ThrowError shouldThrow={false} />
      </ErrorBoundary>
    );
    
    expect(screen.getByText('Componente sin errores')).toBeInTheDocument();
  });

  it('muestra mensaje de soporte en el footer', () => {
    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );
    
    expect(screen.getByText(/contacta al soporte técnico/i)).toBeInTheDocument();
  });

  it('captura múltiples tipos de errores', () => {
    const ThrowTypeError = () => {
      throw new TypeError('TypeError de prueba');
    };
    
    render(
      <ErrorBoundary>
        <ThrowTypeError />
      </ErrorBoundary>
    );
    
    expect(screen.getByText('Algo salió mal')).toBeInTheDocument();
  });

  it('captura errores en componentes anidados', () => {
    const Parent = () => (
      <div>
        <ThrowError shouldThrow={true} />
      </div>
    );
    
    render(
      <ErrorBoundary>
        <Parent />
      </ErrorBoundary>
    );
    
    expect(screen.getByText('Algo salió mal')).toBeInTheDocument();
  });

  it('no interfiere con la renderización normal de múltiples children', () => {
    render(
      <ErrorBoundary>
        <div>Child 1</div>
        <div>Child 2</div>
        <div>Child 3</div>
      </ErrorBoundary>
    );
    
    expect(screen.getByText('Child 1')).toBeInTheDocument();
    expect(screen.getByText('Child 2')).toBeInTheDocument();
    expect(screen.getByText('Child 3')).toBeInTheDocument();
  });
});
