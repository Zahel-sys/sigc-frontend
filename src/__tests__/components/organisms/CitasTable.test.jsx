import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { CitasTable } from '../../../components/organisms/CitasTable';

describe('CitasTable', () => {
  const mockCitas = [
    {
      id: 1,
      fecha: '2025-11-25',
      hora: '10:00',
      doctor: 'Dr. Juan Pérez',
      especialidad: 'Cardiología',
      paciente: 'María González',
      estado: 'PENDIENTE'
    },
    {
      id: 2,
      fecha: '2025-11-26',
      hora: '15:00',
      doctor: 'Dra. Ana López',
      especialidad: 'Dermatología',
      paciente: 'Pedro Ramírez',
      estado: 'CONFIRMADA'
    },
    {
      id: 3,
      fecha: '2025-11-27',
      hora: '09:00',
      doctor: 'Dr. Juan Pérez',
      especialidad: 'Cardiología',
      paciente: 'Luis Martínez',
      estado: 'CANCELADA'
    }
  ];

  it('renderiza todas las citas correctamente', () => {
    render(
      <CitasTable 
        citas={mockCitas}
        onConfirm={() => {}}
        onCancel={() => {}}
      />
    );
    
    expect(screen.getByText('Dr. Juan Pérez')).toBeInTheDocument();
    expect(screen.getByText('Dra. Ana López')).toBeInTheDocument();
    expect(screen.getByText('María González')).toBeInTheDocument();
  });

  it('muestra barra de búsqueda por defecto', () => {
    render(
      <CitasTable 
        citas={mockCitas}
        onConfirm={() => {}}
        onCancel={() => {}}
      />
    );
    
    expect(screen.getByPlaceholderText(/Buscar citas/i)).toBeInTheDocument();
  });

  it('oculta barra de búsqueda cuando showSearch es false', () => {
    render(
      <CitasTable 
        citas={mockCitas}
        onConfirm={() => {}}
        onCancel={() => {}}
        showSearch={false}
      />
    );
    
    expect(screen.queryByPlaceholderText(/Buscar citas/i)).not.toBeInTheDocument();
  });

  it('filtra citas por nombre de doctor', () => {
    render(
      <CitasTable 
        citas={mockCitas}
        onConfirm={() => {}}
        onCancel={() => {}}
      />
    );
    
    const searchInput = screen.getByPlaceholderText(/Buscar citas/i);
    fireEvent.change(searchInput, { target: { value: 'Ana López' } });
    
    expect(screen.getByText('Dra. Ana López')).toBeInTheDocument();
    expect(screen.queryByText('María González')).not.toBeInTheDocument();
  });

  it('filtra citas por especialidad', () => {
    render(
      <CitasTable 
        citas={mockCitas}
        onConfirm={() => {}}
        onCancel={() => {}}
      />
    );
    
    const searchInput = screen.getByPlaceholderText(/Buscar citas/i);
    fireEvent.change(searchInput, { target: { value: 'Dermatología' } });
    
    expect(screen.getByText('Dermatología')).toBeInTheDocument();
    expect(screen.queryByText('Cardiología')).not.toBeInTheDocument();
  });

  it('filtra citas por nombre de paciente', () => {
    render(
      <CitasTable 
        citas={mockCitas}
        onConfirm={() => {}}
        onCancel={() => {}}
      />
    );
    
    const searchInput = screen.getByPlaceholderText(/Buscar citas/i);
    fireEvent.change(searchInput, { target: { value: 'Pedro' } });
    
    expect(screen.getByText('Pedro Ramírez')).toBeInTheDocument();
    expect(screen.queryByText('María González')).not.toBeInTheDocument();
  });

  it('filtra citas por estado', () => {
    render(
      <CitasTable 
        citas={mockCitas}
        onConfirm={() => {}}
        onCancel={() => {}}
      />
    );
    
    const searchInput = screen.getByPlaceholderText(/Buscar citas/i);
    fireEvent.change(searchInput, { target: { value: 'CONFIRMADA' } });
    
    expect(screen.getByText('Pedro Ramírez')).toBeInTheDocument();
  });

  it('filtra citas por fecha', () => {
    render(
      <CitasTable 
        citas={mockCitas}
        onConfirm={() => {}}
        onCancel={() => {}}
      />
    );
    
    const searchInput = screen.getByPlaceholderText(/Buscar citas/i);
    fireEvent.change(searchInput, { target: { value: '2025-11-26' } });
    
    expect(screen.getByText('Dra. Ana López')).toBeInTheDocument();
  });

  it('muestra todas las citas cuando la búsqueda está vacía', () => {
    render(
      <CitasTable 
        citas={mockCitas}
        onConfirm={() => {}}
        onCancel={() => {}}
      />
    );
    
    const searchInput = screen.getByPlaceholderText(/Buscar citas/i);
    
    // Buscar algo
    fireEvent.change(searchInput, { target: { value: 'Ana' } });
    expect(screen.queryByText('María González')).not.toBeInTheDocument();
    
    // Limpiar búsqueda
    fireEvent.change(searchInput, { target: { value: '' } });
    expect(screen.getByText('María González')).toBeInTheDocument();
  });

  it('muestra contador de resultados', () => {
    render(
      <CitasTable 
        citas={mockCitas}
        onConfirm={() => {}}
        onCancel={() => {}}
      />
    );
    
    expect(screen.getByText(/3 citas encontradas/i)).toBeInTheDocument();
  });

  it('actualiza contador después de filtrar', () => {
    render(
      <CitasTable 
        citas={mockCitas}
        onConfirm={() => {}}
        onCancel={() => {}}
      />
    );
    
    const searchInput = screen.getByPlaceholderText(/Buscar citas/i);
    fireEvent.change(searchInput, { target: { value: 'Cardiología' } });
    
    expect(screen.getByText(/2 citas encontradas/i)).toBeInTheDocument();
  });

  it('muestra botones de acción por defecto', () => {
    render(
      <CitasTable 
        citas={mockCitas}
        onConfirm={() => {}}
        onCancel={() => {}}
        onView={() => {}}
      />
    );
    
    expect(screen.getAllByText(/Ver/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Confirmar/i).length).toBeGreaterThan(0);
  });

  it('oculta botones cuando showActions es false', () => {
    render(
      <CitasTable 
        citas={mockCitas}
        onConfirm={() => {}}
        onCancel={() => {}}
        showActions={false}
      />
    );
    
    expect(screen.queryByText(/Confirmar/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Cancelar/i)).not.toBeInTheDocument();
  });

  it('llama a onConfirm cuando se confirma una cita', () => {
    const handleConfirm = vi.fn();
    render(
      <CitasTable 
        citas={mockCitas}
        onConfirm={handleConfirm}
        onCancel={() => {}}
      />
    );
    
    const confirmButtons = screen.getAllByText(/Confirmar/i);
    fireEvent.click(confirmButtons[0]);
    
    expect(handleConfirm).toHaveBeenCalledWith(mockCitas[0]);
  });

  it('llama a onCancel cuando se cancela una cita', () => {
    const handleCancel = vi.fn();
    render(
      <CitasTable 
        citas={mockCitas}
        onConfirm={() => {}}
        onCancel={handleCancel}
      />
    );
    
    const cancelButtons = screen.getAllByText(/Cancelar/i);
    fireEvent.click(cancelButtons[0]);
    
    expect(handleCancel).toHaveBeenCalled();
  });

  it('llama a onView cuando se ve el detalle', () => {
    const handleView = vi.fn();
    render(
      <CitasTable 
        citas={mockCitas}
        onConfirm={() => {}}
        onCancel={() => {}}
        onView={handleView}
      />
    );
    
    const viewButtons = screen.getAllByText(/Ver/i);
    fireEvent.click(viewButtons[0]);
    
    expect(handleView).toHaveBeenCalledWith(mockCitas[0]);
  });

  it('muestra estado vacío cuando no hay citas', () => {
    render(
      <CitasTable 
        citas={[]}
        onConfirm={() => {}}
        onCancel={() => {}}
      />
    );
    
    expect(screen.getByText(/No hay citas disponibles/i)).toBeInTheDocument();
  });

  it('muestra estado vacío cuando la búsqueda no tiene resultados', () => {
    render(
      <CitasTable 
        citas={mockCitas}
        onConfirm={() => {}}
        onCancel={() => {}}
      />
    );
    
    const searchInput = screen.getByPlaceholderText(/Buscar citas/i);
    fireEvent.change(searchInput, { target: { value: 'NoExiste' } });
    
    expect(screen.getByText(/No se encontraron citas/i)).toBeInTheDocument();
  });

  it('muestra indicador de carga cuando loading es true', () => {
    render(
      <CitasTable 
        citas={mockCitas}
        onConfirm={() => {}}
        onCancel={() => {}}
        loading
      />
    );
    
    expect(screen.getByText(/Cargando/i)).toBeInTheDocument();
  });
});
